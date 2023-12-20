import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogItemComponent } from '../blog-item/blog-item.component';
import { BlogsService } from 'src/app/services/blogs.service';
import { Category } from 'src/app/models/models.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blogs-page',
  standalone: true,
  imports: [CommonModule, BlogItemComponent],
  templateUrl: './blogs-page.component.html',
  styleUrls: ['./blogs-page.component.scss']
})
export class BlogsPageComponent implements OnInit {
  categories$!: Observable<Category[]>;

  constructor(private blogsService: BlogsService) { }

  ngOnInit(): void {
    this.categories$ = this.blogsService.getCategories();

    // this.categories$.subscribe(val => console.log(val));

    this.blogsService.init();

    this.blogsService.loadBlogs();

    this.blogsService.getBlogs().subscribe(val => console.log(val));
  }


}
