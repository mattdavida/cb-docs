import {
    Component,
    ContentChild,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    Output,
    SimpleChange,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { AutoComplete } from 'primeng/components/autocomplete/autocomplete';
import { SearchComponent } from '../search/search.component';

export const MULTISELECT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiselectComponent),
    multi: true
};

@Component({
    selector: 'cb-multiselect',
    templateUrl: './multiselect.component.html',
    providers: [MULTISELECT_VALUE_ACCESSOR]
})
export class MultiselectComponent implements ControlValueAccessor, OnChanges {
    @ContentChild(TemplateRef) template: TemplateRef<any>;

    @Input() disabled = false;
    @Input() lookup: Array<any>;
    @Input() lookupPromise: any;
    @Input() lookupSubscription: Subscription;
    @Input() required = false;

    @Output() onItemChange: EventEmitter<any> = new EventEmitter();

    @ViewChild('autoComplete') autoComplete: AutoComplete;

    filteredLookup: Array<any> = [];
    selectedIds: Array<any> = [];
    selectedItems: Array<any> = [];
    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };

    constructor() {
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        let isPreviousLookupValueEmpty = !changes['lookup'] || !changes['lookup'].previousValue || changes['lookup'].previousValue.length === 0;
        if (changes['lookup'] && isPreviousLookupValueEmpty && changes['lookup'].currentValue) {
            this.setSelectedItems();
        }
    }

    registerOnChange(fn: Function) {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function) {
        this.onModelTouched = fn;
    }

    onClick(event: any) {
        if (
            event.target.tagName === 'UL' ||
            event.target.tagName === 'INPUT' ||
            event.target.classList.contains('ui-autocomplete-input-token')
        ) {
            this.autoComplete.handleDropdownClick(event);
        }
    }

    searchItems(event: any) {
        this.filteredLookup = [];
        this.filteredLookup = this.lookup.filter((item: any) => {
            const isSearchedValue = item.value.toLowerCase().indexOf(event.query) !== -1 && !item.unselectable;
            const searchedChildValue = (item.children || []).some((child: any) => {
                return child.value.toLowerCase().indexOf(event.query) !== -1;
            });
            return isSearchedValue || searchedChildValue || !event.query;
        });
    }

    updateModel() {
        if (this.disabled) {
            return;
        }
        setTimeout(() => {
            this.selectedIds = this.selectedItems.map(item => item.id);
            this.onModelChange(this.selectedIds);
            this.onItemChange.emit(this.selectedIds);
        });
    }

    writeValue(value: Array<any>) {
        this.selectedIds = value || [];
        this.setSelectedItems();
    }

    private setSelectedItems() {
        if (this.lookup) {
            this.selectedItems = this.lookup.filter((item: any) => {
                return this.selectedIds.indexOf(item.id) !== -1;
            });
        }
    }
}
