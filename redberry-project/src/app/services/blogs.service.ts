import { Injectable } from '@angular/core';
import {
  Blog,
  BlogsData,
  Category,
  CategoryData,
} from '../models/models.interface';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, catchError, map, tap } from 'rxjs';
import { User, loginData } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class BlogsService {
  private token =
    '220fa65a71c56733beee5e3cdcf15b02a95bb6e0a4b61f4deb5030ec898204d2';
  private APIurl = 'https://api.blog.redberryinternship.ge/api';

  // Authenticated successfully to show success modal window.
  authenticated$ = new Subject<boolean>();

  // Show or hide modal window when logging in.
  showModal$ = new Subject<boolean>();

  // Subject for holding the current user values.
  user = new BehaviorSubject<User | null>(null);

  // Subject that hold the data of the categories.
  private categories$ = new BehaviorSubject<Category[]>([]);

  // Subject for holding selected categories in the blog page.
  selectedCategories$ = new BehaviorSubject<Category[]>([]);

  returnSelectedCategories(): Observable<Category[]> {
    return this.selectedCategories$;
  }

  // Subject that hold the data of the blogs;
  private blogs$ = new BehaviorSubject<Blog[]>([]);

  constructor(private http: HttpClient) {}

  init(): void {
    this.loadCategories();
  }

  isAuthenticated(): Observable<boolean> {
    return this.authenticated$;
  }

  showOrHideModal(): Observable<boolean> {
    return this.showModal$;
  }

  loadCategories() {
    this.http
      .get<CategoryData>(`${this.APIurl}/categories`)
      .pipe(map((data) => data.data))
      .subscribe((categories) => this.categories$.next(categories));
  }

  public getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  loadBlogs() {
    return this.http
      .get<BlogsData>(`${this.APIurl}/blogs`)
      .pipe(map((data) => data.data))
      .subscribe((blogs) => this.blogs$.next(blogs));
  }

  public getBlogs(): Observable<Blog[]> {
    return this.blogs$;
  }

  login(loginDetails: loginData) {
    console.log('login', loginDetails);
    return this.http.post(`${this.APIurl}/login`, loginDetails).pipe(
      tap(() => {
        const currentUser = new User(loginDetails.email, this.token);

        this.user.next(currentUser);
      })
    );
  }
}
