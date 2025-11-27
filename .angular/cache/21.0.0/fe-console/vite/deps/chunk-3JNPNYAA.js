import {
  BidiModule,
  CdkMonitorFocus,
  Platform,
  Typeahead,
  _CdkPrivateStyleLoader,
  _getEventTarget,
  _getFocusedElementPierceShadowDom,
  coerceArray,
  coerceElement,
  coerceNumberProperty,
  isFakeMousedownFromScreenReader,
  isFakeTouchstartFromScreenReader,
  normalizePassiveListenerOptions,
} from './chunk-OOBVUTLG.js';
import {
  ANIMATION_MODULE_TYPE,
  APP_ID,
  CSP_NONCE,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  Directive,
  ElementRef,
  EventEmitter,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  NgModule,
  NgZone,
  Output,
  QueryList,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  inject,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
} from './chunk-WKLQYTUL.js';
import {
  Observable,
  Subject,
  Subscription,
  __spreadValues,
  combineLatest,
  concat,
  debounceTime,
  filter,
  isObservable,
  map,
  of,
  skip,
  startWith,
  take,
  takeUntil,
} from './chunk-PJVWDKLX.js';

// node_modules/@angular/cdk/fesm2022/private.mjs
var _VisuallyHiddenLoader = class __VisuallyHiddenLoader {
  static ɵfac = function _VisuallyHiddenLoader_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || __VisuallyHiddenLoader)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: __VisuallyHiddenLoader,
    selectors: [['ng-component']],
    exportAs: ['cdkVisuallyHidden'],
    decls: 0,
    vars: 0,
    template: function _VisuallyHiddenLoader_Template(rf, ctx) {},
    styles: [
      '.cdk-visually-hidden{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap;outline:0;-webkit-appearance:none;-moz-appearance:none;left:0}[dir=rtl] .cdk-visually-hidden{left:auto;right:0}\n',
    ],
    encapsulation: 2,
    changeDetection: 0,
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      _VisuallyHiddenLoader,
      [
        {
          type: Component,
          args: [
            {
              exportAs: 'cdkVisuallyHidden',
              encapsulation: ViewEncapsulation.None,
              template: '',
              changeDetection: ChangeDetectionStrategy.OnPush,
              styles: [
                '.cdk-visually-hidden{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap;outline:0;-webkit-appearance:none;-moz-appearance:none;left:0}[dir=rtl] .cdk-visually-hidden{left:auto;right:0}\n',
              ],
            },
          ],
        },
      ],
      null,
      null
    );
})();

// node_modules/@angular/cdk/fesm2022/observers.mjs
function shouldIgnoreRecord(record) {
  if (record.type === 'characterData' && record.target instanceof Comment) {
    return true;
  }
  if (record.type === 'childList') {
    for (let i = 0; i < record.addedNodes.length; i++) {
      if (!(record.addedNodes[i] instanceof Comment)) {
        return false;
      }
    }
    for (let i = 0; i < record.removedNodes.length; i++) {
      if (!(record.removedNodes[i] instanceof Comment)) {
        return false;
      }
    }
    return true;
  }
  return false;
}
var MutationObserverFactory = class _MutationObserverFactory {
  create(callback) {
    return typeof MutationObserver === 'undefined' ? null : new MutationObserver(callback);
  }
  static ɵfac = function MutationObserverFactory_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MutationObserverFactory)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _MutationObserverFactory,
    factory: _MutationObserverFactory.ɵfac,
    providedIn: 'root',
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      MutationObserverFactory,
      [
        {
          type: Injectable,
          args: [
            {
              providedIn: 'root',
            },
          ],
        },
      ],
      null,
      null
    );
})();
var ContentObserver = class _ContentObserver {
  _mutationObserverFactory = inject(MutationObserverFactory);
  _observedElements = /* @__PURE__ */ new Map();
  _ngZone = inject(NgZone);
  constructor() {}
  ngOnDestroy() {
    this._observedElements.forEach((_, element) => this._cleanupObserver(element));
  }
  observe(elementOrRef) {
    const element = coerceElement(elementOrRef);
    return new Observable((observer) => {
      const stream = this._observeElement(element);
      const subscription = stream
        .pipe(
          map((records) => records.filter((record) => !shouldIgnoreRecord(record))),
          filter((records) => !!records.length)
        )
        .subscribe((records) => {
          this._ngZone.run(() => {
            observer.next(records);
          });
        });
      return () => {
        subscription.unsubscribe();
        this._unobserveElement(element);
      };
    });
  }
  _observeElement(element) {
    return this._ngZone.runOutsideAngular(() => {
      if (!this._observedElements.has(element)) {
        const stream = new Subject();
        const observer = this._mutationObserverFactory.create((mutations) => stream.next(mutations));
        if (observer) {
          observer.observe(element, {
            characterData: true,
            childList: true,
            subtree: true,
          });
        }
        this._observedElements.set(element, {
          observer,
          stream,
          count: 1,
        });
      } else {
        this._observedElements.get(element).count++;
      }
      return this._observedElements.get(element).stream;
    });
  }
  _unobserveElement(element) {
    if (this._observedElements.has(element)) {
      this._observedElements.get(element).count--;
      if (!this._observedElements.get(element).count) {
        this._cleanupObserver(element);
      }
    }
  }
  _cleanupObserver(element) {
    if (this._observedElements.has(element)) {
      const { observer, stream } = this._observedElements.get(element);
      if (observer) {
        observer.disconnect();
      }
      stream.complete();
      this._observedElements.delete(element);
    }
  }
  static ɵfac = function ContentObserver_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ContentObserver)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ContentObserver,
    factory: _ContentObserver.ɵfac,
    providedIn: 'root',
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      ContentObserver,
      [
        {
          type: Injectable,
          args: [
            {
              providedIn: 'root',
            },
          ],
        },
      ],
      () => [],
      null
    );
})();
var CdkObserveContent = class _CdkObserveContent {
  _contentObserver = inject(ContentObserver);
  _elementRef = inject(ElementRef);
  event = new EventEmitter();
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
    this._disabled ? this._unsubscribe() : this._subscribe();
  }
  _disabled = false;
  get debounce() {
    return this._debounce;
  }
  set debounce(value) {
    this._debounce = coerceNumberProperty(value);
    this._subscribe();
  }
  _debounce;
  _currentSubscription = null;
  constructor() {}
  ngAfterContentInit() {
    if (!this._currentSubscription && !this.disabled) {
      this._subscribe();
    }
  }
  ngOnDestroy() {
    this._unsubscribe();
  }
  _subscribe() {
    this._unsubscribe();
    const stream = this._contentObserver.observe(this._elementRef);
    this._currentSubscription = (this.debounce ? stream.pipe(debounceTime(this.debounce)) : stream).subscribe(
      this.event
    );
  }
  _unsubscribe() {
    this._currentSubscription?.unsubscribe();
  }
  static ɵfac = function CdkObserveContent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkObserveContent)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _CdkObserveContent,
    selectors: [['', 'cdkObserveContent', '']],
    inputs: {
      disabled: [2, 'cdkObserveContentDisabled', 'disabled', booleanAttribute],
      debounce: 'debounce',
    },
    outputs: {
      event: 'cdkObserveContent',
    },
    exportAs: ['cdkObserveContent'],
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      CdkObserveContent,
      [
        {
          type: Directive,
          args: [
            {
              selector: '[cdkObserveContent]',
              exportAs: 'cdkObserveContent',
            },
          ],
        },
      ],
      () => [],
      {
        event: [
          {
            type: Output,
            args: ['cdkObserveContent'],
          },
        ],
        disabled: [
          {
            type: Input,
            args: [
              {
                alias: 'cdkObserveContentDisabled',
                transform: booleanAttribute,
              },
            ],
          },
        ],
        debounce: [
          {
            type: Input,
          },
        ],
      }
    );
})();
var ObserversModule = class _ObserversModule {
  static ɵfac = function ObserversModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ObserversModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _ObserversModule,
    imports: [CdkObserveContent],
    exports: [CdkObserveContent],
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [MutationObserverFactory],
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      ObserversModule,
      [
        {
          type: NgModule,
          args: [
            {
              imports: [CdkObserveContent],
              exports: [CdkObserveContent],
              providers: [MutationObserverFactory],
            },
          ],
        },
      ],
      null,
      null
    );
})();

