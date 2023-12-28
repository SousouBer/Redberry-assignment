import { Routes } from "@angular/router";

// Lazy load all components.
export const routes: Routes = [
  {
    path: 'blogs',
    loadComponent: () =>
      import('./components/blogs-page/blogs-page.component').then(mod => mod.BlogsPageComponent)
  },
  {
    path: 'create-blog',
    loadComponent: () =>
      import('./components/create-blog/create-blog.component').then(mod => mod.CreateBlogComponent)
  },
  {
    path: 'blogs/:id',
    loadComponent: () => import('./components/single-blog/single-blog.component').then(mod => mod.SingleBlogComponent)
  }
];