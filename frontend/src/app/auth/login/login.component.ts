import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  private isAuthenticated = false;
  form: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoading = true;
    this.isAuthenticated = this.authService.getIsAuth();
    if (this.isAuthenticated) {
      this.router.navigate(['/']);
    }
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
    this.isLoading = false;
  }
  onSaveData() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const authData = {
      email: this.form.value.email,
      password: this.form.value.password,
    };
    this.authService.login(authData);
    this.form.reset();
    this.isLoading = false;
  }
}
