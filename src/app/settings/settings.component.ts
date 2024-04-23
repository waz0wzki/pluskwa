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
  // public readonly DIFFICULTY_OPTIONS = DIFFICULTY_OPTIONS;
  // public readonly STATUS_CHANGE_OPTIONS = STATUS_CHANGE_OPTIONS;
  // public readonly LANGUAGES = LANGUAGES;

  languageSelect: any = [];
  difficultySelect: any = [];
  statusSelect: any = [];

  users: UserInterface[] = [];

  newMail: string = '';

  constructor(
    private userService: UserService,
    private loggedUserService: LoggedUserService,
    private router: Router,
    private loginRedirect: LoginRedirect
  ) {}

  loggedUser = {} as UserInterface;

  ngOnInit() {
    this.loggedUserService.currentUser.subscribe(
      (user) => (this.loggedUser = user)
    );
    this.loginRedirect.redirect(this.loggedUser, this.router);

    this.userService.getUsers().subscribe((wres: UserInterface[]) => {
      this.users = wres;
      this.newMail = this.loggedUser.email;
      LANGUAGES.forEach((element) => {
        let bL = false;
        let oL = false;
        if (this.loggedUser.baseLanguage == element.language) {
          bL = true;
        }
        if (this.loggedUser.otherLanguage == element.language) {
          oL = true;
        }
        let languageSelectOption = {
          language: element.language,
          baseLanguage: bL,
          otherLanguage: oL,
        };
        console.log('option', languageSelectOption);
        this.languageSelect.push(languageSelectOption);
      });
      console.log('bajlando', this.languageSelect);

      DIFFICULTY_OPTIONS.forEach((element) => {
        let d = false;
        if (this.loggedUser.learningdifficulty == element.value) {
          d = true;
        }
        let difficultySelectOption = {
          value: element.value,
          selected: d,
        };
        this.difficultySelect.push(difficultySelectOption);
      });

      STATUS_CHANGE_OPTIONS.forEach((element) => {
        let sC = false;
        if (this.loggedUser.learningdifficulty == element.value) {
          sC = true;
        }

        let selectChangeSelectOption = {
          value: element.value,
          selected: sC,
        };
        this.statusSelect.push(selectChangeSelectOption);
      });
    });
  }

  logOut() {
    this.loggedUser = {} as UserInterface;
    this.loggedUserService.changeLoggedUser(this.loggedUser);
    this.router.navigate(['login']);
  }
}
