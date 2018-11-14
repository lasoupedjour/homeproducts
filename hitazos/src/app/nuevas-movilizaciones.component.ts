import { Component, ElementRef, ViewChild } from '@angular/core';
import { HTTPService } from './services/http.service';
import { GlobalService } from './services/global.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { DataTableDirective } from 'angular-datatables-5';
import { Subject } from 'rxjs';
import { ISubscription } from "rxjs/Subscription";

@Component({
    selector: 'nuevasmovilizaciones',
    templateUrl: './nuevas-movilizaciones.component.html'
})

export class NuevasMovilizacionesComponent {
    title = 'app';

    dtOptions: any = {};
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    private subscription: ISubscription;

    trigger: Subject<any> = new Subject();

    //@ViewChild("Email") Email: ElementRef;

    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService) { }

    ngOnInit() {
        console.log('init');

        this._global.clearMessages();

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

        this.nuevasMovilizaciones();
    }

    nuevasMovilizaciones() {

        var params = {};
        params["IDCentro"] = this._global.user.IDCentro;
        params["nivel"] = this._global.user.nivel;
        params["limit"] = "5";

        this._global.appstatus.loading = true;
        console.log('nuevas refacciones');
        console.log(params);
        this._httpService.postJSON(params, 'administracion/nuevas-movilizaciones.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {


                    this._global.movilizacionesXAutorizar.recientes = this._global.parseJSON(data.reportes);
                    console.log('cotizaciones por autorizar');
                    console.log(this._global.movilizacionesXAutorizar.recientes);

                    if (data.reportes.length == 0) {
                        this._global.appstatus.mensaje = 'No se encontraron órdenes.';
                    }

                    setTimeout(() => {
                        //this.trigger.destroy();
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
}
