import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { UserInterface } from "../interfaces/user.interface";

@Injectable()
export class LoggedUserService
{
    private userSource = new BehaviorSubject<UserInterface>({} as UserInterface)
    currentUser = this.userSource.asObservable()

    changeLoggedUser(user : UserInterface)
    {
        this.userSource.next(user)
    }
}