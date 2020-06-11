import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/components/modal/modal.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.less']
})
export class TemplateComponent implements OnInit {

  constructor(
    private modalService: ModalService
  ) {

  }

  ngOnInit() {

  }

}
