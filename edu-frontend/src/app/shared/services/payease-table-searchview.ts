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
      default:
        break;
    }
    return returnValue;
  }
  public getSubDescription(tableID: string) {
    let returnValue = '';
    switch (tableID) {
      case 'GET_TRANSACTIONS':
        // returnValue = 'Use Transaction Id in your input to search for records containing the search input';
        break;
      case 'GET_PAYMENTS':
        // returnValue = 'Use Payment Id in your input to search for records containing the search input';
        break;
      case ' GET_ORCHESTRATION_VOLUMEBASED':
      case ' GET_ORCHESTRATION_RULEBASED':
      case 'GET_ORCHESTRATION':
        returnValue = 'Use Orchestration Id in your input to search for records containing the search input';
        break;
      case 'GET_BILLING_PROCESSOR':
        returnValue = 'Use Payment Processor Id in your input to search for records containing the search input';
        break;
      case 'GET_PAYMENT_PROCESSOR':
        returnValue = 'Processors configured in the system currently.';
        break;
      case 'GET_USER':
        // returnValue = 'Use User name in your input to search for records containing the search input';
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
      case 'GET_TRANSACTIONS':
        columnNames = {
          sno: 'S.No',
          merchantNumber: 'Merchant Number',
          terminal: 'Terminal',
          txntype: 'Txn Type',
          paymentmethod: 'Payment Method',
          ruleid: 'Rule Id',
          pg: 'PG',
          dateandtime: 'Date & Time',
          amount: 'Amount',
          status: 'Status'
        };
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_PAYMENTS':
        columnNames = {
          sno: 'S.No',
          merchantNumber: 'Merchant Number',
          pg: 'PG',
          settlementcycle: 'Settlement Cycle',
          paymentDate: 'Payment Date',
          amount: 'Amount',
          status: 'Status'
        }
        displayedColumns = Object.keys(columnNames);
        break;
      // case 'GET_ORCHESTRATION_VOLUMEBASED':
      //   columnNames = {
      //     sno: 'S.No',
      //     id: 'Rule Id',
      //     mcc: 'Business',
      //     ruleCreatedDate: 'Date created',
      //     active: 'Status',
      //     ruleCreatedBy: 'Created by',
      //     pg: 'PG',
      //     volume: 'Volume',
      //   }
      //   displayedColumns = Object.keys(columnNames);
      //   displayedColumns.push('action');
      //   break;
      case 'GET_ORCHESTRATION_RULEBASED':
      case 'GET_ORCHESTRATION_THREEDS':
      case 'GET_ORCHESTRATION_DEFAULT':
      case 'GET_ORCHESTRATION_VOLUMEBASED':
        columnNames = {
          sno: 'S.No',
          id: 'Rule id',
          mcc: 'Business',
          ruleCreatedDate: 'Date created',
          active: 'Status',
          statusDate: 'Status date',
          ruleCreatedBy: 'Created by'
        }
        displayedColumns = Object.keys(columnNames);
        displayedColumns.push('action');
        break;
      case 'GET_ORCHESTRATION':
        columnNames = {
          ruleId: 'Rule Id',
          status: 'Status',
          createdOn: 'Created On',
          statusDate: 'Status Date',
          createdBy: "Created By",
          pg: "PG",
          statusdate: "Status date"
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_BILLING_PROCESSOR':
      case 'GET_PAYMENT_PROCESSOR':
        columnNames = {
          name: 'Name',
          status: 'Status',
          avgticketsize: 'Avg Ticket Size',
          transactions: 'Transactions',
          payments: 'Payments',
          risk: 'Risk',
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_PRIVILEGES':
        columnNames = {
          id: 'Number',
          type: 'Type',
          name: 'User Description',
          action: ''
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_ACCOUNT':
        columnNames = {
          name: 'Full Name',
          description: 'Business Description',
          primaryContactEmail: 'Email Id',
          status: 'Status',
          action: ''
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_SERVICE':
        columnNames = {
          name: 'Name',
          id: 'Provider Id',
          service: 'Service Name',
          action: ''
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_SERVICEPROVIDER':
        columnNames = {
          providerId: 'Provider Id',
          name: 'Service Name'
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
      case 'GET_USERS':
        columnNames = {
          image:'USER',
          // fullName: 'Name',
          // email: 'Email',
          roles: 'ROLE',
          department:'DEPARTMENT',
          status: 'STATUS',
          lastLoginAt:'LAST ACTIVE',
          action: 'ACTIONS',
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_CLIENT_INFO':
        columnNames = {
          firstName: 'Name',
          email: 'Email',
          'primaryContactDetails.number': 'Contact Number',
          status: 'Status',
          action: '',
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
      case 'GET_TEMPLATE_EMAIL':
      case 'GET_TEMPLATE_NOTIFICATION':
      case 'GET_TEMPLATE_SMS':
      case 'GET_TEMPLATE_WHATSAPP':
        columnNames = {
          name: 'Name',
          type: 'Type',
          event: 'Event',
          action: 'Actions'
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_EXTERNAL':
      case 'GET_INTERNAL':
        columnNames = {
          profileName: 'Name',
          description: 'Description',
          lastedit: 'Last Edit',
          action: 'Actions'
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
      case 'GET_TRANSACTIONS':
        columnName = ['sno', 'merchantNumber', 'terminal', 'txntype', 'paymentmethod', 'ruleid', 'pg', 'dateandtime', 'amount', 'status'];
        break;
      case 'GET_PAYMENTS':
        columnName = ['sno', 'merchantNumber', 'pg', 'settlementcycle', 'paymentDate', 'amount', 'status'];
        break;
      // case 'GET_ORCHESTRATION_VOLUMEBASED':
      //   columnName = ['sno', 'id', 'mcc', 'ruleCreatedDate', 'active', 'ruleCreatedBy', 'pg', 'volume'];
      //   break;
      case 'GET_ORCHESTRATION_RULEBASED':
      case 'GET_ORCHESTRATION_THREEDS':
      case 'GET_ORCHESTRATION_VOLUMEBASED':
      case 'GET_ORCHESTRATION_DEFAULT':
        columnName = ['sno', 'id', 'mcc', 'ruleCreatedDate', 'active', 'statusDate', 'ruleCreatedBy'];
        break;
      case 'GET_ORCHESTRATION':
        columnName = ['ruleId', 'status', 'createdOn', 'statusDate', 'createdBy', 'pg', 'statusdate'];
        break;
      case 'GET_BILLING_PROCESSOR':
      case 'GET_PAYMENT_PROCESSOR':
        columnName = ['name', 'status', 'avgticketsize', 'transactions', 'payments', 'risk'];
        break;
      case 'GET_PRIVILEGES':
        columnName = ['id', 'type', 'userdescription', 'email', 'status', 'action'];
        break;
      case 'GET_ACCOUNT':
        columnName = ['name', 'description', 'primaryContactEmail', 'action'];
        break;
      case 'GET_SERVICE':
        columnName = ['name', 'id', 'service', 'action'];
        break;
      case 'GET_SERVICEPROVIDER':
        columnName = ['providerId', 'name'];
        break;
      case 'GET_ROLES':
        columnName = ['description', 'roleName', 'action'];
        break;
      case 'GET_USERS':
        columnName = ['image','name', 'email', 'roles','department', 'status','lastLoginAt', 'action'];
        break;
      case 'GET_TEMPLATE_EMAIL':
      case 'GET_TEMPLATE_NOTIFICATION':
      case 'GET_TEMPLATE_SMS':
      case 'GET_TEMPLATE_WHATSAPP':
        columnName = ['name', 'type', 'event', 'action'];
        break;
      default:
        break;
      case 'GET_EXTERNAL':
      case 'GET_INTERNAL':
        columnName = ['profileName', 'description', 'lastedit', 'action'];
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
      default:
        break;
    }
    return columnName!;
  }
  public goToCreate(tableID: string, uniqueText: string, copyRecordId: string) {
    let creurl: string;
    switch (tableID) {
      case 'GET_TRANSACTIONS':
        creurl = '/transactions/cre/' + window.btoa(encodeURIComponent(uniqueText));
        break;
      case 'GET_PAYMENTS':
        creurl = '/payments/cre/' + window.btoa(encodeURIComponent(uniqueText));
        break;
      case 'GET_ORCHESTRATION_VOLUMEBASED':
      case 'GET_ORCHESTRATION_RULEBASED':
      case 'GET_ORCHESTRATION_DEFAULT':
      case 'GET_ORCHESTRATION_THREEDS':
      case 'GET_ORCHESTRATION':
        creurl = 'orchestration/transction/cre/' + window.btoa(encodeURIComponent(uniqueText));
        break;
      case 'GET_BILLING_PROCESSOR':
        creurl = 'processor/billing-processors/cre/' + window.btoa(encodeURIComponent(uniqueText));
        break;
      case 'GET_PAYMENT_PROCESSOR':
        creurl = 'processor/payment-processors/cre/' + window.btoa(encodeURIComponent(uniqueText));
        break;
      case 'GET_USER':
        creurl = 'config/user/cre/' + window.btoa(encodeURIComponent(uniqueText));
        break;
      default:
        break;
    }
    let copyId: string;
    if (copyRecordId) {
      copyId = window.btoa(encodeURIComponent(copyRecordId));
    }
    this.router.navigate([creurl!], { queryParams: { copyRecordId: copyId! } });
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
      case 'GET_CLIENT_INFO':
        inqurl = 'usermanagement/client/' + modelKey;
        break;
      case 'GET_ACCOUNT':
        inqurl = 'usermanagement/admin/' + modelKey;
        break;
      case 'GET_EXTERNAL':
      case 'GET_INTERNAL':
        inqurl = 'communication/communicationprofile/' + modelKey;
        break;
      case 'GET_TEMPLATE_NOTIFICATION':
      case 'GET_TEMPLATE_WHATSAPP':
      case 'GET_TEMPLATE_SMS':
      case 'GET_TEMPLATE_EMAIL':
        inqurl = 'communication/communicationtemplates/' + modelKey;
        break;
      case 'GET_SERVICE':
        inqurl = 'configuration/servicedir/' + modelKey;
        break;
      default:
        break;
    }
    this.router.navigateByUrl(inqurl!);
  }
}