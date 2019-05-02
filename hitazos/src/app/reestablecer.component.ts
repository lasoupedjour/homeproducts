import { Component } from '@angular/core';
import { GlobalService } from './services/global.service';
import { HTTPService } from './services/http.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'reestablecer',
  templateUrl: './reestablecer.component.html'
})
export class ReestablecerComponent{
    title = 'app';
    reestablecerForm: FormGroup;

    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService) { }

    ngOnInit() {
        console.log('init reestablecer');

        this.reestablecerForm = this.formBuilder.group({
            pwd: ['',
                Validators.required
            ],
            pwd2: ['',
                Validators.required
            ],
            codigo: [''],
        });

        var query = window.location.search.substring(1);
        var vars = query.split("&");
        var query_string = {};
        for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split("=");
          var key = decodeURIComponent(pair[0]);
          var value = decodeURIComponent(pair[1]);
          // If first entry with this name
          if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
            // If second entry with this name
          } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
            // If third or later entry with this name
          } else {
            query_string[key].push(decodeURIComponent(value));
          }
        }

        this.reestablecerForm.controls.codigo.setValue(query_string["codigo"]);
    }

    submitLogin() {

        if (this.reestablecerForm.valid) {
            console.log('submit reestablecer');
            var params = {};
            params['pwd'] = this.reestablecerForm.controls.pwd.value;
            params['codigo'] = this.reestablecerForm.controls.codigo.value;

            if(this.reestablecerForm.controls.pwd.value!=this.reestablecerForm.controls.pwd2.value){
              this._global.appstatus.mensaje = "Las contraseñas deben coincidir."
            }else{
              this._global.appstatus.loading = true;

              this._httpService.postJSON(params, 'reestablecer.php')
                  .subscribe(
                  data => {
                      console.log('data');
                      console.log(data);
                      this._global.appstatus.loading = false;

                      if (data.res == 'ok') {

                          //this._global.saveSession(data);
                          //this._router.navigate(['inicio']);

                      } else {
                          this._global.appstatus.mensaje = "Usuario o contraseña inválidos."
                      }

                      //console.log("fichas");
                      //console.log(this.props.fichas);
                  },
                  error => alert(error),
                  () => console.log('termino submit')
                  );
            }

        } else {
            this._global.validateAllFormFields(this.reestablecerForm);
        }
    }



}
