import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './../auth.service';
import { mimeType } from './mime-type.validator';
import { EmailValidator } from './email.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  private isAuthenticated = false;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  imagePath: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private emailValidator: EmailValidator
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.isAuthenticated = this.authService.getIsAuth();
    if (this.isAuthenticated) {
      this.router.navigate(['/']);
    }
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      email: new FormControl(null, {
        validators: [Validators.email, Validators.required],
        asyncValidators: [
          this.emailValidator.checkEmail.bind(this.emailValidator),
        ],
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)],
      }),
      photo: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.isLoading = false;
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ photo: file });
    this.form.get('photo').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  onSignup() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const authData = new FormData();
    authData.append('name', this.form.value.name);
    authData.append('email', this.form.value.email);
    authData.append('password', this.form.value.password);
    authData.append('photo', this.form.value.photo, this.form.value.name);
    this.authService.createUser(authData);
    this.form.reset();
    this.isLoading = false;
  }
}
