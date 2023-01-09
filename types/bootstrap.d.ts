import { IModule } from 'angular';
import { NgModule } from './module';
export interface CompilerOptions {
    strictDi?: boolean;
}
export declare const platformBrowserDynamic: () => typeof PlatformRef;
export declare class PlatformRef {
    static bootstrapModule(moduleType: NgModule | IModule | string, compilerOptions?: CompilerOptions): void;
}
