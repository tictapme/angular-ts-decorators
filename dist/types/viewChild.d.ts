import { ElementRef } from './element_ref';
import { Type } from './type';
export declare function ViewChild(selector: Type<any> | Function | string, opts?: {
    read?: typeof ElementRef;
}): any;
export declare function ViewChildren(selector: Type<any> | Function | string, opts?: {
    read?: typeof ElementRef;
}): any;
