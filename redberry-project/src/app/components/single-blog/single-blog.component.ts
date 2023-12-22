import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Blog, Category } from 'src/app/models/models.interface';
import { BlogsService } from 'src/app/services/blogs.service';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { BlogItemComponent } from '../blog-item/blog-item.component';

@Component({
  selector: 'app-single-blog',
  standalone: true,
  imports: [CommonModule, BlogItemComponent],
  templateUrl: './single-blog.component.html',
  styleUrls: ['./single-blog.component.scss'],
})
export class SingleBlogComponent implements OnInit {
  @Input() blogItem!: Blog;

  //  Subject for holding all blogs in one place.
  allBlogs$!: Observable<Blog[]>;

  // Subject to hold all categories from the service.
  categories$!: Observable<Category[]>;

  // Subject to hold blogs that have similar categories.
  // similarBlogs$!: Observable<Blog[]>;
  similarBlogs$ = new BehaviorSubject<Blog[]>([]);
  constructor(private blogsService: BlogsService) {}

  ngOnInit(): void {
    this.categories$ = this.blogsService.getCategories();
    this.allBlogs$ = this.blogsService.getBlogs();

    // Take only those blogs that contain at least one same category.
    this.allBlogs$.pipe(take(1)).subscribe((blogs) => {
      const similarBlogs = blogs.filter((blog) =>
        this.blogItem.categories.some((category) =>
          blog.categories.includes(category)
        )
      );

      this.similarBlogs$.next(similarBlogs);
    });

    this.blogsService.init();
    this.blogsService.loadBlogs();
  }
}