// node_modules/@angular/cdk/fesm2022/_breakpoints-observer-chunk.mjs
var mediaQueriesForWebkitCompatibility = /* @__PURE__ */ new Set();
var mediaQueryStyleNode;
var MediaMatcher = class _MediaMatcher {
  _platform = inject(Platform);
  _nonce = inject(CSP_NONCE, {
    optional: true,
  });
  _matchMedia;
  constructor() {
    this._matchMedia = this._platform.isBrowser && window.matchMedia ? window.matchMedia.bind(window) : noopMatchMedia;
  }
  matchMedia(query) {
    if (this._platform.WEBKIT || this._platform.BLINK) {
      createEmptyStyleRule(query, this._nonce);
    }
    return this._matchMedia(query);
  }
  static ɵfac = function MediaMatcher_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MediaMatcher)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _MediaMatcher,
    factory: _MediaMatcher.ɵfac,
    providedIn: 'root',
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      MediaMatcher,
      [
        {
          type: Injectable,
          args: [
            {
              providedIn: 'root',
            },
          ],
        },
      ],
      () => [],
      null
    );
})();
function createEmptyStyleRule(query, nonce) {
  if (mediaQueriesForWebkitCompatibility.has(query)) {
    return;
  }
  try {
    if (!mediaQueryStyleNode) {
      mediaQueryStyleNode = document.createElement('style');
      if (nonce) {
        mediaQueryStyleNode.setAttribute('nonce', nonce);
      }
      mediaQueryStyleNode.setAttribute('type', 'text/css');
      document.head.appendChild(mediaQueryStyleNode);
    }
    if (mediaQueryStyleNode.sheet) {
      mediaQueryStyleNode.sheet.insertRule(`@media ${query} {body{ }}`, 0);
      mediaQueriesForWebkitCompatibility.add(query);
    }
  } catch (e) {
    console.error(e);
  }
}
function noopMatchMedia(query) {
  return {
    matches: query === 'all' || query === '',
    media: query,
    addListener: () => {},
    removeListener: () => {},
  };
}
var BreakpointObserver = class _BreakpointObserver {
  _mediaMatcher = inject(MediaMatcher);
  _zone = inject(NgZone);
  _queries = /* @__PURE__ */ new Map();
  _destroySubject = new Subject();
  constructor() {}
  ngOnDestroy() {
    this._destroySubject.next();
    this._destroySubject.complete();
  }
  isMatched(value) {
    const queries = splitQueries(coerceArray(value));
    return queries.some((mediaQuery) => this._registerQuery(mediaQuery).mql.matches);
  }
  observe(value) {
    const queries = splitQueries(coerceArray(value));
    const observables = queries.map((query) => this._registerQuery(query).observable);
    let stateObservable = combineLatest(observables);
    stateObservable = concat(stateObservable.pipe(take(1)), stateObservable.pipe(skip(1), debounceTime(0)));
    return stateObservable.pipe(
      map((breakpointStates) => {
        const response = {
          matches: false,
          breakpoints: {},
        };
        breakpointStates.forEach(({ matches, query }) => {
          response.matches = response.matches || matches;
          response.breakpoints[query] = matches;
        });
        return response;
      })
    );
  }
  _registerQuery(query) {
    if (this._queries.has(query)) {
      return this._queries.get(query);
    }
    const mql = this._mediaMatcher.matchMedia(query);
    const queryObservable = new Observable((observer) => {
      const handler = (e) => this._zone.run(() => observer.next(e));
      mql.addListener(handler);
      return () => {
        mql.removeListener(handler);
      };
    }).pipe(
      startWith(mql),
      map(({ matches }) => ({
        query,
        matches,
      })),
      takeUntil(this._destroySubject)
    );
    const output = {
      observable: queryObservable,
      mql,
    };
    this._queries.set(query, output);
    return output;
  }
  static ɵfac = function BreakpointObserver_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BreakpointObserver)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _BreakpointObserver,
    factory: _BreakpointObserver.ɵfac,
    providedIn: 'root',
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      BreakpointObserver,
      [
        {
          type: Injectable,
          args: [
            {
              providedIn: 'root',
            },
          ],
        },
      ],
      () => [],
      null
    );
})();
function splitQueries(queries) {
  return queries
    .map((query) => query.split(','))
    .reduce((a1, a2) => a1.concat(a2))
    .map((query) => query.trim());
}

