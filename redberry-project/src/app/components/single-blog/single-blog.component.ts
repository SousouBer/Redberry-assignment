import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Blog, Category } from 'src/app/models/models.interface';
import { BlogsService } from 'src/app/services/blogs.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-single-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-blog.component.html',
  styleUrls: ['./single-blog.component.scss']
})
export class SingleBlogComponent implements OnInit {
  @Input() blogItem!: Blog;
   // Subject to hold all categories from the service.
   categories$!: Observable<Category[]>;

   constructor(private blogsService: BlogsService){}

  ngOnInit(): void {
    this.categories$ = this.blogsService.getCategories();

    this.blogsService.init();
  }
}
