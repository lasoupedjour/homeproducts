import { Component } from '@angular/core';
import { HTTPService } from './services/http.service';
import { GlobalService } from './services/global.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']


})
export class AppComponent {
    currentPage = '';
    nameApp = '';

    constructor(
        public formBuilder: FormBuilder,
        public _httpService: HTTPService, public _router: Router, public _global: GlobalService) {
          var currentURL = window.location.href;
          var location_href = currentURL.split("/");
          this.currentPage = location_href[location_href.length-1];
          console.log("this.currentPage", this.currentPage);
          if(this.currentPage!=''){
            this.nameApp = 'Oster Solution Center';
          }
        }

    ngOnInit() {
      console.log("init app.component");
      this._global.contarNotificaciones();
    }

    logout() {
        console.log('logging out');
        this._global.logout();
    }


}
