export interface RouteCdnConfig {
    bunnycdn?: boolean;
    bunnyperma?: boolean;
    bunnysecure?: boolean;
}
export declare const Route: (routebase: string, cdnconfig?: RouteCdnConfig) => (target: Function) => void;
