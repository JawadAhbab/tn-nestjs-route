declare const btypes: readonly ["string", "number", "boolean", "object", "string[]", "number[]", "boolean[]", "any[]"];
export type RouteBodyType = (typeof btypes)[number];
type Validator<V = any> = (value: V) => boolean;
export interface RouteBodyInfo {
    $body: true;
    name: string;
    type: RouteBodyType;
    optional: boolean;
    validator: Validator;
}
interface Options {
    optional?: boolean;
    type?: StringConstructor | NumberConstructor | BooleanConstructor | ObjectConstructor | ArrayConstructor | [StringConstructor] | [NumberConstructor] | [BooleanConstructor];
}
export declare const RouteBody: <V>(opts?: Options, v?: Validator<V> | undefined) => (target: any, name: string) => void;
export {};
