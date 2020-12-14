import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PoemModel } from '../poem.model';
import { PoemService } from '../poem.service';

@Component({
  selector: 'app-mine-poem',
  templateUrl: './mine-poem.component.html',
  styleUrls: ['./mine-poem.component.css'],
})
export class MinePoemComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isLoading = false;
  poems: Array<PoemModel> = [];

  userId: string;
  private authStatusSub: Subscription;

  constructor(
    private authService: AuthService,
    private poemService: PoemService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.isAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
        this.userId = this.authService.getUserId();
      });
    this.getPoems();
  }
  getPoems() {
    this.isLoading = true;
    this.poemService.getPoemOU().subscribe(
      (response) => {
        console.log(response.message);
        this.poems = response.poems;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }
  onDelete(poemId: string) {
    this.isLoading = true;
    this.poemService.deletePoem(poemId).subscribe(
      (response) => {
        this.getPoems();
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
