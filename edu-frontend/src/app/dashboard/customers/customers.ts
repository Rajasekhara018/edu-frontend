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
  // userObj = new user();
  isDisabled!: boolean;
  isCreateMode!: boolean;
  // roleObj = new Role();
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
  ngOnInit(): void {
    this.departments = JSON.parse(localStorage.getItem('departments')!);
    this.loggedInUserRole = JSON.parse(localStorage.getItem('LoggedInUserroles')!);
    this.isSuperAdmin = this.loggedInUserRole.includes('SUPER_ADMIN');
    this.modelkey = this.route.snapshot.paramMap.get('id');
    // this.getRolesAndLoadUser();
    if (this.modelkey) {
      this.isEditMode = false;
      this.isCreateMode = false;
    } else {
      this.isEditMode = true;
      this.isCreateMode = true;
    }
  }
  // getRolesAndLoadUser(): void {
  //   this.postService.doPostGetAll(APIPath.ROLE_GETALL, 0, 100).subscribe({
  //     next: (response: any) => {
  //       if (response.success) {
  //         // this.userRoles = response.responseObject.content;
  //         if (this.modelkey) {
  //           this.loadUserData(this.modelkey);
  //         }
  //         this.postService.showToast('success', response?.message?.toString());
  //       } else {
  //         this.postService.showToast('error', response?.message?.toString());
  //       }
  //     },
  //     error: (err) => {
  //       this.postService.showToast('error', err?.message?.toString());
  //     }
  //   });
  // }

  loadUserData(userId: string): void {
    this.postService.doPostInq(APIPath.USER_VIEW, userId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.customerObj = response.responseObject;
          // this.userObj.roles = response.responseObject.roles;
          if (response.responseObject?.image?.name) {
            this.croppedImage = `http://localhost:9000/api/v1/uam/files/profile-image?filename=${response.responseObject?.image?.name}`;
          } else {
            this.croppedImage = 'https://i.pravatar.cc/40?u=' + response.responseObject.fullName;
          }
          this.disabledMode = true;
          // this.setSelectedRoles(this.userObj.roles);
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

  // setSelectedRoles(selectedRoleTitles: Array<Role>): void {
  //   this.userRoles.forEach(role => {
  //     role.selected = selectedRoleTitles.includes(role.roleName);
  //     if (role.selected) this.onRoleToggle(role);
  //   });
  // }
  // setSelectedRoles(selectedRoleTitles: Array<Role> | null): void {
  //   if (!selectedRoleTitles || !Array.isArray(selectedRoleTitles)) return;
  //   this.userRoles.forEach(role => {
  //     role.selected = selectedRoleTitles.some(r => r.roleName === role.roleName);
  //     if (role.selected) this.onRoleToggle(role);
  //   });
  // }
  // setSelectedRoles(selectedRoleTitles: string[] | null): void {
  //   if (!selectedRoleTitles || !Array.isArray(selectedRoleTitles)) return;

  //   this.userRoles.forEach(role => {
  //     role.selected = selectedRoleTitles.includes(role.roleName);
  //     if (role.selected) this.onRoleToggle(role);
  //   });
  // }

  submitUserDetails(): void {
    // const selectedRoles = this.userRoles.filter(role => role.selected).map(role => role.roleName);;
    const apiPath = this.isCreateMode ? APIPath.USER_CRE : APIPath.USER_EDIT;
    const requestObj: any = {
      ...this.customerObj,
      // profileImage: this.croppedImage,
      // roles: selectedRoles.map(role => role.roleName),
      // roles: selectedRoles,
      ...(this.isCreateMode ? {} : { id: this.modelkey })
    };
    this.postService.doPost(apiPath, requestObj).subscribe({
      next: (response: any) => {
        if (response.success) {
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
  switchToCancel() {
    this.location.back();
  }
  // userRoles = new Array<Role>();
  combinedPermissions: {
    function: string;
    create: boolean;
    edit: boolean;
  }[] = [];

  // onRoleToggle(role: Role) {
  //   this.mapRoleDataToUI(role);
  // }
  isEditMode: boolean = false;
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
  getFunctionsForRole(role: any): string {
    return role.permissions?.map((p: any) => p.function).join(', ') || '';
  }
  // permissiondataSource = [
  //   {
  //     "function": "User Management",
  //     action: ['CREATE', 'VIEW', 'UPDATE', 'DELETE', 'GETALL', 'SEARCH'],
  //     isCreate: false, isView: false, isUpdate: false, isDelete: false, isGetAll: false, isSearch: false, isAll: false,
  //     "actions": [
  //       { "type": "CREATE", "privilege": "001", "api": "/api/v1/uam/user/cre" },
  //       { "type": "VIEW", "privilege": "002", "api": "/api/v1/uam/user/view" },
  //       { "type": "UPDATE", "privilege": "003", "api": "/api/v1/uam/user/edit" },
  //       { "type": "DELETE", "privilege": "004", "api": "/api/v1/uam/user/delete" },
  //       { "type": "GETALL", "privilege": "005", "api": "/api/v1/uam/user/getAll" },
  //       { "type": "SEARCH", "privilege": "006", "api": "/api/v1/uam/user/search" }
  //     ]
  //   },
  //   {
  //     "function": "Role Management",
  //     action: ['CREATE', 'VIEW', 'UPDATE', 'DELETE', 'GETALL', 'SEARCH'],
  //     isCreate: false, isView: false, isUpdate: false, isDelete: false, isGetAll: false, isSearch: false, isAll: false,
  //     "actions": [
  //       { "type": "CREATE", "privilege": "007", "api": "/api/v1/uam/role/cre" },
  //       { "type": "VIEW", "privilege": "008", "api": "/api/v1/uam/role/inq" },
  //       { "type": "UPDATE", "privilege": "009", "api": "/api/v1/uam/role/upd" },
  //       { "type": "DELETE", "privilege": "010", "api": "/api/v1/uam/role/del" },
  //       { "type": "GETALL", "privilege": "011", "api": "/api/v1/uam/role/getall" },
  //       { "type": "SEARCH", "privilege": "012", "api": "/api/v1/uam/role/search" }
  //     ]
  //   },
  //   {
  //     "function": "Document Management",
  //     action: ['UPLOAD', 'VIEW', 'UPDATE', 'DELETE', 'GETALL', 'SEARCH'],
  //     isUpload: false, isView: false, isUpdate: false, isDelete: false, isGetAll: false, isSearch: false, isAll: false,
  //     "actions": [
  //       { "type": "CREATE", "privilege": "013", "api": "/api/v1/documents/upload" },
  //       { "type": "VIEW", "privilege": "014", "api": "/api/v1/documents/view" },
  //       { "type": "UPDATE", "privilege": "015", "api": "/api/v1/documents/edit" },
  //       { "type": "DELETE", "privilege": "016", "api": "/api/v1/documents/delete" },
  //       { "type": "GETALL", "privilege": "017", "api": "/api/v1/documents/getAll" },
  //       { "type": "SEARCH", "privilege": "018", "api": "/api/v1/documents/search" }
  //     ]
  //   },
  //   {
  //     "function": "Activity Log Management",
  //     action: ['VIEW', 'GETALL', 'SEARCH', 'EXPORT'],
  //     isView: false, isGetAll: false, isSearch: false, isExport: false, isAll: false,
  //     "actions": [
  //       { "type": "VIEW", "privilege": "019", "api": "/api/v1/logs/view" },
  //       { "type": "GETALL", "privilege": "020", "api": "/api/v1/logs/getAll" },
  //       { "type": "SEARCH", "privilege": "021", "api": "/api/v1/logs/search" },
  //       { "type": "EXPORT", "privilege": "022", "api": "/api/v1/logs/export" }
  //     ]
  //   },
  //   {
  //     "function": "Approval Management",
  //     action: ['VIEW', 'APPROVE', 'REJECT', 'GETALL', 'SEARCH'],
  //     isView: false, isApprove: false, isReject: false, isGetAll: false, isSearch: false, isAll: false,
  //     "actions": [
  //       { "type": "VIEW", "privilege": "023", "api": "/api/v1/approvals/view" },
  //       { "type": "APPROVE", "privilege": "024", "api": "/api/v1/approvals/approve" },
  //       { "type": "REJECT", "privilege": "025", "api": "/api/v1/approvals/reject" },
  //       { "type": "GETALL", "privilege": "026", "api": "/api/v1/admin/bin/getall" },
  //       { "type": "SEARCH", "privilege": "027", "api": "/api/v1/admin/bin/search" }
  //     ]
  //   },
  //   {
  //     "function": "Category Management",
  //     action: ['CREATE', 'VIEW', 'UPDATE', 'DELETE', 'GETALL', 'SEARCH'],
  //     isCreate: false, isView: false, isUpdate: false, isDelete: false, isGetAll: false, isSearch: false, isAll: false,
  //     "actions": [
  //       { "type": "CREATE", "privilege": "028", "api": "/api/v1/category/create" },
  //       { "type": "VIEW", "privilege": "029", "api": "/api/v1/category/view" },
  //       { "type": "UPDATE", "privilege": "030", "api": "/api/v1/category/edit" },
  //       { "type": "DELETE", "privilege": "031", "api": "/api/v1/category/delete" },
  //       { "type": "GETALL", "privilege": "032", "api": "/api/v1/category/getAll" },
  //       { "type": "SEARCH", "privilege": "033", "api": "/api/v1/category/search" }
  //     ]
  //   },
  //   {
  //     "function": "Settings Management",
  //     action: ['VIEW', 'UPDATE'],
  //     isView: false, isUpdate: false, isAll: false,
  //     "actions": [
  //       { "type": "VIEW", "privilege": "034", "api": "/api/v1/settings/view" },
  //       { "type": "UPDATE", "privilege": "035", "api": "/api/v1/settings/view" },
  //     ]
  //   },
  //   {
  //     "function": "Analytics Management",
  //     action: ['VIEW', 'EXPORT'],
  //     isView: false, isExport: false, isAll: false,
  //     "actions": [
  //       { "type": "VIEW", "privilege": "036", "api": "/api/v1/analytics/view" },
  //       { "type": "EXPORT", "privilege": "037", "api": "/api/v1/analytics/export" },
  //     ]
  //   },
  //   {
  //     "function": "Dashoboard Management",
  //     action: ['VIEW',],
  //     isView: false, isAll: false,
  //     "actions": [
  //       { "type": "VIEW", "privilege": "038", "api": "/api/v1/dashboard/view" },
  //     ]
  //   }
  // ];
  // mapRoleDataToUI(updatedRole: any): void {
  //   const role = this.userRoles.find(r => r.roleName === updatedRole.roleTitle);
  //   if (role) {
  //     role.selected = updatedRole.selected;
  //   }
  //   const selectedRoles = this.userRoles.filter(r => r.selected);
  //   const combinedPrivileges = new Set<string>();
  //   const combinedApiPaths = new Set<string>();
  //   selectedRoles.forEach((role: any) => {
  //     role.authorizedPermissions?.forEach((priv: string) => combinedPrivileges.add(priv));
  //     role.authorizedApiRoutes?.forEach((api: string) => combinedApiPaths.add(api));
  //   });
  //   this.permissiondataSource.forEach(item => {
  //     const perms = permissionMap[item.function];
  //     if (!perms) return;

  //     item.isCreate = !!(
  //       perms.CREATE &&
  //       (combinedPrivileges.has(perms.CREATE.privilege) || combinedApiPaths.has(perms.CREATE.api))
  //     );
  //     item.isView = !!(
  //       perms.VIEW &&
  //       (combinedPrivileges.has(perms.VIEW.privilege) || combinedApiPaths.has(perms.VIEW.api))
  //     );
  //     item.isUpdate = !!(
  //       perms.UPDATE &&
  //       (combinedPrivileges.has(perms.UPDATE.privilege) || combinedApiPaths.has(perms.UPDATE.api))
  //     );
  //     item.isDelete = !!(
  //       perms.DELETE &&
  //       (combinedPrivileges.has(perms.DELETE.privilege) || combinedApiPaths.has(perms.DELETE.api))
  //     );
  //     item.isGetAll = !!(
  //       perms.GETALL &&
  //       (combinedPrivileges.has(perms.GETALL.privilege) || combinedApiPaths.has(perms.GETALL.api))
  //     );
  //     item.isSearch = !!(
  //       perms.SEARCH &&
  //       (combinedPrivileges.has(perms.SEARCH.privilege) || combinedApiPaths.has(perms.SEARCH.api))
  //     );
  //     item.isUpload = !!(
  //       perms.UPLOAD &&
  //       (combinedPrivileges.has(perms.UPLOAD.privilege) || combinedApiPaths.has(perms.UPLOAD.api))
  //     );
  //     item.isExport = !!(
  //       perms.EXPORT &&
  //       (combinedPrivileges.has(perms.EXPORT.privilege) || combinedApiPaths.has(perms.EXPORT.api))
  //     );
  //     item.isApprove = !!(
  //       perms.APPROVE &&
  //       (combinedPrivileges.has(perms.APPROVE.privilege) || combinedApiPaths.has(perms.APPROVE.api))
  //     );
  //     item.isReject = !!(
  //       perms.REJECT &&
  //       (combinedPrivileges.has(perms.REJECT.privilege) || combinedApiPaths.has(perms.REJECT.api))
  //     );
  //     item.isAll = item.isCreate && item.isView && item.isUpdate;
  //     switch (item.function) {
  //       case 'Document Management':
  //         item.isAll = item.isUpload && item.isView && item.isUpdate && item.isDelete && item.isGetAll && item.isSearch;
  //         break;
  //       case 'Activity Log Management':
  //         item.isAll = item.isView && item.isGetAll && item.isSearch && item.isExport;
  //         break;
  //       case 'Approval Management':
  //         item.isAll = item.isView && item.isGetAll && item.isSearch && item.isApprove && item.isReject;
  //         break;
  //       case 'Settings Management':
  //         item.isAll = item.isView && item.isUpdate;
  //         break;
  //       case 'Analytics Management':
  //         item.isAll = item.isView && item.isExport;
  //         break;
  //       case 'Dashoboard Management':
  //         item.isAll = item.isView;
  //         break;
  //       default:
  //         item.isAll = item.isCreate && item.isView && item.isUpdate && item.isDelete && item.isGetAll && item.isSearch;
  //         break;
  //     }
  //   });
  // }
  imageUrl!: any;
  imageRequiredMessage!: string;
  imageChangedEvent: any = '';
  type!: string;
  checkSize!: any;
  checkType!: boolean;
  invalidSizeMessage!: string;
  invalidTypeMessage!: string;
  finalImage!: any;
  fileName!: any;
  private imageModal: any;
  @ViewChild('imageModal') imageModalRef!: ElementRef;
  croppedImage!: string;
  fileChangeEvent(event: any) {
    //this.imageUrl = '';
    this.imageRequiredMessage = "";
    this.imageChangedEvent = event;
    let size = 0;
    if (this.imageChangedEvent.target.files['0'] != undefined) {
      size = this.imageChangedEvent.target.files['0'].size;
      this.type = this.imageChangedEvent.target.files['0'].type;
    }
    size = Math.round((size / 1024));
    if (size > 2000) {
      this.checkSize = true;
      this.checkType = false;
      this.invalidSizeMessage = "Image size must be less than 2MB";
      // this.imageUrl = this.OrganizationLogo;
    }
    else {
      this.checkSize = false;
    }
    // let reader = new FileReader();
    // reader.onload = function (e) {
    //   let image = new Image();
    //   image.src = reader.result;

    // }
    if (this.type == 'image/gif' || this.type == 'image/jpeg' || this.type == 'image/jpg' || this.type == 'image/png') {
      this.checkType = false;
    }
    else {
      this.checkType = true;
      this.invalidTypeMessage = "Allowed file type(s) are- .JPG, .PNG, .GIF";
    }
    if (!this.checkSize && !this.checkType) {
      let file = event.target.files[0];
      this.finalImage = event.target.files[0];
      this.fileName = file.name;
      if (this.finalImage) {
        this.openCropDialog(event);
      }
    }
  }
  cancelImage(): void {
    this.imageChangedEvent = '';
    this.croppedImage = '';
    if (this.imageModal) this.imageModal.hide();
  }
  openCropDialog(event: any) {
    const dialogRef = this.dialog.open(ImageCropDialog, {
      width: '600px',
      data: { imageChangedEvent: event }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.croppedImage = result.croppedImage;
        // Use the cropped image (base64 string)
        this.confirmFileUpload(result.finalImage);
      }
    });
  }
  confirmFileUpload(ImageData: any) {
    const formData = new FormData();
    // Append the file
    formData.append('file', ImageData);
    // Append metadata fields
    formData.append('filename', 'PROFILE_IMAGE');
    // formData.append('fileType', ImageData.type);
    // formData.append('title', metadata.title ?? '');
    formData.append('prefixFolder', "PROFILE");
    // formData.append('size', ImageData.size.toString());
    let apiUrl = this.postService.getBaseUrl() + APIPath.FILE_UPLOAD;
    return this.http.post(apiUrl, formData).subscribe((res: any) => {
      this.customerObj.image = res.object;
    }, (error) => {
      console.log(error);
    });
  }
}
interface Permission {
  function: string;
  create: boolean;
  edit: boolean;
}
export class User {
  username!: string;
  email!: string;
  department!: Array<string>;
  role!: Array<string>;
  avatar!: string;
  lastActive!: string;
  mobileNumber!: string;
  employeeId!: string;
}
export interface Action {
  privilege: string;
  api: string;
}
export type ActionType = 'CREATE' | 'VIEW' | 'UPDATE' | 'DELETE' | 'GETALL' | 'SEARCH' | 'DOWNLOAD' | 'UPLOAD' | 'APPROVE' | 'REJECT' | 'EXPORT';
export interface FunctionPermissionMap {
  [functionName: string]: {
    [action in ActionType]?: Action;
  };
}
export const permissionMap: FunctionPermissionMap = {
  'User Management': {
    CREATE: { privilege: "001", api: '/api/v1/uam/user/create' },
    VIEW: { privilege: "002", api: '/api/v1/uam/user/view' },
    UPDATE: { privilege: "003", api: '/api/v1/uam/user/edit' },
    DELETE: { privilege: "004", api: '/api/v1/uam/user/delete' },
    GETALL: { privilege: "005", api: '/api/v1/uam/user/getAll' },
    SEARCH: { privilege: "006", api: '/api/v1/uam/user/search' }
  },
  'Role Management': {
    CREATE: { privilege: "007", api: '/api/v1/uam/role/create' },
    VIEW: { privilege: "008", api: '/api/v1/uam/role/view' },
    UPDATE: { privilege: "009", api: '/api/v1/uam/role/edit' },
    DELETE: { privilege: "010", api: '/api/v1/uam/role/delete' },
    GETALL: { privilege: "011", api: '/api/v1/uam/role/getAll' },
    SEARCH: { privilege: "012", api: '/api/v1/uam/role/search' }
  },
  'Document Management': {
    UPLOAD: { privilege: "013", api: '/api/v1/documents/upload' },
    // CREATE: { privilege: "013", api: '/api/v1/documents/upload' },
    VIEW: { privilege: "014", api: '/api/v1/documents/view' },
    UPDATE: { privilege: "015", api: '/api/v1/documents/edit' },
    DELETE: { privilege: "016", api: '/api/v1/documents/delete' },
    GETALL: { privilege: "017", api: '/api/v1/documents/getAll' },
    SEARCH: { privilege: "018", api: '/api/v1/documents/search' }
  },
  'Activity Log Management': {
    // CREATE: { privilege: "73", api: '/api/v1/admin/serviceDirectory/cre' },
    VIEW: { privilege: "019", api: '/api/v1/logs/view' },
    // UPDATE: { privilege: "36", api: '/api/v1/admin/serviceDirectory/upd' },
    // DELETE: { privilege: "62", api: '/api/v1/admin/serviceDirectory/del' },
    GETALL: { privilege: "020", api: '/api/v1/logs/getAll' },
    SEARCH: { privilege: "021", api: '/api/v1/logs/search' },
    EXPORT: { privilege: "022", api: '/api/v1/logs/export' }
  },
  'Approval Management': {
    // CREATE: { privilege: "21", api: '/api/v1/admin/bin/cre' },
    VIEW: { privilege: "023", api: '/api/v1/approvals/view' },
    APPROVE: { privilege: "024", api: '/api/v1/approvals/approve' },
    REJECT: { privilege: "025", api: '/api/v1/approvals/reject' },
    // UPDATE: { privilege: "39", api: '/api/v1/approvals/upd' },
    // DELETE: { privilege: "64", api: '/api/v1/approvals/del' },
    GETALL: { privilege: "026", api: '/api/v1/approvals/getAll' },
    SEARCH: { privilege: "027", api: '/api/v1/approvals/search' }
  },
  'Category Management': {
    CREATE: { privilege: "028", api: '/api/v1/category/create' },
    VIEW: { privilege: "029", api: '/api/v1/category/view' },
    UPDATE: { privilege: "030", api: '/api/v1/category/edit' },
    DELETE: { privilege: "031", api: '/api/v1/category/delete' },
    GETALL: { privilege: "032", api: '/api/v1/category/getAll' },
    SEARCH: { privilege: "033", api: '/api/v1/category/search' }
  },
  'Settings Management': {
    // CREATE: { privilege: "45", api: '/api/v1/admin/schemeConnection/cre' },
    VIEW: { privilege: "034", api: '/api/v1/settings/view' },
    UPDATE: { privilege: "035", api: '/api/v1/settings/edit' },
    // DELETE: { privilege: "38", api: '/api/v1/admin/schemeConnection/del' },
    // GETALL: { privilege: "35", api: '/api/v1/admin/schemeConnection/getall' },
    // SEARCH: { privilege: "93", api: '/api/v1/admin/schemeConnection/search' }
  },
  'Analytics Management': {
    // CREATE: { privilege: "45", api: '/api/v1/admin/schemeConnection/cre' },
    VIEW: { privilege: "036", api: '/api/v1/analytics/view' },
    EXPORT: { privilege: "037", api: '/api/v1/analytics/export' },
    // DELETE: { privilege: "38", api: '/api/v1/admin/schemeConnection/del' },
    // GETALL: { privilege: "35", api: '/api/v1/admin/schemeConnection/getall' },
    // SEARCH: { privilege: "93", api: '/api/v1/admin/schemeConnection/search' }
  },
  'Dashoboard Management': {
    // CREATE: { privilege: "45", api: '/api/v1/admin/schemeConnection/cre' },
    VIEW: { privilege: "038", api: '/api/v1/dashboard/view' },
    // UPDATE: { privilege: "035", api: '/api/v1/settings/edit' },
    // DELETE: { privilege: "38", api: '/api/v1/admin/schemeConnection/del' },
    // GETALL: { privilege: "35", api: '/api/v1/admin/schemeConnection/getall' },
    // SEARCH: { privilege: "93", api: '/api/v1/admin/schemeConnection/search' }
  },
};
export class UserRole {
  name!: string;
  function!: string;
}


