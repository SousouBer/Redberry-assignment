import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogsService } from 'src/app/services/blogs.service';

@Component({
  selector: 'app-login-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.scss']
})
export class LoginSuccessComponent implements OnInit {

  constructor(private blogsService: BlogsService) { }

  ngOnInit(): void {
  }

  hideModal(){
    this.blogsService.showModal$.next(false);
  }
}
