import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { NavbarService } from '../navbar/navbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData = { username:'', password:'' };
  message = '';
  data: any;
  constructor(private http: HttpClient, private router: Router, public nav: NavbarService) { }

  ngOnInit() {
    this.nav.hide();
  }

  login() {
    this.http.post('/api/signin', this.loginData).subscribe(resp => {
      this.data = resp;
      localStorage.setItem('jwtToken', this.data.token);
      this.router.navigate(['employees']);
    }, err => {
      this.message = err.error.msg;
    });
  }

}
