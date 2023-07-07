import { OptionLess } from 'tn-typescript';
import { RouteCdnConfig } from './Route';
import { RouteBodyInfo } from './RouteField/RouteBody';
import { RouteFileInfo } from './RouteField/RouteFile';
import { RouteParamInfo } from './RouteField/RouteParam';
import { RouteQueryInfo } from './RouteField/RouteQuery';
import { RouteResultInfo } from './RouteField/RouteResult';
export type RouteMethod = 'GET' | 'POST';
export interface RouteInfo {
    $route: true;
    route: string;
    method: RouteMethod;
    name: string;
    secure: false | {
        name: string;
    };
    cdnconfig: OptionLess<RouteCdnConfig>;
    queries: RouteQueryInfo[];
    params: RouteParamInfo[];
    bodies: RouteBodyInfo[];
    files: RouteFileInfo[];
    results: RouteResultInfo;
    getSecureSecret: () => string | undefined;
}
export declare const createRouteInfo: (method: RouteMethod, routecls: Function, resultcls?: Function) => RouteInfo;
