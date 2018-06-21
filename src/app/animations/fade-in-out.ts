import { animate, style, transition, trigger } from '@angular/core';

// used for animations for showing and hiding element from *ngIf. Exapmle use in the following lines.
// import { fadeInOutTrigger } from 'app/fade-in-out';
// @Component({
//      selector: 'fake-example',
//      templateUrl: './fake.component.html',
//      animations: [fadeInOutTrigger]
// })
// in template: <div *ngIf="toggle" [@fadeInOut]>element<div>
export const fadeInOutTrigger: any = trigger('fadeInOut', [
    transition('void => *', [
        style({ opacity: 0 }), // style only for transition (after transiton it removes)
        animate(300, style({ opacity: 1 })) // the new state of the transition(after transiton it removes)
    ]),
    transition('* => void', [
        animate(300, style({ opacity: 0 })) // the new state of the transition(after transiton it removes)
    ])
]);
