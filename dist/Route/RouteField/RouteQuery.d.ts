import { Getter, Selects, Validator } from './accessories/RouteFieldTypes';
declare const qtypes: readonly ["string", "number", "boolean"];
type QueryType = (typeof qtypes)[number];
export interface RouteQueryInfo {
    $query: true;
    name: string;
    type: QueryType;
    optional: boolean;
    selects: Selects | null;
    getter: Getter;
    validator: Validator;
}
interface Options {
    getter?: Getter;
    selects?: Selects;
    optional?: boolean;
    type?: StringConstructor | NumberConstructor | BooleanConstructor;
}
export declare const RouteQuery: <V>(opts?: Options, v?: Validator<V> | undefined) => (target: any, name: string) => void;
export {};
