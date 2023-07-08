import { TimeString } from './accessories/TimeString';
export interface RouteCdnConfig {
    bunnycdn?: boolean;
    bunnyperma?: boolean;
    bunnysecure?: false | TimeString;
}
export declare const Route: (routebase: string, cdnconfig?: RouteCdnConfig) => (target: Function) => void;
