import { Router, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { BusquedaComponent } from './busqueda.component';
import { RegistroComponent } from './registro.component';
import { ReporteComponent } from './reporte.component';

/******************************************/

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
import { ResumenDistribuidorComponent } from './administracion/resumen-distribuidor.component';
import { HistorialComponent } from './administracion/historial.component';
import { ResumenPagosComponent } from './administracion/resumen-de-pagos.component';

//Notificaciones
import { NotificacionesComponent } from './notificaciones/listado.component';

//Ver Todos
import { NuevasRefaccionesComponent } from './nuevas-refacciones.component';
import { NuevasCotizacionesComponent } from './nuevas-cotizaciones.component';
import { NuevasMovilizacionesComponent } from './nuevas-movilizaciones.component';

import { GlobalService } from './services/global.service';

export const routing = RouterModule.forRoot([
    { path: '', component: LoginComponent },
    { path: 'olvido', component: OlvidoComponent },

    { path: 'inicio', component: InicioComponent, canActivate: [GlobalService] },
    { path: 'inicio/cliente/detalle', component: ClienteDetalleComponent, canActivate: [GlobalService] },
    { path: 'inicio/cliente/detalle/edicion', component: ClienteDetalleEdicionComponent, canActivate: [GlobalService] },
    { path: 'inicio/resumen', component: ResumenReporteComponent, canActivate: [GlobalService] },
    { path: 'inicio/resumen/orden', component: ResumenOrdenComponent, canActivate: [GlobalService] },

    { path: 'inicio/clientes', component: ClientesComponent, canActivate: [GlobalService] },
    { path: 'inicio/casos-asignados', component: CasosAsignadosComponent, canActivate: [GlobalService] },
    { path: 'inicio/ordenes-de-servicio', component: OrdenesServicioComponent, canActivate: [GlobalService] },


    { path: 'perfil/cds', component: PerfilCDSComponent, canActivate: [GlobalService] },

    { path: 'registro-de-casos', component: BusquedaComponent, canActivate: [GlobalService] },
    { path: 'registro-de-casos/registro-cliente', component: RegistroClienteComponent, canActivate: [GlobalService] },
    { path: 'registro-de-casos/reporte-de-caso', component: ReporteCasoComponent, canActivate: [GlobalService] },


    { path: 'registro-de-casos/reparacion/inicio', component: ReparacionInicioComponent, canActivate: [GlobalService] },

    { path: 'registro-de-casos/orden-de-servicio/inicio', component: OrdenInicioComponent, canActivate: [GlobalService] },


    { path: 'administracion/inicio', component: AdministracionComponent, canActivate: [GlobalService] },
    { path: 'administracion/resumen-distribuidor', component: ResumenDistribuidorComponent, canActivate: [GlobalService] },
    { path: 'administracion/historial-de-pagos', component: HistorialComponent, canActivate: [GlobalService] },
    { path: 'administracion/resumen-de-pagos', component: ResumenPagosComponent, canActivate: [GlobalService] },


    //{ path: 'registroticket/:idparticipante', component: RegistroTicketComponent, canActivate: [GlobalService] },
    { path: 'reporte', component: ReporteComponent, canActivate: [GlobalService] },

    { path: 'notificaciones', component: NotificacionesComponent, canActivate: [GlobalService] },

    { path: 'nuevas-refacciones', component: NuevasRefaccionesComponent, canActivate: [GlobalService] },
    { path: 'nuevas-cotizaciones', component: NuevasCotizacionesComponent, canActivate: [GlobalService] },
    { path: 'nuevas-movilizaciones', component: NuevasMovilizacionesComponent, canActivate: [GlobalService] },


    /*{ path: 'conductor', component: HomeConductorComponent },
    { path: 'pasajero', component: HomePasajeroComponent },
    { path: '*', component: HomeComponent }*/
    { path: '**', component: LoginComponent }
]);
