import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dragAndDropDirective } from 'src/app/directives/dragAndDrop.directive';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/models.interface';
import { Observable } from 'rxjs';
import { BlogsService } from 'src/app/services/blogs.service';

@Component({
  selector: 'app-single-blog',
  standalone: true,
  imports: [CommonModule, dragAndDropDirective],
  templateUrl: './single-blog.component.html',
  styleUrls: ['./single-blog.component.scss']
})
export class SingleBlogComponent implements OnInit {
  blogForm!: FormGroup;

  categories$!: Observable<Category[]>;

  constructor(private blogsService: BlogsService){}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();

    const droppedFiles = (event.dataTransfer?.files || []) as FileList;
    this.handleFiles(droppedFiles);
  }

  onFileSelected(event: any): void {
    const selectedFile = (event.target as HTMLInputElement).files?.[0];
    this.handleFiles(selectedFile);
  }

  private handleFiles(file: any): void {
    if (file) {
      // Handle the selected or dropped file here
      console.log('Selected or dropped File:', file[0]);
    }
  }


  ngOnInit(): void {
    this.categories$ = this.blogsService.getCategories();

    this.blogsService.init();
    this.categories$.subscribe(val => console.log(val));

    this.blogForm = new FormGroup({
      picture: new FormControl(null, Validators.required)
    })
  }
}
