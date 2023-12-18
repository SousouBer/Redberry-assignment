import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogItemComponent } from '../blog-item/blog-item.component';

@Component({
  selector: 'app-blogs-page',
  standalone: true,
  imports: [CommonModule, BlogItemComponent],
  templateUrl: './blogs-page.component.html',
  styleUrls: ['./blogs-page.component.scss']
})
export class BlogsPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
