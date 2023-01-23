import { TestBed } from '@angular/core/testing';

import { BotmeService } from './botme.service';

describe('BotmeService', () => {
  let service: BotmeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BotmeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
