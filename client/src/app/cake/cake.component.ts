import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
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
      this.fetchCake();
      this.fetchComments();
    });
  }

  addComment(comment: Comment) {
    comment.cakeId = this.id;

    this.http.post<HttpResponse<any>>(`${environment.apiUrl}/comments`, comment)
    .subscribe((_result: HttpResponse<any>) => {
        // wait for the comment to get analysed and added to the database before fetching the comments again
        setTimeout(() => this.fetchComments(), 1000);
      });
    }

    private fetchCake() {
      this.cake$ = this.http.get<Cake>(`${environment.apiUrl}/cakes/${this.id}`);
    }

    private fetchComments() {
      this.comments$ = this.http.get<Comment[]>(`${environment.apiUrl}/cakes/comments/${this.id}`)
        .pipe(
          map((comments: Comment[]) => {
            return comments.slice().reverse();
          })
        );
    }
}
