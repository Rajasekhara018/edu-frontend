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
  isAdminUser = false;
  isDistributorUser = false;
  isAgentUser = false;
  canCreateUsers = true;
  availableUserTypes: string[] = [];
  currentDistributorId = '';
  ngOnInit(): void {
    this.initializeRoleContext();
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
      this.applyCreateDefaults();
    }
  }
  userType!: string;
  submitCustomerDetails(): void {
    this.prepareRolePayload();
    const apiPath = this.isCreateMode ? APIPath.CUSTOMER_CRE : APIPath.CUSTOMER_UPD;
    const requestObj: any = {
      ...this.customerObj,
      ...(this.isCreateMode ? {} : { id: this.modelkey })
    };
    let requestType = this.isCreateMode ? "CREATE" : "UPDATE";
    this.postService.doPost(apiPath, requestObj, requestType).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.customerObj = response.status;
          this.syncUserTypeFromCustomer();
          this.location.back();
          this.postService.showToast('success', response?.errorMsg?.toString());
        } else {
          this.postService.showToast('error', response?.errorMsg?.toString());
        }
      },
      error: (err: any) => {
        this.postService.showToast('error', err?.errorMsg?.toString());
      }
    });
  }
  gotoInq(modelkey: string) {
    this.postService.doPostInq(APIPath.CUSTOMER_INQ, modelkey).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.customerObj = response.object;
          this.syncUserTypeFromCustomer();
          this.postService.showToast('success', response?.errorMsg?.toString());
        } else {
          this.postService.showToast('error', response?.errorMsg?.toString());
        }
      },
      error: (err: any) => {
        this.postService.showToast('error', err?.errorMsg?.toString());
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

  onUserTypeChange() {
    this.customerObj.distributeId = '';
    this.customerObj.distributorAccountDetails = '';
    this.customerObj.retailerAccountDetails = '';

    if (this.userType === 'AGENT' && this.isDistributorUser) {
      this.customerObj.distributeId = this.currentDistributorId;
    }
  }

  private initializeRoleContext() {
    const rolesRaw = localStorage.getItem('LoggedInUserroles');
    const roles: string[] = rolesRaw && rolesRaw !== 'undefined' ? JSON.parse(rolesRaw) : [];
    const normalizedRoles = roles.map((role) => role?.toUpperCase?.() || '');

    this.isAdminUser = normalizedRoles.some((role) => role.includes('ADMIN'));
    this.isDistributorUser = normalizedRoles.some((role) => role.includes('DISTRIBUTOR'));
    this.isAgentUser = normalizedRoles.some((role) => role.includes('AGENT') || role.includes('RETAIL'));
    this.canCreateUsers = !this.isAgentUser;
    this.currentDistributorId = localStorage.getItem('userId') || '';

    if (this.isAdminUser) {
      this.availableUserTypes = ['DISTRIBUTOR', 'AGENT'];
    } else if (this.isDistributorUser) {
      this.availableUserTypes = ['AGENT'];
    } else {
      this.availableUserTypes = [];
    }
  }

  private applyCreateDefaults() {
    if (!this.canCreateUsers) {
      this.disabledMode = true;
      this.isEditMode = false;
      return;
    }

    if (this.isDistributorUser && !this.isAdminUser) {
      this.userType = 'AGENT';
      this.customerObj.distributeId = this.currentDistributorId;
    }
  }

  private prepareRolePayload() {
    this.customerObj.adminUser = false;
    this.customerObj.distributeUser = this.userType === 'DISTRIBUTOR';
    this.customerObj.retailUser = this.userType === 'AGENT';

    if (this.userType === 'DISTRIBUTOR') {
      this.customerObj.distributeId = '';
      this.customerObj.retailerAccountDetails = '';
    }

    if (this.userType === 'AGENT') {
      this.customerObj.distributorAccountDetails = '';
      if (this.isDistributorUser && !this.isAdminUser) {
        this.customerObj.distributeId = this.currentDistributorId;
      }
    }
  }

  private syncUserTypeFromCustomer() {
    if (this.customerObj.distributeUser) {
      this.userType = 'DISTRIBUTOR';
      return;
    }

    if (this.customerObj.retailUser) {
      this.userType = 'AGENT';
      return;
    }

    this.userType = '';
  }
}
