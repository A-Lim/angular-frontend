import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AlertService } from 'app/shared/services/alert.service';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public messages: string[];
  public type: string;

  constructor(private alertService: AlertService) {
    
  }

  ngOnInit() {
    this.subscription = this.alertService.getAlert().subscribe(data => {
      if (data) {
        this.type = data.type;
        // check if data type
        // convert them all string array
        if (data.message instanceof HttpErrorResponse) {
          this.messages = [data.message.message];
        } else if (data.message instanceof Array) {
          this,this.messages = data.message
        } else {
          this.messages = [data.message];
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
