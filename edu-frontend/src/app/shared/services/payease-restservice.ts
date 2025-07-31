import { Injectable } from '@angular/core';
import { CommonInqReqObject, CommonReqObject, CommonReqObjectVo, DetailErrorModule, ErrorMessageModule, RequestObject, ResObjectModule, ResponseObject, ToastMessage } from '../model';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { APIPath } from '../api-enum';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PayeaseRestservice {
  // localNotifs: Array<NotifObj> = new Array<NotifObj>();
  public message: any = new Subject();
  public isMobileMenu = false
  public isMobile = false;
  isCollapsed = true;
  fileType: any
  constructor(public http: HttpClient, public router: Router, public snackBar: MatSnackBar, public datepipe: DatePipe,
    private currencyPipe: CurrencyPipe
  ) {
  }
  // GetAll
  getAllData(messageID: any,) {
    let token = localStorage.getItem('token')!;
    const jwtToken = 'Bearer ' + token;
    const httpOptions = new HttpHeaders({ 'Content-Type': 'application/json;', 'Authorization': jwtToken, });
    let apiUrl = this.getBaseUrl() + messageID;
    return this.http.get(apiUrl, { headers: httpOptions });
  }
  // Edit
  getdata(apiURL: any, id: string) {
    const httpOptions = new HttpHeaders({ 'Content-Type': 'application/json;' });
    return this.http.get(`${apiURL}/${id}`, { headers: httpOptions });
  }
  //Create
  postdata(apiURL: string, obj: any) {
    const httpOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(apiURL, obj, { headers: httpOptions })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Handle the error here
          console.error('Error occurred:', error);
          return throwError(error); // Rethrow the error for further handling
        })
      );
  }
  // Update
  update(apiURL: any, id: string, obj: any) {
    return this.http.put(`${apiURL}/${id}`, obj)
  }
  // Delete
  delete(apiURL: any, id: string) {
    const httpOptions = new HttpHeaders({ 'Content-Type': 'application/json;' });
    this.http.delete(`${apiURL}/${id}`, { headers: httpOptions }).subscribe(() => {
      localStorage.clear();
      sessionStorage.clear();
    }, (err: any) => {
      console.log(err);
    })
  }
  private postObservable(reqData: any, messageID: string) {
    let token = localStorage.getItem('token');
    if (!token) {
      token = sessionStorage.getItem('token');
    }
    const jwtToken = 'Bearer ' + token;
    const httpOptions = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', Authorization: jwtToken });
    let apiUrl = '';
    apiUrl = this.getBaseUrl() + messageID;

    if (reqData.object) {
      let obj = this.modifyReqResp(reqData.object);
      reqData.object = obj;
    }
    return this.http.post<ResObjectModule>(apiUrl, JSON.stringify(reqData), { headers: httpOptions })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
  //Amount Validation
  amtValidate(value: any, currencyType: string) {
    if (value == '0') {
      return value;
    }
    if (value) {
      if (Number(value)) {
        return value;
      }
      else {
        let val = this.currencyPipe.transform(0, currencyType, true)!;
        let ctype = val.split('0')[0];
        if (value.includes(ctype)) {
          let amt = value?.replace(ctype, '');
          amt = amt?.replace(/,/g, '');
          if (Number(amt)) {
            return amt;
          } else {
            return null
          }
        } else {
          return null;
        }
      }
    }
    return null;
  }
  // Backend Create
  public doPost(messageId: APIPath, reqObj: any) {
    const reqData = new RequestObject();
    if (reqObj) {
      reqData.object = reqObj;
      reqData.reqType = "CREATE";
    }
    return this.postObservable(reqData, messageId);
  }
  // Backeng View
  // public doPostInq(messageId: APIPath, id: string) {
  //   const reqDataVo = new CommonReqObjectVo();
  //   const reqData = new CommonInqReqObject();
  //   reqData.id = id;
  //   reqDataVo.requestObject = reqData;
  //   return this.postObservable(reqDataVo, messageId);
  // }
  public doPostInq(messageId: APIPath, id: string) {
    return this.postObservableInq(messageId, id);
  }
  private postObservableInq(messageID: any, id: string) {
    let token = localStorage.getItem('token');
    if (!token) {
      token = sessionStorage.getItem('token');
    }
    const jwtToken = 'Bearer ' + token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: jwtToken
      })
    };
    let apiUrl = '';
    apiUrl = `${this.getBaseUrl()}${messageID}?id=${id}`;
    return this.http.post<ResponseObject>(apiUrl,null, httpOptions)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
  // Backeng Update
  public doPostUpd(messageId: APIPath, updObj: any) {
    const reqData = new CommonReqObjectVo();
    reqData.requestObject = updObj;
    return this.postObservable(reqData, messageId);
  }
  // Backend GetAll
  public doPostFindAll(messageID: string) {
    return this.postObservableFindAll(messageID);
  }
  private postObservableFindAll(messageID: string) {
    let token = localStorage.getItem('token');
    if (!token) {
      token = sessionStorage.getItem('token');
    }
    const jwtToken = 'Bearer ' + token;
    const httpOptions = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', Authorization: jwtToken });
    let apiUrl = '';
    apiUrl = this.getBaseUrl() + messageID;
    return this.http.get<ResObjectModule>(apiUrl, { headers: httpOptions })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
  // FindAll
  public doPostGetAll(messageId: APIPath,
    pageNumber: number, pageSize: number) {
    const reqDataVo = new CommonReqObjectVo();
    const reqData = new CommonReqObject();
    reqData.page = pageNumber;
    reqData.size = pageSize ?? (localStorage.getItem('DefaultPageSize') || sessionStorage.getItem('DefaultPageSize') || 6),
      reqData.sortField = 'text2';
    reqData.sortOrder = 'ASC'
    // reqDataVo.requestObject = reqData;
    return this.postObservable(reqData, messageId);
  }
  public doPostGetAllRoles(messageId: APIPath) {
    const reqDataVo = new CommonReqObjectVo();
    const reqData = new CommonReqObject();
    // reqData.page = pageNumber;
    // reqData.size = pageSize ?? (localStorage.getItem('DefaultPageSize') || sessionStorage.getItem('DefaultPageSize') || 6),
    reqData.sortField = 'text2';
    reqData.sortOrder = 'ASC'
    // reqDataVo.requestObject = reqData;
    return this.postObservable(reqData, messageId);
  }
  // Backend Search
  public doPostGetAllWithSearch(messageId: APIPath, searchQ: any,
    pageNumber: number, pageSize: number) {
    const reqDataVo = new CommonReqObjectVo();
    reqDataVo.page = pageNumber;
    reqDataVo.size = pageSize ?? (localStorage.getItem('DefaultPageSize') || sessionStorage.getItem('DefaultPageSize') || 6),
      reqDataVo.sortField = 'text2';
    reqDataVo.sortOrder = 'ASC'
    reqDataVo.requestObject = searchQ;
    return this.postObservable(reqDataVo, messageId);
  }
  // Download Document
  public doPostDownload(messageId: APIPath, id: string, p0: { responseType: "json"; }) {
    const reqDataVo = new CommonReqObjectVo();
    const reqData = new CommonInqReqObject();
    reqData.id = id;
    reqDataVo.requestObject = reqData;
    return this.postObservable(reqDataVo, messageId);
  }
  // Backend File Upload
  public postFile(messageId: any, formData: FormData) {
    let token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const jwtToken = 'Bearer ' + token;
    const httpOptions = new HttpHeaders({
      'Authorization': jwtToken,
      'Accept': '*/*'  // Accept all types of response
    });
    const apiPath = this.getBaseUrl() + messageId;
    return this.http.post<any>(apiPath, formData, { headers: httpOptions })
      .pipe(catchError(err => this.handleError(err)));
  }
  public doPostInqWithEncryption(messageId: APIPath, id: string, publicKey: string) {
    const reqDataVo = new CommonReqObjectVo();
    reqDataVo.inqEncryptionKey = publicKey;
    const reqData = new CommonInqReqObject();
    reqData.id = id;
    reqDataVo.requestObject = reqData;
    return this.postObservable(reqDataVo, messageId);
  }
  public doPostWithEncryption(messageId: APIPath, reqObj: any, key_index: string, publicKey: string) {
    const reqData = new CommonReqObjectVo();
    reqData.updEncryptionPubVal = publicKey;
    reqData.key_Index = key_index;
    if (reqObj) {
      reqData.requestObject = reqObj;
    }
    return this.postObservable(reqData, messageId);
  }
  getBaseUrl() {
    let baseUrl = window.location.href.split('/#/')[0];
    let localUrl = baseUrl;
    if (baseUrl.includes('localhost')) {
      if (baseUrl.endsWith('4200')) {
        // Core
        // localUrl = 'http://localhost:9030';
        // IAM
        localUrl = 'http://localhost:8080';
      }
      if (baseUrl.endsWith('4201')) {
        localUrl = 'https://admin-dev.swt.toucanint.com';
      }
      if (baseUrl.endsWith('4202')) {
        localUrl = 'https://admin-qa.swt.toucanint.com';
      }
      if (baseUrl.endsWith('4203')) {
        localUrl = 'https://admin-perf.swt.toucanint.com';
      }
    }
    return localUrl;
  }
  respDataFormatter(data: ResObjectModule) {
    if (data?.success) {
      // this.setNotif('success', null!);
      let respObj: any;
      if (data?.object) {
        respObj = this.modifyReqResp(data?.object);
        return respObj;
      }
      return;
    } else {
      const errObj = new ErrorMessageModule();
      errObj.multipleMessage = new Array<DetailErrorModule>();
      errObj.errorID = '000';
      if (!data) {
        data = new ResObjectModule();
      }
      if (!data.errors) {
        data.errors = new Array<string>();
      }
      if (data?.detailErrors) {
        if (data?.detailErrors?.length > 0) {
          data?.detailErrors?.forEach((element: any) => {
            errObj?.multipleMessage?.push(element);
          });
        }
      }
      if (data?.errors?.length > 0) {
        errObj.errorMessage = data.errors[0];
      } else {
        errObj.errorMessage = "Empty Response Getting...";
      }
      // this.setNotif('error', errObj);
      return errObj;
    }
  }
  public modifyReqResp(body: any) {
    let bodyTemp = JSON.stringify(body, (key, value) => {
      if (typeof (value) == 'string') {
        let flag = value?.includes('.000Z');
        if (flag) {
          value = this.datepipe.transform(value, 'yyyy-MM-ddTHH:mm:ss')
        }
      }
      if (JSON.stringify([]) == JSON.stringify(value)) {
        value = null;
      }
      if (JSON.stringify({}) == JSON.stringify(value)) {
        value = null;
      }
      return value === "" ? null : value;
    });
    return JSON.parse(bodyTemp);
  }
  public handleError(err: HttpErrorResponse) {
    let errorCode = '0000';
    let errorMessageDesc = 'Unknown Error Occured, Contact Administrator';
    if (err.error instanceof ErrorEvent) {
      console.error('An error occurred: ErrorEvent - Post Service');
      errorMessageDesc = err.error.message;
    } else {
      console.error('An error occurred: Backend Error - Post Service');
      errorCode = err.status.toString();
      if (err.error.message) {
        errorMessageDesc = err.error.message;
      }
      if (err.status === 401) {
        let isLogin = localStorage.getItem('token');
        if (!isLogin) {
          isLogin = sessionStorage.getItem('token');
        }
        if (isLogin) {
          this.router.navigate(['401']);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('p');
          localStorage.clear();
          sessionStorage.removeItem('token');
          sessionStorage.clear();
          let errmsg = err?.error?.message;
          if (!errmsg) {
            errmsg = "May be you changed password or system detected unusual activity. Please Login again, Thank You!"
          }
          this.openSnackBar(errmsg, 'ERROR');
        }
      }
    }
    const errorObject: ErrorMessageModule = {
      errorID: errorCode,
      errorMessage: errorMessageDesc,
      multipleMessage: []
    };
    // this.setNotif('error', errorObject);
    return throwError(errorObject);
  }
  // public setMessage(msg: string) {
  //   this.message.next(msg);
  // }
  // public getMessage(): Observable<string> {
  //   return this.message.asObservable();
  // }
  getApiErr(err: ErrorMessageModule) {
    if (err?.multipleMessage?.length > 0) {
      this.openSnackBar(err?.multipleMessage[0]?.message, 'ERROR');
    } else if (err?.errorMessage) {
      this.openSnackBar(err?.errorMessage, 'ERROR');
    } else {
      this.openSnackBar("Request Failed", 'ERROR');
    }
  }
  // setNotif(key: string, err: ErrorMessageModule) {
  //   if (key && err) {
  //     const temp = new NotifObj();
  //     temp.errCode = err.errorID;
  //     temp.errMessage = err.errorMessage;
  //     temp.errStatus = key;
  //     this.localNotifs.unshift(temp);
  //   } else {
  //     const temp = new NotifObj();
  //     temp.errCode = '';
  //     temp.errMessage = '';
  //     temp.errStatus = key;
  //     this.localNotifs.unshift(temp);
  //   }
  //   if (this.localNotifs?.length > 4) {
  //     this.localNotifs.pop();
  //     localStorage.setItem('localNotifs', JSON.stringify(this.localNotifs));
  //   } else {
  //     localStorage.setItem('localNotifs', JSON.stringify(this.localNotifs));
  //   }
  //   localStorage.setItem('err', JSON.stringify(err));
  // }
  getPriv(id: number) {
    let priv = localStorage.getItem('p');
    if (!priv) {
      priv = sessionStorage.getItem('p');
    }
    if (priv?.substring(id, id - 1) === '1') {
      return true;
    } else {
      return false;
    }
  }
  /* Method to open a snackbar */
  public openSnackBar(message: string, type: string, duration?: number, vPosition?: any, hPosition?: any) {
    const config = new MatSnackBarConfig();// Create a snackbar configuration
    config.politeness = 'assertive';
    config.duration = 2500;
    if (duration == 0) {
      config.duration = duration;
    }
    if (vPosition) {
      config.horizontalPosition = hPosition;
      config.verticalPosition = vPosition;
    }
    if (type === 'SUCCESS') {
      config.panelClass = ['snackBar-success'];
    } else if (type === 'ERROR') {
      config.panelClass = ['snackBar-error'];
    }
    else if (type === 'WARN') {
      config.panelClass = ['snackBar-warn'];
    }
    else if (type === 'INFO') {
      config.panelClass = ['snackBar-info'];
    }
    this.snackBar.open(message, 'x', config);
  }
  public doGetFile(messageId: any): Observable<HttpResponse<Blob>> {
    let token = localStorage.getItem('token');
    if (!token) {
      token = sessionStorage.getItem('token');
    }
    const jwtToken = 'Bearer ' + token;
    let headers = new HttpHeaders({ 'Accept': '*/*', 'Authorization': jwtToken });
    const apiPath = this.getBaseUrl() + messageId;
    return this.http.get(apiPath, {
      headers,
      observe: 'response',
      responseType: 'blob'
    });
  }
  toastMessages: ToastMessage[] = [];
  showToast(type: 'success' | 'error', text: string): void {
    const toast: ToastMessage = {
      id: Date.now() + Math.random(),
      type,
      text
    };
    this.toastMessages.push(toast);
    setTimeout(() => {
      this.toastMessages = this.toastMessages.filter(t => t.id !== toast.id);
    }, 1000);
  }
}

