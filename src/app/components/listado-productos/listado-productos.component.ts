import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto.model';
import { CarritoService } from '../../services/carrito.service';

/**
 * ListadoProductosComponent
 *
 * Muestra el catálogo de productos disponibles para la venta.
 * Al presionar "Agregar al carrito", el componente llama al
 * CarritoService, quien es el único responsable de actualizar
 * el estado compartido del carrito. Este componente NO mantiene
 * su propio estado del carrito: solo envía la acción al servicio.
 */
@Component({
  selector: 'app-listado-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listado-productos.component.html',
  styleUrl: './listado-productos.component.css'
})
export class ListadoProductosComponent {

  /** Catálogo estático de productos disponibles para la actividad. */
  productos: Producto[] = [
    { id: 1, nombre: 'Teclado mecánico', precio: 275.00 },
    { id: 2, nombre: 'Mouse inalámbrico', precio: 120.50 },
    { id: 3, nombre: 'Monitor 24" Full HD', precio: 899.99 },
    { id: 4, nombre: 'Audífonos Bluetooth', precio: 199.90 },
    { id: 5, nombre: 'Webcam HD 1080p', precio: 165.00 },
    { id: 6, nombre: 'Mochila para laptop', precio: 145.75 }
  ];

  /** Id del último producto agregado, usado solo para una breve retroalimentación visual. */
  ultimoAgregadoId: number | null = null;

  constructor(private carritoService: CarritoService) {}

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarProducto(producto);

    // Retroalimentación visual temporal (resalta el botón/tarjeta un momento)
    this.ultimoAgregadoId = producto.id;
    setTimeout(() => {
      if (this.ultimoAgregadoId === producto.id) {
        this.ultimoAgregadoId = null;
      }
    }, 700);
  }
}
