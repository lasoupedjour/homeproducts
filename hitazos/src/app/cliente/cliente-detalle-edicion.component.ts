import { Component } from '@angular/core';
import { HTTPService } from '../services/http.service';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { userValidators } from '../userValidators';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'clientedetalleedicion',
    templateUrl: './cliente-detalle-edicion.component.html'
})
export class ClienteDetalleEdicionComponent {
    title = 'app';
    genericForm: FormGroup;

    modelfechanacimiento: NgbDateStruct;

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

        console.log('*******Cliente*********');
        console.log(this._global.cliente.objeto);

        this.genericForm = this.formBuilder.group({
            /*usuario: ['', Validators.compose([
                Validators.required,
                Validators.email
            ])],*/
            OrigenContacto: [Object(this._global.cliente.objeto).OrigenContacto],
            TipoPersona: [Object(this._global.cliente.objeto).TipoPersona,
                Validators.required
            ],
            /*RFC: ['',
                Validators.required
            ],*/
            RazonSocial: [Object(this._global.cliente.objeto).RazonSocial,
                Validators.required
            ],
            Nombre: [Object(this._global.cliente.objeto).Nombre,
                Validators.required
            ],
            APaterno: [Object(this._global.cliente.objeto).APaterno,
                Validators.required
            ],
            AMaterno: [Object(this._global.cliente.objeto).AMaterno,
                Validators.required
            ],
            FechaNacimiento: [Object(this._global.cliente.objeto).FechaNacimiento],
            Pais: [Object(this._global.cliente.objeto).Pais,
                Validators.required
            ],
            IDEstado: [Object(this._global.cliente.objeto).IDEstado,
                Validators.required
            ],
            IDMunicipio: [Object(this._global.cliente.objeto).IDMunicipio,
                Validators.required
            ],
            IDLocalidad: [Object(this._global.cliente.objeto).IDLocalidad,
                Validators.required
            ],
            CP: [Object(this._global.cliente.objeto).CP,
                Validators.required
            ],
            Direccion: [Object(this._global.cliente.objeto).Direccion,
                Validators.required
            ],
            NoExt: [Object(this._global.cliente.objeto).NoExt],
            NoInt: [Object(this._global.cliente.objeto).NoInt],
            CodigoPais: [Object(this._global.cliente.objeto).CodigoPais,
                Validators.required
            ],
            Telefono: [Object(this._global.cliente.objeto).Telefono,
                Validators.required
            ],
            Movil: [Object(this._global.cliente.objeto).Movil,

            ],
            Email: [Object(this._global.cliente.objeto).Email,
                Validators.email
            ],
            NoReferencia: [Object(this._global.cliente.objeto).NoReferencia,
            ],
            /*Email: ['', Validators.compose([
                Validators.required,
                Validators.email
            ])],*/
            /*,
            NoReferencia: [Object(this._global.cliente.objeto).NoReferencia,
            Validators.required
            ]*/
            /*NoTieneEmail: [''],*/



        });
        this.changeTipoPersona();
        //this.modelfechanacimiento = Object(this._global.cliente.objeto).FechaNacimiento;

        var fecha = Object(this._global.cliente.objeto).FechaNacimiento;
        fecha = fecha.split('-');

        var fechatemp = {
            day: parseInt(fecha[2]),
            month: parseInt(fecha[1]),
            year: parseInt(fecha[0])
        };

        this.modelfechanacimiento = { year: fechatemp.year, month: fechatemp.month, day: fechatemp.day };

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
                //this.genericForm.controls.FechaNacimiento.valid = true;

                this.genericForm.controls.FechaNacimiento.setValidators([]);
                this.genericForm.controls.FechaNacimiento.setValue('');
                this.genericForm.controls.FechaNacimiento.updateValueAndValidity();

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
        console.log('submit prevalidation valid', this.genericForm.valid);

        if (this.genericForm.valid) {

            console.log('submit registro');
            this._global.clearMessages();

            console.log(this.genericForm.getRawValue());

            var params = {};
            params = this.genericForm.getRawValue();
            params["Update"] = true;
            params["IDCliente"] = Object(this._global.cliente.objeto).id;
            params["IDUsuario"] = this._global.user.id;

            this._global.appstatus.loading = true;

            this._httpService.postJSON(params, 'registro-de-casos/registro-cliente.php')
                .subscribe(
                data => {
                    console.log('data');
                    console.log(data);
                    this._global.appstatus.loading = false;

                    if (data.res == 'ok') {


                        this._global.setCliente(data.idcliente);


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
