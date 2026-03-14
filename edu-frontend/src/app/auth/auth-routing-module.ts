import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstLoginChangePassword } from './first-login-change-password/first-login-change-password';
import { Login } from './login/login';
import { ResetPassword } from './reset-password/reset-password';
import { Register } from './register/register';

const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'change-password', component: FirstLoginChangePassword },
  { path: 'register', component: Register },
  { path: 'forget-password', component: ResetPassword },
  { path: 'reset-password', component: ResetPassword },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
