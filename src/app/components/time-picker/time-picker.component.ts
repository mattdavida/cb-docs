import { forwardRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators } from '@angular/forms';

// import './time-picker.component.css';
import * as moment from 'moment';

export const TIMEPICKER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TimePickerComponent),
    multi: true
};

export const TIMEPICKER_VALIDATORS: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => TimePickerComponent),
    multi: true
};

@Component({
    selector: 'cb-time-picker',
    templateUrl: './time-picker.component.html',
    styleUrls: ['./time-picker.component.css'],
    providers: [TIMEPICKER_VALUE_ACCESSOR, TIMEPICKER_VALIDATORS],
})
export class TimePickerComponent implements ControlValueAccessor, OnInit, OnDestroy {
    @Input() isMidnightValid = true;
    @Input() showSeconds = false;

    form = this.fb.group(
        {
            hours: ['', [Validators.required, Validators.pattern('^(0?[1-9]|1[012])'), Validators.maxLength(2)]],
            minutes: ['', [Validators.required, Validators.pattern('[0-5]?[0-9]'), Validators.maxLength(2)]],
            seconds: [''],
            isAm: true
        },
        { validator: this.checkValidTime.bind(this) }
    );

    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };

    constructor(private fb: FormBuilder) { }

    ngOnDestroy() {
        // Clearing validators here fixes issue of the custom checkValidTime validation copying when the time control was rerendered
        this.form.clearValidators();
        this.updateModel();
    }

    ngOnInit() {
        if (this.showSeconds) {
            this.form.get('seconds').setValidators([Validators.required, Validators.pattern('[0-5]?[0-9]'), Validators.maxLength(2)]);
        }
    }

    get hours(): string {
        return this.form.get('hours').value;
    }

    get isAm(): boolean {
        return this.form.get('isAm').value;
    }

    get minutes(): string {
        return this.form.get('minutes').value;
    }
    get seconds(): string {
        return this.form.get('seconds').value;
    }

    registerOnChange(fn: Function) {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function) {
        this.onModelTouched = fn;
    }

    toggleMeridian() {
        this.form.get('isAm').patchValue(!this.isAm);
        this.updateModel();
    }

    updateModel() {
        if (this.form.invalid) {
            this.onModelChange(undefined);
            return;
        }
        this.setPaddedZeroes();

        const time = this.getTime();
        this.onModelChange(time);
    }

    validate() {
        this.form.updateValueAndValidity();
        return this.form.valid
            ? null
            : {
                timePicker: {
                    valid: false
                }
            };
    }

    writeValue(value: Date | string) {
        const isDate = moment(value).isValid();
        if (!isDate || !value) {
            this.form.get('hours').patchValue('');
            this.form.get('minutes').patchValue('');
            this.form.get('seconds').patchValue('');
            return;
        }

        const date = moment(value).toDate();
        this.setTimeProperties(date);
        this.updateModel();
    }

    private checkValidTime(control: AbstractControl) {
        if (!this.form) {
            return null;
        }
        const isInvalid =
            this.isAm && this.hours === '12' && this.minutes === '00' && (this.seconds === '00' || !this.showSeconds) && !this.isMidnightValid;
        return isInvalid ? { invalidTime: true } : null;
    }

    private getTime() {
        const date = new Date();
        let hours = parseInt(this.hours, 10);
        const minutes = parseInt(this.minutes, 10);
        const seconds = parseInt(this.seconds, 10);

        if (hours === 12) {
            hours = this.isAm ? 0 : 12;
        } else if (!this.isAm) {
            hours += 12;
        }

        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(seconds);

        return date;
    }
    private setPaddedZero(timeUnit: AbstractControl) {
        if (!timeUnit || timeUnit.value.length !== 1) {
            return;
        }

        const newValue = `0${timeUnit.value}`;
        timeUnit.patchValue(newValue);
    }

    private setPaddedZeroes() {
        this.setPaddedZero(this.form.get('hours'));
        this.setPaddedZero(this.form.get('minutes'));
        this.setPaddedZero(this.form.get('seconds'));
    }

    private setTimeProperties(date: Date) {
        let hours = date.getHours();
        if (hours >= 12) {
            this.form.get('isAm').patchValue(false);
        } else {
            this.form.get('isAm').patchValue(true);
        }

        if (hours > 12) {
            hours -= 12;
        }

        this.form.get('hours').patchValue(hours === 0 ? '12' : hours.toString());
        this.form.get('minutes').patchValue(date.getMinutes().toString());
        this.form.get('seconds').patchValue(date.getSeconds().toString());

        this.setPaddedZeroes();
    }
}
