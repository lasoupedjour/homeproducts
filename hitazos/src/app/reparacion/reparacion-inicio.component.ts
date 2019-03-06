import { Component } from '@angular/core';
import { HTTPService } from '../services/http.service';
import { GlobalService } from '../services/global.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { userValidators } from '../userValidators';
import swal from 'sweetalert2';

@Component({
    selector: 'reparacioninicio',
    templateUrl: './reparacion-inicio.component.html'
})
export class ReparacionInicioComponent {
    title = 'app';
    genericForm: FormGroup;
    cotizacionForm: FormGroup;
    private sub: any;

    status = {
        "TipoCaso" : "",
        "FechaCompra" : "",
        "garantiaValida": false,
        "mostrarDescripcion": false,
        "paso": 1,
        "agregaRefaccionValid": true,
        "cotizar": -1,
        "solicitar": -1,
        "habilitarOrden" : false

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

    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService, public route: ActivatedRoute) { }

    ngOnInit() {
        this._global.appstatus.mensaje = '';
        console.log('init registro');
        console.log(this._global.user);

        /*this.sub = this.route.params.subscribe(params => {
            this._global.cliente.id = params['id'];
        });*/
        console.log('cotizar');
        console.log(this.status.cotizar);

        console.log('reporte');
        console.log(this._global.reporte.objreporte);


        this.genericForm = this.formBuilder.group({
            /*usuario: ['', Validators.compose([
                Validators.required,
                Validators.email
            ])],*/
            CondicionProductoDiagnostico: [Object(this._global.reporte.objreporte).CondicionProductoDiagnostico,
            Validators.required
            ],
            NoSerie: [Object(this._global.reporte.objreporte).NoSerie],
            /*MotivoFallaDiagnostico: [Object(this._global.reporte.objreporte).MotivoFallaDiagnostico,
                Validators.required
            ],*/
            TipoReclamoDiagnostico: [Object(this._global.reporte.objreporte).TipoReclamoDiagnostico,
                Validators.required
            ],
            MotivoCambioDiagnostico: [Object(this._global.reporte.objreporte).MotivoCambioDiagnostico],
            ObservacionesCDSDiagnostico: [Object(this._global.reporte.objreporte).ObservacionesCDSDiagnostico,
                Validators.required
            ],
            RequiereRecoleccion: [this._global.reporte.objreporte.RequiereRecoleccion],
            RequiereRefacciones: [''],
            Refaccion: [''],
            NoParte: [''],
            CostoLanded: [this._global.reporte.objreporte.CostoLanded],
            OtroCostoDistribuidor: [''],
            IDCentro: 0


        });

        this.genericForm.controls.OtroCostoDistribuidor.setValue(this._global.reporte.objreporte.OtroCostoDistribuidor);

        this.cotizacionForm = this.formBuilder.group({
            /*usuario: ['', Validators.compose([
                Validators.required,
                Validators.email
            ])],*/

            Proveedor: ['',
                Validators.required
            ],
            Nota: [''],
            NombreRefaccion: ['',
                Validators.required
            ],
            Cantidad: ['',
                Validators.required
            ],
            CostoUnitario: ['',
                Validators.required
            ],
            FechaEntrega: ['',
                Validators.required
            ],



        });

        //this.llenaFallas();
        this.llenaRefacciones();

        this.precargaCentros();

        this._global.setRefaccionesBd();
        this._global.setRefaccionesRecuperadasBd();
        this.updateRequiereRefacciones();
        this._global.setAdjuntos();

        if (Object(this._global.reporte.objreporte) != null && Object(this._global.reporte.objreporte).AplicaGarantia == '') {
            this._router.navigate(['registro-de-casos/reporte-de-caso']);
        }




    }

