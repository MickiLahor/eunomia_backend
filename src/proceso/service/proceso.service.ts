import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { AsignacionService } from 'src/asignacion/service/asignacion.service';
import { CreateAsignacionDto } from 'src/asignacion/dto/create-asignacion.dto';
import { SearchProcesoDto } from 'src/common/dtos/search.dto';
import { DefensorService } from 'src/defensor/service/defensor.service';
import { MateriaService } from 'src/materia/service/materia.service';
import { ILike, Repository } from 'typeorm';
import { CreateProcesoDto } from '../dto/create-proceso.dto';
import { UpdateProcesoDto } from '../dto/update-proceso.dto';
import { Proceso } from '../entities/proceso.entity';
import { AsignacionEstadoService } from 'src/asignacion_estado/service/asignacion_estado.service';
import { Estado } from 'src/common/enums/enums';
import { EstadoService } from 'src/estado/service/estado.service';
import { CommonService } from 'src/common/common.service';
import { MailService } from 'src/mail/service/mail.service';

@Injectable()
export class ProcesoService {

  private readonly logger = new Logger('ProcesoService')

  constructor(
    @InjectRepository(Proceso)
    private readonly procesoRepository: Repository<Proceso>,
    private readonly materiaService: MateriaService,
    private readonly defensorService: DefensorService,  
    private readonly asignacionService: AsignacionService,  
    private readonly asignacionEstadoService: AsignacionEstadoService,
    private readonly estadoService: EstadoService,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => CommonService))
    private readonly commonService: CommonService
  ){}

  async create(createProcesoDto: CreateProcesoDto) {
    try {
      const proceso = this.procesoRepository.create({
        ...createProcesoDto,
        materia: await this.materiaService.findOne(createProcesoDto.id_materia),
        fecha_registro: new Date(),
        registro_activo: true
      });
      const defensor = await this.defensorService.sorteo(proceso.id_ciudad, proceso.materia.id);
      if (defensor === null) {
        return { message: "No existen defensores en el municipio y materia del proceso", error: true }; 
      }
      const createAsignacionDto: CreateAsignacionDto = {defensor:defensor,proceso:proceso,fecha:new Date()}
      await this.procesoRepository.save(proceso);
      const asignacion = await this.asignacionService.create(createAsignacionDto)
      await this.asignacionEstadoService.create({
        fecha: new Date(),
        id_asignacion: asignacion.id,
        vigente: true,
        usuario_registro:createProcesoDto.usuario_registro,
        id_estado: (await this.estadoService.findOneDescripcion(Estado.Asignado)).id
      })
      // const listEmails:Array<string> = []
      // listEmails.push(defensor.correo)
      // const asignacionRealizada = await this.asignacionService.findOne(asignacion.id);
      
      // const sendMail = await this.mailService.sendMail({
      //   emails: listEmails,
      //   subject: "Asignación de Proceso como Defensor de Oficio",
      //   body:
      //     `<p style="text-align: justify;">Sr(a).&nbsp;${defensor.persona.nombre} ${defensor.persona.paterno} ${defensor.persona.materno}:</p>
      //     <p style="text-align: justify;">Le comunicamos que usted ha sido asignado a un proceso como <strong><span style="text-decoration: underline;">defensor de oficio</span></strong> mediante el <strong>sistema EUNOMIA</strong> de acuerdo al siguiente detalle:</p>
      //     <ul style="text-align: justify;">
      //     <li><strong>NUREJ: ${asignacionRealizada.proceso.nurej}</strong></li>
      //     <li><strong>Materia: ${asignacionRealizada.proceso.materia.descripcion}</strong></li>
      //     <li><strong>Juzgado: ${asignacionRealizada.proceso.zeus.descripcion}</strong></li>
      //     </ul>
      //     <p style="text-align: justify;">Es necesario que pueda apersonarse en oficinas del juzgado mencionado dentro de 72 horas a efecto de confirmar su asignaci&oacute;n y coordinar las actividades a realizar.</p>
      //     <p style="text-align: justify;">Le recordamos&nbsp;que en caso de tener alg&uacute;n impedimento justificado para ejercer como defensor de oficio en el proceso asignado, usted puede excusarse mediante el sistema dentro de las 24 horas siguientes de recibido este mensaje.</p>
      //     <p style="text-align: justify;">Puede ingresar al sitio web del<strong> sistema EUNOMIA</strong> de "Defensores de Oficio" mediante el enlace <a href="https://eunomia.organojudicial.gob.bo">https://eunomia.organojudicial.gob.bo</a> e iniciar sesi&oacute;n con sus&nbsp;credenciales de acceso, siendo el usuario y contrase&ntilde;a su n&uacute;mero de documento de&nbsp;identidad sin extensi&oacute;n y con complemento si corresponde. Ej. 1234567 (sin complemento) o 1234567-1Q (con complemento).</p>
      //     <p>&nbsp;</p>
      //     <div style="text-align: center;"><strong>Unidad Nacional de Administraci&oacute;n de Sistemas Inform&aacute;ticos y Comunicaciones</strong></div>
      //     <div style="text-align: center;"><strong>Direcci&oacute;n Administrativa y Financiera</strong></div>
      //     <div style="text-align: center;"><strong>&Oacute;rgano Judicial de Bolivia</strong></div>`,
      //   attachments: []
      // })
      
      return { ...asignacion, message: `Registro correcto. ${asignacion.messageMail}`, error: false };
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Proceso>> {
    return paginate<Proceso>(this.procesoRepository, options, {
      where:{registro_activo:true},
      relations:{
        materia:true,
        asignaciones: {
          asignaciones_estados: {
            estado:true
          },
          defensor:{
            persona:true
          }
        }
      },
        // order: {fecha_registro: 'DESC',asignaciones:{fecha_registro:'desc',asignaciones_estados:{fecha_registro:'desc'}}}
    });
  }

  async search(options: IPaginationOptions, searchDto: SearchProcesoDto) {
    const {nurej = "", demandado = "", demandante = ""} = searchDto
    let data = await paginate<Proceso>(this.procesoRepository, options, {
      where:   
      [
        
        { nurej: ILike(`%${nurej}%`),registro_activo:true, asignaciones: {asignaciones_estados: {vigente: true}} },
        { demandado: ILike(`%${demandado}%`),registro_activo:true, asignaciones: {asignaciones_estados: {vigente: true}} },
        { demandante: ILike(`%${demandante}%`),registro_activo:true, asignaciones: {asignaciones_estados: {vigente: true}} },
        
      ],
      relations:{
        materia:true,
        asignaciones:{
          asignaciones_estados:{
            estado:true
          },
          defensor:{
            persona:true
          }
        }
      },
      // order: {fecha_registro: 'DESC',asignaciones:{fecha_registro:'DESC',asignaciones_estados:{fecha_registro:'DESC'}}},
      // order: {asignaciones: {asignaciones_estados: {fecha_registro: 'DESC'}}},
      order: {fecha_registro: 'DESC'}
    });

    for(let i=0;i<data.items.length;i++) {
      data.items[i].zeus = await this.commonService.getOficinaZeusPro(data.items[i].id_oficina)
    }
    return data;
  }

  // async search(
  //   options: IPaginationOptions, searchDto: SearchProcesoDto
  // ): Promise<Proceso[]> {
  //   const {nurej = "", demandado = "", demandante = ""} = searchDto
  //   const queryBuilder = this.procesoRepository.createQueryBuilder('proceso');
  //   queryBuilder
  //     .leftJoinAndSelect('proceso.materia', 'materia')
  //     .leftJoinAndSelect('proceso.asignaciones', 'asignacion')
  //     .leftJoinAndSelect('asignacion.asignaciones_estados', 'asignacion_estado')
  //     .leftJoinAndSelect('asignacion.defensor', 'defensor')
  //     .where('proceso.nurej ILIKE :nurej', { nurej: `%${nurej}%` })
  //     .andWhere('proceso.demandado ILIKE :demandado', {
  //       demandado: `%${demandado}%`,
  //     })
  //     .andWhere('proceso.demandante ILIKE :demandante', {
  //       demandante: `%${demandante}%`,
  //     })
  //     .andWhere('proceso.registro_activo = :registro_activo', {
  //       registro_activo: true,
  //     })

  //     .andWhere('asignacion_estado.vigente = :vigente', { vigente: true })

  //     .orderBy('proceso.fecha_registro', 'DESC') 
  //     .addOrderBy('asignacion.fecha_registro', 'DESC')
  //     .addOrderBy('asignacion_estado.fecha_registro', 'DESC');
    
  //   // const data = await paginate<Proceso>(this.procesoRepository, options, {}
  //   return await queryBuilder.getMany();
  // }

  async all() {
    const proceso = await this.procesoRepository.find({
      where:{registro_activo:true},
      relations:{asignaciones:true,},
  });
  return proceso;
  }

  async findAll(options: IPaginationOptions) {
    let data = await this.paginate(options);
    for(let i=0;i<data.items.length;i++) {
      data.items[i].zeus = await this.commonService.getOficinaZeusPro(data.items[i].id_oficina)
    }
    return data;
  }

  async findOne(id: string) {
    const proceso = await this.procesoRepository.findOne(
      {
        where:{
          id,
          registro_activo:true
        }
        ,relations:{
          materia:true,
          asignaciones:{
            asignaciones_estados:{
              estado:true
            },
            defensor:{
              persona:true
            }
          }
        },
      }
    );
    if ( !proceso ) throw new NotFoundException(`El proceso con id: ${id} no existe.`);
    const zeus = await this.commonService.getOficinaZeusPro(proceso.id_oficina);
    proceso.zeus=zeus;
    return proceso;
  }

  async update(id: string, updateProcesoDto: UpdateProcesoDto) {
    const proceso = await this.procesoRepository.preload({id, ...updateProcesoDto });
    
    if ( !proceso ) throw new NotFoundException(`Proceso con el id: ${id} no existe`);
    if(proceso.registro_activo===false) throw new NotFoundException(`Proceso con el id: ${id} fue dado de baja`);
    try {
      await this.procesoRepository.save(proceso);
      return proceso;
    } catch (error) {
      this.handleDBExpeptions(error);
    }
  }

  async remove(id: string) {
    const proceso = await this.findOne(id);
    proceso.registro_activo=false;
    await this.procesoRepository.save(proceso)
    return { message:"Eliminado correctamente." };
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
