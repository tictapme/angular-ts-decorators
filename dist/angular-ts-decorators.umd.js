(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('angular'), require('tslib'), require('reflect-metadata')) :
    typeof define === 'function' && define.amd ? define(['exports', 'angular', 'tslib', 'reflect-metadata'], factory) :
    (global = global || self, factory(global['angular-ts-decorators'] = {}, global.angular, global.tslib_1));
}(this, function (exports, angular, tslib_1) { 'use strict';

    var platformBrowserDynamic = function () { return PlatformRef; };
    var PlatformRef = /** @class */ (function () {
        function PlatformRef() {
        }
        PlatformRef.bootstrapModule = function (moduleType, compilerOptions) {
            if (compilerOptions === void 0) { compilerOptions = { strictDi: false }; }
            var moduleName;
            switch (typeof moduleType) {
                case 'string': // module name string
                    moduleName = moduleType;
                    break;
                case 'object': // angular.module object
                    moduleName = moduleType.name;
                    break;
                case 'function': // NgModule class
                default:
                    var module_1 = moduleType.module;
                    if (!module_1) {
                        throw Error('Argument moduleType should be NgModule class, angular.module object or module name string');
                    }
                    moduleName = module_1.name;
            }
            var strictDi = (compilerOptions.strictDi === true);
            angular.element(document).ready(function () {
                angular.bootstrap(document.body, [moduleName], { strictDi: strictDi });
            });
        };
        return PlatformRef;
    }());

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * A wrapper around a native element inside of a View.
     * @stable
     */
    var ElementRef = /** @class */ (function () {
        function ElementRef($element) {
            $element['nativeElement'] = $element[0];
            return $element;
        }
        return ElementRef;
    }());

    (function (Declaration) {
        Declaration["Component"] = "Component";
        Declaration["Directive"] = "Directive";
        Declaration["Pipe"] = "Pipe";
    })(exports.Declaration || (exports.Declaration = {}));
    /** @internal */
    var metadataKeys = {
        declaration: 'custom:declaration',
        name: 'custom:name',
        bindings: 'custom:bindings',
        require: 'custom:require',
        options: 'custom:options',
        listeners: 'custom:listeners',
        viewChildren: 'custom:viewChildren',
    };
    function kebabToCamel(input) {
        return input.replace(/(-\w)/g, function (m) { return m[1].toUpperCase(); });
    }
    function camelToKebab(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
    /** @internal */
    function getAttributeName(selector) {
        return selector.substr(1, selector.length - 2);
    }
    /** @internal */
    function isAttributeSelector(selector) {
        return /^[\[].*[\]]$/g.test(selector);
    }
    /** @internal */
    function getMetadata(metadataKey, target) {
        return Reflect.getMetadata(metadataKey, target);
    }
    /** @internal */
    function defineMetadata(metadataKey, metadataValue, target) {
        Reflect.defineMetadata(metadataKey, metadataValue, target);
    }
    function getTypeName(target) {
        return getMetadata(metadataKeys.name, target);
    }
    function getTypeDeclaration(target) {
        return getMetadata(metadataKeys.declaration, target);
    }

    /**
     * @internal
     * @desc Mapping between angular and angularjs LifecycleHooks
     */
    var ngLifecycleHooksMap = {
        ngOnInit: '$onInit',
        ngOnDestroy: '$onDestroy',
        ngDoCheck: '$doCheck',
        ngOnChanges: '$onChanges',
        ngAfterViewInit: '$postLink'
    };

    function Component(_a) {
        var selector = _a.selector, options = tslib_1.__rest(_a, ["selector"]);
        return function (ctrl) {
            options.controller = ctrl;
            var isAttrSelector = isAttributeSelector(selector);
            var bindings = getMetadata(metadataKeys.bindings, ctrl);
            if (bindings) {
                if (isAttrSelector) {
                    options['bindToController'] = bindings;
                    options['controllerAs'] = options['controllerAs'] || '$ctrl';
                }
                else
                    options['bindings'] = bindings;
            }
            var require = getMetadata(metadataKeys.require, ctrl);
            if (require) {
                options.require = require;
            }
            if (isAttrSelector) {
                options.restrict = 'A';
            }
            replaceLifecycleHooks(ctrl);
            var selectorName = isAttrSelector ? getAttributeName(selector) : selector;
            defineMetadata(metadataKeys.name, kebabToCamel(selectorName), ctrl);
            defineMetadata(metadataKeys.declaration, isAttrSelector ? exports.Declaration.Directive : exports.Declaration.Component, ctrl);
            defineMetadata(metadataKeys.options, options, ctrl);
        };
    }
    /** @internal */
    function registerComponent(module, component) {
        var name = getMetadata(metadataKeys.name, component);
        var options = getMetadata(metadataKeys.options, component);
        var listeners = getMetadata(metadataKeys.listeners, options.controller);
        var viewChildren = getMetadata(metadataKeys.viewChildren, component);
        if (listeners || viewChildren) {
            options.controller = extendWithHostListenersAndChildren(options.controller, listeners, viewChildren);
        }
        module.component(name, options);
    }
    /** @internal */
    function extendWithHostListenersAndChildren(ctrl, listeners, viewChildren) {
        if (listeners === void 0) { listeners = {}; }
        if (viewChildren === void 0) { viewChildren = {}; }
        var handlers = Object.keys(listeners);
        var namespace = '.HostListener';
        var properties = Object.keys(viewChildren);
        var NewCtrl = /** @class */ (function (_super) {
            tslib_1.__extends(NewCtrl, _super);
            function NewCtrl($element) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var _this = _super.apply(this, args) || this;
                _this.$element = $element;
                return _this;
            }
            NewCtrl.prototype._updateViewChildren = function () {
                var _this = this;
                properties.forEach(function (property) {
                    var child = viewChildren[property];
                    var selector;
                    if (typeof child.selector !== 'string') {
                        var type = getTypeDeclaration(child.selector);
                        if (type !== exports.Declaration.Component && type !== exports.Declaration.Directive) {
                            console.error("No valid selector was provided for ViewChild" + (child.first ? '' :
                                'ren') + " decorator, it should be type or selector of component/directive");
                            return;
                        }
                        selector = camelToKebab(getTypeName(child.selector));
                    }
                    else
                        selector = "#" + child.selector;
                    var viewChildEls = Array.prototype.slice.call(_this.$element[0].querySelectorAll(selector))
                        .map(function (viewChild) {
                        // if ViewChild selector is type use selector derived from type
                        // otherwise (i.e. id of the element), get it's element name (localName)
                        var componentName = typeof child.selector === 'string' ? viewChild.localName : selector;
                        var el = angular.element(viewChild);
                        var $ctrl = el && el.controller(kebabToCamel(componentName));
                        return child.read ? new ElementRef(el) : ($ctrl || new ElementRef(el));
                    })
                        .filter(function (el) { return !!el; });
                    if (viewChildEls.length) {
                        _this[property] = child.first ? viewChildEls[0] : viewChildEls;
                    }
                    else {
                        _this[property] = undefined;
                    }
                });
            };
            NewCtrl.prototype.$postLink = function () {
                var _this = this;
                if (_super.prototype.$postLink) {
                    _super.prototype.$postLink.call(this);
                }
                handlers.forEach(function (handler) {
                    var eventName = listeners[handler].eventName;
                    _this.$element.on(eventName + namespace, _this[handler].bind(_this));
                });
                this._updateViewChildren();
            };
            NewCtrl.prototype.$onChanges = function (changes) {
                if (_super.prototype.$onChanges) {
                    _super.prototype.$onChanges.call(this, changes);
                }
                this._updateViewChildren();
            };
            NewCtrl.prototype.$onDestroy = function () {
                if (_super.prototype.$onDestroy) {
                    _super.prototype.$onDestroy.call(this);
                }
                if (handlers.length) {
                    this.$element.off(namespace);
                }
            };
            return NewCtrl;
        }(ctrl));
        NewCtrl.$inject = ['$element'].concat(ctrl.$inject || []);
        return NewCtrl;
    }
    /** @internal */
    function replaceLifecycleHooks(ctrl) {
        var ctrlClass = ctrl.prototype;
        var ngHooksFound = getHooksOnCtrlClass(ctrlClass);
        ngHooksFound.forEach(function (ngHook) {
            var angularJsHook = ngLifecycleHooksMap[ngHook];
            ctrlClass[angularJsHook] = ctrlClass[ngHook];
        });
    }
    /** @internal */
    function getHooksOnCtrlClass(ctrlClass) {
        return Object.keys(ngLifecycleHooksMap)
            .filter(function (hook) { return angular.isFunction(ctrlClass[hook]); });
    }

    function Directive(_a) {
        var selector = _a.selector, options = tslib_1.__rest(_a, ["selector"]);
        return function (ctrl) {
            var bindings = getMetadata(metadataKeys.bindings, ctrl);
            if (bindings) {
                options.bindToController = bindings;
            }
            var require = getMetadata(metadataKeys.require, ctrl);
            if (require) {
                options.require = require;
                if (!options.bindToController)
                    options.bindToController = true;
            }
            options.restrict = options.restrict || 'A';
            var selectorName = isAttributeSelector(selector) ? getAttributeName(selector) : selector;
            defineMetadata(metadataKeys.name, kebabToCamel(selectorName), ctrl);
            defineMetadata(metadataKeys.declaration, exports.Declaration.Directive, ctrl);
            defineMetadata(metadataKeys.options, options, ctrl);
        };
    }
    /** @internal */
    function registerDirective(module, ctrl) {
        var directiveFunc;
        var name = getMetadata(metadataKeys.name, ctrl);
        var options = getMetadata(metadataKeys.options, ctrl);
        replaceLifecycleHooks(ctrl);
        var listeners = getMetadata(metadataKeys.listeners, ctrl);
        var viewChildren = getMetadata(metadataKeys.viewChildren, ctrl);
        options.controller = listeners || viewChildren ?
            extendWithHostListenersAndChildren(ctrl, listeners, viewChildren) : ctrl;
        directiveFunc = function () { return options; };
        module.directive(name, directiveFunc);
    }

    function Injectable(name) {
        return function (Class) {
            if (name) {
                defineMetadata(metadataKeys.name, name, Class);
            }
        };
    }
    function Inject(name) {
        return function (target, propertyKey, parameterIndex) {
            // if @Inject decorator is on target's method
            if (propertyKey && Array.isArray(target[propertyKey])) {
                target[propertyKey][parameterIndex] = name;
                return; // exit, don't change injection on target's constructor
            }
            // if @Inject decorator is on target's constructor
            if (target.$inject) {
                target.$inject[parameterIndex] = name;
            }
            else {
                console.error("Annotations should be provided as static $inject property in order to use @Inject decorator");
            }
        };
    }
    /** @internal */
    function registerProviders(module, providers) {
        providers.forEach(function (provider) {
            // providers registered using { provide, useClass/useFactory/useValue } syntax
            if (provider.provide) {
                var name_1 = provider.provide;
                if (provider.useClass && provider.useClass instanceof Function) {
                    module.service(name_1, provider.useClass);
                }
                else if (provider.useFactory && provider.useFactory instanceof Function) {
                    provider.useFactory.$inject = provider.deps || provider.useFactory.$inject;
                    module.factory(name_1, provider.useFactory);
                }
                else if (provider.useValue) {
                    module.constant(name_1, provider.useValue);
                }
                else if (provider.useExisting) {
                    module.provider(name_1, provider.useExisting);
                }
            }
            // providers registered as classes
            else {
                var name_2 = getMetadata(metadataKeys.name, provider);
                if (!name_2) {
                    console.error(provider.name + " was not registered as angular service:\n        Provide explicit name in @Injectable when using class syntax or register it using object provider syntax:\n        { provide: '" + provider.name + "', useClass: " + provider.name + " }");
                }
                else {
                    module.service(name_2, provider);
                }
            }
        });
    }

    function Pipe(options) {
        return function (Class) {
            defineMetadata(metadataKeys.name, options.name, Class);
            defineMetadata(metadataKeys.declaration, exports.Declaration.Pipe, Class);
        };
    }
    /** @internal */
    function registerPipe(module, filter) {
        var name = getMetadata(metadataKeys.name, filter);
        var filterFactory = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var injector = args[0]; // reference to $injector
            var instance = injector.instantiate(filter);
            return instance.transform.bind(instance);
        };
        filterFactory.$inject = ['$injector'].concat(filter.$inject || []);
        module.filter(name, filterFactory);
    }

    function Input(alias) {
        return function (target, key) { return addBindingToMetadata(target, key, '<?', alias); };
    }
    function Output(alias) {
        return function (target, key) { return addBindingToMetadata(target, key, '&', alias); };
    }
    function ViewParent(controller) {
        return function (target, key) { return addRequireToMetadata(target, key, controller); };
    }
    /** @internal */
    function addBindingToMetadata(target, key, direction, alias) {
        var targetConstructor = target.constructor;
        var bindings = getMetadata(metadataKeys.bindings, targetConstructor) || {};
        bindings[key] = alias || direction;
        defineMetadata(metadataKeys.bindings, bindings, targetConstructor);
    }
    /** @internal */
    function addRequireToMetadata(target, key, controller) {
        var targetConstructor = target.constructor;
        var require = getMetadata(metadataKeys.require, targetConstructor) || {};
        require[key] = controller;
        defineMetadata(metadataKeys.require, require, targetConstructor);
    }

    function NgModule(_a) {
        var id = _a.id, _b = _a.bootstrap, _c = _a.declarations, declarations = _c === void 0 ? [] : _c, _d = _a.imports, imports = _d === void 0 ? [] : _d, _e = _a.providers, providers = _e === void 0 ? [] : _e;
        return function (Class) {
            // module registration
            var deps = imports.map(function (mod) { return typeof mod === 'string' ? mod : mod.module.name; });
            if (!id) {
                console.warn('You are not providing ngModule id, be careful this code won\'t work when uglified.');
                id = Class.name;
            }
            var module = angular.module(id, deps);
            // components, directives and filters registration
            declarations.forEach(function (declaration) {
                var declarationType = getMetadata(metadataKeys.declaration, declaration);
                switch (declarationType) {
                    case exports.Declaration.Component:
                        registerComponent(module, declaration);
                        break;
                    case exports.Declaration.Directive:
                        registerDirective(module, declaration);
                        break;
                    case exports.Declaration.Pipe:
                        registerPipe(module, declaration);
                        break;
                    default:
                        console.error("Can't find type metadata on " + declaration.name + " declaration, did you forget to decorate it?\n            Decorate your declarations using @Component, @Directive or @Pipe decorator.");
                }
            });
            // services registration
            if (providers) {
                registerProviders(module, providers);
            }
            // config and run blocks registration
            var config = Class.config, run = Class.run;
            if (config) {
                module.config(config);
            }
            if (run) {
                module.run(run);
            }
            // expose angular module as static property
            Class.module = module;
        };
    }

    function HostListener(eventName, args) {
        return function (target, propertyKey, descriptor) {
            var listener = descriptor.value;
            if (typeof listener !== 'function') {
                throw new Error("@HostListener decorator can only be applied to methods not: " + typeof listener);
            }
            var targetConstructor = target.constructor;
            /**
             * listeners = { onMouseEnter: { eventName: 'mouseenter mouseover', args: [] } }
             */
            var listeners = getMetadata(metadataKeys.listeners, targetConstructor) || {};
            listeners[propertyKey] = { eventName: eventName, args: args };
            defineMetadata(metadataKeys.listeners, listeners, targetConstructor);
        };
    }

    function ViewChild(selector, opts) {
        if (opts === void 0) { opts = {}; }
        return function (target, key) { return addBindingToMetadata$1(target, key, selector, opts.read, true); };
    }
    function ViewChildren(selector, opts) {
        if (opts === void 0) { opts = {}; }
        return function (target, key) { return addBindingToMetadata$1(target, key, selector, opts.read, false); };
    }
    /** @internal */
    function addBindingToMetadata$1(target, key, selector, read, first) {
        var targetConstructor = target.constructor;
        var viewChildren = getMetadata(metadataKeys.viewChildren, targetConstructor) || {};
        viewChildren[key] = { first: first, selector: selector, read: read };
        defineMetadata(metadataKeys.viewChildren, viewChildren, targetConstructor);
    }

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * @whatItDoes Represents a type that a Component or other object is instances of.
     *
     * @description
     *
     * An example of a `Type` is `MyCustomComponent` class, which in JavaScript is be represented by
     * the `MyCustomComponent` constructor function.
     *
     * @stable
     */
    var Type = Function;
    function isType(v) {
        return typeof v === 'function';
    }

    exports.Component = Component;
    exports.Directive = Directive;
    exports.ElementRef = ElementRef;
    exports.HostListener = HostListener;
    exports.Inject = Inject;
    exports.Injectable = Injectable;
    exports.Input = Input;
    exports.NgModule = NgModule;
    exports.Output = Output;
    exports.Pipe = Pipe;
    exports.Type = Type;
    exports.ViewChild = ViewChild;
    exports.ViewChildren = ViewChildren;
    exports.ViewParent = ViewParent;
    exports.camelToKebab = camelToKebab;
    exports.defineMetadata = defineMetadata;
    exports.getAttributeName = getAttributeName;
    exports.getMetadata = getMetadata;
    exports.getTypeDeclaration = getTypeDeclaration;
    exports.getTypeName = getTypeName;
    exports.isAttributeSelector = isAttributeSelector;
    exports.isType = isType;
    exports.kebabToCamel = kebabToCamel;
    exports.metadataKeys = metadataKeys;
    exports.ngLifecycleHooksMap = ngLifecycleHooksMap;
    exports.platformBrowserDynamic = platformBrowserDynamic;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
