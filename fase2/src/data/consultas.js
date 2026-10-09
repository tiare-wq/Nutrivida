const accReserva = "Reservar ahora"

const consultas = [
    {
        id: "C1",
        nombre: "Primera consulta nutricional",
        descr: "Evaluación inicial. Anamnesis, antropometría completa y diseño del primer plan alimenticio.",
        tpProfesional: "clinico",
        duracion: "50 min",
        modalidad: "Presencial",
        precio: "35.000",
        accion: accReserva
    },

    {
        id: "C2",
        nombre: "Control nutricional (seguimiento)",
        descr: "Seguimiento de la evolución del paciente, revisión de objetivos y ajustes al plan alimenticio según sus avances.",
        tpProfesional: "clinico",
        duracion: "30 min",
        modalidad: "Presencial",
        precio: "25.000",
        accion: accReserva
    },

    {
        id: "C3",
        nombre: "Control nutricional quincenal",
        descr: "Consulta de seguimiento realizada cada 15 días para evaluar avances y realizar los ajustes necesarios al plan alimenticio.",
        tpProfesional: "clinico",
        duracion: "30 min",
        modalidad: "Presencial",
        precio: "22.000",
        accion: accReserva
    },

    {
        id: "C4",
        nombre: "Control nutricional quincenal",
        descr: "Atención nutricional a distancia mediante videollamada, permitiendo realizar seguimiento y orientación sin asistir presencialmente a la clínica.",
        tpProfesional: "clinico",
        duracion: "30 min",
        modalidad: "Online",
        precio: "20.000",
        accion: accReserva
    }
];

// EVALUACIONES

// PLANES DE ALIMENTACIÓN

// TALLERES

export default consultas;