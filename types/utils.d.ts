import 'reflect-metadata';
export declare enum Declaration {
    Component = "Component",
    Directive = "Directive",
    Pipe = "Pipe"
}
export declare function kebabToCamel(input: string): string;
export declare function camelToKebab(str: string): string;
export declare function getTypeName(target: any): string;
export declare function getTypeDeclaration(target: any): Declaration;
