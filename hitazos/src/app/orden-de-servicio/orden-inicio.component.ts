import { Component } from '@angular/core';
import { HTTPService } from '../services/http.service';
import { GlobalService } from '../services/global.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { userValidators } from '../userValidators';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


import { Ng2FileInputModule } from 'ng2-file-input';
import swal from 'sweetalert2';

@Component({
    selector: 'ordeninicio',
    templateUrl: './orden-inicio.component.html'
})
export class OrdenInicioComponent {
    title = 'app';
    genericForm: FormGroup;

    private sub: any;

    modelfechafactura: NgbDateStruct;

    RazonSocialDistribuidor: string;

    MontoRefacciones = 0;
    MontoSubtotal = 0;
    MontoIVA = 0;
    MontoTotal = 0;
    IVA = 0.15;
    TarifaMensual = 0;
    ImpuestoTarifaMensual = 0;
    NecesitaAutorizacionRO = true;
    AtencionNoRequerida = false;
    maxDate: Date;
    maxDateObj: Object;

    FacturasNotasCompraLenght: 0;
    FacturasRepuestosLenght: 0;
    FotosModeloSerieLenght: 0;

    adjuntosValidos;

    SubtipoServicio: '';

    status = {
        "TipoCaso" : "",
        "FechaFactura": {},
        "garantiaValida": false,
        "mostrarDescripcion": false,
        "paso": 1,
        "agregaRefaccionValid": true,
        "cotizar": -1,
        "solicitar": -1,
        "habilitarOrden": false,
        "update" : false

    }

