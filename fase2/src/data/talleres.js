const accReserva = "Reservar ahora";

const talleres = [
    {
        id: "T1",
        atencion: "talleres",
        nombre: "Taller de alimentación saludable",
        descr: "Taller grupal orientado a entregar conocimientos y herramientas prácticas para mantener una alimentación saludable y equilibrada.",
        tpProfesional: "deportivo,veg",
        duracion: "90 min",
        modalidad: "Presencial (grupo)",
        precio: "15.000",
        accion: accReserva
    },
    {
        id: "T2",
        atencion: "talleres",
        nombre: "Taller de cocina nutritiva",
        descr: "Taller grupal práctico enfocado en la preparación de alimentos y recetas nutritivas, promoviendo hábitos de cocina saludable.",
        tpProfesional: "deportivo,veg",
        duracion: "120 min",
        modalidad: "Presencial (grupo)",
        precio: "20.000",
        accion: accReserva
    },
    {
        id: "T3",
        atencion: "talleres",
        nombre: "Taller de nutrición para deportistas",
        descr: "Taller grupal dirigido a deportistas y personas físicamente activas, con orientación sobre alimentación y nutrición aplicada al rendimiento deportivo.",
        tpProfesional: "deportivo",
        duracion: "90 min",
        modalidad: "Presencial (grupo)",
        precio: "18.000",
        accion: accReserva
    }
];

export default talleres;