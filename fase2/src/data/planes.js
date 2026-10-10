const accComprar = "Agregar al carrito";

const planes = [
    {
        id: "P1",
        atencion: "planes",
        nombre: "Plan de pérdida de peso (1 mes)",
        descr: "Programa de un mes orientado a la pérdida de peso, con seguimiento nutricional y un plan de alimentación personalizado.",
        tpProfesional: "clinico",
        duracion: "1 mes",
        modalidad: "Presencial",
        precio: "65.000",
        accion: accComprar
    },
    {
        id: "P2",
        atencion: "planes",
        nombre: "Plan de pérdida de peso (3 meses)",
        descr: "Programa de tres meses para la pérdida de peso, con controles periódicos, planes de alimentación y seguimiento continuo.",
        tpProfesional: "clinico",
        duracion: "3 meses",
        modalidad: "Presencial",
        precio: "170.000",
        accion: accComprar
    },
    {
        id: "P3",
        atencion: "planes",
        nombre: "Plan de nutrición deportiva (1 mes)",
        descr: "Plan nutricional dirigido a deportistas y personas con actividad física frecuente, adaptado a sus requerimientos energéticos y proteicos.",
        tpProfesional: "deportivo",
        duracion: "1 mes",
        modalidad: "Presencial",
        precio: "70.000",
        accion: accComprar
    },
    {
        id: "P4",
        atencion: "planes",
        nombre: "Plan control diabetes / hipertensión",
        descr: "Plan de alimentación adaptado a personas con diabetes o hipertensión, considerando sus necesidades nutricionales y objetivos de salud.",
        tpProfesional: "clinico",
        duracion: "1 mes",
        modalidad: "Presencial",
        precio: "75.000",
        accion: accComprar
    },
    {
        id: "P5",
        atencion: "planes",
        nombre: "Plan alimentación vegetariana / vegana",
        descr: "Plan alimenticio adaptado a una alimentación vegetariana o vegana, considerando el aporte adecuado de nutrientes esenciales.",
        tpProfesional: "veg",
        duracion: "1 mes",
        modalidad: "Presencial",
        precio: "68.000",
        accion: accComprar
    },
    {
        id: "P6",
        atencion: "planes",
        nombre: "Plan alimentación infantil (2 - 12 años)",
        descr: "Plan alimenticio adaptado a niños entre 2 a 12 años de edad.",
        tpProfesional: "clinico",
        duracion: "1 mes",
        modalidad: "Presencial",
        precio: "60.000",
        accion: accComprar
    }
];

export default planes;