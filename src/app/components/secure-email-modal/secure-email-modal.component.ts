import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm, EmailValidator } from '@angular/forms';

@Component({
    selector: 'cb-secure-email-modal',
    templateUrl: 'secure-email-modal.component.html'
})
export class SecureEmailModalComponent {
    @Input() show = false;
    @Input() type: string;
    @Output() closeModal = new EventEmitter<any>();
    @ViewChild('form') form: NgForm;

    email: string;
    fileFormat: string;
    fieldDisabled = false;
    notes: string;
    response: any;
    submitted = false;
    userSearch: any;

    constructor() { }

    send() {
        if (this.form.invalid) {
            this.submitted = true;
            return;
        } else {
            if (this.type === 'report') {
                this.response = {
                    email: this.email,
                    notes: this.notes,
                    fileFormat: this.fileFormat
                };
            } else {
                this.response = {
                    email: this.email,
                    notes: this.notes
                };
            }
            this.closeModal.emit(this.response);
        }
    }

    userChange(user: any) {
        if (user) {
            this.email = user.Email;
            this.fieldDisabled = true;
        } else {
            this.email = undefined;
            this.fieldDisabled = false;
        }
    }

    close() {
        this.closeModal.emit();
    }
}
