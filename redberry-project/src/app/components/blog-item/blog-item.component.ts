import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-item.component.html',
  styleUrls: ['./blog-item.component.scss']
})
export class BlogItemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
