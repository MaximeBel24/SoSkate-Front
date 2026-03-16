import {Injectable, signal, computed, inject} from '@angular/core';
import {LoginRequest, LoginResponse} from '../interfaces/auth.interface'
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment.development';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly apiUrl: string = environment.apiUrl + '/auth';
  private readonly STORAGE_KEY = 'soskate_admin_user';

  currentUser = signal<LoginResponse | null>(null);
  isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    const storedUser = localStorage.getItem(this.STORAGE_KEY)
    if (storedUser !== null) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (this.isTokenExpired(parsedUser.token)) {
          localStorage.removeItem(this.STORAGE_KEY);
          return;
        }
        this.currentUser.set(parsedUser);

      } catch (error) {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {

    const response = await firstValueFrom(this.http.post<LoginResponse>(this.apiUrl + '/login', credentials));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(response));
    this.currentUser.set(response);
    return response;
  }

  async logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUser.set(null);
    await this.router.navigate(['/login']);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

}
