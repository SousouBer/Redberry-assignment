import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogsService } from 'src/app/services/blogs.service';
import { LoginComponent } from '../login/login.component';
import { LoginSuccessComponent } from '../login-success/login-success.component';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, filter, take } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LoginComponent, LoginSuccessComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Hide buttons and center redberry logo only if activated route equals to /create-blog.
  hideButtons = false;

  sub!: Subscription;

  loggedIn = false;

  // Subject to hide modal window.
  showOrHideModal$ = this.blogsService.showOrHideModal();

  authenticated$ = this.blogsService.isAuthenticated();
  constructor(private blogsService: BlogsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // this.route.params.subscribe(params => {
    //   const activatedRoute = this.route.snapshot;

    //   console.log(activatedRoute);
    //   if(activatedRoute){
    //     this.hideButtons = true;
    //   }
    // })
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      if(this.router.url === '/create-blog'){
        this.hideButtons = true;
      } else {
        this.hideButtons = false;
      }
      // console.log('Route URL:', this.router.url);
    });

    this.blogsService.isLoggedIn.subscribe(val => {
      this.loggedIn = val;
    })
  }

  showModal(){
    this.blogsService.showModal$.next(true);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
