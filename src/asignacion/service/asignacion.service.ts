import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateAsignacionDto } from '../dto/create-asignacion.dto';
import { Asignacion } from '../entities/asignacion.entity';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { SearchAsignacionDto } from 'src/common/dtos/search.dto';
import { CommonService } from 'src/common/common.service';
import { MailService } from 'src/mail/service/mail.service';
import { NotificacionService } from 'src/notificacion/service/notificacion.service';

@Injectable()
export class AsignacionService {

  private readonly logger = new Logger('AsignacionService')


  constructor(
    @InjectRepository(Asignacion)
    private readonly asignacionRepository: Repository<Asignacion>,
    private readonly commonService: CommonService,
    private readonly mailService: MailService,
    private readonly notificacionService: NotificacionService,
  ){}

  async findAll(options: IPaginationOptions) {
    let data = await this.paginate(options)
    for(let i=0;i<data.items.length;i++) {
      data.items[i].proceso.zeus = await this.commonService.getOficinaZeusPro(data.items[i].proceso.id_oficina)
    }
    return data;
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Asignacion>> {
    return paginate<Asignacion>(this.asignacionRepository, options, {
      where:{registro_activo:true,asignaciones_estados:{vigente:true}},
      relations:{
        defensor:{persona:true},
        proceso:{materia:true},
        excusa:true,
        asignaciones_estados:{estado:true}
      },
      order: {fecha_registro: 'DESC',asignaciones_estados:{fecha_registro:'DESC'}}
    });
  }
  
  async search(options: IPaginationOptions, searchDto: SearchAsignacionDto) {
    const {nurej = "",demandado= "",demandante="", defensor="",materia=""} = searchDto
    let data = await paginate<Asignacion>(this.asignacionRepository, options, {
      where:    
      [
        {
          asignaciones_estados: {vigente: true},
          proceso: [
            { nurej: ILike(`%${nurej}%`), registro_activo: true },
            { demandado: ILike(`%${demandado}%`), registro_activo: true },
            { demandante: ILike(`%${demandante}%`), registro_activo: true },
            { materia: [{descripcion: ILike(`%${materia}%`), registro_activo: true }]} 
          ],
        },
        {
          asignaciones_estados: {vigente: true},
          defensor:
          {
            persona:
              {nombre_completo: ILike(`%${defensor}%`),registro_activo:true}
          }
        },    
      ],
      relations:{
        asignaciones_estados:{estado:true},
        defensor:{persona:true},
        proceso:{materia:true}
      },
      order: {fecha_registro: 'DESC'}
    });
    for(let i=0;i<data.items.length;i++) {
      data.items[i].proceso.zeus = await this.commonService.getOficinaZeusPro(data.items[i].proceso.id_oficina)
    }
    return data; 
  }

  async searchDepartamento(options: IPaginationOptions, searchDto: SearchAsignacionDto) {
    const {nurej = "",demandado= "",demandante="", defensor="",materia="", id_departamento=0} = searchDto
    
    let data = await paginate<Asignacion>(this.asignacionRepository, options, {
      where: [
        {
          asignaciones_estados: {vigente: true},
          proceso: [
            { nurej: ILike(`%${nurej}%`), registro_activo: true, id_departamento: id_departamento },
            { demandado: ILike(`%${demandado}%`), registro_activo: true, id_departamento: id_departamento },
            { demandante: ILike(`%${demandante}%`), registro_activo: true, id_departamento: id_departamento },
            { materia: [{descripcion: ILike(`%${materia}%`), registro_activo: true }], id_departamento: id_departamento }
          ],
        },
        {
          proceso: {id_departamento: id_departamento},
          asignaciones_estados: {vigente: true},
          defensor: {
            persona: {nombre_completo: ILike(`%${defensor}%`),registro_activo:true}
          }
        },    
      ],
      relations:{
        asignaciones_estados:{estado:true},
        defensor:{persona:true},
        proceso:{materia:true}
      },
      order: {fecha_registro: 'DESC'}
    });
    for(let i=0;i<data.items.length;i++) {
      data.items[i].proceso.zeus = await this.commonService.getOficinaZeusPro(data.items[i].proceso.id_oficina)
    }
    return data;
  }

  async searchOficina(options: IPaginationOptions, searchDto: SearchAsignacionDto) {
    const {nurej = "",demandado= "",demandante="", defensor="",materia="", id_oficina=0} = searchDto
    let data = await paginate<Asignacion>(this.asignacionRepository, options, {
      where:    
      [
        {
          asignaciones_estados: {vigente: true},
          proceso: [
            { nurej: ILike(`%${nurej}%`), registro_activo: true, id_oficina: id_oficina },
            { demandado: ILike(`%${demandado}%`), registro_activo: true, id_oficina: id_oficina },
            { demandante: ILike(`%${demandante}%`), registro_activo: true, id_oficina: id_oficina },
            { materia: [{descripcion: ILike(`%${materia}%`), registro_activo: true }], id_oficina: id_oficina},
          ],
        },
        {
          proceso: { id_oficina: id_oficina },
          asignaciones_estados: {vigente: true},
          defensor:
          {
            persona:
              {nombre_completo: ILike(`%${defensor}%`),registro_activo:true}
          }
        },    
      ],
      relations:{
        asignaciones_estados:{estado:true},
        defensor:{persona:true},
        proceso:{materia:true}
      },
      order: {fecha_registro: 'DESC'}
    });
    for(let i=0;i<data.items.length;i++) {
      data.items[i].proceso.zeus = await this.commonService.getOficinaZeusPro(data.items[i].proceso.id_oficina)
    }
    return data; 
  }

  async searchDefensor(options: IPaginationOptions, searchDto: SearchAsignacionDto) {
    const {nurej = "",demandado= "",demandante="", defensor="",materia="", id_persona=""} = searchDto
    let data = await paginate<Asignacion>(this.asignacionRepository, options, {
      where:    
      [
        {
          asignaciones_estados: {vigente: true},
          defensor: {persona: {id: id_persona}},
          proceso: [
            { nurej: ILike(`%${nurej}%`), registro_activo: true },
            { demandado: ILike(`%${demandado}%`), registro_activo: true },
            { demandante: ILike(`%${demandante}%`), registro_activo: true },
            { materia: [{descripcion: ILike(`%${materia}%`), registro_activo: true }]}
          ],
        },
        {
          asignaciones_estados: {vigente: true},
          defensor:
          {
            persona:
              { nombre_completo: ILike(`%${defensor}%`), registro_activo: true, id: id_persona }
          }
        },    
      ],
      relations:{
        asignaciones_estados:{estado:true},
        defensor:{persona:true},
        proceso:{materia:true}
      },
      order: {fecha_registro: 'DESC'}
    });
    for(let i=0;i<data.items.length;i++) {
      data.items[i].proceso.zeus = await this.commonService.getOficinaZeusPro(data.items[i].proceso.id_oficina)
    }
    return data; 
  }

  async create(createAsignacionDto: CreateAsignacionDto) {
    try {
      const asignacion = this.asignacionRepository.create({
        ...createAsignacionDto,
        fecha_plazo: new Date(),
        usuario_registro: createAsignacionDto.proceso.usuario_registro,
        fecha_registro:new Date(),
        registro_activo: true
      });
      await this.asignacionRepository.save(asignacion);
      const listEmails:Array<string> = []
      listEmails.push(asignacion.defensor.correo)
      const asignacionRealizada = await this.findOne(asignacion.id);
      const sendMail = await this.mailService.sendMail({
        emails: listEmails,
        subject: "Asignación de Proceso como Defensor de Oficio",
        body:
          `<p style="text-align: justify;">Sr(a).&nbsp;${asignacionRealizada.defensor.persona.nombre} ${asignacionRealizada.defensor.persona.paterno} ${asignacionRealizada.defensor.persona.materno}:</p>
          <p style="text-align: justify;">Le comunicamos que usted ha sido asignado a un proceso como <strong><span style="text-decoration: underline;">defensor de oficio</span></strong> mediante el <strong>sistema EUNOMIA</strong> de acuerdo al siguiente detalle:</p>
          <ul style="text-align: justify;">
          <li><strong>NUREJ: ${asignacionRealizada.proceso.nurej}</strong></li>
          <li><strong>Materia: ${asignacionRealizada.proceso.materia.descripcion}</strong></li>
          <li><strong>Juzgado: ${asignacionRealizada.proceso.zeus.descripcion}</strong></li>
          </ul>
          <p style="text-align: justify;">Es necesario que pueda apersonarse en oficinas del juzgado mencionado dentro de 72 horas a efecto de confirmar su asignaci&oacute;n y coordinar las actividades a realizar.</p>
          <p style="text-align: justify;">Le recordamos&nbsp;que en caso de tener alg&uacute;n impedimento justificado para ejercer como defensor de oficio en el proceso asignado, usted puede excusarse mediante el sistema dentro de las 24 horas siguientes de recibido este mensaje.</p>
          <p style="text-align: justify;">Puede ingresar al sitio web del<strong> sistema EUNOMIA</strong> de "Defensores de Oficio" mediante el enlace <a href="https://eunomia.organojudicial.gob.bo">https://eunomia.organojudicial.gob.bo</a> e iniciar sesi&oacute;n con sus&nbsp;credenciales de acceso, siendo el usuario y contrase&ntilde;a su n&uacute;mero de documento de&nbsp;identidad sin extensi&oacute;n y con complemento si corresponde. Ej. 1234567 (sin complemento) o 1234567-1Q (con complemento).</p>
          <p>&nbsp;</p>
          <div style="text-align: center;"><strong>Unidad Nacional de Administraci&oacute;n de Sistemas Inform&aacute;ticos y Comunicaciones</strong></div>
          <div style="text-align: center;"><strong>Direcci&oacute;n Administrativa y Financiera</strong></div>
          <div style="text-align: center;"><strong>&Oacute;rgano Judicial de Bolivia</strong></div>`,
        attachments: []
      })
      //REGISTRAR NOTIFICACION POR CORREO / SMS
      if (sendMail.Menssage === "Correo enviado Satisfactoriamente") {
        const notificacion = await this.notificacionService.create({
          id_asignacion: asignacionRealizada.id,
          notificado_correo: true,
          fecha_correo: new Date(),
          notificado_sms: false,
          fecha_sms: null,
          usuario_registro: asignacion.usuario_registro
        })
      }
      return {...asignacion, messageMail: sendMail.Menssage};
    }
    catch(error) {
      console.log(error); 
      this.handleDBExpeptions(error);
    }
  }

  async findOne(id: string) {
    const asignacion = await this.asignacionRepository.findOne(
      {
        where:{
          id,registro_activo:true
        },
        relations:
        {
          proceso:{materia:true,asignaciones:{defensor:true}},
          asignaciones_estados:{estado:true},
          defensor:{persona:true}
        }
      });
    if ( !asignacion ) throw new NotFoundException(`La asignación con id: ${id} no existe.`);
    asignacion.proceso.zeus = await this.commonService.getOficinaZeusPro(asignacion.proceso.id_oficina)
    return asignacion;
  }

  remove(id: number) {
    return `This action removes a #${id} asignacion`;
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
