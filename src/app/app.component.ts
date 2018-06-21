import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { AppService } from './app.service';
import { fadeInOutTrigger } from './animations/fade-in-out';

import 'primeng/resources/themes/omega/theme.css';
import 'primeng/resources/primeng.min.css';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeInOutTrigger]
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('fadeInOutLeft') fadeInOutLeft: ElementRef;
  naToggleTest: boolean;
  openSecureEmailModal = false;
  title = 'CareBook Docs';
  showComponents = false;
  showAnimations = false;
  fadeInOutTest = true;
  directives = false;
  styleGuide = false;
  fadeInOutLeftText = `<label class="well col-md-4"><input type="checkbox" [checked]="fadeInOutTest" (change)="fadeInOutTest = !fadeInOutTest" /> Click me</label>`
  fadeInOutRightText =
    `<textarea class="well col-md-offset-1 col-md-5" *ngIf="fadeInOutTest" [@fadeInOut]></textarea>`

  animationCodeSnippet =
    `
    import { fadeInOutTrigger } from 'app/core/animations/fade-in-out';
    
    @Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css'],
      animations: [fadeInOutTrigger]
    }) 
    `
  constructor(
    private appService: AppService
  ) { }

  ngAfterViewInit() {
  }

  ngOnInit() {
    console.log('hello from cb-docs', this.appService.componentModels);
  }

  selectedMenuItem(menuItem: { menuItem: string, show: boolean }) {
    if (menuItem.menuItem === 'components') {
      this.showComponents = menuItem.show;
    }
    if (menuItem.menuItem === 'animations') {
      this.showAnimations = menuItem.show;
    }
  }
}