// node_modules/@angular/cdk/fesm2022/_a11y-module-chunk.mjs
var InteractivityChecker = class _InteractivityChecker {
  _platform = inject(Platform);
  constructor() {}
  isDisabled(element) {
    return element.hasAttribute('disabled');
  }
  isVisible(element) {
    return hasGeometry(element) && getComputedStyle(element).visibility === 'visible';
  }
  isTabbable(element) {
    if (!this._platform.isBrowser) {
      return false;
    }
    const frameElement = getFrameElement(getWindow(element));
    if (frameElement) {
      if (getTabIndexValue(frameElement) === -1) {
        return false;
      }
      if (!this.isVisible(frameElement)) {
        return false;
      }
    }
    let nodeName = element.nodeName.toLowerCase();
    let tabIndexValue = getTabIndexValue(element);
    if (element.hasAttribute('contenteditable')) {
      return tabIndexValue !== -1;
    }
    if (nodeName === 'iframe' || nodeName === 'object') {
      return false;
    }
    if (this._platform.WEBKIT && this._platform.IOS && !isPotentiallyTabbableIOS(element)) {
      return false;
    }
    if (nodeName === 'audio') {
      if (!element.hasAttribute('controls')) {
        return false;
      }
      return tabIndexValue !== -1;
    }
    if (nodeName === 'video') {
      if (tabIndexValue === -1) {
        return false;
      }
      if (tabIndexValue !== null) {
        return true;
      }
      return this._platform.FIREFOX || element.hasAttribute('controls');
    }
    return element.tabIndex >= 0;
  }
  isFocusable(element, config) {
    return (
      isPotentiallyFocusable(element) &&
      !this.isDisabled(element) &&
      (config?.ignoreVisibility || this.isVisible(element))
    );
  }
  static ɵfac = function InteractivityChecker_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InteractivityChecker)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _InteractivityChecker,
    factory: _InteractivityChecker.ɵfac,
    providedIn: 'root',
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      InteractivityChecker,
      [
        {
          type: Injectable,
          args: [
            {
              providedIn: 'root',
            },
          ],
        },
      ],
      () => [],
      null
    );
})();
function getFrameElement(window2) {
  try {
    return window2.frameElement;
  } catch {
    return null;
  }
}
function hasGeometry(element) {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    (typeof element.getClientRects === 'function' && element.getClientRects().length)
  );
}
function isNativeFormElement(element) {
  let nodeName = element.nodeName.toLowerCase();
  return nodeName === 'input' || nodeName === 'select' || nodeName === 'button' || nodeName === 'textarea';
}
function isHiddenInput(element) {
  return isInputElement(element) && element.type == 'hidden';
}
function isAnchorWithHref(element) {
  return isAnchorElement(element) && element.hasAttribute('href');
}
function isInputElement(element) {
  return element.nodeName.toLowerCase() == 'input';
}
function isAnchorElement(element) {
  return element.nodeName.toLowerCase() == 'a';
}
function hasValidTabIndex(element) {
  if (!element.hasAttribute('tabindex') || element.tabIndex === void 0) {
    return false;
  }
  let tabIndex = element.getAttribute('tabindex');
  return !!(tabIndex && !isNaN(parseInt(tabIndex, 10)));
}
function getTabIndexValue(element) {
  if (!hasValidTabIndex(element)) {
    return null;
  }
  const tabIndex = parseInt(element.getAttribute('tabindex') || '', 10);
  return isNaN(tabIndex) ? -1 : tabIndex;
}
function isPotentiallyTabbableIOS(element) {
  let nodeName = element.nodeName.toLowerCase();
  let inputType = nodeName === 'input' && element.type;
  return inputType === 'text' || inputType === 'password' || nodeName === 'select' || nodeName === 'textarea';
}
function isPotentiallyFocusable(element) {
  if (isHiddenInput(element)) {
    return false;
  }
  return (
    isNativeFormElement(element) ||
    isAnchorWithHref(element) ||
    element.hasAttribute('contenteditable') ||
    hasValidTabIndex(element)
  );
}
function getWindow(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) || window;
}
var FocusTrap = class {
  _element;
  _checker;
  _ngZone;
  _document;
  _injector;
  _startAnchor;
  _endAnchor;
  _hasAttached = false;
  startAnchorListener = () => this.focusLastTabbableElement();
  endAnchorListener = () => this.focusFirstTabbableElement();
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
    if (this._startAnchor && this._endAnchor) {
      this._toggleAnchorTabIndex(value, this._startAnchor);
      this._toggleAnchorTabIndex(value, this._endAnchor);
    }
  }
  _enabled = true;
  constructor(_element, _checker, _ngZone, _document, deferAnchors = false, _injector) {
    this._element = _element;
    this._checker = _checker;
    this._ngZone = _ngZone;
    this._document = _document;
    this._injector = _injector;
    if (!deferAnchors) {
      this.attachAnchors();
    }
  }
  destroy() {
    const startAnchor = this._startAnchor;
    const endAnchor = this._endAnchor;
    if (startAnchor) {
      startAnchor.removeEventListener('focus', this.startAnchorListener);
      startAnchor.remove();
    }
    if (endAnchor) {
      endAnchor.removeEventListener('focus', this.endAnchorListener);
      endAnchor.remove();
    }
    this._startAnchor = this._endAnchor = null;
    this._hasAttached = false;
  }
  attachAnchors() {
    if (this._hasAttached) {
      return true;
    }
    this._ngZone.runOutsideAngular(() => {
      if (!this._startAnchor) {
        this._startAnchor = this._createAnchor();
        this._startAnchor.addEventListener('focus', this.startAnchorListener);
      }
      if (!this._endAnchor) {
        this._endAnchor = this._createAnchor();
        this._endAnchor.addEventListener('focus', this.endAnchorListener);
      }
    });
    if (this._element.parentNode) {
      this._element.parentNode.insertBefore(this._startAnchor, this._element);
      this._element.parentNode.insertBefore(this._endAnchor, this._element.nextSibling);
      this._hasAttached = true;
    }
    return this._hasAttached;
  }
  focusInitialElementWhenReady(options) {
    return new Promise((resolve) => {
      this._executeOnStable(() => resolve(this.focusInitialElement(options)));
    });
  }
  focusFirstTabbableElementWhenReady(options) {
    return new Promise((resolve) => {
      this._executeOnStable(() => resolve(this.focusFirstTabbableElement(options)));
    });
  }
  focusLastTabbableElementWhenReady(options) {
    return new Promise((resolve) => {
      this._executeOnStable(() => resolve(this.focusLastTabbableElement(options)));
    });
  }
  _getRegionBoundary(bound) {
    const markers = this._element.querySelectorAll(
      `[cdk-focus-region-${bound}], [cdkFocusRegion${bound}], [cdk-focus-${bound}]`
    );
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      for (let i = 0; i < markers.length; i++) {
        if (markers[i].hasAttribute(`cdk-focus-${bound}`)) {
          console.warn(
            `Found use of deprecated attribute 'cdk-focus-${bound}', use 'cdkFocusRegion${bound}' instead. The deprecated attribute will be removed in 8.0.0.`,
            markers[i]
          );
        } else if (markers[i].hasAttribute(`cdk-focus-region-${bound}`)) {
          console.warn(
            `Found use of deprecated attribute 'cdk-focus-region-${bound}', use 'cdkFocusRegion${bound}' instead. The deprecated attribute will be removed in 8.0.0.`,
            markers[i]
          );
        }
      }
    }
    if (bound == 'start') {
      return markers.length ? markers[0] : this._getFirstTabbableElement(this._element);
    }
    return markers.length ? markers[markers.length - 1] : this._getLastTabbableElement(this._element);
  }
  focusInitialElement(options) {
    const redirectToElement = this._element.querySelector(`[cdk-focus-initial], [cdkFocusInitial]`);
    if (redirectToElement) {
      if ((typeof ngDevMode === 'undefined' || ngDevMode) && redirectToElement.hasAttribute(`cdk-focus-initial`)) {
        console.warn(
          `Found use of deprecated attribute 'cdk-focus-initial', use 'cdkFocusInitial' instead. The deprecated attribute will be removed in 8.0.0`,
          redirectToElement
        );
      }
      if ((typeof ngDevMode === 'undefined' || ngDevMode) && !this._checker.isFocusable(redirectToElement)) {
        console.warn(`Element matching '[cdkFocusInitial]' is not focusable.`, redirectToElement);
      }
      if (!this._checker.isFocusable(redirectToElement)) {
        const focusableChild = this._getFirstTabbableElement(redirectToElement);
        focusableChild?.focus(options);
        return !!focusableChild;
      }
      redirectToElement.focus(options);
      return true;
    }
    return this.focusFirstTabbableElement(options);
  }
  focusFirstTabbableElement(options) {
    const redirectToElement = this._getRegionBoundary('start');
    if (redirectToElement) {
      redirectToElement.focus(options);
    }
    return !!redirectToElement;
  }
  focusLastTabbableElement(options) {
    const redirectToElement = this._getRegionBoundary('end');
    if (redirectToElement) {
      redirectToElement.focus(options);
    }
    return !!redirectToElement;
  }
  hasAttached() {
    return this._hasAttached;
  }
  _getFirstTabbableElement(root) {
    if (this._checker.isFocusable(root) && this._checker.isTabbable(root)) {
      return root;
    }
    const children = root.children;
    for (let i = 0; i < children.length; i++) {
      const tabbableChild =
        children[i].nodeType === this._document.ELEMENT_NODE ? this._getFirstTabbableElement(children[i]) : null;
      if (tabbableChild) {
        return tabbableChild;
      }
    }
    return null;
  }
  _getLastTabbableElement(root) {
    if (this._checker.isFocusable(root) && this._checker.isTabbable(root)) {
      return root;
    }
    const children = root.children;
    for (let i = children.length - 1; i >= 0; i--) {
      const tabbableChild =
        children[i].nodeType === this._document.ELEMENT_NODE ? this._getLastTabbableElement(children[i]) : null;
      if (tabbableChild) {
        return tabbableChild;
      }
    }
    return null;
  }
  _createAnchor() {
    const anchor = this._document.createElement('div');
    this._toggleAnchorTabIndex(this._enabled, anchor);
    anchor.classList.add('cdk-visually-hidden');
    anchor.classList.add('cdk-focus-trap-anchor');
    anchor.setAttribute('aria-hidden', 'true');
    return anchor;
  }
  _toggleAnchorTabIndex(isEnabled, anchor) {
    isEnabled ? anchor.setAttribute('tabindex', '0') : anchor.removeAttribute('tabindex');
  }
  toggleAnchors(enabled) {
    if (this._startAnchor && this._endAnchor) {
      this._toggleAnchorTabIndex(enabled, this._startAnchor);
      this._toggleAnchorTabIndex(enabled, this._endAnchor);
    }
  }
  _executeOnStable(fn) {
    if (this._injector) {
      afterNextRender(fn, {
        injector: this._injector,
      });
    } else {
      setTimeout(fn);
    }
  }
};
var FocusTrapFactory = class _FocusTrapFactory {
  _checker = inject(InteractivityChecker);
  _ngZone = inject(NgZone);
  _document = inject(DOCUMENT);
  _injector = inject(Injector);
  constructor() {
    inject(_CdkPrivateStyleLoader).load(_VisuallyHiddenLoader);
  }
  create(element, deferCaptureElements = false) {
    return new FocusTrap(element, this._checker, this._ngZone, this._document, deferCaptureElements, this._injector);
  }
  static ɵfac = function FocusTrapFactory_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FocusTrapFactory)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FocusTrapFactory,
    factory: _FocusTrapFactory.ɵfac,
    providedIn: 'root',
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      FocusTrapFactory,
      [
        {
          type: Injectable,
          args: [
            {
              providedIn: 'root',
            },
          ],
        },
      ],
      () => [],
      null
    );
})();
var CdkTrapFocus = class _CdkTrapFocus {
  _elementRef = inject(ElementRef);
  _focusTrapFactory = inject(FocusTrapFactory);
  focusTrap;
  _previouslyFocusedElement = null;
  get enabled() {
    return this.focusTrap?.enabled || false;
  }
  set enabled(value) {
    if (this.focusTrap) {
      this.focusTrap.enabled = value;
    }
  }
  autoCapture;
  constructor() {
    const platform = inject(Platform);
    if (platform.isBrowser) {
      this.focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement, true);
    }
  }
  ngOnDestroy() {
    this.focusTrap?.destroy();
    if (this._previouslyFocusedElement) {
      this._previouslyFocusedElement.focus();
      this._previouslyFocusedElement = null;
    }
  }
  ngAfterContentInit() {
    this.focusTrap?.attachAnchors();
    if (this.autoCapture) {
      this._captureFocus();
    }
  }
  ngDoCheck() {
    if (this.focusTrap && !this.focusTrap.hasAttached()) {
      this.focusTrap.attachAnchors();
    }
  }
  ngOnChanges(changes) {
    const autoCaptureChange = changes['autoCapture'];
    if (autoCaptureChange && !autoCaptureChange.firstChange && this.autoCapture && this.focusTrap?.hasAttached()) {
      this._captureFocus();
    }
  }
  _captureFocus() {
    this._previouslyFocusedElement = _getFocusedElementPierceShadowDom();
    this.focusTrap?.focusInitialElementWhenReady();
  }
  static ɵfac = function CdkTrapFocus_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkTrapFocus)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _CdkTrapFocus,
    selectors: [['', 'cdkTrapFocus', '']],
    inputs: {
      enabled: [2, 'cdkTrapFocus', 'enabled', booleanAttribute],
      autoCapture: [2, 'cdkTrapFocusAutoCapture', 'autoCapture', booleanAttribute],
    },
    exportAs: ['cdkTrapFocus'],
    features: [ɵɵNgOnChangesFeature],
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      CdkTrapFocus,
      [
        {
          type: Directive,
          args: [
            {
              selector: '[cdkTrapFocus]',
              exportAs: 'cdkTrapFocus',
            },
          ],
        },
      ],
      () => [],
      {
        enabled: [
          {
            type: Input,
            args: [
              {
                alias: 'cdkTrapFocus',
                transform: booleanAttribute,
              },
            ],
          },
        ],
        autoCapture: [
          {
            type: Input,
            args: [
              {
                alias: 'cdkTrapFocusAutoCapture',
                transform: booleanAttribute,
              },
            ],
          },
        ],
      }
    );
})();
var LIVE_ANNOUNCER_ELEMENT_TOKEN = new InjectionToken('liveAnnouncerElement', {
  providedIn: 'root',
  factory: () => null,
});
var LIVE_ANNOUNCER_DEFAULT_OPTIONS = new InjectionToken('LIVE_ANNOUNCER_DEFAULT_OPTIONS');
var uniqueIds = 0;
var LiveAnnouncer = class _LiveAnnouncer {
  _ngZone = inject(NgZone);
  _defaultOptions = inject(LIVE_ANNOUNCER_DEFAULT_OPTIONS, {
    optional: true,
  });
  _liveElement;
  _document = inject(DOCUMENT);
  _previousTimeout;
  _currentPromise;
  _currentResolve;
  constructor() {
    const elementToken = inject(LIVE_ANNOUNCER_ELEMENT_TOKEN, {
      optional: true,
    });
    this._liveElement = elementToken || this._createLiveElement();
  }
  announce(message, ...args) {
    const defaultOptions = this._defaultOptions;
    let politeness;
    let duration;
    if (args.length === 1 && typeof args[0] === 'number') {
      duration = args[0];
    } else {
      [politeness, duration] = args;
    }
    this.clear();
    clearTimeout(this._previousTimeout);
    if (!politeness) {
      politeness = defaultOptions && defaultOptions.politeness ? defaultOptions.politeness : 'polite';
    }
    if (duration == null && defaultOptions) {
      duration = defaultOptions.duration;
    }
    this._liveElement.setAttribute('aria-live', politeness);
    if (this._liveElement.id) {
      this._exposeAnnouncerToModals(this._liveElement.id);
    }
    return this._ngZone.runOutsideAngular(() => {
      if (!this._currentPromise) {
        this._currentPromise = new Promise((resolve) => (this._currentResolve = resolve));
      }
      clearTimeout(this._previousTimeout);
      this._previousTimeout = setTimeout(() => {
        this._liveElement.textContent = message;
        if (typeof duration === 'number') {
          this._previousTimeout = setTimeout(() => this.clear(), duration);
        }
        this._currentResolve?.();
        this._currentPromise = this._currentResolve = void 0;
      }, 100);
      return this._currentPromise;
    });
  }
  clear() {
    if (this._liveElement) {
      this._liveElement.textContent = '';
    }
  }
  ngOnDestroy() {
    clearTimeout(this._previousTimeout);
    this._liveElement?.remove();
    this._liveElement = null;
    this._currentResolve?.();
    this._currentPromise = this._currentResolve = void 0;
  }
  _createLiveElement() {
    const elementClass = 'cdk-live-announcer-element';
    const previousElements = this._document.getElementsByClassName(elementClass);
    const liveEl = this._document.createElement('div');
    for (let i = 0; i < previousElements.length; i++) {
      previousElements[i].remove();
    }
    liveEl.classList.add(elementClass);
    liveEl.classList.add('cdk-visually-hidden');
    liveEl.setAttribute('aria-atomic', 'true');
    liveEl.setAttribute('aria-live', 'polite');
    liveEl.id = `cdk-live-announcer-${uniqueIds++}`;
    this._document.body.appendChild(liveEl);
    return liveEl;
  }
  _exposeAnnouncerToModals(id) {
    const modals = this._document.querySelectorAll('body > .cdk-overlay-container [aria-modal="true"]');
    for (let i = 0; i < modals.length; i++) {
      const modal = modals[i];
      const ariaOwns = modal.getAttribute('aria-owns');
      if (!ariaOwns) {
        modal.setAttribute('aria-owns', id);
      } else if (ariaOwns.indexOf(id) === -1) {
        modal.setAttribute('aria-owns', ariaOwns + ' ' + id);
      }
    }
  }
  static ɵfac = function LiveAnnouncer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LiveAnnouncer)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _LiveAnnouncer,
    factory: _LiveAnnouncer.ɵfac,
    providedIn: 'root',
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      LiveAnnouncer,
      [
        {
          type: Injectable,
          args: [
            {
              providedIn: 'root',
            },
          ],
        },
      ],
      () => [],
      null
    );
})();
var CdkAriaLive = class _CdkAriaLive {
  _elementRef = inject(ElementRef);
  _liveAnnouncer = inject(LiveAnnouncer);
  _contentObserver = inject(ContentObserver);
  _ngZone = inject(NgZone);
  get politeness() {
    return this._politeness;
  }
  set politeness(value) {
    this._politeness = value === 'off' || value === 'assertive' ? value : 'polite';
    if (this._politeness === 'off') {
      if (this._subscription) {
        this._subscription.unsubscribe();
        this._subscription = null;
      }
    } else if (!this._subscription) {
      this._subscription = this._ngZone.runOutsideAngular(() => {
        return this._contentObserver.observe(this._elementRef).subscribe(() => {
          const elementText = this._elementRef.nativeElement.textContent;
          if (elementText !== this._previousAnnouncedText) {
            this._liveAnnouncer.announce(elementText, this._politeness, this.duration);
            this._previousAnnouncedText = elementText;
          }
        });
      });
    }
  }
  _politeness = 'polite';
  duration;
  _previousAnnouncedText;
  _subscription;
  constructor() {
    inject(_CdkPrivateStyleLoader).load(_VisuallyHiddenLoader);
  }
  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
  static ɵfac = function CdkAriaLive_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkAriaLive)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _CdkAriaLive,
    selectors: [['', 'cdkAriaLive', '']],
    inputs: {
      politeness: [0, 'cdkAriaLive', 'politeness'],
      duration: [0, 'cdkAriaLiveDuration', 'duration'],
    },
    exportAs: ['cdkAriaLive'],
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      CdkAriaLive,
      [
        {
          type: Directive,
          args: [
            {
              selector: '[cdkAriaLive]',
              exportAs: 'cdkAriaLive',
            },
          ],
        },
      ],
      () => [],
      {
        politeness: [
          {
            type: Input,
            args: ['cdkAriaLive'],
          },
        ],
        duration: [
          {
            type: Input,
            args: ['cdkAriaLiveDuration'],
          },
        ],
      }
    );
})();
var HighContrastMode;
(function (HighContrastMode2) {
  HighContrastMode2[(HighContrastMode2['NONE'] = 0)] = 'NONE';
  HighContrastMode2[(HighContrastMode2['BLACK_ON_WHITE'] = 1)] = 'BLACK_ON_WHITE';
  HighContrastMode2[(HighContrastMode2['WHITE_ON_BLACK'] = 2)] = 'WHITE_ON_BLACK';
})(HighContrastMode || (HighContrastMode = {}));
var BLACK_ON_WHITE_CSS_CLASS = 'cdk-high-contrast-black-on-white';
var WHITE_ON_BLACK_CSS_CLASS = 'cdk-high-contrast-white-on-black';
var HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS = 'cdk-high-contrast-active';
var HighContrastModeDetector = class _HighContrastModeDetector {
  _platform = inject(Platform);
  _hasCheckedHighContrastMode;
  _document = inject(DOCUMENT);
  _breakpointSubscription;
  constructor() {
    this._breakpointSubscription = inject(BreakpointObserver)
      .observe('(forced-colors: active)')
      .subscribe(() => {
        if (this._hasCheckedHighContrastMode) {
          this._hasCheckedHighContrastMode = false;
          this._applyBodyHighContrastModeCssClasses();
        }
      });
  }
  getHighContrastMode() {
    if (!this._platform.isBrowser) {
      return HighContrastMode.NONE;
    }
    const testElement = this._document.createElement('div');
    testElement.style.backgroundColor = 'rgb(1,2,3)';
    testElement.style.position = 'absolute';
    this._document.body.appendChild(testElement);
    const documentWindow = this._document.defaultView || window;
    const computedStyle =
      documentWindow && documentWindow.getComputedStyle ? documentWindow.getComputedStyle(testElement) : null;
    const computedColor = ((computedStyle && computedStyle.backgroundColor) || '').replace(/ /g, '');
    testElement.remove();
    switch (computedColor) {
      case 'rgb(0,0,0)':
      case 'rgb(45,50,54)':
      case 'rgb(32,32,32)':
        return HighContrastMode.WHITE_ON_BLACK;
      case 'rgb(255,255,255)':
      case 'rgb(255,250,239)':
        return HighContrastMode.BLACK_ON_WHITE;
    }
    return HighContrastMode.NONE;
  }
  ngOnDestroy() {
    this._breakpointSubscription.unsubscribe();
  }
  _applyBodyHighContrastModeCssClasses() {
    if (!this._hasCheckedHighContrastMode && this._platform.isBrowser && this._document.body) {
      const bodyClasses = this._document.body.classList;
      bodyClasses.remove(HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS, BLACK_ON_WHITE_CSS_CLASS, WHITE_ON_BLACK_CSS_CLASS);
      this._hasCheckedHighContrastMode = true;
      const mode = this.getHighContrastMode();
      if (mode === HighContrastMode.BLACK_ON_WHITE) {
        bodyClasses.add(HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS, BLACK_ON_WHITE_CSS_CLASS);
      } else if (mode === HighContrastMode.WHITE_ON_BLACK) {
        bodyClasses.add(HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS, WHITE_ON_BLACK_CSS_CLASS);
      }
    }
  }
  static ɵfac = function HighContrastModeDetector_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HighContrastModeDetector)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _HighContrastModeDetector,
    factory: _HighContrastModeDetector.ɵfac,
    providedIn: 'root',
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      HighContrastModeDetector,
      [
        {
          type: Injectable,
          args: [
            {
              providedIn: 'root',
            },
          ],
        },
      ],
      () => [],
      null
    );
})();
var A11yModule = class _A11yModule {
  constructor() {
    inject(HighContrastModeDetector)._applyBodyHighContrastModeCssClasses();
  }
  static ɵfac = function A11yModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _A11yModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _A11yModule,
    imports: [ObserversModule, CdkAriaLive, CdkTrapFocus, CdkMonitorFocus],
    exports: [CdkAriaLive, CdkTrapFocus, CdkMonitorFocus],
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [ObserversModule],
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      A11yModule,
      [
        {
          type: NgModule,
          args: [
            {
              imports: [ObserversModule, CdkAriaLive, CdkTrapFocus, CdkMonitorFocus],
              exports: [CdkAriaLive, CdkTrapFocus, CdkMonitorFocus],
            },
          ],
        },
      ],
      () => [],
      null
    );
})();

