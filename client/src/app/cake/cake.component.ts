import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Cake } from '../../cake';
import { Comment } from '../../comment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cake',
  templateUrl: './cake.component.html',
  styleUrls: ['./cake.component.css']
})
export class CakeComponent implements OnInit {
  private id: string;
  cake$: Observable<Cake>;
  comments$: Observable<Comment[]>;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.cake$ = this.http.get<Cake>(`${environment.apiUrl}/cakes/${this.id}`);
      this.comments$ = this.http.get<Comment[]>(`${environment.apiUrl}/cakes/comments/${this.id}`);
    });
  }

  addComment(comment: Comment) {
    comment.cakeId = this.id;

    this.http.post<HttpResponse<any>>(`${environment.apiUrl}/comments`, comment)
    .subscribe((_result: HttpResponse<any>) => {
      
      // wait for the comment to get analysed and added to the database before fetching the comments again
      setTimeout(() => {
        this.comments$ = this.http.get<Comment[]>(`${environment.apiUrl}/cakes/comments/${this.id}`);
      }, 1000);
    });
  }
}
