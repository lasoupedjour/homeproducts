import { Component, ElementRef, ViewChild } from '@angular/core';
import { HTTPService } from './services/http.service';
import { GlobalService } from './services/global.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables-5';
import { Subject } from 'rxjs';
import { ISubscription } from "rxjs/Subscription";

@Component({
    selector: 'clientes',
    templateUrl: './clientes.component.html'
})
export class ClientesComponent {


    title = 'app';
    genericForm: FormGroup;

    @ViewChild("Email") Email: ElementRef;

    private subscription: ISubscription;
    trigger: Subject<any> = new Subject();

    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService) { }

    ngOnInit() {
        console.log('init');

        this._global.clearMessages();

        this.genericForm = this.formBuilder.group({
            /*usuario: ['', Validators.compose([
                Validators.required,
                Validators.email
            ])],*/
            TipoBusqueda: [''],
            IDCliente: [''],
            IDOrden: [''],
            IDReporte: [''],
            Nombre: [''],
            APaterno: [''],
            AMaterno: [''],
            RazonSocial: [''],
            Email: [''],
 
            
        });

        this.nuevosClientes();

    }

    nuevosClientes() {

        var params = {};
        params["Pais"] = this._global.user.Pais;
        params["nivel"] = this._global.user.nivel;
        params["IDCentro"] = this._global.user.IDCentro;


        this._global.appstatus.loading = true;

        this._httpService.postJSON(params, 'inicio/todos-clientes.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {

                    this._global.clientes.recientes = this._global.parseJSON(data.clientes);
                    console.log(this._global.busqueda.clientes);

                    if (data.clientes.length == 0) {
                        this._global.appstatus.mensaje = 'No se encontraron clientes con estos datos.';
                    }

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

    ngOnDestroy() {
        console.log('destroy');
        //this.subscription.unsubscribe();
        this.trigger.unsubscribe();
    }


}


