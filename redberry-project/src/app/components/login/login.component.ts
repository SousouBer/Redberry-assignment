import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogsService } from 'src/app/services/blogs.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  // Show or hide the logging spinner.
  isLoading = false;

  constructor(private blogsService: BlogsService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email, this.containsRequiredPart.bind(this)])
    })
  }

  get email(){
    return this.loginForm.get('email');
  }

  onSubmit(){
    this.isLoading = true;

    const email = this.loginForm.value;


    this.blogsService.login(email).subscribe(val => {
      this.isLoading = false;
      this.blogsService.authenticated$.next(true);
    }, err => {
      this.email?.setErrors({ emailNotFound: true });
      this.isLoading = false;
    })
  }

  // Custom validator for email to check whether it ends with @redberry.ge
  containsRequiredPart(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;
    const emailPart = '@redberry.ge';

    if (!value) {
      return null;
    }

    const startIndex = value.length - emailPart.length;
    const domain = value.slice(startIndex).toLowerCase();

    if (domain === emailPart) {
      // Validation passes
      return null;
    } else {
      // Validation fails
      return { 'invalidEmailAddress': true };
    }
  }

  hideModal(){
    this.blogsService.showModal$.next(false);
  }

}
