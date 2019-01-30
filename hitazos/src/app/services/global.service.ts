import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HTTPService } from '../services/http.service';
import 'rxjs/add/operator/map';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CanActivate, Router } from '@angular/router';
import swal from 'sweetalert2';

@Injectable()
export class GlobalService implements CanActivate{


    //base = '';
    base = 'http://apps.pautacreativatemporales.com.mx/oster/homeproducts/servicios/';
    //base = 'https://www.homeproductslatam.com.mx/servicios/';
    //base = 'http://oster:8080/homeproducts/homeproducts/servicios/';

    timerToast = null;

    appstatus = {
        "loading" : false,
        "titulo" : "",
        "mensaje" : "",
        "toasting" : false,
        "toastmsg" : "",
        "tipotoast": "",
        "toasturl":""
    };

    user = {
        "id": "",
        "IDCentro": "",
        "IDMaster": "",
        "nombre": "",
        "usuario": "",
        "nivel": "",
        "NombreCentro": "",
        "Red": "",
        "Categoria" : "",
        "Pais": "",
        "Ciudad": "",
        "Direccion": "",
        "Telefono1": "",
        "Telefono2": "",
        "Telefono3": "",
        "Email": "",
        "Horarios": "",
        "Responsable": "",
        "TelefonoResponsable": "",
        "IDGrupoTarifa": "",
        "IDDistribuidor": "",
        "CustomerID": "",
        "ModoDePago": ""
    };

    paises = [];

    meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    busqueda = {
        "clientes": [],
        "buscar": false,
        "nuevo": false
    };

