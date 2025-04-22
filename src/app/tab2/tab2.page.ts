// Importaciones necesarias de Angular, servicios personalizados, y plugins de Capacitor
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Para la gestión de formularios reactivos y validaciones
import { EjercicioService } from '../services/ejercicio.service'; // Servicio personalizado para gestionar ejercicios
import { Ejercicio } from '../models/ejercicio.model'; // Modelo de datos para los ejercicios
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; // API de cámara de Capacitor
import { Capacitor } from '@capacitor/core'; // Para obtener la plataforma en la que se ejecuta la app (web o móvil)

// Decorador que define el componente de Angular
@Component({
  selector: 'app-tab2', // Selector del componente para ser usado en las plantillas HTML
  templateUrl: 'tab2.page.html', // Ruta del archivo de plantilla HTML asociado
  styleUrls: ['tab2.page.scss'], // Ruta del archivo de estilos SCSS asociado
  standalone: false, // Indica que el componente no es independiente y requiere de un módulo
})
export class Tab2Page {
  ejercicioForm: FormGroup; // Formulario reactivo para gestionar el hábito
  imagen: string | null = null; // Variable para almacenar la imagen seleccionada en formato base64

  // Constructor con inyección de dependencias
  constructor(
    private fb: FormBuilder, // Servicio para crear formularios reactivos
    private ejercicioService: EjercicioService // Servicio para gestionar los ejercicios
  ) {
    // Inicialización del formulario reactivo con validadores
    this.ejercicioForm = this.fb.group({
      nombre: ['', Validators.required], // Campo 'nombre' requerido
      repeticiones: ['', Validators.required] // Campo 'repeticiones' requerido
    });
  }

  /**
   * Método para seleccionar una imagen, diferenciando entre plataformas web y móvil.
   */
  async seleccionarImagen() {
    try {
      let image: any;

      // Comprobación de la plataforma
      if (Capacitor.getPlatform() === 'web') {
        // En plataforma web, se utiliza un input de tipo file
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'; // Solo acepta archivos de imagen
        input.click(); // Simula un clic para abrir el selector de archivos

        input.onchange = () => {
          const file = input.files?.[0]; // Obtiene el primer archivo seleccionado
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              this.imagen = reader.result as string; // Convierte la imagen a base64
              console.log('Imagen seleccionada desde la galería en web:', this.imagen);
            };
            reader.readAsDataURL(file); // Lee el archivo y lo convierte a base64
          }
        };
      } else {
        // En dispositivos móviles, se usa la API de cámara de Capacitor
        image = await Camera.getPhoto({
          quality: 90, // Calidad de la imagen
          allowEditing: false, // No permite edición de la imagen
          resultType: CameraResultType.DataUrl, // El resultado se obtiene en formato base64
          source: CameraSource.Prompt // Muestra una opción para elegir entre cámara o galería
        });

        this.imagen = image.dataUrl || null; // Guarda la imagen en base64 o null si falla
        console.log('Imagen seleccionada en móvil:', this.imagen);
      }
    } catch (error) {
      // Muestra el error en consola si la selección de la imagen falla
      console.error('Error al seleccionar imagen:', error);
    }
  }

  /**
   * Método para agregar un nuevo ejercicio utilizando los datos del formulario.
   */
  agregarEjercicio() {
    if (this.ejercicioForm.valid) {
      // Crea un nuevo objeto de tipo Habito
      const nuevoEjercicio: Ejercicio = new Ejercicio(
        Date.now().toString(), // Utiliza la marca de tiempo actual como ID único
        this.ejercicioForm.value.nombre, // Obtiene el valor del campo 'nombre'
        this.ejercicioForm.value.repeticiones, // Obtiene el valor del campo 'repeticiones'
        false, // Inicializa el hábito como no completado
        this.imagen ?? undefined // Asigna la imagen si existe, sino undefined
      );

      // Llama al servicio para agregar el nuevo hábito
      this.ejercicioService.agregarEjercicio(nuevoEjercicio);
      console.log('Ejercicio agregado:', nuevoEjercicio);

      // Reinicia el formulario y borra la imagen seleccionada
      this.ejercicioForm.reset();
      this.imagen = null;
    }
  }
}
