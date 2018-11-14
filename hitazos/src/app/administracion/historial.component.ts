import { Component, ElementRef, ViewChild } from '@angular/core';
import { HTTPService } from '../services/http.service';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
    selector: 'historial',
    templateUrl: './historial.component.html'
})
export class HistorialComponent {
    title = 'app';
    
    monto = 0;

    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService) { }

    ngOnInit() {
        console.log('init');

        this._global.clearMessages();

        //this.traeOrdenes();

        this.traePagos();
       
    }

    traePagos() {
        var params = {};
        this._httpService.postJSON(params, 'administracion/trae-pagos.php')
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


    

    traeOrdenes() {

        var params = {};
        
        this._global.appstatus.loading = true;

        this._httpService.postJSON(params, 'administracion/resumen-de-servicios.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {


                    this._global.ordenesServicio.recientes = this._global.parseJSON(data.reportes);

                    this._global.separaFechaOrdenServicio();

                    /*console.log(this._global.busqueda.clientes);

                    if (data.clientes.length == 0) {
                        this._global.appstatus.mensaje = 'No se encontraron clientes con estos datos.';
                    }*/

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


    generaReporte() {
        console.log('genera reporte');

        this._router.navigate(['administracion/historial-de-pagos']); 

    }

    guardaCambios() {

    }


    

}


