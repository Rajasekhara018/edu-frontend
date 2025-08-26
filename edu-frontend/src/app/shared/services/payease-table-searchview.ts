import { Injectable } from '@angular/core';
import { APIPath } from '../api-enum';
import { Router } from '@angular/router';
import { PayeaseRestservice } from './payease-restservice';

@Injectable({
  providedIn: 'root'
})
export class PayeaseTableSearchview {
  getSearchAPIPATH(tableID: string): APIPath {
    throw new Error('Method not implemented.');
  }
  searchText!: string;
  constructor(private router: Router,
    public postService: PayeaseRestservice) { }

  public getHeadTitle(tableID: string) {
    let returnValue = '';
    switch (tableID) {
      case 'GET_ROLES':
        returnValue = 'Roles';
        break;
      case 'GET_USERS':
        returnValue = 'Users';
        break;
      case 'GET_CUSTOMERS':
        returnValue = 'List of Customers';
        break;
      default:
        break;
    }
    return returnValue;
  }
  public getSubDescription(tableID: string) {
    let returnValue = '';
    switch (tableID) {
      case 'GET_USER':
        returnValue = 'Use User name in your input to search for records containing the search input';
        break;
      case 'GET_CUSTOMERS':
        returnValue = 'List of Customers';
        break;
      default:
        break;
    }
    return returnValue;
  }
  public getColumnName(tableID: string): { displayedColumns: string[], columnNames: { [key: string]: string } } {
    let columnNames: { [key: string]: string } = {};
    let displayedColumns: string[] = [];

    switch (tableID) {
      case 'GET_PRIVILEGES':
        columnNames = {
          id: 'Number',
          type: 'Type',
          name: 'User Description',
          action: ''
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_ROLES':
        columnNames = {
          description: 'Description',
          roleName: 'Title',
          action: 'Actions',
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_CUSTOMERS':
        columnNames = {
          fullName: 'Name',
          phNo: 'Mobile',
          emailId: 'Email Address',
          businessName: 'Business Name',
          aadharNo: 'Aadhar No',
          panNo: 'Pan No',
          roles: 'ROLE',
          status: 'STATUS',
          action: 'Actions',
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_USERS':
        columnNames = {
          image: 'USER',
          // fullName: 'Name',
          // email: 'Email',
          roles: 'ROLE',
          department: 'DEPARTMENT',
          status: 'STATUS',
          lastLoginAt: 'LAST ACTIVE',
          action: 'ACTIONS',
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_USER':
        columnNames = {
          firstName: 'Name',
          clientUserId: 'ID',
          email: 'Email Id',
          isActive: 'Status',
          action: ''
        }
        displayedColumns = Object.keys(columnNames);
        break;
      default:
        break;
    }
    return { displayedColumns, columnNames };
  }
  public getDisplayedColumns(tableID: string) {
    let columnName!: string[];
    switch (tableID) {
      case 'GET_PRIVILEGES':
        columnName = ['id', 'type', 'userdescription', 'email', 'status', 'action'];
        break;
      case 'GET_ROLES':
        columnName = ['description', 'roleName', 'action'];
        break;
      case 'GET_USERS':
        columnName = ['image', 'name', 'email', 'roles', 'department', 'status', 'lastLoginAt', 'action'];
        break;
      case 'GET_CUSTOMERS':
        columnName = ['fullName', 'phNo', 'emailId', 'businessName', 'aadharNo', 'panNo', 'action'];
        break;
    }
    return columnName;
  }

  public getAPIPath(tableID: string) {
    this.searchText = '';
    let columnName: APIPath;
    switch (tableID) {
      case 'GET_ROLES':
        columnName = APIPath.ROLE_GETALL;
        break;
      case 'GET_USERS':
        columnName = APIPath.USER_GETALL;
        break;
      case 'GET_CUSTOMERS':
        columnName = APIPath.CUSTOMER_GETALL;
        break;
      default:
        break;
    }
    return columnName!;
  }
  public goToCreate(tableID: string) {
    let creurl: string;
    switch (tableID) {
      case 'GET_USER':
        creurl = 'config/user/cre/';
        break;
      case 'GET_CUSTOMERS':
        creurl = '/dashboard/customers/cre';
        break;
      default:
        break;
    }
    this.router.navigate([creurl!]);
  }
  public goToInq(tableID: string, modelKey: string) {
    let inqurl: string;
    switch (tableID) {
      case 'GET_ROLES':
        inqurl = 'usermanagement/role/' + modelKey;
        break;
      case 'GET_USER':
        inqurl = 'usermanagement/user/' + modelKey;
        break;
      case 'GET_PRIVILEGES':
        inqurl = 'usermanagement/privilege/' + modelKey;
        break;
      case 'GET_CUSTOMERS':
        inqurl = '/dashboard/customers/'+ modelKey;
        break;
      default:
        break;
    }
    this.router.navigateByUrl(inqurl!);
  }
}