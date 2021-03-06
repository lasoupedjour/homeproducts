import { Component, ElementRef, ViewChild } from '@angular/core';
import { HTTPService } from '../services/http.service';
import { GlobalService } from '../services/global.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { DataTableDirective } from 'angular-datatables-5';
import { Subject } from 'rxjs';
import { ISubscription } from "rxjs/Subscription";

import { userValidators } from '../userValidators';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import swal from 'sweetalert2';
import { Ng2FileInputModule } from 'ng2-file-input';

@Component({
    selector: 'historial',
    templateUrl: './historial.component.html'
})
export class HistorialComponent {
  title = 'app';

  pagosForm: FormGroup;
  dtOptions: any = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  private sub: any;

  montoTotal = 0;
  montoRefacciones = 0;
  montoTAMov = 0;
  montoFee = 0;
  montoCambio = 0;

  nombreMes = '';

  filterForm: FormGroup;

  private subscription: ISubscription;

  trigger: Subject<any> = new Subject();

  fechaResumen = {
      "mes": '08',
      "ano": '2018',
  };

  /*Datos del pago*/
  statusPago = "";
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
  id_pago = 0;
  mesPago = '';
  categoriaPago = '';
  montoPago = '';

  constructor(
      public formBuilder: FormBuilder,
      public _httpService: HTTPService, public _router: Router, public _global: GlobalService, public route: ActivatedRoute) { }

  ngOnInit() {
      console.log('init');

      this._global.clearMessages();

      this.dtOptions = {
          pageLength: 15,
          scrollX: false,
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
          Pais: [],
          Master: [],
          Cds: [],
          Categoria: []
      });

      this.pagosForm = this.formBuilder.group({
          Comprobante: ['']
      });

      //this.precargaPaises();
      //this.setMesResumen();
      //this.changeMaster();

      /*this.filterForm.controls.Master.setValue('');
      */
      //this.filterForm.controls.Cds.setValue('');
      //this.filterForm.controls.Categoria.setValue('');
      //this.filterForm.controls.Ano.setValue('');
      //this.filterForm.controls.Mes.setValue('0');

      this.obtenerPagos();
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
      params['IDMaster'] = this._global.user.IDCentro;
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
                this.filterForm.controls.Pais.setValue('');
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
      case "11":
        this.nombreMes = "Noviembre";
      break;
      case "12":
        this.nombreMes = "Diciembre";
      break;

    }
    //alert(this.nombreMes);
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
    if(this.filterForm.controls.Ano.value!='' && this.filterForm.controls.Mes.value!="0"){
      //var centro = this.filterForm.controls.Cds.value;
      var centro = "Todos";

      if(centro!="" || this._global.user.nivel=='administrador'){
        var params = {};
        params['cds']   = this.filterForm.controls.Cds.value;
        params['mes']   = this.filterForm.controls.Mes.value;
        params['ano']   = this.filterForm.controls.Ano.value;
        params['categoria']   = this.filterForm.controls.Categoria.value;
        params['IDMaster']   = this._global.user.IDCentro;
        params['IDOperadorAdmin']   = this._global.user.id;
        console.log("los parametros----> ", params);
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
                this.montoCambio = data.MontoCambio;

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

                setTimeout(() => {
                    //this.trigger.destroy();
                    this.trigger.next();
                    this.rerender();
                });
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
        }else{
          swal({
              title: 'Mes y año requeridos',
              text: 'Favor de indicar el mes y año',
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
      params['IDMaster'] = this._global.user.IDCentro;
      params['IDOperadorAdmin'] = this._global.user.id;
      params['IDCentro'] = this.filterForm.controls.Cds.value;
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
                this.statusPago = data.pagos.StatusPago;
                this.obtenerPagos();

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

  iniciarCargaComprobante(id_pago, mes_pago, ano_pago, categoria_pago, montototal_pago, comprobante_pago, fecha_pago){
    this.statusPago='Cargar';
    this.id_pago = id_pago;
    this.mesPago = mes_pago;
    this.categoriaPago = ano_pago;
    this.montoPago = montototal_pago;
    this.comprobantePago = comprobante_pago;
    this.fechaRegistroPago = fecha_pago;
  }

  obtenerPagos() {
      var params = {};
      params['IDMaster'] = this._global.user.IDCentro;
      params['IDDistribuidor'] = this._global.user.IDDistribuidor;
      params['Nivel'] = this._global.user.nivel;

      this._global.appstatus.loading = true;

      this._httpService.postJSON(params, 'administracion/listar-pagos.php')
          .subscribe(
          data => {
              this._global.appstatus.loading = false;

              if (data.res == 'ok') {
                  //this._global.guardarObjPagos(data.pagos);

                  this.precargaPaises();
                  this.setMesResumen();
                  //this.changeMaster();

                  this.filterForm.controls.Cds.setValue('');
                  this.filterForm.controls.Categoria.setValue('');
                  this.filterForm.controls.Ano.setValue('');
                  this.filterForm.controls.Mes.setValue('0');

                  //localStorage.setItem('objpagos', data.pagos);
                  //console.log("_global.pagos.objpagos->", data.pagos);
                  this._global.pagos.objpagos = data.pagos;
                  //this._global.pagos.objpagos = this._global.parseJSON(data.pagos);
                  setTimeout(() => {
                      //this.trigger.destroy();
                      this.trigger.next();
                      this.rerender();
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
          //alert(this.id_pago);
          params["IDReporte"] = this.id_pago;
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
                      console.log("antes del result");
                      if (result.value) {
                        console.log("dentor del result");
                        //this.obtenerPagos();
                        window.location.reload();
                          //this._router.navigate(['/administracion/historial-de-pagos']);
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
