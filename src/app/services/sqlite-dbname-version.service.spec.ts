import { TestBed } from '@angular/core/testing';

import { SqliteDbnameVersionService } from './sqlite-dbname-version.service';

describe('SqliteDbnameVersionService', () => {
  let service: SqliteDbnameVersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqliteDbnameVersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
