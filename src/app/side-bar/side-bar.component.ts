import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './side-bar.component.html'
})

export class SideBarComponent implements OnInit {
    @Output() selectedMenuItem = new EventEmitter<any>();
    showComponents = false;
    showAnimations = false;

    constructor() { }

    ngOnInit() {
        console.log('SideBarComponent')
    }

    onClickComponentMenu() {
        this.showComponents = !this.showComponents;
        this.selectedMenuItem.emit({ menuItem: 'components', show: this.showComponents });
    }

    onClickAnimationMenu() {
        this.showAnimations = !this.showAnimations;
        this.selectedMenuItem.emit({ menuItem: 'animations', show: this.showAnimations });
    }
}