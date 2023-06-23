declare const ptypes: readonly ["string", "number", "boolean"];
type ParamType = (typeof ptypes)[number];
type Validator<V = any> = (value: V) => boolean;
export interface RouteParamInfo {
    $param: true;
    name: string;
    type: ParamType;
    optional: boolean;
    validator: Validator;
}
interface Options {
    type?: StringConstructor | NumberConstructor | BooleanConstructor;
    optional?: boolean;
}
export declare const RouteParam: <V>(opts?: Options, v?: Validator<V> | undefined) => (target: any, name: string) => void;
export {};
