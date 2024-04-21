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

@Component({
  selector: 'app-edit-word',
  templateUrl: './edit-word.component.html',
  styleUrl: './edit-word.component.scss'
})
export class EditWordComponent {
  editedWord? = {} as WordInterface
  loggedUser? = {} as UserInterface

  public readonly STATUS_OPTIONS = STATUS_OPTIONS
  public readonly DIFFICULTY_OPTIONS = DIFFICULTY_OPTIONS




  constructor(private editedWordService : EditedWordService, private router : Router, private loggedUserService : LoggedUserService, private loginRedirect : LoginRedirect){}

  ngOnInit()
  {
    this.loggedUserService.currentUser.subscribe(user => this.loggedUser = user)
    this.loginRedirect.redirect(this.loggedUser, this.router)
    this.editedWordService.currentUser.subscribe(word => this.editedWord = word)

  }
}
