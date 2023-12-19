import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, exhaustMap, take } from "rxjs";
import { BlogsService } from "./blogs.service";
import { User } from "../models/user.model";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private token =
    '220fa65a71c56733beee5e3cdcf15b02a95bb6e0a4b61f4deb5030ec898204d2';

  constructor(private blogsService: BlogsService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.blogsService.user.pipe(take(1), exhaustMap((user) => {
      const modifiedRequest = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${this.token}`,
        }
      })
      return next.handle(modifiedRequest);
    }))
  }
}