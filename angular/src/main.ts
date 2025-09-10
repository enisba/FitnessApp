import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { LOCALE_ID } from '@angular/core';
import tr from '@angular/common/locales/tr';
import { NZ_I18N, tr_TR } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';


registerLocaleData(tr); 
bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
