import { Component, Input } from '@angular/core';
import { WordInterface } from '../interfaces/word.interface';
import { UserInterface } from '../interfaces/user.interface';
import { EditedWordService } from '../services/editedWord.service';
import { LoggedUserService } from '../services/loggedUser.service';
import { LoginRedirect } from '../services/loginRedirect.service';
import { Route, Router } from '@angular/router';
import { DIFFICULTY_OPTIONS } from '../models/difficulty-options';
import { STATUS_OPTIONS } from '../models/status-options';
import { LANGUAGES } from '../models/languages';
import { languageInterface } from '../interfaces/language.interface';
import { WordSetService } from '../services/word-set.service';

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
  languages = LANGUAGES;
  words: any = [];
  loggedUser? = {} as UserInterface;
  editedWord = {} as WordInterface;

  searchWord: any;

  searchedWords? = [] as WordInterface[];

  constructor(
    private editedWordService: EditedWordService,
    private loggedUserService: LoggedUserService,
    private loginRedirect: LoginRedirect,
    private router: Router,
    private wordSetService: WordSetService
  ) {}

  ngOnInit() {
    this.loggedUserService.currentUser.subscribe(
      (user) => (this.loggedUser = user)
    );
    this.loginRedirect.redirect(this.loggedUser, this.router);
    if (this.loggedUser) {
      // this.words = this.loggedUser.word;
      this.words = this.wordSetService;
      this.categories = this.loggedUser.category;
      if (this.words) {
        this.searchedWords = [];
        for (let i = 0; i < this.words.length; i++) {
          if (this.words[i].language == this.loggedUser.otherLanguage) {
            this.searchedWords.push(this.words[i]);
          }
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

  addWord() {
    if (!this.loggedUser) {
      return;
    }
    let newTranslations = [] as languageInterface;

    this.editedWord = {
      idw: 0,
      word: 'new word',
      language: this.loggedUser?.otherLanguage,
      wordProgress: 0,
      status: "i don't know",
      difficulty: 'easy',
      imgUrl: 'icons8-image-64.png',
      imgAlt: '',
      translation: newTranslations,
      example: [],
      category: [],
    };

    this.editedWordService.changeEditedWord(this.editedWord);
  }
}
