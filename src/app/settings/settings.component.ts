import { Component } from '@angular/core';
import { UserInterface } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { LoggedUserService } from '../services/loggedUser.service';
import { Router } from '@angular/router';
import { LoginRedirect } from '../services/loginRedirect.service';
import { DIFFICULTY_OPTIONS } from '../models/difficulty-options';
import { STATUS_CHANGE_OPTIONS } from '../models/status-change-options';
import { LANGUAGES } from '../models/languages';
import { WordSetService } from '../services/word-set.service';
import { WordService } from '../services/word.service';
import { WordInterface } from '../interfaces/word.interface';
import { TimeService } from '../services/time.service';

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
  oldPassword: string = '';
  newPassword: string = '';
  newLearningDifficulty = '';
  newStatusChange = '';
  newBaseLanguage = '';
  newOtherLanguage = '';
  courseMessage = '';
  courseError = false;
  userMessage = '';
  userError = false;

  constructor(
    private userService: UserService,
    private loggedUserService: LoggedUserService,
    private router: Router,
    private loginRedirect: LoginRedirect,
    private wordSetService: WordSetService,
    private wordService: WordService,
    private timeService: TimeService
  ) {}

  loggedUser = {} as UserInterface;

  ngOnInit() {
    this.loggedUserService.currentUser.subscribe(
      (user) => (this.loggedUser = user)
    );
    this.loginRedirect.redirect(this.loggedUser, this.router);

    this.wordService.getBasicWords().subscribe((words: any) => {
      console.log('niedzwiedz', words);
    });

    this.userService.getUsers().subscribe((wres: UserInterface[]) => {
      this.users = wres;
      // this.newMail = this.loggedUser.email;
      LANGUAGES.forEach((element) => {
        let bL = false;
        let oL = false;
        if (this.loggedUser.baseLanguage == element.language) {
          bL = true;
          this.newBaseLanguage = element.language;
        }
        if (this.loggedUser.otherLanguage == element.language) {
          oL = true;
          this.newOtherLanguage = element.language;
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
          this.newLearningDifficulty = element.value;
        }
        let difficultySelectOption = {
          value: element.value,
          selected: d,
        };

        this.difficultySelect.push(difficultySelectOption);
      });

      STATUS_CHANGE_OPTIONS.forEach((element) => {
        let sC = false;
        if (this.loggedUser.statuschange == element.value) {
          sC = true;
          this.newStatusChange = element.value;
        }

        let selectChangeSelectOption = {
          value: element.value,
          selected: sC,
        };
        console.log('select', selectChangeSelectOption);
        this.statusSelect.push(selectChangeSelectOption);
      });
    });
  }

  logOut() {
    this.loggedUser = {} as UserInterface;
    this.loggedUserService.changeLoggedUser(this.loggedUser);
    this.router.navigate(['login']);
  }

  async changeLoginData() {
    if (!this.loggedUser) {
      return;
    }

    if (this.newMail != '') {
      for (let i = 0; i < this.users.length; i++) {
        // console.log(i,this.email,this.password)
        // console.log(i,this.users[i].email,this.users[i].password)
        if (this.newMail == this.users[i].email) {
          this.userMessage = 'User with this email already exists';
          this.userError = true;
          await this.timeService.delay(1000);
          this.userError = false;
          this.userMessage = '';
          return;
        }
      }
      this.loggedUser.email = this.newMail;
    }

    if (this.oldPassword != '' && this.newPassword != '') {
      if (this.oldPassword != this.loggedUser.password) {
        this.userError = true;
        this.userMessage = 'Incorrect password';
        await this.timeService.delay(1000);
        this.userMessage = '';
        this.userError = false;
        return;
      } else {
        this.loggedUser.password = this.newPassword;
      }
    }
    this.userService.updateUser(this.loggedUser);
    this.userMessage = 'User changes applied';
    await this.timeService.delay(1000);
    this.userMessage = '';
  }

  async changeCourseSettings() {
    if (!this.loggedUser) {
      return;
    }

    this.loggedUser.learningdifficulty = this.newLearningDifficulty;
    this.loggedUser.statuschange = this.newStatusChange;
    this.loggedUser.baseLanguage = this.newBaseLanguage;
    this.loggedUser.otherLanguage = this.newOtherLanguage;
    this.userService.updateUser(this.loggedUser);
    this.wordSetService.changeWordSetSource(
      this.wordSetService.getWordSet(
        this.loggedUser.otherLanguage,
        this.loggedUser.word
      )
    );
    this.courseMessage = 'Course changes applied';
    await this.timeService.delay(1000);
    this.courseMessage = '';
  }

  async resetProgress() {
    if (!confirm('Are you sure? This operation cannot be undone')) {
      return;
    }
    let basicWord = [] as any;
    this.wordService.getBasicWords().subscribe((words: any) => {
      basicWord = words;
      console.log('basic boobs', basicWord);
      this.loggedUser.word = basicWord;
      this.userService.updateUser(this.loggedUser);
      this.wordSetService.changeWordSetSource(
        this.wordSetService.getWordSet(
          this.loggedUser.otherLanguage,
          this.loggedUser.word
        )
      );
    });
    this.courseError = true;
    this.courseMessage = 'Progress reset';
    await this.timeService.delay(1000);
    this.courseMessage = '';
    this.courseError = false;
  }

  deleteUser() {
    if (!this.loggedUser) {
      return;
    }

    if (
      !confirm(
        'Are you sure? This operation cannot be undone and your mum will be sad'
      )
    ) {
      return;
    }

    this.userService.deleteUser(this.loggedUser);
    this.loggedUser = {} as UserInterface;
    this.router.navigate(['login']);
  }
}
