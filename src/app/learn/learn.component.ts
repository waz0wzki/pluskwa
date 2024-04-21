import { Component } from '@angular/core';
import { WordInterface } from '../interfaces/word.interface';
import { UserInterface } from '../interfaces/user.interface';
import { LoggedUserService } from '../services/loggedUser.service';
import { Router } from '@angular/router';
import { LoginRedirect } from '../services/loginRedirect.service';
import { RandomService } from '../services/random.service';

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
    private randomService: RandomService
  ) {}

  ngOnInit() {
    this.loggedUserService.currentUser.subscribe(
      (user) => (this.loggedUser = user)
    );
    if (this.loggedUser) {
      this.words = this.loggedUser.word;
    }
    this.loginRedirect.redirect(this.loggedUser, this.router);
    this.condition = this.loggedUser?.learningdifficulty;

    this.chooseRandomWords(this.words);
    console.log('allwords', this.words);
    console.log('aszka baszka ma malego ptaszka', this.chosenWords);
  }

  chooseRandomWords(array: any) {
    if (!array) {
      return;
    }
    this.chosenWords = this.randomService.uniqueRandomArray(
      4,
      this.words,
      null
    );
  }
}
