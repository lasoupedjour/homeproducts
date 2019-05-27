import { Component, ElementRef, ViewChild } from '@angular/core';
import { HTTPService } from './services/http.service';
import { GlobalService } from './services/global.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'resumenorden',
    templateUrl: './resumen-orden.component.html'
})
export class ResumenOrdenComponent {
    title = 'app';
    genericForm: FormGroup;
    adjuntosCambioFisicoForm: FormGroup;
    distribuidorCambioFisicoForm: FormGroup;
    editarReciclaje = false;
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

    resolucion = {
      "id": 0,
      "info_completa": 0,
      "reclamo": 0,
      "razon_rechazo": "",
      "procesado_por": "",
      "fecha": ""
    }

    formulariostatus = {
        "success": 1
    };

    status = {
        "TipoCaso" : "",
        "FechaCompra" : "",
        "garantiaValida": false,
        "mostrarDescripcion": false,
        "agregaRefaccionValid": true,
        "cotizar": -1,
        "solicitar": -1,
        "habilitarOrden" : false

    }

    ReciclajeLenght = 0;
    adjuntosValidosCambioFisico = false;

    modelfechaentregacambio: NgbDateStruct;

    minDate: Date;
    minDateObj: Object;

    fechaentregacambio;

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
            ],
            MontoDespiece: [0],
            MontoReciclaje: [0],
            MontoOtro: [0],
            MontoOtroDescripcion: ['']
        });

        this.adjuntosCambioFisicoForm = this.formBuilder.group({
            Refaccion: [''],
            NoParte: ['']
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

        this.distribuidorCambioFisicoForm = this.formBuilder.group({
            FechaEntregaCambio: [''],
            CostoLanded: [this._global.reporte.objreporte.CostoLanded, Validators.required],
            OtroCostoDistribuidor: [''],
        });

        this.setFechaEntregaCambio();

       // this.nuevosClientes();

       // this.nuevasOrdenesServicio();

       // this.nuevosCasosAsignados();

       this.minDate = new Date();
       this.minDateObj = {
           year: this.minDate.getFullYear(),
           month: this.minDate.getMonth() + 1,
           day: this.minDate.getDate()
       };




        this.getDistribuidor();
        this.setTipoReparacion();

        console.log("/inicio/resumen/orden reporte>>>", this._global.reporte.objreporte);
        if(this._global.reporte.objreporte.FechaEntregaCambio !="0000-00-00 00:00:00")
          this.fechaentregacambio = moment(this._global.reporte.objreporte.FechaEntregaCambio).format("DD/M/Y")



        if(
            this._global.reporte.objreporte.StatusCambioFisico=='Aprobado' &&
            this._global.reporte.objreporte.SubStatusReporte=='Abierto' && !this._global.esDistribuidor()){
              this.editarReciclaje = true;
            }

        this.obtenerDetalleResolucion();
        this.llenaRefacciones();
        this._global.setAdjuntos();

        this._global.setRefaccionesBd();
        this._global.setRefaccionesRecuperadasBd();
        console.log("this._global.refaccionesrecuperadas-->", this._global.refaccionesrecuperadas.length);
    }

    changeCantidad(id, val) {

        console.log('change cantidad', id);

        this._global.refaccionesrecuperadas[id].Cantidad = parseInt(val);

    }

    agregarOtraRefaccion(){
      var OtraRefaccion = $("#OtraRefaccion").val();

      if (OtraRefaccion != '') {
          this.status.agregaRefaccionValid = true;

          this._global.resetRefaccionRecuperada();

          var nombrerefaccion = "";

          /*
          this._global.refaccionesproductos.forEach(function (e) {
              if (e.NoParte == outer.genericForm.controls.OtraRefaccion.value)
                  nombrerefaccion = e.Nombre;
          });
          */

          this._global.refaccionrecuperada.NombreRefaccion = 'Otro';
          this._global.refaccionrecuperada.NoParte = String(OtraRefaccion);
          this._global.refaccionrecuperada.Cantidad = "1";

          this._global.refaccionesrecuperadas.push(this._global.refaccionrecuperada);
          console.log("this._global.refaccionesrecuperadas", this._global.refaccionesrecuperadas);
          this.adjuntosCambioFisicoForm.controls.Refaccion.setValue('');
          this.adjuntosCambioFisicoForm.controls.NoParte.setValue('');

          //this.habilitarOrdenServicio();

      }/*else if(this.adjuntosCambioFisicoForm.controls.Refaccion.value == 'Otro'){
        alert("Show input");
      }*/else {
          this.status.agregaRefaccionValid = false;
      }
    }

    validaRefacciones() {
        var validarefacciones = true;
        if (this.genericForm.controls.RequiereRefacciones.value && !this._global.refacciones[0]) {
            validarefacciones = false;
        }
        return validarefacciones;
    }

    validaPropiedadesRefacciones() {
        var validarefacciones = true;
        console.log(this._global.refacciones);

        //valida por casos
        this._global.refaccionesrecuperadas.forEach(function (e) {
            //caso disponible
            if (e.Existencia == 'Disponible') {
              if (e.Status == "" || e.CostoUnitario === "")
                validarefacciones = false
            }

            //caso no encontrada
            if (e.Existencia == 'No Disponible' || e.Existencia == 'No Encontrada') {
                if (e.Cantidad == null || e.Cantidad == 0)
                    validarefacciones = false
            }



        });


        return validarefacciones;
    }

    eliminarReporte(id) {
      swal({
          title: 'Eliminar #Reporte: ' + id,
          html: `¿Estás seguro que deseas eliminar el reporte?`,
          showConfirmButton: true,
          confirmButtonText: 'Confirmar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          customClass: 'swal2-overflow',

      }).then((result) => {
        console.log("Result", result);

        var params = {};
        params["IDReporte"] = this._global.reporte.idreporte;

        this._global.appstatus.loading = true;

        this._httpService.postJSON(params, 'eliminar-reporte.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {
                  swal(data.msg, "success");
                  this._router.navigate(['inicio']);
                  //console.log("this.resolucion.id", this.resolucion.id);
                } else if (data.res = 'error') {
                    this._global.appstatus.mensaje = data.error;
                }
            },
            error => console.log(error),
            () => console.log('termino submit')
            );

      });

    }

    llenaRefacciones() {

        var params = {
            Subcategoria: Object(this._global.reporte.objreporte).Subcategoria,
            Modelo: Object(this._global.reporte.objreporte).Modelo
        };

        this._global.appstatus.loading = true;
        this._global.refaccionesproductos = [];

        this._httpService.postJSON(params, 'buscar-refacciones.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {
                    this._global.refaccionesproductos = this._global.parseJSON(data.refaccionesproductos);
                    console.log('refaccionesproductos');
                    console.log(this._global.refaccionesproductos);

                    /*this.genericForm.controls.MotivoFallaDiagnostico.setValue(Object(this._global.reporte.objreporte).MotivoFallaDiagnostico);
                    this.genericForm.controls.MotivoFallaDiagnostico.updateValueAndValidity();
                    */

                    if (data.refaccionesproductos.length == 0) {
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

    agregarRefaccion() {
        console.log('agregar refaccion');

        if (this.adjuntosCambioFisicoForm.controls.Refaccion.value != '' && this.adjuntosCambioFisicoForm.controls.Refaccion.value!='Otro') {
            this.status.agregaRefaccionValid = true;


            this._global.resetRefaccionRecuperada();

            var nombrerefaccion = "";

            var outer = this;

            this._global.refaccionesproductos.forEach(function (e) {
                if (e.NoParte == outer.adjuntosCambioFisicoForm.controls.Refaccion.value)
                    nombrerefaccion = e.Nombre;
            });

            this._global.refaccionrecuperada.NombreRefaccion = nombrerefaccion;
            this._global.refaccionrecuperada.NoParte = this.adjuntosCambioFisicoForm.controls.Refaccion.value;
            this._global.refaccionrecuperada.Cantidad = "1";


            this._global.refaccionesrecuperadas.push(this._global.refaccion);

            this.adjuntosCambioFisicoForm.controls.Refaccion.setValue('');
            this.adjuntosCambioFisicoForm.controls.NoParte.setValue('');

            //this.habilitarOrdenServicio();

        }/*else if(this.adjuntosCambioFisicoForm.controls.Refaccion.value == 'Otro'){
          alert("Show input");
        }*/else {
            this.status.agregaRefaccionValid = false;
        }

        //this.habilitarOrdenServicio();
    }

    obtenerDetalleResolucion(){
      var params = {};
      params["IDReporte"] = this._global.reporte.idreporte;

      this._global.appstatus.loading = true;

      this._httpService.postJSON(params, 'resumen/get-resolucion.php')
          .subscribe(
          data => {
              console.log('data');
              console.log(data);
              this._global.appstatus.loading = false;

              if (data.res == 'ok') {
                console.log("resolucion", data.resolucion);

                if (!(data.resolucion.length == 0)) {
                  this.resolucion.id=JSON.parse(data.resolucion).id;
                  this.resolucion.info_completa=JSON.parse(data.resolucion).info_completa;
                  this.resolucion.reclamo=JSON.parse(data.resolucion).reclamo;
                  this.resolucion.razon_rechazo=JSON.parse(data.resolucion).razon_rechazo;
                  this.resolucion.procesado_por=JSON.parse(data.resolucion).procesado_por;
                  this.resolucion.fecha=JSON.parse(data.resolucion).fecha;
                }


                //console.log("this.resolucion.id", this.resolucion.id);
                  /*
                  this.RazonSocialDistribuidor = JSON.parse(data.distribuidor).RazonSocial;
                  //console.log(this.RazonSocialDistribuidor);
                  if (data.distribuidor.length == 0) {
                      //this._global.appstatus.mensaje = 'No se encontraron datos con estas características.';
                  }
                  */
              } else if (data.res = 'error') {
                  this._global.appstatus.mensaje = data.error;
              }
          },
          error => console.log(error),
          () => console.log('termino submit')
          );
    }

    changeMontoDespiece(){
      var MontoSubtotal = 0;

      var MontoDespiece = $("#MontoDespiece").val();
      var MontoReciclaje = $("#MontoReciclaje").val();
      var MontoOtro = $("#MontoOtro").val()
      var MontoIVA = 0;
      var MontoTotal = 0;

      MontoSubtotal = parseFloat(this._global.reporte.objreporte.MontoRefacciones) + parseFloat(this._global.reporte.objreporte.MontoReparacion) + parseFloat(this._global.reporte.objreporte.MontoMovilizacion);
      MontoSubtotal = parseFloat(String(this._global.reporte.objreporte.MontoSubtotal));

      MontoSubtotal = parseFloat(String(MontoSubtotal)) + parseFloat(String(MontoDespiece)) + parseFloat(String(MontoReciclaje)) + parseFloat(String(MontoOtro));
      MontoSubtotal = parseFloat(String(MontoSubtotal)) + parseFloat(String(this._global.reporte.objreporte.MontoReciclaje));
      MontoSubtotal = parseFloat(String(MontoSubtotal)) + parseFloat(String(this._global.reporte.objreporte.MontoOtro));

      //alert(this.tiporeparacion.Impuesto);
      if(String(this.tiporeparacion.Impuesto)=='0')
        MontoIVA = 0;
      else
        MontoIVA = parseFloat(String(this.tiporeparacion.Impuesto)) * parseFloat(String(MontoSubtotal));

      MontoTotal = parseFloat(String(MontoSubtotal)) + parseFloat(String(MontoIVA));

      this._global.reporte.objreporte.MontoIVA = String(MontoIVA);
      this._global.reporte.objreporte.MontoTotal = String(MontoTotal);
      this._global.reporte.objreporte.MontoDespiece = String(MontoDespiece);
      this._global.reporte.objreporte.MontoReciclaje = String(MontoReciclaje);
      this._global.reporte.objreporte.MontoOtro = String(MontoOtro);
    }

    setFechaEntregaCambio(){

      //set fecha revision
      var fecha = Object(this._global.reporte.objreporte).FechaEntregaCambio;
      fecha = fecha.replace(' 00:00:00', '');
      fecha = fecha.split('-');
      //console.log(fecha);
      const now = new Date();

      var fechatemp = {
          day: parseInt(fecha[2]),
          month: parseInt(fecha[1]),
          year: parseInt(fecha[0])
      };

      this.modelfechaentregacambio = { year: fechatemp.year, month: fechatemp.month, day: fechatemp.day };

    }

    imprimirReporte() {

        //var ventana = window.open('http://apps.pautacreativatemporales.com.mx/oster/homeproducts/inicio/resumen/orden', '', 'width=1000,height=1000');
        var ventana = window.open('http://www.solution-center.net/inicio/resumen/orden', '', 'width=1000,height=1000');
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
            error => console.log(error),
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
            error => console.log(error),
            () => console.log('termino submit')
            );


    }

    resolucionDisabled(){
      var flag = true;
      if(this._global.user.nivel == 'administrador'){
        flag = null;
      }
      console.log("flag this._global.reporte.objreporte", this._global.reporte.objreporte);
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

        params["MontoDespiece"] = $("#MontoDespiece").val();
        params["MontoReciclaje"] = $("#MontoReciclaje").val();
        params["MontoOtro"] = $("#MontoOtro").val();
        params["MontoOtroDescripcion"] = $("#MontoOtroDescripcion").val();

        params["MontoSubtotal"] = this._global.reporte.objreporte.MontoSubtotal;
        params["MontoIVA"] = this._global.reporte.objreporte.MontoIVA;
        params["MontoTotal"] = this._global.reporte.objreporte.MontoTotal;

        params["Refacciones"] = JSON.stringify(this._global.refaccionesrecuperadas);
        /*
        params["MontoDespiece"] = this._global.reporte.objreporte.MontoDespiece;
        params["MontoSubtotal"] = this._global.reporte.objreporte.MontoSubtotal;
        params["MontoIVA"] = this._global.reporte.objreporte.MontoIVA;
        params["MontoTotal"] = this._global.reporte.objreporte.MontoTotal;
        */

        params["TipoReclamoDiagnostico"] = this._global.reporte.objreporte.TipoReclamoDiagnostico;

        params["AdjuntosReciclaje"] = this._global.AdjuntosReciclaje;
        try { params["AdjuntosReciclajeSize"] = Object(this._global.AdjuntosReciclaje).currentFiles.length; } catch (e) { params["AdjuntosReciclajeSize"] = 0; };

        console.log("los parametros---->", params);

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

                  swal({
                      title: 'Guardado',
                      text: 'Se han guardado correctamente los comprobantes para la orden de servicio #'+this._global.reporte.idreporte,
                      type: 'success',
                      showConfirmButton: true,
                      confirmButtonText: 'Ok',
                      customClass: 'swal2-overflow',
                  }).then((result) => {
                    ////Registro de notificación para HP
                    //this._global.notificaciones.modulo = "/registro-de-casos/reporte-de-caso-menaje";
                    //this._global.notificaciones.descripcion = "Se ha registrado un reporte de menaje con el No. de orden: " + this._global.reporte.idreporte;
                    //this._global.registrarNotificacion(this._global.reporte.idreporte);

                    this._router.navigate(['inicio']);
                  });

                  //Registro de notificación
                  this._global.notificaciones.modulo = "/resumen/orden/adjuntos-cambio-fisico";
                  this._global.notificaciones.descripcion = "Se han subido comprobantes de cambio físico para la orden No. " + this._global.reporte.idreporte;
                  this._global.registrarNotificacion(this._global.reporte.idreporte);


              } else if (data.res == 'error') {
                  swal('Error',data.msg,'error');
              }

          },
          error => console.log(error),
          () => console.log('termino submit')
          );
      } else {
          this._global.validateAllFormFields(this.adjuntosCambioFisicoForm);
      }

    }

    submitDistribuidorCambioFisico(){
      console.log("submit distribuidor cambio físico");
      console.log(this.distribuidorCambioFisicoForm.valid);

      if (this.distribuidorCambioFisicoForm.controls.CostoLanded.value>0) {
        this._global.clearMessages();

        var params = {};
        params = this.distribuidorCambioFisicoForm.getRawValue();
        params['IDReporte'] = this._global.reporte.idreporte;

        this._global.appstatus.loading = true;

        this._httpService.postJSON(params, 'resumen/registro-distribuidor-cambios-fisicos.php')
          .subscribe(
          data => {
            console.log('data');
            console.log(data);
            this._global.appstatus.loading = false;

            if (data.res == 'ok') {
              console.log("pre notificación");
              this._global.notificaciones.modulo = "/inicio/resumen/orden";
              this._global.notificaciones.descripcion = "Registro de fecha de entrega de cambio y costo landed por distribuidor para la orden No. " + this._global.reporte.idreporte;
              if(this._global.reporte.objreporte.StatusCostoLanded=='Rechazado'){
                this._global.notificaciones.descripcion = "Actualización de de fecha de entrega de cambio y costo landed por distribuidor para la orden No. " + this._global.reporte.idreporte;
              }

              this._global.registrarNotificacion(this._global.reporte.idreporte);

              this.distribuidorCambioFisicoForm.reset();

              //swal("Notificación Enviada","Se ha enviado una notificación al CDS y HP informando sobre el status de fecha de entrega del producto.", "success");
              swal({
                  title: 'Notificación Enviada',
                  text: 'Se ha enviado una notificación al CDS y HP informando sobre el status de fecha de entrega del producto.',
                  type: 'success',
                  showConfirmButton: true,
                  confirmButtonText: 'Ok',
                  customClass: 'swal2-overflow',
              }).then((result) => {
                  this._router.navigate(['inicio']);
              });

            } else if (data.res == 'error') {
                this._global.appstatus.mensaje = data.error;
            }
          },
          error => console.log(error),
          () => console.log('termino submit')
        );
      } else {
          this._global.validateAllFormFields(this.distribuidorCambioFisicoForm);
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

        this._httpService.postJSON(params, 'resumen/registro-resolucion.php')
          .subscribe(
          data => {
            console.log('data');
            console.log(data);
            this._global.appstatus.loading = false;

            if (data.res == 'ok') {
              console.log("pre notificación");
              /*
              this._global.notificaciones.modulo = "/inicio/resumen/orden";
              this._global.notificaciones.descripcion = "Registro de resolución para el reporte No. " + this._global.reporte.idreporte;
              this._global.registrarNotificacion(this._global.reporte.idreporte);
              */
              this.genericForm.reset();
              this.formulariostatus.success = 2;

              swal("Resolución registrada","Se ha registrado correctamente la resolución de la orden de servicio.", "success");

              this._router.navigate(['inicio']);
            } else if (data.res == 'error') {
                this._global.appstatus.mensaje = data.error;
            }
          },
          error => console.log(error),
          () => console.log('termino submit')
        );
      } else {
          this._global.validateAllFormFields(this.genericForm);
      }
    }

}
