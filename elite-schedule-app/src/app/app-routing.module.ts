import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'my-teams',
    pathMatch: 'full'
  },
  { path: 'my-teams', loadChildren: './my-teams/my-teams.module#MyTeamsPageModule' },
  { path: 'tournaments', loadChildren: './tournaments/tournaments.module#TournamentsPageModule' },  { path: 'teams', loadChildren: './teams/teams.module#TeamsPageModule' },
  { path: 'team-detail', loadChildren: './team-detail/team-detail.module#TeamDetailPageModule' },
  { path: 'game', loadChildren: './game/game.module#GamePageModule' }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
