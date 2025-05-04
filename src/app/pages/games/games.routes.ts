import { Routes } from "@angular/router";
import { PreguntadosComponent } from "../preguntados/preguntados.component";
import { AhorcadoComponent } from "../ahorcado/ahorcado.component";
import { MayorMenorComponent } from "../mayor-menor/mayor-menor.component";

const routes: Routes = [
  { path: 'preguntados', component: PreguntadosComponent},
  { path: 'ahorcado', component: AhorcadoComponent},
  { path: 'mayor-menor', component: MayorMenorComponent},
]

export { routes };