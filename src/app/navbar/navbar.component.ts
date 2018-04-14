import { Component, OnInit } from '@angular/core';
import { NavbarService } from './navbar.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username:String;
  constructor(public nav: NavbarService,private router: Router, ) { }

  ngOnInit() {
    this.username='Ambadas Avhad';
  }

   logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['login']);
  }

}
