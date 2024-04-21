import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { WordInterface } from "../interfaces/word.interface";

@Injectable()
export class WordService
{
    constructor(private http: HttpClient){}

    getWords() : Observable<WordInterface[]>
    {
        return this.http.get<WordInterface[]>('http://localhost:3000/word')
    }
}