    cliente = {
        "id": "",
        "objeto": {
            "AMaterno": "",
            "APaterno": "",
            "CP": "",
            "CodigoPais": "",
            "Direccion": "",
            "Email": "",
            "FechaRegistro": "",
            "FechaRegistroNF": "",
            "IDEstado": "",
            "IDLocalidad": "",
            "IDMunicipio": "",
            "Movil": "",
            "NoExt": "",
            "NoInt": "",
            "Nombre": "",
            "OrigenContacto": "",
            "Pais": "",
            "RFC": "",
            "RazonSocial": "",
            "Status": "",
            "Telefono": "",
            "TipoPersona": "",
            "id": "",
        },

    }
    dtOptions = {
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


    reporte = {
            "idreporte": "",
            "objreporte": {
                "AdjuntosFacturasNotasCompra": "",
                "AdjuntosFacturasRepuestos": "",
                "AdjuntosFotosModeloSerie": "",
                "AdjuntosOtros": "",
                "AdjuntosReciclaje": "",
                "AdjuntosFotosProducto": "",
                "AplicaGarantia": "",
                "Categoria": "",
                "CodigoSAP": "",
                "Comentarios": "",
                "Condicion": "",
                "CondicionProductoDiagnostico": "",
                "Descripcion": "",
                "Distribuidor": "",
                "Falla": "",
                "FallaDescripcion": "",
                "FechaCompra": "",
                "FechaCompraNF": "",
                "FechaDiagnostico": "",
                "FechaFactura": "",
                "FechaModificacionDiagnostico": "",
                "FechaModificacionOrdenServicio": "",
                "FechaModificacionReporte": "",
                "FechaOrdenServicio": "",
                "FechaRegistroReporte": "",
                "FechaRevision": "",
                "HomeProductsGroupNo": "",
                "IDCentro": "",
                "IDCentroAsigno": "",
                "IDCliente": "",
                "LugarCompra": "",
                "Modelo": "",
                "MontoDespiece": "",
                "MontoIVA": "",
                "MontoReciclaje": "",
                "MontoRefacciones": "",
                "MontoReparacion": "",
                "MontoMovilizacion": "",
                "MontoOtro": "",
                "MontoOtroDescripcion": "",
                "CostoLanded": "",
                "OtroCostoDistribuidor": "",
                "FechaEntregaCambio": "",
                "FechaCostoLanded": "",
                "MontoSubtotal": "",
                "MontoTotal": "",
                "MotivoCambioDiagnostico": "",
                "MotivoFallaDiagnostico": "",
                "NoFactura": "",
                "NoParteCausoDano": "",
                "NoSerie": "",
                "ObservacionesCDSDiagnostico": "",
                "Refacciones": "",
                "Resolucion": "",
                "Sello": "",
                "Status": "",
                "StatusReporte": "",
                "SubStatusReporte": "",
                "StatusMovilidad": "",
                "StatusCambioFisico": "",
                "StatusCostoLanded": "",
                "Subcategoria": "",
                "Tipo": "",
                "TipoCaso": "",
                "TipoMovilidad": "",
                "TipoReclamo": "",
                "TipoReclamoDiagnostico": "",
                "TipoReparacion": "",
                "TipoRevision": "",
                "Uso": "",
                "id": "",
                "Valor": "",
                "SubtipoServicio": "",
                "IDTarifas": "",
                "RequiereRecoleccion": ""
            },
            "objrefacciones": [],
            "participaciones": [],
        }

    pagos = {
        "objpagos": [],
    }

    casosAsignados = {
        "recientes":[]
    }

    reportesLevantadosCliente = {
        "recientes": []
    }

    administracion = {
        "ods": []
    }


    ordenesServicio = {
        "recientes": []
    }


    clientes = {
        "recientes": []
    }


    refaccionesXAutorizar = {
        "recientes": []
    }

    cotizacionesXAutorizar = {
        "recientes": []
    }

    movilizacionesXAutorizar = {
        "recientes": []
    }

    cambiosFisicosXAutorizar = {
        "recientes": []
    }

    cambiosFisicosXAutorizarDist = {
        "recientes": []
    }

    cambiosFisicosXAutorizarPD = {
        "recientes": []
    }

    refacciones = []

    refaccionesproductos = [];
    tarifas = [];
    refaccion = {
        "NombreRefaccion": "",
        "NoParte": "",
        "Diagrama": "",
        "Existencia": "",
        "Proveedor": "",
        "Nota": "",
        "Cantidad": "",
        "CostoUnitario": "",
        "CostoTotal": "",
        "FechaEntrega": "",
        "Costo": "",
        "NoGuia": "",
        "StatusCotizacion": "",
        "Status":""
    }

    subcategorias = []
    productos = []
    modelos = []
    fallas = []
    distribuidores = []
    centros = []
    subtiposervicio = []

    adjuntos = {
        "FacturasNotasCompra": ['1'],
        "FotosModeloSerie": ['1'],
        "FacturasRespuestos": ['1'],
        "FotosProducto": ['1'],
        "Otros": ['1'],
    }

    //objetos para almacenar adjuntos
    AdjuntosFacturasNotasCompra = {};
    AdjuntosFotosModeloSerie = {};
    AdjuntosFacturasRepuestos = {};
    AdjuntosOtros = {};
    AdjuntosReciclaje = {};
    AdjuntosFotosProducto = {};
    AdjuntosNota = {};


    AdjuntosFacturasNotasCompraArre = [];
    AdjuntosFotosModeloSerieArre = [];
    AdjuntosFacturasRepuestosArre = [];
    AdjuntosOtrosArre = [];
    AdjuntosReciclajeArre = [];
    AdjuntosFotosProductoArre = [];
    AdjuntosNotaArre = [];



    //Notificaciones
    notificaciones = {
        "nuevas": 0,
        "modulo": '',
        "descripcion": '',
        "objnotificaciones": [],
    };
    //fin notificaciones

    constructor(private _http: Http, private _httpService: HTTPService, private _router: Router) {



        if (localStorage.getItem('user'))
          this.user = JSON.parse(localStorage.getItem('user'));

        if (localStorage.getItem('cliente'))
            this.cliente = JSON.parse(localStorage.getItem('cliente'));

        if (localStorage.getItem('idreporte'))
            this.reporte.idreporte = localStorage.getItem('idreporte');

        if (localStorage.getItem('objreporte'))
            this.reporte.objreporte = JSON.parse(localStorage.getItem('objreporte'));

        console.log("onk reporte ", this.reporte.objreporte);
        /*if (localStorage.getItem('objpagos'))
            this.pagos.objpagos = JSON.parse(localStorage.getItem('objpagos'));

        /*if (localStorage.getItem('objrefacciones'))
            this.reporte.objrefacciones = JSON.parse(localStorage.getItem('objrefacciones'));*/

    }


    setStatusRefaccion(txt) {
        if (txt == 'Solicitada') {
            txt = 'Pendiente de aprobación';
        }
        return txt;

    }

    evaluaRefaccion(id, noparte) {

        var disponibilidad = '';
        var fechaentrega = '';
        var costo = '';
        var noguia = '';

        swal({
            title: 'Disponibilidad #Reporte: ' + id,
            html: `
                <select id='disponibilidad' class="form-control form-control-sm" >
                   <option value="" hidden>Disponibilidad</option>
                   <option value="Disponible">Disponible</option>
                   <option value="No Disponible">No Disponible</option>
                </select>`,
            showConfirmButton: true,
            confirmButtonText: 'Confirmar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            customClass: 'swal2-overflow',

        }).then((result) => {
            if (result.value) {

                disponibilidad = String($('#disponibilidad').val());
                /*
                title: 'Información',
                html: 'Selecciona la fecha de entrega:<br><input id="datepicker">Costo:<br><input id="costo" class="w-100"><br>No. de guía:<br><input id="noguia" class="w-100">',
                */
                if (disponibilidad== "Disponible") {
                    swal({
                        title: 'Selecciona la fecha de entrega',
                        html: '<input id="datepicker">',
                        showConfirmButton: true,
                        confirmButtonText: 'Confirmar',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        customClass: 'swal2-overflow',
                        onOpen: function () {

                            var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

                            (<any>$('#datepicker')).datepicker({
                                //locale: 'es-es',
                                format: 'yyyy-mm-dd',
                                minDate: today
                            });
                        },

                    }).then((result) => {
                        if (result.value) {
                            fechaentrega = (<any>$('#datepicker')).val();
                            costo = (<any>$('#costo')).val();
                            noguia = (<any>$('#noguia')).val();

                            swal({
                                title: 'Confirmar cambio de status',
                                text: 'Se enviará notificación al CDS en caso de confirmar...',
                                showConfirmButton: true,
                                confirmButtonText: 'Confirmar',
                                showCancelButton: true,
                                cancelButtonText: 'Cancelar',
                                customClass: 'swal2-overflow',

                            }).then((result) => {
                                if (result.value) {
                                  //Registro de notificación
                                  this.notificaciones.modulo = "/inicio";
                                  this.notificaciones.descripcion = "Refacción con No. de parte " + noparte + " disponible para el reporte No. " + id;
                                  this.registrarNotificacion(id);

                                  this.cambioStatusRefacciones(id, noparte, disponibilidad, fechaentrega, costo, noguia);
                                }
                            });


                        }
                    });
                } else {
                    //confirmacion status No Disponible
                    if (result.value) {
                        swal({
                            title: 'Confirmar cambio de status',
                            text: 'Se enviará notificación al CDS en caso de confirmar...',
                            showConfirmButton: true,
                            confirmButtonText: 'Confirmar',
                            showCancelButton: true,
                            cancelButtonText: 'Cancelar',
                            customClass: 'swal2-overflow',

                        }).then((result) => {
                            if (result.value) {
                              //Registro de notificación
                              this.notificaciones.modulo = "/inicio";
                              this.notificaciones.descripcion = "Refacción con No. de parte " + noparte + " NO disponible para el reporte No. " + id;
                              this.registrarNotificacion(id);

                                this.cambioStatusRefacciones(id, noparte, disponibilidad, fechaentrega)
                            }
                        });
                    }

                }
            }
        });
    }

    evaluaCotizacion(id, noparte) {

        var aprobacion = '';

        swal({
            title: 'Cotización #Reporte: ' + id,
            html: `
                <select id='aprobacion' class="form-control form-control-sm" >
                   <option value="" hidden>Aprobación</option>
                   <option value="Aprobada">Aprobada</option>
                   <option value="Rechazada">Rechazada</option>
                   <option value="Pendiente">Pendiente</option>
                </select>`,
            showConfirmButton: true,
            confirmButtonText: 'Confirmar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            customClass: 'swal2-overflow',

        }).then((result) => {
            if (result.value) {

                aprobacion = String($('#aprobacion').val());
                console.log(aprobacion);

                    swal({
                        title: 'Confirmar cambio de status',
                        text: 'Se enviará notificación al CDS en caso de confirmar...',
                        showConfirmButton: true,
                        confirmButtonText: 'Confirmar',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        customClass: 'swal2-overflow',

                    }).then((result) => {
                        if (result.value) {
                            this.cambioStatusCotizaciones(id, noparte, aprobacion);
                            //Registro de notificación
                            this.notificaciones.modulo = "/cambio-estatus-cotizacion";
                            this.notificaciones.descripcion = "La cotización con No. de parte " + noparte + " ha sido " + aprobacion + " para el reporte No. " + id;
                            this.registrarNotificacion(id);
                        }
                     });


            }
        });
    }

    evaluaMovilizacion(id, noparte) {

        var aprobacion = '';

        swal({
            title: 'Movilización #Reporte: '+id,
            html: `
                <select id='aprobacionmov' class="form-control form-control-sm" >
                   <option value="" hidden>Aprobación</option>
                   <option value="Aprobada">Aprobada</option>
                   <option value="Rechazada">Rechazada</option>
                   <option value="Pendiente">Pendiente</option>
                </select>`,
            showConfirmButton: true,
            confirmButtonText: 'Confirmar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            customClass: 'swal2-overflow',

        }).then((result) => {
            if (result.value) {

                aprobacion = String($('#aprobacionmov').val());
                console.log(aprobacion);

                swal({
                    title: 'Confirmar cambio de status',
                    text: 'Se enviará notificación al CDS en caso de confirmar...',
                    showConfirmButton: true,
                    confirmButtonText: 'Confirmar',
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    customClass: 'swal2-overflow',

                }).then((result) => {
                    if (result.value) {
                        this.cambioStatusMovilizaciones(id, aprobacion);
                        //Registro de notificación
                        this.notificaciones.modulo = "/cambio-estatus-movilizacion";
                        this.notificaciones.descripcion = "La movilización del reporte No. " + id + " ha sido " + aprobacion;
                        this.registrarNotificacion(id);
                    }
                });


            }
        });
    }
    //cambioStatusCostoLanded
    evaluaCostoLanded(id) {

        var aprobacion = '';
        var motivo_rechazo = '';

        swal({
            title: 'Cambio Físico - Costo landed #Reporte: '+id,
            html: `
                <select id='aprobacioncambio' class="form-control form-control-sm" >
                   <option value="" hidden>Aprobación</option>
                   <option value="Aprobado">Aprobado</option>
                   <option value="Rechazado">Rechazado</option>
                   <option value="Pendiente">Pendiente</option>
                </select>`,
            showConfirmButton: true,
            confirmButtonText: 'Confirmar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            customClass: 'swal2-overflow',

        }).then((result) => {
            if (result.value) {

                aprobacion = String($('#aprobacioncambio').val());
                console.log(aprobacion);
                /*
                title: 'Motivo del rechazo',
                html: 'Selecciona la fecha de entrega:<br><input id="datepicker">Costo:<br><input id="costo" class="w-100"><br>No. de guía:<br><input id="noguia" class="w-100">',
                */
                if (aprobacion== "Rechazado") {
                    swal({
                        title: 'Motivo del rechazo',
                        html: '<textarea id="motivo_rechazo" class="w-100" rows="4"></textarea>',
                        showConfirmButton: true,
                        confirmButtonText: 'Confirmar',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        customClass: 'swal2-overflow'
                    }).then((result) => {
                        if (result.value) {
                            motivo_rechazo = String($('#motivo_rechazo').val());

                            swal({
                              title: 'Confirmar cambio de status',
                              text: 'Se enviará notificación al Distribuidor en caso de confirmar...',
                              showConfirmButton: true,
                              confirmButtonText: 'Confirmar',
                              showCancelButton: true,
                              cancelButtonText: 'Cancelar',
                              customClass: 'swal2-overflow',

                            }).then((result) => {
                                if (result.value) {
                                  this.cambioStatusCostoLanded(id, aprobacion);
                                  //Registro de notificación
                                  this.notificaciones.modulo = "/cambio-estatus-costolanded-rechazado";
                                  this.notificaciones.descripcion = "El costo landed del cambio físico del reporte No. " + id + " ha sido rechazado.<br /><br />Motivo: " + motivo_rechazo;
                                  this.registrarNotificacion(id);
                                }
                            });


                        }
                    });
                }else{
                  swal({
                      title: 'Confirmar cambio de status',
                      text: 'Se enviará notificación al Distribuidor en caso de confirmar...',
                      showConfirmButton: true,
                      confirmButtonText: 'Confirmar',
                      showCancelButton: true,
                      cancelButtonText: 'Cancelar',
                      customClass: 'swal2-overflow',

                  }).then((result) => {
                      if (result.value) {
                          this.cambioStatusCostoLanded(id, aprobacion);
                          //Registro de notificación
                          this.notificaciones.modulo = "/cambio-estatus-costolanded";
                          this.notificaciones.descripcion = "El costo landed del cambio físico del reporte No. " + id + " ha sido " + aprobacion;
                          this.registrarNotificacion(id);
                      }
                  });
                }
            }
        });
    }

    evaluaCambioFisico(id) {

        var aprobacion = '';
        var motivo_rechazo = '';

        swal({
            title: 'Cambio Físico #Reporte: '+id,
            html: `
                <select id='aprobacioncambio' class="form-control form-control-sm" >
                   <option value="" hidden>Aprobación</option>
                   <option value="Aprobado">Aprobado</option>
                   <option value="Rechazado">Rechazado</option>
                   <option value="Pendiente">Pendiente</option>
                </select>`,
            showConfirmButton: true,
            confirmButtonText: 'Confirmar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            customClass: 'swal2-overflow',

        }).then((result) => {
            if (result.value) {

                aprobacion = String($('#aprobacioncambio').val());
                console.log(aprobacion);
                /*
                title: 'Motivo del rechazo',
                html: 'Selecciona la fecha de entrega:<br><input id="datepicker">Costo:<br><input id="costo" class="w-100"><br>No. de guía:<br><input id="noguia" class="w-100">',
                */
                if (aprobacion== "Rechazado") {
                    swal({
                        title: 'Motivo del rechazo',
                        html: '<textarea id="motivo_rechazo" class="w-100" rows="4"></textarea>',
                        showConfirmButton: true,
                        confirmButtonText: 'Confirmar',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        customClass: 'swal2-overflow'
                    }).then((result) => {
                        if (result.value) {
                            motivo_rechazo = String($('#motivo_rechazo').val());

                            swal({
                              title: 'Confirmar cambio de status',
                              text: 'Se enviará notificación al CDS en caso de confirmar...',
                              showConfirmButton: true,
                              confirmButtonText: 'Confirmar',
                              showCancelButton: true,
                              cancelButtonText: 'Cancelar',
                              customClass: 'swal2-overflow',

                            }).then((result) => {
                                if (result.value) {
                                  this.cambioStatusCambioFisico(id, aprobacion);
                                  //Registro de notificación
                                  this.notificaciones.modulo = "/cambio-estatus-cambio-fisico-rechazado";
                                  this.notificaciones.descripcion = "El cambio físico del reporte No. " + id + " ha sido rechazado.<br /><br />Motivo: " + motivo_rechazo;
                                  this.registrarNotificacion(id);
                                }
                            });


                        }
                    });
                }else{
                  swal({
                      title: 'Confirmar cambio de status',
                      text: 'Se enviará notificación al CDS en caso de confirmar...',
                      showConfirmButton: true,
                      confirmButtonText: 'Confirmar',
                      showCancelButton: true,
                      cancelButtonText: 'Cancelar',
                      customClass: 'swal2-overflow',

                  }).then((result) => {
                      if (result.value) {
                        this.cambioStatusCambioFisico(id, aprobacion);
                        //Registro de notificación
                        this.notificaciones.modulo = "/cambio-estatus-cambio-fisico";
                        this.notificaciones.descripcion = "El cambio físico del reporte No. " + id + " ha sido " + aprobacion;
                        this.registrarNotificacion(id);
                      }
                  });
                }
            }
        });
    }

    cambioStatusRefacciones(id, noparte, disponibilidad=null, fechaentrega=null, costo=null, noguia=null) {
        console.log('enviando a cds');
        console.log(id);
        console.log(noparte);
        console.log(disponibilidad);
        console.log(fechaentrega);
        console.log("Costo ", costo);
        console.log("No de guía ", noguia);

        var params = {};
        params['IDReporte'] = id;
        params['NoParte'] = noparte;
        params['Existencia'] = disponibilidad;
        params['FechaEntrega'] = fechaentrega;
        params['Costo'] = costo;
        params['NoGuia'] = noguia;

        this.appstatus.loading = true;

        this._httpService.postJSON(params, 'administracion/set-status-refacciones.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);

                this.appstatus.loading = false;

                if (data.res == 'ok') {

                    this.refaccionesXAutorizar.recientes = this.parseJSON(data.reportes);
                    console.log('refacciones por autorizar');
                    console.log(this.refaccionesXAutorizar.recientes);

                    swal('¡Guardado!', 'Se ha enviado una notificacion al CDS.', 'success');


                } else if (data.res == 'error') {

                   // this.appstatus.mensaje = data.msg;
                    swal('¡Oops!', 'Hubo un error en el envío, por favor intenta de nuevo. ' + data.msg, 'error');
                }

            },
            error => {
                //alert(error);
                swal('¡Oops!', 'Hubo un error en el envío, por favor intenta de nuevo. ' + error, 'error');
            },
            () => console.log('termino submit')
            );



    }

