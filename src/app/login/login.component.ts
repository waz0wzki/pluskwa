import { Component } from '@angular/core';
import { UserInterface } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { LoggedUserService } from '../services/loggedUser.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = ""
  password : string = ""
  loggedIn = false
  loggedInIndex = 0
  loggedUser = {} as UserInterface
  loginError = ""

  users : UserInterface[] = []

  constructor(private userService: UserService, private loggedUserService : LoggedUserService, private router: Router){}

  

  ngOnInit()
  {
    
    this.userService.getUsers().subscribe((ures : any) => {
      this.users = ures.user
      this.loggedUserService.currentUser.subscribe(user => this.loggedUser = user)
    })
    

    for(let i=0;i<5;i++)
      {
        let cipka = ""
        for(let j=1;j<i+1;j++)
          {
            cipka+='*'
          }
          console.log(cipka)
      }
  }

  

  signIn()
  {


    for(let i=0;i<this.users.length;i++)
      {
        // console.log(i,this.email,this.password)
        // console.log(i,this.users[i].email,this.users[i].password)
        if(this.email == this.users[i].email && this.password == this.users[i].password)
          {
            this.loggedIn = true
            this.loggedInIndex = i
            break
          }else
          {
            this.loggedIn = false
          }
      }
      if(this.loggedIn)
        {
          this.loggedUser = this.users[this.loggedInIndex]
          this.loggedUserService.changeLoggedUser(this.loggedUser)
          this.router.navigate(['settings'])
        }else
        {
          this.loginError = "Incorrect email or password"
        }
      

  }

}
