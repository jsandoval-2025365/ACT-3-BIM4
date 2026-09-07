import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ItemCarrito } from '../../models/item-carrito.model';
import { CarritoService } from '../../services/carrito.service';
import { SubtotalPipe } from '../../pipes/subtotal.pipe';

/**
 * ResumenCarritoComponent
 *
 * Se suscribe al Observable `carrito$` expuesto por CarritoService
 * para recibir automáticamente cualquier cambio en el estado del
 * carrito (agregar, cambiar cantidad, eliminar) y reflejarlo en la
 * interfaz de forma reactiva, sin necesidad de recargar ni de que
 * otro componente le "avise" directamente.
 */
@Component({
  selector: 'app-resumen-carrito',
  standalone: true,
  imports: [CommonModule, SubtotalPipe],
  templateUrl: './resumen-carrito.component.html',
  styleUrl: './resumen-carrito.component.css'
})
export class ResumenCarritoComponent implements OnInit, OnDestroy {

  items: ItemCarrito[] = [];
  total = 0;

  private suscripcion?: Subscription;

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.suscripcion = this.carritoService.carrito$.subscribe(items => {
      this.items = items;
      this.total = this.carritoService.calcularTotal(items);
    });
  }

  ngOnDestroy(): void {
    this.suscripcion?.unsubscribe();
  }

  incrementar(idProducto: number): void {
    this.carritoService.incrementarCantidad(idProducto);
  }

  decrementar(idProducto: number): void {
    this.carritoService.decrementarCantidad(idProducto);
  }

  onCantidadCambiada(idProducto: number, valor: string | number): void {
    const cantidad = Number(valor);
    if (!isNaN(cantidad)) {
      this.carritoService.cambiarCantidad(idProducto, cantidad);
    }
  }

  eliminar(idProducto: number): void {
    this.carritoService.eliminarProducto(idProducto);
  }

  vaciarCarrito(): void {
    this.carritoService.vaciarCarrito();
  }
}
