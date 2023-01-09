/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="angular" />
/**
 * A wrapper around a native element inside of a View.
 * @stable
 */
export declare class ElementRef {
    nativeElement: HTMLElement;
    constructor($element: JQuery);
}
export interface ElementRef extends JQuery {
    nativeElement: HTMLElement;
}