// node_modules/@angular/cdk/fesm2022/coercion-private.mjs
function coerceObservable(data) {
  if (!isObservable(data)) {
    return of(data);
  }
  return data;
}

// node_modules/@angular/cdk/fesm2022/_tree-key-manager-chunk.mjs
var TreeKeyManager = class {
  _activeItemIndex = -1;
  _activeItem = null;
  _shouldActivationFollowFocus = false;
  _horizontalOrientation = 'ltr';
  _skipPredicateFn = (_item) => false;
  _trackByFn = (item) => item;
  _items = [];
  _typeahead;
  _typeaheadSubscription = Subscription.EMPTY;
  _hasInitialFocused = false;
  _initializeFocus() {
    if (this._hasInitialFocused || this._items.length === 0) {
      return;
    }
    let activeIndex = 0;
    for (let i = 0; i < this._items.length; i++) {
      if (!this._skipPredicateFn(this._items[i]) && !this._isItemDisabled(this._items[i])) {
        activeIndex = i;
        break;
      }
    }
    const activeItem = this._items[activeIndex];
    if (activeItem.makeFocusable) {
      this._activeItem?.unfocus();
      this._activeItemIndex = activeIndex;
      this._activeItem = activeItem;
      this._typeahead?.setCurrentSelectedItemIndex(activeIndex);
      activeItem.makeFocusable();
    } else {
      this.focusItem(activeIndex);
    }
    this._hasInitialFocused = true;
  }
  constructor(items, config) {
    if (items instanceof QueryList) {
      this._items = items.toArray();
      items.changes.subscribe((newItems) => {
        this._items = newItems.toArray();
        this._typeahead?.setItems(this._items);
        this._updateActiveItemIndex(this._items);
        this._initializeFocus();
      });
    } else if (isObservable(items)) {
      items.subscribe((newItems) => {
        this._items = newItems;
        this._typeahead?.setItems(newItems);
        this._updateActiveItemIndex(newItems);
        this._initializeFocus();
      });
    } else {
      this._items = items;
      this._initializeFocus();
    }
    if (typeof config.shouldActivationFollowFocus === 'boolean') {
      this._shouldActivationFollowFocus = config.shouldActivationFollowFocus;
    }
    if (config.horizontalOrientation) {
      this._horizontalOrientation = config.horizontalOrientation;
    }
    if (config.skipPredicate) {
      this._skipPredicateFn = config.skipPredicate;
    }
    if (config.trackBy) {
      this._trackByFn = config.trackBy;
    }
    if (typeof config.typeAheadDebounceInterval !== 'undefined') {
      this._setTypeAhead(config.typeAheadDebounceInterval);
    }
  }
  change = new Subject();
  destroy() {
    this._typeaheadSubscription.unsubscribe();
    this._typeahead?.destroy();
    this.change.complete();
  }
  onKeydown(event) {
    const key = event.key;
    switch (key) {
      case 'Tab':
        return;
      case 'ArrowDown':
        this._focusNextItem();
        break;
      case 'ArrowUp':
        this._focusPreviousItem();
        break;
      case 'ArrowRight':
        this._horizontalOrientation === 'rtl' ? this._collapseCurrentItem() : this._expandCurrentItem();
        break;
      case 'ArrowLeft':
        this._horizontalOrientation === 'rtl' ? this._expandCurrentItem() : this._collapseCurrentItem();
        break;
      case 'Home':
        this._focusFirstItem();
        break;
      case 'End':
        this._focusLastItem();
        break;
      case 'Enter':
      case ' ':
        this._activateCurrentItem();
        break;
      default:
        if (event.key === '*') {
          this._expandAllItemsAtCurrentItemLevel();
          break;
        }
        this._typeahead?.handleKey(event);
        return;
    }
    this._typeahead?.reset();
    event.preventDefault();
  }
  getActiveItemIndex() {
    return this._activeItemIndex;
  }
  getActiveItem() {
    return this._activeItem;
  }
  _focusFirstItem() {
    this.focusItem(this._findNextAvailableItemIndex(-1));
  }
  _focusLastItem() {
    this.focusItem(this._findPreviousAvailableItemIndex(this._items.length));
  }
  _focusNextItem() {
    this.focusItem(this._findNextAvailableItemIndex(this._activeItemIndex));
  }
  _focusPreviousItem() {
    this.focusItem(this._findPreviousAvailableItemIndex(this._activeItemIndex));
  }
  focusItem(itemOrIndex, options = {}) {
    options.emitChangeEvent ??= true;
    let index =
      typeof itemOrIndex === 'number'
        ? itemOrIndex
        : this._items.findIndex((item) => this._trackByFn(item) === this._trackByFn(itemOrIndex));
    if (index < 0 || index >= this._items.length) {
      return;
    }
    const activeItem = this._items[index];
    if (this._activeItem !== null && this._trackByFn(activeItem) === this._trackByFn(this._activeItem)) {
      return;
    }
    const previousActiveItem = this._activeItem;
    this._activeItem = activeItem ?? null;
    this._activeItemIndex = index;
    this._typeahead?.setCurrentSelectedItemIndex(index);
    this._activeItem?.focus();
    previousActiveItem?.unfocus();
    if (options.emitChangeEvent) {
      this.change.next(this._activeItem);
    }
    if (this._shouldActivationFollowFocus) {
      this._activateCurrentItem();
    }
  }
  _updateActiveItemIndex(newItems) {
    const activeItem = this._activeItem;
    if (!activeItem) {
      return;
    }
    const newIndex = newItems.findIndex((item) => this._trackByFn(item) === this._trackByFn(activeItem));
    if (newIndex > -1 && newIndex !== this._activeItemIndex) {
      this._activeItemIndex = newIndex;
      this._typeahead?.setCurrentSelectedItemIndex(newIndex);
    }
  }
  _setTypeAhead(debounceInterval) {
    this._typeahead = new Typeahead(this._items, {
      debounceInterval: typeof debounceInterval === 'number' ? debounceInterval : void 0,
      skipPredicate: (item) => this._skipPredicateFn(item),
    });
    this._typeaheadSubscription = this._typeahead.selectedItem.subscribe((item) => {
      this.focusItem(item);
    });
  }
  _findNextAvailableItemIndex(startingIndex) {
    for (let i = startingIndex + 1; i < this._items.length; i++) {
      if (!this._skipPredicateFn(this._items[i])) {
        return i;
      }
    }
    return startingIndex;
  }
  _findPreviousAvailableItemIndex(startingIndex) {
    for (let i = startingIndex - 1; i >= 0; i--) {
      if (!this._skipPredicateFn(this._items[i])) {
        return i;
      }
    }
    return startingIndex;
  }
  _collapseCurrentItem() {
    if (!this._activeItem) {
      return;
    }
    if (this._isCurrentItemExpanded()) {
      this._activeItem.collapse();
    } else {
      const parent = this._activeItem.getParent();
      if (!parent || this._skipPredicateFn(parent)) {
        return;
      }
      this.focusItem(parent);
    }
  }
  _expandCurrentItem() {
    if (!this._activeItem) {
      return;
    }
    if (!this._isCurrentItemExpanded()) {
      this._activeItem.expand();
    } else {
      coerceObservable(this._activeItem.getChildren())
        .pipe(take(1))
        .subscribe((children) => {
          const firstChild = children.find((child) => !this._skipPredicateFn(child));
          if (!firstChild) {
            return;
          }
          this.focusItem(firstChild);
        });
    }
  }
  _isCurrentItemExpanded() {
    if (!this._activeItem) {
      return false;
    }
    return typeof this._activeItem.isExpanded === 'boolean'
      ? this._activeItem.isExpanded
      : this._activeItem.isExpanded();
  }
  _isItemDisabled(item) {
    return typeof item.isDisabled === 'boolean' ? item.isDisabled : item.isDisabled?.();
  }
  _expandAllItemsAtCurrentItemLevel() {
    if (!this._activeItem) {
      return;
    }
    const parent = this._activeItem.getParent();
    let itemsToExpand;
    if (!parent) {
      itemsToExpand = of(this._items.filter((item) => item.getParent() === null));
    } else {
      itemsToExpand = coerceObservable(parent.getChildren());
    }
    itemsToExpand.pipe(take(1)).subscribe((items) => {
      for (const item of items) {
        item.expand();
      }
    });
  }
  _activateCurrentItem() {
    this._activeItem?.activate();
  }
};
var TREE_KEY_MANAGER = new InjectionToken('tree-key-manager', {
  providedIn: 'root',
  factory: () => (items, options) => new TreeKeyManager(items, options),
});

