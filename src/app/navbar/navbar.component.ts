import { Component } from '@angular/core';
import { LoggedUserService } from '../services/loggedUser.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(private loggedUserService: LoggedUserService) {}

  loggedUser?: any;

  navbaritems = [
    {
      label: 'LEARN',
      routerLink: 'learn',
      imgUrl: 'assets/icons8-teaching-96.png',
    },
    {
      label: 'SEARCH',
      routerLink: 'search',
      imgUrl: 'assets/icons8-search-96.png',
    },
    {
      label: 'SETTINGS',
      routerLink: 'settings',
      imgUrl: 'assets/icons8-settings-96.png',
    },
  ];

  ngOnInit() {
    this.loggedUserService.currentUser.subscribe(
      (user) => (this.loggedUser = user)
    );
  }
}
