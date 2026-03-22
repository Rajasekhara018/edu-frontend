import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

type LegalPageType = 'privacy' | 'terms' | 'shipping';

interface LegalSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

@Component({
  selector: 'app-legal-page',
  templateUrl: './legal-page.component.html',
  styleUrls: ['./legal-page.component.scss']
})
export class LegalPageComponent {
  pageType: LegalPageType = 'privacy';
  title = '';
  effectiveDate = 'March 22, 2026';
  sections: LegalSection[] = [];

  constructor(private readonly route: ActivatedRoute) {
    this.route.data.subscribe(data => {
      const type = (data['page'] as LegalPageType) || 'privacy';
      this.pageType = type;
      this.applyPage(type);
    });
  }

  private applyPage(type: LegalPageType): void {
    const content = this.getContent(type);
    this.title = content.title;
    this.sections = content.sections;
  }

  private getContent(type: LegalPageType): { title: string; sections: LegalSection[] } {
    if (type === 'terms') {
      return {
        title: 'Terms & Conditions',
        sections: [
          {
            heading: 'Use of Platform',
            paragraphs: [
              'By using this platform, you agree to provide accurate account, address, and contact details for order processing and delivery.',
              'You are responsible for keeping your account credentials secure and for all activities that occur under your account.'
            ]
          },
          {
            heading: 'Orders and Pricing',
            paragraphs: [
              'All orders are subject to product availability, serviceability in your location, and confirmation by our operations team.',
              'Prices, discounts, and promotional offers may change without prior notice based on inventory and campaign schedules.'
            ],
            bullets: [
              'Order confirmation is sent after successful payment or valid cash-on-delivery selection.',
              'We may cancel or limit quantities for bulk, duplicate, or suspicious orders.',
              'Taxes and final payable amount are shown at checkout before order placement.'
            ]
          },
          {
            heading: 'Payments and Refunds',
            paragraphs: [
              'Payments processed through online modes are secured by supported payment gateway providers.',
              'Eligible refunds for cancellations, damaged items, or missing products are processed to the original payment method as per policy timelines.'
            ]
          }
        ]
      };
    }

    if (type === 'shipping') {
      return {
        title: 'Shipping & Returns',
        sections: [
          {
            heading: 'Shipping Policy',
            paragraphs: [
              'Delivery slots are shown based on your area, cart size, and current service load. Estimated delivery windows are visible at checkout.',
              'During high-demand periods, delivery may take longer than standard timing. You will receive status updates in your order tracking view.'
            ],
            bullets: [
              'Free delivery may apply above minimum cart value thresholds.',
              'A delivery partner may contact you for address confirmation.',
              'Unserviceable pincodes are automatically blocked at checkout.'
            ]
          },
          {
            heading: 'Return and Replacement Eligibility',
            paragraphs: [
              'Returns or replacement requests should be raised within the allowed window for damaged, expired, missing, or incorrect items.',
              'Perishable items are typically replacement-first where feasible, based on verification and stock availability.'
            ]
          },
          {
            heading: 'Refund Timelines',
            paragraphs: [
              'Approved refunds are initiated after verification and are usually completed within 5 to 7 business days depending on the payment method.',
              'For wallet or instant payment options, processing may complete earlier subject to bank and network settlement cycles.'
            ]
          }
        ]
      };
    }

    return {
      title: 'Privacy Policy',
      sections: [
        {
          heading: 'Information We Collect',
          paragraphs: [
            'We collect basic profile information, delivery addresses, and order preferences to process your purchases and improve your shopping experience.',
            'Payment details are handled through secure payment partners; we do not store complete card credentials on this application.'
          ]
        },
        {
          heading: 'How We Use Information',
          paragraphs: [
            'Data is used to manage orders, provide customer support, send service notifications, and maintain delivery quality.',
            'We may analyze order trends in aggregate form to improve catalog availability, delivery accuracy, and customer experience.'
          ],
          bullets: [
            'Order fulfillment and delivery coordination',
            'Customer support communication',
            'Fraud prevention and platform security',
            'Service updates and operational notifications'
          ]
        },
        {
          heading: 'Data Security and Retention',
          paragraphs: [
            'We follow reasonable safeguards for storage and transmission of personal information used for grocery operations.',
            'Data is retained only for operational, legal, tax, and accounting requirements for the minimum required period.'
          ]
        }
      ]
    };
  }
}
