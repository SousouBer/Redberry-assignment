import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

  categories$!: Observable<Category[]>;

  // Show or hide categories list to choose from.
  isShown = false;

  // Selected categories
  // selectedCategories: Category[] = [];
  selectedCategories$!: Observable<Category[]>;

  constructor(private blogsService: BlogsService){}

  ngOnInit(): void {
    this.categories$ = this.blogsService.getCategories();
    this.selectedCategories$ = this.blogsService.returnSelectedCategories();

    this.blogsService.init();
    this.categories$.subscribe(val => console.log(val));

    this.blogForm = new FormGroup({
      // picture: new FormControl(null, Validators.required)
      categories: new FormArray([])
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
    const control = new FormControl(category);
    (<FormArray>this.blogForm.get('categories')).push(control);

    console.log((<FormArray>this.blogForm.get('categories')).value);
  }

  onRemoveCategory(id: number, category_id: number){
    (<FormArray>this.blogForm.get('categories')).removeAt(id);

    const currentItems = this.blogsService.selectedCategories$.value;
    const updatedItems = currentItems.filter(category => category.id !== category_id);

    this.blogsService.selectedCategories$.next(updatedItems);

    console.log('removed: ', (<FormArray>this.blogForm.get('categories')).value);
    console.log('input remove: ', updatedItems);
  }
}