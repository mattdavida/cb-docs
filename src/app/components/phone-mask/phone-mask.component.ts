import { forwardRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgForm, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

export const PHONEMASK_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PhoneMaskComponent),
    multi: true
};

export const PHONEMASK_VALIDATORS: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => PhoneMaskComponent),
    multi: true
};
@Component({
    selector: 'cb-phone-mask',
    template: `<input type="text" class="{{styleClass}}" [textMask]="{mask: mask}" [formControl]="phoneNumber" (blur)="onBlur()" />`,
    providers: [PHONEMASK_VALUE_ACCESSOR, PHONEMASK_VALIDATORS]
})
export class PhoneMaskComponent implements OnChanges, OnInit {
    @Input() disabled = false;
    @Input() isRequired = false;
    @Input() styleClass = 'form-control';
    mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    phoneNumber = new FormControl('', [this.checkValidPhoneNumber.bind(this)]);

    onModelChange: Function;
    onModelTouched: Function;

    constructor() { }

    ngOnChanges() {
        if (this.disabled) {
            this.phoneNumber.disable();
        } else {
            this.phoneNumber.enable();
        }
    }

    ngOnInit() {
        this.phoneNumber.valueChanges.subscribe((value: string) => {
            this.updateModel();
        });
    }

    get strippedPhoneNumber(): string {
        return this.phoneNumber.value ? this.phoneNumber.value.replace(/[^\d]/g, '') : '';
    }

    onBlur() {
        if (this.strippedPhoneNumber.length !== 10) {
            this.phoneNumber.patchValue(undefined);
        }
    }
    registerOnChange(fn: Function) {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function) {
        this.onModelTouched = fn;
    }

    updateModel() {
        const outputValue = this.strippedPhoneNumber.length === 10 ? this.strippedPhoneNumber : undefined;

        this.onModelTouched();
        this.onModelChange(outputValue);
    }

    validate() {
        return this.phoneNumber.invalid
            ? {
                invalidForm: true
            }
            : null;
    }

    writeValue(value: string) {
        if (!value) {
            this.phoneNumber.reset(null, { emitEvent: false });
            return;
        }
        this.phoneNumber.patchValue(value, { emitEvent: false });
    }

    private checkValidPhoneNumber(control: AbstractControl) {
        const isInvalid = this.isRequired && this.strippedPhoneNumber.length !== 10;
        return isInvalid ? { invalidControl: true } : null;
    }
}
