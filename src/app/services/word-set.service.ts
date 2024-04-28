import { WordInterface } from '../interfaces/word.interface';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class WordSetService {
  private wordSetSource = new BehaviorSubject<WordInterface[]>(
    [] as WordInterface[]
  );
  currentWordSet = this.wordSetSource.asObservable();

  changeWordSetSource(words: WordInterface[]) {
    this.wordSetSource.next(words);
  }

  getWordSet(language: string, words: any[]) {
    let array: any = [];
    words.forEach((element) => {
      if (element.language == language) {
        array.push(element);
      }
    });
    return array;
  }
}
