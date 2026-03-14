import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { APIPath } from '../../shared/api-enum';
import { PayeaseRestservice } from '../../shared/services/payease-restservice';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ImageCropDialog } from '../image-crop-dialog/image-crop-dialog';
// import { Role, user } from '../../shared/model';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../../shared/model';

interface DistributorOption {
  id: string;
  label: string;
  status?: string;
}

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
    private route: ActivatedRoute, private dialog: MatDialog,
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
  distributorOptions: DistributorOption[] = [];
  isLoadingDistributors = false;
  ngOnInit(): void {
    this.initializeRoleContext();
    this.modelkey = this.route.snapshot.paramMap.get('id')!;

    if (this.isAgentUser && !this.modelkey) {
      this.postService.showToast('error', 'Agent users do not have permission to create customers.');
      this.router.navigate(['/dashboard/commission-dashboard']);
      return;
    }

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

    if (this.isAdminUser) {
      this.loadDistributorOptions();
    }
  }
  userType!: string;
  submitCustomerDetails(): void {
    if (!this.canCreateUsers) {
      this.postService.showToast('error', 'Agent users do not have permission to create customers.');
      return;
    }

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

  get distributorSelectionRequired(): boolean {
    return this.userType === 'AGENT' && this.isDistributorUser && !this.isAdminUser;
  }

  get showDistributorDropdown(): boolean {
    return this.userType === 'AGENT' && this.isAdminUser;
  }

  private initializeRoleContext() {
    const rolesRaw = localStorage.getItem('LoggedInUserroles');
    let roles: string[] = [];
    if (rolesRaw && rolesRaw !== 'undefined') {
      try {
        const parsed = JSON.parse(rolesRaw);
        roles = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        roles = [rolesRaw];
      }
    }
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
      } else if (this.isAdminUser && !this.customerObj.distributeId) {
        this.customerObj.distributeId = '';
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

  private loadDistributorOptions() {
    this.isLoadingDistributors = true;
    this.postService.doPostFindAll(APIPath.CUSTOMER_GETALL).subscribe({
      next: (response: any) => {
        const items = this.extractCustomerList(response);
        this.distributorOptions = items
          .filter((item: any) => item?.distributeUser)
          .map((item: any) => ({
            id: item?.id || item?.userName || '',
            label: this.buildDistributorLabel(item),
            status: item?.status
          }))
          .filter((item) => !!item.id)
          .sort((left, right) => left.label.localeCompare(right.label));
        this.isLoadingDistributors = false;
      },
      error: () => {
        this.isLoadingDistributors = false;
        this.distributorOptions = [];
        this.postService.showToast('warn', 'Distributor list could not be loaded. You can still create an agent and assign the distributor later.');
      }
    });
  }

  private extractCustomerList(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.object)) {
      return response.object;
    }

    if (Array.isArray(response?.responseObject)) {
      return response.responseObject;
    }

    if (Array.isArray(response?.responseObject?.content)) {
      return response.responseObject.content;
    }

    return [];
  }

  private buildDistributorLabel(item: any): string {
    const fullName = item?.fullName?.trim?.() || '';
    const businessName = item?.businessName?.trim?.() || '';
    const userName = item?.userName?.trim?.() || item?.id?.trim?.() || '';

    if (fullName && businessName) {
      return `${fullName} - ${businessName}`;
    }

    if (businessName && userName) {
      return `${businessName} (${userName})`;
    }

    return fullName || businessName || userName || 'Unnamed distributor';
  }
}
