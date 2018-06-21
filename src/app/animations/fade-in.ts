import { animate, style, transition, trigger } from '@angular/core';
// used for animations for showing and hiding element from *ngIf. Exapmle use in the following lines.
// import { fadeInTrigger } from 'app/fade-in';
// @Component({
//      selector: 'fake-example',
//      templateUrl: './fake.component.html',
//      animations: [fadeInTrigger]
// })
// in template: <div *ngIf="toggle" [@fadeIn]>element<div>
export const fadeInTrigger: any = trigger('fadeIn', [
    transition('void => *', [
        style({ opacity: 0 }), // style only for transition (after transiton it removes)
        animate(300, style({ opacity: 1 })) // the new state of the transition(after transiton it removes)
    ])
]);
