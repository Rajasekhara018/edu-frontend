import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/header/landing/landing.component';

const routes: Routes = [
   { path: '', component: LandingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
