import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'shortenPipe',
})
export class ShortenPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    if(value.length > 86){
      return value.substr(0, 86) + '...';
    }
    return value;
  }
}
