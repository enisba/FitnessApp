import { Component } from '@angular/core';
import { ConfigStateService } from '@abp/ng.core';
import { TranslateService } from '@ngx-translate/core';

// ABP UI componentleri
import {
  InternetConnectionStatusComponent,
  LoaderBarComponent
} from '@abp/ng.theme.shared';
import { DynamicLayoutComponent } from '@abp/ng.core';

@Component({
  selector: 'app-root',
  template: `
    <abp-loader-bar />
    <abp-dynamic-layout />
    <abp-internet-status />
  `,
  standalone: true,
  imports: [
    LoaderBarComponent,
    DynamicLayoutComponent,
    InternetConnectionStatusComponent
  ]
})
export class AppComponent {
  constructor(
    private configState: ConfigStateService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');

    this.configState
      .getDeep$('localization.currentCulture.cultureName')
      .subscribe((lang) => {
        if (lang) {
          const shortLang = lang.split('-')[0].toLowerCase();
          this.translate.use(shortLang);
        }
      });
  }
}
