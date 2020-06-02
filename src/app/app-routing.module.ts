import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotesComponent } from './pages/notes/notes.component';
import { CollectionsComponent } from './pages/collections/collections.component';


const routes: Routes = [
   {path : 'notes/:id' , component: NotesComponent },
   {path : 'collect' ,  component: CollectionsComponent},
   { path : '**' , pathMatch : 'full' ,  redirectTo :'/collect'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash : true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
