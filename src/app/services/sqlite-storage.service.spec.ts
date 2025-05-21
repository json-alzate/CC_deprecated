import { TestBed } from '@angular/core/testing';

import { SqliteStorageService } from './sqlite-storage.service';

describe('SqliteStorageService', () => {
  let service: SqliteStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqliteStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
