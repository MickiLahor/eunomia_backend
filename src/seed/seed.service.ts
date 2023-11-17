import { Injectable } from '@nestjs/common';
import { DefensorService } from 'src/defensor/service/defensor.service';
import { MateriaService } from 'src/materia/service/materia.service';
import { PersonaService } from 'src/persona/service/persona.service';
import { ProcesoService } from 'src/proceso/service/proceso.service';
import { initialData } from './data/seed-data';
import { TipoExcusaService } from 'src/tipo-excusa/service/tipo-excusa.service';
import { TipoInformeService } from 'src/tipo_informe/service/tipo_informe.service';

@Injectable()
export class SeedService {

  constructor(
    private materiaService: MateriaService,
    private procesoService: ProcesoService,
    private personaService: PersonaService,
    private defensorService: DefensorService,
    private tipoExcusaService: TipoExcusaService,
    private tipoInformeService: TipoInformeService,
    
  ) {}
  
  async runSeed() {
    await this.insertNewMaterias();
    await this.insertNewPersona();
    await this.insertNewDefensor();
    await this.insertNewProcesos();
    await this.insertNewTipoExcusas();
    await this.insertNewTipoInforme();
    return "exe";
  }

  private async insertNewTipoInforme() {
    const tipo_informes = initialData.tipo_informe;

    const insertPromises = []

    tipo_informes.forEach(tipo_informe => {
      insertPromises.push(this.tipoInformeService.create( tipo_informe ))
    });

    const results = await Promise.all( insertPromises );

    return results;
  }

  private async insertNewTipoExcusas() {
    const tipo_excusas = initialData.tipo_excusa;

    const insertPromises = []

    tipo_excusas.forEach(tipo_excusa => {
      insertPromises.push(this.tipoExcusaService.create( tipo_excusa ))
    });

    const results = await Promise.all( insertPromises );

    return results;
  }

  private async insertNewMaterias() {
    const materias = initialData.materias;

    const insertPromises = []

    materias.forEach(materias => {
      insertPromises.push(this.materiaService.create( materias ))
    });

    const results = await Promise.all( insertPromises );

    return results;
  }

  private async insertNewProcesos() {
    const procesos = initialData.procesos;

    const insertPromises = []

    const idsMaterias = await this.materiaService.findAll()
    let i=0;
    procesos.forEach(async proceso => {
      if(idsMaterias[i]) {
        proceso.id_materia = idsMaterias[i].id;        
        i++;     
        insertPromises.push(this.procesoService.create( proceso ));
      } 
      else i=0;
    });
    const results = await Promise.all( insertPromises );
    return results;
  }

  private async insertNewPersona() {
    const personas = initialData.personas;
    const insertPromises = []
    personas.forEach(async persona => {
    insertPromises.push(this.personaService.create( persona ));     
    });
    const results = await Promise.all( insertPromises );
    return results;
  }

  private async insertNewDefensor() {
    const defensores = initialData.defensor;

    const insertPromises = []

    const idsMaterias = await this.materiaService.findAll()
    const idsPersonas = await this.personaService.findAllSeed()
    let i=0;
    defensores.forEach(async defensor => {
      if(idsMaterias[i]) {
        defensor.id_materia = idsMaterias[i].id;  
        defensor.id_persona = idsPersonas[i].id;        
        i++;     
        insertPromises.push(this.defensorService.create( defensor ));
      } 
      else i=0;
    });
    const results = await Promise.all( insertPromises );
    return results;
  }

}
