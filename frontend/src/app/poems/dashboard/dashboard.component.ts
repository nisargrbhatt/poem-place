import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { PoemModel } from '../poem.model';
import { AuthService } from './../../auth/auth.service';
import { PoemService } from './../poem.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isLoading = false;
  poems: Array<PoemModel> = [];
  totalPost = 0;
  postPerPage = 3;
  currentPage = 1;
  pageSizeOptions = [1, 3, 5, 10];
  userId: string;
  private poemsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    private authService: AuthService,
    private poemService: PoemService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.poemService.getPoemPP(this.postPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.poemsSub = this.poemService
      .getPoemUpdateListener()
      .subscribe((poemData: { poems: Array<PoemModel>; poemCount: number }) => {
        this.poems = poemData.poems;
        this.totalPost = poemData.poemCount;
        this.isLoading = false;
      });
    this.isAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
        this.userId = this.authService.getUserId();
      });
  }
  onDelete(poemId: string) {
    this.isLoading = true;
    this.poemService.deletePoem(poemId).subscribe(
      (response) => {
        this.poemService.getPoemPP(this.postPerPage, this.currentPage);
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }
  textMake(poem: string) {
    // let conPoem = poem.replace(/\s/g, '&nbsp;');
    console.log(poem);

    let conPoem = poem.replace(/\\n/g, '<br/>');
    console.log(conPoem);
    return conPoem;
  }
  onPageChange(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.poemService.getPoemPP(this.postPerPage, this.currentPage);
  }
  ngOnDestroy() {
    this.poemsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
