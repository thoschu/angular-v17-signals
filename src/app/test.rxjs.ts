import { type, toUpper, toLower } from 'ramda';
import { Observable, map } from 'rxjs';

type CaseKind = 'upperCase' | 'lowerCase';

// higher order fn: a function that returns a function
export const toUpperOrToLowerCase =
    (kind: CaseKind) => (source: Observable<any>): Observable<any> => source.pipe(
        map((val: unknown) => {
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
