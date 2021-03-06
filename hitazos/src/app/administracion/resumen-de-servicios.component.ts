﻿import { Component, ElementRef, ViewChild } from '@angular/core';
import { HTTPService } from '../services/http.service';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { DataTableDirective } from 'angular-datatables-5';
import { Subject } from 'rxjs';
import { ISubscription } from "rxjs/Subscription";
import swal from 'sweetalert2';

@Component({
    selector: 'resumen-de-servicios',
    templateUrl: './resumen-de-servicios.component.html'
})
export class ResumenDeServiciosComponent {
    title = 'app';

    dtOptions: any = {};
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    filterForm: FormGroup;

    private subscription: ISubscription;

    trigger: Subject<any> = new Subject();

    fechaResumen = {
        "mes": '11',
        "ano": '2018',
    };

    statusPago = "Por Enviar";

    /*Montos*/
    montoTotal = 0;
    MontoIVA = 0;
    GarantiaDePartes = 0;
    GarantiaMOyKms = 0;
    GarantiaDeCambios = 0;
    ReembolsoGarantiaFee = 0;

    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService) { }

    ngOnInit() {
        console.log('init');

        this._global.clearMessages();

        console.log("el usuario", this._global.user);

        //this.rerender();

        this.dtOptions = {
            pageLength: 5,
            scrollX: true,
            language: {
                "processing": "Procesando...",
                "lengthMenu": "Mostrar _MENU_ registros",
                "zeroRecords": "No se encontraron resultados",
                "emptyTable": "Ningún dato disponible en esta tabla",
                "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                "infoPostFix": "",
                "search": "Buscar:",
                "url": "",
                "thousands": ",",
                "loadingRecords": "Cargando...",
                "paginate": {
                    "first": "Primero",
                    "last": "Último",
                    "next": "Siguiente",
                    "previous": "Anterior"
                },
                "aria": {
                    "sortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            },
            // Declare the use of the extension in the dom parameter
            dom: 'Bfrtip',
            select: true,
            // Configure the buttons
            buttons: [
                /*'columnsToggle',
                'colvis',*/
                'copy',
                /*'print',*/
                'excel',
               /* {
                    text: 'Some button',
                    key: '1',
                    action: function (e, dt, node, config) {
                        alert('Button activated');
                    }
                }*/
            ],
            /*fixedColumns: true*/
        };

        this.filterForm = this.formBuilder.group({
            Ano: [],
            Mes: [],
            Pais: [this._global.user.Pais],
            Master: [''],
            Cds: [''],
            Categoria: ['']
        });

        this.precargaPaises();
        //this.setMesResumen();
        /*

        */

        this.changePais();
        this.filterForm.controls.Ano.setValue('0');
        this.filterForm.controls.Mes.setValue('0');
        this.changeMaster();
        //this.traeOrdenes();

        //this.filtrarReporte();
        this._global.ordenesServicio.recientes = [];
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
            error => console.log(error),
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
            error => console.log(error),
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
            error => console.log(error),
            () => console.log('termino submit')
            );

    }

    setMesResumen() {

        this.filterForm.controls.Mes.setValue('11');
        this.filterForm.controls.Mes.updateValueAndValidity();
        this.filterForm.controls.Ano.setValue('2018');
        this.filterForm.controls.Ano.updateValueAndValidity();


    }



    ngOnDestroy() {
        console.log('destroy');
        //this.subscription.unsubscribe();
        this.trigger.unsubscribe();
    }

    rerender(): void {
        console.log('rerendering');
        console.log(this.dtElement);
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            setTimeout(() => {
                this.trigger.next();
            });
        });
    }

    filtrarReporte() {
        var centro = this.filterForm.controls.Cds.value;

        if(centro!="" ){
          var params = {};
          params['master']   = this._global.user.IDCentro;
          params['cds']   = this.filterForm.controls.Cds.value;
          params['mes']   = this.filterForm.controls.Mes.value;
          params['ano']   = this.filterForm.controls.Ano.value;
          params['categoria']   = this.filterForm.controls.Categoria.value;
          params['pais']   = this._global.user.Pais;

          this._global.appstatus.loading = true;

          this.subscription = this._httpService.postJSON(params, 'administracion/filtrar-resumen-de-servicios.php')
              .subscribe(
              data => {
                  console.log('data');
                  console.log(data);
                  this._global.appstatus.loading = false;

                  if (data.res == 'ok') {


                      this._global.ordenesServicio.recientes = this._global.parseJSON(data.reportes);

                      this._global.separaFechaOrdenServicio();

                      this.calculaMontoTotal();
                      try { this.statusPago = JSON.parse(data.pagos[0]).StatusPago; } catch (e) {
                          this.statusPago = 'Por Enviar';
                      }
                      console.log('status pago');
                      console.log(this.statusPago);
                      /*console.log(this._global.busqueda.clientes);

                      if (data.clientes.length == 0) {
                          this._global.appstatus.mensaje = 'No se encontraron clientes con estos datos.';
                      }*/

                      
                      setTimeout(() => {
                          //this.trigger.destroy();
                          this.trigger.next();
                          this.rerender();
                      });

                  } else if (data.res = 'error') {
                      this._global.appstatus.mensaje = data.error;
                  }

                  //console.log('data ordenes..', this._global.ordenesServicio.recientes.master);

                  //console.log("fichas");
                  //console.log(this.props.fichas);
              },
              error => console.log(error),
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
            error => console.log(error),
            () => console.log('termino submit')
            );

    }

    calculaMontoTotal() {

        var ordenes = this._global.ordenesServicio.recientes;

        console.log(ordenes);
        var outer = this;
        var MontoTotal=0;
        var MontoFee=0;
        var MontoImpuestoFee=0;
        var ValorImpuesto=0;
        var TotalFee=0;
        var MontoFee=0;
        var MontoRefacciones=0;
        var MontoTAMov=0;
        var MontoCambio=0;
        var MontoDespiece=0;
        var MontoOtro=0;
        var MontoReciclaje=0;
        var MontoIVA = 0;

        ordenes.forEach(function (e) {
            //console.log('orden');
            console.log("el valor de e>>>>>>", e);
            //outer.montoTotal += parseFloat(String(e.MontoTotal));
            //
            /*
            MontoFee += parseFloat(String(e.TarifaMensual));
            MontoImpuestoFee = MontoImpuestoFee + parseFloat(String(e.ImpuestoTarifaMensual));
            ValorImpuesto = MontoFee * MontoImpuestoFee;
            TotalFee = TotalFee + (MontoFee + ValorImpuesto);
            */
            MontoRefacciones +=  parseFloat(String(e.MontoRefacciones));
            MontoTAMov += parseFloat(String(e.MontoReparacion)) + parseFloat(String(e.MontoMovilizacion));
            MontoDespiece =  parseFloat(String(e.MontoDespiece));
            MontoReciclaje =  parseFloat(String(e.MontoReciclaje));
            MontoOtro =  parseFloat(String(e.MontoOtro));

            MontoIVA +=  parseFloat(String(e.MontoIVA));

            TotalFee = TotalFee + (parseFloat(String(e.TarifaMensual)) + parseFloat(String(e.ImpuestoTarifaMensual)));
            MontoCambio = MontoCambio + (MontoDespiece + MontoReciclaje + MontoOtro);
        });

        console.log("MontoFee", MontoFee);
        console.log("MontoImpuestoFee", MontoImpuestoFee);
        console.log("ValorImpuesto", ValorImpuesto);
        console.log("TotalFee", TotalFee);
        console.log("MontoRefacciones", MontoRefacciones);
        console.log("MontoTAMov", MontoTAMov);
        console.log("MontoDespiece", MontoDespiece);
        console.log("MontoReciclaje", MontoReciclaje);
        console.log("MontoOtro", MontoOtro);
        console.log("MontoCambio", MontoCambio);

        this.MontoIVA = MontoIVA;
        this.GarantiaDePartes = MontoRefacciones;
        this.GarantiaMOyKms = MontoTAMov;
        this.GarantiaDeCambios = MontoCambio;
        this.ReembolsoGarantiaFee = TotalFee;

        MontoTotal = MontoRefacciones + MontoTAMov + TotalFee + MontoCambio;
        console.log("MontoTotal", MontoTotal);

        this.montoTotal = parseFloat(MontoTotal.toFixed(2));


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
        params['IDMaster'] = this._global.user.IDCentro;
        params['IDOperadorAdmin'] = this._global.user.id;
        params['Categoria'] = this.filterForm.controls.Categoria.value;
        params['IDCentro'] = this.filterForm.controls.Cds.value;
        params['MontoIVA'] = this.MontoIVA;
        params['MontoTotal'] = this.montoTotal;
        params['GarantiaDePartes'] = this.GarantiaDePartes;
        params['GarantiaMOyKms'] = this.GarantiaMOyKms;
        params['GarantiaDeCambios'] = this.GarantiaDeCambios;
        params['ReembolsoGarantiaFee'] = this.ReembolsoGarantiaFee;
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
                  this.statusPago = data.pagos.StatusPago;
                  //this.obtenerPagos();
                  swal({
                      title: 'Se ha enviado la solicitud de pago a HP',
                      showConfirmButton: true,
                      confirmButtonText: 'Confirmar',
                      showCancelButton: true,
                      cancelButtonText: 'Cancelar',
                      customClass: 'swal2-overflow',

                  }).then((result) => {
                      if (result.value) {
                          //Registro de notificación
                          this._global.notificaciones.modulo = "/resumen-de-servicios";
                          this._global.notificaciones.descripcion = "Solicitud de pago de servicios enviada por " + this._global.user.NombreCentro;
                          this._global.registrarNotificacion(0);
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



    }




}
