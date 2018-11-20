import { Component, ElementRef, ViewChild } from '@angular/core';
import { HTTPService } from './services/http.service';
import { GlobalService } from './services/global.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import swal from 'sweetalert2';

@Component({
    selector: 'resumenorden',
    templateUrl: './resumen-orden.component.html'
})
export class ResumenOrdenComponent {
    title = 'app';
    genericForm: FormGroup;
    adjuntosCambioFisicoForm: FormGroup;
    RazonSocialDistribuidor: string;
    FechaResolucion: string;
    //@ViewChild("Email") Email: ElementRef;
    tiporeparacion = {
        "id": -1,
        "IDGrupoTarifa": -1,
        "TipoTarifa": "",
        "TipoServicio": "",
        "SubtipoServicio": "",
        "Valor": 0,
        "Impuesto": 0,
        "TarifaMensual": 0,
        "ImpuestoTarifaMensual": 0,
    };

    formulariostatus = {
        "success": 1
    };

    ReciclajeLenght: 0;
    adjuntosValidosCambioFisico;

    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService) { }

    ngOnInit() {
        console.log('init');
        //Asignamos la fecha de resolución
        this.FechaResolucion = moment(Date.now()).format("DD/M/Y");

        this._global.clearMessages();

        this.genericForm = this.formBuilder.group({
            informacionCompleta: ['',
                Validators.required
            ],
            razonRechazo: [''],
            reclamo: ['',
                Validators.required
            ],
            procesadoPor: ['',
                Validators.required
            ]
        });

        this.adjuntosCambioFisicoForm = this.formBuilder.group({
            // informacionCompleta: ['',
            //     Validators.required
            // ],
            // razonRechazo: [''],
            // reclamo: ['',
            //     Validators.required
            // ],
            // procesadoPor: ['',
            //     Validators.required
            // ]
        });


       // this.nuevosClientes();

       // this.nuevasOrdenesServicio();

       // this.nuevosCasosAsignados();

        this._global.setRefaccionesBd();
        this._global.setAdjuntos();
        this.getDistribuidor();
        this.setTipoReparacion();
    }



    imprimirReporte() {

        var ventana = window.open('http://apps.pautacreativatemporales.com.mx/oster/homeproducts/inicio/resumen/orden', '', 'width=1000,height=1000');
        //var ventana = window.open('/inicio/resumen/orden', '', 'width=1000,height=1000');

        //ventana.document.write();
        ventana.document.close(); //missing code
        ventana.focus();
        ventana.print();
        //window.print();

    }

    prevAttach(item) {
        var tipo = '';
        var html = '';
        console.log(item);
        if (item.includes('.jpg') || item.includes('.jpeg') || item.includes('.png')) {
            html = `
              <a class="img" href="${this._global.base}orden-de-servicio/uploads-ordenes/${item}" target="_blank" title="${item}">
                <img src="${this._global.base}orden-de-servicio/uploads-ordenes/${item}" >
              </a>
            `;
        } else if (item.includes('.pdf')) {
            html = `
              <a class="pdf" href="${this._global.base}orden-de-servicio/uploads-ordenes/${item}" target="_blank" title="${item}">
                <i class="fa fa-file-pdf"></i>
              </a>
            `;
        } else if (item.includes('.mp4') || item.includes('.mov') || item.includes('.avi') || item.includes('.webm')) {
            html = `
              <a class="pdf" href="${this._global.base}orden-de-servicio/uploads-ordenes/${item}" target="_blank" title="${item}">
                <i class="fa fa-file-video"></i>
              </a>
            `;
        }
        return html;
    }


    getDistribuidor() {
        var params = {};
        params["IDDistribuidor"] = this._global.reporte.objreporte.Distribuidor;

        this._global.appstatus.loading = true;

        this._httpService.postJSON(params, 'orden-de-servicio/busca-distribuidor.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {
                    this.RazonSocialDistribuidor = JSON.parse(data.distribuidor).RazonSocial;
                    //console.log(this.RazonSocialDistribuidor);
                    if (data.distribuidor.length == 0) {
                        //this._global.appstatus.mensaje = 'No se encontraron datos con estas características.';
                    }
                } else if (data.res = 'error') {
                    this._global.appstatus.mensaje = data.error;
                }
            },
            error => alert(error),
            () => console.log('termino submit')
            );
    }

    setTipoReparacion() {
        var params = {};
        params["id"] = this._global.reporte.objreporte.TipoReparacion;

        this._global.appstatus.loading = true;

        this._httpService.postJSON(params, 'orden-de-servicio/get-tipo-reparacion.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {
                    this.tiporeparacion = JSON.parse(data.tiporeparacion);
                    console.log(this.tiporeparacion);
                    if (data.tiporeparacion.length == 0) {
                        //this._global.appstatus.mensaje = 'No se encontraron datos con estas características.';
                    }
                } else if (data.res = 'error') {
                    this._global.appstatus.mensaje = data.error;
                }
            },
            error => alert(error),
            () => console.log('termino submit')
            );


    }

    resolucionDisabled(){
      var flag = true;
      if(this._global.user.nivel == 'administrador'){
        flag = null;
      }
      return flag;
    }

    reclamoChange(){
        //console.log('reclamo change');
        if(this.genericForm.controls.reclamo.value == 0){
          this.genericForm.controls.razonRechazo.setValidators([Validators.required]);
        }else{
          this.genericForm.controls.razonRechazo.setValidators([]);
        }
        this.genericForm.controls.razonRechazo.updateValueAndValidity();
    }

    onActionReciclaje(event: any) {
        console.log(event);
        this._global.AdjuntosReciclaje = event;
    }

    validarAdjuntosCambioFisico(){
      try { this.ReciclajeLenght = Object(this._global.AdjuntosReciclaje).currentFiles.length; } catch (e) { this.ReciclajeLenght = 0; }


      this.adjuntosValidosCambioFisico = false;
      if(this.ReciclajeLenght>0){
        this.adjuntosValidosCambioFisico = true;
      }
    }
    //registro de adjuntos de cambio físico
    submitAdjuntosCambioFisico(){
      this.validarAdjuntosCambioFisico();

      if (this.adjuntosCambioFisicoForm.valid && this.adjuntosValidosCambioFisico) {

        this._global.clearMessages();
        this._global.appstatus.loading = true;

        var params = {};
        params = this.adjuntosCambioFisicoForm.getRawValue();
        params["IDReporte"] = this._global.reporte.idreporte;
        params["IDUsuario"] = this._global.user.id;
        params["IDCliente"] = this._global.cliente.id;
        params["TipoReclamoDiagnostico"] = this._global.reporte.objreporte.TipoReclamoDiagnostico;

        params["AdjuntosReciclaje"] = this._global.AdjuntosReciclaje;
        try { params["AdjuntosReciclajeSize"] = Object(this._global.AdjuntosReciclaje).currentFiles.length; } catch (e) { params["AdjuntosReciclajeSize"] = 0; };

        console.log(params);

        this._httpService.postFormDataCambioFisico(params, 'orden-de-servicio/registro-adjuntos-cambio-fisico.php')
            .subscribe(
          data => {
              console.log('data subiendo');
              console.log(data);
              this._global.appstatus.loading = false;

              if (data.res == 'ok') {

                  this._global.guardarIdReporte(data.idreporte);
                  this._global.guardarObjReporte(data.objreporte);

                  this._global.appstatus.loading = false;

                  swal('Guardado','Se han guardado correctamente los comprobantes para la orden de servicio #'+this._global.reporte.idreporte,'success');


                  //Registro de notificación
                  this._global.notificaciones.modulo = "/resumen/orden/adjuntos-cambio-fisico";
                  this._global.notificaciones.descripcion = "Se han subido comprobantes de cambio físico para la orden No. " + this._global.reporte.idreporte;
                  this._global.registrarNotificacion(this._global.reporte.idreporte);


              } else if (data.res == 'error') {
                  swal('Error',data.msg,'error');
              }

          },
          error => alert(error),
          () => console.log('termino submit')
          );
      } else {
          this._global.validateAllFormFields(this.adjuntosCambioFisicoForm);
      }

    }

    //Registro de la resolución
    submitResolucion() {
      console.log("submit resolución");
      console.log(this.genericForm.valid);
      console.log("Info", this.genericForm.controls.informacionCompleta.value);
      console.log("Rechazo", this.genericForm.controls.razonRechazo.value);
      console.log("Reclamo", this.genericForm.controls.reclamo.value);
      console.log("Procesado", this.genericForm.controls.procesadoPor.value);
      console.log("Fecha", this.FechaResolucion);
      console.log("NoOrden", this._global.reporte.idreporte);

      if (this.genericForm.valid) {
        this._global.clearMessages();

        var params = {};
        params['informacionCompleta'] = this.genericForm.controls.informacionCompleta.value;
        params['razonRechazo'] = this.genericForm.controls.razonRechazo.value;
        params['reclamo'] = this.genericForm.controls.reclamo.value;
        params['procesadoPor'] = this.genericForm.controls.procesadoPor.value;
        params['fechaResolucion'] = this.FechaResolucion;
        params['NoOrden'] = this._global.reporte.idreporte;

        this._global.appstatus.loading = true;

        this._httpService.postJSON(params, 'regisrto-resolucion.php')
          .subscribe(
          data => {
            console.log('data');
            console.log(data);
            this._global.appstatus.loading = false;

            if (data.res == 'ok') {
              console.log("pre notificación");
              this._global.notificaciones.modulo = "/inicio/resumen/orden";
              this._global.notificaciones.descripcion = "Registro de resolución para el reporte No. " + this._global.reporte.idreporte;
              this._global.registrarNotificacion(this._global.reporte.idreporte);

              this.genericForm.reset();
              this.formulariostatus.success = 2;

              swal("Notificación Enviada","Se ha enviado una notificación al CDS informando sobre el status de la orden de servicio.", "success");


            } else if (data.res == 'error') {
                this._global.appstatus.mensaje = data.error;
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
