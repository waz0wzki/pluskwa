import { Component } from '@angular/core';
import { UserInterface } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { LoggedUserService } from '../services/loggedUser.service';
import { Router } from '@angular/router';
import { LoginRedirect } from '../services/loginRedirect.service';
import { DIFFICULTY_OPTIONS } from '../models/difficulty-options';
import { STATUS_CHANGE_OPTIONS } from '../models/status-change-options';
import { LANGUAGES } from '../models/languages';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  public readonly DIFFICULTY_OPTIONS = DIFFICULTY_OPTIONS;
  public readonly STATUS_CHANGE_OPTIONS = STATUS_CHANGE_OPTIONS;
  public readonly LANGUAGES = LANGUAGES;
  learingDifficulty: any = [
    {
      value: 'beginner',
      selected: true,
    },
    {
      value: 'intermediate',
      selected: false,
    },
    {
      value: 'advanced',
      selected: false,
    },
  ];

  statusChange: any = [
    {
      value: 'automatic',
      selected: true,
    },
    {
      value: 'manual',
      selected: false,
    },
  ];

  users: UserInterface[] = [];

  newMail: string = '';

  constructor(
    private userService: UserService,
    private loggedUserService: LoggedUserService,
    private router: Router,
    private loginRedirect: LoginRedirect
  ) {}

  changeSelectedOption(array: any[], option: string) {
    array.forEach((element) => {
      if (element.value == option) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });
  }

  loggedUser = {} as UserInterface;

  ngOnInit() {
    this.loggedUserService.currentUser.subscribe(
      (user) => (this.loggedUser = user)
    );
    this.loginRedirect.redirect(this.loggedUser, this.router);

    this.userService.getUsers().subscribe((wres: UserInterface[]) => {
      this.users = wres;
      this.newMail = this.loggedUser.email;
      this.changeSelectedOption(
        this.learingDifficulty,
        this.loggedUser.learningdifficulty
      );
    });
  }

  logOut() {
    this.loggedUser = {} as UserInterface;
    this.loggedUserService.changeLoggedUser(this.loggedUser);
    this.router.navigate(['login']);
  }
}
