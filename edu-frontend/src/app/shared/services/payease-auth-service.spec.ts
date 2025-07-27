import { TestBed } from '@angular/core/testing';

import { PayeaseAuthService } from './payease-auth-service';

describe('PayeaseAuthService', () => {
  let service: PayeaseAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayeaseAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
