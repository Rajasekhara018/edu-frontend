import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { APIPath } from '../api-enum';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PayeaseTableSearchview } from '../services/payease-table-searchview';
import { PayeaseRestservice } from '../services/payease-restservice';

@Component({
  selector: 'app-pay-ease-common-table',
  standalone: false,
  templateUrl: './pay-ease-common-table.html',
  styleUrl: './pay-ease-common-table.scss'
})
export class PayEaseCommonTable implements OnInit {
  reqFS!: boolean;
  ctFields: any = [];
  // breadCrumb = new Array<OPSMenu>();
  columnName: any;
  headTitle = '';
  subTitle = '';
  pageEvent!: PageEvent;
  pageNumber = 0;
  displayedColumns!: string[];
  dataSource!: any;
  modelKey!: string;
  messageId!: APIPath;
  @Input() tableID!: string;
  private routeSubscription!: Subscription;
  isSearch!: boolean;
  id!: string;
  type!: string;
  userDescription!: string;
  roleDescription!: string;
  description!: string;
  roleTitle!: string;
  firstName!: string;
  clientUserId!: string;
  email!: string;
  status!: string;
  number!: string;
  service!: string;
  providerId!: string;
  name!: string;
  clearRes!: boolean;
  additionalField: { label: string; name: string }[] = [];
  @ViewChild('commonTableSort') commonTableSort!: MatSort;
  @ViewChild('commonTablePaginator') commonTablePaginator!: MatPaginator;
  // Paginator
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  totalElements: number = 0;
  constructor(public tableService: PayeaseTableSearchview, private route: ActivatedRoute,
    public postService: PayeaseRestservice, private router: Router, public dialog: MatDialog
  ) {
    this.route.params.subscribe(routeParams => {
      this.tableID = routeParams?.['id'];
    });
    this.clearFields();
  }
  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(routeParams => {
      if (routeParams['id']) {
        this.tableID = routeParams['id'];
      }
      this.getTable();
      this.additionalField = [];
    });
    // const bc = [
    //   { "name": 'Home', "link": "/home" },
    //   { "name": 'Disputes', "link": "/clearing&Settlement/disputes" },
    // ];
    // this.breadCrumb = bc;
    this.isSearch = false;
  }
  searchField!: any;
  getTable() {
    this.clearFields();
    this.headTitle = this.tableService.getHeadTitle(this.tableID);
    this.subTitle = this.tableService.getSubDescription(this.tableID);
    const columnsData = this.tableService.getColumnName(this.tableID);
    this.displayedColumns = columnsData.displayedColumns;
    this.columnName = columnsData.columnNames;
    this.commonGetallCall(this.pageNumber, this.pageSize);
  }
  commonGetallCall(pageNumber: any, pageSize: any) {
    this.postService.doPostGetAll(this.tableService.getAPIPath(this.tableID), pageNumber, pageSize).subscribe((data: any) => {
      if (data.status) {
        const result = data?.object?.content;
        this.dataSource = result;
        this.postService.showToast('success', data.errorMsg);
        this.totalElements = data?.object?.totalElements;
        this.pageSize = data.pageable.pageSize;
        this.currentPage = data.pageable.pageNumber + 1;
        this.isLoading = true;
      } else {
        this.postService.showToast('error', data.errorMsg);
      }
    },
      (error: any) => {
        this.isLoading = false;
        this.postService.showToast('error', error?.message?.toString());
      }
    )
  }
  getNestedValue(element: any, column: string): any {
    return column.split('.').reduce((acc, key) => acc && acc[key], element);
  }
  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
  gotoInqRecord(element: any) {
    this.tableService.goToInq(this.tableID, element.id);
  }
  getAllErr(output: any) { }
  clearFields() {
    this.id = '';
    this.type = '';
    this.userDescription = '';
    this.roleDescription = '';
    this.description = '';
    this.roleTitle = '';
    this.firstName = '';
    this.clientUserId = '';
    this.email = '';
    this.status = '';
    this.number = '';
    this.name = '';
    this.pageNumber = 0;
    this.commonGetallCall(this.pageNumber, this.pageSize);
  }

  clearResult() {
    this.clearRes = false;
    this.clearFields();
  }
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.commonGetallCall(this.currentPage - 1, this.pageSize); // server expects 0-based page
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.commonGetallCall(0, this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.totalElements);
  }
  get visiblePages(): number[] {
    const maxVisible = 3;
    const pages = [];
    const start = Math.max(1, this.currentPage - 1);
    const end = Math.min(this.totalPages, start + maxVisible - 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
  deleteRecord(data: any) {

  }
  downloadReport(data: any) {

  }
  readRow(tableID: any, data: any) {

  }
  isLoading!: boolean;
  // editRow(tableID: any, data: any) {
  //   switch (tableID) {
  //     case 'GET_USERS':
  //       this.router.navigate(['/add-users/' + data.id]);
  //       return;
  //     case 'GET_ROLES':
  //       this.router.navigate(['/add-roles/' + data.id]);
  //       return;
  //   }
  // }
  // newRow(tableID: string) {
  //   switch (tableID) {
  //     case 'GET_USERS':
  //       this.router.navigate(['/add-users/cre']);
  //       return;
  //     case 'GET_ROLES':
  //       this.router.navigate(['/add-roles/cre']);
  //       return;
  //     case 'GET_CUSTOMERS':
  //       this.router.navigate(['/dashboard/customers/cre']);
  //       return;
  //   }
  // }
  getRoles(user: any): string[] {
    const roles: string[] = [];
    if (user.adminUser) roles.push('Admin');
    if (user.distributeUser) roles.push('Distributor');
    if (user.retailUser) roles.push('Retailer');
    return roles;
  }
  getUserStatusLabel(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'INACTIVE': return 'Inactive';
      case 'PENDING_VERIFICATION': return 'Pending';
      case 'BLOCKED': return 'Blocked';
      case 'SUSPENDED': return 'Suspended';
      case 'DEACTIVATED': return 'Deactivated';
      case 'LOCKED': return 'Locked';
      case 'EXPIRED': return 'Expired';
      case 'DISABLED': return 'Disabled';
      case 'ARCHIVED': return 'Archived';
      case 'INVITED': return 'Invited';
      default: return 'Unknown';
    }
  }

  getUserStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'bg-success';
      case 'INACTIVE': return 'bg-secondary';
      case 'PENDING_VERIFICATION': return 'bg-warning text-dark';
      case 'BLOCKED': return 'bg-danger';
      case 'SUSPENDED': return 'bg-dark';
      case 'DEACTIVATED': return 'bg-secondary';
      case 'LOCKED': return 'bg-danger';
      case 'EXPIRED': return 'bg-info';
      case 'DISABLED': return 'bg-secondary';
      case 'ARCHIVED': return 'bg-light text-dark';
      case 'INVITED': return 'bg-primary';
      default: return 'bg-light text-dark';
    }
  }
}

