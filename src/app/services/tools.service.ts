import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Flag } from '@models/tools.models';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  flags: Flag[] = [];

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Carga lar referencias para utilizar las banderas
   */
  loadFlags() {
    this.httpClient.get<Flag[]>('/assets/data/flags.json').subscribe(flags => this.flags = flags);
  }




}
