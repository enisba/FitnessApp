import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appRoutes } from './app.routes';
import { APP_ROUTE_PROVIDER } from './route.provider';
import { provideAbpCore, withOptions } from '@abp/ng.core';
import { environment } from '../environments/environment';
import { registerLocale } from '@abp/ng.core/locale';
import { provideAbpOAuth } from '@abp/ng.oauth';
import { provideSettingManagementConfig } from '@abp/ng.setting-management/config';
import { provideAccountConfig } from '@abp/ng.account/config';
import { provideIdentityConfig } from '@abp/ng.identity/config';
import { provideTenantManagementConfig } from '@abp/ng.tenant-management/config';
import { provideFeatureManagementConfig } from '@abp/ng.feature-management';
import { provideLogo, withEnvironmentOptions } from '@volo/ngx-lepton-x.core';
import { ThemeLeptonXModule } from '@abp/ng.theme.lepton-x';
import { SideMenuLayoutModule } from '@abp/ng.theme.lepton-x/layouts';
import { AccountLayoutModule } from '@abp/ng.theme.lepton-x/account';
import { ThemeSharedModule, withHttpErrorConfig, withValidationBluePrint, provideAbpThemeShared } from '@abp/ng.theme.shared';
import { provideSideMenuLayout } from '@abp/ng.theme.lepton-x/layouts';
import { NzModalModule } from 'ng-zorro-antd/modal'; 
import { NZ_I18N, tr_TR } from 'ng-zorro-antd/i18n';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    APP_ROUTE_PROVIDER,
    provideAbpCore(withOptions({ environment, registerLocaleFn: registerLocale() })),
    provideSideMenuLayout(),
    provideAbpOAuth(),
    provideAnimations(),
    APP_ROUTE_PROVIDER,
    { provide: NZ_I18N, useValue: tr_TR }, 
    provideSettingManagementConfig(),
    provideAccountConfig(),
    provideIdentityConfig(),
    provideTenantManagementConfig(),
    provideFeatureManagementConfig(),
    provideAnimations(),
    provideLogo(withEnvironmentOptions(environment)),
    importProvidersFrom(
      ThemeLeptonXModule.forRoot(),
      SideMenuLayoutModule.forRoot(),
      AccountLayoutModule.forRoot(),
      ThemeSharedModule,
      NzModalModule 
    ),
    provideAbpThemeShared(withValidationBluePrint({ wrongPassword: 'Please choose 1q2w3E*' })),
  ],
};
