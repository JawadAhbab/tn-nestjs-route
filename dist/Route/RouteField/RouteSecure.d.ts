export interface RouteSecureInfo {
    $secure: true;
    name: string;
    secret: string;
}
export declare const RouteSecure: (secret: string) => (target: any, name: string) => void;
