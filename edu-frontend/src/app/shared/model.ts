export class ErrorMessageModule {
    errorID!: string;
    errorMessage!: string;
    multipleMessage!: Array<DetailErrorModule>;
}
export class DetailErrorModule {
    fieldName!: string;
    fieldValue!: string;
    message!: string;
}

export class ToastMessage {
    id!: number;
    type!: 'success' | 'error' | 'warn' | 'info';
    text!: string;
}

export class ResObjectModule {
    responseCode!: string;
    authorizationResponseCode!: string;
    token(arg0: string, token: any) {
        throw new Error('Method not implemented.');
    }
    message(message: any, arg1: string, arg2: { duration: number; panelClass: string[]; }) {
        throw new Error('Method not implemented.');
    }
    messageID!: string;
    requestType!: string;
    userData!: string;
    success!: boolean;
    errors!: Array<string>;
    detailErrors!: Array<DetailErrorModule>;
    object!: Object;
    redirectURL!: string;
    responseObject: any;
}
export class CommonReqObjectVo {
    key_Index!: string;
    updEncryptionPubVal!: string;
    inqEncryptionKey!: string;
    requestObject!: any;
    page!: number;
    size!: number;
    sortField!: string;
    sortOrder!: string;
}
export class CommonInqReqObject {
    id!: any;
}
export class CommonReqObject {
    page!: number;
    size!: number;
    sortField!: string;
    sortOrder!: string;
}
export class User {
    fullName!: string;
    businessName!: string;
    emailId!: string;
    phNo!: string;
    userName!: string;
    password!: string;
    oldPassword!: string;
    forcePasswordChange!: boolean;
    aadharNo!: string;
    panName!: string;
    panNo!: string;
    dateOfBirth!: string;        // could also be Date if you want
    address!: string;
    businessAddress!: string;
    adminUser!: boolean;
    distributeUser!: boolean;
    retailUser!: boolean;
    distributeId!: string;
    profilePicLocation!: string;
    retailerAccountDetails!:string;
    distributorAccountDetails!:string;
}

export class RequestObject {
    reqType!: string; // "CREATE" ""
    filters!: { [key: string]: any };  // key-value pairs like a Map
    key!: string;
    object!: any;
}

export class ResponseObject {
    status!: boolean;
    object: any;
    errorMsg!: string;
}

export class DistributorOption {
  id!: string;
  label!: string;
  status?: string;
}

export class DistributorProfile {
  id!: string;
  name!: string;
  status!: string;
  baseRate!: string;
}

export class AgentProfile {
  id!: string;
  distributorId!: string;
  name!: string;
  channel!: string;
}

export class CommissionRule {
  scope!: 'Distributor' | 'Agent';
  ownerName!: string;
  paymentType!: string;
  distributorRate!: string;
  agentRate!: string;
  mode!: string;
  cap!: string;
  status!: string;
}
