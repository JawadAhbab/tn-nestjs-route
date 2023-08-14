import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RouteInfo } from '../RouteInfo/RouteInfo';
export declare class RouteSecureInterceptor implements NestInterceptor {
    private readonly route;
    constructor(route: RouteInfo);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
