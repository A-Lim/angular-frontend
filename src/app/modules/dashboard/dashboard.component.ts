import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { BaseComponent } from 'app/shared/components/base.component';
import { App } from 'app/configs/app.config';
import { DynamicScriptLoaderService } from 'app/shared/services/dynamicscriptloader.service';
import { AlertService } from 'app/shared/services/alert.service';
import { PageType } from 'app/shared/models/enums';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  constructor(private titleService: Title, private dynamicScriptLoader: DynamicScriptLoaderService, 
              public renderer: Renderer2) {
    super(renderer); 
    this.configureBodyClass(PageType.WithSideMenu);
  }

  ngOnInit() {
    this.titleService.setTitle(`${App.NAME} | Dashboard`);
    this.dynamicScriptLoader.load('apexCharts', 'dragula', 'dashboardAnalytics').then(_ => {
      // scripts loaded successfully
    }).catch(error => console.log(error));
  }
}
