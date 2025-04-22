export class Ejercicio {
    constructor(
        public id: string,
        public nombre: string,
        public repeticiones: string,
        public completado: boolean,
        public imagen?: string,
    ) {}
}