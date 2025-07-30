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
    type!: 'success' | 'error';
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
export class Customer {
    name!: string;
    mobile!: string;
    email!: string;
    scheme!:string;
    businessName!: string;
    image!:any;
    aadhar!:string;
    pan!:string;
}