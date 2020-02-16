import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { App } from 'app/configs/app.config';
import { BaseComponent } from 'app/shared/components/base.component';
import { PageType } from 'app/shared/models/enums';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends BaseComponent implements OnInit {
  
  constructor(private titleService: Title, public renderer: Renderer2) {
    super(renderer);
    this.configureBodyClass(PageType.WithSideMenu);
  }

  ngOnInit() {
    this.titleService.setTitle(`${App.NAME} | Profile`);
  }

}
