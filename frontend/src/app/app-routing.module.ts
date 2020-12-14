import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './poems/dashboard/dashboard.component';
import { CreateComponent } from './poems/create/create.component';
import { MinePoemComponent } from './poems/mine-poem/mine-poem.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'create', component: CreateComponent, canActivate: [AuthGuard] },
  {
    path: 'edit/:poemId',
    component: CreateComponent,
    canActivate: [AuthGuard],
  },
  { path: 'mypoems', component: MinePoemComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
