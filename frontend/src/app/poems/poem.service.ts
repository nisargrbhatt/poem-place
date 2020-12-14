import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PoemModel } from './poem.model';
import { Subject } from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/poem/';

@Injectable({
  providedIn: 'root',
})
export class PoemService {
  private poems: Array<PoemModel> = [];
  private poemsUpdated = new Subject<{
    poems: Array<PoemModel>;
    poemCount: number;
  }>();

  constructor(private http: HttpClient) {}
  createPoem(poemData: any, userId: string) {
    this.http
      .post<{ message: string; poemId: string }>(
        BACKEND_URL + 'createpoem',
        poemData
      )
      .subscribe(
        (response) => {
          console.log(response.message);
          let body = {
            poemId: response.poemId,
          };
          this.http
            .put<{ message: string }>(
              environment.apiUrl + '/user/addpoem/' + userId,
              body
            )
            .subscribe(
              (response) => {
                console.log(response.message);
              },
              (error) => {
                console.log(error);
              }
            );
        },
        (error) => {
          console.log(error);
        }
      );
  }
  updatePoem(poemData: any, poemId: string) {
    this.http
      .put<{ message: string }>(BACKEND_URL + 'updatepoem/' + poemId, poemData)
      .subscribe(
        (response) => {
          console.log(response.message);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  deletePoem(poemId: string) {
    return this.http.delete<{ message: string }>(
      BACKEND_URL + 'deletepoem/' + poemId
    );
  }
  getPoem(poemId: string) {
    return this.http.get<{ message: string; poem: PoemModel }>(
      BACKEND_URL + 'getpoem/' + poemId
    );
  }
  getPoems() {
    return this.http.get<{ message: string; poems: Array<PoemModel> }>(
      BACKEND_URL + 'getpoems'
    );
  }
  getPoemPP(poemPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${poemPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; poems: Array<PoemModel>; maxPoems: number }>(
        BACKEND_URL + 'getpoemspp/' + queryParams
      )
      .subscribe((response) => {
        console.log(response.message);

        this.poems = response.poems;
        this.poemsUpdated.next({
          poems: [...this.poems],
          poemCount: response.maxPoems,
        });
      });
  }
  getPoemOU() {
    return this.http.get<{ message: string; poems: Array<PoemModel> }>(
      BACKEND_URL + 'getpoemsou'
    );
  }

  getPoemUpdateListener() {
    return this.poemsUpdated.asObservable();
  }
}
