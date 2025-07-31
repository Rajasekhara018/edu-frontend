import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { APIPath } from '../../shared/api-enum';
import { PayeaseRestservice } from '../../shared/services/payease-restservice';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { ImageCropDialog } from '../image-crop-dialog/image-crop-dialog';
// import { Role, user } from '../../shared/model';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../../shared/model';

@Component({
  selector: 'app-customers',
  standalone: false,
  templateUrl: './customers.html',
  styleUrl: './customers.scss'
})
export class Customers {
  fullName!: string;
  email!: string;
  department!: string;
  accessType!: string;
  isDisabled!: boolean;
  customerObj = new Customer();
  reqId!: string;
  modelkey!: string | null;
  disabledMode!: boolean;
  constructor(public location: Location,
    public postService: PayeaseRestservice, public router: Router, private cdr: ChangeDetectorRef,
    private snackbar: MatSnackBar, private route: ActivatedRoute, private dialog: MatDialog,
    public http: HttpClient
  ) {
  }
  departments!: any;
  loggedInUserRole!: string;
  isSuperAdmin!: boolean;
  isEditMode!: boolean;
  isCreateMode!: boolean;
  ngOnInit(): void {
    this.modelkey = this.route.snapshot.paramMap.get('id')!;
    if (this.modelkey) {
      this.isEditMode = false;
      this.disabledMode = true;
      this.isCreateMode = false;
      this.gotoInq(this.modelkey);
    } else {
      this.isEditMode = true;
      this.disabledMode = false;
      this.isCreateMode = true;
    }
  }

  submitCustomerDetails(): void {
    const apiPath = this.isCreateMode ? APIPath.CUSTOMER_CRE : APIPath.CUSTOMER_UPD;
    const requestObj: any = {
      ...this.customerObj,
      ...(this.isCreateMode ? {} : { id: this.modelkey })
    };
    this.postService.doPost(apiPath, requestObj).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.customerObj = response.status;
          this.location.back();
          this.postService.showToast('success', response?.message?.toString());
        } else {
          this.postService.showToast('error', response?.message?.toString());
        }
      },
      error: (err: any) => {
        this.postService.showToast('error', err?.message?.toString());
      }
    });
  }
  gotoInq(modelkey: string) {
    this.postService.doPostInq(APIPath.CUSTOMER_INQ, modelkey).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.customerObj = response.object;
          this.postService.showToast('success', response?.message?.toString());
        } else {
          this.postService.showToast('error', response?.message?.toString());
        }
      },
      error: (err: any) => {
        this.postService.showToast('error', err?.message?.toString());
      }
    });
  }
  switchToCancel() {
    this.location.back();
  }
  onEditClick(): void {
    this.isEditMode = true;
    this.disabledMode = false;
  }
  onCancelEdit(): void {
    if (this.isCreateMode) {
      this.location.back();
    } else {
      this.isEditMode = false;
      this.disabledMode = true;
    }
  }
}