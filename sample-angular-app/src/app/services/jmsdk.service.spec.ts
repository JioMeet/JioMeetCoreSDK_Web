import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { JmsdkService } from './jmsdk.service';

describe('JmsdkService', () => {
  let service: JmsdkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    service = TestBed.inject(JmsdkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
