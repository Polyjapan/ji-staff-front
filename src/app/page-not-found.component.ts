import { Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `<div class="panel panel-danger">
    <div class="panel-heading">Page introuvable</div>
    <div class="panel-body">
      <p>La page recherchée n'a pas été trouvée !</p>
    </div>
  </div>`
})
export class PageNotFoundComponent {
}
