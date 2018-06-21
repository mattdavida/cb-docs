import { forwardRef, Component, Input, OnInit, OnChanges, SimpleChange } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import * as moment from 'moment';

export const DATEPICKER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatepickerComponent),
    multi: true
};

export const DATEPICKER_VALIDATORS: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => DatepickerComponent),
    multi: true
};

@Component({
    selector: 'cb-datepicker',
    template: `
    <form class="border-none outline-none" [formGroup]="form">
        <input type="date" class="{{dateClass}}" formControlName="selectedDate" (blur)="updateModel()" />
    </form>
   `,
    providers: [DATEPICKER_VALUE_ACCESSOR, DATEPICKER_VALIDATORS]
})
export class DatepickerComponent implements ControlValueAccessor, OnChanges, OnInit {
    @Input() clearInvalidDates = true;
    @Input() dateClass = 'form-control';
    // Avoiding min/max and minDate/maxDate prop names since those are used by other validations from Angular/Ng2-Validators.
    @Input() maximumDate: string;
    @Input() minimumDate: string;
    @Input() required = false;

    form = this.fb.group({
        selectedDate: ''
    });
    isLoaded = false;
    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        this.form.get('selectedDate').valueChanges.subscribe(() => {
            this.dateChanged();
        });
        // stops values from being emitted on instantiation. Fixes issues with null object
        // EX: ngModel is set to supplies.date when supplies is null
        setTimeout(() => {
            this.isLoaded = true;
        });
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        const requiredChanges = changes['required'];
        const minDate = moment(this.minimumDate || '1753-01-01').toDate();
        const maxDate = moment(this.maximumDate || '3001-01-01').toDate();
        if (this.required) {
            this.form
                .get('selectedDate')
                .setValidators([Validators.required, CustomValidators.minDate(minDate), CustomValidators.maxDate(maxDate)]);
        } else {
            this.form.get('selectedDate').setValidators([CustomValidators.minDate(minDate), CustomValidators.maxDate(maxDate)]);
        }
        this.form.updateValueAndValidity();
        this.updateModel();
    }

    get selectedDate(): string {
        return this.form.get('selectedDate').value;
    }

    dateChanged() {
        const isDate = moment(this.selectedDate).isValid();
        if (this.isLoaded && (isDate || !this.selectedDate || (this.clearInvalidDates && this.form.invalid))) {
            this.onModelChange(this.selectedDate);
        }
    }

    registerOnChange(fn: Function) {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function) {
        this.onModelTouched = fn;
    }

    updateModel() {
        const isDate = moment(this.selectedDate).isValid();

        // Moment complains about > 4 length years, but doesn't return false, so extra check here
        const hasInvalidYear =
            moment(this.selectedDate)
                .year()
                .toString().length > 4;

        if (!this.selectedDate || !isDate || hasInvalidYear || (this.clearInvalidDates && this.form.invalid)) {
            this.form.get('selectedDate').patchValue('');
        }

        this.onModelChange(this.selectedDate);
    }

    validate() {
        this.form.updateValueAndValidity();
        const dateControl = this.form.get('selectedDate');
        const hasInvalidMin = dateControl && dateControl.hasError('minDate');
        const hasInvalidMax = dateControl && dateControl.hasError('maxDate');

        return this.form.valid
            ? null
            : {
                valid: false,
                minDate: hasInvalidMin,
                maxDate: hasInvalidMax
            };
    }

    writeValue(value: string | Date) {
        const isDate = moment(value).isValid();
        if (!isDate || !value) {
            this.form.get('selectedDate').patchValue(undefined);
            this.form.reset();
            return;
        }
        this.form.get('selectedDate').patchValue(moment(value).format('YYYY-MM-DD'));
    }
}
