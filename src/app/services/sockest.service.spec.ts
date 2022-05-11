import { TestBed } from '@angular/core/testing';

import { SocketService } from './sockt.service';

describe('SockestService', () => {
  let service: SocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
