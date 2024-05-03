import { WordInterface } from './word.interface';

export interface UserInterface {
  id: string;
  email: string;
  password: string;
  baseLanguage: string;
  otherLanguage: string;
  learningdifficulty: string;
  statuschange: string;
  category: string[];
  word: WordInterface[];
}