// node_modules/@angular/cdk/fesm2022/a11y.mjs
var ID_DELIMITER = ' ';
function addAriaReferencedId(el, attr, id) {
  const ids = getAriaReferenceIds(el, attr);
  id = id.trim();
  if (ids.some((existingId) => existingId.trim() === id)) {
    return;
  }
  ids.push(id);
  el.setAttribute(attr, ids.join(ID_DELIMITER));
}
function removeAriaReferencedId(el, attr, id) {
  const ids = getAriaReferenceIds(el, attr);
  id = id.trim();
  const filteredIds = ids.filter((val) => val !== id);
  if (filteredIds.length) {
    el.setAttribute(attr, filteredIds.join(ID_DELIMITER));
  } else {
    el.removeAttribute(attr);
  }
}
function getAriaReferenceIds(el, attr) {
  const attrValue = el.getAttribute(attr);
  return attrValue?.match(/\S+/g) ?? [];
}
var CDK_DESCRIBEDBY_ID_PREFIX = 'cdk-describedby-message';
var CDK_DESCRIBEDBY_HOST_ATTRIBUTE = 'cdk-describedby-host';
var nextId = 0;
var AriaDescriber = class _AriaDescriber {
  _platform = inject(Platform);
  _document = inject(DOCUMENT);
  _messageRegistry = /* @__PURE__ */ new Map();
  _messagesContainer = null;
  _id = `${nextId++}`;
  constructor() {
    inject(_CdkPrivateStyleLoader).load(_VisuallyHiddenLoader);
    this._id = inject(APP_ID) + '-' + nextId++;
  }
  describe(hostElement, message, role) {
    if (!this._canBeDescribed(hostElement, message)) {
      return;
    }
    const key = getKey(message, role);
    if (typeof message !== 'string') {
      setMessageId(message, this._id);
      this._messageRegistry.set(key, {
        messageElement: message,
        referenceCount: 0,
      });
    } else if (!this._messageRegistry.has(key)) {
      this._createMessageElement(message, role);
    }
    if (!this._isElementDescribedByMessage(hostElement, key)) {
      this._addMessageReference(hostElement, key);
    }
  }
  removeDescription(hostElement, message, role) {
    if (!message || !this._isElementNode(hostElement)) {
      return;
    }
    const key = getKey(message, role);
    if (this._isElementDescribedByMessage(hostElement, key)) {
      this._removeMessageReference(hostElement, key);
    }
    if (typeof message === 'string') {
      const registeredMessage = this._messageRegistry.get(key);
      if (registeredMessage && registeredMessage.referenceCount === 0) {
        this._deleteMessageElement(key);
      }
    }
    if (this._messagesContainer?.childNodes.length === 0) {
      this._messagesContainer.remove();
      this._messagesContainer = null;
    }
  }
  ngOnDestroy() {
    const describedElements = this._document.querySelectorAll(`[${CDK_DESCRIBEDBY_HOST_ATTRIBUTE}="${this._id}"]`);
    for (let i = 0; i < describedElements.length; i++) {
      this._removeCdkDescribedByReferenceIds(describedElements[i]);
      describedElements[i].removeAttribute(CDK_DESCRIBEDBY_HOST_ATTRIBUTE);
    }
    this._messagesContainer?.remove();
    this._messagesContainer = null;
    this._messageRegistry.clear();
  }
  _createMessageElement(message, role) {
    const messageElement = this._document.createElement('div');
    setMessageId(messageElement, this._id);
    messageElement.textContent = message;
    if (role) {
      messageElement.setAttribute('role', role);
    }
    this._createMessagesContainer();
    this._messagesContainer.appendChild(messageElement);
    this._messageRegistry.set(getKey(message, role), {
      messageElement,
      referenceCount: 0,
    });
  }
  _deleteMessageElement(key) {
    this._messageRegistry.get(key)?.messageElement?.remove();
    this._messageRegistry.delete(key);
  }
  _createMessagesContainer() {
    if (this._messagesContainer) {
      return;
    }
    const containerClassName = 'cdk-describedby-message-container';
    const serverContainers = this._document.querySelectorAll(`.${containerClassName}[platform="server"]`);
    for (let i = 0; i < serverContainers.length; i++) {
      serverContainers[i].remove();
    }
    const messagesContainer = this._document.createElement('div');
    messagesContainer.style.visibility = 'hidden';
    messagesContainer.classList.add(containerClassName);
    messagesContainer.classList.add('cdk-visually-hidden');
    if (!this._platform.isBrowser) {
      messagesContainer.setAttribute('platform', 'server');
    }
    this._document.body.appendChild(messagesContainer);
    this._messagesContainer = messagesContainer;
  }
  _removeCdkDescribedByReferenceIds(element) {
    const originalReferenceIds = getAriaReferenceIds(element, 'aria-describedby').filter(
      (id) => id.indexOf(CDK_DESCRIBEDBY_ID_PREFIX) != 0
    );
    element.setAttribute('aria-describedby', originalReferenceIds.join(' '));
  }
  _addMessageReference(element, key) {
    const registeredMessage = this._messageRegistry.get(key);
    addAriaReferencedId(element, 'aria-describedby', registeredMessage.messageElement.id);
    element.setAttribute(CDK_DESCRIBEDBY_HOST_ATTRIBUTE, this._id);
    registeredMessage.referenceCount++;
  }
  _removeMessageReference(element, key) {
    const registeredMessage = this._messageRegistry.get(key);
    registeredMessage.referenceCount--;
    removeAriaReferencedId(element, 'aria-describedby', registeredMessage.messageElement.id);
    element.removeAttribute(CDK_DESCRIBEDBY_HOST_ATTRIBUTE);
  }
  _isElementDescribedByMessage(element, key) {
    const referenceIds = getAriaReferenceIds(element, 'aria-describedby');
    const registeredMessage = this._messageRegistry.get(key);
    const messageId = registeredMessage && registeredMessage.messageElement.id;
    return !!messageId && referenceIds.indexOf(messageId) != -1;
  }
  _canBeDescribed(element, message) {
    if (!this._isElementNode(element)) {
      return false;
    }
    if (message && typeof message === 'object') {
      return true;
    }
    const trimmedMessage = message == null ? '' : `${message}`.trim();
    const ariaLabel = element.getAttribute('aria-label');
    return trimmedMessage ? !ariaLabel || ariaLabel.trim() !== trimmedMessage : false;
  }
  _isElementNode(element) {
    return element.nodeType === this._document.ELEMENT_NODE;
  }
  static ɵfac = function AriaDescriber_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AriaDescriber)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _AriaDescriber,
    factory: _AriaDescriber.ɵfac,
    providedIn: 'root',
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      AriaDescriber,
      [
        {
          type: Injectable,
          args: [
            {
              providedIn: 'root',
            },
          ],
        },
      ],
      () => [],
      null
    );
})();
function getKey(message, role) {
  return typeof message === 'string' ? `${role || ''}/${message}` : message;
}
function setMessageId(element, serviceId) {
  if (!element.id) {
    element.id = `${CDK_DESCRIBEDBY_ID_PREFIX}-${serviceId}-${nextId++}`;
  }
}
var ConfigurableFocusTrap = class extends FocusTrap {
  _focusTrapManager;
  _inertStrategy;
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
    if (this._enabled) {
      this._focusTrapManager.register(this);
    } else {
      this._focusTrapManager.deregister(this);
    }
  }
  constructor(_element, _checker, _ngZone, _document, _focusTrapManager, _inertStrategy, config, injector) {
    super(_element, _checker, _ngZone, _document, config.defer, injector);
    this._focusTrapManager = _focusTrapManager;
    this._inertStrategy = _inertStrategy;
    this._focusTrapManager.register(this);
  }
  destroy() {
    this._focusTrapManager.deregister(this);
    super.destroy();
  }
  _enable() {
    this._inertStrategy.preventFocus(this);
    this.toggleAnchors(true);
  }
  _disable() {
    this._inertStrategy.allowFocus(this);
    this.toggleAnchors(false);
  }
};
var EventListenerFocusTrapInertStrategy = class {
  _listener = null;
  preventFocus(focusTrap) {
    if (this._listener) {
      focusTrap._document.removeEventListener('focus', this._listener, true);
    }
    this._listener = (e) => this._trapFocus(focusTrap, e);
    focusTrap._ngZone.runOutsideAngular(() => {
      focusTrap._document.addEventListener('focus', this._listener, true);
    });
  }
  allowFocus(focusTrap) {
    if (!this._listener) {
      return;
    }
    focusTrap._document.removeEventListener('focus', this._listener, true);
    this._listener = null;
  }
  _trapFocus(focusTrap, event) {
    const target = event.target;
    const focusTrapRoot = focusTrap._element;
    if (target && !focusTrapRoot.contains(target) && !target.closest?.('div.cdk-overlay-pane')) {
      setTimeout(() => {
        if (focusTrap.enabled && !focusTrapRoot.contains(focusTrap._document.activeElement)) {
          focusTrap.focusFirstTabbableElement();
        }
      });
    }
  }
};
var FOCUS_TRAP_INERT_STRATEGY = new InjectionToken('FOCUS_TRAP_INERT_STRATEGY');
var FocusTrapManager = class _FocusTrapManager {
  _focusTrapStack = [];
  register(focusTrap) {
    this._focusTrapStack = this._focusTrapStack.filter((ft) => ft !== focusTrap);
    let stack = this._focusTrapStack;
    if (stack.length) {
      stack[stack.length - 1]._disable();
    }
    stack.push(focusTrap);
    focusTrap._enable();
  }
  deregister(focusTrap) {
    focusTrap._disable();
    const stack = this._focusTrapStack;
    const i = stack.indexOf(focusTrap);
    if (i !== -1) {
      stack.splice(i, 1);
      if (stack.length) {
        stack[stack.length - 1]._enable();
      }
    }
  }
  static ɵfac = function FocusTrapManager_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FocusTrapManager)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FocusTrapManager,
    factory: _FocusTrapManager.ɵfac,
    providedIn: 'root',
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      FocusTrapManager,
      [
        {
          type: Injectable,
          args: [
            {
              providedIn: 'root',
            },
          ],
        },
      ],
      null,
      null
    );
})();
var ConfigurableFocusTrapFactory = class _ConfigurableFocusTrapFactory {
  _checker = inject(InteractivityChecker);
  _ngZone = inject(NgZone);
  _focusTrapManager = inject(FocusTrapManager);
  _document = inject(DOCUMENT);
  _inertStrategy;
  _injector = inject(Injector);
  constructor() {
    const inertStrategy = inject(FOCUS_TRAP_INERT_STRATEGY, {
      optional: true,
    });
    this._inertStrategy = inertStrategy || new EventListenerFocusTrapInertStrategy();
  }
  create(
    element,
    config = {
      defer: false,
    }
  ) {
    let configObject;
    if (typeof config === 'boolean') {
      configObject = {
        defer: config,
      };
    } else {
      configObject = config;
    }
    return new ConfigurableFocusTrap(
      element,
      this._checker,
      this._ngZone,
      this._document,
      this._focusTrapManager,
      this._inertStrategy,
      configObject,
      this._injector
    );
  }
  static ɵfac = function ConfigurableFocusTrapFactory_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ConfigurableFocusTrapFactory)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ConfigurableFocusTrapFactory,
    factory: _ConfigurableFocusTrapFactory.ɵfac,
    providedIn: 'root',
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      ConfigurableFocusTrapFactory,
      [
        {
          type: Injectable,
          args: [
            {
              providedIn: 'root',
            },
          ],
        },
      ],
      () => [],
      null
    );
})();

