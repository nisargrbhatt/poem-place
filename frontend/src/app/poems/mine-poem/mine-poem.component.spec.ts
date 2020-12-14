import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinePoemComponent } from './mine-poem.component';

describe('MinePoemComponent', () => {
  let component: MinePoemComponent;
  let fixture: ComponentFixture<MinePoemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinePoemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinePoemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
