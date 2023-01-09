import { PipeTransform } from './pipe';
import { Provider } from './provider';
import { IComponentController, IDirectiveFactory, IModule, Injectable } from 'angular';
export interface ModuleConfig {
    id?: string;
    declarations?: Array<IComponentController | Injectable<IDirectiveFactory> | PipeTransform>;
    imports?: Array<string | NgModule>;
    exports?: Function[];
    providers?: Provider[];
    bootstrap?: IComponentController[];
}
export interface NgModule {
    module?: IModule;
    config?(...args: any[]): any;
    run?(...args: any[]): any;
    [p: string]: any;
}
export declare function NgModule({ id, bootstrap, declarations, imports, providers }: ModuleConfig): (Class: NgModule) => void;
