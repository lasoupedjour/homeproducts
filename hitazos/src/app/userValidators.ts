import { AbstractControl, FormControl } from '@angular/forms';
export class userValidators {

    static MatchPassword(AC: AbstractControl) {
        let password = AC.get('pwdFebreze').value; // to get value in input tag
        let confirmPassword = AC.get('pwd2Febreze').value; // to get value in input tag
        if (password != confirmPassword) {
            console.log('false');
            AC.get('pwd2Febreze').setErrors({ MatchPassword: true })
        } else {
            console.log('true');
            return null
        }
    }

    static noSpaces(control: FormControl) {
        try {
            if (control.value.indexOf(' ') >= 0)
                return { noSpaces: true }
        } catch (e) { }

        return null;
    }

    static minLength(control: FormControl) {
        try {
            if (control.value.length < 30)
                return { minLength: true }
        } catch (e) { }

        return null;
    }

    static noDashes(control: FormControl) {
        try {
            if (control.value.indexOf('-') >= 0 || control.value.indexOf('_') >= 0)
                return { noDashes: true }
        } catch (e) { }

        return null;
    }

    static montoTicket(control: FormControl) {
        try {
            if (control.value < 80 || control.value > 300)
                return { montoTicket: true }
        } catch (e) { }

        return null;
    }


}