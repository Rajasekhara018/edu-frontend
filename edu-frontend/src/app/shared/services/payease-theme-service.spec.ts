import { TestBed } from '@angular/core/testing';

import { PayeaseThemeService } from './payease-theme-service';

describe('PayeaseThemeService', () => {
  let service: PayeaseThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayeaseThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
