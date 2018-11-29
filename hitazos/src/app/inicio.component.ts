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
    filterForm: FormGroup;
    filterOrdenesForm: FormGroup;

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

        this.filterForm = this.formBuilder.group({
            Pais: [this._global.user.Pais],
            Master: [''],
            Cds: ['']
        });

        this.filterOrdenesForm = this.formBuilder.group({
            Pais: [this._global.user.Pais],
            Master: [''],
            Cds: ['']
        });

        this.precargaPaises();
        this.changePais();
        this.changePais("masterOrdenes");

        this.nuevosClientes();
        this.nuevasOrdenesServicio();
        this.nuevosCasosAsignados();
        this.nuevosCambiosFisicos();
        this.nuevosCambiosFisicosDist();

        //funciones de administrador
        if (this._global.user.nivel == 'administrador') {

            this.nuevasRefacciones();
            this.nuevasCotizaciones();
            this.nuevasMovilizaciones();

        }

        if(this._global.user.CustomerID!='')
          this.nuevosCambiosFisicosPerfilDist();

        $(document).ready(function () {

            console.log('ready jquery');

        })

    }

    changePais(cmb="") {
        //console.log(this.filterForm.controls.Pais.value);
        var params = {};
        params['Pais'] = this.filterForm.controls.Pais.value;
        params['IDCentro'] = this._global.user.IDCentro;
        params['Nivel'] = this._global.user.nivel;
        params['IDMaster'] = this._global.user.IDMaster;
        params['IDGrupoTarifa'] = this._global.user.IDGrupoTarifa;

        this._global.appstatus.loading = true;

        this._httpService.postHTML(params, 'administracion/listarmaster.php')
            .subscribe(
            data => {
                console.log('data cds');
                console.log(data);

                this._global.appstatus.loading = false;
                if(cmb=="")
                  document.getElementById('master').innerHTML = data;
                else
                  document.getElementById('masterOrdenes').innerHTML = data;

                //filterOrdenesForm
                //console.log("fichas");
                //console.log(this.props.fichas);
            },
            error => alert(error),
            () => console.log('termino submit')
            );
    }

    changeMaster(cmb="") {
        //console.log(this.filterForm.controls.Pais.value);
        var params = {};
        params['Pais'] = this.filterForm.controls.Pais.value;
        params['Nivel'] = this._global.user.nivel;
        if(cmb=="")
          params['IDMaster'] = $("#master").val();
        else
          params['IDMaster'] = $("#masterOrdenes").val();

        this._global.appstatus.loading = true;

        this._httpService.postHTML(params, 'administracion/listarcds.php')
            .subscribe(
            data => {
                console.log('data cds');
                console.log(data);

                this._global.appstatus.loading = false;
                if(cmb=="")
                  document.getElementById('centros').innerHTML = data;
                else
                  document.getElementById('centrosOrdenes').innerHTML = data;

                //console.log("fichas");
                //console.log(this.props.fichas);
            },
            error => alert(error),
            () => console.log('termino submit')
            );
    }

    precargaPaises() {

        var params = {};

        params['Pais'] = Object(this._global.user).Pais;
        params['nivel'] = Object(this._global.user).nivel;

        this._global.appstatus.loading = true;

        /*console.log('Precarga distribuidores');
        console.log(params);*/

        this._httpService.postJSON(params, 'precarga-paises.php')
            .subscribe(
            data => {
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {

                    this._global.paises = this._global.parseJSON(data.paises);

                    if (data.paises.length == 0) {
                        this._global.appstatus.mensaje = 'No se encontraron datos con estas características.';
                    }

                } else if (data.res = 'error') {

                    this._global.appstatus.mensaje = data.error;

                }
            },
            error => alert(error),
            () => console.log('termino submit')
            );

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

    nuevosCambiosFisicosPerfilDist() {

        var params = {};
        params["IDCentro"] = this._global.user.IDCentro;
        params["NombreDistribuidor"] = this._global.user.nombre;
        params["Distribuidor"] = this._global.user.CustomerID;
        params["limit"] = "5";

        this._global.appstatus.loading = true;
        console.log('nuevas cambios físicos perfil dist');
        console.log(params);
        this._httpService.postJSON(params, 'administracion/nuevos-cambios-fisicos-perfil-dist.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {


                    this._global.cambiosFisicosXAutorizarPD.recientes = this._global.parseJSON(data.reportes);
                    console.log('cambios fisicos perfil dist');
                    console.log(this._global.cambiosFisicosXAutorizarPD.recientes);

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

    nuevosCambiosFisicosDist() {

        var params = {};
        params["IDCentro"] = this._global.user.IDCentro;
        params["nivel"] = this._global.user.nivel;
        params["limit"] = "5";

        this._global.appstatus.loading = true;
        console.log('nuevos cambios físicos distribuidores', params);

        this._httpService.postJSON(params, 'administracion/nuevos-cambios-fisicos-distribuidor.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {


                    this._global.cambiosFisicosXAutorizarDist.recientes = this._global.parseJSON(data.reportes);
                    console.log('cambios fisicos por autorizar');
                    console.log(this._global.cambiosFisicosXAutorizarDist.recientes);

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
        params["Cds"] = this.filterForm.controls.Cds.value;

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
        params["Cds"] = this.filterForm.controls.Cds.value;

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
