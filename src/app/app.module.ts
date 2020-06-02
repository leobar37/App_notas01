import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotesComponent } from './pages/notes/notes.component';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule} from '@angular/forms'
import { NotesService } from './services/notes.service';
import { NoteComponent } from './pages/component/note/note.component';
import { CollectionsComponent } from './pages/collections/collections.component';
import { ItemCollectComponent } from './pages/component/item-collect/item-collect.component';
@NgModule({
  declarations: [
    AppComponent,
    NotesComponent,
    NoteComponent,
    CollectionsComponent,
    ItemCollectComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule   
  ],
  providers: [
     NotesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
