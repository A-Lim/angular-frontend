import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { App } from 'app/configs/app.config';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  constructor(private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle(`${App.NAME} | Profile`);
  }

}
