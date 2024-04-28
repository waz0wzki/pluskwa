import { Component } from '@angular/core';
import { WordInterface } from '../interfaces/word.interface';
import { WordService } from '../services/word.service';
import { EditedWordService } from '../services/editedWord.service';
import { Router } from '@angular/router';
import { LoggedUserService } from '../services/loggedUser.service';
import { LoginRedirect } from '../services/loginRedirect.service';
import { UserInterface } from '../interfaces/user.interface';
import { STATUS_OPTIONS } from '../models/status-options';
import { DIFFICULTY_OPTIONS } from '../models/difficulty-options';
import { UserService } from '../services/user.service';
import { WordSetService } from '../services/word-set.service';

@Component({
  selector: 'app-edit-word',
  templateUrl: './edit-word.component.html',
  styleUrl: './edit-word.component.scss',
})
export class EditWordComponent {
  editedWord? = {} as WordInterface;
  loggedUser? = {} as UserInterface;
  difficultySelect: any = [];
  statusSelect: any = [];
  tempWord = {} as WordInterface;
  newTranslation: any = '';

  // public readonly STATUS_OPTIONS = STATUS_OPTIONS;
  // public readonly DIFFICULTY_OPTIONS = DIFFICULTY_OPTIONS;

  constructor(
    private editedWordService: EditedWordService,
    private router: Router,
    private loggedUserService: LoggedUserService,
    private loginRedirect: LoginRedirect,
    private userService: UserService,
    private wordSetService: WordSetService
  ) {}

  ngOnInit() {
    this.loggedUserService.currentUser.subscribe(
      (user) => (this.loggedUser = user)
    );
    this.loginRedirect.redirect(this.loggedUser, this.router);
    this.editedWordService.currentUser.subscribe(
      (word) => (this.editedWord = word)
    );

    DIFFICULTY_OPTIONS.forEach((element) => {
      let d = false;
      if (!this.editedWord) {
        return;
      }
      if (this.editedWord.difficulty == element.value) {
        d = true;
      }
      let difficultySelectOption = {
        value: element.value,
        selected: d,
      };

      this.difficultySelect.push(difficultySelectOption);
    });
    console.log('difdfdfdf', this.difficultySelect);

    STATUS_OPTIONS.forEach((element) => {
      let s = false;
      if (!this.editedWord) {
        return;
      }

      if (this.editedWord.status == element.value) {
        s = true;
      }

      let statusSelectOption = {
        value: element.value,
        selected: s,
      };

      this.statusSelect.push(statusSelectOption);
    });
  }

  editWord() {
    if (!this.loggedUser || !this.editedWord) {
      return;
    }

    let overrideWord = false;
    for (let i = 0; i < this.loggedUser.word.length; i++) {
      if (!this.loggedUser || !this.editedWord) {
        return;
      }

      if (
        this.loggedUser.word[i].word == this.tempWord.word &&
        this.editedWord.language == this.loggedUser.word[i].language
      ) {
        alert('This word already exists');
        overrideWord = false;
        return;
      } else {
        overrideWord = true;
      }
    }
    console.log(
      'nie mam sily do tej kurwy',
      overrideWord,
      this.loggedUser.word
    );
    if (overrideWord) {
      this.editedWord.word = this.tempWord.word;
      this.loggedUser.word[this.editedWord.id] = this.editedWord;
      this.userService.updateUser(this.loggedUser);
    }
  }

  deleteWord() {
    if (!this.loggedUser) {
      return;
    }
    let tempWords: any = [];
    this.loggedUser?.word.forEach((element: any) => {
      console.log('brudna kurwa', element);
      if (this.editedWord && element.word != this.editedWord.word) {
        tempWords.push(element);
      } else {
        console.log('KURWAAAA', element);
      }
    });
    this.loggedUser.word = tempWords;

    this.userService.updateUser(this.loggedUser);
    this.loggedUserService.changeLoggedUser(this.loggedUser);
    this.wordSetService.changeWordSetSource(
      this.wordSetService.getWordSet(
        this.loggedUser.otherLanguage,
        this.loggedUser.word
      )
    );
    this.router.navigate(['search']);
  }

  addTranslation() {
    let temp: any = this.editedWord;
    console.log(this.newTranslation);

    if (!this.loggedUser || !temp || !this.newTranslation) {
      return;
    }
    console.log('temp', temp.translation[this.loggedUser.baseLanguage]);
    temp.translation[this.loggedUser.baseLanguage].push(this.newTranslation);
    this.editedWord = temp;
    this.wordSetService.changeWordSetSource(
      this.wordSetService.getWordSet(
        this.loggedUser.otherLanguage,
        this.loggedUser.word
      )
    );
  }
}
