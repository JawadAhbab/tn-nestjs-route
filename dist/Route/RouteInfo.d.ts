import { OptionLess } from 'tn-typescript';
import { RouteCdnConfig } from './Route';
import { RouteBodyInfo } from './RouteField/RouteBody';
import { RouteFileInfo } from './RouteField/RouteFile';
import { RouteParamInfo } from './RouteField/RouteParam';
import { RouteQueryInfo } from './RouteField/RouteQuery';
import { RouteResultInfo } from './RouteField/RouteResult';
export type RouteMethod = 'GET' | 'POST';
type RouteSecure = {
    name: string;
    timesafe: string | false;
    query: boolean;
};
export interface RouteInfo {
    $route: true;
    route: string;
    method: RouteMethod;
    name: string;
    routesecure: RouteSecure | false;
    cdnconfig: OptionLess<RouteCdnConfig>;
    queries: RouteQueryInfo[];
    params: RouteParamInfo[];
    bodies: RouteBodyInfo[];
    files: RouteFileInfo[];
    results: RouteResultInfo;
    getRouteSecureSecret: () => string | undefined;
}
export declare const createRouteInfo: (method: RouteMethod, routecls: Function, resultcls?: Function) => RouteInfo;
export {};
