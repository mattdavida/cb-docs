import { forwardRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import './na-toggle.component.css';

export const NATOGGLE_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NaToggleComponent),
    multi: true
};

@Component({
    selector: 'cb-na-toggle',
    templateUrl: './na-toggle.component.html',
    providers: [NATOGGLE_VALUE_ACCESSOR]
})
export class NaToggleComponent implements ControlValueAccessor, OnInit {
    @Input() disabled = false;
    @Input() required = false;
    @Input() showNa: boolean;
    @Input() yesText = 'Yes';
    @Input() yesValue: any = true;
    @Input() noText = 'No';
    @Input() noValue: any = false;

    model: boolean;
    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };

    constructor() { }

    ngOnInit() {
        this.showNa = this.showNa !== undefined ? this.showNa : !this.required;
    }

    writeValue(value: boolean) {
        this.model = value;
    }

    registerOnChange(fn: Function) {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function) {
        this.onModelTouched = fn;
    }

    updateModel() {
        this.onModelChange(this.model);
    }
}
