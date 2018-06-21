import { forwardRef, Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators } from '@angular/forms';

import * as moment from 'moment';

export const DATETIME_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateTimeComponent),
    multi: true
};

export const DATETIME_VALIDATORS: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => DateTimeComponent),
    multi: true
};

@Component({
    selector: 'cb-date-time',
    templateUrl: './date-time.component.html',
    providers: [DATETIME_VALUE_ACCESSOR, DATETIME_VALIDATORS]
})
export class DateTimeComponent implements ControlValueAccessor, OnInit {
    // Avoiding min/max and minDate/maxDate prop names since those are used by other validations from Angular/Ng2-Validators.
    @Input() maximumDate: string;
    @Input() midnightIsValid = false;
    @Input() minimumDate: string;
    @Input() required = false;
    @Input() showSeconds = false;

    form = this.fb.group({
        selectedDate: undefined,
        selectedTime: undefined
    });
    showTime = true;

    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        this.form.get('selectedDate').valueChanges.subscribe(() => {
            this.changeDate();
        });
        this.form.get('selectedTime').valueChanges.subscribe(() => {
            this.changeTime();
        });
    }

    get selectedDate(): string {
        return this.form.get('selectedDate').value;
    }

    get selectedTime(): Date {
        return this.form.get('selectedTime').value;
    }

    changeDate() {
        this.updateTimeValidation();
        if (this.selectedDate && !this.selectedTime) {
            this.setDefaultTime();
        } else if (!this.selectedDate) {
            this.form.get('selectedTime').patchValue(undefined);
        }
        this.updateModel();
    }

    changeTime() {
        this.updateModel();
    }

    registerOnChange(fn: Function) {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function) {
        this.onModelTouched = fn;
    }

    updateTimeValidation() {
        if (this.selectedDate) {
            this.form.get('selectedTime').setValidators([Validators.required]);
        } else {
            this.form.get('selectedTime').clearValidators();
            this.form.get('selectedTime').reset();
        }
    }

    updateModel() {
        let mergedDateStr = undefined;
        if (this.selectedDate) {
            let mergedDate = undefined;
            const date = moment(this.selectedDate).toDate();
            mergedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            if (this.selectedTime) {
                mergedDate.setHours(this.selectedTime.getHours());
                mergedDate.setMinutes(this.selectedTime.getMinutes());
                mergedDate.setSeconds(this.selectedTime.getSeconds());
            }
            mergedDateStr = moment(mergedDate).format('YYYY-MM-DD HH:mm:ss');
        }
        this.onModelChange(mergedDateStr);
    }

    validate() {
        this.form.updateValueAndValidity();
        const err = {
            dateTime: {
                valid: false
            }
        };
        return this.form.invalid ? err : null;
    }

    writeValue(value: Date | string) {
        const isDate = moment(value).isValid();

        if (!isDate || !value) {
            this.form.get('selectedDate').patchValue(undefined);
            this.form.get('selectedTime').patchValue(undefined);
            return;
        }
        this.form.get('selectedDate').patchValue(moment(value).format('YYYY-MM-DD'));
        this.form.get('selectedTime').patchValue(moment(value).toDate());
    }

    private setDefaultTime() {
        const currentDate = new Date();

        this.form.get('selectedTime').patchValue(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
        if (this.selectedTime) {
            this.selectedTime.setHours(0);
            this.selectedTime.setMinutes(0);
            this.selectedTime.setSeconds(0);
        }
    }
}
