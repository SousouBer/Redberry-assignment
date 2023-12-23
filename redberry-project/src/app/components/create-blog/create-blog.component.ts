import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from 'src/app/models/models.interface';
import { Observable, take } from 'rxjs';
import { BlogsService } from 'src/app/services/blogs.service';

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.scss']
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

  constructor(private blogsService: BlogsService){}

  ngOnInit(): void {
    this.categories$ = this.blogsService.getCategories();
    this.selectedCategories$ = this.blogsService.returnSelectedCategories();

    this.blogsService.init();
    this.categories$.subscribe(val => console.log(val));

    this.blogForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      image: new FormControl(null, Validators.required),
      author: new FormControl(null, Validators.required),
      publish_date: new FormControl(null, Validators.required),
      categories: new FormArray([]),
      email: new FormControl(null, Validators.required)
    })
    }

  showOrHideCategories(){
    this.isShown = !this.isShown;
  }

  addCategory(id: number){
    console.log(id);

    this.categories$.pipe(take(1)).subscribe(categories => {
      const selectedCategory = categories.find(category => category.id === id) as Category;

      const currentItems = this.blogsService.selectedCategories$.value;

      if(!currentItems.includes(selectedCategory)) {
        const updatedItems = [...currentItems, selectedCategory] as Category[];
        this.blogsService.selectedCategories$.next(updatedItems);
        this.onAddCategory(selectedCategory);
      }
    })
  }

  onAddCategory(category: Category){
    const control = new FormControl(category.id);
    (<FormArray>this.blogForm.get('categories')).push(control);

    console.log((<FormArray>this.blogForm.get('categories')).value);
  }

  onRemoveCategory(id: number, category_id: number){
    (<FormArray>this.blogForm.get('categories')).removeAt(id);

    const currentItems = this.blogsService.selectedCategories$.value;
    const updatedItems = currentItems.filter(category => category.id !== category_id);

    this.blogsService.selectedCategories$.next(updatedItems);
  }

  onSubmit(){
    const formData = new FormData();

    formData.append('title', this.blogForm.get('title')?.value);
    formData.append('description', this.blogForm.get('description')?.value);
    formData.append('image', <File>this.selectedPhoto); // Assuming 'image' is a file input
    formData.append('author', this.blogForm.get('author')?.value);
    formData.append('publish_date', this.blogForm.get('publish_date')?.value);
    formData.append('categories', JSON.stringify(this.blogForm.get('categories')?.value));
    formData.append('email', this.blogForm.get('email')?.value);

    this.blogsService.createBlog(formData).subscribe(res => console.log(res));
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    this.selectedPhoto = file;
  }
}
