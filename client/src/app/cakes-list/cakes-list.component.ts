import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Cake } from '../../cake';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cakes-list',
  templateUrl: './cakes-list.component.html',
  styleUrls: ['./cakes-list.component.css']
})
export class CakesListComponent implements OnInit {
  cakes$: Observable<Cake[]>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cakes$ = this.http.get<Cake[]>(`${environment.apiUrl}/cakes`);
  }
}
