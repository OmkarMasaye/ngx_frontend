import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})
export class LoginSignupComponent {
  isLoginMode: boolean = true;

  constructor(private http: HttpClient, private router: Router) { }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onLogin(form: any) {
    if (form.valid) {
      const email = form.value.email;
      const password = form.value.password;

      this.http.post('http://localhost:5000/api/auth/login', { email, password })
        .subscribe((response: any) => {
          const token = (response as { token: string }).token;
          localStorage.setItem('token', token);
          
          // Navigate to lead processing after successful login
          this.router.navigate(['/lead-processing']);
        }, error => {
          console.error('Login error:', error);
        });
    }
  }

  onSignup(form: any) {
    if (form.valid) {
      const name = form.value.name;
      const email = form.value.email;
      const password = form.value.password;
      const confirmPassword = form.value.confirmPassword;

      if (password === confirmPassword) {
        this.http.post('http://localhost:5000/api/auth/signup', { name, email, password })
          .subscribe((response: any) => {
            const token = (response as { token: string }).token;
            localStorage.setItem('token', token);
            
            // Navigate to lead processing after successful signup
            this.router.navigate(['/lead-processing']);
          }, error => {
            console.error('Signup error:', error);
          });
      } else {
        console.error('Passwords do not match');
      }
    }
  }
}
