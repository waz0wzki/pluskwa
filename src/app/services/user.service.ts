import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  // url = 'https://waz0wzki.github.io/pluskwa/db.json';
  url = 'http://localhost:3000/user';

  getUsers(): Observable<UserInterface[]> {
    // console.log('kradzieje',this.http.get<UserInterface>('http://localhost:3000/user'))
    return this.http.get<UserInterface[]>(this.url);
    // return this.http.get<UserInterface[]>('http://localhost:3000/user');
  }

  updateUser(user: any) {
    this.http.put(this.url + '/' + user.id, user).subscribe();
  }
}