// node_modules/@angular/cdk/fesm2022/platform.mjs
var PlatformModule = class _PlatformModule {
  static ɵfac = function PlatformModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PlatformModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _PlatformModule,
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      PlatformModule,
      [
        {
          type: NgModule,
          args: [{}],
        },
      ],
      null,
      null
    );
})();

// node_modules/@angular/cdk/fesm2022/layout.mjs
var LayoutModule = class _LayoutModule {
  static ɵfac = function LayoutModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LayoutModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _LayoutModule,
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      LayoutModule,
      [
        {
          type: NgModule,
          args: [{}],
        },
      ],
      null,
      null
    );
})();

// node_modules/@angular/material/fesm2022/_animation-chunk.mjs
var MATERIAL_ANIMATIONS = new InjectionToken('MATERIAL_ANIMATIONS');
var reducedMotion = null;
function _getAnimationsState() {
  if (
    inject(MATERIAL_ANIMATIONS, {
      optional: true,
    })?.animationsDisabled ||
    inject(ANIMATION_MODULE_TYPE, {
      optional: true,
    }) === 'NoopAnimations'
  ) {
    return 'di-disabled';
  }
  reducedMotion ??= inject(MediaMatcher).matchMedia('(prefers-reduced-motion)').matches;
  return reducedMotion ? 'reduced-motion' : 'enabled';
}
function _animationsDisabled() {
  return _getAnimationsState() !== 'enabled';
}

// node_modules/@angular/cdk/fesm2022/coercion.mjs
function coerceBooleanProperty(value) {
  return value != null && `${value}` !== 'false';
}

