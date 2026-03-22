import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { CartService } from '../../Services/cart.service';
import { ProductsService } from '../../Services/products.service';
import { Product } from '../../Services/product.model';
import { ImageFallbackUtil } from '../../Services/image-fallback.util';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchTerm = '';
  showSearchPanel = false;
  showAccountPopup = false;
  accountMobile = '';
  notifyOffers = true;
  countryCode = '+91';
  showOtpStep = false;
  otpDigits = ['', '', '', ''];
  otpCountdown = 30;
  accountFormSubmitted = false;
  otpFormSubmitted = false;
  private otpTimer?: ReturnType<typeof setInterval>;

  readonly countryOptions = [
    { code: '+91', label: 'India', flag: 'IN', flagImage: 'https://flagcdn.com/w40/in.png' },
    { code: '+1', label: 'United States', flag: 'US', flagImage: 'https://flagcdn.com/w40/us.png' },
    { code: '+44', label: 'United Kingdom', flag: 'UK', flagImage: 'https://flagcdn.com/w40/gb.png' },
    { code: '+61', label: 'Australia', flag: 'AU', flagImage: 'https://flagcdn.com/w40/au.png' },
    { code: '+971', label: 'UAE', flag: 'AE', flagImage: 'https://flagcdn.com/w40/ae.png' },
    { code: '+65', label: 'Singapore', flag: 'SG', flagImage: 'https://flagcdn.com/w40/sg.png' }
  ];

  readonly topPicks = [
    'non-vegetarian pickles',
    'vegetarian pickles',
    'sweets and snacks',
    'fryums',
    'instant mixes',
    'masala and kaaram powders'
  ];

  popularProducts: Product[] = [];
  readonly cartCount$ = this.cartService.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );

  constructor(
    private readonly cartService: CartService,
    private readonly router: Router,
    private readonly productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.popularProducts = this.productsService
      .getCurrentProducts()
      .filter(product => product.inStock)
      .slice(0, 4);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showSearchPanel = false;
  }

  search(): void {
    this.showSearchPanel = false;
    this.router.navigate(['/products'], { queryParams: { q: this.searchTerm || null } });
  }

  openSearchPanel(event: MouseEvent): void {
    event.stopPropagation();
    this.showAccountPopup = false;
    this.showSearchPanel = true;
  }

  useTopPick(pick: string, event: MouseEvent): void {
    event.stopPropagation();
    this.searchTerm = pick;
    this.search();
  }

  viewProduct(product: Product, event: MouseEvent): void {
    event.stopPropagation();
    this.searchTerm = product.name;
    this.search();
  }

  openCart(): void {
    this.showAccountPopup = false;
    this.cartService.openDrawer();
  }

  openAccountPopup(event: MouseEvent): void {
    event.stopPropagation();
    this.showSearchPanel = false;
    this.showOtpStep = false;
    this.accountFormSubmitted = false;
    this.otpFormSubmitted = false;
    this.showAccountPopup = true;
  }

  closeAccountPopup(): void {
    this.showAccountPopup = false;
    this.showOtpStep = false;
    this.otpDigits = ['', '', '', ''];
    this.accountFormSubmitted = false;
    this.otpFormSubmitted = false;
    this.stopOtpCountdown();
  }

  submitAccountForm(): void {
    this.accountFormSubmitted = true;
    if (!this.isMobileValid) {
      return;
    }

    this.accountMobile = this.sanitizedMobile;
    this.showOtpStep = true;
    this.otpDigits = ['', '', '', ''];
    this.otpFormSubmitted = false;
    this.startOtpCountdown();
  }

  getAccountPromoImage(): string {
    const image = this.popularProducts.length ? this.popularProducts[0].image : '';
    return ImageFallbackUtil.ensureImage(image, 'Food On Farm', 'Account Login');
  }

  get selectedCountryFlag(): string {
    return this.countryOptions.find(option => option.code === this.countryCode)?.flag || 'GL';
  }

  get selectedCountryLabel(): string {
    return this.countryOptions.find(option => option.code === this.countryCode)?.label || 'Country';
  }

  get selectedCountryFlagImage(): string {
    return this.countryOptions.find(option => option.code === this.countryCode)?.flagImage || '';
  }

  get expectedMobileLength(): number {
    const lengthMap: Record<string, number> = {
      '+91': 10,
      '+1': 10,
      '+44': 10,
      '+61': 9,
      '+971': 9,
      '+65': 8
    };
    return lengthMap[this.countryCode] || 10;
  }

  get sanitizedMobile(): string {
    return this.accountMobile.replace(/\D/g, '').slice(0, this.expectedMobileLength);
  }

  get isMobileValid(): boolean {
    return this.sanitizedMobile.length === this.expectedMobileLength;
  }

  get mobileValidationMessage(): string {
    if (!this.accountFormSubmitted) {
      return '';
    }
    if (!this.sanitizedMobile.length) {
      return 'Mobile number is required.';
    }
    if (!this.isMobileValid) {
      return `Enter a valid ${this.expectedMobileLength}-digit mobile number.`;
    }
    return '';
  }

  get formattedMobile(): string {
    return `${this.countryCode}${this.sanitizedMobile}`;
  }

  get isOtpComplete(): boolean {
    return this.otpDigits.every(digit => digit.length === 1);
  }

  onMobileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.accountMobile = input.value.replace(/\D/g, '').slice(0, this.expectedMobileLength);
    input.value = this.accountMobile;
  }

  onCountryChange(): void {
    this.accountMobile = this.accountMobile.replace(/\D/g, '').slice(0, this.expectedMobileLength);
  }

  onOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const numeric = input.value.replace(/\D/g, '');
    this.otpDigits[index] = numeric ? numeric[numeric.length - 1] : '';
    input.value = this.otpDigits[index];

    if (this.isOtpComplete) {
      this.otpFormSubmitted = false;
    }

    if (this.otpDigits[index] && index < this.otpDigits.length - 1) {
      const next = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
      next?.focus();
    }
  }

  onOtpBackspace(index: number, event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`) as HTMLInputElement | null;
      prev?.focus();
    }
  }

  editMobile(): void {
    this.showOtpStep = false;
    this.otpDigits = ['', '', '', ''];
    this.otpFormSubmitted = false;
    this.stopOtpCountdown();
  }

  resendOtp(): void {
    if (this.otpCountdown > 0) {
      return;
    }

    this.otpDigits = ['', '', '', ''];
    this.otpFormSubmitted = false;
    this.startOtpCountdown();
  }

  verifyOtp(): void {
    this.otpFormSubmitted = true;
    if (!this.isOtpComplete) {
      return;
    }

    this.closeAccountPopup();
  }

  private startOtpCountdown(): void {
    this.stopOtpCountdown();
    this.otpCountdown = 30;
    this.otpTimer = setInterval(() => {
      if (this.otpCountdown <= 1) {
        this.otpCountdown = 0;
        this.stopOtpCountdown();
        return;
      }
      this.otpCountdown -= 1;
    }, 1000);
  }

  private stopOtpCountdown(): void {
    if (this.otpTimer) {
      clearInterval(this.otpTimer);
      this.otpTimer = undefined;
    }
  }

  ngOnDestroy(): void {
    this.stopOtpCountdown();
  }

  getSafeImage(url: string | undefined, label: string, context: string): string {
    return ImageFallbackUtil.ensureImage(url, label, context);
  }

  onImageError(event: Event, label: string, context: string): void {
    ImageFallbackUtil.handleImageError(event, label, context);
  }
}
