import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

export class TAmount {
  value!: any;
  code!: string;
}
export const COURSE_DATA: Record<string, { name: string; price: number; image: string }> = {
  'fullstack': {
    name: 'Full Stack',
    price: 9999,
    image: '../../../../assets/fullstack.webp'
  },
  'nosql': {
    name: 'NoSQL',
    price: 7499,
    image: '../../../../assets/nosql.webp'
  },
  'python': {
    name: 'Python Programming',
    price: 4999,
    image: '../../../../assets/python.webp'
  },
  'datascience': {
    name: 'Data Science',
    price: 6999,
    image: '../../../../assets/datascience.webp'
  },
  'java': {
    name: 'Java Programming',
    price: 5499,
    image: '../../../../assets/java.webp'
  }
};
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  selectedPaymentMethod: string = '';
  amtValue = new TAmount();
  amount: number = 100;
  delivery: number = 0;
  taxes: number = 2;
  currencyCode!: string;
  redirectURL!: string;
  constructor(public router: Router, public cdr: ChangeDetectorRef, public http: HttpClient, public dialog: MatDialog,
    public route: ActivatedRoute
  ) {
    this.currencyCode = localStorage.getItem('currencyCode')!;
    this.amtValue = new TAmount();
  }
  course!: any;
  ngOnInit(): void {
    this.amount = Number(this.route.snapshot.paramMap.get('amount'));
    // this.course = this.route.snapshot.paramMap.get('course')!;
    const courseKey = this.route.snapshot.paramMap.get('course');
    if (courseKey) {
      this.course = COURSE_DATA[courseKey];
    }
  }
  generateRandomId() {
    return Math.random().toString(36).substring(2, 10);
  }
  getSum(amount: number, taxes: number): number {
    return Number(amount) + Number(taxes);
  }
  navigatetoCheckout() {
    this.router.navigate(['/checkout-page', this.getSum(this.amount, this.taxes)]);
  }

  navigatetopay(payType: string) {

    if (payType == "AI") {
      let popObj = new AIPayRequest();
      popObj.transaction_amount = this.getSum(this.amount, this.taxes);
      popObj.transaction_id = "TXN34357";//this.generateRandomId();

      switch (this.selectedPaymentMethod) {
        case 'CARDS':
          popObj.payment_channel = "Cards"//this.selectedPaymentMethod;
          popObj.wallet_app = "none";
          popObj.bank = "ICICI";
          popObj.card_type = "credit";
          popObj.network = "visa";
          popObj.card_number = "401403";
          popObj.device_type = "laptop";
          popObj.os = "Linux";
          popObj.network_type = "Ethernet";
          popObj.network_strength = 4;
          popObj.upi_app = "none";
          popObj.transaction_currency = "INR";
          popObj.merchant_id = "M0057";
          break;
        case 'NET_BANKING':
          popObj.payment_channel = "Netbanking"//this.selectedPaymentMethod;
          popObj.wallet_app = "none";
          popObj.bank = "ICICI";
          popObj.card_type = "none";
          popObj.network = "none";
          popObj.card_number = "none";
          popObj.device_type = "laptop";
          popObj.os = "Linux";
          popObj.network_type = "Ethernet";
          popObj.network_strength = 4;
          popObj.upi_app = "none";
          popObj.transaction_currency = "INR";
          popObj.merchant_id = "M0057";
          break;
        case 'UPI':
          popObj.payment_channel = "UPI"//this.selectedPaymentMethod;
          popObj.wallet_app = "none";
          popObj.bank = "none";
          popObj.card_type = "none";
          popObj.network = "none";
          popObj.card_number = "none";
          popObj.device_type = "laptop";
          popObj.os = "Linux";
          popObj.network_type = "Ethernet";
          popObj.network_strength = 4;
          popObj.upi_app = "PhonePe";
          popObj.transaction_currency = "INR";
          popObj.merchant_id = "M0057";
          break;
        case 'ApplePay':
        case 'GooglePay':
        case 'PayPal':
        case 'Zelle':
        case 'Venmo':
        case 'PhonePay':
        case 'AmazonPay':
          popObj.payment_channel = "Wallets"//this.selectedPaymentMethod;
          popObj.wallet_app = this.selectedPaymentMethod;
          popObj.bank = "none";
          popObj.card_type = "none";
          popObj.network = "none";
          popObj.card_number = "none";
          popObj.device_type = "laptop";
          popObj.os = "Linux";
          popObj.network_type = "Ethernet";
          popObj.network_strength = 4;
          popObj.upi_app = "none";
          popObj.transaction_currency = "INR";
          popObj.merchant_id = "M0057";
          break;
      }

      // this.postService.doPostCreate(APIPath.API_PAY_AI_BASED, popObj)
      //   .subscribe(
      //     (data:any) => {
      //       const output = this.postService.respDataFormatter(data);
      //       if (output instanceof ErrorMessageModule) {
      //         this.postService.getApiErr(output);
      //       } else {
      //         this.popCallSuccess(output);
      //       }
      //     },
      //     err => this.postService.getApiErr(err)
      //   );

    } else if (payType == "Rule") {

      let popObj = new ServiceProviders();

      this.amtValue.value = this.amount;;
      this.amtValue.code = "USD";
      popObj.typeofRule = "S";
      popObj.transactionAmount = this.amount;
      popObj.paymentChannel = this.selectedPaymentMethod;
      if (this.selectedPaymentMethod == 'ApplePay' || this.selectedPaymentMethod == 'GooglePay' || this.selectedPaymentMethod == 'PayPal' || this.selectedPaymentMethod == 'Zelle' || this.selectedPaymentMethod == 'Venmo' || this.selectedPaymentMethod == 'PhonePay' || this.selectedPaymentMethod == 'AmazonPay') {
        popObj.paymentChannel = "WALLETS";
        popObj.walletName = this.selectedPaymentMethod;
      }
      // this.postService.doPostCreate(APIPath.API_PAY_STATIC_RULE, popObj)
      //   .subscribe(
      //     data => {
      //       const output = this.postService.respDataFormatter(data);
      //       if (output instanceof ErrorMessageModule) {
      //         this.postService.getApiErr(output);
      //       } else {
      //         this.popCallSuccess(output);
      //       }
      //     },
      //     err => this.postService.getApiErr(err)
      //   );

    } else if (payType == "Volume") {
      let popObj = new ServiceProviders();

      this.amtValue.value = this.amount;;
      this.amtValue.code = "USD";
      popObj.typeofRule = "V"
      popObj.transactionAmount = this.amount;
      popObj.paymentChannel = this.selectedPaymentMethod;
      if (this.selectedPaymentMethod == 'ApplePay' || this.selectedPaymentMethod == 'GooglePay' || this.selectedPaymentMethod == 'PayPal' || this.selectedPaymentMethod == 'Zelle' || this.selectedPaymentMethod == 'Venmo' || this.selectedPaymentMethod == 'PhonePay' || this.selectedPaymentMethod == 'AmazonPay') {
        popObj.paymentChannel = "WALLETS";
        popObj.walletName = this.selectedPaymentMethod;
      }
      // this.postService.doPostCreate(APIPath.API_PAY_VOLUME_BASED, popObj)
      //   .subscribe(
      //     data => {
      //       const output = this.postService.respDataFormatter(data);
      //       if (output instanceof ErrorMessageModule) {
      //         this.postService.getApiErr(output);
      //       } else {
      //         this.popCallSuccess(output);
      //       }
      //     },
      //     err => this.postService.getApiErr(err)
      //   );
    } else if (payType == "All") {
      let popObj = new ServiceProviders();

      this.amtValue.value = this.amount;;
      this.amtValue.code = "USD";
      popObj.typeofRule = "U"
      popObj.transactionAmount = this.amount;
      popObj.paymentChannel = this.selectedPaymentMethod;
      if (this.selectedPaymentMethod == 'ApplePay' || this.selectedPaymentMethod == 'GooglePay' || this.selectedPaymentMethod == 'PayPal' || this.selectedPaymentMethod == 'Zelle' || this.selectedPaymentMethod == 'Venmo' || this.selectedPaymentMethod == 'PhonePay' || this.selectedPaymentMethod == 'AmazonPay') {
        popObj.paymentChannel = "WALLETS";
        popObj.walletName = this.selectedPaymentMethod;
      }
      // this.postService.doPostCreate(APIPath.API_PAY_ALL_BASED, popObj)
      //   .subscribe(
      //     data => {
      //       const output = this.postService.respDataFormatter(data);
      //       if (output instanceof ErrorMessageModule) {
      //         this.postService.getApiErr(output);
      //       } else {
      //         this.popCallSuccess(output);
      //       }
      //     },
      //     err => this.postService.getApiErr(err)
      //   );
    } else if (payType == "PayNow") {
      let popObj = new ServiceProviders();

      popObj.transactionAmount = this.amount;
      popObj.paymentChannel = this.selectedPaymentMethod;



      if (this.selectedPaymentMethod == 'ApplePay' || this.selectedPaymentMethod == 'GooglePay' || this.selectedPaymentMethod == 'PayPal' || this.selectedPaymentMethod == 'Zelle' || this.selectedPaymentMethod == 'Venmo' || this.selectedPaymentMethod == 'PhonePay' || this.selectedPaymentMethod == 'AmazonPay') {
        popObj.paymentChannel = "WALLETS";
        popObj.walletName = this.selectedPaymentMethod;
      }
      popObj.accountId = "CLI001234587830";
      popObj.location = "United States";
      popObj.currency = "INR";

      // this.postService.doPostCreate(APIPath.PAY_NOW, popObj)
      //   .subscribe(
      //     data => {
      //       if(data?.redirectURL)
      //         this.redirectURL = data.redirectURL;
      //       const output = this.postService.respDataFormatter(data);
      //       if (output instanceof ErrorMessageModule) {
      //         this.postService.getApiErr(output);
      //       } else {
      //         this.loadURL(this.redirectURL);
      //       }
      //     },
      //     (err:any) => this.postService.getApiErr(err)
      //   );
    }
  }
  navigatetoToucanPay() {
    const data = {
      paymentChannel: this.selectedPaymentMethod
    }
    this.router.navigate(['/gateway/' + (Number(this.amount) + Number(this.taxes))], { queryParams: data });
  }

  navigatetoRazorpay() {
    const data = {
      paymentChannel: this.selectedPaymentMethod
    }
    this.router.navigate(['/razorpay-pg/' + (Number(this.amount) + Number(this.taxes))], { queryParams: data });
  }
  navigatetoJio() {
    const data = {
      paymentChannel: this.selectedPaymentMethod
    }
    this.router.navigate(['/jio-pg/' + (Number(this.amount) + Number(this.taxes))], { queryParams: data });
  }
  navigatetoPinelabs() {
    const data = {
      paymentChannel: this.selectedPaymentMethod
    }
    this.router.navigate(['/pine-labs/' + (Number(this.amount) + Number(this.taxes))], { queryParams: data });
  }
  navigatetoJuspay() {
    const data = {
      paymentChannel: this.selectedPaymentMethod
    }
    this.router.navigate(['/juspay-pg/' + (Number(this.amount) + Number(this.taxes))], { queryParams: data });
  }
  checkTxnAmtFn(value: any, ctype: string,) {
    // value = this.postService.amtValidate(value, ctype);
    this.cdr.detectChanges();
    return value ? value : '';
  }
  popRuleBasedCallSuccessALL(Popdata: any) {
    let resdata = Popdata;
    // const dialogRef = this.dialog.open(RunTxnComparisonComponent, {
    //   width: '1180px',
    //   height: '690px',
    //   disableClose: true,
    //   data:resdata,
    // });

    // dialogRef.afterClosed().subscribe(result => {
    // });
  }
  navigatetoTxnComparison() {
    let popObj = new ServiceProviders();

    this.amtValue.value = this.amount;
    this.amtValue.code = "USD";
    popObj.typeofRule = "U"
    popObj.transactionAmount = Number(this.amount) + Number(this.taxes);
    popObj.paymentChannel = this.selectedPaymentMethod;

    const data = {
      typeofRule: "U",
      transactionAmount: Number(this.amount) + Number(this.taxes),
      paymentChannel: popObj.paymentChannel,
      walletName: popObj.walletName
    };

    this.router.navigate(['checkout/txncompare'], { queryParams: data });
  }


  popCallSuccess(popData: any) {
    var gatewayName = popData.ai_results.data.priority_gateway_1.gateway_name;
    this.routeToAppropriatePG(gatewayName);
  }

  loadURL(redirectURL: any) {
    window.open(redirectURL, '_self');
  }

  routeToAppropriatePG(gatewayName: any) {
    var pgToRoute = 'P'.concat(gatewayName);
    switch (pgToRoute) {
      case 'P0':
        this.navigatetoToucanPay();
        //this.router.navigateByUrl('/gateway/' + (this.amount + this.taxes));
        break;
      case 'P1':
        this.navigatetoRazorpay();
        break;
      case 'P2':
        this.navigatetoJio();
        break;
      case 'P3':
        this.navigatetoPinelabs();
        break;
      case 'P4':
        this.navigatetoJuspay();
        break;
      default:
        this.router.navigateByUrl('/gateway/' + (this.amount + this.taxes));
        break;
    }
  }



}



export class ServiceProviders {
  "merchantNumber": string;
  "transactionAmount": Number;
  "selectedPmtMethod": string;
  "walletName": string;

  "paymentChannel": string;
  "typeofRule": string;
  "currency": string;
  "location": string;
  "accountId": string;

  // "transactionAmount": TAmount;
  // "transactionId": string;
  // "paymentChannel": string;
  // "bank": string;
  // "cardType": string;
  // "network": string;
  // "cardNumber": string;
  // "walletApp": string;
  // "deviceType": string;
  // "os": string;
  // "networkType": string;
  // "networkStrength": number;
  // "upiApp": string;
  // "transactionCurrency": string;
  // "merchantId": string;
}

export class AIPayRequest {

  "transaction_amount": Number;
  "transaction_id": string;
  "payment_channel": string;
  "bank": string;
  "card_type": string;
  "network": string;
  "card_number": string;
  "wallet_app": string;
  "device_type": string;
  "os": string;
  "network_type": string;
  "network_strength": number;
  "upi_app": string;
  "transaction_currency": string;
  "merchant_id": string;
}

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