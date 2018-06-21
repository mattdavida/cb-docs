export class AppService {
    componentModels = [
        {
            title: 'CbNaToggle',
            idName: 'cbIToggle',
            exampleLabel: 'Choose One',
            codeText: '<cb-na-toggle name="naToggleTest" [(ngModel)]="naToggleTest"></cb-na-toggle>'
        },
        {
            title: 'CbPhoneMask',
            idName: 'cbPhoneMask',
            exampleLabel: 'Phone Number',
            codeText: '<cb-phone-mask name="Phone" [(ngModel)]="phoneMaskTest"></cb-phone-mask>'
        },
        {
            title: 'cbIToggle',
            idName: 'cbIToggle',
            exampleLabel: 'Yes or No',
            codeText: '<cb-itoggle></cb-itoggle>'
        },
        {
            title: 'cbDateTime',
            idName: 'cbDateTime',
            componentSubText: 'Select a date',
            codeText: '<cb-date-time></cb-date-time>'
        },
        {
            title: 'CbSearch',
            idName: 'CbSearch',
            exampleLabel: 'Search for results',
            codeText: '<cb-search></cb-search>'
        },
        {
            title: 'CbMultiSelect',
            idName: 'CbMultiSelect',
            exampleLabel: 'Select Multiple',
            codeText: '<cb-multiselect></cb-multiselect>'
        },
        {
            title: 'cbInfo',
            idName: 'cbInfo',
            exampleLabel: 'Hover Tooltip',
            codeText: '<cb-info tooltip="cb-info" appendTo="body"></cb-info>'
        },
    ]
}