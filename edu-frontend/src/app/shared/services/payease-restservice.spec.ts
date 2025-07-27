import { TestBed } from '@angular/core/testing';

import { PayeaseRestservice } from './payease-restservice';

describe('PayeaseRestservice', () => {
  let service: PayeaseRestservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayeaseRestservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
