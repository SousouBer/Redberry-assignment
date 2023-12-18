import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { BlogsPageComponent } from './components/blogs-page/blogs-page.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, HeaderComponent, BlogsPageComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'redberry-project';
}
