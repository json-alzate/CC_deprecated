import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
})
export class PrivacyPage implements OnInit {



  constructor(
    private translocoService: TranslocoService
  ) {

  }

  ngOnInit() {
  }

  changeLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

}
