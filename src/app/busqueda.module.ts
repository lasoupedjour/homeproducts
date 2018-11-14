
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BusquedaComponent } from './busqueda.component';
import { routing } from './app.routing';

@NgModule({
    declarations: [

    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        routing
    ],
    exports: [

    ]
})
export class BusquedaModule {
}