import { Component, Input } from '@angular/core';
import { WordInterface } from '../../interfaces/word.interface';
import { UserInterface } from '../../interfaces/user.interface';
import { RandomService } from '../../services/random.service';
import { LoggedUserService } from '../../services/loggedUser.service';

@Component({
  selector: 'app-learn-intermediate',
  templateUrl: './learn-intermediate.component.html',
  styleUrl: './learn-intermediate.component.scss',
})
export class LearnIntermediateComponent {
  constructor(
    private randomService: RandomService,
    private loggedUserService: LoggedUserService
  ) {}

  chosenAnswers: any = [];
  words? = {} as WordInterface[];
  loggedUser? = {} as UserInterface;
  wordIdx = 0;
  @Input() chosenWords: any;
  baseLanguage = '';
  otherLanguage = '';
  userLanguages: any;
  userTranslations: any;

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
      // this.wordIdx = this.randomService.randomInt(0, this.words.length - 1);
      this.chosenAnswers = this.randomService.uniqueRandomArray(
        4,
        this.words,
        this.chosenWords[this.wordIdx]
      );
      this.nextTranslations();
      console.log('todas las palabras', this.words);

      let random = this.randomService.randomInt(0, 3);
      this.chosenAnswers[random] = this.chosenWords[this.wordIdx];
      console.log(
        'palabra correcta',
        random,
        'palabra',
        this.chosenWords[this.wordIdx]
      );
      console.log('palabras elegidas', this.chosenAnswers);
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
        null
      );
      this.wordIdx = 0;
      this.nextTranslations();
    }
  }

  nextWordSemiAdvanced() {
    if (!this.words) {
      return;
    }
    this.nextWord();
    this.chosenAnswers = this.randomService.uniqueRandomArray(
      4,
      this.words,
      this.chosenWords[this.wordIdx]
    );
    let random = this.randomService.randomInt(0, 3);
    this.chosenAnswers[random] = this.chosenWords[this.wordIdx];
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
}
