import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:5000'; 
  constructor(private http: HttpClient) { }

  getUsers(headers: HttpHeaders, search: string = ''): Observable<any[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<any[]>(`${this.apiUrl}/users`, { headers, params });
  }

  updateRole(email: string, role: string, headers: HttpHeaders): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-role`, { email, role }, { headers });
  }
}

  