    formulariostatus = {
        "mostrarDatosCompra": false,
        "registroCompra": false,
        "success": 1,
        "idparticipante": "",
        "codigo": "",
        "tiempo": "",
        "id_llamada": "",
        "tipo":"",
        "datosparticipante": {},
        "preguntas": {},
        "preguntasSeleccionadas": [],
        "respuestas": []
    };


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
        "NecesitaAutorizacion": 0,
        "NecesitaAutorizacionRO": false,
    };



    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService, public route: ActivatedRoute) { }

    ngOnInit() {
        console.log('init registro');
        console.log(this._global.user);

        /*this.sub = this.route.params.subscribe(params => {
            this._global.cliente.id = params['id'];
        });*/
        console.log('cotizar');
        console.log(this.status.cotizar);

        console.log('reporte');
        console.log(this._global.reporte.objreporte);

        console.log('cliente');
        console.log(this._global.cliente);


        this.genericForm = this.formBuilder.group({
            /*usuario: ['', Validators.compose([
                Validators.required,
                Validators.email
            ])],*/

            /*
            HomeProductsGroupNo: [Object(this._global.reporte.objreporte).HomeProductsGroupNo,
                Validators.required
            ],*/

            NoFactura: [Object(this._global.reporte.objreporte).NoFactura,
                Validators.required
            ],
            FechaFactura: ['',
                Validators.required
            ],
            NoParteCausoDano: [Object(this._global.reporte.objreporte).NoParteCausoDano,
                Validators.required
            ],
            Resolucion: [Object(this._global.reporte.objreporte).Resolucion,
                Validators.required
            ],

            TipoReparacion: [Object(this._global.reporte.objreporte).TipoReparacion
            ],

            MontoDespiece: [0,
            Validators.required
            ],
            MontoReciclaje: [0],
            MontoOtro: [0],
            MontoOtroDescripcion: [''],
            MontoRefacciones: [0,
            Validators.required
            ],
            MontoReparacion: [0],
            MontoMovilizacion: [0],
            MontoSubtotal: [0,
                Validators.required
            ],
            MontoIVA: [0,
                Validators.required
            ],
            MontoTotal: [0,
                Validators.required
            ],
            FacturasNotasCompra: [''],
            FacturasRepuestos: [''],
            Fotos: [''],
            Otros: ['']


        });


        this.precarga();
        this.llenaRefacciones();
        this.llenaTipoReparacion();
        this._global.setRefaccionesBd();
        this.getDistribuidor();
        this.calculaValorRefacciones();


        this.maxDate = new Date();
        this.maxDateObj = {
            year: this.maxDate.getFullYear(),
            month: this.maxDate.getMonth() + 1,
            day: this.maxDate.getDate()
        };

        //alert(this.id_reporte);
        this.obtenerSubtipoServicio();

        console.log("UsewrObj", this._global.user);

        this.MontoSubtotal = parseFloat(this._global.reporte.objreporte.MontoSubtotal);
        this.MontoIVA = parseFloat(this._global.reporte.objreporte.MontoIVA);
        this.MontoTotal = parseFloat(this._global.reporte.objreporte.MontoTotal);


        if(this._global.reporte.objreporte.AdjuntosFacturasNotasCompra!=""){
            try { this._global.AdjuntosFacturasNotasCompraArre = JSON.parse(Object(this._global.reporte.objreporte).AdjuntosFacturasNotasCompra); } catch (e) { };
        }else{
            this._global.AdjuntosFacturasNotasCompraArre = [];
        }

        if(this._global.reporte.objreporte.AdjuntosFacturasRepuestos!=""){
            try { this._global.AdjuntosFotosModeloSerieArre = JSON.parse(Object(this._global.reporte.objreporte).AdjuntosFotosModeloSerie); } catch (e) { };
        }else{
            this._global.AdjuntosFotosModeloSerieArre = [];
        }

        if(this._global.reporte.objreporte.AdjuntosFotosModeloSerie!=""){
            try { this._global.AdjuntosFacturasRepuestosArre = JSON.parse(Object(this._global.reporte.objreporte).AdjuntosFacturasRepuestos); } catch (e) { };
        }else{
            this._global.AdjuntosFacturasRepuestosArre = [];
        }

        if(this._global.reporte.objreporte.AdjuntosOtros!=""){
            try { this._global.AdjuntosOtrosArre = JSON.parse(Object(this._global.reporte.objreporte).AdjuntosOtros); } catch (e) { };
        }else{
            this._global.AdjuntosOtrosArre = [];
        }
     }

     obtenerSubtipoServicio(){
       var params = {};

       params['id'] = this._global.reporte.objreporte.IDTarifas;
       console.log('obtener subtipo servicio');
       console.log(params);
       this._httpService.postJSON(params, 'inicio/get-tipomovilidad.php')
           .subscribe(
           data => {

             if (data.SubtipoServicio != '') {

               this.SubtipoServicio = data.SubtipoServicio;

             }else{
                 //this._global.appstatus.mensaje = "No se encontró la tarifa.";
             }


               //console.log("fichas");
               //console.log(this.props.fichas);
           },
           error => console.log(error),
           () => console.log('termino submit')
           );
     }

    precarga() {

        console.log('precargando');

        if (this.genericForm.controls.NoParteCausoDano.value == 0) {
            this.genericForm.controls.NoParteCausoDano.setValue('');
            this.genericForm.controls.NoParteCausoDano.updateValueAndValidity();
        }

        if (Object(this._global.reporte.objreporte).FechaFactura != "0000-00-00 00:00:00" && Object(this._global.reporte.objreporte).FechaFactura != "") {

            this.status.update = true;

            //console.log(Object(this._global.reporte.objreporte).FechaFactura);
            var fecha = Object(this._global.reporte.objreporte).FechaFactura;
            fecha = fecha.replace(' 00:00:00', '');
            fecha = fecha.split('-');
            //console.log(fecha);
            const now = new Date();

            var fechatemp = {
                day: parseInt(fecha[2]),
                month: parseInt(fecha[1]),
                year: parseInt(fecha[0])
            };

            this.modelfechafactura = { year: fechatemp.year, month: fechatemp.month, day: fechatemp.day };
            /*Object(this.status.FechaCompra).year = fechatemp.year;
            Object(this.status.FechaCompra).month = fechatemp.month;
            Object(this.status.FechaCompra).day = fechatemp.day;
            console.log('obj fecha compra');
            console.log(this.status.FechaCompra);*/
            this.status.FechaFactura = { year: fechatemp.year, month: fechatemp.month, day: fechatemp.day };
            console.log('obj fecha factura');
            console.log(this.status.FechaFactura);
        }
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

    llenaRefacciones() {

        var params = {
            Subcategoria: Object(this._global.reporte.objreporte).Subcategoria,
            Modelo: Object(this._global.reporte.objreporte).Modelo
        };

        this._global.appstatus.loading = true;

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
            error => console.log(error),
            () => console.log('termino submit')
            );

    }

    llenaTipoReparacion() {

        var params = {
            "Modelo": Object(this._global.reporte.objreporte).Modelo,
            "IDGrupoTarifa": Object(this._global.user).IDGrupoTarifa,
        };

        this._global.appstatus.loading = true;

        this._httpService.postJSON(params, 'buscar-tarifas.php')
            .subscribe(
            data => {
                console.log('data tarifas...');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {

                    this._global.tarifas = this._global.parseJSON(data.tarifas);
                    console.log('tarifas');
                    console.log(this._global.tarifas);

                    /*this.genericForm.controls.MotivoFallaDiagnostico.setValue(Object(this._global.reporte.objreporte).MotivoFallaDiagnostico);
                    this.genericForm.controls.MotivoFallaDiagnostico.updateValueAndValidity();
                    */

                    if (data.tarifas.length == 0) {
                        //this._global.appstatus.mensaje = 'No se encontraron datos con estas características.';
                    }

                } else if (data.res = 'error') {
                    this._global.appstatus.mensaje = data.error;
                }
            },
            error => console.log(error),
            () => console.log('termino submit')
            );

            if(parseFloat(this._global.reporte.objreporte.MontoReparacion)>0)
              this.tiporeparacion.Valor = parseFloat(this._global.reporte.objreporte.MontoReparacion);

    }

    calculaValorRefacciones() {
      console.log("las refacciones->", this._global.refacciones);
        var refacciones = this._global.refacciones;
        var montorefacciones = 0;
        refacciones.forEach(function (e) {
            montorefacciones += e.CostoTotal;
        });

        this.MontoRefacciones = montorefacciones;
        this.MontoSubtotal = montorefacciones + parseFloat(this._global.reporte.objreporte.MontoMovilizacion);
        this.MontoIVA = this.IVA * this.MontoSubtotal;
        this.MontoTotal = this.MontoSubtotal + this.MontoIVA;
        //alert(this.MontoSubtotal + this.MontoIVA);
    }

    changeTipoReparacion() {

        console.log("change tipo reparación");
        var idtipo = this.genericForm.controls.TipoReparacion.value;
        console.log(idtipo);
        console.log(this._global.tarifas);

        for (var i = 0; i < this._global.tarifas.length; i++) {
            if (this._global.tarifas[i].id == idtipo) {
                this.tiporeparacion = this._global.tarifas[i];
            }
        }
        if(idtipo=='No requerido'){
          this.AtencionNoRequerida = true;
          this.tiporeparacion.Valor = 0;
        }else if(idtipo==''){
          this.AtencionNoRequerida = false;
        }

        console.log(this.tiporeparacion.Valor);

        this.calculaCostoTotal(true);

    }

    changeMontoOtro(){

      if(this.genericForm.controls.MontoOtro.value != ''){
        this.genericForm.controls.MontoOtroDescripcion.setValidators([Validators.required]);
        this.genericForm.controls.MontoOtroDescripcion.updateValueAndValidity();
      }else{
        this.genericForm.controls.MontoOtroDescripcion.setValidators([]);
        this.genericForm.controls.MontoOtroDescripcion.updateValueAndValidity();
      }
      this.calculaCostoTotal();
    }

    changeMontoReciclaje(){
      this.calculaCostoTotal();
    }
    changeMontoDespiece(){
      this.calculaCostoTotal();
    }

    calculaCostoTotal(CahngeTipoRevision = null){
      console.log('calculando monto total');
      console.log(this.genericForm.controls.MontoReciclaje.value);
      //suma refacciones
      this.MontoSubtotal = parseFloat(String(this.MontoRefacciones)) + parseFloat(String(this.tiporeparacion.Valor)) + parseFloat(this._global.reporte.objreporte.MontoMovilizacion);

      if(CahngeTipoRevision){
        if(this._global.reporte.objreporte.TipoReclamoDiagnostico == 'Cambio'){
          this._global.reporte.objreporte.MontoDespiece = String(0.5 * parseFloat(String(this.tiporeparacion.Valor)));
        }
      }else{
        this._global.reporte.objreporte.MontoDespiece = this.genericForm.controls.MontoDespiece.value;
      }
      /*
      if(parseFloat(this.genericForm.controls.MontoDespiece.value)>0 && (this.genericForm.controls.MontoDespiece.value==this._global.reporte.objreporte.MontoDespiece)){
        this._global.reporte.objreporte.MontoDespiece = this.genericForm.controls.MontoDespiece.value;
      }else{
        //suma Cambio físicos
        //if(this._global.reporte.objreporte.TipoReclamoDiagnostico == 'Cambio'){
          this._global.reporte.objreporte.MontoDespiece = String(0.5 * parseFloat(String(this.tiporeparacion.Valor)));
        //}
      }
      */
      this.MontoSubtotal = this.MontoSubtotal + parseFloat(this._global.reporte.objreporte.MontoDespiece);

      //suma Reciclaje y otro CostoTotal

      if(this.genericForm.controls.MontoReciclaje.value != null && this.genericForm.controls.MontoReciclaje.value != '')
        this.MontoSubtotal = parseFloat(String(this.MontoSubtotal)) + parseFloat(String(this.genericForm.controls.MontoReciclaje.value));
      if(this.genericForm.controls.MontoOtro.value != null && this.genericForm.controls.MontoOtro.value != '')
        this.MontoSubtotal = parseFloat(String(this.MontoSubtotal)) + parseFloat(String(this.genericForm.controls.MontoOtro.value));

      //alert(this.tiporeparacion.Impuesto);
      if(String(this.tiporeparacion.Impuesto)=='0')
        this.MontoIVA = 0;
      else
        this.MontoIVA = parseFloat(String(this.tiporeparacion.Impuesto)) * parseFloat(String(this.MontoSubtotal));

      this.MontoTotal = parseFloat(String(this.MontoSubtotal)) + parseFloat(String(this.MontoIVA));
      if(this.tiporeparacion.NecesitaAutorizacion==0)
          this.tiporeparacion.NecesitaAutorizacionRO = true;
    }

    onActionFacturasNotasCompra(event: any) {
        console.log(event);
        this._global.AdjuntosFacturasNotasCompra = event;
    }
    onActionFotosModeloSerie(event: any) {
        console.log(event);
        this._global.AdjuntosFotosModeloSerie = event;
    }
    onActionFacturasRepuestos(event: any) {
        console.log(event);
        this._global.AdjuntosFacturasRepuestos = event;
    }
    onActionOtros(event: any) {
        console.log(event);
        this._global.AdjuntosOtros = event;
    }

    /*submitRegistro2() {
        console.log('submit prevalidation');

        if (this.genericForm.valid) {

            console.log('submit registro');

            this._global.clearMessages();
            this._global.appstatus.loading = true;

            var params = {};
            params = this.genericForm.getRawValue();
            params["IDReporte"] = this._global.reporte.idreporte;
            params["IDUsuario"] = this._global.user.id;
            params["IDCliente"] = this._global.cliente.id;

            console.log(params);

            this._httpService.postJSON(params, 'orden-de-servicio/registro-orden.php')
                .subscribe(
                data => {
                    console.log('data');
                    console.log(data);
                    this._global.appstatus.loading = false;

                    if (data.res == 'ok') {

                        this._global.guardarIdReporte(data.idreporte);
                        this._global.guardarObjReporte(data.objreporte);

                        this.status.paso = 2;
                        this._global.appstatus.loading = false;

                        /*this._global.toast("ok", "Se han guardado exitosamente los datos de la reparación.");
                        this.habilitarOrdenServicio();*/
    /*

                    } else if (data.res == 'error') {

                        this._global.toast("notok", data.msg);

                    }



                },
                error => alert(error),
                () => console.log('termino submit')
                );


        } else {
            this._global.validateAllFormFields(this.genericForm);
        }
    }*/
    validarAdjuntos(){
      try { this.FacturasNotasCompraLenght = Object(this._global.AdjuntosFacturasNotasCompra).currentFiles.length; } catch (e) { this.FacturasNotasCompraLenght = 0; }
      //try { this.FacturasRepuestosLenght = Object(this._global.AdjuntosFotosModeloSerie).currentFiles.length; } catch (e) { this.FacturasRepuestosLenght = 0; }
      try { this.FotosModeloSerieLenght = Object(this._global.AdjuntosFotosModeloSerie).currentFiles.length; } catch (e) { this.FotosModeloSerieLenght = 0; }

      this.adjuntosValidos = false;

      if(this.FacturasNotasCompraLenght>0 && this.FotosModeloSerieLenght>0){
        this.adjuntosValidos = true;
      }

      //alert(this.adjuntosValidos);
    }




    submitRegistro() {
        console.log('submit prevalidation submitRegistro()');
        this._global.notificaciones.descripcion = "Se ha registrado una solicitud de cambio físico para la orden No. " + this._global.reporte.idreporte;
        var mensaje = "";
        if(this._global.reporte.objreporte.StatusCambioFisico!='Rechazado'){
          mensaje = "Se ha generado exitosamente la nueva orden de servicio";
          this.validarAdjuntos();
        }else{
          mensaje = "Se ha actualizado exitosamente la nueva orden de servicio";
          this.adjuntosValidos = true;
          this._global.notificaciones.descripcion = "Se han actualizado los costos de una solicitud de cambio físico para la orden No. " + this._global.reporte.idreporte;
        }

        if (this.genericForm.valid && this.adjuntosValidos) {

            this._global.clearMessages();
            this._global.appstatus.loading = true;

            var params = {};
            params = this.genericForm.getRawValue();
            params["IDReporte"] = this._global.reporte.idreporte;
            params["IDUsuario"] = this._global.user.id;
            params["IDCliente"] = this._global.cliente.id;
            params["TipoReclamoDiagnostico"] = this._global.reporte.objreporte.TipoReclamoDiagnostico;

            params["AdjuntosFacturasNotasCompra"] = this._global.AdjuntosFacturasNotasCompra;
            try { params["AdjuntosFacturasNotasCompraSize"] = Object(this._global.AdjuntosFacturasNotasCompra).currentFiles.length; } catch (e) { params["AdjuntosFacturasNotasCompraSize"] = 0; };

            params["AdjuntosFotosModeloSerie"] = this._global.AdjuntosFotosModeloSerie;
            try { params["AdjuntosFotosModeloSerieSize"] = Object(this._global.AdjuntosFotosModeloSerie).currentFiles.length; } catch (e) { params["AdjuntosFotosModeloSerieSize"] = 0; };

            params["AdjuntosFacturasRepuestos"] = this._global.AdjuntosFacturasRepuestos;
            try { params["AdjuntosFacturasRepuestosSize"] = Object(this._global.AdjuntosFacturasRepuestos).currentFiles.length; } catch (e) { params["AdjuntosFacturasRepuestosSize"] = 0; };

            params["AdjuntosOtros"] = this._global.AdjuntosOtros;
            try { params["AdjuntosOtrosSize"] = Object(this._global.AdjuntosOtros).currentFiles.length; } catch (e) { params["AdjuntosOtrosSize"] = 0; };
            params["Update"] = false;

            if(this._global.reporte.objreporte.StatusCambioFisico=='Rechazado')
              params["Update"] = true;

            console.log(params);

            this._httpService.postFormData(params, 'orden-de-servicio/registro-orden2.php')
                .subscribe(
              data => {
                  console.log('data subiendo');
                  console.log(data);
                  this._global.appstatus.loading = false;

                  if (data.res == 'ok') {

                      this._global.guardarIdReporte(data.idreporte);
                      this._global.guardarObjReporte(data.objreporte);

                      this._global.appstatus.loading = false;

                      if(this._global.reporte.objreporte.StatusCambioFisico=='Rechazado'){
                        this._global.toast('ok', mensaje, 'inicio/resumen/orden', true);
                      }else{
                        this._global.toast('ok', mensaje, 'inicio/resumen/orden', true);
                      }



                      if(this._global.reporte.objreporte.TipoReclamoDiagnostico=="Cambio"){//Si se trata de un cambnio físico se registra la notificación
                        //Registro de notificación
                        this._global.notificaciones.modulo = "/cambio-fisico";

                        this._global.registrarNotificacion(this._global.reporte.idreporte);
                      }


                      /*this._global.toast("ok", "Se han guardado exitosamente los datos de la reparación.");
                      this.habilitarOrdenServicio();*/


                  } else if (data.res == 'error') {

                      this._global.toast("notok", data.msg);

                  }

              },
              error => console.log(error),
              () => console.log('termino submit')
              );

        } else {
            this._global.validateAllFormFields(this.genericForm);
        }


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







}
