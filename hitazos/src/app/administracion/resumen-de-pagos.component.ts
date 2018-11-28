import { Component, ElementRef, ViewChild } from '@angular/core';
import { HTTPService } from '../services/http.service';
import { GlobalService } from '../services/global.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { ISubscription } from "rxjs/Subscription";

import { userValidators } from '../userValidators';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import swal from 'sweetalert2';
import { Ng2FileInputModule } from 'ng2-file-input';

@Component({
    selector: 'resumenpagos',
    templateUrl: './resumen-de-pagos.component.html'
})
export class ResumenPagosComponent {
    title = 'app';

    pagosForm: FormGroup;

    private sub: any;

    montoTotal = 0;
    montoRefacciones = 0;
    montoTAMov = 0;
    montoFee = 0;

    nombreMes = 'Agosto';

    filterForm: FormGroup;

    private subscription: ISubscription;

    trigger: Subject<any> = new Subject();

    fechaResumen = {
        "mes": '08',
        "ano": '2018',
    };

    /*Datos del pago*/
    statusPago = "Por Enviar";
    idPago = 0;
    comprobantePago = "";
    ano = "";
    mes = "";
    fechaRegistroPago = "";
    status = 0;

    ComprobanteLenght: 0;
    adjuntosValidos;
    AdjuntosComprobante = {};
    AdjuntosComprobanteLenght = 0;
    AdjuntosComprobanteArre = [];

    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService, public route: ActivatedRoute) { }

    ngOnInit() {
        console.log('init');

        this._global.clearMessages();

        this.filterForm = this.formBuilder.group({
            Ano: [],
            Mes: [],
            Pais: [],
            Master: [],
            Cds: [],
            Categoria: []
        });

        this.pagosForm = this.formBuilder.group({
            Comprobante: ['']
        });

        this.precargaPaises();
        this.setMesResumen();
        this.filterForm.controls.Cds.setValue('');

        //this.filtrarReporte();

    }

    validarAdjuntos(){
      try { this.AdjuntosComprobanteLenght = Object(this.AdjuntosComprobante).currentFiles.length; } catch (e) { this.AdjuntosComprobanteLenght = 0; }

      this.adjuntosValidos = false;
      if(this.AdjuntosComprobanteLenght>0){
        this.adjuntosValidos = true;
      }
    }

    onActionComprobante(event: any) {
        console.log("Event Comprobante", event);
        this.AdjuntosComprobante = event;
    }

    changePais() {
        //console.log(this.filterForm.controls.Pais.value);
        var params = {};
        params['Pais'] = this.filterForm.controls.Pais.value;
        params['IDCentro'] = this._global.user.IDCentro;
        params['Nivel'] = this._global.user.nivel;
        params['IDMaster'] = this._global.user.IDMaster;
        params['IDGrupoTarifa'] = this._global.user.IDGrupoTarifa;
        this._global.appstatus.loading = true;
        console.log("parametros pagos", params);
        this._httpService.postHTML(params, 'administracion/listarmaster.php')
            .subscribe(
            data => {
                console.log('data cds');
                console.log(data);

                this._global.appstatus.loading = false;
                document.getElementById('master').innerHTML = data;
                //console.log("fichas");
                //console.log(this.props.fichas);
            },
            error => alert(error),
            () => console.log('termino submit')
            );
    }

    changeMaster() {
        //console.log(this.filterForm.controls.Pais.value);
        var params = {};
        params['Pais'] = this.filterForm.controls.Pais.value;
        params['IDCentro'] = this._global.user.IDCentro;
        params['Nivel'] = this._global.user.nivel;
        params['IDMaster'] = this._global.user.IDMaster;
        params['IDGrupoTarifa'] = this._global.user.IDGrupoTarifa;

        this._global.appstatus.loading = true;

        this._httpService.postHTML(params, 'administracion/listarcds.php')
            .subscribe(
            data => {
                console.log('data cds');
                console.log(data);

                this._global.appstatus.loading = false;
                document.getElementById('centros').innerHTML = data;
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

    setMesResumen() {

        this.filterForm.controls.Mes.setValue('09');
        this.filterForm.controls.Mes.updateValueAndValidity();
        this.filterForm.controls.Ano.setValue('2018');
        this.filterForm.controls.Ano.updateValueAndValidity();


    }



    ngOnDestroy() {
        console.log('destroy');
        //this.subscription.unsubscribe();
        this.trigger.unsubscribe();
    }

    evaluaMes(){
      //alert(this.filterForm.controls.Mes.value);
      switch(this.filterForm.controls.Mes.value){
        case "01":
          this.nombreMes = "Enero";
        break;
        case "02":
          this.nombreMes = "Febrero";
        break;
        case "03":
          this.nombreMes = "Marzo";
        break;
        case "04":
          this.nombreMes = "Abril";
        break;
        case "05":
          this.nombreMes = "Mayo";
        break;
        case "06":
          this.nombreMes = "Junio";
        break;
        case "07":
          this.nombreMes = "Julio";
        break;
        case "08":
          this.nombreMes = "Agosto";
        break;
        case "09":
          this.nombreMes = "Septiembre";
        break;
        case "10":
          this.nombreMes = "Octubre";
        break;
        case "12":
          this.nombreMes = "Noviembre";
        break;
        case "12":
          this.nombreMes = "Diciembre";
        break;

      }
      //alert(this.nombreMes);
    }

    filtrarReporte() {
      var centro = this.filterForm.controls.Cds.value;
      
      if(centro!="" || this._global.user.nivel=='administrador'){
        var params = {};
        params['cds']   = this.filterForm.controls.Cds.value;
        params['mes']   = this.filterForm.controls.Mes.value;
        params['ano']   = this.filterForm.controls.Ano.value;
        params['categoria']   = this.filterForm.controls.Categoria.value;

        this._global.appstatus.loading = true;

        this.subscription = this._httpService.postJSON(params, 'administracion/filtrar-resumen-de-pagos.php')
            .subscribe(
            data => {
                console.log('data PAGOS');
                console.log(data);
                this._global.appstatus.loading = false;

                this.montoRefacciones = data.MontoRefacciones;
                this.montoTAMov = data.MontoTAMov;
                this.montoFee = data.MontoFee;
                this.montoTotal = data.MontoTotal;

                this.statusPago = '';
                if(data.Pago.id){
                  this.idPago = data.Pago.id;
                  this.statusPago = data.Pago.StatusPago;
                  this.comprobantePago = data.Pago.Comprobante;
                  this.fechaRegistroPago = data.Pago.FechaRegistro;
                  this.ano = params['ano'];
                  this.mes = params['mes'];
                  this.status = data.Pago.Status;
                }

                console.log("statuspago", this.statusPago);
                if(this.statusPago=="")
                  this.statusPago = "Por Enviar";

                this.evaluaMes();
            },
            error => alert(error),
            () => console.log('termino submit')
            );
          }else{
            swal({
                title: 'CDs requerido',
                text: 'Favor de seleccionar el CDs',
                type: 'error',
                customClass: 'swal2-overflow',
            });
          }
    }

    traeOrdenes() {

        console.log('trayendo ordenes');

        var params = {};
        params['mes'] = this.filterForm.controls.Mes.value;
        params['ano'] = this.filterForm.controls.Ano.value;
        params['IDCentro'] = this._global.user.IDCentro;

        this._global.appstatus.loading = true;

        this.subscription = this._httpService.postJSON(params, 'administracion/resumen-de-servicios.php')
            .subscribe(
            data => {
                console.log('data ordenes..');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {


                    this._global.ordenesServicio.recientes = this._global.parseJSON(data.reportes);

                    this._global.separaFechaOrdenServicio();

                    this.calculaMontoTotal();

                    try { this.statusPago = JSON.parse(data.statuspago).StatusPago; } catch (e) {
                        this.statusPago = 'Por Enviar';
                    }
                    console.log('status pago');
                    console.log(this.statusPago);
                    /*console.log(this._global.busqueda.clientes);

                    if (data.clientes.length == 0) {
                        this._global.appstatus.mensaje = 'No se encontraron clientes con estos datos.';
                    }*/

                    //this.rerender();
                    setTimeout(() => {
                        this.trigger.next();
                    });

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

    calculaMontoTotal() {

        var ordenes = this._global.ordenesServicio.recientes;

        console.log(ordenes);
        var outer = this;
        ordenes.forEach(function (e) {
            //console.log('orden');
            //console.log(e);
            outer.montoTotal += parseFloat(String(e.MontoTotal));
        });

        this.montoTotal = parseFloat(this.montoTotal.toFixed(2));


    }




    generaReporte() {
        console.log('genera reporte');
        console.log(Object(this._global.ordenesServicio.recientes).length);

        var ids = [];

        for (var i = 0; i < Object(this._global.ordenesServicio.recientes).length; i++) {
            ids.push(Object(this._global.ordenesServicio.recientes[i]).id);
        }

        var params = {};
        params['Ordenes'] = JSON.stringify(ids);
        params['IDCentro'] = this._global.user.IDCentro;
        params['MontoTotal'] = this.montoTotal;
        params['Mes'] = this.filterForm.controls.Mes.value;
        params['Ano'] = this.filterForm.controls.Ano.value;


        this._global.appstatus.loading = true;

        console.log(params);


        this._httpService.postJSON(params, 'administracion/guardar-pago.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {

                    //this._global.guardarObjPagos(data.pagos);
                    this._global.pagos.objpagos = this._global.parseJSON(data.pagos);
                    //localStorage.setItem('objpagos', data.pagos);
                    console.log('pagos');
                    console.log(this._global.pagos.objpagos);
                    this._router.navigate(['administracion/historial-de-pagos']);

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


    submitCambiastatusPago() {
        console.log('submit cambio de status de pago');
        this.validarAdjuntos();

        if (this.adjuntosValidos) {

            console.log('submit cambio de estatus');
            this._global.clearMessages();
            this._global.appstatus.loading = true;

            console.log(this.pagosForm.getRawValue());

            var params = {};
            params = this.pagosForm.getRawValue();

            params["IDReporte"] = this.idPago;
            params["ComprobantePago"] = this.AdjuntosComprobante;


            console.log("Parametros de cambio de estatus", params);

            this._httpService.postFormDataPagos(params, 'administracion/actualizar-status-pago.php')
              .subscribe(
              data => {
                  console.log("Parametros de cambio de estatus>>>", params);
                  console.log('data res comprobante', data);
                  this._global.appstatus.loading = false;

                  if (data.res == 'ok') {

                    swal({
                        title: 'Pago Actualizado',
                        text: 'Se ha marcado como pagado y adjuntado el comprobante.',
                        type: 'success',
                        showConfirmButton: true,
                        confirmButtonText: 'Ok',
                        customClass: 'swal2-overflow',
                    }).then((result) => {
                        if (result.value) {
                            //this.filtrarReporte();
                        }
                    });

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
            this._global.validateAllFormFields(this.pagosForm);
        }
    }

}
