import { Component, Input, AfterViewInit } from '@angular/core';

@Component({
    selector: 'component-example',
    templateUrl: './example.component.html'

})

export class ExampleCommponent implements AfterViewInit {
    @Input() model: any;

    phoneMaskTest = '1111111111';

    ngAfterViewInit() {
        setTimeout(() => {
            console.log('Example', this.model)
        })
    }
}