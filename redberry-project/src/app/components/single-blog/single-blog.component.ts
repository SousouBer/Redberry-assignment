import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Blog, Category } from 'src/app/models/models.interface';
import { BlogsService } from 'src/app/services/blogs.service';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { BlogItemComponent } from '../blog-item/blog-item.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-blog',
  standalone: true,
  imports: [CommonModule, BlogItemComponent],
  templateUrl: './single-blog.component.html',
  styleUrls: ['./single-blog.component.scss'],
})
export class SingleBlogComponent implements OnInit {
  // @Input() blogItem!: Blog;
  blogItem!: Observable<Blog>;

  //  Subject for holding all blogs in one place.
  allBlogs$!: Observable<Blog[]>;

  // Subject that holds all categories from the service.
  categories$!: Observable<Category[]>;

  // Subject to hold blogs that have similar categories.
  // similarBlogs$!: Observable<Blog[]>;
  similarBlogs$ = new BehaviorSubject<Blog[]>([]);
  constructor(private blogsService: BlogsService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];

      this.blogsService.loadSingleBlog(id);
      this.blogItem = this.blogsService.getSingleBlog();
    });
    // this.blogItem = this.blogsService.getSingleBlog();
    // this.blogItem.subscribe(data => console.log('data', data))
    // this.categories$ = this.blogsService.getCategories();
    this.allBlogs$ = this.blogsService.getBlogs();

    // Take only those blogs that contain at least one same category.
    this.allBlogs$.pipe(take(1)).subscribe((blogs) => {
      const similarBlogs = blogs.filter((blog) =>
        this.blogItem.categories.some((category) =>
          blog.categories.includes(category)
        )
      );

      // const filteredBlogs = value?.filter(blog =>
      //   blog.categories.some(category => (<number[]>categories).includes(category.id))
      // );

      this.similarBlogs$.next(similarBlogs);
    });

    // this.blogsService.init();
    // this.blogsService.loadBlogs();
  }

  backToMainPage(){
    this.router.navigate(['/blogs']);
  }
}
