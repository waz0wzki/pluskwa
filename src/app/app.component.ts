import { Component } from '@angular/core';
import { UserInterface } from './interfaces/user.interface';
import { WordInterface } from './interfaces/word.interface';
import { UserService } from './services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pluskwa';

  users: UserInterface[] = []
  words: WordInterface[] = []

  constructor(private userService: UserService) {}

  ngOnInit() : void
  {
    this.userService.getUsers().subscribe((res : UserInterface[]) => {
      this.users = res
      // console.log(this.users)
    })
  }

}
