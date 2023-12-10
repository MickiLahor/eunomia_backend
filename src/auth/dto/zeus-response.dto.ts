export class ZeusDto {
    idOficina: number;
    descripcion: string;
    idEnte: number;
    ente: string;
    idDepartamento: string;
    departamento: string;
    idMunicipio: string;
    municipio: string;
}

export class ZeusResponseDto {
    id_oficina: number;
    descripcion: string;
    id_ente: number;
    ente: string;
    id_departamento: string;
    departamento: string;
    id_municipio: string;
    municipio: string;
}

export class ZeusProDepartamentoDto {
    idDepartamento: number;
    descripcion: string;
    codigo: string;
    sigla: string;
}

export class DepartamentoDto {
    id_departamento: number;
    descripcion: string;
    codigo: string;
    sigla: string;
}

export class ZeusProMunicipioDto {
    idMunicipio: number;
    descripcion: string;
    idDepartamento: number;
}

export class MinicipioDto {
    id_municipio: number;
    descripcion: string;
    id_departamento: number;
}

export class ZeusProOficinaDto {
    idOficina: number;
    idEnte: number;
    idAreaOrganizacional: number;
    idMunicipio: number;
    descripcion : string
}

export class OficinaDto {
    id_oficina: number;
    id_ente: number;
    id_area_organizacional: number;
    id_municipio: number;
    descripcion : string
}