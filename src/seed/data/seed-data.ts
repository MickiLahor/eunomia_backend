interface SeedMateria {
    descripcion: string;
    usuarioRegistro: string;
}

interface SeedProceso {
    nurej: string;
    demandante: string;
    demandado: string;
    idOficina: number;
    idCiudad: number;
    idMateria: string;
    usuarioRegistro: string;
}

interface SeedPersona {
    ci: string;
    nombre: string;
    paterno: string;
    materno: string;
    fotografia: string;
    sexo: string;
    usuarioRegistro: string;
}

interface SeedDefensor {
    direccionOficina: string;
    telefonoOficina: string;
    celular: string;
    correo: string;
    matricula: string;
    idOficina: number;
    idCiudad: number;
    fechaPosesion: Date;
    idPersona: string;
    idMateria: string;
    usuarioRegistro: string;
}

interface SeedData {
    materias: SeedMateria[];
    procesos: SeedProceso[];
    personas: SeedPersona[];
    defensor: SeedDefensor[];
}


export const initialData: SeedData = {
    materias: [
        {
            descripcion: "Penal",
            usuarioRegistro: "siqui"
        },
        {
            descripcion: "Civil y Comercial",
            usuarioRegistro: "siqui"
        },
        {
            descripcion: "Laboral",
            usuarioRegistro: "siqui"
        },
        {
            descripcion: "Familiar",
            usuarioRegistro: "siqui"
        },
    ],
    procesos: [
        {
            nurej: "123",
            demandante: "Carlos",
            demandado: "Hugo",
            idOficina: 1,
            idCiudad: 1,
            idMateria: "",
            usuarioRegistro: "siqui"
        },
        {
            nurej: "321",
            demandante: "Marcos",
            demandado: "Walter",
            idOficina: 1,
            idCiudad: 1,
            idMateria: "",
            usuarioRegistro: "siqui"
        },
        {
            nurej: "987",
            demandante: "Juan de Dios",
            demandado: "Doña Martita",
            idOficina: 1,
            idCiudad: 1,
            idMateria: "",
            usuarioRegistro: "siqui"
        },
        {
            nurej: "55336",
            demandante: "Maria",
            demandado: "Juan Pablo",
            idOficina: 1,
            idCiudad: 1,
            idMateria: "",
            usuarioRegistro: "siqui"
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
            usuarioRegistro: "siqui"
        },
        {
            ci: "1234567",
            nombre: "Roberto",
            paterno: "Herbas",
            materno: "Sucha",
            fotografia: "no tiene",
            sexo: "F",
            usuarioRegistro: "siqui"
        },
        {
            ci: "3244731",
            nombre: "Walter Miguel",
            paterno: "Lahor",
            materno: "Metro Sexual",
            fotografia: "wakala",
            sexo: "M",
            usuarioRegistro: "siqui"
        },
        {
            ci: "5657543",
            nombre: "Kevin",
            paterno: "Chinchilla",
            materno: "Guerra",
            fotografia: "barbas",
            sexo: "I",
            usuarioRegistro: "siqui"
        }
    ],
    defensor:[
        {
            direccionOficina:"santa rita n° 21",
            telefonoOficina:"6460345",
            celular:"70337067",
            correo:"windsor@organojudicial.gob.bo",
            matricula:"das3232-5464",
            idOficina:1,
            idCiudad:1,
            fechaPosesion: new Date("2022-10-24"),    
            idPersona:"",
            idMateria: "",
            usuarioRegistro:"tu macho"
        },
        {
            direccionOficina:"nose 2",
            telefonoOficina:"4564646",
            celular:"65498764",
            correo:"cherbas@organojudicial.gob.bo",
            matricula:"5445465",
            idOficina:1,
            idCiudad:1,
            fechaPosesion:new Date("2023-10-24"),    
            idPersona:"",
            idMateria: "",
            usuarioRegistro:"tu macho"
        },
        {
            direccionOficina:"nose 3",
            telefonoOficina:"342352",
            celular:"65498764",
            correo:"michi@organojudicial.gob.bo",
            matricula:"41424",
            idOficina:1,
            idCiudad:1,
            fechaPosesion:new Date("2024-10-24"),    
            idPersona:"",
            idMateria: "",
            usuarioRegistro:"tu macho"
        },
        {
            direccionOficina:"nose 4",
            telefonoOficina:"1474231",
            celular:"37743461",
            correo:"mateo@organojudicial.gob.bo",
            matricula:"656455",
            idOficina:1,
            idCiudad:1,
            fechaPosesion:new Date("2021-10-24"),    
            idPersona:"",
            idMateria: "",
            usuarioRegistro:"tu macho"
        }
    ]
}