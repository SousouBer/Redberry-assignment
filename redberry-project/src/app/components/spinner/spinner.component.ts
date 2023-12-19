import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-spinner',
  template: '<span class="loader"></span>',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {}