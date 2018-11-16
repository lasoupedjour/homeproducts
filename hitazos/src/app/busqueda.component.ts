import { Component, ElementRef, ViewChild } from '@angular/core';
import { HTTPService } from './services/http.service';
import { GlobalService } from './services/global.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
    selector: 'busqueda',
    templateUrl: './busqueda.component.html'
})
export class BusquedaComponent {
    title = 'app';
    genericForm: FormGroup;

    //@ViewChild("Email") Email: ElementRef;

    constructor(
        private formBuilder: FormBuilder,
        private _httpService: HTTPService, private _router: Router, public _global: GlobalService) { }

    ngOnInit() {
        console.log('init');

        this._global.clearMessages();

        this.genericForm = this.formBuilder.group({
            /*usuario: ['', Validators.compose([
                Validators.required,
                Validators.email
            ])],*/
            TipoBusqueda: [''],
            IDCliente: [''],
            IDOrden: [''],
            IDReporte: [''],
            IDDistribuidor: [''],
            NombreDistribuidor: [''],
            Nombre: [''],
            APaterno: [''],
            AMaterno: [''],
            RazonSocial: [''],
            Email: [''],
            NoSerie: ['']


        });

    }




    changeTipoBusqueda() {

        var eleccion = this.genericForm.controls.TipoBusqueda.value;

        console.log(eleccion);

        this.genericForm.controls.IDCliente.setValue('');
        this.genericForm.controls.IDCliente.updateValueAndValidity();

        this.genericForm.controls.IDOrden.setValue('');
        this.genericForm.controls.IDOrden.updateValueAndValidity();

        this.genericForm.controls.IDReporte.setValue('');
        this.genericForm.controls.IDReporte.updateValueAndValidity();

        this.genericForm.controls.Nombre.setValue('');
        this.genericForm.controls.Nombre.updateValueAndValidity();
        this.genericForm.controls.APaterno.setValue('');
        this.genericForm.controls.APaterno.updateValueAndValidity();
        this.genericForm.controls.AMaterno.setValue('');
        this.genericForm.controls.AMaterno.updateValueAndValidity();

        this.genericForm.controls.Email.setValue('');
        this.genericForm.controls.Email.updateValueAndValidity();

        this.genericForm.controls.IDDistribuidor.setValue('');
        this.genericForm.controls.IDDistribuidor.updateValueAndValidity();

        this.genericForm.controls.NoSerie.setValue('');
        this.genericForm.controls.NoSerie.updateValueAndValidity();

        this._global.busqueda.clientes = [];

    }

    submitBusqueda() {

        this._global.appstatus.mensaje = '';

        var valorBusqueda = false;

        var busquedas = [];
        busquedas.push(this.genericForm.controls.IDCliente.value);
        busquedas.push(this.genericForm.controls.IDOrden.value);
        busquedas.push(this.genericForm.controls.IDReporte.value);
        busquedas.push(this.genericForm.controls.Nombre.value);
        busquedas.push(this.genericForm.controls.APaterno.value);
        busquedas.push(this.genericForm.controls.AMaterno.value);
        busquedas.push(this.genericForm.controls.RazonSocial.value);
        busquedas.push(this.genericForm.controls.Email.value);
        busquedas.push(this.genericForm.controls.IDDistribuidor.value);
        busquedas.push(this.genericForm.controls.NombreDistribuidor.value);
        busquedas.push(this.genericForm.controls.NoSerie.value);


        for (var i = 0; i < busquedas.length; i++) {
            if (busquedas[i] != '') {
                valorBusqueda = true;
            }
        }

        if (valorBusqueda) {

            if (this.genericForm.valid) {
                console.log('submit busqueda');

                console.log(this.genericForm.getRawValue());
                var params = {};
                params = this.genericForm.getRawValue();
                params["Pais"] = this._global.user.Pais;
                params["nivel"] = this._global.user.nivel;


                this._global.appstatus.loading = true;

                this._httpService.postJSON(params, 'buscar.php')
                    .subscribe(
                    data => {
                        console.log('data');
                        console.log(data);
                        this._global.appstatus.loading = false;

                        if (data.res == 'ok') {
                            this._global.busqueda.clientes = this._global.parseJSON(data.clientes);
                            console.log(this._global.busqueda.clientes);

                            if (data.clientes.length == 0) {
                                this._global.appstatus.mensaje = 'No hay resultados asociados con tu búsqueda.';
                            }

                        } else if (data.res = 'error') {
                            this._global.appstatus.mensaje = data.error;
                        }

                    },
                    error => alert(error),
                    () => console.log('termino submit')
                    );


            } else {
                this.validateAllFormFields(this.genericForm);
            }
        } else {
            this._global.busqueda.clientes = [];
        }
    }





    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

}
