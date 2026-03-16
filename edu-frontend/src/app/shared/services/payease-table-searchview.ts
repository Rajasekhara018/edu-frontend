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
      case 'GET_USERS':
        returnValue = 'Users';
        break;
      default:
        break;
    }
    return returnValue;
  }
  public getSubDescription(tableID: string) {
    let returnValue = '';
    switch (tableID) {
      case 'GET_USERS':
        returnValue = 'Use User name in your input to search for records containing the search input';
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
      case 'GET_USERS':
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
      default:
        break;
    }
    return { displayedColumns, columnNames };
  }
  public getDisplayedColumns(tableID: string) {
    let columnName!: string[];
    switch (tableID) {
      case 'GET_USERS':
        columnName = ['fullName', 'phNo', 'emailId', 'businessName', 'aadharNo', 'panNo', 'action'];
        break;
    }
    return columnName;
  }

  public getAPIPath(tableID: string) {
    this.searchText = '';
    let columnName: APIPath;
    switch (tableID) {
      case 'GET_USERS':
        columnName = APIPath.USER_GETALL;
        break;
      default:
        break;
    }
    return columnName!;
  }
  public goToCreate(tableID: string) {
    let creurl: string;
    switch (tableID) {
      case 'GET_USERS':
        creurl = '/dashboard/user/cre';
        break;
      default:
        break;
    }
    this.router.navigate([creurl!]);
  }
  public goToInq(tableID: string, modelKey: string) {
    let inqurl: string;
    switch (tableID) {
      case 'GET_USERS':
        inqurl ='/dashboard/user/'+ modelKey;
        break;
      default:
        break;
    }
    this.router.navigateByUrl(inqurl!);
  }
}