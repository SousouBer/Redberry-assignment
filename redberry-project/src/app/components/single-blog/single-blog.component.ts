import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Blog, Category } from 'src/app/models/models.interface';
import { BlogsService } from 'src/app/services/blogs.service';
import { BehaviorSubject, Observable, combineLatest, map, take } from 'rxjs';
import { BlogItemComponent } from '../blog-item/blog-item.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-single-blog',
  standalone: true,
  imports: [CommonModule, BlogItemComponent, SpinnerComponent],
  templateUrl: './single-blog.component.html',
  styleUrls: ['./single-blog.component.scss'],
})
export class SingleBlogComponent implements OnInit {
  blogItem!: Observable<Blog>;

  //  Subject for holding all blogs in one place.
  allBlogs$!: Observable<Blog[]>;

  // Show loading spinner.
  isLoading!: Observable<boolean>;

  // // Subject that holds all categories from the service.
  // categories$!: Observable<Category[]>;

  // Value used in carousel functionality.
  currentIndex = 0;

  similarBlogs: Blog[] = [];

  constructor(private blogsService: BlogsService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];

      this.blogsService.loadSingleBlog(id);
      this.blogItem = this.blogsService.getSingleBlog();
    });

    this.allBlogs$ = this.blogsService.getBlogs();

    this.isLoading = this.blogsService.returnLoadingValue();

    this.blogItem.subscribe(val => console.log(val));

    combineLatest([this.allBlogs$, this.blogItem]).pipe(
      map(([blogs, currentBlog]) => {
        const similarBlogs = blogs.filter((blog) => {
          if (blog.id === currentBlog.id) {
            return false;
          }

          const hasCommonCategory = currentBlog.categories.some((currentCategory) =>
            blog.categories.some((blogCategory) => currentCategory.id === blogCategory.id)
          );
          return hasCommonCategory;
        });
        return similarBlogs;
      })
    ).subscribe((similarBlogs) => {
      this.similarBlogs = similarBlogs;
    });
  }

  backToMainPage(){
    this.router.navigate(['/blogs']);
  }

  get visibleItems(): Blog[] {
    return this.similarBlogs.slice(this.currentIndex, this.currentIndex + 3);
  }

  get isBackDisabled(): boolean {
    return this.currentIndex === 0;
  }

  get isFrontDisabled(): boolean {
    return this.currentIndex >= this.similarBlogs.length - 3;
  }

  navigate(offset: number): void {
    this.currentIndex += offset;
  }
}
