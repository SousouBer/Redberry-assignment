import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogItemComponent } from '../blog-item/blog-item.component';
import { BlogsService } from 'src/app/services/blogs.service';
import { Blog, Category } from 'src/app/models/models.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { FilterBlogs } from 'src/app/pipes/filter-blogs.pipe';

@Component({
  selector: 'app-blogs-page',
  standalone: true,
  imports: [CommonModule, BlogItemComponent, FilterBlogs],
  templateUrl: './blogs-page.component.html',
  styleUrls: ['./blogs-page.component.scss'],
})
export class BlogsPageComponent implements OnInit {
  // Subject to hold all created blogs from the servic.
  createdBlogs$!: Observable<Blog[]>;

  // Subject to hold all categories from the service.
  categories$!: Observable<Category[]>;

  // This array is used to filter the output.
  chosenCategoriesSubject$ = new BehaviorSubject<number[]>([]);
  chosenCategories: number[] = [];

  constructor(private blogsService: BlogsService) {}

  ngOnInit(): void {
    this.blogsService.init();
    this.blogsService.loadBlogs();

    // Get blogs from the service and use Observable above to hold values.
    this.createdBlogs$ = this.blogsService.getBlogs();

    // Get categories from the service and use Observable above to hold values.
    this.categories$ = this.blogsService.getCategories();

    // this.createdBlogs$.subscribe((val) => console.log(val));
    this.chosenCategoriesSubject$.subscribe(value => this.chosenCategories = value);

    // Get categories from the local storage.
    if(localStorage.getItem('filteredCategories')){
      const items = JSON.parse(<string>localStorage.getItem('filteredCategories'));
      console.log(items);

      this.chosenCategoriesSubject$.next(items);
    }
  }

  addToFilterArray(id: number) {
    let getCurrentCategories = this.chosenCategoriesSubject$.getValue();

    if (getCurrentCategories.includes(id)) {
      getCurrentCategories.splice(getCurrentCategories.indexOf(id), 1);
      // Provide a slice of an an array to trigger change detection.
      this.chosenCategoriesSubject$.next(getCurrentCategories.slice());
    } else {
      getCurrentCategories.push(id);
      this.chosenCategoriesSubject$.next(getCurrentCategories.slice());
    }

    localStorage.setItem('filteredCategories', JSON.stringify(getCurrentCategories));
  }
}
