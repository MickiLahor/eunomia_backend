import { Injectable } from '@nestjs/common';
import { DefensorService } from 'src/defensor/defensor.service';
import { MateriaService } from 'src/materia/materia.service';
import { PersonaService } from 'src/persona/persona.service';
import { ProcesoService } from 'src/proceso/proceso.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private materiaService: MateriaService,
    private procesoService: ProcesoService,
    private personaService: PersonaService,
    private defensorService: DefensorService
  ) {}
  
  async runSeed() {
    //await this.insertNewMaterias();
    // await this.insertNewPersona();
    // await this.insertNewDefensor();
    await this.insertNewProcesos();
    return "exe";
  }

  private async insertNewMaterias() {
    //await this.productService.deleteAllProducts();
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
        proceso.idMateria = idsMaterias[i].id;        
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
        defensor.idMateria = idsMaterias[i].id;  
        defensor.idPersona = idsPersonas[i].id;        
        i++;     
        insertPromises.push(this.defensorService.create( defensor ));
      } 
      else i=0;
    });
    const results = await Promise.all( insertPromises );
    return results;
  }

}
