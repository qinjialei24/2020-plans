import { NgModule } from '@angular/core';
import { ShareModule } from '../share/share.module';
import { HomeModule } from './home/home.module';
import { DemoModule } from './demo/demo.module';

@NgModule({
  declarations: [],
  imports: [
    ShareModule,
    HomeModule,
    DemoModule,
  ],
  exports: [
    HomeModule,
    DemoModule,
  ]
})
export class PagesModule { }
