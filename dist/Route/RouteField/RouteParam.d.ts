import { Getter, Validator } from './accessories/RouteFieldTypes';
declare const ptypes: readonly ["string", "number", "boolean"];
type ParamType = (typeof ptypes)[number];
export interface RouteParamInfo {
    $param: true;
    name: string;
    type: ParamType;
    optional: boolean;
    getter: Getter;
    validator: Validator;
}
interface Options {
    getter?: Getter;
    type?: StringConstructor | NumberConstructor | BooleanConstructor;
    optional?: boolean;
}
export declare const RouteParam: <V>(opts?: Options, v?: Validator<V> | undefined) => (target: any, name: string) => void;
export {};
