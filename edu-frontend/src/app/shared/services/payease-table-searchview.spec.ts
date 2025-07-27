import { TestBed } from '@angular/core/testing';

import { PayeaseTableSearchview } from './payease-table-searchview';

describe('PayeaseTableSearchview', () => {
  let service: PayeaseTableSearchview;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayeaseTableSearchview);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
