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
import { UserService } from '../services/user.service';

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
  allFilters = {
    category: false,
    difficulty: false,
    status: false,
  };

  searchWord: any;

  searchedWords? = [] as WordInterface[];
  filteredWords? = [] as WordInterface[];

  constructor(
    private editedWordService: EditedWordService,
    private loggedUserService: LoggedUserService,
    private loginRedirect: LoginRedirect,
    private router: Router,
    private wordSetService: WordSetService,
    private randomService: RandomService,
    private userService: UserService
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
        checked: false,
      });
    });

    DIFFICULTY_OPTIONS.forEach((element) => {
      this.difficultyLevels.push({
        value: element.value,
        checked: false,
      });
    });

    STATUS_OPTIONS.forEach((element) => {
      this.statuses.push({
        value: element.value,
        checked: false,
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
    let newTranslations = {
      english: [],
      spanish: [],
      polish: [],
    } as languageInterface;

    this.editedWord = {
      id: '20',
      word: 'new word',
      language: this.loggedUser.otherLanguage,
      wordProgress: 0,
      status: 'i learn',
      difficulty: 'beginner',
      imgUrl: 'icons8-image-96.png',
      imgAlt: 'new word',
      translation: {
        english: ['english translation'],
        polish: ['polskie tłumaczenie'],
      },
      example: ['Example of a new word'],
      category: ['nouns'],
    };
    let maxId = 0;
    this.loggedUser.word.forEach((element: any) => {
      if (parseInt(element.id) > maxId) {
        maxId = element.id;
      }
    });
    maxId++;

    this.editedWord.id = maxId.toString();

    this.editedWordService.changeEditedWord(this.editedWord);
    this.loggedUser.word.push(this.editedWord);
    this.userService.updateUser(this.loggedUser);
    this.wordSetService.changeWordSetSource(
      this.wordSetService.getWordSet(
        this.loggedUser.otherLanguage,
        this.loggedUser.word
      )
    );
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
        console.log('cats changed', this.categories);
        if (!this.categories[index].checked) {
          this.allFilters.category = false;
        }
        if (this.isAllFilterChosen(this.categories)) {
          this.allFilters.category = true;
        }
        break;
      case 'status':
        this.statuses[index].checked = !this.statuses[index].checked;
        console.log('stat changed', this.statuses);
        if (!this.statuses[index].checked) {
          this.allFilters.status = false;
        }
        if (this.isAllFilterChosen(this.statuses)) {
          this.allFilters.status = true;
        }
        break;
      case 'difficulty':
        this.difficultyLevels[index].checked =
          !this.difficultyLevels[index].checked;
        if (!this.difficultyLevels[index].checked) {
          this.allFilters.difficulty = false;
        }
        if (this.isAllFilterChosen(this.difficultyLevels)) {
          this.allFilters.difficulty = true;
        }
        console.log('diff changed', this.difficultyLevels);
        break;
    }

    this.applyFilter();
  }

  selectAllFilters(filter: string) {
    console.log('expecto patronum', this.allFilters);
    switch (filter) {
      case 'category':
        this.allFilters.category = !this.allFilters.category;
        this.categories.forEach((element: any) => {
          element.checked = this.allFilters.category;
        });
        break;
      case 'status':
        this.allFilters.status = !this.allFilters.status;
        this.statuses.forEach((element: any) => {
          element.checked = this.allFilters.status;
        });
        break;
      case 'difficulty':
        this.allFilters.difficulty = !this.allFilters.difficulty;
        this.difficultyLevels.forEach((element: any) => {
          element.checked = this.allFilters.difficulty;
        });
        break;
    }
    this.applyFilter();
  }

  applyFilter() {
    this.filteredWords = [];
    let filtered: any = [];
    let empty = this.isNoFilterChosen(this.difficultyLevels);
    console.log('empty diff', empty);
    this.words.forEach((element: any) => {
      this.difficultyLevels.forEach((diff: any) => {
        if ((diff.value == element.difficulty && diff.checked) || empty) {
          filtered.push(element);
        }
      });
    });
    empty = this.isNoFilterChosen(this.statuses);
    console.log('empty stat', empty);
    filtered.forEach((element: any) => {
      this.statuses.forEach((stat: any) => {
        if ((stat.value == element.status && stat.checked) || empty) {
          this.filteredWords?.push(element);
        }
      });
    });
    filtered = [];
    empty = this.isNoFilterChosen(this.categories);
    console.log('empty cats', empty);
    console.log('cats', this.filteredWords);
    this.filteredWords.forEach((element: any) => {
      this.categories.forEach((cat: any) => {
        element.category.forEach((item: any) => {
          if ((item == cat.category && cat.checked) || empty) {
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

  isNoFilterChosen(array: any) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].checked == true) {
        return false;
      }
    }
    return true;
  }

  isAllFilterChosen(array: any) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].checked == false) {
        return false;
      }
    }
    return true;
  }
}
