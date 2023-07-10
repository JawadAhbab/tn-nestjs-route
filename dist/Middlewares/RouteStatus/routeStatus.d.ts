import { AnyObject } from 'tn-typescript';
export declare class RouteStatus {
    private routes;
    saveStatus(routename: string, time: number): void;
    createSummery(sort?: 'count' | 'ave' | 'cpu'): {
        counts: number;
        average: number;
        cputime: string;
        routes: AnyObject;
    };
}
export declare const routeStatus: RouteStatus;
