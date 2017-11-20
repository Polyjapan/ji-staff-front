import { Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `<div class="panel panel-danger">
    <div class="panel-heading">Page not found</div>
    <div class="panel-body">
      <p>The requested page cannot be found!</p>
    </div>
  </div>`
})
export class PageNotFoundComponent {
}
