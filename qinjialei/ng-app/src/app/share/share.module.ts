import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ComponentsModule,
  ],
  exports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ComponentsModule
  ]
})
export class ShareModule { }
