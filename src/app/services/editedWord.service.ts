import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { WordInterface } from "../interfaces/word.interface";

@Injectable()
export class EditedWordService
{
    private wordSource = new BehaviorSubject<WordInterface>({} as WordInterface)
    currentUser = this.wordSource.asObservable()

    changeEditedWord(word : WordInterface)
    {
        this.wordSource.next(word)
    }
}