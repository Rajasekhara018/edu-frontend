import { Component } from '@angular/core';
import { APIPath } from 'src/app/Services/api-enum';
import { Customer } from 'src/app/Services/model';
import { PayeaseRestservice } from 'src/app/Services/payease-restservice';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  isLoading!: boolean;
  customerObj = new Customer();
  constructor(private postService: PayeaseRestservice) {

  }

  register() {
    const requestObj: any = {
      ...this.customerObj,
    };
    this.postService.doPost(APIPath.AUTH_REGISTER, requestObj, "SIGNUP").subscribe({
      next: (response: any) => {
        if (response.status) {
          this.customerObj = response.status;
          debugger
          this.postService.showToast('success', "Registration is successfully completed");
        } else {
          this.postService.showToast('error', response?.message?.toString());
        }
      },
      error: (err: any) => {
        this.postService.showToast('error', err?.message?.toString());
      }
    });
  }
}
