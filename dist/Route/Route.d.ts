export interface RouteCdnConfig {
    cdn?: boolean;
    perma?: boolean;
    secure?: boolean;
}
export declare const Route: (routebase: string, cdnconfig?: RouteCdnConfig) => (target: Function) => void;
