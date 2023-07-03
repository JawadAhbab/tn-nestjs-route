import { Getter, Validator } from './accessories/RouteFieldTypes';
declare const btypes: readonly ["string", "number", "boolean", "object", "string[]", "number[]", "boolean[]", "object[]", "any[]"];
export type RouteBodyType = (typeof btypes)[number];
export interface RouteBodyInfo {
    $body: true;
    name: string;
    type: RouteBodyType;
    optional: boolean;
    object: RouteBodyInfo[];
    getter: Getter;
    validator: Validator;
}
interface Options {
    getter?: Getter;
    optional?: boolean;
    type?: Function | [Function];
}
export declare const RouteBody: <V>(opts?: Options, v?: Validator<V> | undefined) => (target: any, name: string) => void;
export {};
