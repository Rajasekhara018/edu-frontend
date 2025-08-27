import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  reqFS!: boolean;
  courses = ['Full Stack', 'NoSQL', 'Python Programming', 'Data Science', 'Java Programming',];
  constructor(private postService: PayeaseRestservice, public router: Router) {

  }
  loading!:boolean;
  register() {
    this.loading = true;
    const requestObj: any = {
      ...this.customerObj,
    };
    this.postService.doPost(APIPath.COURSE_REGISTER, requestObj, "SIGNUP").subscribe({
      next: (response: any) => {
        if (response.status) {
          this.loading = false;
          this.customerObj = response.status;
          // this.postService.openSnackBar('success',response.errorMsg);
          this.postService.openSnackBar(response.errorMsg, 'success', 3000);
        } else {
          this.loading = false;
          this.postService.openSnackBar(response.errorMsg, 'error', 3000);
        }
      },
      error: (err: any) => {
        this.loading = false;
        // this.postService.openSnackBar('error', err.errorMsg);
        this.postService.openSnackBar(err.errorMsg, 'error', 3000);
      }
    });
  }
  paymentPage(course: string, amount: number) {
    this.router.navigate(['/payment-page', course, amount]);
  }
}
