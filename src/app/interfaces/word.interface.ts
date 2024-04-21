import { languageInterface } from './language.interface';

export interface WordInterface {
  idw: number;
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
