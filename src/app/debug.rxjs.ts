import { Observable, tap } from 'rxjs';

export enum RxJSLoggingLevel {
    TRACE,
    DEBUG,
    INFO,
    ERROR
}

let globalRxJSLoggingLevel: RxJSLoggingLevel = RxJSLoggingLevel.INFO;

export const setRxJSLoggingLevel = (level: RxJSLoggingLevel): void => {
    globalRxJSLoggingLevel = level;
}

// higher order fn: a function that returns a function
export const debug =
    (level: number, message: string) => (source: Observable<any>): Observable<any> => source.pipe(
        tap((val: unknown): void => {
            if(level >= globalRxJSLoggingLevel) {
                console.log(`${message}: `, val);
            }
        })
    );
