import { Component } from '@angular/core';
import { AppThemeOption, PayeaseThemeService } from '../shared/services/payease-theme-service';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  constructor(public themeService: PayeaseThemeService) { }

  readonly topMetrics = [
    { label: 'Workspace mode', value: 'Live', note: 'Production operator flows are currently enabled' },
    { label: 'Alerts', value: 'Managed', note: 'Operational notices and exceptions are routed to the desk' },
    { label: 'Security posture', value: 'Protected', note: 'Session and credential controls are active' }
  ];

  readonly preferences = [
    {
      title: 'Notifications',
      description: 'Control how transaction alerts, reversals, and desk notices reach operators.',
      items: [
        { label: 'High-risk transaction alerts', value: 'Enabled' },
        { label: 'Daily reconciliation summary', value: 'Enabled' },
        { label: 'Marketing communication', value: 'Disabled' }
      ]
    },
    {
      title: 'Workspace',
      description: 'Tune the console for day-to-day operator work and desk efficiency.',
      items: [
        { label: 'Default landing page', value: 'Home dashboard' },
        { label: 'Sidebar behaviour', value: 'Expanded on desktop' },
        { label: 'Theme preference', value: 'Selectable from 12 themes' }
      ]
    },
    {
      title: 'Security',
      description: 'Review the baseline controls protecting operator sessions and sensitive actions.',
      items: [
        { label: 'Session timeout', value: '15 minutes' },
        { label: 'Password rotation', value: '90 days' },
        { label: 'PIN update reminder', value: 'Enabled' }
      ]
    }
  ];

  readonly integrations = [
    { name: 'Collections gateway', status: 'Connected', note: 'Primary settlement and card rails are active' },
    { name: 'Customer records', status: 'Synced', note: 'Shared master data is available in the console' },
    { name: 'Document archive', status: 'Pending', note: 'Document upload workflow can be enabled here next' }
  ];

  get themes(): AppThemeOption[] {
    return this.themeService.themeOptions;
  }

  isActiveTheme(themeId: string): boolean {
    return this.themeService.themeType === themeId;
  }

  selectTheme(themeId: string): void {
    this.themeService.switchTheme(themeId);
  }
}
