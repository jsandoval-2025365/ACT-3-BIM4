import { Component } from '@angular/core';
import { ListadoProductosComponent } from './components/listado-productos/listado-productos.component';
import { ResumenCarritoComponent } from './components/resumen-carrito/resumen-carrito.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ListadoProductosComponent, ResumenCarritoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  titulo = 'Carrito de Ventas con Observables y Pipes en Angular';
}
