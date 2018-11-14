import { Component } from '@angular/core';
import { HTTPService } from '../services/http.service';
import { GlobalService } from '../services/global.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { userValidators } from '../userValidators';

@Component({
    selector: 'clientedetalle',
    templateUrl: './cliente-detalle.component.html'
})
export class ClienteDetalleComponent {
    title = 'app';
    genericForm: FormGroup;
    private sub: any;

    status = {
        "TipoCaso": "",
        "FechaCompra": "",
        "garantiaValida": false,
        "mostrarDescripcion": false,
        "paso": 1
    }


    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService, public route: ActivatedRoute) { }

    ngOnInit() {
        console.log('init registro');
        console.log(this._global.user);

        /*this.sub = this.route.params.subscribe(params => {
            this._global.cliente.id = params['id'];
        });*/


        this.genericForm = this.formBuilder.group({
            /*usuario: ['', Validators.compose([
                Validators.required,
                Validators.email
            ])],*/

            TipoCaso: ['',
                Validators.required
            ],
            Categoria: ['',
                Validators.required
            ],
            Tipo: ['',
                Validators.required
            ],
            Modelo: ['',
                Validators.required
            ],
            CodigoSAP: [''],
            FechaCompra: ['',
                Validators.required
            ],
            AplicaGarantia: ['',
                Validators.required
            ],
            Uso: ['',
                Validators.required
            ],
            LugarCompra: ['',
                Validators.required
            ],
            Falla: ['',
                Validators.required
            ],
            Comentarios: [''],
            TipoRevision: ['',
                Validators.required
            ],
            FechaRevision: [''],
            Descripcion: [''],



        });


        this.reportesLevantados();


    }

    reportesLevantados() {

        var params = {
            IDCliente: Object(this._global.cliente.objeto).id,
            IDCentro: Object(this._global.user).IDCentro
        };

        this._global.appstatus.loading = true;
        //params = JSON.stringify(params);
        console.log(params);
        this._httpService.postJSON(params, 'inicio/reportes-levantados.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {
                    console.log('ok');
                    this._global.reportesLevantadosCliente.recientes = this._global.parseJSON(data.reportes);
                    console.log('casos');
                    console.log(this._global.reportesLevantadosCliente.recientes);

                    if (data.reportes.length == 0) {
                        //this._global.appstatus.mensaje = 'No se encontraron órdenes.';
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


    }


    abiertoCerrado(status) {

        if (status == 'Orden de Servicio') { return 'Cerrado'; } else { return 'Abierto'; }

    }

    descripcion() {

        var opcionesProducto = [];
        opcionesProducto.push('Cambio Físico');
        opcionesProducto.push('Garantía');
        opcionesProducto.push('Refacciones');
        opcionesProducto.push('Manuales');
        opcionesProducto.push('Cambio Físico');
        var requiereDescripcion = true;

        var temp = this.genericForm.controls.TipoCaso.value;

        if (opcionesProducto.includes(temp)) {
            requiereDescripcion = false;
        }

        if (requiereDescripcion) {

            this.status.mostrarDescripcion = true;

            this.genericForm.controls.Descripcion.setValidators([Validators.required]);
            this.genericForm.controls.Descripcion.updateValueAndValidity();

            this.toggleValidatorsProductos(false);

        } else {

            this.status.mostrarDescripcion = false;

            this.genericForm.controls.Descripcion.setValidators([]);
            this.genericForm.controls.Descripcion.setValue('');
            this.genericForm.controls.Descripcion.updateValueAndValidity();

            this.toggleValidatorsProductos(true);

        }

        return requiereDescripcion;

    }

    toggleValidatorsProductos(flag) {

        var arreValProductos = [];
        arreValProductos.push(this.genericForm.controls.Categoria);
        arreValProductos.push(this.genericForm.controls.Tipo);
        arreValProductos.push(this.genericForm.controls.Modelo);
        //arreValProductos.push(this.genericForm.controls.FechaCompra);
        //arreValProductos.push(this.genericForm.controls.AplicaGarantia);
        arreValProductos.push(this.genericForm.controls.Uso);
        arreValProductos.push(this.genericForm.controls.LugarCompra);
        arreValProductos.push(this.genericForm.controls.Falla);

        arreValProductos.push(this.genericForm.controls.TipoRevision);
        //arreValProductos.push(this.genericForm.controls.FechaRevision);


        this.genericForm.controls.Categoria.setValue('');
        this.genericForm.controls.Comentarios.setValue('');



        if (!flag) {
            console.log('desactiva required productos');

            this.genericForm.controls.AplicaGarantia.setValidators([]);
            this.genericForm.controls.AplicaGarantia.setValue('');
            this.genericForm.controls.AplicaGarantia.updateValueAndValidity();

            this.genericForm.controls.FechaCompra.setValidators([]);
            this.genericForm.controls.FechaCompra.setValue('');
            this.genericForm.controls.FechaCompra.updateValueAndValidity();

            this.genericForm.controls.FechaRevision.setValidators([]);
            this.genericForm.controls.FechaRevision.setValue('');
            this.genericForm.controls.FechaRevision.updateValueAndValidity();

            for (var i = 0; i < arreValProductos.length; i++) {
                arreValProductos[i].setValidators([]);
                arreValProductos[i].setValue('');
                arreValProductos[i].updateValueAndValidity();
            }

        } else {
            console.log('activa required productos');

            this.genericForm.controls.AplicaGarantia.setValidators([Validators.required]);
            this.genericForm.controls.AplicaGarantia.setValue('');
            this.genericForm.controls.AplicaGarantia.updateValueAndValidity();

            this.genericForm.controls.FechaCompra.setValidators([Validators.required]);
            this.genericForm.controls.FechaCompra.setValue('');
            this.genericForm.controls.FechaCompra.updateValueAndValidity();



            for (var i = 0; i < arreValProductos.length; i++) {
                arreValProductos[i].setValidators([Validators.required]);
                arreValProductos[i].setValue('');
                arreValProductos[i].updateValueAndValidity();
            }

        }

        //this.changeFechaCompra();



    }

    changeTipoCaso() {

        //var tipocaso = (<HTMLInputElement>document.getElementById("tipocaso")).value;
        //console.log(tipocaso);
        //this.status.TipoCaso = tipocaso;
        console.log(this.genericForm.controls.TipoCaso.value);
        this.resetRequired();

        this.descripcion();

        switch (this.genericForm.controls.TipoCaso.value) {

            case "Garantía":

                this.genericForm.controls.TipoRevision.setValidators([Validators.required]);
                this.genericForm.controls.TipoRevision.updateValueAndValidity();

                this.genericForm.controls.FechaRevision.setValidators([Validators.required]);
                this.genericForm.controls.FechaRevision.updateValueAndValidity();

                break;

            default:

                this.genericForm.controls.TipoRevision.setValidators([]);
                this.genericForm.controls.TipoRevision.updateValueAndValidity();

                this.genericForm.controls.FechaRevision.setValidators([]);
                this.genericForm.controls.FechaRevision.updateValueAndValidity();

                break;


        }


    }

    resetRequired() {
        this.genericForm.controls.TipoRevision.setValidators([]);
        this.genericForm.controls.TipoRevision.setValue('');
        this.genericForm.controls.TipoRevision.updateValueAndValidity();

        this.genericForm.controls.FechaRevision.setValidators([]);
        this.genericForm.controls.FechaRevision.setValue('');
        this.genericForm.controls.FechaRevision.updateValueAndValidity();
    }

    changeCategoria() {

    }
    changeTipo() {

    }
    changeModelo() {

    }

    changeFechaCompra() {

        this.status.FechaCompra = this.genericForm.controls.FechaCompra.value;
        this.evaluaFechaCompra();

    }

    evaluaFechaCompra() {
        console.log(Object(this.status.FechaCompra).year + '/' + Object(this.status.FechaCompra).month + '/' + Object(this.status.FechaCompra).day);
        var fecha = new Date(Object(this.status.FechaCompra).year + '/' + Object(this.status.FechaCompra).month + '/' + Object(this.status.FechaCompra).day);
        console.log(fecha);

        var hoy = new Date();
        console.log(hoy);

        var anos = this.diff_years(hoy, fecha);
        console.log(anos);

        if (anos == 0) {
            //this.status.garantiaValida = true;
            this.genericForm.controls.AplicaGarantia.setValue('si');
        } else {
            //this.status.garantiaValida = false;
            this.genericForm.controls.AplicaGarantia.setValue('no');
        }
    }

    diff_years(dt2, dt1) {

        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60 * 24);
        return Math.abs(Math.floor(diff / 365.25));

    }

    changeTipoRevision() {

        if (this.genericForm.controls.TipoRevision.value == 'domicilio') {

            this.genericForm.controls.FechaRevision.setValidators([Validators.required]);
            this.genericForm.controls.FechaRevision.updateValueAndValidity();

        } else {

            this.genericForm.controls.FechaRevision.setValidators([]);
            this.genericForm.controls.FechaRevision.updateValueAndValidity();

        }

    }


    randomBetween(arre) {
        var size = arre.length + 1;
        console.log('tamano');
        console.log(size);
        var rand = Math.floor(Math.random() * size);
        console.log(rand);
        return rand;
    }





    submitRegistro() {
        console.log('submit prevalidation');

        if (this.genericForm.valid) {

            console.log('submit registro');
            this._global.clearMessages();

            console.log(this.genericForm.getRawValue());

            var params = {};
            params = this.genericForm.getRawValue();
            params["IDUsuario"] = this._global.user.id;
            params["IDCliente"] = this._global.cliente.id;

            this._global.appstatus.loading = true;

            this._httpService.postJSON(params, 'registro-de-casos/registro-reporte.php')
                .subscribe(
                data => {
                    console.log('data');
                    console.log(data);
                    this._global.appstatus.loading = false;

                    if (data.res == 'ok') {

                        this._global.reporte.idreporte = data.idreporte;

                        this.genericForm.reset();
                        this.status.paso = 2;

                    } else if (data.res == 'error') {

                        this._global.appstatus.mensaje = data.msg;

                    }



                },
                error => alert(error),
                () => console.log('termino submit')
                );


        } else {
            this._global.validateAllFormFields(this.genericForm);
        }
    }








}


