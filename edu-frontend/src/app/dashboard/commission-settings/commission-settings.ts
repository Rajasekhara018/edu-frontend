import { Component } from '@angular/core';
import { PayeaseRestservice } from '../../shared/services/payease-restservice';
import { APIPath } from '../../shared/api-enum';
import { Location } from '@angular/common';

type UserContext = 'ADMIN' | 'DISTRIBUTOR' | 'AGENT';

interface DistributorProfile {
  id: string;
  name: string;
  status: string;
  baseRate: string;
}

interface AgentProfile {
  id: string;
  distributorId: string;
  name: string;
  channel: string;
}

interface CommissionRule {
  scope: 'Distributor' | 'Agent';
  ownerName: string;
  paymentType: string;
  distributorRate: string;
  agentRate: string;
  mode: string;
  cap: string;
  status: string;
}

@Component({
  selector: 'app-commission-settings',
  standalone: false,
  templateUrl: './commission-settings.html',
  styleUrl: './commission-settings.scss'
})
export class CommissionSettings {
  constructor(private postService: PayeaseRestservice, public location: Location) {

  }
  readonly distributors: DistributorProfile[] = [
    { id: 'DST-1001', name: 'Northline Distribution', status: 'Active', baseRate: '1.80%' },
    { id: 'DST-1002', name: 'Campus Pay Network', status: 'Active', baseRate: '1.55%' },
    { id: 'DST-1003', name: 'Scholar Ledger Hub', status: 'Pending', baseRate: '1.20%' }
  ];

  readonly agents: AgentProfile[] = [
    { id: 'AG-2101', distributorId: 'DST-1001', name: 'Riya Collections', channel: 'School fee desk' },
    { id: 'AG-2102', distributorId: 'DST-1001', name: 'Raman Support Point', channel: 'Card collection desk' },
    { id: 'AG-2201', distributorId: 'DST-1002', name: 'Metro Assist Agent', channel: 'Assisted checkout' }
  ];

  readonly commissionRules: CommissionRule[] = [
    {
      scope: 'Distributor',
      ownerName: 'Northline Distribution',
      paymentType: 'Card payment',
      distributorRate: '1.80%',
      agentRate: '-',
      mode: 'Percentage',
      cap: 'Rs. 250',
      status: 'ACTIVE'
    },
    {
      scope: 'Agent',
      ownerName: 'Riya Collections',
      paymentType: 'Assisted checkout',
      distributorRate: '0.95%',
      agentRate: '0.65%',
      mode: 'Percentage',
      cap: 'Rs. 120',
      status: 'ACTIVE'
    },
    {
      scope: 'Agent',
      ownerName: 'Metro Assist Agent',
      paymentType: 'Instant bank debit',
      distributorRate: '0.90%',
      agentRate: '0.55%',
      mode: 'Percentage',
      cap: 'Rs. 100',
      status: 'DRAFT'
    }
  ];

  readonly paymentTypes = ['Card payment', 'Instant bank debit', 'Assisted checkout', 'Wallet transfer'];
  readonly modes = ['Percentage', 'Flat amount'];

  userContext: UserContext = 'ADMIN';
  canManage = true;
  selectedDistributorId = 'DST-1001';
  selectedAgentId = '';

  form = {
    scope: 'Distributor',
    paymentType: 'Card payment',
    mode: 'Percentage',
    distributorRate: '1.80',
    agentRate: '0.65',
    capAmount: '250',
    notes: 'Default distributor commission for card payments.'
  };

  ngOnInit() {
    this.resolveRoleContext();
    this.applyRoleDefaults();
  }

  get visibleAgents() {
    return this.agents.filter((agent) => agent.distributorId === this.selectedDistributorId);
  }

  get currentDistributor() {
    return this.distributors.find((item) => item.id === this.selectedDistributorId);
  }

  get pageTitle() {
    if (this.userContext === 'ADMIN') {
      return 'Configure distributor and agent commission rules';
    }
    if (this.userContext === 'DISTRIBUTOR') {
      return 'Configure commission rules for your agent network';
    }
    return 'Commission visibility';
  }

  get pageDescription() {
    if (this.userContext === 'ADMIN') {
      return 'Admin can set base distributor rates and override agent-level commission rules by distributor hierarchy.';
    }
    if (this.userContext === 'DISTRIBUTOR') {
      return 'Distributors can maintain their own agent commission rules while keeping base distributor rates visible.';
    }
    return 'Agents can review the active commission setup applied to their payment channels.';
  }

  onScopeChange() {
    if (this.form.scope === 'Distributor') {
      this.selectedAgentId = '';
    } else if (!this.selectedAgentId && this.visibleAgents.length) {
      this.selectedAgentId = this.visibleAgents[0].id;
    }
  }

