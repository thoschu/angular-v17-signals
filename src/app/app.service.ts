import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private readonly http: HttpClient) { }

  public getHello() {
    return this.http.get('/api');
  }
}
