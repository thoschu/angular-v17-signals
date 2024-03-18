import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, ReplaySubject, shareReplay, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private readonly replaySubject: ReplaySubject<string[]> = new ReplaySubject<string[]>();
  protected readonly store$: Observable<string[]> = this.replaySubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.getPayload<Record<'payload', string[]>>('/lorem-ipsum').pipe(
      map((value: Record<'payload', string[]>): string[] => value.payload)
    ).subscribe((list: string[]): void => {
      this.replaySubject.next(list);
      // this.replaySubject.complete();
    });
  }

  public getPayloadFromStoreBigger(bigger: number): Observable<string[]> {
    return this.store$.pipe(map((list: string[]) => list.filter((text: string): boolean => text.length > bigger)));
  }

  public getPayloadFromStoreSmaller(smaller: number): Observable<string[]> {
    return this.store$.pipe(map((list: string[]) => list.filter((text: string): boolean => text.length < smaller)));
  }

  private getPayload<T>(uri: string): Observable<T> {
    return this.http.get<T>(`${uri}`);
  }
}
