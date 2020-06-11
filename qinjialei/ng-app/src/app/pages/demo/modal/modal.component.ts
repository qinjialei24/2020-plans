import { Component, OnInit, TemplateRef, Type } from '@angular/core';
import { MyOverlayRef } from './myoverlay-ref';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less']
})
export class ModalComponent implements OnInit {
  contentType: 'template' | 'string' | 'component';
  content: string | TemplateRef<any> | Type<any>;
  context;

  constructor(private ref: MyOverlayRef) { }

  close() {
    this.ref.close(null);
  }

  ngOnInit() {
    this.content = this.ref.content;

    if (typeof this.content === 'string') {
      this.contentType = 'string';
    } else if (this.content instanceof TemplateRef) {
      this.contentType = 'template';
      this.context = {
        close: this.ref.close.bind(this.ref)
      };
    } else {
      this.contentType = 'component';
    }
  }
}
