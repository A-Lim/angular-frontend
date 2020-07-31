import { Injectable, ComponentFactoryResolver, ViewContainerRef, Type } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {

  constructor(private _cfr: ComponentFactoryResolver) {
  }

  open<T>(viewContainerRef: ViewContainerRef, component: Type<T>) {
    const componentFactory = this._cfr.resolveComponentFactory(component);
    return viewContainerRef.createComponent(componentFactory).instance;
  }
}