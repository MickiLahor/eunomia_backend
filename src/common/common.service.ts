import { Injectable } from "@nestjs/common";
import { DepartamentoDto, MinicipioDto, OficinaDto, ZeusDto, ZeusProDepartamentoDto, ZeusProMunicipioDto, ZeusProOficinaDto, ZeusResponseDto } from "src/auth/dto/zeus-response.dto";
import { AxiosAdapter } from "./adapters/axios.adapter";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CommonService {
    
constructor(private readonly http: AxiosAdapter,
    private readonly configService: ConfigService,){}

public async getOficinaZeusPro(idOficina: number) : Promise<ZeusResponseDto>
  {
    const data = await this.http.get<ZeusDto>(`${this.configService.get('URL_ZEUS')}/api/oficina/getOficina/${idOficina}`);
    return {
      id_oficina: data.idOficina,
      descripcion: data.descripcion,
      id_ente: data.idEnte,
      ente: data.ente,
      id_departamento: data.idDepartamento,
      departamento: data.departamento,
      id_municipio: data.idMunicipio,
      municipio: data.municipio
    };
  }

  public async getDepartamentoZeusPro() : Promise<Array<DepartamentoDto>>
  {
    const consulta = await this.http.get<Array<ZeusProDepartamentoDto>>(`${this.configService.get('URL_ZEUS')}/api/oficina/departamentos`);
    const data : Array<DepartamentoDto> = consulta.map(x=>{
      return {
        id_departamento:x.idDepartamento,
        descripcion:x.descripcion,
        codigo:x.codigo,
        sigla:x.sigla,
      }
    })
    return data;
  }

  public async getMunicipioZeusPro(id: number) : Promise<Array<MinicipioDto>>
  {
    const consulta = await this.http.get<Array<ZeusProMunicipioDto>>(`${this.configService.get('URL_ZEUS')}/api/oficina/municipios?id=${id}`);
    const data : Array<MinicipioDto> = consulta.map(x=>{
      return {
        id_municipio:x.idMunicipio,
        descripcion:x.descripcion,
        id_departamento:x.idDepartamento,
      }
    })
    return data;
  }

  public async getOficinaZeusProPorMunicipio(id: number) : Promise<Array<OficinaDto>>
  {
    const consulta = await this.http.get<Array<ZeusProOficinaDto>>(`${this.configService.get('URL_ZEUS')}/api/oficina/por_municipio_all?idMunicipio=${id}`);
    const data : Array<OficinaDto> = consulta.map(x=>{
      return {
        id_oficina:x.idOficina,
        id_ente:x.idEnte,
        id_area_organizacional:x.idAreaOrganizacional,
        id_municipio:x.idMunicipio,
        descripcion:x.descripcion,
      }
    })
    return data;
  }

}