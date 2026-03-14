import { Component } from '@angular/core';

type UserContext = 'ADMIN' | 'DISTRIBUTOR' | 'AGENT';
type RangeKey = 'today' | 'week' | 'month';
type SettlementStatus = 'SETTLED' | 'PENDING' | 'FAILED';

interface DistributorProfile {
  id: string;
  name: string;
}

interface AgentProfile {
  id: string;
  distributorId: string;
  name: string;
}

interface CommissionEntry {
  date: string;
  distributorId: string;
  distributorName: string;
  agentId: string;
  agentName: string;
  paymentType: string;
  txnCount: number;
  grossAmount: number;
  distributorCommission: number;
  agentCommission: number;
  platformCommission: number;
  status: SettlementStatus;
}

interface SummaryCard {
  label: string;
  value: string;
  note: string;
  tone: string;
}

interface TrendPoint {
  label: string;
  amount: number;
}

interface BreakdownRow {
  name: string;
  scope: string;
  txnCount: number;
  grossAmount: number;
  earnings: number;
}

@Component({
  selector: 'app-commission-dashboard',
  standalone: false,
  templateUrl: './commission-dashboard.html',
  styleUrl: './commission-dashboard.scss'
})
export class CommissionDashboard {
  readonly currentDate = new Date('2026-03-14T12:00:00');
  readonly ranges: { key: RangeKey; label: string; note: string }[] = [
    { key: 'today', label: 'Today', note: 'Live commission visibility' },
    { key: 'week', label: 'This week', note: 'Rolling 7-day payout trend' },
    { key: 'month', label: 'This month', note: '30-day earning summary' }
  ];

  readonly distributors: DistributorProfile[] = [
    { id: 'DST-1001', name: 'Northline Distribution' },
    { id: 'DST-1002', name: 'Campus Pay Network' },
    { id: 'DST-1003', name: 'Scholar Ledger Hub' }
  ];

  readonly agents: AgentProfile[] = [
    { id: 'AG-2101', distributorId: 'DST-1001', name: 'Riya Collections' },
    { id: 'AG-2102', distributorId: 'DST-1001', name: 'Raman Support Point' },
    { id: 'AG-2201', distributorId: 'DST-1002', name: 'Metro Assist Agent' },
    { id: 'AG-2301', distributorId: 'DST-1003', name: 'Ledger Campus Desk' }
  ];

  readonly entries: CommissionEntry[] = [
    {
      date: '2026-03-14',
      distributorId: 'DST-1001',
      distributorName: 'Northline Distribution',
      agentId: 'AG-2101',
      agentName: 'Riya Collections',
      paymentType: 'Card payment',
      txnCount: 18,
      grossAmount: 62400,
      distributorCommission: 1092,
      agentCommission: 436,
      platformCommission: 280,
      status: 'SETTLED'
    },
    {
      date: '2026-03-14',
      distributorId: 'DST-1001',
      distributorName: 'Northline Distribution',
      agentId: 'AG-2102',
      agentName: 'Raman Support Point',
      paymentType: 'Assisted checkout',
      txnCount: 11,
      grossAmount: 28100,
      distributorCommission: 478,
      agentCommission: 224,
      platformCommission: 120,
      status: 'PENDING'
    },
    {
      date: '2026-03-13',
      distributorId: 'DST-1002',
      distributorName: 'Campus Pay Network',
      agentId: 'AG-2201',
      agentName: 'Metro Assist Agent',
      paymentType: 'Instant bank debit',
      txnCount: 16,
      grossAmount: 41750,
      distributorCommission: 668,
      agentCommission: 292,
      platformCommission: 184,
      status: 'SETTLED'
    },
    {
      date: '2026-03-12',
      distributorId: 'DST-1003',
      distributorName: 'Scholar Ledger Hub',
      agentId: 'AG-2301',
      agentName: 'Ledger Campus Desk',
      paymentType: 'Wallet transfer',
      txnCount: 9,
      grossAmount: 19500,
      distributorCommission: 273,
      agentCommission: 117,
      platformCommission: 72,
      status: 'FAILED'
    },
    {
      date: '2026-03-10',
      distributorId: 'DST-1001',
      distributorName: 'Northline Distribution',
      agentId: 'AG-2101',
      agentName: 'Riya Collections',
      paymentType: 'Card payment',
      txnCount: 14,
      grossAmount: 34800,
      distributorCommission: 609,
      agentCommission: 244,
      platformCommission: 156,
      status: 'SETTLED'
    },
    {
      date: '2026-02-27',
      distributorId: 'DST-1002',
      distributorName: 'Campus Pay Network',
      agentId: 'AG-2201',
      agentName: 'Metro Assist Agent',
      paymentType: 'Assisted checkout',
      txnCount: 22,
      grossAmount: 55600,
      distributorCommission: 889,
      agentCommission: 390,
      platformCommission: 233,
      status: 'SETTLED'
    }
  ];

