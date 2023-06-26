declare const btypes: readonly ["string", "number", "boolean", "object", "string[]", "number[]", "boolean[]", "object[]", "any[]"];
export type RouteBodyType = (typeof btypes)[number];
type Validator<V = any> = (value: V) => boolean;
export interface RouteBodyInfo {
    $body: true;
    name: string;
    type: RouteBodyType;
    optional: boolean;
    object: RouteBodyInfo[];
    validator: Validator;
}
interface Options {
    optional?: boolean;
    type?: Function | [Function];
}
export declare const RouteBody: <V>(opts?: Options, v?: Validator<V> | undefined) => (target: any, name: string) => void;
export {};
