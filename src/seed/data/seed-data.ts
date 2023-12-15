interface SeedMateria {
    descripcion: string;
    usuario_registro: string;
}

interface SeedProceso {
    nurej: string;
    demandante: string;
    demandado: string;
    id_oficina: number;
    id_ciudad: number;
    id_departamento: number;
    id_materia: string;
    usuario_registro: string;
}

interface SeedPersona {
    ci: string;
    nombre: string;
    paterno: string;
    materno: string;
    fotografia: string;
    sexo: string;
    usuario_registro: string;
}

interface SeedDefensor {
    direccion_oficina: string;
    telefono_oficina: string;
    celular: string;
    correo: string;
    matricula: string;
    id_oficina: number;
    id_departamento: number;
    id_ciudad: number;
    fecha_posesion: Date;
    id_persona: string;
    id_materia: string;
    usuario_registro: string;
}

interface SeedTipoExcusa {
    descripcion: string;
    usuario_registro: string;
}

interface SeedTipoInforme {
    descripcion: string;
    usuario_registro: string;
}

interface SeedData {
    materias: SeedMateria[];
    procesos: SeedProceso[];
    personas: SeedPersona[];
    defensor: SeedDefensor[];
    tipo_excusa: SeedTipoExcusa[];
    tipo_informe: SeedTipoInforme[];
}


export const initialData: SeedData = {
    materias: [
        {
            descripcion: "Penal",
            usuario_registro: "wmlahor"
        },
        {
            descripcion: "Civil y Comercial",
            usuario_registro: "wmlahor"
        },
        {
            descripcion: "Laboral",
            usuario_registro: "wmlahor"
        },
        {
            descripcion: "Familiar",
            usuario_registro: "wmlahor"
        },
    ],
    procesos: [
        {
            nurej: "123",
            demandante: "Carlos",
            demandado: "Hugo",
            id_oficina: 1,
            id_ciudad: 1,
            id_departamento: 1,
            id_materia: "",
            usuario_registro: "wmlahor"
        },
        {
            nurej: "321",
            demandante: "Marcos",
            demandado: "Walter",
            id_oficina: 1,
            id_ciudad: 1,
            id_departamento: 1,
            id_materia: "",
            usuario_registro: "wmlahor"
        },
        {
            nurej: "987",
            demandante: "Juan de Dios",
            demandado: "Doña Martita",
            id_oficina: 1,
            id_ciudad: 1,
            id_departamento: 1,
            id_materia: "",
            usuario_registro: "wmlahor"
        },
        {
            nurej: "55336",
            demandante: "Maria",
            demandado: "Juan Pablo",
            id_oficina: 1,
            id_ciudad: 1,
            id_departamento: 1,
            id_materia: "",
            usuario_registro: "wmlahor"
        },
    ],
    personas: [
        {
            ci: "7564420",
            nombre: "Windsor",
            paterno: "Alvarez",
            materno: "Davila",
            fotografia: "macho de micky",
            sexo: "M",
            usuario_registro: "wmlahor"
        },
        {
            ci: "1234567",
            nombre: "Roberto",
            paterno: "Herbas",
            materno: "Sucha",
            fotografia: "no tiene",
            sexo: "F",
            usuario_registro: "wmlahor"
        },
        {
            ci: "3244731",
            nombre: "Walter Miguel",
            paterno: "Lahor",
            materno: "Metro Sexual",
            fotografia: "wakala",
            sexo: "M",
            usuario_registro: "wmlahor"
        },
        {
            ci: "5657543",
            nombre: "Kevin",
            paterno: "Chinchilla",
            materno: "Guerra",
            fotografia: "barbas",
            sexo: "I",
            usuario_registro: "wmlahor"
        }
    ],
    defensor:[
        {
            direccion_oficina:"santa rita n° 21",
            telefono_oficina:"6460345",
            celular:"70337067",
            correo:"windsor@organojudicial.gob.bo",
            matricula:"das3232-5464",
            id_oficina:1,
            id_departamento:1,
            id_ciudad:1,
            fecha_posesion: new Date("2022-10-24"),    
            id_persona:"",
            id_materia: "",
            usuario_registro:"wmlahor"
        },
        {
            direccion_oficina:"nose 2",
            telefono_oficina:"4564646",
            celular:"65498764",
            correo:"cherbas@organojudicial.gob.bo",
            matricula:"5445465",
            id_oficina:1,
            id_departamento:1,
            id_ciudad:1,
            fecha_posesion:new Date("2023-10-24"),    
            id_persona:"",
            id_materia: "",
            usuario_registro:"wmlahor"
        },
        {
            direccion_oficina:"nose 3",
            telefono_oficina:"342352",
            celular:"65498764",
            correo:"michi@organojudicial.gob.bo",
            matricula:"41424",
            id_oficina:1,
            id_departamento:1,
            id_ciudad:1,
            fecha_posesion:new Date("2024-10-24"),    
            id_persona:"",
            id_materia: "",
            usuario_registro:"wmlahor"
        },
        {
            direccion_oficina:"nose 4",
            telefono_oficina:"1474231",
            celular:"37743461",
            correo:"mateo@organojudicial.gob.bo",
            matricula:"656455",
            id_oficina:1,
            id_departamento:1,
            id_ciudad:1,
            fecha_posesion:new Date("2021-10-24"),    
            id_persona:"",
            id_materia: "",
            usuario_registro:"wmlahor"
        }
    ],
    tipo_excusa:[
        {
            descripcion:"Incompatibilidad",
            usuario_registro:"wmlahor"
        },
        {
            descripcion:"Salud",
            usuario_registro:"wmlahor"
        },
        {
            descripcion:"Designación",
            usuario_registro:"wmlahor"
        },
    ],
    tipo_informe: [
        {
            descripcion:"Parcial",
            usuario_registro:"wmlahor"
        },
        {
            descripcion:"Final",
            usuario_registro:"wmlahor"
        },
        {
            descripcion:"Tecnico Legal",
            usuario_registro:"wmlahor"
        },
        {
            descripcion:"De Avance",
            usuario_registro:"wmlahor"
        }
    ]
}