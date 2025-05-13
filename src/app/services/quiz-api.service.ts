import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuizResponse } from '../interfaces/quiz-response';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizApiService {
  private quizUrl = 'https://api.quiz-contest.xyz/questions';
  private apiKey = '$2b$12$Az9IVUN/GH0iWLjMmCeVR.LufFibbGYE.92Uu8A3uTYRXQvYS4M/2';

  private categoryMap: {[key: string]: string} = {
    'Geografía': 'geography',
    'Arte y Literatura': 'arts&literature',
    'Entretenimiento': 'entertainment',
    'Ciencia y Naturaleza': 'science&nature',
    'Deportes y Ocio': 'sports&leisure',
    'Historia': 'history'
  };

  constructor(private http: HttpClient) {}

  getQuestion(limit: number, page: number, category: string): Observable<QuizResponse> {
    const englishCategory = this.categoryMap[category] || category;
    
    return this.http.get<QuizResponse>(this.quizUrl, {
      headers: {
        Authorization: this.apiKey,
      },
      params: {
        limit: limit.toString(),
        page: page.toString(),
        category: englishCategory,
      },
    });
  }
}
