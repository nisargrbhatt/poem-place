import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PoemService } from './../poem.service';
import { AuthService } from './../../auth/auth.service';
import { PoemModel } from './../poem.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  language = ['Gujarati', 'Hindi', 'English'];
  poemData: PoemModel;
  form: FormGroup;
  isLoading = false;

  private isAuthenticated = false;
  private userId: string;
  private mode = 'create';
  private poemId: string;

  constructor(
    private poemService: PoemService,
    public route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.isAuthenticated = this.authService.getIsAuth();
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
    }
    this.userId = this.authService.getUserId();
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      poem: new FormControl(null, { validators: [Validators.required] }),
      creater: new FormControl(null, { validators: [Validators.required] }),
      type: new FormControl(null, { validators: [Validators.required] }),
      language: new FormControl(null, { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('poemId')) {
        this.mode = 'edit';
        this.poemId = paramMap.get('poemId');
        this.isLoading = true;
        this.poemService.getPoem(this.poemId).subscribe((response) => {
          console.log(response.message);
          this.poemData = response.poem;
          this.form.setValue({
            name: this.poemData.name,
            poem: this.poemData.poem,
            creater: this.poemData.creater,
            type: this.poemData.type,
            language: this.poemData.language,
          });
        });
        this.isLoading = false;
      } else {
        this.mode = 'create';
        this.isLoading = false;
      }
    });
  }
  textMake(poem: string) {
    // let conPoem = poem.replace(/\s/g, '&nbsp;');
    let conPoem = poem.replace(/\\n/g, '<br/>');
    console.log(conPoem);
    return conPoem;
  }
  onSaveData() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const poemData = {
      name: this.form.value.name,
      poem: this.textMake(this.form.value.poem),
      creater: this.form.value.creater,
      type: this.form.value.type,
      language: this.form.value.language,
    };
    if (this.mode == 'create') {
      console.log(poemData);

      this.poemService.createPoem(poemData, this.userId);
      this.router.navigate(['/']);
    } else if (this.mode == 'edit') {
      this.poemService.updatePoem(poemData, this.poemId);
      this.router.navigate(['/']);
    } else {
      console.log('What is This???????????????????????????????');
      this.router.navigate(['/']);
    }
    this.form.reset();
    this.isLoading = false;
  }
}
