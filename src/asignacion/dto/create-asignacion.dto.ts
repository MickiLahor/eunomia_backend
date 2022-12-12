import { Defensor } from "src/defensor/entities/defensor.entity";
import { Proceso } from "src/proceso/entities/proceso.entity";

export class CreateAsignacionDto {
    fecha: Date;
    proceso: Proceso;
    defensor: Defensor;
}
