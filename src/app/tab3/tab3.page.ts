import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

  langs: string [] = [];
  constructor(private translateService: TranslateService) {
    this.langs = this.translateService.getLangs();
  }

  changeLang(event: CustomEvent){
    this.translateService.use(event.detail.value);
    console.log(event.detail.value);
  }

}
