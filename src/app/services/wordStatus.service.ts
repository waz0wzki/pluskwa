import { Injectable } from '@angular/core';
import { WordInterface } from '../interfaces/word.interface';

@Injectable()
export class WordStatusService {
  changeWordStatus(word: WordInterface, correct: boolean) {
    if (correct) {
      if (word.wordProgress == 2) {
        switch (word.status) {
          case "i don't know":
            word.wordProgress = 0;
            word.status = 'i learn';
            break;
          case 'i learn':
            word.wordProgress = 0;
            word.status = 'i repeat';
            break;
          case 'i repeat':
            word.wordProgress = 0;
            word.status = 'i know';
            break;
        }
      } else {
        word.wordProgress++;
      }
    } else {
      if (word.wordProgress == -2) {
        switch (word.status) {
          case 'i know':
            word.wordProgress = 0;
            word.status = 'i repeat';
            break;
          case 'i learn':
            word.wordProgress = 0;
            word.status = 'i learn';
            break;
          case 'i repeat':
            word.wordProgress = 0;
            word.status = "i don't know";
            break;
        }
      } else {
        word.wordProgress--;
      }
    }
    return word;
  }
}
