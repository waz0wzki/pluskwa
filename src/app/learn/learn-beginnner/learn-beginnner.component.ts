import { Component, Input } from '@angular/core';
import { WordInterface } from '../../interfaces/word.interface';
import { UserInterface } from '../../interfaces/user.interface';
import { LoggedUserService } from '../../services/loggedUser.service';
import { RandomService } from '../../services/random.service';

@Component({
  selector: 'app-learn-beginnner',
  templateUrl: './learn-beginnner.component.html',
  styleUrl: './learn-beginnner.component.scss',
})
export class LearnBeginnnerComponent {
  words? = {} as WordInterface[];
  loggedUser? = {} as UserInterface;
  wordIdx = 0;
  transIdx = 0;
  exIdx = 0;
  @Input() chosenWords: any;
  baseLanguage = '';
  otherLanguage = '';
  userLanguages: any;
  userTranslations: any;

  constructor(
    private loggedUserService: LoggedUserService,
    private randomService: RandomService
  ) {}

  ngOnInit() {
    this.loggedUserService.currentUser.subscribe(
      (user) => (this.loggedUser = user)
    );

    if (this.loggedUser) {
      this.words = this.loggedUser.word;
      this.baseLanguage = this.loggedUser.baseLanguage;
      this.otherLanguage = this.loggedUser.otherLanguage;
      console.log('base', this.baseLanguage, 'other', this.otherLanguage);
      this.userLanguages = Object.keys(this.words[this.wordIdx].translation);

      // for (let i = 0; i < this.userLanguages.length; i++) {
      //   if (this.baseLanguage == this.userLanguages[i]) {
      //     console.log('baba', this.words[this.wordIdx].translation);
      //   }
      // }
      this.nextTranslations();
    }
    console.log('beginner', this.chosenWords);
  }

  prevTrans() {
    if (!this.words) {
      return;
    }

    if (this.transIdx > 1) {
      this.transIdx--;
    } else if (this.transIdx == 0) {
      this.transIdx = this.userTranslations.length - 1;
      // this.transIdx = 1;
    } else {
      this.transIdx = 0;
    }
  }

  nextTrans() {
    if (!this.words) {
      return;
    }
    if (
      this.transIdx < this.userTranslations.length - 1 &&
      this.chosenWords[this.wordIdx].translation.length != 1
    ) {
      this.transIdx++;
    } else {
      this.transIdx = 0;
    }
  }

  prevEx() {
    if (!this.words) {
      return;
    }
    if (this.exIdx > 1) {
      this.exIdx--;
    } else if (this.exIdx == 0) {
      this.exIdx = this.chosenWords[this.wordIdx].example.length - 1;
    } else {
      this.exIdx = 0;
    }
  }

  nextEx() {
    if (!this.words) {
      return;
    }
    if (
      this.exIdx < this.chosenWords[this.wordIdx].example.length - 1 &&
      this.chosenWords[this.wordIdx].example.length != 1
    ) {
      this.exIdx++;
    } else {
      this.exIdx = 0;
    }
  }

  nextWord() {
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
    this.transIdx = 0;
    this.exIdx = 0;
  }

  nextTranslations() {
    switch (this.baseLanguage) {
      case 'english':
        this.userTranslations =
          this.chosenWords[this.wordIdx].translation.english;
        break;
      case 'polish':
        this.userTranslations =
          this.chosenWords[this.wordIdx].translation.polish;
        break;
    }
  }

  true = true;
}
