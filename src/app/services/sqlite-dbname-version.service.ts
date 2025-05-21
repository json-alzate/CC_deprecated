import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SqliteDbnameVersionService {
  private dbNameVersionDict: Map<string, number> = new Map();

  constructor() { }
  set(dbName: string, version: number) {
    this.dbNameVersionDict.set(dbName, version);
  }
  getVersion(dbName: string) {
    if (this.dbNameVersionDict.has(dbName)) {
      return this.dbNameVersionDict.get(dbName);
    } else {
      return -1;
    }
  }
}
