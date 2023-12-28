import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { BlogsPageComponent } from './components/blogs-page/blogs-page.component';
import { SingleBlogComponent } from './components/single-blog/single-blog.component';
import { CreateBlogComponent } from './components/create-blog/create-blog.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { BlogsService } from './services/blogs.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, HeaderComponent, BlogsPageComponent, SingleBlogComponent, CreateBlogComponent, RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private blogsService: BlogsService){}

  ngOnInit(): void {
    if(<string>localStorage.getItem('authenticatedUser')){
      this.blogsService.isLoggedIn.next(true);
    }

    // Load all blogs and categories once when the app runs.
    // this.blogsService.init();
    // this.blogsService.loadBlogs();
  }
}
