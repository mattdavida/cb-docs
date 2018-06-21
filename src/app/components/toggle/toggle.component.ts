import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const noop = () => { };

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ItoggleComponent),
    multi: true
};

@Component({
    selector: 'cb-itoggle',
    templateUrl: './toggle.component.html',
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class ItoggleComponent implements ControlValueAccessor {
    // The internal data model
    private innerValue: any = false;
    @Input() disabled = false;
    @Output() sendValue: EventEmitter<any> = new EventEmitter<any>();

    // Placeholders for the callbacks which are later providesd
    // by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    // get accessor
    get value(): any {
        return this.innerValue;
    }

    // set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.sendValue.emit(this.value);
            this.onChangeCallback(v);
        }
    }

    // From ControlValueAccessor interface
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    // From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    // From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}