  userContext: UserContext = 'ADMIN';
  selectedRange: RangeKey = 'today';
  selectedDistributorId = 'ALL';
  selectedAgentId = 'ALL';
  currentUserId = '';

  ngOnInit(): void {
    this.resolveRoleContext();
    this.applyRoleDefaults();
  }

  get pageTitle(): string {
    switch (this.userContext) {
      case 'ADMIN':
        return 'Track commission performance across the full partner network';
      case 'DISTRIBUTOR':
        return 'Review your distributor earnings and agent-level payout contribution';
      default:
        return 'Review your commission earnings and settlement progress';
    }
  }

  get pageDescription(): string {
    switch (this.userContext) {
      case 'ADMIN':
        return 'Use one dashboard to review distributor earnings, agent commissions, pending settlements, and platform share by time range.';
      case 'DISTRIBUTOR':
        return 'Monitor your distributor share, agent payout mix, and settlement status for the accounts mapped under your network.';
      default:
        return 'Focus on your own commission earnings with a simple view of daily, weekly, and monthly performance.';
    }
  }

  get canFilterDistributor(): boolean {
    return this.userContext === 'ADMIN';
  }

  get canFilterAgent(): boolean {
    return this.userContext !== 'AGENT';
  }

  get visibleDistributors(): DistributorProfile[] {
    if (this.userContext === 'ADMIN') {
      return this.distributors;
    }

    return this.distributors.filter((item) => item.id === this.selectedDistributorId);
  }

  get visibleAgents(): AgentProfile[] {
    const distributorId = this.selectedDistributorId === 'ALL' ? '' : this.selectedDistributorId;
    const baseAgents = distributorId
      ? this.agents.filter((item) => item.distributorId === distributorId)
      : this.agents;

    if (this.userContext === 'AGENT') {
      return baseAgents.filter((item) => item.id === this.selectedAgentId);
    }

    return baseAgents;
  }

  get filteredEntries(): CommissionEntry[] {
    return this.entries.filter((entry) => {
      if (!this.matchesRoleScope(entry)) {
        return false;
      }

      if (this.selectedDistributorId !== 'ALL' && entry.distributorId !== this.selectedDistributorId) {
        return false;
      }

      if (this.selectedAgentId !== 'ALL' && entry.agentId !== this.selectedAgentId) {
        return false;
      }

      return this.isWithinRange(entry.date, this.selectedRange);
    });
  }

  get summaryCards(): SummaryCard[] {
    const today = this.calculateRangeTotals('today');
    const week = this.calculateRangeTotals('week');
    const month = this.calculateRangeTotals('month');
    const pendingSettlement = this.filteredEntries
      .filter((entry) => entry.status === 'PENDING')
      .reduce((sum, entry) => sum + this.getUserEarnings(entry), 0);

    return [
      {
        label: 'Today earned',
        value: this.formatCurrency(today.earnings),
        note: `${today.txnCount} processed transactions`,
        tone: 'primary'
      },
      {
        label: 'This week',
        value: this.formatCurrency(week.earnings),
        note: `${week.txnCount} transactions in the last 7 days`,
        tone: 'emerald'
      },
      {
        label: 'This month',
        value: this.formatCurrency(month.earnings),
        note: `${month.txnCount} transactions in the last 30 days`,
        tone: 'indigo'
      },
      {
        label: 'Pending settlement',
        value: this.formatCurrency(pendingSettlement),
        note: 'Awaiting payout release',
        tone: 'amber'
      }
    ];
  }

  get trendPoints(): TrendPoint[] {
    const offsets = this.selectedRange === 'today' ? 0 : this.selectedRange === 'week' ? 6 : 5;
    const points: TrendPoint[] = [];

    for (let offset = offsets; offset >= 0; offset--) {
      const date = new Date(this.currentDate);
      date.setDate(this.currentDate.getDate() - offset);
      const isoDate = this.toIsoDate(date);
      const amount = this.entries
        .filter((entry) => this.matchesRoleScope(entry) && this.matchesSelectedScope(entry) && entry.date === isoDate)
        .reduce((sum, entry) => sum + this.getUserEarnings(entry), 0);

      points.push({
        label: this.selectedRange === 'month'
          ? date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
          : date.toLocaleDateString('en-IN', { weekday: 'short' }),
        amount
      });
    }

    return points;
  }

