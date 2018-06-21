
import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    DoCheck,
    OnInit,
    Output,
    SimpleChange,
    ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { AutoComplete } from 'primeng/components/autocomplete/autocomplete';

export const SEARCH_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SearchComponent),
    multi: true
};

@Component({
    selector: 'cb-search',
    templateUrl: './search.component.html',
    providers: [SEARCH_VALUE_ACCESSOR]
})
export class SearchComponent implements ControlValueAccessor, DoCheck, OnInit {
    @Input() disabled = false;
    @Input() lookup: any[];
    @Input() multiple = false;
    @Input() required = false;
    @Input() searchFunctionName: string;
    @Input() searchParam: any;
    @Input() idProp = 'id';
    @Input() valueProp = 'value';
    @Input() closeOnSelect = true;

    @Output() onItemChange: EventEmitter<any> = new EventEmitter();

    @ViewChild('autoComplete') autoComplete: AutoComplete;

    isSingleItemSelected = false;
    resultsText = 'No Results Found';
    searchResults: Array<any> = [];
    searchSubscription: Subscription;
    selectedItems: any = [];
    styleClass: string;
    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };

    constructor(private elRef: ElementRef) { }
    ngOnInit() {
        if (!this.multiple) {
            this.styleClass = 'form-control';
        }
    }
    ngDoCheck() {
        this.isSingleItemSelected = !this.multiple && this.selectedItems && this.selectedItems.length === undefined;
    }

    onChange(event: any) {
        let searchResultsElement = this.elRef.nativeElement.querySelector('.ui-state-highlight');
        if (!searchResultsElement && typeof this.selectedItems === 'string') {
            this.selectedItems = undefined;
            this.updateModel();
        }
    }

    registerOnChange(fn: Function) {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function) {
        this.onModelTouched = fn;
    }

    clearItem() {
        this.selectedItems = undefined;
        this.updateModel();
    }

    hidePanel() {
        if (!this.closeOnSelect) {
            this.autoComplete.hide();
        }
    }

    searchItems(event: any) {
        this.searchResults.length = 0;
        if (this.lookup) {
            this.clientSideSearch(event);
        }
    }

    updateModel(isUnselect?: boolean) {
        this.scrollInputToLeft();
        setTimeout(() => {
            if (!this.closeOnSelect && !isUnselect) {
                this.autoComplete.suggestionsUpdated = true;
                this.autoComplete.panelVisible = true;
            }
            this.onModelChange(this.selectedItems);
            this.onItemChange.emit(this.selectedItems);
        });
    }

    writeValue(value: any) {
        this.selectedItems = value;
    }

    private clientSideSearch(event: any) {
        if (!this.multiple) {
            const selectedItemId = this.selectedItems ? this.selectedItems[this.idProp] : undefined;
            this.searchResults = this.lookup.filter((item: any) => {
                return (
                    ((item.isActive !== false && item.isSelectable !== false) || item[this.idProp] === selectedItemId) &&
                    item[this.valueProp].toLowerCase().indexOf(event.query.toLowerCase()) !== -1
                );
            });
        } else {
            const selectedItemIds = (this.selectedItems || []).map((item: any) => item[this.idProp]);
            this.searchResults = this.lookup.filter((item: any) => {
                return (
                    ((item.isActive !== false && item.isSelectable !== false) || selectedItemIds.indexOf(item[this.idProp]) !== -1) &&
                    item[this.valueProp].toLowerCase().indexOf(event.query.toLowerCase()) !== -1
                );
            });
        }
    }

    private scrollInputToLeft() {
        if (this.multiple) {
            return;
        }
        // fixes issue in IE when selecting item with long text, textbox scrolls  all the way to the right.
        const inputElement = this.elRef.nativeElement.querySelector('.ui-autocomplete-input');
        if (inputElement) {
            inputElement.setSelectionRange(0, 0);
            setTimeout(() => {
                inputElement.blur();
            });
        }
    }
}
