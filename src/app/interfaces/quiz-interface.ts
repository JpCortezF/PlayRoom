export interface QuizInterface {
  question: string;
  correctAnswers: string;
  incorrectAnswers: string[];
  category: string;
  format?: string;
}
