import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogItemComponent } from '../blog-item/blog-item.component';
import { BlogsService } from 'src/app/services/blogs.service';
import { Blog, Category } from 'src/app/models/models.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blogs-page',
  standalone: true,
  imports: [CommonModule, BlogItemComponent],
  templateUrl: './blogs-page.component.html',
  styleUrls: ['./blogs-page.component.scss']
})
export class BlogsPageComponent implements OnInit {
  // Subject to hold all created blogs from the servic.
  createdBlogs$!: Observable<Blog[]>;

  // Subject to hold all categories from the service.
  categories$!: Observable<Category[]>;

  constructor(private blogsService: BlogsService) { }

  ngOnInit(): void {
    // Get blogs from the service and use Observable above to hold values.
    this.createdBlogs$ = this.blogsService.getBlogs();

    // Get categories from the service and use Observable above to hold values.
    this.categories$ = this.blogsService.getCategories();
    
    this.blogsService.init();
    this.blogsService.loadBlogs();

    this.createdBlogs$.subscribe(val => console.log(val));
  }


}
