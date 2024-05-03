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
import { max } from 'rxjs';
import { TimeService } from '../services/time.service';
import { HttpClient } from '@angular/common/http';

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
  translationSelect: any = [];
  tempWord = {} as WordInterface;
  newTranslation: any = '';
  convictTranslation: any = '';
  exampleSelect: any = [];
  newExample: any = '';
  convictExample: any = '';
  newCategoryToWord: any = '';
  convictWordCategory: any = '';
  newStatus: any = '';
  newDifficulty: any = '';
  newCategory: any = '';
  convictCategory: any = '';
  wordMessage = '';
  wordError = false;
  translationMessage = '';
  translationError = false;
  exampleMessage = '';
  exampleError = false;
  statusMessage = '';
  difficultyMessage = '';
  categoryMessage = '';
  categoryError = false;

  // public readonly STATUS_OPTIONS = STATUS_OPTIONS;
  // public readonly DIFFICULTY_OPTIONS = DIFFICULTY_OPTIONS;

  constructor(
    private editedWordService: EditedWordService,
    private router: Router,
    private loggedUserService: LoggedUserService,
    private loginRedirect: LoginRedirect,
    private userService: UserService,
    private wordSetService: WordSetService,
    private timeService: TimeService,
    private http: HttpClient
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
    this.statusSelect[0].selected = true;

    this.getTranslations();
    this.getExamples();
  }

  async editWord() {
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
        // alert('This word already exists');
        this.wordMessage = 'This word already exist';
        this.wordError = true;
        await this.timeService.delay(1000);
        this.wordError = false;
        this.wordMessage = '';
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
      console.log(
        this.tempWord,
        this.editedWord
        // this.loggedUser.word[this.editedWord.id]
      );
      // this.loggedUser.word[this.editedWord.id] = this.editedWord;
      this.userService.updateUser(this.loggedUser);
      this.getTranslations();
      this.wordMessage = 'Word updated';
      await this.timeService.delay(1000);
      this.wordMessage = '';
    }
  }

  deleteWord() {
    if (!this.loggedUser) {
      return;
    }

    if (!confirm('Are you sure?')) {
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

  async addTranslation() {
    let temp: any = this.editedWord;
    console.log(this.newTranslation);

    if (!this.loggedUser || !temp || !this.newTranslation || !this.editedWord) {
      return;
    }
    console.log('temp', temp.translation[this.loggedUser.baseLanguage]);
    let addTranslation = true;
    temp.translation[this.loggedUser.baseLanguage].forEach((element: any) => {
      if (element == this.newTranslation) {
        addTranslation = false;
      }
    });
    if (!addTranslation) {
      // alert('translation already exist');
      this.translationMessage = 'This translation already exist';
      this.translationError = true;
      await this.timeService.delay(1000);
      this.translationError = false;
      this.translationMessage = '';
      return;
    }
    temp.translation[this.loggedUser.baseLanguage].push(this.newTranslation);
    this.editedWord = temp;
    console.log(this.editedWord);
    // this.loggedUser.word[this.editedWord.id] = this.editedWord;
    this.userService.updateUser(this.loggedUser);
    this.wordSetService.changeWordSetSource(
      this.wordSetService.getWordSet(
        this.loggedUser.otherLanguage,
        this.loggedUser.word
      )
    );
    this.getTranslations();
    this.translationMessage = 'Translation added';
    await this.timeService.delay(1000);
    this.translationMessage = '';
  }

  getTranslations() {
    if (!this.loggedUser || !this.editedWord) {
      return;
    }
    this.translationSelect = [];
    let eWord: any = this.editedWord;
    eWord.translation[this.loggedUser?.baseLanguage].forEach((element: any) => {
      let translationSelectOption = {
        translation: element,
        selected: false,
      };
      this.translationSelect.push(translationSelectOption);
    });
  }

  async deleteTranslation() {
    if (!this.loggedUser || !this.convictTranslation || !this.editedWord) {
      return;
    }

    if (!confirm('Are you sure?')) {
      return;
    }

    let temp: any = this.editedWord;
    temp.translation[this.loggedUser.baseLanguage].forEach(
      (element: any) => {}
    );
    this.removeFromArray(
      temp.translation[this.loggedUser.baseLanguage],
      this.convictTranslation
    );
    this.editedWord = temp;
    console.log(
      this.translationSelect,
      'convict',
      this.convictTranslation,
      'word',
      this.editedWord
    );
    this.userService.updateUser(this.loggedUser);
    this.getTranslations();
    this.translationMessage = 'Translation deleted';
    await this.timeService.delay(1000);
    this.translationMessage = '';
  }

  removeFromArray(array: any, item: any) {
    let index = array.indexOf(item);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  getExamples() {
    if (!this.loggedUser || !this.editedWord) {
      return;
    }
    this.exampleSelect = [];
    let eWord = this.editedWord;
    console.log('ex', this.editedWord.example);
    eWord.example.forEach((element: any) => {
      let exampleSelectOption = {
        example: element,
        selected: false,
      };
      this.exampleSelect.push(exampleSelectOption);
    });
  }

  async addExample() {
    let temp: any = this.editedWord;
    console.log(this.newExample);

    if (!this.loggedUser || !temp || !this.newExample || !this.editedWord) {
      return;
    }
    let addExample = true;
    temp.example.forEach((element: any) => {
      if (this.newExample == element) {
        addExample = false;
      }
    });
    if (!addExample) {
      this.exampleMessage = 'This example already exist';
      this.exampleError = true;
      await this.timeService.delay(1000);
      this.exampleError = false;
      this.exampleMessage = '';
      return;
    }

    temp.example.push(this.newExample);
    this.editedWord = temp;
    console.log(this.editedWord);
    // this.loggedUser.word[this.editedWord.id] = this.editedWord;
    this.userService.updateUser(this.loggedUser);
    this.wordSetService.changeWordSetSource(
      this.wordSetService.getWordSet(
        this.loggedUser.otherLanguage,
        this.loggedUser.word
      )
    );
    this.getExamples();
    this.exampleMessage = 'Example added';
    await this.timeService.delay(1000);
    this.exampleMessage = '';
  }

  async deleteExample() {
    if (!this.loggedUser || !this.convictExample || !this.editedWord) {
      return;
    }

    if (!confirm('Are you sure?')) {
      return;
    }
    let temp: any = this.editedWord;

    this.removeFromArray(temp.example, this.convictExample);
    this.editedWord = temp;
    console.log(
      this.exampleSelect,
      'convict',
      this.convictExample,
      'word',
      this.editedWord
    );
    this.userService.updateUser(this.loggedUser);
    this.getExamples();
    this.exampleMessage = 'Example deleted';
    await this.timeService.delay(1000);
    this.exampleMessage = '';
  }

  async addCategoryToWord() {
    console.log(this.newCategoryToWord);
    if (!this.loggedUser || !this.newCategoryToWord || !this.editedWord) {
      return;
    }
    let addCatToWord = true;
    this.editedWord.category.forEach((element: any) => {
      if (this.newCategoryToWord == element) {
        addCatToWord = false;
      }
    });

    if (!addCatToWord) {
      this.categoryMessage = 'This word already has this category';
      this.categoryError = true;
      await this.timeService.delay(1000);
      this.categoryError = false;
      this.categoryMessage = '';
      return;
    }

    this.editedWord.category.push(this.newCategoryToWord);
    this.userService.updateUser(this.loggedUser);
    this.categoryMessage = 'Category added to word';
    await this.timeService.delay(1000);
    this.categoryMessage = '';
  }

  async deleteCategoryFromWord() {
    if (!this.loggedUser || !this.convictWordCategory || !this.editedWord) {
      return;
    }

    if (!confirm('Are you sure?')) {
      return;
    }
    let temp: any = this.editedWord;

    this.removeFromArray(temp.category, this.convictWordCategory);
    this.editedWord = temp;
    console.log('convict', this.convictWordCategory, 'word', this.editedWord);
    this.userService.updateUser(this.loggedUser);
    this.categoryMessage = 'Category deleted from word';
    await this.timeService.delay(1000);
    this.categoryMessage = '';
  }

  async changeStatus() {
    if (!this.loggedUser || !this.newStatus || !this.editedWord) {
      return;
    }
    let temp: any = this.editedWord;
    temp.status = this.newStatus;
    this.editedWord = temp;
    this.userService.updateUser(this.loggedUser);
    this.statusMessage = 'Status changed';
    await this.timeService.delay(1000);
    this.statusMessage = '';
  }

  async changeDifficulty() {
    if (!this.loggedUser || !this.newDifficulty || !this.editedWord) {
      return;
    }
    let temp: any = this.editedWord;
    temp.difficulty = this.newDifficulty;
    this.editedWord = temp;
    this.userService.updateUser(this.loggedUser);
    this.difficultyMessage = 'Difficulty changed';
    await this.timeService.delay(1000);
    this.difficultyMessage = '';
  }

  addAsNewWord() {
    console.log('gole baby');
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

    if (overrideWord) {
      let maxId = 0;
      this.loggedUser.word.forEach((element: any) => {
        if (parseInt(element.id) > maxId) {
          maxId = element.id;
        }
      });
      maxId++;
      console.log(maxId);
    }
  }

  addNewCategory() {
    if (!this.loggedUser || !this.newCategory) {
      return;
    }
    console.log('category added', this.newCategory);
    this.loggedUser.category.push(this.newCategory);
    this.userService.updateUser(this.loggedUser);
  }

  deleteCategory() {
    if (!this.loggedUser || !this.convictCategory) {
      return;
    }
    console.log('removed category', this.convictCategory);
    this.removeFromArray(this.loggedUser.category, this.convictCategory);
    this.loggedUser.word.forEach((element: any) => {
      this.removeFromArray(element.category, this.convictCategory);
    });
    this.userService.updateUser(this.loggedUser);
  }

  file: any;

  getFile(event: any) {
    this.file = event.target.files[0];
    console.log('ledossier', this.file);
    let newName = this.loggedUser?.email + '_' + this.editedWord?.word;
    let fileType = this.file.name.split('?')[0].split('.').pop();
    let fullFileName = newName + '.' + fileType;
    let formData = new FormData();
    formData.append('file', this.file, fullFileName);

    // this.userService.uploadPhoto(formData);
    this.http
      .post('http://localhost:8008/api/upload', formData)
      .subscribe((res: any) => {
        console.log(res);
        if (!this.editedWord || !this.loggedUser) {
          return;
        }
        this.editedWord.imgUrl = fullFileName;
        this.editedWord.imgAlt = this.editedWord.word;
        console.log('ścieżka do dupy', fullFileName);
        this.userService.updateUser(this.loggedUser);
        this.wordSetService.changeWordSetSource(
          this.wordSetService.getWordSet(
            this.loggedUser.otherLanguage,
            this.loggedUser.word
          )
        );
      });
    // this.userService.deletePhoto(this.file);
  }
}
