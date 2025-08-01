import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonService } from '../common/service/common/common.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  imports: [ ReactiveFormsModule, CommonModule, TranslatePipe, MatProgressSpinnerModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  userData: any = [];
  // isLoginValid: boolean = true;
  public isLoading: boolean = true;

  constructor(private fb: FormBuilder,
    private commonService: CommonService, private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['jakewilson', Validators.required],
      password: ['jakewilson001', Validators.required],
    });
  }

  ngOnInit(): void {
    // this.commonService.getAllUsers()
    //   .subscribe({
    //       next: (data: any) => {
    //         this.userData = data;
    //       },
    //       error: (error) => {
    //         console.log(error);
    //       }
    //     })
  }

  ngAfterViewInit(): void {
    // this.isLoading = false;
  }

  setLogin(user: any): void {
    // this.loginForm.patchValue({ username: user.username });
    // this.loginForm.patchValue({ password: user.password });
    // this.isLoginValid = true;
  }

  onSubmit(): void {
    // if (this.loginForm.valid) {
    //   this.commonService.checkLoginDetails(this.loginForm.value, this.userData).subscribe({
    //     next: (data) => {
    //       this.commonService.isLoggedIn = data.isValid;
    //       this.isLoginValid = data.isValid;
    //       this.loginForm.patchValue({ username: data.userDetails.username });
    //       this.loginForm.patchValue({ password: data.userDetails.password });
    //       if (data.isValid) {
    //         this.router.navigate(['/home']);
    //       }
    //     },
    //     error: (err) => {
    //       alert('Error please try again!');
    //     }
    //   }
    //   );
    //   this.loginForm.reset();
    // } else {
    //   console.log('Form is invalid.');
    // }
  }

  loginWithGoogle() {
   window.location.href = 'http://localhost:8083/oauth2/authorization/google';
  }
}
