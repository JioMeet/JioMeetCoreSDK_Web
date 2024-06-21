import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreviewComponent } from './components/preview/preview.component';
import { ConferenceComponent } from './components/conference/conference.component';

const routes: Routes=[
  {
    path: 'preview',
    component: PreviewComponent,
    canActivate: []
},
{
  path: 'conference',
  component: ConferenceComponent,
  canActivate: []
},
{
  path:'',
  pathMatch: 'full',
  redirectTo:'preview'
}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
