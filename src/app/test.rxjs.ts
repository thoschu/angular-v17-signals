import { type, toUpper, toLower } from 'ramda';
import { Observable, map } from 'rxjs';

type CaseKind = 'upperCase' | 'lowerCase';

// higher order fn: a function that returns a function
export const toUpperOrToLowerCase =
    (kind: CaseKind): (source: Observable<any>) => Observable<any> => (source: Observable<any>): Observable<any> => source.pipe(
        map<unknown, unknown>((val: unknown) => {
            let returnVal = null;

            switch(type(val)) {
                case 'String': {

                    if('upperCase' === kind) {
                        returnVal  = toUpper(<string>val)
                    } else if ('lowerCase' === kind) {
                        returnVal  = toLower(<string>val)
                    }

                    break;
                }
                default: {
                    returnVal = val;
                    break;
                }
            }

            return returnVal;
        })
    );

export const testType =
    (): (source: Observable<string>) => Observable<string> => (source: Observable<string>): Observable<string> => source.pipe(
        map<string, string>((value: string): string => type(value))
    );

export const isType =
    (kind: string): (source: Observable<string>) => Observable<boolean> => (source: Observable<string>) => source.pipe(
        map<string, boolean>((value: string): boolean => type(value) === kind)
    );
