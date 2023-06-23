/// <reference types="multer" />
import { ExecutionContext } from '@nestjs/common';
import { RouteInfo } from '../../RouteInfo';
import { ObjectOf } from 'tn-typescript';
type Files = ObjectOf<Express.Multer.File[]>;
export declare const routeFieldsEssentials: (ctx: ExecutionContext) => {
    params: import("express-serve-static-core").ParamsDictionary;
    body: any;
    files: Files;
    route: RouteInfo;
};
export {};
