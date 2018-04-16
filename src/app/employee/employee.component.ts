import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { LocalDataSource } from '../../../node_modules/ng2-smart-table';
import { environment } from '../../environments/environment';
import { NavbarService } from '../navbar/navbar.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  rowData: any;
  settings:any;
  data:any;
  source: LocalDataSource;
  constructor(private http: HttpClient, private router: Router, public nav: NavbarService) {

   }

  ngOnInit() {
    this.nav.show();

    let httpOptions = this.getHttpHeader();

    this.http.get(environment.apiURL+'/employee', httpOptions).subscribe(data => {
      this.rowData = data;
      this.source = new LocalDataSource(this.rowData);
    }, err => {
      if (err.status === 401) {
        this.router.navigate(['login']);
      }
    });

    this.setTableData();
  }

  getHttpHeader(){
    return { headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })};
  }
  setTableData(){
    this.settings = {
      noDataMessage: 'No Records to Display.',
      delete: {
        confirmDelete: true,
      },
      add: {
        confirmCreate: true,
      },
      edit: {
        confirmSave: true,
      },
      attr: {
        class: 'table table-bordered'
      },
      actions:{
        position:'right'
      },
      pager:{
        display : true,
        perPage : 10
      },
      columns: {
        _id:{
          title:'Id',
          filter: false,
          show:false
        },
        firstName: {
          title: 'First Name',
          filter: false
        },
        lastName: {
          title: 'Last Name',
          filter: false
        },
        designation: {
          title: 'Designation'
        },
        salary: {
          title: 'Salary'
        }
      }
    };
  }

  onDeleteConfirm(event) {
    if (window.confirm('Are you sure you want to delete?')) {
      let httpOptions = this.getHttpHeader();
      this.http.delete(environment.apiURL+'/employee/'+event.data._id, httpOptions).subscribe(data => {
        event.data['name'] += ' + deleted from code';
        event.confirm.resolve(event.data);        
      }, err => {
        event.confirm.reject();
        if (err.status === 401) {
          this.router.navigate(['login']);
        }
      });
    } else {
      event.confirm.reject();
    }
  }

  onSaveConfirm(event) {
    if (window.confirm('Are you sure you want to save?')) {
      let httpOptions = this.getHttpHeader();
      this.http.put(environment.apiURL+'/employee/'+event.newData._id, event.newData, httpOptions).subscribe(data => {
        event.newData['name'] += ' + updated in code';        
        event.confirm.resolve(event.newData);        
      }, err => {
        event.confirm.reject();
        if (err.status === 401) {
          this.router.navigate(['login']);
        }
      });
      
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event) {
    if (window.confirm('Are you sure you want to create?')) {
      let httpOptions = this.getHttpHeader();
      this.http.post(environment.apiURL+'/employee', event.newData, httpOptions).subscribe(employee => {
        var emp:any = employee;
        event.newData['name'] += ' + added in code';
        event.newData['_id'] = emp.data._id;
        event.confirm.resolve(event.newData);        
      }, err => {
        event.confirm.reject();
        if (err.status === 401) {
          this.router.navigate(['login']);
        }
      });
      
    } else {
      event.confirm.reject();
    }
  }

}
