import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { MomentModule } from 'angular2-moment';
import { NgModule } from '@angular/core';
import { CustomFormsModule } from 'ng2-validation'
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { DialogModule } from 'primeng/components/dialog/dialog';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BusyModule, BusyConfig } from 'angular2-busy';

import { AppComponent } from './app.component';
import { NaToggleComponent } from './components/na-toggle/na-toggle.component';
import { PhoneMaskComponent } from './components/phone-mask/phone-mask.component';
import { ItoggleComponent } from './components/toggle/toggle.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { DatepickerComponent } from './components/date-picker/date-picker.component';
import { DateTimeComponent } from './components/date-time/date-time.component';
import { SecureEmailModalComponent } from './components/secure-email-modal/secure-email-modal.component';
import { SearchComponent } from './components/search/search.component';
import { MultiselectComponent } from './components/multiselect/multiselect.component';
import { ExampleCommponent } from './example/example.component';
import { AppService } from './app.service';
import { SideBarComponent } from './side-bar/side-bar.component';
import { InfoComponent } from './components/info/info.component';


@NgModule({
  declarations: [
    AppComponent,
    NaToggleComponent,
    PhoneMaskComponent,
    ItoggleComponent,
    TimePickerComponent,
    DatepickerComponent,
    DateTimeComponent,
    InfoComponent,
    SecureEmailModalComponent,
    SearchComponent,
    MultiselectComponent,
    ExampleCommponent,
    SideBarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    MomentModule,
    CustomFormsModule,
    AutoCompleteModule,
    DialogModule,
    BusyModule,
    TooltipModule.forRoot()
  ],
  providers: [AppService, { provide: BusyConfig, useFactory: busyConfigFactory }],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function busyConfigFactory() {
  return new BusyConfig({
    message: null,
    backdrop: true,
    template:
      '<div class="cg-busy-wrapper-small">\n' +
      '    <div class="cg-busy-sign-small">' +
      '        <div class="cg-busy-fallback"></div>' +
      '        <div class="cg-busy-ripple"><div></div><div></div></div>' +
      '    </div>\n' +
      '</div>\n\n' +
      '<div class="cg-busy-wrapper-big">\n' +
      '    <div class="cg-busy-sign-big">' +
      '        <div class="cg-busy-fallback"></div>' +
      '        <div class="cg-busy-ripple"><div></div><div></div></div>' +
      '    </div>\n' +
      '</div>'
  });
}
