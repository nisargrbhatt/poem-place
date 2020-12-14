import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from './../auth.service';

@Injectable({ providedIn: 'root' })
export class EmailValidator {
  debouncer: any;

  constructor(public authService: AuthService) {}

  checkEmail(control: FormControl): any {
    clearTimeout(this.debouncer);

    return new Promise((resolve) => {
      this.debouncer = setTimeout(() => {
        this.authService.checkEmail(control.value).subscribe(
          (res) => {
            if (res.ok) {
              resolve(null);
            } else {
              resolve({ emailInUse: true });
            }
          },
          (err) => {
            resolve({ emailInUse: true });
          }
        );
      }, 1000);
    });
  }
}
