import { Component } from '@angular/core';
import { HTTPService } from './services/http.service';
import { GlobalService } from './services/global.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'reporte',
    templateUrl: './reporte.component.html'
})
export class ReporteComponent {
    title = 'app';
    genericForm: FormGroup;


    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService) { }

    ngOnInit() {
        console.log('init');

        this._global.clearMessages();


        var params = {};

        //this._global.appstatus.loading = true;

        this._httpService.postJSON(params, 'reporte-participaciones.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                //this._global.appstatus.loading = false;

                if (data.res == 'ok') {


                    for (var i = 0; i < data.participaciones.length; i++) {

                        data.participaciones[i] = JSON.parse(data.participaciones[i]);
                    }

                    this._global.reporte.participaciones = data.participaciones;

                    console.log(this._global.reporte.participaciones);

                    if (data.participaciones.length == 0) {
                        this._global.appstatus.mensaje = 'No se encontraron participaciones.';
                    }

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


