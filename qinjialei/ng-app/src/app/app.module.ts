import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ShareModule } from './share/share.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    ShareModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
