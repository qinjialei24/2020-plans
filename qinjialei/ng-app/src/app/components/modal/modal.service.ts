import { Injectable } from '@angular/core';

import { OverlayModule } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  create() {
    console.log(111111111);
  }
}
