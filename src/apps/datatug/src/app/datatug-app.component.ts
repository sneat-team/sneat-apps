import {Component} from '@angular/core';
import {AppComponentService} from '@sneat/app';

@Component({
  selector: 'sneat-root',
  templateUrl: 'datatug-app.component.html',
  styleUrls: ['datatug-app.component.scss'],
})
export class DatatugAppComponent {
  constructor(
    readonly appComponentService: AppComponentService,
  ) {
    appComponentService.initializeApp();
  }
}