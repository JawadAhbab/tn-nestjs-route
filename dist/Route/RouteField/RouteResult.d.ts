declare const rtypes: readonly ["string", "number", "boolean", "object", "string[]", "number[]", "boolean[]", "object[]", "any[]"];
export type RouteResultType = (typeof rtypes)[number];
export interface RouteResultInfo {
    $result: true;
    name: string;
    type: RouteResultType;
    optional: boolean;
    object: RouteResultInfo[];
}
interface Options {
    optional?: boolean;
    type?: Function | [Function];
}
export declare const RouteResult: (opts?: Options) => (target: any, name: string) => void;
export {};
