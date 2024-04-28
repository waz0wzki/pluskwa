import { Component, Input } from '@angular/core';
import { WordInterface } from '../../interfaces/word.interface';
import { UserInterface } from '../../interfaces/user.interface';
import { LoggedUserService } from '../../services/loggedUser.service';
import { RandomService } from '../../services/random.service';
import { STATUS_OPTIONS } from '../../models/status-options';
import { WordSetService } from '../../services/word-set.service';
import { LANGUAGES } from '../../models/languages';

@Component({
  selector: 'app-learn-beginnner',
  templateUrl: './learn-beginnner.component.html',
  styleUrl: './learn-beginnner.component.scss',
})
export class LearnBeginnnerComponent {
  // words? = {} as WordInterface[];
  words: any = [];
  loggedUser? = {} as UserInterface;
  wordIdx = 0;
  transIdx = 0;
  exIdx = 0;
  @Input() chosenWords: any;
  baseLanguage = '';
  otherLanguage = '';
  userLanguages: any;
  userTranslations: any;
  statusOptions = STATUS_OPTIONS;
  statusChange = false;
  voicess = window.speechSynthesis.getVoices();
  foundVoice: string = '';
  languages = LANGUAGES;

  constructor(
    private loggedUserService: LoggedUserService,
    private randomService: RandomService,
    private wordSetService: WordSetService
  ) {}

  ngOnInit() {
    this.loggedUserService.currentUser.subscribe(
      (user) => (this.loggedUser = user)
    );

    if (this.loggedUser) {
      // this.words = this.chosenWords;
      this.baseLanguage = this.loggedUser.baseLanguage;
      this.otherLanguage = this.loggedUser.otherLanguage;
      console.log('base', this.baseLanguage, 'other', this.otherLanguage);
      this.wordSetService.currentWordSet.subscribe(
        (words) => (this.words = words)
      );
      console.log(this.words);
      this.userLanguages = Object.keys(this.words[this.wordIdx].translation);

      // for (let i = 0; i < this.userLanguages.length; i++) {
      //   if (this.baseLanguage == this.userLanguages[i]) {
      //     console.log('baba', this.words[this.wordIdx].translation);
      //   }
      // }
      this.nextTranslations();

      this.voicess = window.speechSynthesis.getVoices();
      let foundVoice = this.languages.find(
        (element) => element.language == this.otherLanguage
      );

      console.log('i found', foundVoice);
      if (foundVoice) {
        this.foundVoice = foundVoice.reader;
      }
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
    if (this.loggedUser) {
      this.userTranslations =
        this.chosenWords[this.wordIdx].translation[
          this.loggedUser.baseLanguage
        ];
    }
    //   switch (this.baseLanguage) {
    //     case 'english':
    //       this.userTranslations =
    //         this.chosenWords[this.wordIdx].translation.english;
    //       break;
    //     case 'polish':
    //       this.userTranslations =
    //         this.chosenWords[this.wordIdx].translation.polish;
    //       break;
    //   }
  }

  readWord() {
    var message = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    console.log(voices);
    let wonsisko = this.foundVoice;
    // Find the voice you want to use
    var voice = voices.find(function (voice) {
      return voice.name === wonsisko;
    });
    if (!voice) {
      return;
    }

    message.voice = voice;
    message.text = this.chosenWords[this.wordIdx].word;
    window.speechSynthesis.speak(message);
  }

  // true = true;
}
