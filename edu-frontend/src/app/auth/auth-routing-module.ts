import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { ResetPassword } from './reset-password/reset-password';
import { Register } from './register/register';

const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'reset-password', component: ResetPassword },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
