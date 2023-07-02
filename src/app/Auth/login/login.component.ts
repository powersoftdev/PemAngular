import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: LoginService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.service.login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe({
        next: data => {
          if (data.message == 'Success') {
            console.log("Success", data.auth_token);
            localStorage.setItem("token", data.auth_token);
            this.router.navigateByUrl('/dashboard');
          } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Oops! Username and password incorrect. try again.',
              showConfirmButton: true,
            });
          }
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}
