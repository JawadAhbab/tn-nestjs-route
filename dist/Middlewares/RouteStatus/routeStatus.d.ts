import { AnyObject } from 'tn-typescript';
export declare class RouteStatus {
    private routes;
    saveStatus(routename: string, time: number): void;
    createSummery(sort?: 'count' | 'ave' | 'cpu'): {
        counts: number;
        average: string;
        cputime: string;
        routes: AnyObject;
    };
}
export declare const routeStatus: RouteStatus;
