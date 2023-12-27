import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category } from 'src/app/models/models.interface';
import { Observable, take } from 'rxjs';
import { BlogsService } from 'src/app/services/blogs.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent, RouterModule],
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.scss'],
})
export class CreateBlogComponent implements OnInit {
  blogForm!: FormGroup;

  // Hold the value for selected photo.
  selectedPhoto: File | null = null;

  // List of all categories.
  categories$!: Observable<Category[]>;

  // Show or hide categories list to choose from.
  isShown = false;

  // Selected categories
  selectedCategories$!: Observable<Category[]>;

  // Show loading spinner when the request gets sent.
  isLoading = false;

  // Conditionally show modal window.
  showModalWindow = false;

  // Conditionally display error, if a user uploads non-image file.
  showUploadError = false;

  constructor(private blogsService: BlogsService, private route: Router) {}

  ngOnInit(): void {
    const imgUrl = localStorage.getItem('selectedPhoto');

    if (imgUrl) {
      const defaultFilename = 'uploadedImage.png';

      const filename = localStorage.getItem('selectedPhotoFilename') || defaultFilename;
      this.selectedPhoto = this.dataURLtoFile(imgUrl, filename);
    }

    this.categories$ = this.blogsService.getCategories();
    this.selectedCategories$ = this.blogsService.returnSelectedCategories();

    this.blogsService.init();

    this.blogForm = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
      ]),
      image: new FormControl(null, Validators.required),
      author: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
        this.onlyTwoWords.bind(this),
        this.OnlyGeorgianLetters.bind(this),
      ]),
      publish_date: new FormControl(null, Validators.required),
      categories: new FormArray([], Validators.required),
      email: new FormControl('', Validators.compose([Validators.email, this.containsRequiredPart.bind(this)])),
    });

    this.loadFormValues();
    this.blogForm.valueChanges.subscribe(() => {
      this.saveToLocalStorage();
      console.log('called');
    });

  }

  // Get each fromControl from the form to shorten the input for templates.
  get author() {
    return this.blogForm.get('author');
  }

  get title() {
    return this.blogForm.get('title');
  }

  get description() {
    return this.blogForm.get('description');
  }

  get image() {
    return this.blogForm.get('image');
  }

  get email() {
    return this.blogForm.get('email');
  }

  get date() {
    return this.blogForm.get('publish_date');
  }

  get categories(){
    return this.blogForm.get('categories') as FormArray;
  }

  showOrHideCategories() {
    this.isShown = !this.isShown;
  }

  addCategory(category: Category) {
    const control = new FormControl(category);
    const formArrayControls = this.categories.controls;

    const isAlreadyAdded = formArrayControls.some(category => category.value.id === control.value?.id);

    if (!isAlreadyAdded) {
      this.categories.push(control);
  }
}

  onRemoveCategory(id: number) {
    (<FormArray>this.blogForm.get('categories')).removeAt(id);
  }

  onSubmit() {
    this.isLoading = true;

    const formData = new FormData();

    const categoriesID = this.categories.value.map((category: Category) => category.id);
    console.log(categoriesID);

    formData.append('title', this.title?.value);
    formData.append('description', this.description?.value);
    formData.append('image', <File>this.selectedPhoto);
    formData.append('author', this.author?.value);
    formData.append('publish_date', this.date?.value);
    formData.append(
      'categories',
      JSON.stringify(categoriesID)
    );
     // Send email control only if the value is not null.
     formData.append('email', this.email?.value);
    //  if(this.email?.value !== null) {
    // }

    this.blogsService.createBlog(formData).subscribe((res) => {
      console.log(res);
      this.isLoading = false;
      this.showModalWindow = true;

      this.clearFormAndStorage();
    });
  }

  clearFormAndStorage(){
    this.selectedPhoto = null;
    localStorage.removeItem('blogValues');
    localStorage.removeItem('selectedPhoto');
    localStorage.removeItem('selectedPhotoFilename');

    Object.keys(this.blogForm.controls).forEach(key => {
      const control = this.blogForm.get(key);

      if (control instanceof FormArray) {
        // Reset each control in the FormArray
        control.clear();
      } else {
        // For regular controls
        control?.setValue('');
        control?.setErrors(null);
        control?.markAsPristine();
        control?.markAsUntouched();

        if(key !== 'email'){
          control?.setErrors({ 'pending': true });
        }
      }
    });
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];

    // Take the first value that is the tyoe of the file.
    const fileType = file.type.split('/')[0];

    if(fileType === 'image'){
      this.showUploadError = false;
    this.selectedPhoto = file;

    const reader = new FileReader();

    reader.onload = () => {
      const imgUrl = reader.result as string;

      // Save the image URL to local storage
      localStorage.setItem('selectedPhoto', imgUrl);
      // Save the filename to local storage
      localStorage.setItem('selectedPhotoFilename', file.name);

      // Create the File object with the original filename
      this.selectedPhoto = this.dataURLtoFile(imgUrl, file.name);
    };

    reader.readAsDataURL(file);
    } else {
      this.showUploadError = true;
      this.blogForm.patchValue({
        image: null
      })
    }
  }

  private dataURLtoFile(dataURL: string, filename: string): File {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  onDeletePhoto() {
    // Delete IMG URL from the data storage.
    const imgUrl = localStorage.removeItem('selectedPhoto');

    this.blogForm?.patchValue({
      image: null,
    });

    this.selectedPhoto = null;
  }

  // Custom validations

  // Test for only Georgian words.
  OnlyGeorgianLetters(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;

    // Return null if no control value was passed.
    if (!value) {
      return null;
    }

    const georgianAlphabet = [
      'ა',
      'ბ',
      'გ',
      'დ',
      'ე',
      'ვ',
      'ზ',
      'თ',
      'ი',
      'კ',
      'ლ',
      'მ',
      'ნ',
      'ო',
      'პ',
      'ჟ',
      'რ',
      'ს',
      'ტ',
      'უ',
      'ფ',
      'ქ',
      'ღ',
      'ყ',
      'შ',
      'ც',
      'ძ',
      'წ',
      'ჭ',
      'ხ',
      'ჯ',
      'ჰ',
      ' ',
    ];

    // Create a regex for Georgian letters.
    const regex = new RegExp('^[' + georgianAlphabet.join('') + ']+$');

    if (!regex.test(value)) {
      return { notGeorgianLetters: true };
    }

    return null;
  }

  // Validation for containing two or more words.
  onlyTwoWords(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;

    // Return null if no control value was passed.
    if (!value) {
      return null;
    }

    // Use whitespace as the delimiter and split the input.
    const typedWords = value.trim().split(' ');

    // Check if there are less than two words.
    if (typedWords.length < 2) {
      return { manyWords: true };
    }

    return null;
  }

  showSpinner() {
    this.isLoading = !this.isLoading;
  }

  hideModal(){
    this.showModalWindow = false;
  }

  // Custom validator for email to check whether it ends with @redberry.ge
  containsRequiredPart(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;
    const emailPart = '@redberry.ge';

    if (!value) {
      return null;
    }

    const startIndex = value.length - emailPart.length;
    const domain = value.slice(startIndex).toLowerCase();

    if (domain === emailPart) {
      return null;
    } else {
      return { 'invalidEmailAddress': true };
    }
  }

  // Get data back from the Local storage.
  loadFormValues() {
    const savedValues = JSON.parse(<string>localStorage.getItem('blogValues'));

    this.blogForm.patchValue(savedValues);

    if(savedValues && !savedValues.categories.includes(null)){
      savedValues.categories.map((category: Category) => {
        const control = new FormControl(category);

        this.categories.push(control);
      })
    }

  }

  // Save values to local storage.
  saveToLocalStorage() {
    localStorage.setItem('blogValues', JSON.stringify(this.blogForm.value));

    console.log(JSON.parse(<string>localStorage.getItem('blogValues')));
  }

  redirectToBlogs(){
    this.route.navigate(['/blogs']);
    this.showModalWindow = false;
  }

}
