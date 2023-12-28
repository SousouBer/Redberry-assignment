import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Blog } from 'src/app/models/models.interface';
import { ShortenPipe } from 'src/app/pipes/shorten-text.pipe';
import { Router } from '@angular/router';
import { BlogsService } from 'src/app/services/blogs.service';


@Component({
  selector: 'app-blog-item',
  standalone: true,
  imports: [CommonModule, ShortenPipe],
  templateUrl: './blog-item.component.html',
  styleUrls: ['./blog-item.component.scss']
})
export class BlogItemComponent implements OnInit {
  @Input() blogItem!: Blog;

  constructor(private router: Router, private blogsService: BlogsService) { }

  ngOnInit(): void {
  }

  viewFullPage(){
    const blogID = this.blogItem.id;
    this.router.navigate(['/blogs', blogID]);
  }
}