  get breakdownRows(): BreakdownRow[] {
    const rows = new Map<string, BreakdownRow>();

    this.filteredEntries.forEach((entry) => {
      const key = this.userContext === 'ADMIN'
        ? entry.distributorId
        : this.userContext === 'DISTRIBUTOR'
          ? entry.agentId
          : entry.paymentType;

      const current = rows.get(key) || {
        name: this.userContext === 'ADMIN'
          ? entry.distributorName
          : this.userContext === 'DISTRIBUTOR'
            ? entry.agentName
            : entry.paymentType,
        scope: this.userContext === 'ADMIN'
          ? 'Distributor'
          : this.userContext === 'DISTRIBUTOR'
            ? 'Agent'
            : 'Payment type',
        txnCount: 0,
        grossAmount: 0,
        earnings: 0
      };

      current.txnCount += entry.txnCount;
      current.grossAmount += entry.grossAmount;
      current.earnings += this.getUserEarnings(entry);
      rows.set(key, current);
    });

    return Array.from(rows.values()).sort((left, right) => right.earnings - left.earnings);
  }

  onRangeChange(range: RangeKey): void {
    this.selectedRange = range;
  }

  onDistributorChange(): void {
    if (this.userContext === 'ADMIN') {
      this.selectedAgentId = 'ALL';
      return;
    }

    this.selectedAgentId = this.visibleAgents[0]?.id || 'ALL';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  }

  settlementTone(status: SettlementStatus): string {
    switch (status) {
      case 'SETTLED':
        return 'status-success';
      case 'PENDING':
        return 'status-pending';
      case 'FAILED':
        return 'status-failed';
      default:
        return 'status-neutral';
    }
  }

  private resolveRoleContext(): void {
    this.currentUserId = localStorage.getItem('userId') || '';
    const rolesRaw = localStorage.getItem('LoggedInUserroles');
    const roles: string[] = rolesRaw && rolesRaw !== 'undefined' ? JSON.parse(rolesRaw) : [];
    const normalizedRoles = roles.map((role) => role?.toUpperCase?.() || '');

    if (normalizedRoles.some((role) => role.includes('ADMIN'))) {
      this.userContext = 'ADMIN';
      return;
    }

    if (normalizedRoles.some((role) => role.includes('DISTRIBUTOR'))) {
      this.userContext = 'DISTRIBUTOR';
      return;
    }

    this.userContext = 'AGENT';
  }

  private applyRoleDefaults(): void {
    if (this.userContext === 'ADMIN') {
      this.selectedDistributorId = 'ALL';
      this.selectedAgentId = 'ALL';
      return;
    }

    if (this.userContext === 'DISTRIBUTOR') {
      const fallbackDistributorId = this.currentUserId && this.distributors.some((item) => item.id === this.currentUserId)
        ? this.currentUserId
        : this.distributors[0]?.id || 'ALL';
      this.selectedDistributorId = fallbackDistributorId;
      this.selectedAgentId = 'ALL';
      return;
    }

    const fallbackAgentId = this.currentUserId && this.agents.some((item) => item.id === this.currentUserId)
      ? this.currentUserId
      : this.agents[0]?.id || 'ALL';
    const currentAgent = this.agents.find((item) => item.id === fallbackAgentId);

    this.selectedAgentId = fallbackAgentId;
    this.selectedDistributorId = currentAgent?.distributorId || 'ALL';
  }

  private calculateRangeTotals(range: RangeKey): { earnings: number; txnCount: number } {
    const scopedEntries = this.entries.filter((entry) =>
      this.matchesRoleScope(entry)
      && this.matchesSelectedScope(entry)
      && this.isWithinRange(entry.date, range)
    );

    return scopedEntries.reduce((totals, entry) => {
      totals.earnings += this.getUserEarnings(entry);
      totals.txnCount += entry.txnCount;
      return totals;
    }, { earnings: 0, txnCount: 0 });
  }

  private matchesRoleScope(entry: CommissionEntry): boolean {
    if (this.userContext === 'ADMIN') {
      return true;
    }

    if (this.userContext === 'DISTRIBUTOR') {
      return entry.distributorId === this.selectedDistributorId;
    }

    return entry.agentId === this.selectedAgentId;
  }

  private matchesSelectedScope(entry: CommissionEntry): boolean {
    if (this.selectedDistributorId !== 'ALL' && entry.distributorId !== this.selectedDistributorId) {
      return false;
    }

    if (this.selectedAgentId !== 'ALL' && entry.agentId !== this.selectedAgentId) {
      return false;
    }

    return true;
  }

  private getUserEarnings(entry: CommissionEntry): number {
    switch (this.userContext) {
      case 'ADMIN':
        return entry.distributorCommission + entry.agentCommission + entry.platformCommission;
      case 'DISTRIBUTOR':
        return entry.distributorCommission;
      default:
        return entry.agentCommission;
    }
  }

  private isWithinRange(dateString: string, range: RangeKey): boolean {
    const targetDate = new Date(`${dateString}T00:00:00`);
    const diffInDays = Math.floor((this.currentDate.getTime() - targetDate.getTime()) / 86400000);

    if (diffInDays < 0) {
      return false;
    }

    if (range === 'today') {
      return diffInDays === 0;
    }

    if (range === 'week') {
      return diffInDays <= 6;
    }

    return diffInDays <= 29;
  }

  private toIsoDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
