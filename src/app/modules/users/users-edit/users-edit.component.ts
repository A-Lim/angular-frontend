import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { App } from 'app/configs/app.config';

@Component({
  selector: 'users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.css']
})
export class UsersEditComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle(`${App.NAME} | Edit User`);
  }

}
