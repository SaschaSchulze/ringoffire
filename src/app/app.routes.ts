import { RouterModule, Routes } from '@angular/router';
import { StartscreenComponent } from './startscreen/startscreen.component';
import { GameComponent } from './game/game.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', component: StartscreenComponent },
  { path: 'game/:id', component: GameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
