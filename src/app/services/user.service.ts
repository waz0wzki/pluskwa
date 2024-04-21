import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserInterface[]> {
    // console.log('kradzieje',this.http.get<UserInterface>('http://localhost:3000/user'))
    return this.http.get<UserInterface[]>(
      'https://waz0wzki.github.io/pluskwa/db.json'
    );
    // return this.http.get<UserInterface[]>('http://localhost:3000/user');
  }

  getLoggedUser(): Observable<UserInterface> {
    return this.http.get<UserInterface>('http://localhost:3000/user/0');
  }
}
