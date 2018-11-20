import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class HTTPService {


    //base = '';
    //base = 'http://apps.pautacreativatemporales.com.mx/oster/homeproducts/servicios/';
    base = 'https://www.homeproductslatam.com.mx/servicios/';
    //base = 'http://oster:8080/homeproducts/homeproducts/servicios/';

    constructor(public _http: Http) { }

    getCurrentTime() {
        return this._http.get('http://date.jsontest.com')
            .map(res => res.json())
    }

    /*postJSON() {
        var json = JSON.stringify({ var1: 'adf', var2: 3 });
        var params = 'json=' + json;
        var headers = new Headers({ 'Content-Type':'application/x-www-form-urlencoded'});
        var options = new RequestOptions({headers:headers});


        return this._http.post('http://validate.jsontest.com', params, options)
        .map(res => res.json())

    }*/

    postJSONParam(obj: any) {
        var json = JSON.stringify(obj);
        var params = 'json=' + json;
        var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new RequestOptions({ headers: headers });


        return this._http.post('http://validate.jsontest.com', params, options)
            .map(res => res.json())

    }

    postJSONServer(obj: any) {
        var json = JSON.stringify(obj);
        console.log(json);
        var params = 'json=' + json;
        var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new RequestOptions({ headers: headers });


        return this._http.post(this.base + 'inc/newUber.php', params, options)
            .map(res => res.json())

    }


    postJSON(obj: any, url: string) {
        var json = JSON.stringify(obj);
        console.log(json);
        var params = 'json=' + json;
        var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new RequestOptions({ headers: headers });

        console.log(this.base + url);
        return this._http.post(this.base + url, params, options)
            .map(res => res.json())
    }

    postHTML(obj: any, url: string) {
        var json = JSON.stringify(obj);
        console.log(json);
        var params = 'json=' + json;
        var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new RequestOptions({ headers: headers });

        console.log(this.base + url);
        return this._http.post(this.base + url, params, options)
            .map(res => res.text())
    }

    postJSON2(obj: any, url: string) {
        var json = JSON.stringify(obj);
        console.log(json);
        var params = 'json=' + json;
        var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new RequestOptions({ headers: headers });

        console.log(url);
        return this._http.post(url, params, options)
            .map(res => res.json())
    }

    postFormData(params: any, url: string) {

        const fd = new FormData();

        var json = JSON.stringify(params);
        fd.append('json', json);

        for (var i = 0; i < params["AdjuntosFacturasNotasCompraSize"]; i++) {
            fd.append('AdjuntosFacturasNotasCompra'+i, params["AdjuntosFacturasNotasCompra"].currentFiles[i], params["AdjuntosFacturasNotasCompra"].currentFiles[i].name);
            /*console.log('AdjuntosFacturasNotasCompra' + i);
            console.log(params["AdjuntosFacturasNotasCompra"].currentFiles[i].name)*/
        }
        for (var i = 0; i < params["AdjuntosFotosModeloSerieSize"]; i++) {
            fd.append('AdjuntosFotosModeloSerie' + i, params["AdjuntosFotosModeloSerie"].currentFiles[i], params["AdjuntosFotosModeloSerie"].currentFiles[i].name);
            //console.log('AdjuntosFotosModeloSerie' + i);
            //console.log(params["AdjuntosFotosModeloSerie"].currentFiles[i].name)
        }
        for (var i = 0; i < params["AdjuntosFacturasRepuestosSize"]; i++) {
            fd.append('AdjuntosFacturasRepuestos' + i, params["AdjuntosFacturasRepuestos"].currentFiles[i], params["AdjuntosFacturasRepuestos"].currentFiles[i].name);
            //console.log('AdjuntosFacturasRepuestos' + i);
            //console.log(params["AdjuntosFacturasRepuestos"].currentFiles[i].name)
        }
        for (var i = 0; i < params["AdjuntosOtrosSize"]; i++) {
            fd.append('AdjuntosOtros' + i, params["AdjuntosOtros"].currentFiles[i], params["AdjuntosOtros"].currentFiles[i].name);
            //console.log('AdjuntosOtros' + i);
            //console.log(params["AdjuntosOtros"].currentFiles[i].name)
        }


        console.log(this.base + url);

        return this._http.post(this.base + url, fd)
            .map(res => res.json())

    }

    postFormDataCambioFisico(params: any, url: string) {

        const fd = new FormData();

        var json = JSON.stringify(params);
        fd.append('json', json);

        for (var i = 0; i < params["AdjuntosReciclajeSize"]; i++) {
            fd.append('AdjuntosReciclaje'+i, params["AdjuntosReciclaje"].currentFiles[i], params["AdjuntosReciclaje"].currentFiles[i].name);
            /*console.log('AdjuntosFacturasNotasCompra' + i);
            console.log(params["AdjuntosFacturasNotasCompra"].currentFiles[i].name)*/
        }

        console.log(this.base + url);

        return this._http.post(this.base + url, fd)
            .map(res => res.json())

    }

    postFormDataCotizaciones(params: any, url: string) {

        console.log('servicio');
        console.log(params["AdjuntosNotaP"].currentFiles[0]);

        const fd = new FormData();

        var json = JSON.stringify(params);
        fd.append('json', json);

        fd.append('AdjuntosNota', params["AdjuntosNotaP"].currentFiles[0], params["AdjuntosNotaP"].currentFiles[0].name);



        console.log(this.base + url);

        console.log(fd);

        return this._http.post(this.base + url, fd)
            .map(res => res.json())

    }

    postFormDataPagos(params: any, url: string) {

        console.log('servicio');
        console.log(params["ComprobantePago"].currentFiles[0]);

        const fd = new FormData();

        var json = JSON.stringify(params);
        fd.append('json', json);

        fd.append('ComprobantePago', params["ComprobantePago"].currentFiles[0], params["ComprobantePago"].currentFiles[0].name);

        console.log(this.base + url);

        console.log(fd);

        return this._http.post(this.base + url, fd)
            .map(res => res.json())

    }


}
