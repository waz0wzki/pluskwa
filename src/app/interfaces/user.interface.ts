import { WordInterface } from './word.interface';

export interface UserInterface {
  idu: number;
  email: string;
  password: string;
  baseLanguage: string;
  otherLanguage: string;
  learningdifficulty: string;
  statuschange: string;
  category: string[];
  word: WordInterface[];
}
