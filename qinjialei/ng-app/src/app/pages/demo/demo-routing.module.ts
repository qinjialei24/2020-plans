import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoComponent } from './demo.component';
import { TemplateComponent } from './template/template.component';
import { ModalServiceComponent } from './modal-service/modal-service.component';


const routes: Routes = [
  {
    path: 'demo',
    component: DemoComponent,
    children: [
      { path: 'template', component: TemplateComponent },
      { path: 'modalServiceComponent', component: ModalServiceComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoRoutingModule { }
