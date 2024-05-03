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

  deleteUser(user: any) {
    this.http.delete(this.url + '/' + user.id, user).subscribe();
  }

  addUser(user: any) {
    this.http.post(this.url, user).subscribe();
  }

  uploadPhoto(file: any) {
    this.http
      .post('http://localhost:8008/api/upload', file)
      .subscribe((res: any) => {
        console.log(res);
      });
  }

  deletePhoto(file: any) {
    this.http.delete('http://localhost:8008/', file).subscribe((res: any) => {
      return res;
    });
  }
}
