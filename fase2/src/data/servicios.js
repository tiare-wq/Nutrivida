import consultas from './consultas';
import evaluaciones from './evaluaciones';
import planes from './planes';
import talleres from './talleres';

function avisarCambio() {
    window.dispatchEvent(new Event('servicios:actualizar'));
}

export function leerConsultas() {
    try {
        const guardados = JSON.parse(localStorage.getItem('consultas'));
        return Array.isArray(guardados)? guardados : consultas;
    } catch {
        return consultas;
    }
}

export function leerEvaluaciones() {
    try {
        const guardados = JSON.parse(localStorage.getItem('evaluaciones'));
        return Array.isArray(guardados)? guardados : evaluaciones;
    } catch {
        return evaluaciones;
    }
}

export function leerPlanes() {
    try {
        const guardados = JSON.parse(localStorage.getItem('planes'));
        return Array.isArray(guardados) ? guardados : planes;
    } catch {
        return planes;
    }
}

export function leerTalleres() {
    try {
        const guardados = JSON.parse(localStorage.getItem('talleres'));
        return Array.isArray(guardados) ? guardados : talleres;
    } catch {
        return talleres;
    }
}

export function agregarConsulta(nuevaConsulta) {
    const consultas = [...leerConsultas(), nuevaConsulta];
    localStorage.setItem('consultas', JSON.stringify(consultas));
    avisarCambio();
}

export function agregarEvaluaciones(nuevaEvaluacion) {
    const evaluaciones = [...leerEvaluaciones(), nuevaEvaluacion];
    localStorage.setItem('evaluaciones', JSON.stringify(evaluaciones));
    avisarCambio();
}

export function agregarPlanes(nuevoPlan) {
    const planes = [...leerPlanes(), nuevoPlan];
    localStorage.setItem('planes', JSON.stringify(planes));
    avisarCambio();
}

export function agregarTalleres(nuevoTaller) {
    const talleres = [...leerTalleres(), nuevoTaller];
    localStorage.setItem('talleres', JSON.stringify(talleres));
    avisarCambio();
}

export function eliminarConsulta(id) {
    const consultas = leerConsultas().filter(item => item.id !== id);
    localStorage.setItem('consultas', JSON.stringify(consultas));
    avisarCambio();
}

export function eliminarEvaluacion(id) {
    const evaluaciones = leerEvaluaciones().filter(item => item.id !== id);
    localStorage.setItem('evaluaciones', JSON.stringify(evaluaciones));
    avisarCambio();
}

export function eliminarPlanes(id) {
    const planes = leerPlanes().filter(item => item.id !== id);
    localStorage.setItem('planes', JSON.stringify(planes));
    avisarCambio();
}

export function eliminarTalleres(id) {
    const talleres = leerTalleres().filter(item => item.id !== id);
    localStorage.setItem('talleres', JSON.stringify(talleres));
    avisarCambio();
}