import { Getter, Validator } from './accessories/RouteFieldTypes';
declare const qtypes: readonly ["string", "number", "boolean"];
type QueryType = (typeof qtypes)[number];
export interface RouteQueryInfo {
    $query: true;
    name: string;
    type: QueryType;
    getter: Getter;
    optional: boolean;
    validator: Validator;
}
interface Options {
    getter?: Getter;
    type?: StringConstructor | NumberConstructor | BooleanConstructor;
    optional?: boolean;
}
export declare const RouteQuery: <V>(opts?: Options, v?: Validator<V> | undefined) => (target: any, name: string) => void;
export {};
