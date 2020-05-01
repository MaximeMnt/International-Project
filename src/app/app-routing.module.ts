import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/menu/menu.module').then(m => m.MenuPageModule)},
  {
    path: 'moisture',
    loadChildren: () => import('./pages/moisture/moisture.module').then( m => m.MoisturePageModule)
  },  {
    path: 'dewpoint',
    loadChildren: () => import('./pages/dewpoint/dewpoint.module').then( m => m.DewpointPageModule)
  }


  ];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
