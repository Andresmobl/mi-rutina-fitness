// Importaciones necesarias de Angular, Ionic y modelos personalizados
import { Component } from '@angular/core';
import { EjercicioService } from '../services/ejercicio.service'; // Servicio que gestiona los ejercicios
import { Ejercicio } from '../models/ejercicio.model'; // Modelo de datos para los ejercicios
import { LoadingController } from '@ionic/angular'; // Controlador para mostrar indicadores de carga (loading)

// Decorador que define el componente de Angular
@Component({
  selector: 'app-tab1', // Selector que se utiliza en las plantillas para referirse a este componente
  templateUrl: 'tab1.page.html', // Ruta del archivo de plantilla HTML asociado
  styleUrls: ['tab1.page.scss'], // Ruta del archivo de estilos SCSS asociado
  standalone: false, // Indica que este componente no es independiente, sino parte de un módulo
})
export class Tab1Page {
  ejercicios: Ejercicio[] = []; // Propiedad que almacenará la lista de ejercicios

  // Constructor donde se inyectan los servicios necesarios
  constructor(
    private ejercicioService: EjercicioService, // Servicio personalizado para gestionar los ejercicios
    private loadingCtrl: LoadingController // Servicio de Ionic para mostrar indicadores de carga
  ) {}

  /**
   * Hook del ciclo de vida de Ionic que se ejecuta cada vez que la vista está por entrar en pantalla.
   * Ideal para actualizar datos cada vez que se accede a la página.
   */
  async ionViewWillEnter() {
    console.log('Refrescando Tab 1...'); // Mensaje en consola para seguimiento

    // Crea un indicador de carga (loading)
    const loading = await this.loadingCtrl.create({
      message: 'Cargando ejercicios...', // Mensaje que se muestra durante la carga
      spinner: 'crescent', // Estilo del spinner (círculo giratorio)
    });

    await loading.present(); // Muestra el loading en pantalla

    this.ejercicios = await this.ejercicioService.obtenerEjercicios(); 
    // Obtiene los ejercicios del servicio y actualiza la lista

    console.log('Ejercicios actualizados:', this.ejercicios); // Muestra los datos obtenidos en consola

    await loading.dismiss(); // Oculta el indicador de carga una vez que los datos se han cargado
  }

  /**
   * Hook del ciclo de vida de Angular que se ejecuta una sola vez cuando se inicializa el componente.
   * Ideal para cargar datos la primera vez que se muestra la página.
   */
  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando ejercicios...', // Mensaje del indicador de carga
      spinner: 'crescent', // Estilo del spinner
      duration: 2000, // Duración máxima del indicador de carga (en milisegundos)
    });

    await loading.present(); // Muestra el indicador de carga

    this.ejercicios = await this.ejercicioService.obtenerEjercicios(); 
    // Obtiene los ejercicios al iniciar el componente

    await loading.dismiss(); // Oculta el indicador de carga
  }

  /**
   * Elimina un ejercicio según su ID y actualiza la lista de ejercicios.
   * @param id - Identificador del ejercicio a eliminar
   */
  async eliminarEjercicio(id: string) {
    await this.ejercicioService.eliminarEjercicios(id); // Llama al servicio para eliminar el ejercicio
    this.ejercicios = await this.ejercicioService.obtenerEjercicios(); 
    // Actualiza la lista después de eliminar el ejercicio
  }

  /**
   * Marca o desmarca un ejercicio como completado y actualiza su estado en el almacenamiento.
   * @param id - Identificador del ejercicio a actualizar
   */
  async marcarCompletado(id: string) {
    await this.ejercicioService.marcarCompletado(id); 
    // Cambia el estado de completado del ejercicio
  }
}