  getScopeLabel(scope: string) {
    return scope === 'Distributor' ? 'Distributor level' : 'Agent level';
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'ACTIVE':
        return 'status-active';
      case 'DRAFT':
        return 'status-draft';
      case 'PENDING':
        return 'status-pending';
      default:
        return 'status-neutral';
    }
  }

  private resolveRoleContext() {
    const rolesRaw = localStorage.getItem('LoggedInUserroles');
    const roles: string[] = rolesRaw && rolesRaw !== 'undefined' ? JSON.parse(rolesRaw) : [];
    const normalizedRoles = roles.map((role) => role?.toUpperCase?.() || '');

    if (normalizedRoles.some((role) => role.includes('ADMIN'))) {
      this.userContext = 'ADMIN';
      this.canManage = true;
      return;
    }

    if (normalizedRoles.some((role) => role.includes('DISTRIBUTOR'))) {
      this.userContext = 'DISTRIBUTOR';
      this.canManage = true;
      return;
    }

    this.userContext = 'AGENT';
    this.canManage = false;
  }

  private applyRoleDefaults() {
    if (this.userContext === 'ADMIN') {
      this.selectedDistributorId = this.distributors[0].id;
      this.form.scope = 'Distributor';
      return;
    }

    if (this.userContext === 'DISTRIBUTOR') {
      const localDistributorId = localStorage.getItem('userId');
      this.selectedDistributorId = localDistributorId && this.distributors.some((item) => item.id === localDistributorId)
        ? localDistributorId
        : this.distributors[0].id;
      this.form.scope = 'Agent';
      this.selectedAgentId = this.visibleAgents[0]?.id || '';
      return;
    }

    this.selectedDistributorId = this.distributors[0].id;
    this.form.scope = 'Agent';
    this.selectedAgentId = this.visibleAgents[0]?.id || '';
  }
  form2: any = {
    gateway: '',
    paymentMode: '',
    paymentType: '',
    distributorPercent: '',
    agentPercent: '',
    platformPercent: ''
  };

  paymentMethods: any[] = [];

  gateways = ["YUGMA", "RAZORPAY", "PAYU", "ICICI"];
  paymentModes = ["CARD", "UPI", "NETBANKING"];
  gatewayRules: any = {}
  addRule() {
    if (
      !this.form2.paymentMode ||
      !this.form2.paymentType ||
      !this.form2.distributorPercent ||
      !this.form2.agentPercent ||
      !this.form2.platformPercent
    ) {
      alert("Please fill all fields before adding a rule");
      return;
    }
    const duplicate = this.paymentMethods.find(r =>
      r.paymentMode === this.form2.paymentMode &&
      r.paymentType === this.form2.paymentType
    );
    if (duplicate) {
      alert("Rule already exists");
      return;
    }
    const rule = {
      paymentMode: this.form2.paymentMode,
      paymentType: this.form2.paymentType,
      distributorPercent: this.form2.distributorPercent,
      agentPercent: this.form2.agentPercent,
      platformPercent: this.form2.platformPercent
    };
    this.paymentMethods.push(rule);
    this.resetForm();
  }
  resetForm() {
    this.form2.paymentMode = '';
    this.form2.paymentType = '';
    this.form2.distributorPercent = '';
    this.form2.agentPercent = '';
    this.form2.platformPercent = '';
  }
  removeRule(index: number) {
    this.paymentMethods.splice(index, 1);
  }
  isCreateMode!: boolean
  modelkey!: any

  saveGateway() {
    this.isCreateMode = true
    if (!this.form2.gateway) {
      alert("Please select gateway");
      return;
    }
    if (this.paymentMethods.length === 0) {
      alert("Add at least one commission rule");
      return;
    }
    const payload = {
      gateway: this.form2.gateway,
      paymentMethods: this.paymentMethods
    };
    console.log(payload);
    const apiPath = this.isCreateMode
      ? APIPath.COMMISSON_CRE
      : APIPath.COMMISSON_UPD;
    const requestObj: any = {
      ...payload,
      ...(this.isCreateMode ? {} : { id: this.modelkey })
    };
    let requestType = this.isCreateMode ? "CREATE" : "UPDATE";
    this.postService
      .doPost(apiPath, requestObj, requestType)
      .subscribe({
        next: (response: any) => {
          if (response.status) {
            this.location.back();
            this.postService.showToast(
              'success',
              response?.errorMsg?.toString()
            );
          } else {
            this.postService.showToast(
              'error',
              response?.errorMsg?.toString()
            );
          }
        },
        error: (err: any) => {
          this.postService.showToast(
            'error',
            err?.errorMsg?.toString()
          );
        }
      });
  }
}
