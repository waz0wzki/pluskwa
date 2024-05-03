import { Component, Input, Output } from '@angular/core';
import { WordInterface } from '../../interfaces/word.interface';
import { UserInterface } from '../../interfaces/user.interface';
import { LoggedUserService } from '../../services/loggedUser.service';
import { TimeService } from '../../services/time.service';
import { Router } from '@angular/router';
import { RandomService } from '../../services/random.service';
import { LANGUAGES } from '../../models/languages';
import { WordSetService } from '../../services/word-set.service';
import { UserService } from '../../services/user.service';
import { WordStatusService } from '../../services/wordStatus.service';

@Component({
  selector: 'app-learn-advanced',
  templateUrl: './learn-advanced.component.html',
  styleUrl: './learn-advanced.component.scss',
})
export class LearnAdvancedComponent {
  words: any = [];
  loggedUser? = {} as UserInterface;
  wordIdx = 0;
  errorIdx = 0;
  advancedConfirm = '';
  confirmStatus = '';
  @Input() chosenWords: any;
  baseLanguage = '';
  otherLanguage = '';
  userLanguages: any;
  userTranslations: any;

  languages = LANGUAGES;
  specialCharacters: string[] = [];

  constructor(
    private loggedUserService: LoggedUserService,
    private timeService: TimeService,
    private router: Router,
    private randomService: RandomService,
    private wordSetService: WordSetService,
    private userService: UserService,
    private wordStatusService: WordStatusService
  ) {}
  ngOnInit() {
    this.loggedUserService.currentUser.subscribe(
      (user) => (this.loggedUser = user)
    );
    if (this.loggedUser) {
      // this.words = this.loggedUser.word;
      this.baseLanguage = this.loggedUser.baseLanguage;
      this.otherLanguage = this.loggedUser.otherLanguage;
      console.log('base', this.baseLanguage, 'other', this.otherLanguage);
      this.wordSetService.currentWordSet.subscribe(
        (words) => (this.words = words)
      );
      this.userLanguages = Object.keys(this.words[this.wordIdx].translation);

      this.nextTranslations();
      console.log('lnags', this.languages);
      let chars = this.languages.find(
        (element) => element.language == this.otherLanguage
      );

      if (chars) {
        this.specialCharacters = chars.symbols;
      }

      console.log('chars', this.specialCharacters);
    }
  }

  nextWord() {
    this.advancedConfirm = '';
    if (!this.words) {
      return;
    }
    if (this.wordIdx < this.chosenWords.length - 1) {
      this.wordIdx++;
      this.nextTranslations();
    } else {
      this.chosenWords = [];
      this.chosenWords = this.randomService.uniqueRandomArray(
        4,
        this.words,
        this.chosenWords[this.wordIdx]
      );
      this.wordIdx = 0;
      this.nextTranslations();
    }
  }

  async nextWordAdvanced() {
    if (!this.words || !this.loggedUser) {
      return;
    }

    if (this.advancedConfirm == this.chosenWords[this.wordIdx].word) {
      this.confirmStatus = 'Correct';
      if (this.loggedUser?.statuschange == 'automatic') {
        this.chosenWords[this.wordIdx] =
          this.wordStatusService.changeWordStatus(
            this.chosenWords[this.wordIdx],
            false
          );
      }
      this.userService.updateUser(this.loggedUser);
      this.wordSetService.changeWordSetSource(
        this.wordSetService.getWordSet(
          this.loggedUser.otherLanguage,
          this.loggedUser.word
        )
      );
      await this.timeService.delay(1000);
      this.confirmStatus = '';
      this.errorIdx = 0;
      this.nextWord();

      return;
    }

    if (this.errorIdx == 2) {
      this.confirmStatus =
        'The correct answer is: ' + this.chosenWords[this.wordIdx].word;

      if (this.loggedUser?.statuschange == 'automatic') {
        this.chosenWords[this.wordIdx] =
          this.wordStatusService.changeWordStatus(
            this.chosenWords[this.wordIdx],
            false
          );
      }
      this.userService.updateUser(this.loggedUser);
      this.wordSetService.changeWordSetSource(
        this.wordSetService.getWordSet(
          this.loggedUser.otherLanguage,
          this.loggedUser.word
        )
      );
      await this.timeService.delay(1000);
      this.errorIdx = 0;

      this.nextWord();
    } else {
      this.confirmStatus = 'Wrong';
      if (this.loggedUser?.statuschange == 'automatic') {
        this.chosenWords[this.wordIdx] =
          this.wordStatusService.changeWordStatus(
            this.chosenWords[this.wordIdx],
            false
          );
      }
      this.userService.updateUser(this.loggedUser);
      this.wordSetService.changeWordSetSource(
        this.wordSetService.getWordSet(
          this.loggedUser.otherLanguage,
          this.loggedUser.word
        )
      );
      await this.timeService.delay(1000);
      this.advancedConfirm = '';
      this.errorIdx++;
    }

    this.confirmStatus = '';
    return;
  }

  nextTranslations() {
    if (this.loggedUser) {
      this.userTranslations =
        this.chosenWords[this.wordIdx].translation[
          this.loggedUser.baseLanguage
        ];
    }
  }

  insertChar(char: string) {
    this.advancedConfirm += char;
  }
}
