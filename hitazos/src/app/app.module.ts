import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { LoginComponent } from './login.component';
import { BusquedaComponent } from './busqueda.component';
import { RegistroComponent } from './registro.component';
import { ReporteComponent } from './reporte.component';

import { BusquedaModule } from './busqueda.module';



/********************************/

import { OlvidoComponent } from './olvido.component';
import { RegistroClienteComponent } from './registro-de-casos/registro-cliente.component';
import { ReporteCasoComponent } from './registro-de-casos/reporte-de-caso.component';

import { ClienteDetalleComponent } from './cliente/cliente-detalle.component';
import { ClienteDetalleEdicionComponent } from './cliente/cliente-detalle-edicion.component';

import { PerfilCDSComponent } from './perfil/perfilcds.component';


import { InicioComponent } from './inicio.component';

import { ClientesComponent } from './clientes.component';
import { CasosAsignadosComponent } from './casos-asignados.component';
import { OrdenesServicioComponent } from './ordenes-de-servicio.component';


import { ResumenReporteComponent } from './resumen-reporte.component';
import { ResumenOrdenComponent } from './resumen-orden.component';

//Reparacion
import { ReparacionInicioComponent } from './reparacion/reparacion-inicio.component';


//Orden
import { OrdenInicioComponent } from './orden-de-servicio/orden-inicio.component';

//Administracion
import { AdministracionComponent } from './administracion/administracion.component';
import { CambiosComponent } from './administracion/cambios.component';
import { HistorialComponent } from './administracion/historial.component';
import { ResumenPagosComponent } from './administracion/resumen-de-pagos.component';

//Notificaciones
import { NotificacionesComponent } from './notificaciones/listado.component';


//Ver Todos
import { NuevasRefaccionesComponent } from './nuevas-refacciones.component';
import { NuevasCotizacionesComponent } from './nuevas-cotizaciones.component';
import { NuevasMovilizacionesComponent } from './nuevas-movilizaciones.component';

import { HttpModule } from '@angular/http';
import { HTTPService } from './services/http.service';
import { GlobalService } from './services/global.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { OnlyNumber } from './onlynumber.directive';

import { routing } from './app.routing';

import { Ng2FileInputModule } from 'ng2-file-input';

import { DataTablesModule } from 'angular-datatables-5';


import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-fixedheader';



@NgModule({
    declarations: [
        AppComponent,
        BusquedaComponent,
        RegistroComponent,
        ReporteComponent,
        LoginComponent,
        OnlyNumber,

        RegistroClienteComponent,
        OlvidoComponent,
        ReporteCasoComponent,


        ClienteDetalleComponent,
        ClienteDetalleEdicionComponent,

        PerfilCDSComponent,

        InicioComponent,
        ClientesComponent,
        CasosAsignadosComponent,
        OrdenesServicioComponent,
        ResumenReporteComponent,
        ResumenOrdenComponent,

        ReparacionInicioComponent,

        OrdenInicioComponent,

        AdministracionComponent,
        CambiosComponent,
        HistorialComponent,
        ResumenPagosComponent,

        NotificacionesComponent,

        NuevasRefaccionesComponent,
        NuevasCotizacionesComponent,
        NuevasMovilizacionesComponent,

  ],
  imports: [
      BrowserModule,
      HttpModule,
      FormsModule,
      ReactiveFormsModule,
      BusquedaModule,
      routing,
      NgbModule.forRoot(),
      NoopAnimationsModule,
      Ng2FileInputModule.forRoot({
          dropText: "Arrastra imagen o pdf",
          browseText: "Buscar",
          removeText: "Eliminar",
          invalidFileText: "Este tipo de archivo no es permitido.",
          invalidFileTimeout: 8000,
          removable: true,
          multiple: true,
          showPreviews: true,
          extensions: ['jpg', 'png', 'pdf', 'jpeg', 'mp4', 'mov', 'avi', 'webm'],
      }),
      DataTablesModule,

  ],
  providers: [
      HTTPService,
      GlobalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
