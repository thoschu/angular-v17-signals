import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

export type Posts = {
  id: string;
  title: string;
  views: number;
};

export type Comments = {
  id: string;
  text: string;
  postId: string;
};

export type Profile = Record<'name', string>;

export type Data = {
  posts: Posts[];
  comments: Comments[];
  profile: Profile;
};

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private readonly http: HttpClient) {}

  public getPosts() {
    return this.getPayload('/posts');
  }

  public getComments() {
    return this.getPayload('/comments');
  }

  public getProfile() {
    return this.getPayload('/profile');
  }

  private getPayload(path: string): Observable<Object> {
    return this.http.get(path);
  }
}
