import { languageInterface } from './language.interface';

export interface WordInterface {
  id: number;
  word: string;
  language: string;
  wordProgress: number;
  status: string;
  difficulty: string;
  imgUrl: string;
  imgAlt: string;
  translation: languageInterface;
  example: string[];
  category: string[];
}
