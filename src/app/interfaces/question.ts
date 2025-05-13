export interface Question {
  question: string;
  correctAnswers: string;
  incorrectAnswers: string[];
  category: string;
  format?: string;
}
