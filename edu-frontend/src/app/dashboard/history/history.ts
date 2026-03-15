import { Component, OnInit } from '@angular/core';
import { APIPath } from '../../shared/api-enum';
import { PayeaseRestservice } from '../../shared/services/payease-restservice';

@Component({
  selector: 'app-history',
  standalone: false,
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class History implements OnInit {
  cardTxnDataSource!: any;
  cardTxnTotalElements!: number;
  cardTxnPageSize!: number;
  cardTxnCurrentPage!: number;
  cardTxnIsLoading!: boolean;
  pagedData:any[]=[];
  constructor(private postService: PayeaseRestservice) {

  }
  ngOnInit(): void {
    this.cardsTransactionsHistory(0,10);
  }
  readonly reportTabs = [
    { id: 'cards', label: 'Cards Transactions', subtitle: 'Card gateway collections and wallet funding history' },
    { id: 'bank', label: 'Bank Transactions', subtitle: 'NEFT, RTGS, and IMPS settlement tracking' },
    { id: 'statements', label: 'Statements', subtitle: 'Audit-ready ledger and payout statement lines' },
    { id: 'commission', label: 'Commission Report', subtitle: 'Distributor, agent, and platform commission view' }
  ];
  // readonly cardsTransactions: Transaction[] = [
  //   {
  //     srNo: 1,
  //     paymentDate: '14/03/2026, 12:23:06',
  //     urn: '5457250714065305393IN',
  //     name: 'Laxmi',
  //     mobile: '9441188744',
  //     paymentId: '24281494005',
  //     accountDetails: 'CardType: NA, Issuer: NA, Card#3025',
  //     mode: 'CARD',
  //     amount: 997.15,
  //     charge: 15.95,
  //     transferAmount: 981.20,
  //     status: 'SUCCESS'
  //   },
  //   {
  //     srNo: 2,
  //     paymentDate: '14/03/2026, 13:10:42',
  //     urn: '5457250714068801204IN',
  //     name: 'Rohit',
  //     mobile: '9701182214',
  //     paymentId: '24281494188',
  //     accountDetails: 'CardType: VISA, Issuer: HDFC, Card#1842',
  //     mode: 'CARD',
  //     amount: 998.19,
  //     charge: 16.20,
  //     transferAmount: 981.99,
  //     status: 'PENDING'
  //   }
  // ];

  readonly bankTransactions: BankTransaction[] = [
    {
      srNo: 1,
      paymentDate: '14/03/2026, 14:44:35',
      urn: 'URN8932',
      name: 'User 1',
      mobile: '9836013386',
      paymentId: '8925720703',
      accountDetails: 'Card#7384',
      mode: 'IMPS',
      amount: 2428.34,
      charge: 36.43,
      transferAmount: 2391.91,
      status: 'FAILED'
    },
    {
      srNo: 2,
      paymentDate: '14/03/2026, 14:44:35',
      urn: 'URN33092',
      name: 'User 2',
      mobile: '9714074999',
      paymentId: '2204199277',
      accountDetails: 'Card#1764',
      mode: 'RTGS',
      amount: 3574.26,
      charge: 53.61,
      transferAmount: 3520.65,
      status: 'PENDING'
    },
    {
      srNo: 3,
      paymentDate: '14/03/2026, 14:44:35',
      urn: 'URN35618',
      name: 'User 3',
      mobile: '9505298802',
      paymentId: '1416354310',
      accountDetails: 'Card#7227',
      mode: 'RTGS',
      amount: 3163.31,
      charge: 47.45,
      transferAmount: 3115.86,
      status: 'PENDING'
    },
    {
      srNo: 4,
      paymentDate: '14/03/2026, 14:44:35',
      urn: 'URN650',
      name: 'User 4',
      mobile: '9641834449',
      paymentId: '5122576944',
      accountDetails: 'Card#3600',
      mode: 'RTGS',
      amount: 2088.64,
      charge: 31.33,
      transferAmount: 2057.31,
      status: 'PENDING'
    },
    {
      srNo: 5,
      paymentDate: '14/03/2026, 14:44:35',
      urn: 'URN89169',
      name: 'User 5',
      mobile: '9246811040',
      paymentId: '2753708357',
      accountDetails: 'Card#5694',
      mode: 'RTGS',
      amount: 3588.92,
      charge: 53.83,
      transferAmount: 3535.09,
      status: 'SUCCESS'
    }
  ];

  readonly statements: StatementRow[] = [
    {
      srNo: 1,
      paymentDate: '14/03/2026, 21:44:32',
      paymentType: 'Commission',
      urn: '5457250714161432765IN',
      name: 'Indoori Kavya',
      mobile: '8179085457',
      accountDetails: 'CardType: NA, Card#4817',
      mode: 'Commission',
      pg: 'Yugma PG 6',
      paymentId: '24289166146'
    }
  ];

  readonly commissionRows: CommissionRow[] = [
    {
      srNo: 1,
      paymentDate: '14/03/2026, 12:23:06',
      name: 'Laxmi',
      mobile: '9441188744',
      mode: 'IMPS',
      amount: 1000,
      distributorCommission: 50,
      retailerCommission: 30,
      yugmaCommission: 20,
      status: 'SUCCESS'
    }
  ];

  readonly topMetrics = [
    { label: 'Report coverage', value: '4 views', note: 'Cards, bank, statements, and commission' },
    { label: 'Today volume', value: 'Rs. 16,838', note: 'Across card and bank channels' },
    { label: 'Settlement health', value: '80%', note: 'Successful or in-progress bank transfers' }
  ];

  readonly quickNotes = [
    'Use Cards Transactions to monitor gateway-originated payments and card settlement deductions.',
    'Use Bank Transactions for payout routing, transfer charges, and pending bank settlements.',
    'Use Statements and Commission Report during reconciliation, audit review, and partner payout cycles.'
  ];

  get cardsStats() {
    return this.buildSummary(this.cardTxnDataSource);
  }

  get bankStats() {
    return this.buildSummary(this.bankTransactions);
  }

  get totalProcessedAmount(): string {
    const total = this.cardTxnDataSource?.reduce((sum:any, row:any) => sum + row.transactionAmount, 0)
      + this.bankTransactions?.reduce((sum:any, row:any) => sum + row.transactionAmount, 0);
    return this.formatAmount(total);
  }

  get totalReportRows(): number {
    return this.cardTxnTotalElements
      + this.bankTransactions.length
      + this.statements.length
      + this.commissionRows.length;
  }

  formatAmount(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  statusTone(status: HistoryStatus): string {
    switch (status) {
      case 'SUCCESS':
        return 'status-success';
      case 'FAILED':
        return 'status-failed';
      default:
        return 'status-pending';
    }
  }

  private buildSummary(rows: Array<{ amount: number; status: HistoryStatus }>) {
    const total = rows?.reduce((sum:any, row:any) => sum + row.transactionAmount, 0);
    const success = rows?.filter((row) => row.status === 'SUCCESS');
    const failed = rows?.filter((row) => row.status === 'FAILED');
    const pending = rows?.filter((row) => row.status === 'PENDING');
    return {
      total: {
        count: rows?.length,
        amount: this.formatAmount(total)
      },
      success: {
        count: success?.length,
        amount: this.formatAmount(success?.reduce((sum, row:any) => sum + row.transactionAmount, 0))
      },
      failed: {
        count: failed?.length,
        amount: this.formatAmount(failed?.reduce((sum, row:any) => sum + row.transactionAmount, 0))
      },
      pending: {
        count: pending?.length,
        amount: this.formatAmount(pending?.reduce((sum, row:any) => sum + row.transactionAmount, 0))
      }
    };
  }

  cardsTransactionsHistory(pageNumber: number, pageSize: number) {
    this.postService.doPostGetAll(APIPath.CARD_TRANSACTION_HISTORY, pageNumber, pageSize).subscribe((data: any) => {
      if (data.status) {
        const result = data?.object?.content;
        this.cardTxnDataSource = result;
        this.postService.showToast('success', data.errorMsg);
        this.cardTxnTotalElements = data?.object?.totalElements;
        this.cardTxnPageSize = data?.object?.pageable?.pageSize;
        this.cardTxnCurrentPage = data?.object?.pageable?.pageNumber + 1;
        this.cardTxnIsLoading = true;
      } else {
        this.postService.showToast('error', data.errorMsg);
      }
    },
      (error: any) => {
        this.cardTxnIsLoading = false;
        this.postService.showToast('error', error?.message?.toString());
      }
    )
  }
  getStartEntry(): number {
  if (this.cardTxnTotalElements === 0) return 0;
  return (this.cardTxnCurrentPage - 1) * this.cardTxnPageSize + 1;
}

getEndEntry(): number {
  if (this.cardTxnTotalElements === 0) return 0;
  return Math.min(
    this.cardTxnCurrentPage * this.cardTxnPageSize,
    this.cardTxnTotalElements
  );
}
}

type HistoryStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

interface BaseTransaction {
  srNo: number;
  paymentDate: string;
  urn: string;
  name: string;
  mobile: string;
  paymentId: string;
  accountDetails: string;
  amount: number;
  charge: number;
  transferAmount: number;
  status: HistoryStatus;
}

interface Transaction extends BaseTransaction {
  mode: 'CARD';
}

interface BankTransaction extends BaseTransaction {
  mode: 'IMPS' | 'NEFT' | 'RTGS';
}

interface StatementRow {
  srNo: number;
  paymentDate: string;
  paymentType: string;
  urn: string;
  name: string;
  mobile: string;
  accountDetails: string;
  mode: string;
  pg: string;
  paymentId: string;
}

interface CommissionRow {
  srNo: number;
  paymentDate: string;
  name: string;
  mobile: string;
  mode: string;
  amount: number;
  distributorCommission: number;
  retailerCommission: number;
  yugmaCommission: number;
  status: HistoryStatus;
}
