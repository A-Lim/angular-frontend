import { Optional, Renderer2 } from '@angular/core';
import { PageType } from 'app/shared/models/enums';

export abstract class BaseComponent {

  constructor(@Optional() public renderer?: Renderer2) { }

  public configureBodyClass(pageType: PageType) {
    if (this.renderer !== null) {
      switch (pageType) {
        case PageType.NoSideMenu:
          this.renderer.removeClass(document.body, '2-column');
          this.renderer.addClass(document.body, '1-column');
          this.renderer.addClass(document.body, 'blank-page');
          this.renderer.setAttribute(document.body, 'data-col', '1-column');
          break;
        
        case PageType.WithSideMenu:
          this.renderer.removeClass(document.body, '1-column');
          this.renderer.removeClass(document.body, 'blank-page');
          this.renderer.addClass(document.body, '2-column');
          this.renderer.setAttribute(document.body, 'data-col', '2-columns');
          break;
      }
    }
  }
}