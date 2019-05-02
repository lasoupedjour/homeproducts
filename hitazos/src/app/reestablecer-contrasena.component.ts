import { Component } from '@angular/core';
import { GlobalService } from './services/global.service';
import { HTTPService } from './services/http.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'login',
  templateUrl: './reestablecer-contrasena.component.html'
})
export class ReestablecerContrasenaComponent{
    title = 'app';
    reestablecerForm: FormGroup;

    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService) { }

    ngOnInit() {
        console.log('init');

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

        this.reestablecerForm.controls.codigo.setValue(query_string["c"]);
        //alert(query_string["c"]);

    }

    submitForm() {

        if (this.reestablecerForm.valid) {
            console.log('submit login');
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
                          swal("Contraseña actualziada","Hemos actualizado la contraseña, ahora puedes ingresar a tu cuenta.", "success");
                          this._router.navigate(['inicio']);
                      } else {
                        swal("Recuperación de contraseña","Ha ocurrido un error, favor de intentarlo más tarde.", "warning");
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
