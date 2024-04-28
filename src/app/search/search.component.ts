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
import { RandomService } from '../services/random.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  categories: any = [];
  users: UserInterface[] = [];
  difficultyLevels: any = [];
  statuses: any = [];
  languages = LANGUAGES;
  words: any = [];
  loggedUser? = {} as UserInterface;
  editedWord = {} as WordInterface;

  searchWord: any;

  searchedWords? = [] as WordInterface[];
  filteredWords? = [] as WordInterface[];

  constructor(
    private editedWordService: EditedWordService,
    private loggedUserService: LoggedUserService,
    private loginRedirect: LoginRedirect,
    private router: Router,
    private wordSetService: WordSetService,
    private randomService: RandomService
  ) {}

  ngOnInit() {
    console.log('ACHTUNG');
    this.loggedUserService.currentUser.subscribe(
      (user) => (this.loggedUser = user)
    );
    this.loginRedirect.redirect(this.loggedUser, this.router);
    if (!this.loggedUser) {
      return;
    }
    // this.words = this.loggedUser.word;
    this.wordSetService.currentWordSet.subscribe(
      (words) => (this.words = words)
    );
    console.log('wordss', this.words);

    this.loggedUser.category.forEach((element) => {
      this.categories.push({
        category: element,
        checked: true,
      });
    });

    DIFFICULTY_OPTIONS.forEach((element) => {
      this.difficultyLevels.push({
        value: element.value,
        checked: true,
      });
    });

    STATUS_OPTIONS.forEach((element) => {
      this.statuses.push({
        value: element.value,
        checked: true,
      });
    });

    if (this.words) {
      this.filteredWords = [];
      for (let i = 0; i < this.words.length; i++) {
        if (this.words[i].language == this.loggedUser.otherLanguage) {
          this.filteredWords.push(this.words[i]);
        }
      }
    }

    this.applyFilter();
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
      id: 0,
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

  search() {
    if (!this.filteredWords) {
      return;
    }
    this.searchedWords = [];
    this.filteredWords.forEach((element: any) => {
      let pushWord = false;

      for (let i = 0; i <= element.word.length - this.searchWord.length; i++) {
        pushWord = false;
        for (let j = 0; j < this.searchWord.length; j++) {
          if (this.searchWord[j] == element.word[i + j]) {
            pushWord = true;
          } else {
            pushWord = false;
            break;
          }
        }
        if (pushWord) {
          if (
            this.searchedWords &&
            !this.randomService.isInArray(this.searchedWords, element)
          ) {
            this.searchedWords?.push(element);
          }
        }
      }
    });
    // console.log(this.searchedWords);
  }

  changeFilters(filter: string, index: number) {
    switch (filter) {
      case 'category':
        this.categories[index].checked = !this.categories[index].checked;
        break;
      case 'status':
        this.statuses[index].checked = !this.statuses[index].checked;
        break;
      case 'difficulty':
        this.difficultyLevels[index].checked =
          !this.difficultyLevels[index].checked;
        break;
    }
    this.applyFilter();
  }

  selectAllFilters(filter: string) {
    switch (filter) {
      case 'category':
        this.categories.forEach((element: any) => {
          element.checked = !element.checked;
        });
        break;
      case 'status':
        this.statuses.forEach((element: any) => {
          element.checked = !element.checked;
        });
        break;
      case 'difficulty':
        this.difficultyLevels.forEach((element: any) => {
          element.checked = !element.checked;
        });
        break;
    }
    this.applyFilter();
  }

  applyFilter() {
    this.filteredWords = [];
    let filtered: any = [];
    this.words.forEach((element: any) => {
      this.difficultyLevels.forEach((diff: any) => {
        if (diff.value == element.difficulty && diff.checked) {
          filtered.push(element);
        }
      });
    });
    filtered.forEach((element: any) => {
      this.statuses.forEach((stat: any) => {
        if (stat.value == element.status && stat.checked) {
          this.filteredWords?.push(element);
        }
      });
    });
    filtered = [];
    console.log('cats', this.filteredWords);
    this.filteredWords.forEach((element: any) => {
      this.categories.forEach((cat: any) => {
        element.category.forEach((item: any) => {
          if (item == cat.category && cat.checked) {
            filtered.push(element);
          }
        });
      });
    });
    console.log('filtereerededed', filtered);
    this.filteredWords = filtered;
    console.log('gjkjkjk', this.filteredWords);
    this.search();
  }
}
