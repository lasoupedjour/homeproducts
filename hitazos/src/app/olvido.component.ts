import { Component } from '@angular/core';
import { GlobalService } from './services/global.service';
import { HTTPService } from './services/http.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'login',
  templateUrl: './olvido.component.html'
})
export class OlvidoComponent{
    title = 'app';
    olvidoForm: FormGroup;

    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService) { }

    ngOnInit() {
        console.log('init');

        this.olvidoForm = this.formBuilder.group({
            /*usuario: ['', Validators.compose([
                Validators.required,
                Validators.email
            ])],*/
            Email: ['', Validators.compose([
                Validators.required,
                Validators.email
            ])],
        });

    }

    submitForm() {

        if (this.olvidoForm.valid) {
            console.log('submit login');
            var params = {};
            params['email'] = this.olvidoForm.controls.Email.value;


            this._global.appstatus.loading = true;

            this._httpService.postJSON(params, 'recuperar.php')
                .subscribe(
                data => {
                    console.log('data recuperar');
                    console.log(data);
                    this._global.appstatus.loading = false;

                    if (data.res == 'ok') {
                        swal("Recuperación de contraseña","Hemos enviado un correo para reestablecer la contraseña.", "success");
                        
                        /*
                        this._global.saveSession(data);
                        this._router.navigate(['registro-de-casos']);
                        */
                    } else {
                      swal("Recuperación de contraseña","Ha ocurrido un error, favor de intentarlo más tarde.", "warning");
                    }


                    //console.log("fichas");
                    //console.log(this.props.fichas);
                },
                error => alert(error),
                () => console.log('termino submit')
                );


        } else {
            this._global.validateAllFormFields(this.olvidoForm);
        }
    }



}
