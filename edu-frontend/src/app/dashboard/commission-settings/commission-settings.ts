import { Component } from '@angular/core';
import { PayeaseRestservice } from '../../shared/services/payease-restservice';
import { APIPath } from '../../shared/api-enum';
import { Location } from '@angular/common';
import { AgentProfile, CommissionRule, DistributorProfile } from '../../shared/model';
import { ActivatedRoute } from '@angular/router';

type UserContext = 'ADMIN' | 'DISTRIBUTOR' | 'AGENT';
@Component({
  selector: 'app-commission-settings',
  standalone: false,
  templateUrl: './commission-settings.html',
  styleUrl: './commission-settings.scss'
})
export class CommissionSettings {
  disabledMode!: boolean;
  isAdminUser!: boolean;
  isDistributorUser!: boolean;
  isAgentUser!: boolean;
  canCreateUsers!: boolean;
  currentDistributorId!: string;
  availableUserTypes!: any
  // readonly distributors: DistributorProfile[] = [
  //   { id: 'DST-1001', name: 'Northline Distribution', status: 'Active', baseRate: '1.80%' },
  //   { id: 'DST-1002', name: 'Campus Pay Network', status: 'Active', baseRate: '1.55%' },
  //   { id: 'DST-1003', name: 'Scholar Ledger Hub', status: 'Pending', baseRate: '1.20%' }
  // ];
  // readonly agents: AgentProfile[] = [
  //   { id: 'AG-2101', distributorId: 'DST-1001', name: 'Riya Collections', channel: 'School fee desk' },
  //   { id: 'AG-2102', distributorId: 'DST-1001', name: 'Raman Support Point', channel: 'Card collection desk' },
  //   { id: 'AG-2201', distributorId: 'DST-1002', name: 'Metro Assist Agent', channel: 'Assisted checkout' }
  // ];
  // readonly commissionRules: CommissionRule[] = [
  //   {
  //     scope: 'Distributor',
  //     ownerName: 'Northline Distribution',
  //     paymentType: 'Card payment',
  //     distributorRate: '1.80%',
  //     agentRate: '-',
  //     mode: 'Percentage',
  //     cap: 'Rs. 250',
  //     status: 'ACTIVE'
  //   },
  //   {
  //     scope: 'Agent',
  //     ownerName: 'Riya Collections',
  //     paymentType: 'Assisted checkout',
  //     distributorRate: '0.95%',
  //     agentRate: '0.65%',
  //     mode: 'Percentage',
  //     cap: 'Rs. 120',
  //     status: 'ACTIVE'
  //   },
  //   {
  //     scope: 'Agent',
  //     ownerName: 'Metro Assist Agent',
  //     paymentType: 'Instant bank debit',
  //     distributorRate: '0.90%',
  //     agentRate: '0.55%',
  //     mode: 'Percentage',
  //     cap: 'Rs. 100',
  //     status: 'DRAFT'
  //   }
  // ];
  readonly paymentTypes = ['Card payment', 'Instant bank debit', 'Assisted checkout', 'Wallet transfer'];
  readonly modes = ['Percentage', 'Flat amount'];
  userContext: UserContext = 'ADMIN';
  canManage = true;
  selectedDistributorId = 'DST-1001';
  selectedAgentId = '';
  isEditMode!: boolean;
  constructor(private postService: PayeaseRestservice, public location: Location, private route: ActivatedRoute) {

  }
  ngOnInit() {
    this.initializeRoleContext();
    this.modelkey = this.route.snapshot.paramMap.get('id')!;
    if (this.modelkey) {
      this.isEditMode = false;
      this.disabledMode = true;
      this.isCreateMode = false;
      this.gotoInq(this.modelkey);
    } else {
      this.isEditMode = true;
      this.disabledMode = false;
      this.isCreateMode = true;
    }
  }

  // get visibleAgents() {
  //   return this.agents.filter((agent) => agent.distributorId === this.selectedDistributorId);
  // }

  // get currentDistributor() {
  //   return this.distributors.find((item) => item.id === this.selectedDistributorId);
  // }

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

  // onScopeChange() {
  //   if (this.form.scope === 'Distributor') {
  //     this.selectedAgentId = '';
  //   } else if (!this.selectedAgentId && this.visibleAgents.length) {
  //     this.selectedAgentId = this.visibleAgents[0].id;
  //   }
  // }

  // getScopeLabel(scope: string) {
  //   return scope === 'Distributor' ? 'Distributor level' : 'Agent level';
  // }

  // getStatusClass(status: string) {
  //   switch (status) {
  //     case 'ACTIVE':
  //       return 'status-active';
  //     case 'DRAFT':
  //       return 'status-draft';
  //     case 'PENDING':
  //       return 'status-pending';
  //     default:
  //       return 'status-neutral';
  //   }
  // }
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
    if (!this.canCreateUsers) {
      this.postService.showToast('error', 'Agent users do not have permission to create users.');
      return;
    }
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
  gotoInq(modelkey: string) {
    this.postService.doPostInq(APIPath.USER_INQ, modelkey).subscribe({
      next: (response: any) => {
        if (response.status) {
          // this.userObj = response.object;
          this.postService.showToast('success', response?.errorMsg?.toString());
        } else {
          this.postService.showToast('error', response?.errorMsg?.toString());
        }
      },
      error: (err: any) => {
        this.postService.showToast('error', err?.errorMsg?.toString());
      }
    });
  }
  switchToCancel() {
    this.location.back();
  }
  onEditClick(): void {
    this.isEditMode = true;
    this.disabledMode = false;
  }
  onCancelEdit(): void {
    if (this.isCreateMode) {
      this.location.back();
    } else {
      this.isEditMode = false;
      this.disabledMode = true;
    }
  }
  private initializeRoleContext() {
    const rolesRaw = localStorage.getItem('LoggedInUserroles');
    let roles: string[] = [];
    if (rolesRaw && rolesRaw !== 'undefined') {
      try {
        const parsed = JSON.parse(rolesRaw);
        roles = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        roles = [rolesRaw];
      }
    }
    const normalizedRoles = roles.map((role) => role?.toUpperCase?.() || '');
    this.isAdminUser = normalizedRoles.some((role) => role.includes('ADMIN'));
    this.isDistributorUser = normalizedRoles.some((role) => role.includes('DISTRIBUTOR'));
    this.isAgentUser = normalizedRoles.some((role) => role.includes('AGENT') || role.includes('RETAIL'));
    this.canCreateUsers = !this.isAgentUser;
    this.currentDistributorId = localStorage.getItem('userId') || '';
    if (this.isAdminUser) {
      this.availableUserTypes = ['DISTRIBUTOR', 'AGENT'];
    } else if (this.isDistributorUser) {
      this.availableUserTypes = ['AGENT'];
    } else {
      this.availableUserTypes = [];
    }
  }
}
