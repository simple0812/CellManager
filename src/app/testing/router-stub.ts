export { ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';

import { Component, Directive, Injectable, Input, HostListener } from '@angular/core';
import { NavigationExtras } from '@angular/router';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// tslint:disable-next-line:max-classes-per-file
@Injectable()
export class RouterStub {
  public navigate(commands: any[], extras?: NavigationExtras) {
    console.log('');
  }
}

// tslint:disable-next-line:max-classes-per-file
@Injectable()
export class ActivatedRouteStub {
  private subject = new BehaviorSubject(this.testParams);
  private params = this.subject.asObservable();

  private _testParams: {};
  get testParams() { return this._testParams; }
  set testParams(params: {}) {
    this._testParams = params;
    this.subject.next(params);
  }

  get snapshot() {
    return { params: this.testParams };
  }
}
