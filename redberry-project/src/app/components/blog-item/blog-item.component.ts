import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Blog } from 'src/app/models/models.interface';
import { ShortenPipe } from 'src/app/pipes/shorten-text.pipe';


@Component({
  selector: 'app-blog-item',
  standalone: true,
  imports: [CommonModule, ShortenPipe],
  templateUrl: './blog-item.component.html',
  styleUrls: ['./blog-item.component.scss']
})
export class BlogItemComponent implements OnInit {
  @Input() blogItem!: Blog;

  constructor() { }

  ngOnInit(): void {
  }

}
