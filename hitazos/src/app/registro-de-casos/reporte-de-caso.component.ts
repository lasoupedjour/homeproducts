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
    selector: 'reportecaso',
    templateUrl: './reporte-de-caso.component.html'
})
export class ReporteCasoComponent {
    title = 'app';
    genericForm: FormGroup;
    cotizacionForm: FormGroup;
    private sub: any;

    modelfechacompra: NgbDateStruct;
    modelfecharevision: NgbDateStruct;

    FacturasNotasCompraLenght: 0;
    FotosModeloSerieLenght: 0;

    adjuntosValidos;

    maxDate: Date;
    maxDateObj: Object;
    minDate: Date;
    minDateObj: Object;

    status = {
        "TipoCaso" : "",
        "FechaCompra": {},
        "garantiaValida": false,
        "mostrarDescripcion": false,
        "paso": 1,
        "agregaRefaccionValid": true,
        "cotizar": -1,
        "solicitar": -1,
        "update": false

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
        "respuestas": [],
        "necesitaAutorizacion": 0,
        "habilitaDomicilio" : false
    };

    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService, public route: ActivatedRoute) { }

    ngOnInit() {

        //console.log("Tipo cliente", this._global.cliente.objeto.TipoPersona);
        console.log('init registro');
        console.log(this._global.user);

        /*this.sub = this.route.params.subscribe(params => {
            this._global.cliente.id = params['id'];
        });*/
        console.log('cotizar');
        console.log(this.status.cotizar);

        this._global.appstatus.mensaje = '';

        this.genericForm = this.formBuilder.group({
            /*usuario: ['', Validators.compose([
                Validators.required,
                Validators.email
            ])],*/

            TipoCaso: [Object(this._global.reporte.objreporte).TipoCaso,
                Validators.required
            ],
            Categoria: [Object(this._global.reporte.objreporte).Categoria,
                Validators.required
            ],
            Subcategoria: [Object(this._global.reporte.objreporte).Subcategoria,
            Validators.required
            ],
            Tipo: [Object(this._global.reporte.objreporte).Tipo,
                Validators.required
            ],
            Modelo: [Object(this._global.reporte.objreporte).Modelo,
                Validators.required
            ],
            CodigoSAP: [''],
            FechaCompra: ['',
                Validators.required
            ],
            Sello: [''],
            AplicaGarantia: ['',
                Validators.required
            ],
            Condicion: [''],
            TipoReclamo: [''],
            Uso: [Object(this._global.reporte.objreporte).Uso,
                Validators.required
            ],
            Distribuidor: ['',
            Validators.required
            ],
            LugarCompra: [Object(this._global.reporte.objreporte).LugarCompra,
                Validators.required
            ],
            Falla: [Object(this._global.reporte.objreporte).Falla],
            FallaDescripcion: [Object(this._global.reporte.objreporte).FallaDescripcion],
            Comentarios: [Object(this._global.reporte.objreporte).Comentarios],
            TipoKilometraje: '',
            Kilometraje: '',
            CostoKilometraje: 0,
            TipoRevision: [Object(this._global.reporte.objreporte).TipoRevision],
            TipoCentro: [''],
            FechaRevision: [''],
            Descripcion: [Object(this._global.reporte.objreporte).Descripcion],
            Refaccion: [''],
            NoParte: [''],
            IDCentro: 0,
            NoSerie: [this._global.reporte.objreporte.NoSerie],
            CondicionProductoDiagnostico: [this._global.reporte.objreporte.CondicionProductoDiagnostico],
            CostoLanded: [this._global.reporte.objreporte.CostoLanded],
            OtroCostoDistribuidor: [''],
            FacturasNotasCompra: [''],
            FotosModeloSerie: [''],


        });

        /*
        NoSerie: [this._global.reporte.objreporte.NoSerie, Validators.required],
        CondicionProductoDiagnostico: [this._global.reporte.objreporte.CondicionProductoDiagnostico, Validators.required],
        CostoLanded: [this._global.reporte.objreporte.CostoLanded, Validators.required],
        OtroCostoDistribuidor: [''],
        FacturasNotasCompra: [''],
        FotosModeloSerie: [''],
        */
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

        console.log('tipo caso');
        console.log(Object(this._global.reporte.objreporte).TipoCaso);



        if (this.genericForm.controls.TipoCaso.value != null && this.genericForm.controls.TipoCaso.value != '') {
            this.changeTipoCaso();
            this.status.update = true;
        }

        this.precargaProducto();

        this.maxDate = new Date();
        this.maxDateObj = {
            year: this.maxDate.getFullYear(),
            month: this.maxDate.getMonth() + 1,
            day: this.maxDate.getDate()
        };

        this.minDate = new Date();
        this.minDateObj = {
            year: this.minDate.getFullYear(),
            month: this.minDate.getMonth() + 1,
            day: this.minDate.getDate()
        };

        /*precarga tarifas movilización*/
        //this.precargaTarifasMovilizacion();

        this.genericForm.controls.TipoRevision.setValue(Object(this._global.reporte.objreporte).TipoRevision);

        if(this._global.reporte.objreporte.AdjuntosFacturasNotasCompra!=""){
            try { this._global.AdjuntosFacturasNotasCompraArre = JSON.parse(Object(this._global.reporte.objreporte).AdjuntosFacturasNotasCompra); } catch (e) { };
        }else{
            this._global.AdjuntosFacturasNotasCompraArre = [];
        }

        if(this._global.reporte.objreporte.AdjuntosFotosModeloSerie!=""){
            try { this._global.AdjuntosFotosModeloSerieArre = JSON.parse(Object(this._global.reporte.objreporte).AdjuntosFotosModeloSerie); } catch (e) { };
        }else{
            this._global.AdjuntosFotosModeloSerieArre = [];
        }
    }

    onActionFacturasNotasCompra(event: any) {
        console.log(event);
        this._global.AdjuntosFacturasNotasCompra = event;
    }
    onActionFotosModeloSerie(event: any) {
        console.log(event);
        this._global.AdjuntosFotosModeloSerie = event;
    }

    changeNoSerie(){
      var NoSerie = this.genericForm.controls.NoSerie.value;

      this._global.clearMessages();
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


    precargaTarifasMovilizacion(Subcategoria) {

        var params = {};

        params['IDCentroCliente'] = Object(this._global.cliente.objeto).IDCentro;
        params['Subcategoria'] = Subcategoria;

        this._global.appstatus.loading = true;

        console.log('Precarga subtiposervicio');
        console.log(params);

        this._httpService.postJSON(params, 'registro-de-casos/precarga-tarifas-movilizacion.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {

                    this._global.subtiposervicio = this._global.parseJSON( data.subtiposervicio);

                    console.log('subtiposervicio');
                    console.log(this._global.subtiposervicio);


                    this.habilitaDomicilio();


                    /*if (data.subtipotarifas.length == 0) {
                        this._global.appstatus.mensaje = 'No se encontraron datos con estas características.';
                    }*/

                } else if (data.res = 'error') {

                    this._global.appstatus.mensaje = data.error;

                }
            },
            error => alert(error),
            () => console.log('termino submit')
            );


    }

    habilitaDomicilio() {

        this.genericForm.controls.TipoRevision.setValue(Object(this._global.reporte.objreporte).TipoRevision);
        this.genericForm.controls.TipoRevision.updateValueAndValidity();

        if (this._global.subtiposervicio.length == 0) {
            this.formulariostatus.habilitaDomicilio = false;
        } else {
            this.formulariostatus.habilitaDomicilio = true;
        }

    }

    precargaCentros(){
      this._global.appstatus.mensaje = '';
      var params = {};
      var IDMaster = 0;

      params['Pais'] = Object(this._global.user).Pais;
      params['nivel'] = Object(this._global.user).nivel;

      if(this.genericForm.controls.TipoCentro.value=='Red')
         IDMaster = Object(this._global.user).IDCentro;

      params['IDMaster'] = IDMaster;
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

                  if (data.centros.length == 0) {
                    if(IDMaster!=0){
                      this.genericForm.controls.TipoCentro.setValue('');
                      this._global.appstatus.mensaje = 'No se encontraron Cds en la red.';
                    }else
                      this._global.appstatus.mensaje = 'No se encontraron datos con estas características.';
                  }else{
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

    precargaDistribuidores() {

        var params = {};

        params['Categoria'] = this.genericForm.controls.Categoria.value;
        params['Pais'] = Object(this._global.user).Pais;
        params['nivel'] = Object(this._global.user).nivel;

        this._global.appstatus.loading = true;

        /*console.log('Precarga distribuidores');
        console.log(params);*/

        this._httpService.postJSON(params, 'registro-de-casos/buscar-distribuidores.php')
            .subscribe(
            data => {
                console.log('data distribuidores>>>>>>>>>>>');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {

                    this._global.distribuidores = this._global.parseJSON(data.distribuidores);

                    console.log('distribuidores');
                    console.log(this._global.distribuidores);

                    if (data.distribuidores.length == 0) {
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

    precargaProducto() {

        console.log('precargando');

        if (Object(this._global.reporte.objreporte).Categoria != null && Object(this._global.reporte.objreporte).Categoria != "") {

            this.genericForm.controls.Categoria.setValue(Object(this._global.reporte.objreporte).Categoria);
            this.genericForm.controls.Categoria.updateValueAndValidity();

            this.genericForm.controls.LugarCompra.setValue(Object(this._global.reporte.objreporte).LugarCompra);
            this.genericForm.controls.LugarCompra.updateValueAndValidity();

            this.genericForm.controls.TipoRevision.setValue(Object(this._global.reporte.objreporte).TipoRevision);
            this.genericForm.controls.TipoRevision.updateValueAndValidity();

            this.genericForm.controls.Uso.setValue(Object(this._global.reporte.objreporte).Uso);
            this.genericForm.controls.Uso.updateValueAndValidity();

            this.genericForm.controls.Comentarios.setValue(Object(this._global.reporte.objreporte).Comentarios);
            this.genericForm.controls.Comentarios.updateValueAndValidity();


            this.changeCategoria(Object(this._global.reporte.objreporte).Categoria);

            this.genericForm.controls.Distribuidor.setValue(Object(this._global.reporte.objreporte).Distribuidor);
            this.genericForm.controls.Distribuidor.updateValueAndValidity();

            //sello
            this.genericForm.controls.Sello.setValue(Object(this._global.reporte.objreporte).Sello);
            this.genericForm.controls.Sello.updateValueAndValidity();


            //console.log(Object(this._global.reporte.objreporte).FechaCompra);
            var fecha = Object(this._global.reporte.objreporte).FechaCompra;
            fecha = fecha.replace(' 00:00:00', '');
            fecha = fecha.split('-');
            //console.log(fecha);
            const now = new Date();

            var fechatemp = {
                day: parseInt(fecha[2]),
                month: parseInt(fecha[1]),
                year: parseInt(fecha[0])
            };

            this.modelfechacompra = { year: fechatemp.year, month: fechatemp.month, day: fechatemp.day };
            /*Object(this.status.FechaCompra).year = fechatemp.year;
            Object(this.status.FechaCompra).month = fechatemp.month;
            Object(this.status.FechaCompra).day = fechatemp.day;
            console.log('obj fecha compra');
            console.log(this.status.FechaCompra);*/
            this.status.FechaCompra = { year: fechatemp.year, month: fechatemp.month, day: fechatemp.day };
            console.log('obj fecha compra');
            console.log(this.status.FechaCompra );
            this.evaluaFechaCompra();

        }
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
        arreValProductos.push(this.genericForm.controls.Subcategoria);
        arreValProductos.push(this.genericForm.controls.Tipo);
        arreValProductos.push(this.genericForm.controls.Modelo);
        //arreValProductos.push(this.genericForm.controls.FechaCompra);
        //arreValProductos.push(this.genericForm.controls.AplicaGarantia);
        arreValProductos.push(this.genericForm.controls.Uso);
        arreValProductos.push(this.genericForm.controls.Distribuidor);
        arreValProductos.push(this.genericForm.controls.LugarCompra);

        //arreValProductos.push(this.genericForm.controls.Falla);

        //arreValProductos.push(this.genericForm.controls.TipoRevision);
        //arreValProductos.push(this.genericForm.controls.FechaRevision);


        this.genericForm.controls.Categoria.setValue('');
        this.genericForm.controls.Subcategoria.setValue('');
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
                if(!this._global.user.IDDistribuidor){
                  this.genericForm.controls.TipoRevision.setValidators([Validators.required]);
                  this.genericForm.controls.TipoRevision.updateValueAndValidity();

                  /*this.genericForm.controls.FechaRevision.setValidators([Validators.required]);
                  this.genericForm.controls.FechaRevision.updateValueAndValidity();*/

                  this.genericForm.controls.Comentarios.setValidators([Validators.required]);
                  this.genericForm.controls.Comentarios.updateValueAndValidity();
                }
                break;

            case "Refacciones":

                this.genericForm.controls.Comentarios.setValidators([Validators.required]);
                this.genericForm.controls.Comentarios.updateValueAndValidity();

                break;

            default:

                this.resetRequired();

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

        this.genericForm.controls.TipoReclamo.setValidators([]);
        this.genericForm.controls.TipoReclamo.setValue('');
        this.genericForm.controls.TipoReclamo.updateValueAndValidity();

        this.genericForm.controls.Comentarios.setValidators([]);
        this.genericForm.controls.Comentarios.setValue('');
        this.genericForm.controls.Comentarios.updateValueAndValidity();
    }

    changeCategoria(Categoria = null) {

        this._global.appstatus.mensaje = '';
        console.log('cambio categoría');
        console.log(this.genericForm.getRawValue());
        var params = {};
        if (Categoria == null)
            params['Categoria'] = this.genericForm.controls.Categoria.value;
        else
            params['Categoria'] = Categoria;


        this.precargaDistribuidores();



        params['Pais'] = this._global.user.Pais;
        params['nivel'] = this._global.user.nivel;
        params['IDUser'] = this._global.user.id;

        this._global.appstatus.loading = true;

        this._global.productos = [];
        this._global.modelos = [];
        this.genericForm.controls.Tipo.setValue('');
        this.genericForm.controls.Tipo.updateValueAndValidity();
        this.genericForm.controls.Modelo.setValue('');
        this.genericForm.controls.Modelo.updateValueAndValidity();

        this._httpService.postJSON(params, 'buscar-subcategorias.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {
                    this._global.subcategorias = this._global.parseJSON(data.subcategorias);
                    console.log('subcategorias');
                    console.log(this._global.subcategorias);

                    if (data.subcategorias.length == 0) {
                        this._global.appstatus.mensaje = 'No se encontraron datos con estas características.';
                    } else {
                        if (Categoria != null) {
                            this.genericForm.controls.Subcategoria.setValue(Object(this._global.reporte.objreporte).Subcategoria);
                            this.genericForm.controls.Subcategoria.updateValueAndValidity();

                            this.changeSubcategoria(Object(this._global.reporte.objreporte).Subcategoria);
                        }
                    }

                    /*Si el usuario es un distgrobuidor*/
                    if(this._global.user.IDDistribuidor)
                      this.precargaCentros();

                } else if (data.res = 'error') {
                    this._global.appstatus.mensaje = data.error;
                }
            },
            error => alert(error),
            () => console.log('termino submit')
            );
    }
    changeUso(Subcategoria = null){
      var valido = true;
      if(this.genericForm.controls.Uso.value=='' && this.genericForm.controls.Categoria.value=='MENAJE'){
        alert("Favor de seleccionar el uso del producto.");
        valido = false;
      }
      if(valido){
        this._global.appstatus.mensaje = '';
        console.log('submit busqueda');
        console.log(this.genericForm.getRawValue());
        var params = {};
        if (Subcategoria == null)
            params['Subcategoria'] = this.genericForm.controls.Subcategoria.value;
        else
            params['Subcategoria'] = Subcategoria;


        //precarga subtiposervicio de tarifas
        this.precargaTarifasMovilizacion(params['Subcategoria']);

        params['Pais'] = this._global.user.Pais;
        params['nivel'] = this._global.user.nivel;
        params['Categoria'] = this.genericForm.controls.Categoria.value;
        params['Uso'] = this.genericForm.controls.Uso.value;

        this._global.appstatus.loading = true;

        this._global.modelos = [];
        this.genericForm.controls.Modelo.setValue('');
        this.genericForm.controls.Modelo.updateValueAndValidity();

        this._global.productos = [];
        this.genericForm.controls.Tipo.setValue('');
        this.genericForm.controls.Tipo.updateValueAndValidity();

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

                    if (data.fallas.length == 0) {
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
    }

    changeSubcategoria(Subcategoria = null) {
      var valido = true;

      if(valido){
        this._global.appstatus.mensaje = '';
        console.log('submit busqueda');
        console.log(this.genericForm.getRawValue());
        var params = {};
        if (Subcategoria == null)
            params['Subcategoria'] = this.genericForm.controls.Subcategoria.value;
        else
            params['Subcategoria'] = Subcategoria;


        //precarga subtiposervicio de tarifas
        this.precargaTarifasMovilizacion(params['Subcategoria']);

        params['Pais'] = this._global.user.Pais;
        params['nivel'] = this._global.user.nivel;
        params['Categoria'] = this.genericForm.controls.Categoria.value;
        if(this._global.cliente.objeto.TipoPersona =='Persona Física'){
          params['Cliente'] = "PERSONA FÍSICA";
        }else{
          params['Cliente'] = "EMPRESA";
        }
        /*
        if(this._global.cliente.objeto.TipoPersona !='Persona Física'){
          params['Uso'] = "Comercial";
        }else{
          params['Uso'] = "Privado";
        }
        */

        this._global.appstatus.loading = true;

        this._global.modelos = [];
        this.genericForm.controls.Modelo.setValue('');
        this.genericForm.controls.Modelo.updateValueAndValidity();

        this._global.productos = [];
        this.genericForm.controls.Tipo.setValue('');
        this.genericForm.controls.Tipo.updateValueAndValidity();

        this._httpService.postJSON(params, 'buscar-modelos.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {
                    this._global.modelos = this._global.parseJSON(data.modelos);
                    console.log('modelos');
                    console.log(this._global.modelos);

                    if (data.modelos.length == 0) {
                        this._global.appstatus.mensaje = 'No se encontraron datos con estas características.';
                    } else {
                        if (Subcategoria != null) {
                            this.genericForm.controls.Modelo.setValue(Object(this._global.reporte.objreporte).Modelo);
                            this.genericForm.controls.Modelo.updateValueAndValidity();

                            this.changeModelo(Object(this._global.reporte.objreporte).Modelo);
                        }

                        /*Si la subcategoría es Microondas o Dispensador de agua*/
                        if(this.genericForm.controls.Subcategoria.value=="DISPENSADOR DE AGUA" || this.genericForm.controls.Subcategoria.value=="MICROONDA"){
                          this.formulariostatus.habilitaDomicilio = true;
                        }
                    }

                } else if (data.res = 'error') {
                    this._global.appstatus.mensaje = data.error;
                }
            },
            error => alert(error),
            () => console.log('termino submit')
            );


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

                    if (data.fallas.length == 0) {
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
    }


    changeModelo(Modelo = null) {

        this._global.appstatus.mensaje = '';

        console.log('submit busqueda');
        console.log(this.genericForm.getRawValue());
        var params = {};
        if (Modelo == null)
            params['Modelo'] = this.genericForm.controls.Modelo.value;
        else
            params['Modelo'] = Modelo;

        params['Pais'] = this._global.user.Pais;
        params['nivel'] = this._global.user.nivel;

        this._global.appstatus.loading = true;

        this._httpService.postJSON(params, 'buscar-productos.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {

                    this._global.productos = this._global.parseJSON(data.productos);

                    this.genericForm.controls.Tipo.setValue(this._global.productos[0].Producto);
                    this.genericForm.controls.Tipo.updateValueAndValidity();

                    console.log('productos');
                    console.log(this._global.productos);

                    if (data.productos.length == 0) {
                        this._global.appstatus.mensaje = 'No se encontraron datos con estas características.';
                    } else {
                        if (Modelo != null) {
                            this.genericForm.controls.Tipo.setValue(Object(this._global.reporte.objreporte).Tipo);
                            this.genericForm.controls.Tipo.updateValueAndValidity();
                        }
                    }

                    this.changeTipoRevision();


                } else if (data.res = 'error') {
                    this._global.appstatus.mensaje = data.error;
                }
            },
            error => alert(error),
            () => console.log('termino submit')
            );
    }

    changeTipo(Tipo = null) {

        /*this._global.appstatus.mensaje = '';
        console.log('submit busqueda');
        console.log(this.genericForm.getRawValue());
        var params = {};
        if (Tipo == null)
            params['Tipo'] = this.genericForm.controls.Tipo.value;
        else
            params['Tipo'] = Tipo;

        this._global.appstatus.loading = true;

        this._httpService.postJSON(params, 'buscar-modelos.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {
                    this._global.modelos = this._global.parseJSON(data.modelos);
                    console.log('modelos');
                    console.log(this._global.modelos);

                    if (data.modelos.length == 0) {
                        this._global.appstatus.mensaje = 'No se encontraron datos con estas características.';
                    } else {
                        if (Tipo != null) {
                            this.genericForm.controls.Modelo.setValue(Object(this._global.reporte.objreporte).Modelo);
                            this.genericForm.controls.Modelo.updateValueAndValidity();
                        }
                    }

                    this.changeTipoRevision();


                } else if (data.res = 'error') {
                    this._global.appstatus.mensaje = data.error;
                }
            },
            error => alert(error),
            () => console.log('termino submit')
            );*/

    }


    changeFechaCompra() {

        this.status.FechaCompra = this.genericForm.controls.FechaCompra.value;
        this.evaluaFechaCompra();

    }

    evaluaFechaCompra() {
        console.log(Object(this.status.FechaCompra).year + '/' + Object(this.status.FechaCompra).month + '/' + Object(this.status.FechaCompra).day);
        var fecha = new Date(Object(this.status.FechaCompra).year + '/' + Object(this.status.FechaCompra).month + '/' + Object(this.status.FechaCompra).day );
        console.log(fecha);

        var hoy = new Date();
        console.log(hoy);

        var anos = this.diff_years(hoy, fecha);
        console.log(anos);
        console.log('sello value');
        console.log(this.genericForm.controls.Sello.value);

        if (anos == 0 && this.genericForm.controls.Sello.value == "Sí") {
            //this.status.garantiaValida = true
            console.log('si gara');
            this.genericForm.controls.AplicaGarantia.setValue('si');
        } else {
            //this.status.garantiaValida = false;
            console.log('no gara');
            this.genericForm.controls.AplicaGarantia.setValue('no');
        }
        this.genericForm.controls.AplicaGarantia.updateValueAndValidity();
    }

    changeSello() {

        this.evaluaFechaCompra();

    }

    changeFalla() {

        var falla = this.genericForm.controls.Falla.value;

        if (falla == "OTRO") {
            this.genericForm.controls.FallaDescripcion.setValue("");
            this.genericForm.controls.FallaDescripcion.setValidators([Validators.required]);
            this.genericForm.controls.FallaDescripcion.updateValueAndValidity();
        } else {
            this.genericForm.controls.FallaDescripcion.setValue("");
            this.genericForm.controls.FallaDescripcion.setValidators([]);
            this.genericForm.controls.FallaDescripcion.updateValueAndValidity();
        }

    }

    diff_years(dt2, dt1) {

        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60 * 24);
        return Math.abs(Math.floor(diff / 365.25));

    }


    changeTipoRevision() {

        console.log('change revisión');

        this.genericForm.controls.FechaRevision.setValidators([]);
        this.genericForm.controls.FechaRevision.setValue('');
        this.genericForm.controls.FechaRevision.updateValueAndValidity();

        this.genericForm.controls.TipoKilometraje.setValidators([]);
        this.genericForm.controls.TipoKilometraje.setValue('');
        this.genericForm.controls.TipoKilometraje.updateValueAndValidity();

        if (this.genericForm.controls.TipoRevision.value == 'domicilio') {

            this.genericForm.controls.TipoKilometraje.setValidators([Validators.required]);
            this.genericForm.controls.TipoKilometraje.updateValueAndValidity();

            this.genericForm.controls.FechaRevision.setValidators([Validators.required]);
            this.genericForm.controls.FechaRevision.updateValueAndValidity();

            if (Object(this._global.reporte.objreporte).IDTarifas != null){
                console.log('cambiando valor tarifas kilometraje');
                console.log(Object(this._global.reporte.objreporte).IDTarifas);
                this.genericForm.controls.TipoKilometraje.setValue(Object(this._global.reporte.objreporte).IDTarifas);
                this.genericForm.controls.TipoKilometraje.updateValueAndValidity();

                this.changeTipoKilometraje();

                //set fecha revision
                var fecha = Object(this._global.reporte.objreporte).FechaRevision;
                fecha = fecha.replace(' 00:00:00', '');
                fecha = fecha.split('-');
                //console.log(fecha);
                const now = new Date();

                var fechatemp = {
                    day: parseInt(fecha[2]),
                    month: parseInt(fecha[1]),
                    year: parseInt(fecha[0])
                };

                this.modelfecharevision = { year: fechatemp.year, month: fechatemp.month, day: fechatemp.day };

                /*Si la subcategoría es Microondas o Dispensador de agua*/
                if(this.genericForm.controls.Subcategoria.value=="DISPENSADOR DE AGUA" || this.genericForm.controls.Subcategoria.value=="MICROONDA"){
                  this.genericForm.controls.FechaRevision.setValidators([]);
                  this.genericForm.controls.FechaRevision.setValue('');
                  this.genericForm.controls.FechaRevision.updateValueAndValidity();

                  this.genericForm.controls.TipoKilometraje.setValidators([]);
                  this.genericForm.controls.TipoKilometraje.setValue('');
                  this.genericForm.controls.TipoKilometraje.updateValueAndValidity();
                  this.formulariostatus.necesitaAutorizacion = 1;
                }
            }


        }else{

            this.genericForm.controls.TipoKilometraje.setValidators([]);
            this.genericForm.controls.TipoKilometraje.updateValueAndValidity();

        }

    }

    changeTipoCentro(){
      this.precargaCentros();
    }

    changeTipoKilometraje() {

        var val = this.genericForm.controls.TipoKilometraje.value;

        console.log('change kilometraje');
        console.log(val);

        var valor = 0;
        this.formulariostatus.necesitaAutorizacion = 0;

        for (var i = 0; i < this._global.subtiposervicio.length; i++) {

            console.log(this._global.subtiposervicio[i].id);

            if (this._global.subtiposervicio[i].id == val) {
                valor = this._global.subtiposervicio[i].Valor;
                this.formulariostatus.necesitaAutorizacion = this._global.subtiposervicio[i].NecesitaAutorizacion;
            }
            console.log('necesita autorizacion');
            console.log(this.formulariostatus.necesitaAutorizacion);

            //if (!this.formulariostatus.necesitaAutorizacion) {
                //this.genericForm.controls.CostoKilometraje.setValidators([]);
                this.genericForm.controls.CostoKilometraje.setValue(valor);
                this.genericForm.controls.CostoKilometraje.updateValueAndValidity();
           /* } else {

            }*/

        }


        /*
        this.genericForm.controls.Kilometraje.setValidators([]);
        this.genericForm.controls.Kilometraje.setValue('');
        this.genericForm.controls.Kilometraje.updateValueAndValidity();

        this.genericForm.controls.CostoKilometraje.setValidators([]);
        this.genericForm.controls.CostoKilometraje.setValue('');
        this.genericForm.controls.CostoKilometraje.updateValueAndValidity();

        if (this.genericForm.controls.TipoKilometraje.value == 'Hasta 20 kilómetros') {



        } else if (this.genericForm.controls.TipoKilometraje.value == 'Más de 20 kilómetros'){

            this.genericForm.controls.Kilometraje.setValidators([Validators.required]);
            this.genericForm.controls.Kilometraje.updateValueAndValidity();

            this.genericForm.controls.CostoKilometraje.setValidators([Validators.required]);
            this.genericForm.controls.CostoKilometraje.updateValueAndValidity();

        }*/

    }


    randomBetween(arre) {
        var size = arre.length + 1;
        console.log('tamano');
        console.log(size);
        var rand = Math.floor(Math.random() * size);
        console.log(rand);
        return rand;
    }

    changeRefaccion() {
        console.log('change refaccion');
    }
    agregarRefaccion() {
        console.log('agregar refaccion');

        if (this.genericForm.controls.Refaccion.value != '' && this.genericForm.controls.NoParte.value != '') {
            this.status.agregaRefaccionValid = true;


            this._global.resetRefaccion();
            this._global.refaccion.NombreRefaccion = this.genericForm.controls.Refaccion.value;
            this._global.refaccion.NoParte = this.genericForm.controls.NoParte.value;


            this._global.refacciones.push(this._global.refaccion);

            this.genericForm.controls.Refaccion.setValue('');
            this.genericForm.controls.NoParte.setValue('');


        } else {
            this.status.agregaRefaccionValid = false;
        }
    }

    changeExistencia(id, val) {

        /*console.log(id);
        console.log(val);*/

        this._global.refacciones[id].Existencia = val;
        this._global.refacciones[id].CostoUnitario = '';
        this._global.refacciones[id].CostoTotal = '';


        if (val == 'Disponible') {
            this._global.refacciones[id].StatusCotizacion = 'No Aplica';
            this._global.refacciones[id].Status = 'Seleccionada';
        } else if (val == 'No Disponible' || val == 'No Encontrada' ) {
            this._global.refacciones[id].Status = 'Por definir';
        }

    }

    changeCosto(id, val) {
        /*console.log(id);
        console.log(val);*/

        this._global.refacciones[id].CostoUnitario = val;

        this.calculaCostoTotal(id);
    }

    changeCantidad(id, val) {

        console.log('change cantidad');

        this._global.refacciones[id].Cantidad = val;

        this.calculaCostoTotal(id);

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

    }

    regresarAReporte() {
        this.status.cotizar = -1;
        this.status.solicitar = -1;
    }

    eliminarRefaccion(id) {

        this._global.refacciones.splice(id, 1);
        //console.log(this._global.refacciones);

    }



    submitRegistro() {
        console.log('submit prevalidation');
        //alert(this.genericForm.valid);
        //alert(this.genericForm.controls.Categoria.value);
        //Validamos si se trata de un casi de menaje
        var Modelo = this.genericForm.controls.Modelo.value;
        if(this.genericForm.controls.Categoria.value=='MENAJE' && this.genericForm.controls.Modelo.value!='OS-17001' && this.genericForm.controls.Modelo.value!='OS-17001-1'){
          //Validamos los archivos adjuntos
          this.validarAdjuntos();

          if (this.genericForm.valid && this.adjuntosValidos) {

              console.log('submit registro');
              this._global.clearMessages();
              var Categoria = this.genericForm.controls.Categoria.value;

              var params = {};
              params = this.genericForm.getRawValue();
              params["Update"] = this.status.update;

              if(this._global.user.IDCentro!='')
                params["IDCentro"] = this._global.user.IDCentro;
              else
                params["IDCentro"] = this.genericForm.controls.IDCentro.value;

              params["IDReporte"] = this._global.reporte.idreporte;

              if(this._global.user.IDDistribuidor!='' && this._global.user.IDDistribuidor!='0'){
                params["IDCentro"] = 0;
                params["IDDistribuidor"] = this._global.user.IDDistribuidor;
              }
              else
                params["IDDistribuidor"] = this.genericForm.controls.Distribuidor.value;

              params["IDUsuario"] = this._global.user.id;
              params["IDCliente"] = Object(this._global.cliente.objeto).id;
              params["Refacciones"] = JSON.stringify(this._global.refacciones);
              params["NecesitaAutorizacion"] = this.formulariostatus.necesitaAutorizacion;

              params["NoSerie"] = this.genericForm.controls.NoSerie.value;
              params["Condicion"] = this.genericForm.controls.Condicion.value;
              params["CostoLanded"] = this.genericForm.controls.CostoLanded.value;
              params["OtroCostoDistribuidor"] = this.genericForm.controls.OtroCostoDistribuidor.value;

              params["AdjuntosFacturasNotasCompra"] = this._global.AdjuntosFacturasNotasCompra;
              try { params["AdjuntosFacturasNotasCompraSize"] = Object(this._global.AdjuntosFacturasNotasCompra).currentFiles.length; } catch (e) { params["AdjuntosFacturasNotasCompraSize"] = 0; };

              params["AdjuntosFotosModeloSerie"] = this._global.AdjuntosFotosModeloSerie;
              try { params["AdjuntosFotosModeloSerieSize"] = Object(this._global.AdjuntosFotosModeloSerie).currentFiles.length; } catch (e) { params["AdjuntosFotosModeloSerieSize"] = 0; };

              this._global.appstatus.loading = true;

              console.log("registro reporte", params);

              this._httpService.postFormData(params, 'registro-de-casos/registro-reporte-menaje.php')
                  .subscribe(
                  data => {
                      console.log('data');
                      console.log(data);
                      this._global.appstatus.loading = false;

                      if (data.res == 'ok') {

                          console.log("objReporte", data.objreporte);
                          this._global.guardarIdReporte(data.idreporte);
                          this._global.guardarObjReporte(data.objreporte);
                          //this._global.guardarObjReporte(data.objreporte);


                          this.genericForm.reset();
                          // this.status.paso = 2;
                          swal({
                              title: 'Solicitud Enviada',
                              text: 'Se ha enviado la solicitud.',
                              type: 'success',
                              showConfirmButton: true,
                              confirmButtonText: 'Ok',
                              customClass: 'swal2-overflow',
                          }).then((result) => {
                            ////Registro de notificación para HP
                            this._global.notificaciones.modulo = "/registro-de-casos/reporte-de-caso-menaje";
                            this._global.notificaciones.descripcion = "Se ha registrado un reporte de menaje con el No. de orden: " + this._global.reporte.idreporte;
                            this._global.registrarNotificacion(this._global.reporte.idreporte);

                            this._router.navigate(['inicio/resumen']);
                          });
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
        }else{//Si es un caso de línea blanca sigue el flujo normal
          if (this.genericForm.valid) {
              console.log('submit registro');
              this._global.clearMessages();
              var Categoria = this.genericForm.controls.Categoria.value;

              var params = {};
              params = this.genericForm.getRawValue();
              params["Update"] = this.status.update;

              if(this._global.user.IDCentro!='')
                params["IDCentro"] = this._global.user.IDCentro;
              else
                params["IDCentro"] = this.genericForm.controls.IDCentro.value;

              params["IDReporte"] = this._global.reporte.idreporte;

              if(this._global.user.IDDistribuidor!='' && this._global.user.IDDistribuidor!='0'){
                params["IDDistribuidor"] = this._global.user.IDDistribuidor;
                params["TipoRevision"] = "otro centro";
              }else{
                params["IDDistribuidor"] = this.genericForm.controls.Distribuidor.value;
              }


                params["IDUsuario"] = this._global.user.id;
                params["IDCliente"] = Object(this._global.cliente.objeto).id;
                params["Refacciones"] = JSON.stringify(this._global.refacciones);
                params["NecesitaAutorizacion"] = this.formulariostatus.necesitaAutorizacion;

                params["NoSerie"] = this.genericForm.controls.NoSerie.value;
                params["Condicion"] = this.genericForm.controls.Condicion.value;
                params["CostoLanded"] = this.genericForm.controls.CostoLanded.value;
                params["OtroCostoDistribuidor"] = this.genericForm.controls.OtroCostoDistribuidor.value;

                params["AdjuntosFacturasNotasCompra"] = this._global.AdjuntosFacturasNotasCompra;
                try { params["AdjuntosFacturasNotasCompraSize"] = Object(this._global.AdjuntosFacturasNotasCompra).currentFiles.length; } catch (e) { params["AdjuntosFacturasNotasCompraSize"] = 0; };

                params["AdjuntosFotosModeloSerie"] = this._global.AdjuntosFotosModeloSerie;
                try { params["AdjuntosFotosModeloSerieSize"] = Object(this._global.AdjuntosFotosModeloSerie).currentFiles.length; } catch (e) { params["AdjuntosFotosModeloSerieSize"] = 0; };

                this._global.appstatus.loading = true;

                console.log("registro reporte", params);

                this._httpService.postFormData(params, 'registro-de-casos/registro-reporte-menaje.php')
                  .subscribe(
                  data => {
                      console.log('data');
                      console.log(data);
                      this._global.appstatus.loading = false;

                      if (data.res == 'ok') {

                          console.log("objReporte", data.objreporte);
                          this._global.guardarIdReporte(data.idreporte);
                          this._global.guardarObjReporte(data.objreporte);
                          //this._global.guardarObjReporte(data.objreporte);


                          this.genericForm.reset();
                          // this.status.paso = 2;

                          if (this.formulariostatus.necesitaAutorizacion == 1) {
                              //Registro de notificación
                              this._global.notificaciones.modulo = "/inicio/resumen/orden";
                              this._global.notificaciones.descripcion = "Se ha enviado la solicitud de autorización de kilometraje a HP." + this._global.reporte.idreporte;
                              this._global.registrarNotificacion(data.idreporte);
                              swal({
                                  title: 'Solicitud Enviada',
                                  text: 'Se ha enviado la solicitud de autorización de kilometraje a HP.',
                                  type: 'success',
                                  showConfirmButton: true,
                                  confirmButtonText: 'Ok',
                                  customClass: 'swal2-overflow',
                              }).then((result) => {
                                  if (result.value) {
                                    if(this._global.user.IDDistribuidor){
                                      this._router.navigate(['inicio']);
                                    }else{
                                      this._router.navigate(['inicio/resumen']);
                                    }
                                  }
                              });

                          } else {
                            if(parseInt(this._global.user.IDDistribuidor)>0 && Categoria=='LINEA BLANCA'){
                              swal({
                                  title: 'Solicitud Enviada',
                                  text: 'Se ha enviado la solicitud.',
                                  type: 'success',
                                  showConfirmButton: true,
                                  confirmButtonText: 'Ok',
                                  customClass: 'swal2-overflow',
                              }).then((result) => {
                                ////Registro de notificación para HP
                                this._global.notificaciones.modulo = "/cambio-fisico-distribuidor";
                                //this._global.notificaciones.descripcion = "Se ha registrado una solicitud de cambio físico para la orden No. " + this._global.reporte.idreporte;
                                this._global.notificaciones.descripcion = "Se ha registrado un caso de Línea Blanca con No. de orden " + this._global.reporte.idreporte;
                                this._global.registrarNotificacion(this._global.reporte.idreporte);

                                this._global.notificaciones.modulo = "/cambio-fisico-dist-asigna";
                                this._global.notificaciones.descripcion = "Se ha registrado y asignado a su CDs una solicitud de cambio físico para la orden No. " + this._global.reporte.idreporte;
                                this._global.registrarNotificacion(this._global.reporte.idreporte, this._global.user.IDCentro);

                                this._router.navigate(['inicio']);
                              });
                            }else{

                              if((Categoria=='LINEA BLANCA' || Modelo=='OS-17001' || Modelo=='OS-17001-1') && this._global.user.nivel!='operador')
                                this._router.navigate(['inicio']);
                              else
                                this._router.navigate(['inicio/resumen']);
                            }
                          }





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

    changeCentro(){
      this._global.user.IDCentro = this.genericForm.controls.IDCentro.value;
      //alert(this._global.user.IDCentro);
    }

    submitCotizacion() {
        console.log('submit prevalidation cotizacion');

        if (this.cotizacionForm.valid) {

            console.log('submit registro');
            this._global.clearMessages();

            console.log(this.cotizacionForm.getRawValue());

            var params = {};
            params = this.cotizacionForm.getRawValue();

            this._global.refacciones[this.status.cotizar].Proveedor = this.cotizacionForm.controls.Proveedor.value;
            this._global.refacciones[this.status.cotizar].Nota = this.cotizacionForm.controls.Nota.value;
            this._global.refacciones[this.status.cotizar].Cantidad = this.cotizacionForm.controls.Cantidad.value;
            this._global.refacciones[this.status.cotizar].CostoUnitario = this.cotizacionForm.controls.CostoUnitario.value;
            this._global.refacciones[this.status.cotizar].FechaEntrega = this.cotizacionForm.controls.FechaEntrega.value;
            this._global.refacciones[this.status.cotizar].StatusCotizacion = 'Cotizada';
            this._global.refacciones[this.status.cotizar].Status = 'Por enviar';

            this.calculaCostoTotal(this.status.cotizar);

            console.log(this._global.refacciones[this.status.cotizar]);

            this.cotizacionForm.reset();
            this.regresarAReporte();


        } else {
            this._global.validateAllFormFields(this.cotizacionForm);
        }
    }






}
