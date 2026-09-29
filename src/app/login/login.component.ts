import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormFieldComponent } from '../shared/form-field/form-field.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormFieldComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  submitting = false;
  error = '';

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = '';
    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password).subscribe({
      next: () => this.router.navigate(['/admin/courses']),
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = err.status === 401
          ? 'That email and password don’t match. Check them and try again.'
          : 'Can’t reach the server right now. Make sure the backend is running, then try again.';
      }
    });
  }

  emailError(): string | null {
    const email = this.form.controls.email;
    if (!email.invalid || !email.touched) {
      return null;
    }
    return email.hasError('required') ? 'Enter your email address.' : 'Enter a valid email address, like name@example.com.';
  }

  passwordError(): string | null {
    const password = this.form.controls.password;
    return password.invalid && password.touched ? 'Enter your password.' : null;
  }
}