    precargaCentros(){

        var params = {};

        params['Pais'] = Object(this._global.user).Pais;
        params['nivel'] = Object(this._global.user).nivel;
        params['IDMaster'] = Object(this._global.user).IDCentro;
        params['IDDistribuidor'] = Object(this._global.user).IDDistribuidor;
        params['Flujo'] = "MENAJE";

        this._global.appstatus.loading = true;

        /*console.log('Precarga distribuidores');
        console.log(params);*/

        this._httpService.postJSON(params, 'registro-de-casos/buscar-centros.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {

                    this._global.centros = this._global.parseJSON(data.centros);

                    console.log('centros');
                    console.log(this._global.centros);

                    if (data.centros.length == 0 && this._global.user.nivel=='administrador') {
                        this._global.appstatus.mensaje = 'No se encontraron datos con estas características.';
                    }else{
                      if(Object(this._global.reporte.objreporte).IDCentro!='')
                        this.genericForm.controls.IDCentro.setValue(Object(this._global.reporte.objreporte).IDCentro);
                      else
                        this.genericForm.controls.IDCentro.setValue("");
                    }

                } else if (data.res = 'error') {

                    this._global.appstatus.mensaje = data.error;

                }
            },
            error => alert(error),
            () => console.log('termino submit')
            );


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

    updateRequiereRefacciones() {

        if (this._global.refacciones[0]) {
            this.genericForm.controls.RequiereRefacciones.setValue(true);
            this.genericForm.controls.RequiereRefacciones.updateValueAndValidity();
        }

    }

    llenaFallas() {

        var params = {
            Subcategoria: Object(this._global.reporte.objreporte).Subcategoria
        };

        this._global.appstatus.loading = true;

        this._httpService.postJSON(params, 'buscar-fallas.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {
                    this._global.fallas = this._global.parseJSON(data.fallas);
                    console.log('fallas');
                    console.log(this._global.fallas);

                   /* this.genericForm.controls.MotivoFallaDiagnostico.setValue(Object(this._global.reporte.objreporte).MotivoFallaDiagnostico);
                    this.genericForm.controls.MotivoFallaDiagnostico.updateValueAndValidity();*/


                    if (data.fallas.length == 0) {
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
            error => alert(error),
            () => console.log('termino submit')
            );

    }



    randomBetween(arre) {
        var size = arre.length + 1;
        console.log('tamano');
        console.log(size);
        var rand = Math.floor(Math.random() * size);
        console.log(rand);
        return rand;
    }

    changeNoSerie(){
      var NoSerie = this.genericForm.controls.NoSerie.value;

      this._global.clearMessages();

      if(NoSerie!=""){
        this._global.appstatus.loading = true;

        var params = {};
        params["NoSerie"] = NoSerie;

        console.log(params);

        this._httpService.postJSON(params, 'reparacion/validar-noserie.php')
          .subscribe(
          data => {
            this._global.appstatus.loading = false;
              console.log('data Serie');
              console.log(data);
              if (data.res == 'error') {
                swal('', 'Ya existe una orden de servicio de este No. de Serie.', 'warning');
              }
          },
          error => alert(error),
          () => console.log('termino submit')
          );
      }
    }
    changeTipoReclamoDiagnostico() {

        var tiporeclamo = this.genericForm.controls.TipoReclamoDiagnostico.value;

        if (tiporeclamo == "Cambio") {

            this.genericForm.controls.MotivoCambioDiagnostico.setValidators([Validators.required]);
            this.genericForm.controls.MotivoCambioDiagnostico.setValue('');
            this.genericForm.controls.MotivoCambioDiagnostico.updateValueAndValidity();


            //vacia refacciones, dado que no son necesarias
            this._global.refacciones = [];

            this.genericForm.controls.RequiereRefacciones.setValue(false);
            this.genericForm.controls.RequiereRefacciones.updateValueAndValidity();


        } else {

            this.genericForm.controls.MotivoCambioDiagnostico.setValidators([]);
            this.genericForm.controls.MotivoCambioDiagnostico.setValue('');
            this.genericForm.controls.MotivoCambioDiagnostico.updateValueAndValidity();

        }


    }


    changeRefaccion() {
        console.log('change refaccion');

        /*var noparte = this.genericForm.controls.Refaccion.value;

        this.genericForm.controls.NoParte.setValue(noparte);
        this.genericForm.controls.NoParte.updateValueAndValidity();*/

    }
    agregarOtraRefaccion(){
      var OtraRefaccion = $("#OtraRefaccion").val();

      if (OtraRefaccion != '') {
          this.status.agregaRefaccionValid = true;

          this._global.resetRefaccion();

          var nombrerefaccion = "";

          /*
          this._global.refaccionesproductos.forEach(function (e) {
              if (e.NoParte == outer.genericForm.controls.OtraRefaccion.value)
                  nombrerefaccion = e.Nombre;
          });
          */

          this._global.refaccion.NombreRefaccion = 'Otro';
          this._global.refaccion.NoParte = String(OtraRefaccion);

          this._global.refacciones.push(this._global.refaccion);

          this.genericForm.controls.Refaccion.setValue('');
          this.genericForm.controls.NoParte.setValue('');

          this.habilitarOrdenServicio();

      }/*else if(this.genericForm.controls.Refaccion.value == 'Otro'){
        alert("Show input");
      }*/else {
          this.status.agregaRefaccionValid = false;
      }
    }

    agregarRefaccion() {
        console.log('agregar refaccion');

        if (this.genericForm.controls.Refaccion.value != '' && this.genericForm.controls.Refaccion.value!='Otro') {
            this.status.agregaRefaccionValid = true;


            this._global.resetRefaccion();

            var nombrerefaccion = "";

            var outer = this;

            this._global.refaccionesproductos.forEach(function (e) {
                if (e.NoParte == outer.genericForm.controls.Refaccion.value)
                    nombrerefaccion = e.Nombre;
            });

            this._global.refaccion.NombreRefaccion = nombrerefaccion;
            this._global.refaccion.NoParte = this.genericForm.controls.Refaccion.value;


            this._global.refacciones.push(this._global.refaccion);

            this.genericForm.controls.Refaccion.setValue('');
            this.genericForm.controls.NoParte.setValue('');

            this.habilitarOrdenServicio();

        }/*else if(this.genericForm.controls.Refaccion.value == 'Otro'){
          alert("Show input");
        }*/else {
            this.status.agregaRefaccionValid = false;
        }

        //this.habilitarOrdenServicio();
    }

    changeExistencia(id, val) {

        /*console.log(id);
        console.log(val);*/

        this._global.refacciones[id].Existencia = val;
        this._global.refacciones[id].CostoUnitario = '';
        this._global.refacciones[id].CostoTotal = '';
        this._global.refacciones[id].FechaEntrega = {};


        if (val == 'Disponible') {
            this._global.refacciones[id].StatusCotizacion = 'No Aplica';
            this._global.refacciones[id].Status = 'Seleccionada';
        } else if (val == 'No Disponible' || val == 'No Encontrada' ) {
            this._global.refacciones[id].Status = 'Por definir';
        }

        //this.habilitarOrdenServicio();

    }

    changeCosto(id, val) {
        /*console.log(id);
        console.log(val);*/

        this._global.refacciones[id].CostoUnitario = val;

        this.calculaCostoTotal(id);
    }

    changeCantidad(id, val) {

        console.log('change cantidad');

        this._global.refacciones[id].Cantidad = parseInt(val);

        this.calculaCostoTotal(id);

    }


    changeRequiereRefacciones() {
        this.habilitarOrdenServicio();
    }

    calculaCostoTotal(id) {

        if (this._global.refacciones[id].Cantidad > 0 && this._global.refacciones[id].CostoUnitario) {

            this._global.refacciones[id].CostoTotal = this._global.refacciones[id].Cantidad * this._global.refacciones[id].CostoUnitario;

        }

        console.log(this._global.refacciones[id].CostoTotal);

    }


    cotizar(id) {
        this.status.cotizar = id;

        console.log(this.status.cotizar);

        this.cotizacionForm.controls.NombreRefaccion.setValue(this._global.refacciones[id].NombreRefaccion);
        this.cotizacionForm.controls.NombreRefaccion.updateValueAndValidity();

        this.cotizacionForm.controls.Cantidad.setValue(this._global.refacciones[id].Cantidad);
        this.cotizacionForm.controls.NombreRefaccion.updateValueAndValidity();

    }

    solicitar(id) {
        this.status.solicitar = id;
        this._global.refacciones[id].StatusCotizacion = 'Solicitada';
        this._global.refacciones[id].Status = 'Por enviar';

        swal("¡Envía a HP!", "Guarda tus cambios para enviar notificación a HP", "info");

    }

    regresarAReporte() {
        this.status.cotizar = -1;
        this.status.solicitar = -1;
    }

    eliminarRefaccion(id) {

        this._global.refacciones.splice(id, 1);
        this.habilitarOrdenServicio();
        //console.log(this._global.refacciones);

    }

    habilitarOrdenServicio() {

        var habilitar = true;

        for (var i = 0; i < this._global.refacciones.length; i++) {
            if (this._global.refacciones[i].Status != 'Seleccionada' && this._global.refacciones[i].Status != 'Aprobada') {
              habilitar = false;
            }
        }

        if (!this.validaRefacciones())
            habilitar = false;


        if (!this.validaPropiedadesRefacciones())
            habilitar = false;

        if((this._global.reporte.objreporte.Categoria!="MENAJE" || this._global.reporte.objreporte.Modelo=='OS-17001' || this._global.reporte.objreporte.Modelo=='OS-17001-1') && this._global.user.nivel=='administrador' && this.genericForm.controls.RequiereRecoleccion.value!=0)
          habilitar = false;

        if((this._global.reporte.objreporte.Categoria=="MENAJE" && this._global.reporte.objreporte.Modelo!='OS-17001' && this._global.reporte.objreporte.Modelo!='OS-17001-1') && this._global.user.nivel=='administrador' && this.genericForm.controls.RequiereRecoleccion.value!=0)
          habilitar = false;


        this.status.habilitarOrden = habilitar;

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
        this._global.refacciones.forEach(function (e) {
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

    submitRegistro() {
        console.log('submit prevalidation');
        console.log(this.genericForm.controls.RequiereRefacciones.value);
        console.log("formulario válido...", this.genericForm.valid);
        if (this.genericForm.valid) {
            //el formulario es válido

            if (this.validaRefacciones()) {
                //existen refacciones

                if (this.validaPropiedadesRefacciones()) {


                    console.log('submit registro');
                    this._global.clearMessages();
                    this._global.appstatus.loading = true;

                    var params = {};
                    params = this.genericForm.getRawValue();
                    params["IDReporte"] = this._global.reporte.idreporte;
                    params["IDUsuario"] = this._global.user.id;
                    params["IDCliente"] = this._global.cliente.id;
                    params["TipoReclamoDiagnostico"] = this.genericForm.controls.TipoReclamoDiagnostico.value;

                    if(this.genericForm.controls.IDCentro.value!='' && this.genericForm.controls.IDCentro.value!=0)
                      params["IDCentro"] = this.genericForm.controls.IDCentro.value;
                    else{
                      if(this._global.reporte.objreporte.IDCentro!='0' && this._global.reporte.objreporte.IDCentro!='')
                        params["IDCentro"] = this._global.reporte.objreporte.IDCentro;
                      else
                        params["IDCentro"] = this._global.user.IDCentro;
                    }

                    this._global.setRefaccionesEnRevision();
                    params["Refacciones"] = JSON.stringify(this._global.refacciones);
                    params["RequiereRecoleccion"] = this.genericForm.controls.RequiereRecoleccion.value;

                    console.log("Reparación", params);

                    this._httpService.postJSON(params, 'reparacion/registro-reparacion.php')
                        .subscribe(
                        data => {
                            console.log('data');
                            console.log(data);
                            this._global.appstatus.loading = false;

                            if (data.res == 'ok') {

                                this._global.guardarIdReporte(data.idreporte);
                                this._global.guardarObjReporte(data.objreporte);

                                swal('¡Bien!', 'Se han guardado exitosamente los datos de la reparación.', 'success');
                                //this._global.toast("ok", "");
                                //NOTIFICACION DE CAMBIO FISICO if(this.genericForm.controls.TipoReclamoDiagnostico.value=="Cambio"){//Si se trata de un cambnio físico se registra la notificación
                                //   //Registro de notificación
                                //   this._global.notificaciones.modulo = "/cambio-fisico";
                                //   this._global.notificaciones.descripcion = "Se ha registrado una solicitud de cambio físico para el reporte No. " + this._global.reporte.idreporte;
                                //   this._global.registrarNotificacion(this._global.reporte.idreporte);
                                // }

                                //Alertas
                                //Validamos si es una reparación

                                if(this.genericForm.controls.TipoReclamoDiagnostico.value=='Reparación'){
                                     this._global.notificaciones.modulo = "/registro-caso-menaje-reparacion";
                                     this._global.notificaciones.descripcion = "Se ha autorizado reparación de caso " + this._global.reporte.idreporte;
                                     this._global.registrarNotificacion(this._global.reporte.idreporte);

                                     this._global.notificaciones.modulo = "/registro-caso-menaje-reparacion-a-centro";
                                     this._global.notificaciones.descripcion = "Se ha registrado y asignado a su Cds un caso para el reporte No. " + this._global.reporte.idreporte;
                                     this._global.registrarNotificacion(this._global.reporte.idreporte, this.genericForm.controls.IDCentro.value);
                                }else if(this.genericForm.controls.TipoReclamoDiagnostico.value=='Instrucciones de uso'){
                                    this._global.notificaciones.modulo = "/registro-caso-menaje-instrucciones-de-uso";
                                    this._global.notificaciones.descripcion = "Se ha determinado que el caso "  + this._global.reporte.idreporte + " se resuelve con instrucciones de uso";
                                    this._global.registrarNotificacion(this._global.reporte.idreporte);
                                }else if(this.genericForm.controls.TipoReclamoDiagnostico.value=='No aplica garantía'){
                                    this._global.notificaciones.modulo = "/registro-caso-menaje-no-aplica-garantia";
                                    this._global.notificaciones.descripcion = "Se ha determinado que no aplica garantía del caso " + this._global.reporte.idreporte;
                                    this._global.registrarNotificacion(this._global.reporte.idreporte);
                                }else{//Cambio físico
                                  /*
                                    this._global.cambioStatusCambioFisico(this._global.reporte.idreporte, "Aprobado");
                                    //Registro de notificación
                                    this._global.notificaciones.modulo = "/cambio-estatus-cambio-fisico";
                                    this._global.notificaciones.descripcion = "El cambio físico del reporte No. " + this._global.reporte.idreporte + " ha sido Aprobado";
                                    this._global.registrarNotificacion(this._global.reporte.idreporte);
                                    */
                                }

                                this.habilitarOrdenServicio();

                            } else if (data.res == 'error') {

                                this._global.toast("notok", data.msg);


                            }



                        },
                        error => alert(error),
                        () => console.log('termino submit')
                        );


                } else {
                    swal('¡Oops!', 'Selecciona los detalles de tus refacciones antes de continuar. Ej. Existencia, cantidad, costo, solicitar a HP o cotizar.', 'error');

                    //this._global.toast("notok", "Selecciona los detalles de tus refacciones antes de continuar. Ej. Existencia, cantidad, costo.");
                }
            } else {
                swal('¡Oops!', 'Has indicado refacciones requeridas... por favor agrega refacciones antes de continuar.', 'error');

                //this._global.toast("notok", "Has indicado refacciones requeridas... por favor agrega refacciones antes de continuar.");

            }

        } else {
            this._global.validateAllFormFields(this.genericForm);
        }
    }



    submitCotizacion() {
        console.log('submit prevalidation cotizacion');

        if (this.cotizacionForm.valid) {

            console.log('submit registro');
            console.log(this.status.cotizar);
            var scot = this.status.cotizar;
            this._global.clearMessages();

            console.log(this.cotizacionForm.getRawValue());

            var params = {};
            params = this.cotizacionForm.getRawValue();

            this._global.refacciones[this.status.cotizar].Proveedor = this.cotizacionForm.controls.Proveedor.value;
            this._global.refacciones[this.status.cotizar].Cantidad = this.cotizacionForm.controls.Cantidad.value;
            this._global.refacciones[this.status.cotizar].CostoUnitario = this.cotizacionForm.controls.CostoUnitario.value;
            this._global.refacciones[this.status.cotizar].FechaEntrega = this.cotizacionForm.controls.FechaEntrega.value;
            this._global.refacciones[this.status.cotizar].StatusCotizacion = 'Cotizada';
            this._global.refacciones[this.status.cotizar].Status = 'Por enviar';



            this.calculaCostoTotal(this.status.cotizar);

            console.log(this._global.refacciones[this.status.cotizar]);

            /*******************/
            var params = {};
            params["IDReporte"] = this._global.reporte.idreporte;
            params["IDUsuario"] = this._global.user.id;
            params["IDCliente"] = this._global.cliente.id;

            params["AdjuntosNotaP"] = this._global.AdjuntosNota;

            console.log(params);

            this._httpService.postFormDataCotizaciones(params, 'reparacion/sube-nota.php')
                .subscribe(
                data => {
                    console.log('data subiendo');
                    console.log(data);
                    this._global.appstatus.loading = false;

                    if (data.res == 'ok') {
                        console.log(scot);
                        this._global.refacciones[scot].Nota = data.nombrenota;

                        this._global.notificaciones.modulo = "/registro-de-casos/reparacion/inicio";
                        this._global.notificaciones.descripcion = "Registro de cotización de refacción para el reporte No. " + this._global.reporte.idreporte;
                        this._global.registrarNotificacion(this._global.reporte.idreporte);

                    } else if (data.res == 'error') {

                        this._global.toast("notok", data.msg);

                    }

                },
                error => alert(error),
                () => console.log('termino submit')
                );

            /********************/



            //this._global.toast("ok", "Se ha agregado exitosamente tu cotización a la refacción seleccionada. Se enviará a HP en cuanto des click en 'Guardar cambios'.");
            swal("¡Envía a HP!", "Guarda tus cambios para enviar notificación a HP", "info");
            //this._router.navigate['#formulariocotizacion'];

            this.cotizacionForm.reset();
            this.regresarAReporte();
            this.habilitarOrdenServicio();

        } else {
            this._global.validateAllFormFields(this.cotizacionForm);
        }
    }


    onActionNota(event: any) {
        console.log(event);
        this._global.AdjuntosNota = event;
    }



}
