import { Component } from '@angular/core';
import { UserInterface } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { LoggedUserService } from '../services/loggedUser.service';
import { Router } from '@angular/router';
import { WordSetService } from '../services/word-set.service';
import { WordService } from '../services/word.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loggedIn = false;
  loggedInIndex = 0;
  loggedUser = {} as UserInterface;
  loginError = '';
  words: any = [];
  chosenWords: any = [];
  category: any = [];

  users: UserInterface[] = [];

  constructor(
    private userService: UserService,
    private loggedUserService: LoggedUserService,
    private router: Router,
    private wordSetService: WordSetService,
    private wordService: WordService
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe((ures: any) => {
      // this.users = ures.user;
      this.users = ures;
    });
  }

  signIn() {
    this.getUsers();
    console.log('cyckodron w lesie z niedźwiedziem', this.users);
    for (let i = 0; i < this.users.length; i++) {
      // console.log(i,this.email,this.password)
      // console.log(i,this.users[i].email,this.users[i].password)
      if (
        this.email == this.users[i].email &&
        this.password == this.users[i].password
      ) {
        this.loggedIn = true;
        this.loggedInIndex = i;
        break;
      } else {
        this.loggedIn = false;
      }
    }
    if (this.loggedIn) {
      this.loggedUser = this.users[this.loggedInIndex];
      this.loggedUserService.changeLoggedUser(this.loggedUser);
      this.words = this.loggedUser.word;
      // this.words?.forEach((element: any) => {
      //   if (!this.loggedUser) {
      //     return;
      //   }
      //   if (element.language == this.loggedUser.otherLanguage) {
      //     this.chosenWords.push(element);
      //   }
      // });
      this.chosenWords = this.wordSetService.getWordSet(
        this.loggedUser.otherLanguage,
        this.loggedUser.word
      );
      console.log('ive chosen', this.chosenWords);
      this.wordSetService.changeWordSetSource(this.chosenWords);

      this.router.navigate(['learn']);
    } else {
      this.loginError = 'Incorrect email or password';
    }
  }

  signUp() {
    if (this.email == '' || this.password == '') {
      this.loginError = 'Fill in correct values';
    }
    for (let i = 0; i < this.users.length; i++) {
      // console.log(i,this.email,this.password)
      // console.log(i,this.users[i].email,this.users[i].password)
      if (this.email == this.users[i].email) {
        this.loginError = 'User with this email already exists';
        this.loggedIn = false;
        return;
      }
    }
    let maxId = 0;
    this.users.forEach((element: any) => {
      if (element.id > maxId) {
        maxId = element.id;
      }
    });
    maxId++;
    console.log(maxId);

    this.wordService.getBasicCategory().subscribe((category: string[]) => {
      this.category = category;
      console.log('elo elo 3 2 0', this.category);
      this.wordService.getBasicWords().subscribe((words: any) => {
        this.words = words;
        console.log('cipeczki', this.words);
        let newUser: UserInterface = {
          id: maxId.toString(),
          email: this.email,
          password: this.password,
          baseLanguage: 'english',
          otherLanguage: 'french',
          learningdifficulty: 'beginner',
          statuschange: 'manual',
          category: this.category,
          word: this.words,
        };
        console.log('uga buga', newUser);
        this.userService.addUser(newUser);
        this.userService.getUsers().subscribe((ures: any) => {
          // this.users = ures.user;
          this.users = ures;
          this.signIn();
        });
      });
    });
  }
}
