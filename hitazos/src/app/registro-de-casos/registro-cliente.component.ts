import { Component } from '@angular/core';
import { HTTPService } from '../services/http.service';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { userValidators } from '../userValidators';

@Component({
    selector: 'registrocliente',
    templateUrl: './registro-cliente.component.html'
})
export class RegistroClienteComponent {
    title = 'app';
    genericForm: FormGroup;

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
        "respuestas": []
    };

    status = {

        "paso": 1,


    }

    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService) { }

    ngOnInit() {
        console.log('init registro');
        console.log(this._global.user);


        this.genericForm = this.formBuilder.group({
            /*usuario: ['', Validators.compose([
                Validators.required,
                Validators.email
            ])],*/
            OrigenContacto: ['',
                Validators.required
            ],
            TipoPersona: ['',
                Validators.required
            ],
            /*RFC: ['',
                Validators.required
            ],*/
            RazonSocial: ['',
                Validators.required
            ],
            Nombre: ['',
                Validators.required
            ],
            APaterno: ['',
                Validators.required
            ],
            AMaterno: [''],
            FechaNacimiento: [''],
            Pais: ['',
                Validators.required
            ],
            IDEstado: ['',
                Validators.required
            ],
            IDMunicipio: ['',
                Validators.required
            ],
            IDLocalidad: ['',
                Validators.required
            ],
            CP: [''],
            Direccion: ['',
                Validators.required
            ],
            NoExt: [''],
            NoInt: [''],
            CodigoPais: ['',
                Validators.required
            ],
            Telefono: ['',
                Validators.required
            ],
            Movil: ['',

            ],
            Email: ['', Validators.email],
            NoReferencia: ['',

            ],
            /*Email: ['', Validators.compose([
                Validators.required,
                Validators.email
            ])],*/
            /*NoTieneEmail: [''],*/



        });


        this.precargaPaises();



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
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {

                    this._global.paises = this._global.parseJSON(data.paises);

                    console.log('paises');
                    console.log(this._global.paises);

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


    randomBetween(arre) {
        var size = arre.length + 1;
        console.log('tamano');
        console.log(size);
        var rand = Math.floor(Math.random() * size);
        console.log(rand);
        return rand;
    }



    changeNoTieneEmail() {
        //console.log('change no tiene email');
        //console.log(this.genericForm.controls.NoTieneEmail.value);
        if (this.genericForm.controls.NoTieneEmail.value) {
            this.genericForm.controls.Email.setValidators([]);
            this.genericForm.controls.Email.updateValueAndValidity();
        } else {
            this.genericForm.controls.Email.setValidators([Validators.required]);
            this.genericForm.controls.Email.updateValueAndValidity();
        }

    }

    changeTipoPersona() {

        console.log('change tipo persona');
        switch (this.genericForm.controls.TipoPersona.value) {
            case "Empresa":

                /*this.genericForm.controls.RFC.setValidators([Validators.required]);
                this.genericForm.controls.RFC.updateValueAndValidity();*/
                this.genericForm.controls.RazonSocial.setValidators([Validators.required]);
                this.genericForm.controls.RazonSocial.updateValueAndValidity();

                this.genericForm.controls.Nombre.setValidators([]);
                this.genericForm.controls.Nombre.setValue('');
                this.genericForm.controls.Nombre.updateValueAndValidity();
                this.genericForm.controls.APaterno.setValidators([]);
                this.genericForm.controls.APaterno.setValue('');
                this.genericForm.controls.APaterno.updateValueAndValidity();
                this.genericForm.controls.AMaterno.setValidators([]);
                this.genericForm.controls.AMaterno.setValue('');
                this.genericForm.controls.AMaterno.updateValueAndValidity();

                break;

            case "Persona Física":
                /*this.genericForm.controls.RFC.setValidators([]);
                this.genericForm.controls.RFC.setValue('');
                this.genericForm.controls.RFC.updateValueAndValidity();*/
                this.genericForm.controls.RazonSocial.setValidators([]);
                this.genericForm.controls.RazonSocial.setValue('');
                this.genericForm.controls.RazonSocial.updateValueAndValidity();

                this.genericForm.controls.Nombre.setValidators([Validators.required]);
                this.genericForm.controls.Nombre.updateValueAndValidity();
                this.genericForm.controls.APaterno.setValidators([Validators.required]);
                this.genericForm.controls.APaterno.updateValueAndValidity();
                this.genericForm.controls.AMaterno.setValidators([Validators.required]);
                this.genericForm.controls.AMaterno.updateValueAndValidity();

                break;


        }


    }



    changePais() {
        this.genericForm.controls.IDEstado.setValue('');
        this.genericForm.controls.IDMunicipio.setValue('');
        this.genericForm.controls.IDLocalidad.setValue('');
        this.genericForm.controls.CP.setValue('');

    }

    changeEstado() {
        //console.log('change estado');
        //console.log(this.genericForm.controls.EstadoCompra.value)
        console.log(this.genericForm.controls.IDEstado.value);
        var params = {};
        params['IDEstado'] = this.genericForm.controls.IDEstado.value;
        this._global.appstatus.loading = true;

        this._httpService.postHTML(params, 'cambiaEstado.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);

                this._global.appstatus.loading = false;
                document.getElementById('IDMunicipio').innerHTML = data;
                //console.log("fichas");
                //console.log(this.props.fichas);
            },
            error => alert(error),
            () => console.log('termino submit')
            );
    }

    changeMunicipio() {
        //console.log('change estado');
        //console.log(this.genericForm.controls.EstadoCompra.value)
        console.log(this.genericForm.controls.IDEstado.value);
        var params = {};
        params['IDEstado'] = this.genericForm.controls.IDEstado.value;
        params['IDMunicipio'] = this.genericForm.controls.IDMunicipio.value;
        this._global.appstatus.loading = true;

        this._httpService.postHTML(params, 'cambiaMunicipio.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);

                this._global.appstatus.loading = false;
                document.getElementById('IDLocalidad').innerHTML = data;
                //console.log("fichas");
                //console.log(this.props.fichas);
            },
            error => alert(error),
            () => console.log('termino submit')
            );
    }

    changeLocalidad() {
        //console.log('change IDEstado');
        //console.log(this.genericForm.controls.EstadoCompra.value)
        console.log(this.genericForm.controls.IDEstado.value);
        var params = {};
        params['IDEstado'] = this.genericForm.controls.IDEstado.value;
        params['IDMunicipio'] = this.genericForm.controls.IDMunicipio.value;
        params['IDLocalidad'] = this.genericForm.controls.IDLocalidad.value;
        this._global.appstatus.loading = true;

        this._httpService.postHTML(params, 'cambiaLocalidad.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);

                this._global.appstatus.loading = false;
                this.genericForm.controls.CP.setValue(data);
                //console.log("fichas");
                //console.log(this.props.fichas);
            },
            error => alert(error),
            () => console.log('termino submit')
            );
    }

    submitRegistro() {
        console.log('submit prevalidation');

        if (this.genericForm.valid) {

            console.log('submit registro');
            this._global.clearMessages();

            console.log(this.genericForm.getRawValue());

            var params = {};
            params = this.genericForm.getRawValue();
            params["IDUsuario"] = this._global.user.id;

            if(parseFloat(this._global.user.IDDistribuidor)>0)
              params["IDCentro"] = 0;
            else
              params["IDCentro"] = this._global.user.IDCentro;

            params["IDDistribuidor"] = this._global.user.IDDistribuidor;

            console.log("Registrar cliente>>>>>>", params);
            this._global.appstatus.loading = true;

            this._httpService.postJSON(params, 'registro-de-casos/registro-cliente.php')
                .subscribe(
                data => {
                    console.log('data');
                    console.log(data);
                    this._global.appstatus.loading = false;

                    if (data.res == 'ok') {


                        this._global.setCliente(data.idcliente, null);


                        this.genericForm.reset();
                        this.formulariostatus.success = 2;

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
