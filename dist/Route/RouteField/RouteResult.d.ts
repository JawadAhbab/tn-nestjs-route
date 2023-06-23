declare const rtypes: readonly ["string", "number", "boolean", "object", "string[]", "number[]", "boolean[]", "any[]"];
export type RouteResultType = (typeof rtypes)[number];
export interface RouteResultInfo {
    $result: true;
    name: string;
    type: RouteResultType;
    optional: boolean;
}
interface Options {
    optional?: boolean;
    type?: StringConstructor | NumberConstructor | BooleanConstructor | ObjectConstructor | ArrayConstructor | [StringConstructor] | [NumberConstructor] | [BooleanConstructor];
}
export declare const RouteResult: (opts?: Options) => (target: any, name: string) => void;
export {};
