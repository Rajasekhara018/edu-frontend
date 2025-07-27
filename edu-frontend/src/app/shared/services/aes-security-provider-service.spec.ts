import { TestBed } from '@angular/core/testing';

import { AesSecurityProviderService } from './aes-security-provider-service';

describe('AesSecurityProviderService', () => {
  let service: AesSecurityProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AesSecurityProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
