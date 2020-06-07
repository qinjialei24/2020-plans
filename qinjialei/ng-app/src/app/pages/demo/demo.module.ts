import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoRoutingModule } from './demo-routing.module';
import { DemoComponent } from './demo.component';
import { ShareModule } from 'src/app/share/share.module';
import { TemplateComponent } from './template/template.component';
import { ListComponent } from './template/components/list/list.component';


@NgModule({
  declarations: [DemoComponent, TemplateComponent, ListComponent],
  imports: [
    CommonModule,
    DemoRoutingModule,
    ShareModule
  ]
})
export class DemoModule { }
