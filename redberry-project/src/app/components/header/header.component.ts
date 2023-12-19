import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogsService } from 'src/app/services/blogs.service';
import { LoginComponent } from '../login/login.component';
import { LoginSuccessComponent } from '../login-success/login-success.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LoginComponent, LoginSuccessComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  authenticated$ = this.blogsService.isAuthenticated();

  // Subject to hide modal window.
  showOrHideModal$ = this.blogsService.showOrHideModal();

  constructor(private blogsService: BlogsService) { }

  ngOnInit(): void {

  }

  showModal(){
    this.blogsService.showModal$.next(true);
  }
}
