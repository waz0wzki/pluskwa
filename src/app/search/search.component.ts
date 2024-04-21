import { Component } from '@angular/core';
import { WordInterface } from '../interfaces/word.interface';
import { UserInterface } from '../interfaces/user.interface';
import { EditedWordService } from '../services/editedWord.service';
import { LoggedUserService } from '../services/loggedUser.service';
import { LoginRedirect } from '../services/loginRedirect.service';
import { Route, Router } from '@angular/router';
import { DIFFICULTY_OPTIONS } from '../models/difficulty-options';
import { STATUS_OPTIONS } from '../models/status-options';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  categories: string[] = [];
  users: UserInterface[] = [];
  difficultyLevels = DIFFICULTY_OPTIONS;
  statuses = STATUS_OPTIONS;
  words? = {} as WordInterface[];
  loggedUser? = {} as UserInterface;
  editedWord = {} as WordInterface;

  searchWord: any;

  searchedWords? = [] as WordInterface[];

  constructor(
    private editedWordService: EditedWordService,
    private loggedUserService: LoggedUserService,
    private loginRedirect: LoginRedirect,
    private router: Router
  ) {}

  ngOnInit() {
    this.loggedUserService.currentUser.subscribe(
      (user) => (this.loggedUser = user)
    );
    this.loginRedirect.redirect(this.loggedUser, this.router);
    if (this.loggedUser) {
      this.words = this.loggedUser.word;
      this.categories = this.loggedUser.category;
      this.searchedWords = [];
      for (let i = 0; i < this.words.length; i++) {
        if (this.words[i].language == this.loggedUser.otherLanguage) {
          this.searchedWords.push(this.words[i]);
        }
      }
    }
  }

  editWord(wordIdx: any) {
    if (this.searchedWords) {
      this.editedWord = this.searchedWords[wordIdx];
      this.editedWordService.changeEditedWord(this.editedWord);
      console.log(this.editedWord);
    }
  }
}
