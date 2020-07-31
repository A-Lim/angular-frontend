import { Component, OnInit, Input } from '@angular/core';
import { OrderWorkItem } from 'app/shared/models/orderworkitem.model';

@Component({
  selector: 'modal-work-item-details',
  templateUrl: './modal-work-item-details.component.html',
  styleUrls: ['./modal-work-item-details.component.css']
})
export class ModalWorkItemDetailsComponent implements OnInit {
  @Input()
  workItem: OrderWorkItem;

  ngOnInit() {
  }

}