// node_modules/@angular/material/fesm2022/_ripple-chunk.mjs
var RippleState;
(function (RippleState2) {
  RippleState2[(RippleState2['FADING_IN'] = 0)] = 'FADING_IN';
  RippleState2[(RippleState2['VISIBLE'] = 1)] = 'VISIBLE';
  RippleState2[(RippleState2['FADING_OUT'] = 2)] = 'FADING_OUT';
  RippleState2[(RippleState2['HIDDEN'] = 3)] = 'HIDDEN';
})(RippleState || (RippleState = {}));
var RippleRef = class {
  _renderer;
  element;
  config;
  _animationForciblyDisabledThroughCss;
  state = RippleState.HIDDEN;
  constructor(_renderer, element, config, _animationForciblyDisabledThroughCss = false) {
    this._renderer = _renderer;
    this.element = element;
    this.config = config;
    this._animationForciblyDisabledThroughCss = _animationForciblyDisabledThroughCss;
  }
  fadeOut() {
    this._renderer.fadeOutRipple(this);
  }
};
var passiveCapturingEventOptions$1 = normalizePassiveListenerOptions({
  passive: true,
  capture: true,
});
var RippleEventManager = class {
  _events = /* @__PURE__ */ new Map();
  addHandler(ngZone, name, element, handler) {
    const handlersForEvent = this._events.get(name);
    if (handlersForEvent) {
      const handlersForElement = handlersForEvent.get(element);
      if (handlersForElement) {
        handlersForElement.add(handler);
      } else {
        handlersForEvent.set(element, /* @__PURE__ */ new Set([handler]));
      }
    } else {
      this._events.set(name, /* @__PURE__ */ new Map([[element, /* @__PURE__ */ new Set([handler])]]));
      ngZone.runOutsideAngular(() => {
        document.addEventListener(name, this._delegateEventHandler, passiveCapturingEventOptions$1);
      });
    }
  }
  removeHandler(name, element, handler) {
    const handlersForEvent = this._events.get(name);
    if (!handlersForEvent) {
      return;
    }
    const handlersForElement = handlersForEvent.get(element);
    if (!handlersForElement) {
      return;
    }
    handlersForElement.delete(handler);
    if (handlersForElement.size === 0) {
      handlersForEvent.delete(element);
    }
    if (handlersForEvent.size === 0) {
      this._events.delete(name);
      document.removeEventListener(name, this._delegateEventHandler, passiveCapturingEventOptions$1);
    }
  }
  _delegateEventHandler = (event) => {
    const target = _getEventTarget(event);
    if (target) {
      this._events.get(event.type)?.forEach((handlers, element) => {
        if (element === target || element.contains(target)) {
          handlers.forEach((handler) => handler.handleEvent(event));
        }
      });
    }
  };
};
var defaultRippleAnimationConfig = {
  enterDuration: 225,
  exitDuration: 150,
};
var ignoreMouseEventsTimeout = 800;
var passiveCapturingEventOptions = normalizePassiveListenerOptions({
  passive: true,
  capture: true,
});
var pointerDownEvents = ['mousedown', 'touchstart'];
var pointerUpEvents = ['mouseup', 'mouseleave', 'touchend', 'touchcancel'];
var _MatRippleStylesLoader = class __MatRippleStylesLoader {
  static ɵfac = function _MatRippleStylesLoader_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || __MatRippleStylesLoader)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: __MatRippleStylesLoader,
    selectors: [['ng-component']],
    hostAttrs: ['mat-ripple-style-loader', ''],
    decls: 0,
    vars: 0,
    template: function _MatRippleStylesLoader_Template(rf, ctx) {},
    styles: [
      '.mat-ripple{overflow:hidden;position:relative}.mat-ripple:not(:empty){transform:translateZ(0)}.mat-ripple.mat-ripple-unbounded{overflow:visible}.mat-ripple-element{position:absolute;border-radius:50%;pointer-events:none;transition:opacity,transform 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale3d(0, 0, 0);background-color:var(--mat-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent))}@media(forced-colors: active){.mat-ripple-element{display:none}}.cdk-drag-preview .mat-ripple-element,.cdk-drag-placeholder .mat-ripple-element{display:none}\n',
    ],
    encapsulation: 2,
    changeDetection: 0,
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      _MatRippleStylesLoader,
      [
        {
          type: Component,
          args: [
            {
              template: '',
              changeDetection: ChangeDetectionStrategy.OnPush,
              encapsulation: ViewEncapsulation.None,
              host: {
                'mat-ripple-style-loader': '',
              },
              styles: [
                '.mat-ripple{overflow:hidden;position:relative}.mat-ripple:not(:empty){transform:translateZ(0)}.mat-ripple.mat-ripple-unbounded{overflow:visible}.mat-ripple-element{position:absolute;border-radius:50%;pointer-events:none;transition:opacity,transform 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale3d(0, 0, 0);background-color:var(--mat-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent))}@media(forced-colors: active){.mat-ripple-element{display:none}}.cdk-drag-preview .mat-ripple-element,.cdk-drag-placeholder .mat-ripple-element{display:none}\n',
              ],
            },
          ],
        },
      ],
      null,
      null
    );
})();
var RippleRenderer = class _RippleRenderer {
  _target;
  _ngZone;
  _platform;
  _containerElement;
  _triggerElement;
  _isPointerDown = false;
  _activeRipples = /* @__PURE__ */ new Map();
  _mostRecentTransientRipple;
  _lastTouchStartEvent;
  _pointerUpEventsRegistered = false;
  _containerRect;
  static _eventManager = new RippleEventManager();
  constructor(_target, _ngZone, elementOrElementRef, _platform, injector) {
    this._target = _target;
    this._ngZone = _ngZone;
    this._platform = _platform;
    if (_platform.isBrowser) {
      this._containerElement = coerceElement(elementOrElementRef);
    }
    if (injector) {
      injector.get(_CdkPrivateStyleLoader).load(_MatRippleStylesLoader);
    }
  }
  fadeInRipple(x, y, config = {}) {
    const containerRect = (this._containerRect = this._containerRect || this._containerElement.getBoundingClientRect());
    const animationConfig = __spreadValues(__spreadValues({}, defaultRippleAnimationConfig), config.animation);
    if (config.centered) {
      x = containerRect.left + containerRect.width / 2;
      y = containerRect.top + containerRect.height / 2;
    }
    const radius = config.radius || distanceToFurthestCorner(x, y, containerRect);
    const offsetX = x - containerRect.left;
    const offsetY = y - containerRect.top;
    const enterDuration = animationConfig.enterDuration;
    const ripple = document.createElement('div');
    ripple.classList.add('mat-ripple-element');
    ripple.style.left = `${offsetX - radius}px`;
    ripple.style.top = `${offsetY - radius}px`;
    ripple.style.height = `${radius * 2}px`;
    ripple.style.width = `${radius * 2}px`;
    if (config.color != null) {
      ripple.style.backgroundColor = config.color;
    }
    ripple.style.transitionDuration = `${enterDuration}ms`;
    this._containerElement.appendChild(ripple);
    const computedStyles = window.getComputedStyle(ripple);
    const userTransitionProperty = computedStyles.transitionProperty;
    const userTransitionDuration = computedStyles.transitionDuration;
    const animationForciblyDisabledThroughCss =
      userTransitionProperty === 'none' ||
      userTransitionDuration === '0s' ||
      userTransitionDuration === '0s, 0s' ||
      (containerRect.width === 0 && containerRect.height === 0);
    const rippleRef = new RippleRef(this, ripple, config, animationForciblyDisabledThroughCss);
    ripple.style.transform = 'scale3d(1, 1, 1)';
    rippleRef.state = RippleState.FADING_IN;
    if (!config.persistent) {
      this._mostRecentTransientRipple = rippleRef;
    }
    let eventListeners = null;
    if (!animationForciblyDisabledThroughCss && (enterDuration || animationConfig.exitDuration)) {
      this._ngZone.runOutsideAngular(() => {
        const onTransitionEnd = () => {
          if (eventListeners) {
            eventListeners.fallbackTimer = null;
          }
          clearTimeout(fallbackTimer);
          this._finishRippleTransition(rippleRef);
        };
        const onTransitionCancel = () => this._destroyRipple(rippleRef);
        const fallbackTimer = setTimeout(onTransitionCancel, enterDuration + 100);
        ripple.addEventListener('transitionend', onTransitionEnd);
        ripple.addEventListener('transitioncancel', onTransitionCancel);
        eventListeners = {
          onTransitionEnd,
          onTransitionCancel,
          fallbackTimer,
        };
      });
    }
    this._activeRipples.set(rippleRef, eventListeners);
    if (animationForciblyDisabledThroughCss || !enterDuration) {
      this._finishRippleTransition(rippleRef);
    }
    return rippleRef;
  }
  fadeOutRipple(rippleRef) {
    if (rippleRef.state === RippleState.FADING_OUT || rippleRef.state === RippleState.HIDDEN) {
      return;
    }
    const rippleEl = rippleRef.element;
    const animationConfig = __spreadValues(
      __spreadValues({}, defaultRippleAnimationConfig),
      rippleRef.config.animation
    );
    rippleEl.style.transitionDuration = `${animationConfig.exitDuration}ms`;
    rippleEl.style.opacity = '0';
    rippleRef.state = RippleState.FADING_OUT;
    if (rippleRef._animationForciblyDisabledThroughCss || !animationConfig.exitDuration) {
      this._finishRippleTransition(rippleRef);
    }
  }
  fadeOutAll() {
    this._getActiveRipples().forEach((ripple) => ripple.fadeOut());
  }
  fadeOutAllNonPersistent() {
    this._getActiveRipples().forEach((ripple) => {
      if (!ripple.config.persistent) {
        ripple.fadeOut();
      }
    });
  }
  setupTriggerEvents(elementOrElementRef) {
    const element = coerceElement(elementOrElementRef);
    if (!this._platform.isBrowser || !element || element === this._triggerElement) {
      return;
    }
    this._removeTriggerEvents();
    this._triggerElement = element;
    pointerDownEvents.forEach((type) => {
      _RippleRenderer._eventManager.addHandler(this._ngZone, type, element, this);
    });
  }
  handleEvent(event) {
    if (event.type === 'mousedown') {
      this._onMousedown(event);
    } else if (event.type === 'touchstart') {
      this._onTouchStart(event);
    } else {
      this._onPointerUp();
    }
    if (!this._pointerUpEventsRegistered) {
      this._ngZone.runOutsideAngular(() => {
        pointerUpEvents.forEach((type) => {
          this._triggerElement.addEventListener(type, this, passiveCapturingEventOptions);
        });
      });
      this._pointerUpEventsRegistered = true;
    }
  }
  _finishRippleTransition(rippleRef) {
    if (rippleRef.state === RippleState.FADING_IN) {
      this._startFadeOutTransition(rippleRef);
    } else if (rippleRef.state === RippleState.FADING_OUT) {
      this._destroyRipple(rippleRef);
    }
  }
  _startFadeOutTransition(rippleRef) {
    const isMostRecentTransientRipple = rippleRef === this._mostRecentTransientRipple;
    const { persistent } = rippleRef.config;
    rippleRef.state = RippleState.VISIBLE;
    if (!persistent && (!isMostRecentTransientRipple || !this._isPointerDown)) {
      rippleRef.fadeOut();
    }
  }
  _destroyRipple(rippleRef) {
    const eventListeners = this._activeRipples.get(rippleRef) ?? null;
    this._activeRipples.delete(rippleRef);
    if (!this._activeRipples.size) {
      this._containerRect = null;
    }
    if (rippleRef === this._mostRecentTransientRipple) {
      this._mostRecentTransientRipple = null;
    }
    rippleRef.state = RippleState.HIDDEN;
    if (eventListeners !== null) {
      rippleRef.element.removeEventListener('transitionend', eventListeners.onTransitionEnd);
      rippleRef.element.removeEventListener('transitioncancel', eventListeners.onTransitionCancel);
      if (eventListeners.fallbackTimer !== null) {
        clearTimeout(eventListeners.fallbackTimer);
      }
    }
    rippleRef.element.remove();
  }
  _onMousedown(event) {
    const isFakeMousedown = isFakeMousedownFromScreenReader(event);
    const isSyntheticEvent =
      this._lastTouchStartEvent && Date.now() < this._lastTouchStartEvent + ignoreMouseEventsTimeout;
    if (!this._target.rippleDisabled && !isFakeMousedown && !isSyntheticEvent) {
      this._isPointerDown = true;
      this.fadeInRipple(event.clientX, event.clientY, this._target.rippleConfig);
    }
  }
  _onTouchStart(event) {
    if (!this._target.rippleDisabled && !isFakeTouchstartFromScreenReader(event)) {
      this._lastTouchStartEvent = Date.now();
      this._isPointerDown = true;
      const touches = event.changedTouches;
      if (touches) {
        for (let i = 0; i < touches.length; i++) {
          this.fadeInRipple(touches[i].clientX, touches[i].clientY, this._target.rippleConfig);
        }
      }
    }
  }
  _onPointerUp() {
    if (!this._isPointerDown) {
      return;
    }
    this._isPointerDown = false;
    this._getActiveRipples().forEach((ripple) => {
      const isVisible =
        ripple.state === RippleState.VISIBLE ||
        (ripple.config.terminateOnPointerUp && ripple.state === RippleState.FADING_IN);
      if (!ripple.config.persistent && isVisible) {
        ripple.fadeOut();
      }
    });
  }
  _getActiveRipples() {
    return Array.from(this._activeRipples.keys());
  }
  _removeTriggerEvents() {
    const trigger = this._triggerElement;
    if (trigger) {
      pointerDownEvents.forEach((type) => _RippleRenderer._eventManager.removeHandler(type, trigger, this));
      if (this._pointerUpEventsRegistered) {
        pointerUpEvents.forEach((type) => trigger.removeEventListener(type, this, passiveCapturingEventOptions));
        this._pointerUpEventsRegistered = false;
      }
    }
  }
};
function distanceToFurthestCorner(x, y, rect) {
  const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
  const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
  return Math.sqrt(distX * distX + distY * distY);
}
var MAT_RIPPLE_GLOBAL_OPTIONS = new InjectionToken('mat-ripple-global-options');
var MatRipple = class _MatRipple {
  _elementRef = inject(ElementRef);
  _animationsDisabled = _animationsDisabled();
  color;
  unbounded;
  centered;
  radius = 0;
  animation;
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    if (value) {
      this.fadeOutAllNonPersistent();
    }
    this._disabled = value;
    this._setupTriggerEventsIfEnabled();
  }
  _disabled = false;
  get trigger() {
    return this._trigger || this._elementRef.nativeElement;
  }
  set trigger(trigger) {
    this._trigger = trigger;
    this._setupTriggerEventsIfEnabled();
  }
  _trigger;
  _rippleRenderer;
  _globalOptions;
  _isInitialized = false;
  constructor() {
    const ngZone = inject(NgZone);
    const platform = inject(Platform);
    const globalOptions = inject(MAT_RIPPLE_GLOBAL_OPTIONS, {
      optional: true,
    });
    const injector = inject(Injector);
    this._globalOptions = globalOptions || {};
    this._rippleRenderer = new RippleRenderer(this, ngZone, this._elementRef, platform, injector);
  }
  ngOnInit() {
    this._isInitialized = true;
    this._setupTriggerEventsIfEnabled();
  }
  ngOnDestroy() {
    this._rippleRenderer._removeTriggerEvents();
  }
  fadeOutAll() {
    this._rippleRenderer.fadeOutAll();
  }
  fadeOutAllNonPersistent() {
    this._rippleRenderer.fadeOutAllNonPersistent();
  }
  get rippleConfig() {
    return {
      centered: this.centered,
      radius: this.radius,
      color: this.color,
      animation: __spreadValues(
        __spreadValues(
          __spreadValues({}, this._globalOptions.animation),
          this._animationsDisabled
            ? {
                enterDuration: 0,
                exitDuration: 0,
              }
            : {}
        ),
        this.animation
      ),
      terminateOnPointerUp: this._globalOptions.terminateOnPointerUp,
    };
  }
  get rippleDisabled() {
    return this.disabled || !!this._globalOptions.disabled;
  }
  _setupTriggerEventsIfEnabled() {
    if (!this.disabled && this._isInitialized) {
      this._rippleRenderer.setupTriggerEvents(this.trigger);
    }
  }
  launch(configOrX, y = 0, config) {
    if (typeof configOrX === 'number') {
      return this._rippleRenderer.fadeInRipple(
        configOrX,
        y,
        __spreadValues(__spreadValues({}, this.rippleConfig), config)
      );
    } else {
      return this._rippleRenderer.fadeInRipple(0, 0, __spreadValues(__spreadValues({}, this.rippleConfig), configOrX));
    }
  }
  static ɵfac = function MatRipple_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatRipple)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _MatRipple,
    selectors: [
      ['', 'mat-ripple', ''],
      ['', 'matRipple', ''],
    ],
    hostAttrs: [1, 'mat-ripple'],
    hostVars: 2,
    hostBindings: function MatRipple_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp('mat-ripple-unbounded', ctx.unbounded);
      }
    },
    inputs: {
      color: [0, 'matRippleColor', 'color'],
      unbounded: [0, 'matRippleUnbounded', 'unbounded'],
      centered: [0, 'matRippleCentered', 'centered'],
      radius: [0, 'matRippleRadius', 'radius'],
      animation: [0, 'matRippleAnimation', 'animation'],
      disabled: [0, 'matRippleDisabled', 'disabled'],
      trigger: [0, 'matRippleTrigger', 'trigger'],
    },
    exportAs: ['matRipple'],
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      MatRipple,
      [
        {
          type: Directive,
          args: [
            {
              selector: '[mat-ripple], [matRipple]',
              exportAs: 'matRipple',
              host: {
                class: 'mat-ripple',
                '[class.mat-ripple-unbounded]': 'unbounded',
              },
            },
          ],
        },
      ],
      () => [],
      {
        color: [
          {
            type: Input,
            args: ['matRippleColor'],
          },
        ],
        unbounded: [
          {
            type: Input,
            args: ['matRippleUnbounded'],
          },
        ],
        centered: [
          {
            type: Input,
            args: ['matRippleCentered'],
          },
        ],
        radius: [
          {
            type: Input,
            args: ['matRippleRadius'],
          },
        ],
        animation: [
          {
            type: Input,
            args: ['matRippleAnimation'],
          },
        ],
        disabled: [
          {
            type: Input,
            args: ['matRippleDisabled'],
          },
        ],
        trigger: [
          {
            type: Input,
            args: ['matRippleTrigger'],
          },
        ],
      }
    );
})();

