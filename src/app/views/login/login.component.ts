import {Component, inject, signal} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LoginRequest} from '../../shared/interfaces/auth.interface';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);


  isLoading = signal(false);
  errorMessage = signal('');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        const credentials = this.loginForm.getRawValue() as LoginRequest;
        this.isLoading.set(true);
        this.errorMessage.set('')
        const response = await this.authService.login(credentials);
        if (!response.isAdmin) {
          await this.authService.logout();
          this.errorMessage.set('Accès réservé aux administrateurs');
          return;
        }
        await this.router.navigate(['/spots']);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Email ou mot de passe incorrect';
        this.errorMessage.set(message);
      } finally {
        this.isLoading.set(false);
      }

    }
  }
}
