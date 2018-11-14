import { Component, ElementRef, ViewChild } from '@angular/core';
import { HTTPService } from '../services/http.service';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
    selector: 'notificaciones',
    templateUrl: './listado.component.html'
})
export class NotificacionesComponent {
    title = 'app';

    constructor(
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService) { }

    ngOnInit() {
        console.log('init');

        this._global.clearMessages();

        //this.traeOrdenes();

        this._global.listarNotificaciones();

    }

}