// node_modules/@angular/material/fesm2022/_structural-styles-chunk.mjs
var _StructuralStylesLoader = class __StructuralStylesLoader {
  static ɵfac = function _StructuralStylesLoader_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || __StructuralStylesLoader)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: __StructuralStylesLoader,
    selectors: [['structural-styles']],
    decls: 0,
    vars: 0,
    template: function _StructuralStylesLoader_Template(rf, ctx) {},
    styles: [
      '.mat-focus-indicator{position:relative}.mat-focus-indicator::before{top:0;left:0;right:0;bottom:0;position:absolute;box-sizing:border-box;pointer-events:none;display:var(--mat-focus-indicator-display, none);border-width:var(--mat-focus-indicator-border-width, 3px);border-style:var(--mat-focus-indicator-border-style, solid);border-color:var(--mat-focus-indicator-border-color, transparent);border-radius:var(--mat-focus-indicator-border-radius, 4px)}.mat-focus-indicator:focus::before{content:""}@media(forced-colors: active){html{--mat-focus-indicator-display: block}}\n',
    ],
    encapsulation: 2,
    changeDetection: 0,
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      _StructuralStylesLoader,
      [
        {
          type: Component,
          args: [
            {
              selector: 'structural-styles',
              encapsulation: ViewEncapsulation.None,
              template: '',
              changeDetection: ChangeDetectionStrategy.OnPush,
              styles: [
                '.mat-focus-indicator{position:relative}.mat-focus-indicator::before{top:0;left:0;right:0;bottom:0;position:absolute;box-sizing:border-box;pointer-events:none;display:var(--mat-focus-indicator-display, none);border-width:var(--mat-focus-indicator-border-width, 3px);border-style:var(--mat-focus-indicator-border-style, solid);border-color:var(--mat-focus-indicator-border-color, transparent);border-radius:var(--mat-focus-indicator-border-radius, 4px)}.mat-focus-indicator:focus::before{content:""}@media(forced-colors: active){html{--mat-focus-indicator-display: block}}\n',
              ],
            },
          ],
        },
      ],
      null,
      null
    );
})();

// node_modules/@angular/material/fesm2022/_ripple-module-chunk.mjs
var MatRippleModule = class _MatRippleModule {
  static ɵfac = function MatRippleModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatRippleModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _MatRippleModule,
    imports: [MatRipple],
    exports: [MatRipple, BidiModule],
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [BidiModule],
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      MatRippleModule,
      [
        {
          type: NgModule,
          args: [
            {
              imports: [MatRipple],
              exports: [MatRipple, BidiModule],
            },
          ],
        },
      ],
      null,
      null
    );
})();

export {
  CdkObserveContent,
  ObserversModule,
  _animationsDisabled,
  coerceBooleanProperty,
  defaultRippleAnimationConfig,
  RippleRenderer,
  MAT_RIPPLE_GLOBAL_OPTIONS,
  _StructuralStylesLoader,
  MatRippleModule,
};
//# sourceMappingURL=chunk-3JNPNYAA.js.map
