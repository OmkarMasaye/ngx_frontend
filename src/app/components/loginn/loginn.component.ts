import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MessagecardComponent } from '../messagecard/messagecard.component';

@Component({
  selector: 'app-loginn',
  standalone: true,
  imports: [MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    MatSnackBarModule,
    MatIconModule,
    MessagecardComponent],
  templateUrl: './loginn.component.html',
  styleUrl: './loginn.component.css'
})
export class LoginnComponent {
  email: string = '';
  password: string = '';

  isLoginMode: boolean = true;
  loading = false;
  errorMessage: string = '';
  showSuccessModal = false;
  successMessage: string = ''; // Add property for the success message

  constructor(private http: HttpClient, private router: Router,private authService:AuthService) {}

  showLoginPassword = false;
  showSignupPassword = false;
  showSignupConfirmPassword = false;

  toggleLoginPasswordVisibility(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }

  toggleSignupPasswordVisibility(): void {
    this.showSignupPassword = !this.showSignupPassword;
  }

  toggleSignupConfirmPasswordVisibility(): void {
    this.showSignupConfirmPassword = !this.showSignupConfirmPassword;
  }

  toggleMode() {
    this.showSuccessModal = false;
    this.isLoginMode = !this.isLoginMode;
  }

  onLogin(form: any): void {
    if (!form.valid) {
      alert('Please fill in both email and password.');
      return;
    }
  
    const { email, password } = form.value;
    this.loading = true;
  
    this.authService.loginUser(email, password).subscribe({
      next: (response: { token: string ,role:string,name:string}) => {
        this.loading = false;
  
        if (response?.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem("role",response.role);
          localStorage.setItem('name',response.name);
          this.authService.setToken(response.token);
          this.router.navigate(['/lay']);
        } else {
          console.error('No token received');
          alert('Invalid username or password or not authorized');
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Login failed', error);
        alert('Login failed. Please check your credentials and try again.');
      }
    });
  }

  onSignup(form: any): void {
    if (!form.valid) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    const { username, email, mobile, password, confirmPassword } = form.value;

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    this.loading = true;

    this.authService.signupUser(email, password, username, mobile).subscribe({
      next: (response: { message: string }) => {
        this.loading = false;
        this.successMessage = response?.message || 'Signup successful! Please login.';
        this.showSuccessModal = true;
        // Delay navigation to allow user to see success message
        setTimeout(() => {
          this.successMessage = ''; // Clear success message
          this.showSuccessModal = false;
          this.router.navigate(['/login']);
        }, 2000); // 2-second delay
      },
      error: (error) => {
        this.loading = false;
        const errorMsg = this.extractErrorMessage(error);
        console.error('Signup failed', error);
        alert(errorMsg);

        if (errorMsg === 'User already exists') {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  private extractErrorMessage(error: any): string {
    try {
      return JSON.parse(error?.error)?.msg || 'Something went wrong';
    } catch {
      return 'Something went wrong';
    }
  }

  onOkClicked() {
    this.successMessage = ''; // Clear success message when OK is clicked
    this.showSuccessModal = false; // Hide the message card
    this.isLoginMode = true; // Switch to login form
  }
  redirectToLogin() {
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
  }
}
