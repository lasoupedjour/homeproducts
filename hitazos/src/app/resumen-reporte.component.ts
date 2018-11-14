import { Component, ElementRef, ViewChild } from '@angular/core';
import { HTTPService } from './services/http.service';
import { GlobalService } from './services/global.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
    selector: 'resumenreporte',
    templateUrl: './resumen-reporte.component.html'
})
export class ResumenReporteComponent {
    title = 'app';
    genericForm: FormGroup;
    SubtipoServicio: '';

    //@ViewChild("Email") Email: ElementRef;

    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService) { }

    ngOnInit() {
        console.log('init resumen reporte');

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


       // this.nuevosClientes();

       // this.nuevasOrdenesServicio();

       // this.nuevosCasosAsignados();
       //this.SubtipoServicio = localStorage.getItem('objreporte').SubtipoServicio;
       console.log("<<<<<<<<<<>", this._global.reporte.objreporte);

       this.obtenerSubtipoServicio();
    }

    obtenerSubtipoServicio(){
      var params = {};

      params['id'] = this._global.reporte.objreporte.IDTarifas;

      this._httpService.postJSON(params, 'inicio/get-tipomovilidad.php')
          .subscribe(
          data => {
            if (data.SubtipoServicio != '') {

              this.SubtipoServicio = data.SubtipoServicio;

            }else{
                this._global.appstatus.mensaje = "No se encontró la tarifa.";
            }


              //console.log("fichas");
              //console.log(this.props.fichas);
          },
          error => alert(error),
          () => console.log('termino submit')
          );
    }

    nuevosCasosAsignados() {

        var params = {};

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
            error => alert(error),
            () => console.log('termino submit')
            );

    }



    nuevasOrdenesServicio() {

        var params = {};

        this._global.appstatus.loading = true;

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
            error => alert(error),
            () => console.log('termino submit')
            );

    }

    imprimirReporte() {

        var ventana = window.open('http://apps.pautacreativatemporales.com.mx/oster/homeproducts/inicio/resumen', '', 'width=1000,height=1000');
        //var ventana = window.open('/inicio/resumen', '', 'width=1000,height=1000');

        //ventana.document.write();
        ventana.document.close(); //missing code
        ventana.focus();
        ventana.print();
        //window.print();

    }


    nuevosClientes() {
        console.log('nuevosClientes()');
        var params = {};

        this._global.appstatus.loading = true;

        this._httpService.postJSON(params, 'inicio/nuevos-clientes.php')
            .subscribe(
            data => {
                console.log('nuevos-clientes.php');
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
            error => alert(error),
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
