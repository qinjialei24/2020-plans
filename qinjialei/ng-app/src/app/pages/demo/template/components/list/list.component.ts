import { Component, Input, TemplateRef } from '@angular/core';

interface Payload {
  age: number;
  name: string;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent {
  @Input()
  data: Payload[] = [
    {
      age: 10,
      name: '小王',
    },
    {
      age: 12,
      name: '老王',
    }
  ];

  @Input() customRenderer: TemplateRef<{ $implicit: Payload; }>;
}
