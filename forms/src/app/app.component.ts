import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  sidenavCollapsed = false;

  toggleSidenav(): void {
    this.sidenavCollapsed = !this.sidenavCollapsed;
  }
}
