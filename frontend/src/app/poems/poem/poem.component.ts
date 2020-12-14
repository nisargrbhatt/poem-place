import { Component, OnInit } from '@angular/core';
import { PoemModel } from './../poem.model';
import { AuthService } from './../../auth/auth.service';
import { PoemService } from './../poem.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-poem',
  templateUrl: './poem.component.html',
  styleUrls: ['./poem.component.css'],
})
export class PoemComponent implements OnInit {
  poem: PoemModel;
  isAuthenticated = false;
  isLoading = false;
  poemId: string;
  userId: string;
  constructor(
    private authService: AuthService,
    private poemService: PoemService,
    public route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.isAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('poemId')) {
        this.poemId = paramMap.get('poemId');
        this.poemService.getPoem(this.poemId).subscribe((response) => {
          console.log(response.message);
          this.poem = response.poem;
          this.isLoading = false;
        });
      } else {
        console.log('There is Something!!!');
        this.isLoading = false;
      }
    });
  }
  onDelete(poemId: string) {
    this.poemService.deletePoem(poemId).subscribe((response) => {
      console.log(response.message);
      this.router.navigate(['/']);
    });
  }
}
