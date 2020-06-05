import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { CoreModule } from './core/core.module';
import { ShareModule } from './share/share.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    ShareModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
