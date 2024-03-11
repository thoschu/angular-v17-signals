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

  public getPosts(): Observable<Posts>  {
    return this.getPayload<Posts>('/posts');
  }

  public getComments(): Observable<Comments>  {
    return this.getPayload<Comments>('/comments');
  }

  public getProfile(): Observable<Profile> {
    return this.getPayload<Profile>('/profile');
  }

  private getPayload<T>(uri: string): Observable<T> {
    return this.http.get<T>(`/api${uri}`);
  }
}
