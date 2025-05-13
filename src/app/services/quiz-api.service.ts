import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuizApiService {
  private baseUrl = 'https://www.quiz-contest.xyz/api/questions';

  constructor(private http: HttpClient) {}

  async getQuestionsByCategory(category: string, limit: number = 3): Promise<Question[]> {
    const url = `${this.baseUrl}?category=${encodeURIComponent(category)}&limit=${limit}`;
    try {
      const response = await firstValueFrom(this.http.get<{ questions: Question[] }>(url));
      return response.questions;
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
  }

}
