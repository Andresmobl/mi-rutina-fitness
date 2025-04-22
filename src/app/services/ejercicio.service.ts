// Importaciones necesarias
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Ejercicio } from '../models/ejercicio.model';

// Decorador @Injectable para indicar que esta clase se puede inyectar como dependencia
@Injectable({
  providedIn: 'root' // El servicio estará disponible de forma global en toda la aplicación
})
export class EjercicioService {
  // Lista privada que almacena los ejercicios en memoria
  private ejercicios: Ejercicio[] = [];

  // Constructor que carga los ejercicios desde el almacenamiento al inicializar el servicio
  constructor() {
    this.cargarEjercicios();
  }

  /**
   * Agrega un nuevo ejercicios a la lista y lo guarda en el almacenamiento
   * @param ejercicio - El ejercicio a agregar
   */
  async agregarEjercicio(ejercicio: Ejercicio) {
    this.ejercicios.push(ejercicio); // Añade el ejercicio a la lista
    await this.guardarEjercicios(); // Guarda los ejercicios actualizados en el almacenamiento
  }

  /**
   * Agrega una lista predeterminada de 10 ejercicios y los guarda
   */
  async agregar10Ejercicios() {
    this.ejercicios.push(
      new Ejercicio(Date.now().toString() + 1, 'Pres Banca', '12', false),
      new Ejercicio(Date.now().toString() + 2, 'Pres Militar', '12', false),
      new Ejercicio(Date.now().toString() + 3, 'Polea Baja', '10', false),
      new Ejercicio(Date.now().toString() + 4, 'Pres Arnold', '12', false),
      new Ejercicio(Date.now().toString() + 5, 'Elevaciones Laterales', '12', false),
      new Ejercicio(Date.now().toString() + 6, 'Triceps Polea Individual', '12', false),
      new Ejercicio(Date.now().toString() + 7, 'Triceps Polea Doble', '12', false),
      new Ejercicio(Date.now().toString() + 8, 'Pres Frances', '10', false),
      new Ejercicio(Date.now().toString() + 9, 'Dominadas', '12', false),
      new Ejercicio(Date.now().toString() + 10, 'Planchas', '4', false)
    );
    await this.guardarEjercicios(); // Guarda los ejercicios en el almacenamiento
  }

  /**
   * Marca un ejercicio como completado o no completado y lo guarda
   * @param id - Identificador del ejercicio
   */
  async marcarCompletado(id: string) {
    const ejercicio = this.ejercicios.find(h => h.id === id); // Busca el ejercicio por su ID
    if (ejercicio) {
      ejercicio.completado = !ejercicio.completado; // Cambia el estado de completado
      await this.guardarEjercicios(); // Guarda los cambios
    }
  }

  /**
   * Obtiene la lista de ejercicios, cargándolos del almacenamiento si es necesario
   * @returns Lista de ejercicios
   */
  async obtenerEjercicios(): Promise<Ejercicio[]> {
    if (this.ejercicios.length === 0) {
      await this.cargarEjercicios(); // Carga los ejercicios si la lista está vacía
    }
    return this.ejercicios;
  }

  /**
   * Elimina un ejercicio por su ID y actualiza el almacenamiento
   * @param id - Identificador del ejercicio a eliminar
   */
  async eliminarEjercicios(id: string) {
    this.ejercicios = this.ejercicios.filter(h => h.id !== id); // Filtra el ejercicio para eliminarlo
    await this.guardarEjercicios(); // Guarda la lista actualizada
  }

  /**
   * Guarda la lista actual de ejercicios en el almacenamiento
   */
  private async guardarEjercicios() {
    try {
      await Preferences.set({
        key: 'ejercicios',
        value: JSON.stringify(this.ejercicios) // Convierte la lista a JSON para su almacenamiento
      });
      console.log('Ejercicios guardados:', this.ejercicios);
    } catch (error) {
      console.error('Error guardando ejercicios:', error); // Captura y muestra errores en caso de fallos
    }
  }

  /**
   * Carga los ejercicios almacenados en el dispositivo
   */
  async cargarEjercicios() {
    const { value } = await Preferences.get({ key: 'ejercicios' }); // Obtiene los datos almacenados

    console.log('Datos crudos de Preferences:', value); // Muestra los datos crudos para depuración

    if (value) {
      const parsedData = JSON.parse(value); // Parsea los datos JSON almacenados

      // Reconstruye los objetos de tipo Ejercicio
      this.ejercicios = parsedData.map((h: any) => new Ejercicio(
        h.id,
        h.nombre,
        h.repeticiones,
        h.completado,
        h.imagen
      ));

      console.log('Ejercicios convertidos:', this.ejercicios);
    }
  }

  /**
   * Elimina todos los ejercicios almacenados y limpia la lista en memoria
   */
  async eliminarTodosEjercicios() {
    try {
      this.ejercicios = []; // Vacía la lista en memoria
      await Preferences.remove({ key: 'ejercicios' }); // Elimina los datos almacenados
      console.log('Todos los ejercicios han sido eliminados correctamente.');
    } catch (error) {
      console.error('Error al eliminar todos los ejercicios:', error); // Captura errores en caso de fallos
    }
  }
}