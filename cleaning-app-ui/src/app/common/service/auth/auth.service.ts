import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { tap, catchError, first, shareReplay, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface AuthStatusResponse {
  isAuthenticated: boolean;
  email: string | null;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticated.asObservable();
  userEmail: string | null = null;

  // Cache for the last authentication check result (Observable)
  private authCheckObservable: Observable<AuthStatusResponse> | null = null;
  private lastCheckTime: number = 0;
  private readonly CACHE_DURATION_MS = 5 * 60 * 1000; // Cache for 5 minutes

  constructor(private http: HttpClient, private router: Router) { }

  get isLoggedIn(): boolean {
    return this._isAuthenticated.value;
  }

  /**
   * Calls the backend to check the current authentication status.
   * Caches the result for a defined duration to avoid redundant API calls.
   */
  checkAuthStatus(forceRefresh: boolean = false): Observable<AuthStatusResponse> {
    const now = Date.now();

    // If a check is already in progress AND it's not a forced refresh, return the existing observable
    if (this.authCheckObservable && !forceRefresh) {
      return this.authCheckObservable;
    }

    // If status is known and within cache duration, return cached value without API call
    if (!forceRefresh && (now - this.lastCheckTime < this.CACHE_DURATION_MS) && this._isAuthenticated.value !== null) {
      return of({
        isAuthenticated: this._isAuthenticated.value,
        email: this.userEmail,
        message: 'Cached status'
      });
    }

    this.authCheckObservable = this.http.get<AuthStatusResponse>('/api/auth/status').pipe(
      tap(response => {
        this._isAuthenticated.next(response.isAuthenticated);
        this.userEmail = response.email;
        this.lastCheckTime = Date.now(); // Update last check time on success
      }),
      catchError(error => {
        this._isAuthenticated.next(false);
        this.userEmail = null;
        this.lastCheckTime = 0; // Reset time on error to force re-check
        return of({ isAuthenticated: false, email: null, message: 'Error checking status' });
      }),
      // shareReplay(1) ensures that if multiple subscribers subscribe, the HTTP call is made only once
      // and subsequent subscribers receive the last emitted value.
      shareReplay(1)
    );

    return this.authCheckObservable;
  }

  logout(): void {
    this.http.get<string>('/api/auth/logout').pipe(
      tap(() => {
        this._isAuthenticated.next(false);
        this.userEmail = null;
        this.lastCheckTime = 0; // Invalidate cache
        this.authCheckObservable = null; // Clear any pending check
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        this._isAuthenticated.next(false);
        this.userEmail = null;
        this.lastCheckTime = 0;
        this.authCheckObservable = null;
        this.router.navigate(['/login']);
        return of('Logout failed');
      })
    ).subscribe();
  }
}
