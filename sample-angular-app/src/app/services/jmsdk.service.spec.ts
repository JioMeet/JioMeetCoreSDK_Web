import { TestBed } from '@angular/core/testing';

import { JmsdkService } from './jmsdk.service';

describe('JmsdkService', () => {
  let service: JmsdkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JmsdkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
