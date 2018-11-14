import { Component } from '@angular/core';
import { HTTPService } from './services/http.service';
import { GlobalService } from './services/global.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { userValidators } from './userValidators';

@Component({
    selector: 'registro',
    templateUrl: './registro.component.html'
})
export class RegistroComponent {
    title = 'app';
    genericForm: FormGroup;
    formaTrivia: FormGroup;

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
            MotivoLlamada: ['',
                Validators.required
            ],
            Nombrepadre: ['',
                Validators.required
            ],
            Nombrenino: ['',
                Validators.required
            ],
            Estado: ['',
                Validators.required
            ],
            IDMunicipio: ['',
                Validators.required
            ],
            Telefono: ['',
                Validators.required
            ],
            Email: ['', Validators.compose([
                Validators.required,
                Validators.email
            ])],
            Comentarios: ['',
                Validators.required
            ],
            NoTieneEmail: [''],
            Codigo: [''],
           

        });

        this.formaTrivia = this.formBuilder.group({
            /*usuario: ['', Validators.compose([
                Validators.required,
                Validators.email
            ])],*/
            r1: ['',
                Validators.required
            ],
            r2: ['',
                Validators.required
            ],
            r3: ['',
                Validators.required
            ],
            r4: ['',
                Validators.required
            ],
            r5: ['',
                Validators.required
            ],




        });


        

    }


    randomBetween(arre) {
        var size = arre.length + 1;
        console.log('tamano');
        console.log(size);
        var rand = Math.floor(Math.random() * size);
        console.log(rand);
        return rand;
    }

    seleccionaPreguntas() {

        var temp = this.formulariostatus.preguntas;
        var randsSeleccionados = [];

        for (var i = 0; i < 5; i++) {
            var rand = this.randomBetween(this.formulariostatus.preguntas);


            while (randsSeleccionados.includes(rand)) {
                rand = this.randomBetween(this.formulariostatus.preguntas);
            }
            console.log(rand);
            randsSeleccionados.push(rand);

            this.formulariostatus.preguntasSeleccionadas[i] = temp[rand];
        }

        //console.log(this.formulariostatus.preguntasSeleccionadas);

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

    changeMotivoLlamada() {

        console.log('change motivo llamada');
        //console.log(this.genericForm.controls.EstadoCompra.value)
        switch (this.genericForm.controls.MotivoLlamada.value) {
            case "Registro Ticket":
                this.formulariostatus.mostrarDatosCompra = true;
                this.formulariostatus.registroCompra = true;


                this.genericForm.controls.Codigo.setValidators([Validators.required]);
                this.genericForm.controls.Codigo.updateValueAndValidity();


                this.genericForm.controls.Comentarios.setValidators([]);
                this.genericForm.controls.Comentarios.updateValueAndValidity();

                break;
            case "Monitoreo/prueba datos compra":
                this.formulariostatus.mostrarDatosCompra = true;
                this.formulariostatus.registroCompra = true;

                this.genericForm.controls.Codigo.setValidators([Validators.required]);
                this.genericForm.controls.Codigo.updateValueAndValidity();


                this.genericForm.controls.Comentarios.setValidators([]);
                this.genericForm.controls.Comentarios.updateValueAndValidity();

                break;
            default:
                this.formulariostatus.mostrarDatosCompra = false;
                this.formulariostatus.registroCompra = false;

                this.genericForm.controls.Codigo.setValidators([]);
                this.genericForm.controls.Codigo.updateValueAndValidity();


                this.genericForm.controls.Comentarios.setValidators([Validators.required]);
                this.genericForm.controls.Comentarios.updateValueAndValidity();

                break;

        }

    }

    changeEstado() {

        //console.log('change estado');
        //console.log(this.genericForm.controls.EstadoCompra.value)
        console.log(this.genericForm.controls.Estado.value);
        var params = {};
        params['IDEstado'] = this.genericForm.controls.Estado.value;
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

    submitRegistro() {

        if (this.genericForm.valid) {
            console.log('submit registro');

            this._global.clearMessages();

            var params = {};
            params['MotivoLlamada'] = this.genericForm.controls.MotivoLlamada.value;
            params['Nombrepadre'] = this.genericForm.controls.Nombrepadre.value;
            params['Nombrenino'] = this.genericForm.controls.Nombrenino.value;
            params['Estado'] = this.genericForm.controls.Estado.value;
            params['IDMunicipio'] = this.genericForm.controls.IDMunicipio.value;
            params['Telefono'] = this.genericForm.controls.Telefono.value;
            params['Email'] = this.genericForm.controls.Email.value;
            params['Comentarios'] = this.genericForm.controls.Comentarios.value;
            params['Codigo'] = this.genericForm.controls.Codigo.value;
            params['IDUsuario'] = this._global.user.id;
            params['NoTieneEmail'] = this.genericForm.controls.NoTieneEmail.value;
            


            this._global.appstatus.loading = true;

            this._httpService.postJSON(params, 'registronuevo.php')
                .subscribe(
                data => {
                    console.log('data');
                    console.log(data);
                    this._global.appstatus.loading = false;

                    if (data.res == 'ok') {

                        this.formulariostatus.datosparticipante = data.participante;
                        this.formulariostatus.idparticipante = data.idparticipante;
                        this.formulariostatus.codigo = params['Codigo'];
                        this.formulariostatus.id_llamada = data.id_llamada;

                        this.formulariostatus.preguntas = data.preguntas;
                        this.seleccionaPreguntas();



                        this.genericForm.reset();

                        if(data.tipo == 'ticket')
                            this.formulariostatus.success = 1.5;
                        else
                            this.formulariostatus.success = 4;

                        
                        



                    } else if (data.res == 'error') {

                        this._global.appstatus.mensaje = data.error;

                    }


                    //console.log("fichas");
                    //console.log(this.props.fichas);
                },
                error => alert(error),
                () => console.log('termino submit')
                );


        } else {
            this._global.validateAllFormFields(this.genericForm);
        }
    }


    comenzarTrivia() {
        console.log('Comenzar trivia');
        var params = {};

        params['IDParticipante'] = this.formulariostatus.idparticipante;
        params['Codigo'] = this.formulariostatus.codigo;
        params['IDLlamada'] = this.formulariostatus.id_llamada;


        this._global.appstatus.loading = true;

        this._httpService.postJSON(params, 'comienzatrivia.php')
            .subscribe(
            data => {
                console.log('data');
                console.log(data);
                this._global.appstatus.loading = false;

                if (data.res == 'ok') {
                    this.formulariostatus.success = 2
                } else if (data.res == 'error') {
                    this._global.appstatus.mensaje = data.error;
                }


                //console.log("fichas");
                //console.log(this.props.fichas);
            },
            error => alert(error),
            () => console.log('termino submit')
            );
    }



    calculaAciertos() {

        //console.log(this.formaTrivia);
        var aciertos = 0;

        if (this.formulariostatus.preguntasSeleccionadas[0].correcta == this.formaTrivia.controls.r1.value) {
            aciertos++;
        }
        if (this.formulariostatus.preguntasSeleccionadas[1].correcta == this.formaTrivia.controls.r2.value) {
            aciertos++;
        }
        if (this.formulariostatus.preguntasSeleccionadas[2].correcta == this.formaTrivia.controls.r3.value) {
            aciertos++;
        }
        if (this.formulariostatus.preguntasSeleccionadas[3].correcta == this.formaTrivia.controls.r4.value) {
            aciertos++;
        }
        if (this.formulariostatus.preguntasSeleccionadas[4].correcta == this.formaTrivia.controls.r5.value) {
            aciertos++;
        }

        return aciertos;

    }

    submitTrivia() {

        if (this.formaTrivia.valid) {

            this._global.clearMessages();

            console.log('submit registro participacion');
            var params = {};
            params['p1'] = this.formulariostatus.preguntasSeleccionadas[0].id;
            params['p2'] = this.formulariostatus.preguntasSeleccionadas[1].id;
            params['p3'] = this.formulariostatus.preguntasSeleccionadas[2].id;
            params['p4'] = this.formulariostatus.preguntasSeleccionadas[3].id;
            params['p5'] = this.formulariostatus.preguntasSeleccionadas[4].id;


            params['r1'] = this.formaTrivia.controls.r1.value;
            params['r2'] = this.formaTrivia.controls.r2.value;
            params['r3'] = this.formaTrivia.controls.r3.value;
            params['r4'] = this.formaTrivia.controls.r4.value;
            params['r5'] = this.formaTrivia.controls.r5.value;

            params['aciertos'] = this.calculaAciertos();

            params['IDParticipante'] = this.formulariostatus.idparticipante;

            params['IDUsuario'] = this._global.user.id;

            params['IDLlamada'] = this.formulariostatus.id_llamada;
            params['Codigo'] = this.formulariostatus.codigo;


            console.log(params);

            this._global.appstatus.loading = true;

            this._httpService.postJSON(params, 'registroparticipacion.php')
                .subscribe(
                data => {
                    console.log('data');
                    console.log(data);
                    this._global.appstatus.loading = false;

                    if (data.res == 'ok') {

                        this.formaTrivia.reset();
                        this.formulariostatus.success = 3;

                     
                        this.formulariostatus.tiempo = data.tiempo;

                    } else if (data.res == 'error') {

                        this._global.appstatus.mensaje = data.error;

                    }


                    //console.log("fichas");
                    //console.log(this.props.fichas);
                },
                error => alert(error),
                () => console.log('termino submit')
                );


        } else {
            this._global.validateAllFormFields(this.genericForm);
        }
    }



}


