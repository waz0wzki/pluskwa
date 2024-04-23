import { Component, Input } from '@angular/core';
import { WordInterface } from '../../interfaces/word.interface';
import { UserInterface } from '../../interfaces/user.interface';
import { RandomService } from '../../services/random.service';
import { LoggedUserService } from '../../services/loggedUser.service';
import { TimeService } from '../../services/time.service';
import { LANGUAGES } from '../../models/languages';
import { WordSetService } from '../../services/word-set.service';

@Component({
  selector: 'app-learn-intermediate',
  templateUrl: './learn-intermediate.component.html',
  styleUrl: './learn-intermediate.component.scss',
})
export class LearnIntermediateComponent {
  constructor(
    private randomService: RandomService,
    private loggedUserService: LoggedUserService,
    private timeService: TimeService,
    private wordSetService: WordSetService
  ) {}

  chosenAnswers: any = [];
  words: any = [];
  loggedUser? = {} as UserInterface;
  wordIdx = 0;
  @Input() chosenWords: any;
  baseLanguage = '';
  otherLanguage = '';
  userLanguages: any;
  userTranslations: any;
  status: any;
  buttons = [] as any;
  intermediateConfirm = '';
  confirmStatus = '';
  errorIdx = 0;
  voicess = window.speechSynthesis.getVoices();
  foundVoice: string = '';
  languages = LANGUAGES;

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
      // this.wordIdx = this.randomService.randomInt(0, this.words.length - 1);
      this.chooseAnswers();
      this.nextTranslations();
      console.log('todas las palabras', this.words);

      this.buttons.forEach((element: any) => {
        console.log('button', element.word, 'selected', element.selected);
      });

      this.voicess = window.speechSynthesis.getVoices();
      let foundVoice = this.languages.find(
        (element) => element.language == this.otherLanguage
      );

      console.log('i found', foundVoice);
      if (foundVoice) {
        this.foundVoice = foundVoice.reader;
      }
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

  async nextWordSemiAdvanced() {
    if (!this.words) {
      return;
    }
    this.buttons.forEach((element: any) => {
      element.selected = false;
    });

    if (this.intermediateConfirm == this.chosenWords[this.wordIdx].word) {
      this.confirmStatus = 'Correct';
      await this.timeService.delay(1000);
      this.confirmStatus = '';
      this.errorIdx = 0;
      this.nextWord();
      this.chooseAnswers();

      return;
    }

    if (this.errorIdx == 2) {
      this.confirmStatus =
        'The correct answer is: ' + this.chosenWords[this.wordIdx].word;
      this.errorIdx = 0;
      this.chooseAnswers();
      this.nextWord();
    } else {
      this.confirmStatus = 'Wrong';
      this.intermediateConfirm = '';
      this.errorIdx++;
    }
    await this.timeService.delay(1000);
    this.confirmStatus = '';

    console.log('chosen', this.chosenAnswers);
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

  chooseAnswers() {
    this.chosenAnswers = this.randomService.uniqueRandomArray(
      4,
      this.words,
      this.chosenWords[this.wordIdx]
    );
    let random = this.randomService.randomInt(0, 3);
    this.chosenAnswers[random] = this.chosenWords[this.wordIdx];
    console.log(
      'palabra correcta',
      random,
      'palabra',
      this.chosenWords[this.wordIdx]
    );
    console.log('palabras elegidas', this.chosenAnswers);
    this.buttons = [];
    this.chosenAnswers.forEach((element: any) => {
      this.buttons.push({
        word: element,
        selected: false,
      });
    });
  }

  selectButton(j: number) {
    this.buttons[j].selected = !this.buttons[j].selected;
    if (this.buttons[j].selected) {
      this.intermediateConfirm = this.buttons[j].word.word;
    } else {
      this.intermediateConfirm = '';
    }
    for (let i = 0; i < this.buttons.length; i++) {
      if (i != j) {
        this.buttons[i].selected = false;
      }

      console.log(i, this.buttons[i].selected);
    }
    console.log('answer selectado', this.intermediateConfirm);

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
    message.text = this.intermediateConfirm;
    window.speechSynthesis.speak(message);
  }
}
