import { Routes } from "@angular/router";
import { AuthGuard } from "./services/auth.guard";

// Lazy load all components.
export const routes: Routes = [
  {
    path: '', redirectTo: 'blogs', pathMatch: 'full'
  },
  {
    path: 'blogs',
    loadComponent: () =>
      import('./components/blogs-page/blogs-page.component').then(mod => mod.BlogsPageComponent)
  },
  {
    path: 'create-blog',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/create-blog/create-blog.component').then(mod => mod.CreateBlogComponent)
  },
  {
    path: 'blogs/:id',
    loadComponent: () => import('./components/single-blog/single-blog.component').then(mod => mod.SingleBlogComponent)
  }
];