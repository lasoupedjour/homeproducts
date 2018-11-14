import { Component } from '@angular/core';
import { GlobalService } from './services/global.service';
import { HTTPService } from './services/http.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent{
    title = 'app';
    loginForm: FormGroup;

    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService) { }

    ngOnInit() {
        console.log('init');

        this.loginForm = this.formBuilder.group({
            /*usuario: ['', Validators.compose([
                Validators.required,
                Validators.email
            ])],*/
            usuario: ['',
                Validators.required
            ],
            pwd: ['',
                Validators.required
            ],
        });

    }

    submitLogin() {
       
        if (this.loginForm.valid) {
            console.log('submit login');
            var params = {};
            params['usuario'] = this.loginForm.controls.usuario.value;
            params['pwd'] = this.loginForm.controls.pwd.value;

            this._global.appstatus.loading = true;

            this._httpService.postJSON(params, 'login.php')
                .subscribe(
                data => {
                    console.log('data');
                    console.log(data);
                    this._global.appstatus.loading = false;

                    if (data.res == 'ok') {

                        this._global.saveSession(data);
                        this._router.navigate(['inicio']);

                    } else {
                        this._global.appstatus.mensaje = "Usuario o contraseña inválidos."
                    }


                    //console.log("fichas");
                    //console.log(this.props.fichas);
                },
                error => alert(error),
                () => console.log('termino submit')
                );


        } else {
            this._global.validateAllFormFields(this.loginForm); 
        }
    }



}


