import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogsService } from 'src/app/services/blogs.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.scss']
})
export class LoginSuccessComponent implements OnInit {

  constructor(private blogsService: BlogsService, private router: Router) { }

  ngOnInit(): void {
  }

  hideModal(){
    this.blogsService.showModal$.next(false);
    this.router.navigate(['/blogs']);
  }
}
