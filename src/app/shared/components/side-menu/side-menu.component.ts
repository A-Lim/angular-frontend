import { Component, OnInit, Renderer2 } from '@angular/core';
import { OrderService } from 'app/modules/orders/orders.service';
import { OrderBadge } from 'app/modules/orders/models/orderbadge.model';
import { Ability } from '@casl/ability';

@Component({
  selector: 'shared-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  public menuIsOpened: boolean = true;
  public isHoverOver: boolean = false;
  public badges: OrderBadge[];

  constructor(private renderer: Renderer2, private orderService: OrderService, private ability: Ability) { }

  ngOnInit() {
    this.orderService.getBadges()
      .subscribe(response => {
        this.badges = response.data;
      });
  }

  toggleMenu() {
    this.menuIsOpened = !this.menuIsOpened;

    if (this.menuIsOpened) {
      this.renderer.removeClass(document.body, 'menu-collapsed');
      this.renderer.addClass(document.body, 'menu-expanded');
    } else {
      this.renderer.removeClass(document.body, 'menu-expanded');
      this.renderer.addClass(document.body, 'menu-collapsed');
    }
  }

  onMouseEnter() {
    if (this.menuIsOpened)
      return;
    
    this.isHoverOver = true;
  }

  onMouseLeave() {
    if (this.menuIsOpened)
      return;
    this.isHoverOver = false;
  }
}
