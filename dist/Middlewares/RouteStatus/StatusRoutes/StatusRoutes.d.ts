import { ObjectOf } from 'tn-typescript';
interface Summery {
    count: number;
    ave: number;
    min: number;
    max: number;
}
export declare class StatusRoutes {
    private routes;
    saveStatus(routename: string, time: number): void;
    createSummery(sort?: 'count' | 'time'): ObjectOf<Summery>;
}
export declare const statusRoutes: StatusRoutes;
export {};
