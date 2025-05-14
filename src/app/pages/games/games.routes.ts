import { Routes } from "@angular/router";
import { PreguntadosComponent } from "../preguntados/preguntados.component";
import { AhorcadoComponent } from "../ahorcado/ahorcado.component";
import { MayorMenorComponent } from "../mayor-menor/mayor-menor.component";
import { GamesComponent } from "./games.component";
import { DeftionaryComponent } from "../deftionary/deftionary.component";

const routes: Routes = [
  {
    path: '',
    component: GamesComponent,
    children: [
      { path: 'preguntados', component: PreguntadosComponent },
      { path: 'ahorcado', component: AhorcadoComponent },
      { path: 'mayor-menor', component: MayorMenorComponent },
      { path: 'deftionary', component: DeftionaryComponent },
      { path: '', redirectTo: 'ahorcado', pathMatch: 'full' }
    ]
  }
]

export { routes };