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

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  constructor(private blogsService: BlogsService) {}

  ngOnInit(): void {
    this.categories$ = this.blogsService.getCategories();
    this.selectedCategories$ = this.blogsService.returnSelectedCategories();

    this.blogsService.init();
    this.categories$.subscribe((val) => console.log(val));

    this.blogForm = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      description: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      image: new FormControl(null),
      author: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
        this.onlyTwoWords.bind(this),
        this.OnlyGeorgianLetters.bind(this),
      ]),
      publish_date: new FormControl(null, Validators.required),
      categories: new FormArray([], Validators.required),
      email: new FormControl(null, Validators.required),
    });
  }

  // Get each fromControl from the form to shorten the input for templates.
  get author(){
    return this.blogForm.get('author');
  }

  get title(){
    return this.blogForm.get('title');
  }

  get description(){
    return this.blogForm.get('description');
  }

  get image(){
    return this.blogForm.get('image');
  }

  get email(){
    return this.blogForm.get('email');
  }

  get date(){
    return this.blogForm.get('publish_date');
  }

  showOrHideCategories() {
    this.isShown = !this.isShown;
  }

  addCategory(id: number) {
    console.log(id);

    this.categories$.pipe(take(1)).subscribe((categories) => {
      const selectedCategory = categories.find(
        (category) => category.id === id
      ) as Category;

      const currentItems = this.blogsService.selectedCategories$.value;

      if (!currentItems.includes(selectedCategory)) {
        const updatedItems = [...currentItems, selectedCategory] as Category[];
        this.blogsService.selectedCategories$.next(updatedItems);
        this.onAddCategory(selectedCategory);
      }
    });
  }

  onAddCategory(category: Category) {
    const control = new FormControl(category.id);

    (<FormArray>this.blogForm.get('categories')).push(control);

    console.log((<FormArray>this.blogForm.get('categories')).value);
  }

  onRemoveCategory(id: number, category_id: number) {
    (<FormArray>this.blogForm.get('categories')).removeAt(id);

    const currentItems = this.blogsService.selectedCategories$.value;
    const updatedItems = currentItems.filter(
      (category) => category.id !== category_id
    );

    this.blogsService.selectedCategories$.next(updatedItems);
  }

  onSubmit() {
    const formData = new FormData();

    console.log('valid');

    formData.append('title', this.blogForm.get('title')?.value);
    formData.append('description', this.blogForm.get('description')?.value);
    formData.append('image', <File>this.selectedPhoto); // Assuming 'image' is a file input
    formData.append('author', this.blogForm.get('author')?.value);
    formData.append('publish_date', this.blogForm.get('publish_date')?.value);
    formData.append(
      'categories',
      JSON.stringify(this.blogForm.get('categories')?.value)
    );
    formData.append('email', this.blogForm.get('email')?.value);

    // this.blogsService.createBlog(formData).subscribe((res) => console.log(res));
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    this.selectedPhoto = file;
  }

  onDeletePhoto(){
    console.log('remove photo');
    this.blogForm?.patchValue({
      image: null
    })

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

  // Test for containing only two words.
  onlyTwoWords(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;

    // Return null if no control value was passed.
    if (!value) {
      return null;
    }

    // Use whitespace as the delimiter and split the input.
    const typedWords = value.trim().split(' ');

    // Check if there are more than two words.
    if (typedWords.length !== 2) {
      console.log('yes');
      return { manyWords: true };
    }
    console.log('no');

    return null;
  }
}
