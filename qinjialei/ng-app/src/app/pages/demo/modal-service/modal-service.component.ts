import { ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector, TemplatePortal } from '@angular/cdk/portal';
import { Injectable, Injector, OnDestroy, Optional, SkipSelf, TemplateRef, ViewContainerRef, Component } from '@angular/core';

import { ModalService } from 'src/app/components/modal/modal.service';
import { ModalComponent } from 'src/app/components/modal/modal.component';

@Component({
  selector: 'app-modal-service',
  templateUrl: './modal-service.component.html',
  styleUrls: ['./modal-service.component.less']
})
export class ModalServiceComponent {

  constructor(
    private modalService: ModalService,
  ) { }


  open() {
    this.modalService.open('content, null', null);
  }

}
