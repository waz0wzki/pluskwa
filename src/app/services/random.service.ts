import { Injectable } from '@angular/core';
import { WordInterface } from '../interfaces/word.interface';

@Injectable()
export class RandomService {
  isInArray(array: any[], value: any) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] == value) {
        return true;
      }
    }
    return false;
  }

  randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  uniqueRandomArray(count: number, array: any, ignored: any) {
    let uniqueValues: any[] = [];
    for (let i = 0; i < count; i++) {
      // let random = array[this.randomInt(0,array.length-1)]
      let random = this.randomWord(array);
      while (this.isInArray(uniqueValues, random) || random == ignored) {
        random = this.randomWord(array);
      }
      uniqueValues[i] = random;
    }
    console.log('unique dique', uniqueValues);
    return uniqueValues;
  }

  luckyNumbers(
    count: number,
    min: number,
    max: number,
    ignored: number
  ): number[] {
    let luckyNumbers = [];
    for (let i = 0; i < count; i++) {
      luckyNumbers[i] = ignored;
    }

    if (ignored >= min && ignored < max) {
      if (count > max - min - 1) {
        return [];
      }
    } else {
      if (count > max - min) {
        return [];
      }
    }

    for (let i = 0; i < count; i++) {
      let random = this.randomInt(min, max);
      while (this.isInArray(luckyNumbers, random) || random == ignored) {
        random = this.randomInt(min, max);
      }
      luckyNumbers[i] = random;
    }
    return luckyNumbers;
  }

  repeatedWord = {} as WordInterface;
  randomWord(array: any) {
    let rw = this.randomInt(0, array.length - 1);
    this.repeatedWord = array[rw];
    // console.log('bajka o smokach i twojej matce', this.repeatedWord);
    this.wordProbabilty(array);
    return this.repeatedWord;
  }

  wordProbabilty(array: any) {
    // console.log('bajka o jajkach', this.repeatedWord);
    switch (this.repeatedWord.status) {
      case 'i learn':
        if (this.randomInt(0, 100) > 75) {
          this.randomWord(array);
        }
        return this.repeatedWord;
      case 'i repeat':
        if (this.randomInt(0, 100) > 50) {
          this.randomWord(array);
        }
        return this.repeatedWord;
      case 'i know':
        if (this.randomInt(0, 100) > 25) {
          this.randomWord(array);
        }
        return this.repeatedWord;
      default:
        return this.repeatedWord;
    }
  }

  chooseRandomWords(array: any) {
    let chosenWords = {} as WordInterface[];
    if (!array) {
      return;
    }

    let chosenIdxes = this.luckyNumbers(5, 0, array.length - 1, -1);
    for (let i = 0; i < chosenIdxes.length; i++) {
      let randomWord = this.randomWord(array);

      chosenWords.push(randomWord);
    }
  }
}
