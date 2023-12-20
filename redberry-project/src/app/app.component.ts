import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { BlogsPageComponent } from './components/blogs-page/blogs-page.component';
import { SingleBlogComponent } from './components/single-blog/single-blog.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, HeaderComponent, BlogsPageComponent, SingleBlogComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'redberry-project';
}
