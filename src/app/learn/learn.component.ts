import { Component } from '@angular/core';
import { WordInterface } from '../interfaces/word.interface';
import { UserInterface } from '../interfaces/user.interface';
import { LoggedUserService } from '../services/loggedUser.service';
import { Router } from '@angular/router';
import { LoginRedirect } from '../services/loginRedirect.service';
import { RandomService } from '../services/random.service';
import { WordSetService } from '../services/word-set.service';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrl: './learn.component.scss',
})
export class LearnComponent {
  words? = {} as WordInterface[];
  loggedUser? = {} as UserInterface;
  condition: any;
  chosenWords = [] as WordInterface[];

  constructor(
    private loggedUserService: LoggedUserService,
    private router: Router,
    private loginRedirect: LoginRedirect,
    private randomService: RandomService,
    private wordSetService: WordSetService
  ) {}

  ngOnInit() {
    this.loggedUserService.currentUser.subscribe(
      (user) => (this.loggedUser = user)
    );
    if (this.loggedUser) {
      console.log(this.loggedUser, 'lang', this.loggedUser.otherLanguage);
      this.condition = this.loggedUser.learningdifficulty;
      console.log('diff', this.condition);
      this.wordSetService.currentWordSet.subscribe(
        (words) => (this.words = words)
      );
      console.log('i have received', this.words);
      this.chooseRandomWords(this.words);
    }
    this.loginRedirect.redirect(this.loggedUser, this.router);

    // console.log('allwords', this.words);
    // console.log('aszka baszka ma malego ptaszka', this.chosenWords);
  }

  chooseRandomWords(array: any) {
    if (!array || array.length < 4) {
      return;
    }
    this.chosenWords = this.randomService.uniqueRandomArray(
      4,
      this.words,
      null
    );
  }
}
