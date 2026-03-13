import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { APIPath } from 'src/app/Services/api-enum';
import { Customer } from 'src/app/Services/model';
import { PayeaseRestservice } from 'src/app/Services/payease-restservice';
import { WebsiteConfigService } from 'src/app/Services/website-config.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  isLoading!: boolean;
  customerObj = new Customer();
  reqFS!: boolean;
  constructor(
    private readonly postService: PayeaseRestservice,
    public readonly router: Router,
    public readonly websiteConfig: WebsiteConfigService
  ) {}

  loading!: boolean;

  get courses() {
    return this.websiteConfig.courses;
  }

  get courseNames() {
    return this.websiteConfig.courseNames;
  }

  getCourse(slug: string) {
    return this.websiteConfig.findCourseBySlug(slug);
  }

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
