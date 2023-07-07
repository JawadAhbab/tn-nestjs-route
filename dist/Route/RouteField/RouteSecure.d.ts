type TimeUnit = 's' | 'm' | 'h' | 'd' | 'y';
type Options = {
    timesafe?: `${string}${TimeUnit}` | false;
};
export interface RouteSecureInfo {
    $secure: true;
    name: string;
    secret: string;
    timesafe: string | false;
}
export declare const RouteSecure: (secret: string, opts?: Options) => (target: any, name: string) => void;
export {};
