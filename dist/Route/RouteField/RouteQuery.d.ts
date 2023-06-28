declare const qtypes: readonly ["string", "number", "boolean"];
type QueryType = (typeof qtypes)[number];
type Validator<V = any> = (value: V) => boolean;
export interface RouteQueryInfo {
    $query: true;
    name: string;
    type: QueryType;
    optional: boolean;
    validator: Validator;
}
interface Options {
    type?: StringConstructor | NumberConstructor | BooleanConstructor;
    optional?: boolean;
}
export declare const RouteQuery: <V>(opts?: Options, v?: Validator<V> | undefined) => (target: any, name: string) => void;
export {};
