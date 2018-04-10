import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { NavbarService } from '../navbar/navbar.service';

// import { AgGridModule } from 'ag-grid-angular/main';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  //employees: any;
  columnDefs: Array<any>;
  rowData: any;
  gridOptions:any;
  constructor(private http: HttpClient, private router: Router, public nav: NavbarService) {

   }

  ngOnInit() {
    this.nav.show();
    this.columnDefs = [
      { headerName: "First Name", field: "firstName" },
      { headerName: "Last Name", field: "lastName" },
      { headerName: "Designation", field: "designation" },
      { headerName: "Salary", field: "salary" }
    ];
    this.gridOptions = {
      rowCount:5
    };

    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };

    this.http.get('/api/employee', httpOptions).subscribe(data => {
      //this.employees = data;
      this.rowData = data;
      //console.log(this.employees);
    }, err => {
      if (err.status === 401) {
        this.router.navigate(['login']);
      }
    });
  }

  // logout() {
  //   localStorage.removeItem('jwtToken');
  //   this.router.navigate(['login']);
  // }

}
