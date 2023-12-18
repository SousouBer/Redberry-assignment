import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blogs-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blogs-page.component.html',
  styleUrls: ['./blogs-page.component.scss']
})
export class BlogsPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