    cambioStatusCotizaciones(id, noparte, aprobacion = null) {
        console.log('enviando a cds');
        console.log(id);
        console.log(noparte);
        console.log(aprobacion);

        var params = {};
        params['IDReporte'] = id;
        params['NoParte'] = noparte;
        params['Status'] = aprobacion;

        this.appstatus.loading = true;

        this._httpService.postJSON(params, 'administracion/set-status-cotizaciones.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);

                this.appstatus.loading = false;

                if (data.res == 'ok') {

                    this.cotizacionesXAutorizar.recientes = this.parseJSON(data.reportes);
                    console.log('cotizaciones por autorizar');
                    console.log(this.cotizacionesXAutorizar.recientes);

                    swal('¡Guardado!', 'Se ha enviado una notificacion al CDS.', 'success');

                    //Registro de notificación
                    this.notificaciones.modulo = "/registro-de-casos/reparacion/inicio";
                    this.notificaciones.descripcion = "Cotización con No. de parte " + noparte + " fue " + aprobacion;
                    this.registrarNotificacion(id);

                } else if (data.res == 'error') {

                    // this.appstatus.mensaje = data.msg;
                    swal('¡Oops!', 'Hubo un error en el envío, por favor intenta de nuevo. ' + data.msg, 'error');
                }

            },
            error => {
                //alert(error);
                swal('¡Oops!', 'Hubo un error en el envío, por favor intenta de nuevo. ' + error, 'error');
            },
            () => console.log('termino submit')
            );

    }

    cambioStatusMovilizaciones(id, aprobacion = null) {
        console.log('enviando a cds');
        console.log(id);
        console.log(aprobacion);

        var params = {};
        params['IDReporte'] = id;
        params['StatusMovilidad'] = aprobacion;

        this.appstatus.loading = true;

        this._httpService.postJSON(params, 'administracion/set-status-movilizaciones.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);

                this.appstatus.loading = false;

                if (data.res == 'ok') {

                    this.movilizacionesXAutorizar.recientes = this.parseJSON(data.reportes);
                    console.log('movilizaciones por autorizar');
                    console.log(this.movilizacionesXAutorizar.recientes);

                    swal('¡Guardado!', 'Se ha enviado una notificacion al CDS.', 'success');

                    //Registro de notificación
                    this.notificaciones.modulo = "/registro-de-casos/reparacion/inicio";
                    this.notificaciones.descripcion = "Movilización del repote No. " + id + " ha sido " + aprobacion;
                    this.registrarNotificacion(id);

                } else if (data.res == 'error') {

                    // this.appstatus.mensaje = data.msg;
                    swal('¡Oops!', 'Hubo un error en el envío, por favor intenta de nuevo. ' + data.msg, 'error');
                }

            },
            error => {
                //alert(error);
                swal('¡Oops!', 'Hubo un error en el envío, por favor intenta de nuevo. ' + error, 'error');
            },
            () => console.log('termino submit')
            );

    }


    cambioStatusCambioFisico(id, aprobacion = null) {
        console.log('enviando a cds');
        console.log(id);
        console.log(aprobacion);

        var params = {};
        params['IDReporte'] = id;
        params['StatusCambioFisico'] = aprobacion;

        this.appstatus.loading = true;

        this._httpService.postJSON(params, 'administracion/set-status-cambio-fisico.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);

                this.appstatus.loading = false;

                if (data.res == 'ok') {

                    this.cambiosFisicosXAutorizar.recientes = this.parseJSON(data.reportes);
                    console.log('cambios fisicos por autorizar');
                    console.log(this.cambiosFisicosXAutorizar.recientes);

                    if(this.user.nivel=='administrador')
                      swal('¡Guardado!', 'Se ha enviado una notificacion al CDS.', 'success');
                    else
                      swal('¡Guardado!', 'Se ha enviado una notificacion a HP.', 'success');



                } else if (data.res == 'error') {

                    // this.appstatus.mensaje = data.msg;
                    swal('¡Oops!', 'Hubo un error en el envío, por favor intenta de nuevo. ' + data.msg, 'error');
                }

            },
            error => {
                //alert(error);
                swal('¡Oops!', 'Hubo un error en el envío, por favor intenta de nuevo. ' + error, 'error');
            },
            () => console.log('termino submit')
            );

    }

    cambioStatusCostoLanded(id, aprobacion = null) {
        console.log('enviando a cds');
        console.log(id);
        console.log(aprobacion);

        var params = {};
        params['IDReporte'] = id;
        params['StatusCambioFisico'] = aprobacion;

        this.appstatus.loading = true;

        this._httpService.postJSON(params, 'administracion/set-status-costolanded.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);

                this.appstatus.loading = false;

                if (data.res == 'ok') {

                    this.cambiosFisicosXAutorizar.recientes = this.parseJSON(data.reportes);
                    console.log('cambios fisicos por autorizar');
                    console.log(this.cambiosFisicosXAutorizar.recientes);

                    swal('¡Guardado!', 'Se ha enviado una notificacion al Distribuidor.', 'success');


                } else if (data.res == 'error') {

                    // this.appstatus.mensaje = data.msg;
                    swal('¡Oops!', 'Hubo un error en el envío, por favor intenta de nuevo. ' + data.msg, 'error');
                }

            },
            error => {
                //alert(error);
                swal('¡Oops!', 'Hubo un error en el envío, por favor intenta de nuevo. ' + error, 'error');
            },
            () => console.log('termino submit')
            );

    }


    adjuntarOtraFactura() {
        this.adjuntos.FacturasNotasCompra.push('1');
    }
    eliminarFacturasNotasCompra(index) {
        console.log(index);
        console.log(this.adjuntos.FacturasNotasCompra);
        this.adjuntos.FacturasNotasCompra.splice(index, 1);
    }

    adjuntarOtraFotoProducto() {
        this.adjuntos.FotosProducto.push('1');
    }
    eliminarFotoProducto(index) {
        console.log(index);
        console.log(this.adjuntos.FotosProducto);
        this.adjuntos.FotosProducto.splice(index, 1);
    }

    adjuntarOtraFotoModeloSerie() {
        this.adjuntos.FotosModeloSerie.push('1');
    }
    eliminarFotoModeloSerie(index) {
        console.log(index);
        console.log(this.adjuntos.FotosModeloSerie);
        this.adjuntos.FotosModeloSerie.splice(index, 1);
    }

    adjuntarOtraFacturaRepuestos() {
        this.adjuntos.FacturasRespuestos.push('1');
    }
    eliminarFacturaRepuestos(index) {
        console.log(index);
        console.log(this.adjuntos.FacturasRespuestos);
        this.adjuntos.FacturasRespuestos.splice(index, 1);
    }

    adjuntarOtraOtros() {
        this.adjuntos.Otros.push('1');
    }
    eliminarOtros(index) {
        console.log(index);
        console.log(this.adjuntos.Otros);
        this.adjuntos.Otros.splice(index, 1);
    }

    resetReporte() {

        this.reporte = {
            "idreporte": "",
            "objreporte": {
                "AdjuntosFacturasNotasCompra": "",
                "AdjuntosFacturasRepuestos": "",
                "AdjuntosFotosModeloSerie": "",
                "AdjuntosOtros": "",
                "AdjuntosReciclaje": "",
                "AdjuntosFotosProducto": "",
                "AplicaGarantia": "",
                "Categoria": "",
                "CodigoSAP": "",
                "Comentarios": "",
                "Condicion": "",
                "CondicionProductoDiagnostico": "",
                "Descripcion": "",
                "Distribuidor": "",
                "Falla": "",
                "FallaDescripcion": "",
                "FechaCompra": "",
                "FechaCompraNF": "",
                "FechaDiagnostico": "",
                "FechaFactura": "",
                "FechaModificacionDiagnostico": "",
                "FechaModificacionOrdenServicio": "",
                "FechaModificacionReporte": "",
                "FechaOrdenServicio": "",
                "FechaRegistroReporte": "",
                "FechaRevision": "",
                "HomeProductsGroupNo": "",
                "IDCentro": "",
                "IDCentroAsigno": "",
                "IDCliente": "",
                "LugarCompra": "",
                "Modelo": "",
                "MontoDespiece": "",
                "MontoIVA": "",
                "MontoReciclaje": "",
                "MontoRefacciones": "",
                "MontoReparacion": "",
                "MontoMovilizacion": "",
                "MontoOtro": "",
                "MontoOtroDescripcion": "",
                "CostoLanded": "",
                "OtroCostoDistribuidor": "",
                "FechaEntregaCambio": "",
                "FechaCostoLanded": "",
                "MontoSubtotal": "",
                "MontoTotal": "",
                "MotivoCambioDiagnostico": "",
                "MotivoFallaDiagnostico": "",
                "NoFactura": "",
                "NoParteCausoDano": "",
                "NoSerie": "",
                "ObservacionesCDSDiagnostico": "",
                "Refacciones": "",
                "Resolucion": "",
                "Sello": "",
                "Status": "",
                "StatusReporte": "",
                "SubStatusReporte": "",
                "StatusMovilidad": "",
                "StatusCambioFisico": "",
                "StatusCostoLanded": "",
                "Subcategoria": "",
                "Tipo": "",
                "TipoCaso": "",
                "TipoMovilidad": "",
                "TipoReclamo": "",
                "TipoReclamoDiagnostico": "",
                "TipoReparacion": "",
                "TipoRevision": "",
                "Uso": "",
                "id": "",
                "Valor": "",
                "SubtipoServicio": "",
                "IDTarifas": "",
                "RequiereRecoleccion": ""
            },
            "objrefacciones": [],
            "participaciones": [],
        }
        if (localStorage.getItem('idreporte'))
            localStorage.setItem("idreporte", '');

        if (localStorage.getItem('objreporte'))
            localStorage.setItem("objreporte", '');

    }

    resetRefaccion() {
        this.refaccion = {
            "NombreRefaccion": "",
            "NoParte": "",
            "Diagrama": "",
            "Existencia": "",
            "Proveedor": "",
            "Nota": "",
            "Cantidad": "",
            "CostoUnitario": "",
            "CostoTotal": "",
            "FechaEntrega": "",
            "Costo": "",
            "NoGuia": "",
            "StatusCotizacion": "",
            "Status": ""
        }
    }

    setRefaccionesBd() {
        var refacciones = Object(this.reporte.objreporte).Refacciones;
        if (refacciones[0]) {
            console.log('set refacciones bd');
            console.log(JSON.parse(refacciones));
            this.refacciones = JSON.parse(refacciones);
        }
    }

    setAdjuntos() {
        console.log('set adjuntos');
        console.log(this.reporte.objreporte);
        try { this.AdjuntosFacturasNotasCompraArre = JSON.parse(Object(this.reporte.objreporte).AdjuntosFacturasNotasCompra); } catch (e) { };
        try { this.AdjuntosFotosModeloSerieArre = JSON.parse(Object(this.reporte.objreporte).AdjuntosFotosModeloSerie); } catch (e) { };
        try { this.AdjuntosFacturasRepuestosArre = JSON.parse(Object(this.reporte.objreporte).AdjuntosFacturasRepuestos); } catch (e) { };
        try { this.AdjuntosOtrosArre = JSON.parse(Object(this.reporte.objreporte).AdjuntosOtros); } catch (e) { };
        try { this.AdjuntosReciclajeArre = JSON.parse(Object(this.reporte.objreporte).AdjuntosReciclaje); } catch (e) { };

    }

    parseJSON(arre) {
        for (var i = 0; i < arre.length; i++) {
            arre[i] = JSON.parse(arre[i]);
        }
        console.log('parse json');
        console.log(arre);
        console.log('parse json end');
        return arre;
    }


    /********************************/


    setCliente(id, nav=null) {

        this.resetReporte();

        var params = {};
        params['id'] = id;
        this._httpService.postJSON(params, 'set-cliente.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);

                if (data.res == 'ok') {




                    //reset refacciones
                    this.refacciones = [];

                    this.cliente.objeto = JSON.parse(data.cliente);


                    localStorage.setItem("cliente", JSON.stringify(this.cliente));

                    console.log('set cliente123');
                    console.log(this.cliente);
                    //this.genericForm.reset();
                    //this.formulariostatus.success = 2;

                    if (nav != null) {
                        this._router.navigate([nav]);
                    }


                } else if (data.res == 'error') {

                    this.appstatus.mensaje = data.msg;

                }



            },
            error => alert(error),
            () => console.log('termino submit')
            );

        //localStorage.setItem("cliente", JSON.stringify(this._global.cliente));

    }

    setReporte(id, nav=null) {

        this.appstatus.loading = true;

        var params = {};
        params['id'] = id;
        this._httpService.postJSON(params, 'set-reporte.php')
            .subscribe(
            data => {
                console.log('data set reporte');
                console.log(data);

                this.appstatus.loading = false;

                if (data.res == 'ok') {

                    //reset refacciones
                    this.refacciones = [];

                    this.guardarIdReporte(data.idreporte);
                    this.guardarObjReporte(data.reporte);
                    //this.guardarRefacciones(data.refacciones);
                    this.cliente.objeto = JSON.parse(data.cliente);


                    localStorage.setItem("cliente", JSON.stringify(this.cliente));

                    console.log('set cliente reporte');
                    console.log(this.cliente);
                    //this.genericForm.reset();
                    //this.formulariostatus.success = 2;

                    //dirige a la pagina correcta
                    /*if (Object(this.reporte.objreporte).StatusReporte == 'Reporte') {
                        this._router.navigate(['registro-de-casos/reporte-de-caso']);
                    } else if (Object(this.reporte.objreporte).StatusReporte == 'Reparacion') {
                        this._router.navigate(['registro-de-casos/reparacion/inicio']);
                    }*/

                    if (nav == null) {
                        //seleccionar navegación de acuerdo al Status del Reporte
                        if (Object(this.reporte.objreporte).StatusReporte == "Reporte") {
                            this._router.navigate(['registro-de-casos/reparacion/inicio']);
                        } else if (Object(this.reporte.objreporte).StatusReporte == "Reparacion") {
                            this._router.navigate(['registro-de-casos/orden-de-servicio/inicio']);
                        } else if (Object(this.reporte.objreporte).StatusReporte == "Orden de Servicio") {
                            this._router.navigate(['registro-de-casos/orden-de-servicio/inicio']);
                        }

                    } else {
                        this._router.navigate([nav]);
                    }

                } else if (data.res == 'error') {

                    this.appstatus.mensaje = data.msg;

                }



            },
            error => alert(error),
            () => console.log('termino submit')
            );

        //localStorage.setItem("cliente", JSON.stringify(this._global.cliente));

    }

    verPerfil(id) {
        console.log(id);

        //reset reporte
        //this.resetReporte();

        this.setCliente(id, 'inicio/cliente/detalle');


    }

    seleccionarCliente(id) {
        console.log(id);

        //reset reporte
        //this.resetReporte();

        this.setCliente(id, 'registro-de-casos/reporte-de-caso');


    }

    seleccionarReporte(id, nav=null) {
        console.log(id);

        //seleccionar stage del reporte


        this.setReporte(id, nav);
        //console.log('reporte');
        //console.log(this.reporte);



        //this.setReporte(id, 'orden-de-servicio/inicio');

        //this._router.navigate(['registro-de-casos/reporte-de-caso']);





    }

    consultarOrdenServicio(id) {
        console.log(id);

        this.setReporte(id);

        //this._router.navigate(['registro-de-casos/reporte-de-caso']);



    }


    nuevoReporte() {
        console.log('');
        //reset reporte
        this.resetReporte();
        this._router.navigate(['registro-de-casos/reporte-de-caso']);
    }


    guardarIdReporte(id) {
        if(id != 'undefined'){
          console.log('guardar reporte');
          console.log(id);
          this.reporte.idreporte = id;
          localStorage.setItem("idreporte", String(id));
        }
    }

    guardarObjReporte(objReporte) {
        if (objReporte != 'undefined') {
            this.reporte.objreporte = JSON.parse(objReporte);
            localStorage.setItem("objreporte", objReporte);
            console.log('guardar obj reporte');
            console.log(this.reporte);
        }
    }

    guardarObjPagos(objPagos) {
        if (objPagos != 'undefined') {
            this.pagos.objpagos = JSON.parse(objPagos);
            localStorage.setItem("objpagos", objPagos);
            console.log('guardar obj pagos');
            console.log(this.pagos);
        }
    }

    guardarRefacciones(objRefacciones) {
        /*if (objRefacciones != 'undefined') {
            this.reporte.objrefacciones = objRefacciones;

            localStorage.setItem("objrefacciones", objRefacciones);

        }

        for (var i = 0; this.reporte.objrefacciones.length; i++) {
            //this.reporte.objrefacciones[i] = JSON.parse(this.reporte.objrefacciones[i]);
        }

        this.refacciones = this.reporte.objrefacciones;*/
        console.log('guardar refacciones');
        console.log(this.reporte);
    }

    setRefaccionesEnRevision() {
      console.log("refacciones.....", this.refacciones);
        for (var i = 0; i < this.refacciones.length; i++) {

            if (this.refacciones[i].Status == 'Por enviar') {

                this.refacciones[i].Status = 'En revisión';

                if (this.refacciones[i].Existencia == 'No Encontrada'){
                  //Registro de notificación
                  this.notificaciones.modulo = "/registro-de-casos/reparacion/inicio";
                  this.notificaciones.descripcion = "Refacción con No. de parte " + this.refacciones[i].NoParte + " solicitada para el reporte No. " + this.reporte.idreporte;
                  this.registrarNotificacion(this.reporte.idreporte);
                }
            }

        }

    }

    /////**************************INICIO******************************//////
    diasTranscurridosColor(fecha) {

        //console.log('fecha');

        fecha = fecha.replace(" 00:00:00", "");
        fecha = new Date(fecha);
        //console.log(fecha);

        var hoy = new Date();
        var diferencia = this.date_diff_indays(fecha, hoy);
        //console.log(diferencia);

        var res = {};
        if (diferencia <= 10) {
            res = { "bg-success": true };
        } else if (diferencia <= 20) {
            res = { "bg-warning": true };
        } else if (diferencia >= 21) {
            res = { "bg-danger": true };
        }

        return res;

        //{ "bg-danger": true };
    }

    diasTranscurridos(fecha) {

        //console.log('fecha');

        fecha = fecha.replace(" 00:00:00", "");
        fecha = new Date(fecha);
        //console.log(fecha);

        var hoy = new Date();
        var diferenciatxt = '';
        var diferencia = this.date_diff_indays(fecha, hoy);
        //console.log(diferencia);

        if (diferencia == 1) {
            diferenciatxt = diferencia + " día";
        } else {
            diferenciatxt = diferencia + " días";
        }


        return diferenciatxt;

        //{ "bg-danger": true };
    }

    date_diff_indays(date1, date2) {
        var dt1 = new Date(date1);
        var dt2 = new Date(date2);
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
    }


    /************************************************************ORDEN DE SERVICIO************************************************************************/

    separaFechaOrdenServicio() {
        console.log('separa fecha orden');
        var fechaOrden, fecha, hora, meses;

        meses = ['enero', 'febrero', 'marzo', 'abril','mayo','junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

        for (var i = 0; i < this.ordenesServicio.recientes.length; i++) {
            fechaOrden = this.ordenesServicio.recientes[i].FechaOrdenServicio;

            fechaOrden = fechaOrden.split(' ');
            fecha = fechaOrden[0];
            hora = fechaOrden[1];

            fecha = fecha.split('-');

            this.ordenesServicio.recientes[i].FechaOrdenAno = fecha[0];
            this.ordenesServicio.recientes[i].FechaOrdenMes = meses[parseInt(fecha[1])-1];
            this.ordenesServicio.recientes[i].FechaOrdenDia = fecha[2];

            this.ordenesServicio.recientes[i].FechaOrdenHora = hora;

            console.log("ordenes recientes", this.ordenesServicio.recientes[i]);



        }

    }


    /*****************************/
    clearMessages() {

        this.appstatus = {
            "loading": false,
            "titulo": "",
            "mensaje": "",
            "toasting": false,
            "toastmsg": "",
            "tipotoast": "",
            "toasturl": ""
        };

        this.busqueda = {
            "clientes": [],
            "buscar": false,
            "nuevo": false
        };

        /*this.reporte = {
            "idreporte": "",
            "objreporte": "",
        "objrefacciones": "",
            "participaciones": [],
        };*/


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

    saveSession(jsonstr: any) {
        console.log('save session');
        console.log(jsonstr);

        this.user.id = jsonstr.id;
        this.user.IDCentro = jsonstr.IDCentro;
        this.user.IDDistribuidor = jsonstr.IDDistribuidor;
        this.user.IDMaster = jsonstr.IDMaster;
        this.user.nombre = jsonstr.nombre;
        this.user.nivel = jsonstr.nivel;
        this.user.NombreCentro = jsonstr.NombreCentro;
        this.user.Red = jsonstr.Red;
        this.user.Categoria = jsonstr.Categoria;
        this.user.Pais = jsonstr.Pais;
        this.user.Ciudad = jsonstr.Ciudad;
        this.user.Direccion = jsonstr.Direccion;
        this.user.Telefono1 = jsonstr.Telefono1;
        this.user.Telefono2 = jsonstr.Telefono2;
        this.user.Telefono3 = jsonstr.Telefono3;
        this.user.Email = jsonstr.Email;
        this.user.Horarios = jsonstr.Horarios;
        this.user.Responsable = jsonstr.Responsable;
        this.user.TelefonoResponsable = jsonstr.TelefonoResponsable;
        this.user.IDGrupoTarifa = jsonstr.IDGrupoTarifa;
        this.user.IDDistribuidor = jsonstr.IDDistribuidor;
        this.user.CustomerID = jsonstr.CustomerID;
        this.user.ModoDePago = jsonstr.MedioDePago;

        console.log(this.user);

        localStorage.setItem('user', JSON.stringify(this.user));
    }

    canActivate() {
        var usertemp = JSON.parse(localStorage.getItem('user'));
        console.log('can activate');
        console.log(usertemp);

        if ( usertemp.id != '') {
            // logged in so return true
            return true;
        }

        this._router.navigate(['/']);

        return false;

    }

    logout() {
        this.user = {
            "id": "",
            "IDCentro": "",
            "IDMaster": "",
            "nombre": "",
            "usuario": "",
            "nivel": "",
            "NombreCentro": "",
            "Red": "",
            "Categoria": "",
            "Pais": "",
            "Ciudad": "",
            "Direccion": "",
            "Telefono1": "",
            "Telefono2": "",
            "Telefono3": "",
            "Email": "",
            "Horarios": "",
            "Responsable": "",
            "TelefonoResponsable": "",
            "IDGrupoTarifa": "",
            "IDDistribuidor": "",
            "CustomerID": "",
            "ModoDePago": ""
        };
        localStorage.setItem('user', JSON.stringify(this.user));


        this.cliente = {
            "id": "",
            "objeto": {
                "AMaterno": "",
                "APaterno": "",
                "CP": "",
                "CodigoPais": "",
                "Direccion": "",
                "Email": "",
                "FechaRegistro": "",
                "FechaRegistroNF": "",
                "IDEstado": "",
                "IDLocalidad": "",
                "IDMunicipio": "",
                "Movil": "",
                "NoExt": "",
                "NoInt": "",
                "Nombre": "",
                "OrigenContacto": "",
                "Pais": "",
                "RFC": "",
                "RazonSocial": "",
                "Status": "",
                "Telefono": "",
                "TipoPersona": "",
                "id" : "",
            },

        };
        localStorage.setItem('cliente', JSON.stringify(this.cliente));

        this._router.navigate(['/']);
    }


    toast(tipo, msg, url='', loading=false) {

        var outer = this;
        this.appstatus.toastmsg = msg;
        this.appstatus.tipotoast = tipo;
        this.appstatus.toasting = true;
        this.appstatus.toasturl = url;
        if(loading)
          this.appstatus.loading = true;

        clearTimeout(this.timerToast);

        this.timerToast = setTimeout(function () {
            outer.appstatus.toasting = false;
            outer.appstatus.toastmsg = '';
            outer.appstatus.tipotoast = '';
            outer.appstatus.loading = false;

            if (outer.appstatus.toasturl != '') {
                outer._router.navigate([outer.appstatus.toasturl]);
                outer.scrollTop();
            }

        }, 4000);

    }

    scrollTop() {
        window.scrollTo(0, 0);
    }

    getMes(str) {

        var mes = parseInt(str);
        return this.meses[mes - 1];

    }

    //Notificaciones
    contarNotificaciones(){
      var params = {};
      params['id_usuario'] = this.user.id;
      params['id_centro'] = this.user.IDCentro;
      params['nivel'] = this.user.nivel;
      params['IDDistribuidor'] = this.user.IDDistribuidor;
      params['CustomerID'] = this.user.CustomerID;

      console.log("contar notificaciones");
      this._httpService.postJSON(params, 'notificaciones/contar-notificaciones.php')
          .subscribe(
          data => {
              console.log('data notificaciones');
              console.log(data);

              if (data.res == 'ok') {
                this.notificaciones.nuevas = data.notificaciones;
                console.log("notificaciones", this.notificaciones.nuevas);
              } else if (data.res == 'error') {
                  this.appstatus.mensaje = data.msg;
              }
          },
          error => console.log("No hay notificaciones nuevas para el usuario.", error),
          () => console.log('termino submit')
          );

      //localStorage.setItem("cliente", JSON.stringify(this._global.cliente));
    }

    listarNotificaciones(){
      var params = {};
      params['id_usuario'] = this.user.id;
      params['id_centro'] = this.user.IDCentro;
      params['nivel'] = this.user.nivel;
      params['IDDistribuidor'] = this.user.IDDistribuidor;
      params['CustomerID'] = this.user.CustomerID;

      this.appstatus.loading = true;
      console.log("listar notificaciones");
      this._httpService.postJSON(params, 'notificaciones/listar-notificaciones.php')
          .subscribe(
          data => {
              console.log('data notificaciones');
              console.log(data);
              this.appstatus.loading = false;
              if (data.res == 'ok') {
                this.notificaciones.objnotificaciones = this.parseJSON(data.notificaciones);

                console.log('notificaciones');
                console.log(this.notificaciones.objnotificaciones);

              } else if (data.res == 'error') {
                  this.appstatus.mensaje = data.msg;
              }
          },
          error => alert(error),
          () => console.log('termino submit')
          );

      //localStorage.setItem("cliente", JSON.stringify(this._global.cliente));
    }

    registrarNotificacion(id_reporte = null, id_centro = null, id_distribuidor = null) {
        console.log('registrar notificación');

        var params = {};
        params['id_usuario'] = this.user.id;
        params['id_reporte'] = id_reporte;
        params['modulo'] = this.notificaciones.modulo;
        params['descripcion'] = this.notificaciones.descripcion;
        if(id_centro>0){
          params['id_centro'] = id_centro;
        }

        if(id_distribuidor>0){
          params['id_distribuidor'] = id_distribuidor;
        }

        console.log(params);

        this._httpService.postJSON(params, 'notificaciones/regisrtrar-notificacion.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);

                if (data.res == 'ok') {
                    console.log('notificación registrada');
                } else if (data.res = 'error') {
                    //this._global.appstatus.mensaje = data.error;
                }
                //console.log("fichas");
                //console.log(this.props.fichas);
            },
            error => alert(error),
            () => console.log('termino submit')
            );
    }
    //Fin Notificaciones

    muestraImagenNota(url_img, id){

      swal({
          title: 'Nota del Reporte #' + id,
          html: `<img class='img-fluid' src='`+this.base+`reparacion/uploads-reparaciones/`+url_img+`'>`,
          showConfirmButton: true,
          confirmButtonText: 'Ok',
          customClass: 'swal2-overflow',

      })

    }

    muestraImagenPago(url_img, mes, ano){

      swal({
          title: 'Evidencia Pago ' + mes + ' ' + ano,
          html: `<img class='img-fluid' src='`+this.base+`administracion/uploads-pagos/`+url_img+`'>`,
          showConfirmButton: true,
          confirmButtonText: 'Ok',
          customClass: 'swal2-overflow',

      })

    }

    esDistribuidor(){
      var flag = false;
      if(parseInt(this.user.IDDistribuidor) > 0){
        flag = true;
      }
      return flag;
    }


}
