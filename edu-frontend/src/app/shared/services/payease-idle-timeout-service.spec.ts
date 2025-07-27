import { TestBed } from '@angular/core/testing';

import { PayeaseIdleTimeoutService } from './payease-idle-timeout-service';

describe('PayeaseIdleTimeoutService', () => {
  let service: PayeaseIdleTimeoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayeaseIdleTimeoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
