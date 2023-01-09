import { IController, IDirective } from 'angular';
export interface DirectiveOptionsDecorated extends IDirective {
    selector: string;
}
export interface DirectiveControllerConstructor {
    new (...args: any[]): IController;
}
export declare function Directive({ selector, ...options }: DirectiveOptionsDecorated): (ctrl: DirectiveControllerConstructor) => void;
