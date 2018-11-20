import { Component, ElementRef, ViewChild } from '@angular/core';
import { HTTPService } from './services/http.service';
import { GlobalService } from './services/global.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
    selector: 'busqueda',
    templateUrl: './inicio.component.html'
})
export class InicioComponent {
    title = 'app';
    genericForm: FormGroup;

    //@ViewChild("Email") Email: ElementRef;

    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService) { }

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
            Nombre: [''],
            APaterno: [''],
            AMaterno: [''],
            RazonSocial: [''],
            Email: [''],


        });

        this.nuevosClientes();
        this.nuevasOrdenesServicio();
        this.nuevosCasosAsignados();
        this.nuevosCambiosFisicos();

        //funciones de administrador
        if (this._global.user.nivel == 'administrador') {

            this.nuevasRefacciones();
            this.nuevasCotizaciones();
            this.nuevasMovilizaciones();

        }


        $(document).ready(function () {

            console.log('ready jquery');

        })


    }


    aplicaGarantia(txt) {
        if (txt != '') {
            return txt;
        } else {
            return 'N/A';
        }
    }

    nuevasRefacciones() {

        var params = {};
        params["IDCentro"] = this._global.user.IDCentro;
        params["nivel"] = this._global.user.nivel;
        params["limit"] = "5";

        this._global.appstatus.loading = true;
        console.log('nuevas refacciones');
        console.log(params);
        this._httpService.postJSON(params, 'administracion/nuevas-refacciones.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {


                    this._global.refaccionesXAutorizar.recientes = this._global.parseJSON(data.reportes);
                    console.log('refacciones por autorizar');
                    console.log(this._global.refaccionesXAutorizar.recientes);

                    if (data.reportes.length == 0) {
                        this._global.appstatus.mensaje = 'No se encontraron órdenes.';
                    }

                } else if (data.res = 'error') {
                    this._global.appstatus.mensaje = data.error;
                }


                //console.log("fichas");
                //console.log(this.props.fichas);
            },
            error => console.log(error),
            () => console.log('termino submit')
            );

    }

    nuevasCotizaciones() {

        var params = {};
        params["IDCentro"] = this._global.user.IDCentro;
        params["nivel"] = this._global.user.nivel;
        params["limit"] = "5";

        this._global.appstatus.loading = true;
        console.log('nuevas cotizaciones');
        console.log(params);
        this._httpService.postJSON(params, 'administracion/nuevas-cotizaciones.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {


                    this._global.cotizacionesXAutorizar.recientes = this._global.parseJSON(data.reportes);
                    console.log('cotizaciones por autorizar');
                    console.log(this._global.cotizacionesXAutorizar.recientes);

                    if (data.reportes.length == 0) {
                        this._global.appstatus.mensaje = 'No se encontraron órdenes.';
                    }

                } else if (data.res = 'error') {
                    this._global.appstatus.mensaje = data.error;
                }


                //console.log("fichas");
                //console.log(this.props.fichas);
            },
            error => console.log(error),
            () => console.log('termino submit')
            );

    }

    nuevasMovilizaciones() {

        var params = {};
        params["IDCentro"] = this._global.user.IDCentro;
        params["nivel"] = this._global.user.nivel;
        params["limit"] = "5";

        this._global.appstatus.loading = true;
        console.log('nuevas refacciones');
        console.log(params);
        this._httpService.postJSON(params, 'administracion/nuevas-movilizaciones.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {


                    this._global.movilizacionesXAutorizar.recientes = this._global.parseJSON(data.reportes);
                    console.log('movilizaciones por autorizar');
                    console.log(this._global.movilizacionesXAutorizar.recientes);

                    if (data.reportes.length == 0) {
                        this._global.appstatus.mensaje = 'No se encontraron órdenes.';
                    }

                } else if (data.res = 'error') {
                    this._global.appstatus.mensaje = data.error;
                }


                //console.log("fichas");
                //console.log(this.props.fichas);
            },
            error => console.log(error),
            () => console.log('termino submit')
            );

    }

    nuevosCambiosFisicos() {

        var params = {};
        params["IDCentro"] = this._global.user.IDCentro;
        params["nivel"] = this._global.user.nivel;
        params["limit"] = "5";

        this._global.appstatus.loading = true;
        console.log('nuevas refacciones');
        console.log(params);
        this._httpService.postJSON(params, 'administracion/nuevos-cambios-fisicos.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {


                    this._global.cambiosFisicosXAutorizar.recientes = this._global.parseJSON(data.reportes);
                    console.log('cambios fisicos por autorizar');
                    console.log(this._global.cambiosFisicosXAutorizar.recientes);

                    if (data.reportes.length == 0) {
                        this._global.appstatus.mensaje = 'No se encontraron órdenes.';
                    }

                } else if (data.res = 'error') {
                    this._global.appstatus.mensaje = data.error;
                }


                //console.log("fichas");
                //console.log(this.props.fichas);
            },
            error => console.log(error),
            () => console.log('termino submit')
            );

    }


    nuevosCasosAsignados() {

        var params = {};
        params["IDCentro"] = this._global.user.IDCentro;
        params["nivel"] = this._global.user.nivel;
        params["IDDistribuidor"] = this._global.user.IDDistribuidor;

        this._global.appstatus.loading = true;

        this._httpService.postJSON(params, 'inicio/nuevas-ordenes-asignadas.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {


                    this._global.casosAsignados.recientes = this._global.parseJSON(data.reportes);
                    console.log('casos');
                    console.log(this._global.casosAsignados.recientes);

                    if (data.reportes.length == 0) {
                        this._global.appstatus.mensaje = 'No se encontraron órdenes.';
                    }

                } else if (data.res = 'error') {
                    this._global.appstatus.mensaje = data.error;
                }


                //console.log("fichas");
                //console.log(this.props.fichas);
            },
            error => console.log(error),
            () => console.log('termino submit')
            );

    }



    nuevasOrdenesServicio() {

        var params = {};
        params["IDCentro"] = this._global.user.IDCentro;
        params["IDDistribuidor"] = this._global.user.IDDistribuidor;
        params["nivel"] = this._global.user.nivel;

        this._global.appstatus.loading = true;
        console.log('params nuevas ordenes');
        console.log(params);
        this._httpService.postJSON(params, 'inicio/nuevas-ordenes.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {


                    this._global.ordenesServicio.recientes = this._global.parseJSON(data.reportes);
                    console.log('ordenes');
                    console.log(this._global.ordenesServicio.recientes);

                    if (data.reportes.length == 0) {
                        this._global.appstatus.mensaje = 'No se encontraron órdenes.';
                    }

                } else if (data.res = 'error') {
                    this._global.appstatus.mensaje = data.error;
                }


                //console.log("fichas");
                //console.log(this.props.fichas);
            },
            error => console.log(error),
            () => console.log('termino submit')
            );

    }

    nuevosClientes() {

        var params = {};
        params["Pais"] = this._global.user.Pais;
        params["nivel"] = this._global.user.nivel;
        params["IDCentro"] = this._global.user.IDCentro;
        params["IDDistribuidor"] = this._global.user.IDDistribuidor;


        this._global.appstatus.loading = true;

        this._httpService.postJSON(params, 'inicio/nuevos-clientes.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {


                    this._global.clientes.recientes = this._global.parseJSON(data.clientes);
                    console.log(this._global.busqueda.clientes);

                    if (data.clientes.length == 0) {
                        this._global.appstatus.mensaje = 'No se encontraron clientes con estos datos.';
                    }

                } else if (data.res = 'error') {
                    this._global.appstatus.mensaje = data.error;
                }


                //console.log("fichas");
                //console.log(this.props.fichas);
            },
            error => console.log(error),
            () => console.log('termino submit')
            );

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

        this._global.busqueda.clientes = [];

    }

    submitBusqueda() {

        this._global.appstatus.mensaje = '';

        if (this.genericForm.valid) {
            console.log('submit busqueda');

            console.log(this.genericForm.getRawValue());
            var params = {};
            params = this.genericForm.getRawValue();

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
                            this._global.appstatus.mensaje = 'No se encontraron clientes con estos datos.';
                        }

                    } else if (data.res = 'error') {
                        this._global.appstatus.mensaje = data.error;
                    }


                    //console.log("fichas");
                    //console.log(this.props.fichas);
                },
                error => alert(error),
                () => console.log('termino submit')
                );


        } else {
            this.validateAllFormFields(this.genericForm);
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
