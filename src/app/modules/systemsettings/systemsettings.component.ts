import { Component, OnInit, Renderer2 } from '@angular/core';
import { BaseComponent } from 'app/shared/components/base.component';
import { PageType } from 'app/shared/models/enums';
import { Title } from '@angular/platform-browser';
import { App } from 'app/configs/app.config';

@Component({
  selector: 'app-systemsettings',
  templateUrl: './systemsettings.component.html',
  styleUrls: ['./systemsettings.component.css']
})
export class SystemSettingsComponent extends BaseComponent implements OnInit {

  constructor(private titleService: Title, public renderer: Renderer2) { 
    super(renderer);
    this.configureBodyClass(PageType.WithSideMenu);
  }

  ngOnInit() {
    this.titleService.setTitle(`${App.NAME} | System Settings`);
  }

}
