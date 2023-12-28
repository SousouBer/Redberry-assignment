import { Pipe, PipeTransform } from "@angular/core";
import { Blog, Category } from "../models/models.interface";

@Pipe({
  standalone: true,
  name: 'filterBlogs'
})
export class FilterBlogs implements PipeTransform {
  transform(value: Blog[] | null, categories: number[] | null) {
    if(value?.length === 0 || categories?.length === 0){
      return value;
    }

    const filteredBlogs = value?.filter(blog =>
      blog.categories.some(category => (<number[]>categories).includes(category.id))
    );

    return filteredBlogs;
  }
}