
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
this.kokomai = this.kokomai || {};
this.kokomai.github = this.kokomai.github || {};
this.kokomai.github.io = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.48.0 */

    const { Error: Error_1, Object: Object_1, console: console_1$1 } = globals;

    // (251:0) {:else}
    function create_else_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Home.svelte generated by Svelte v3.48.0 */

    const file$5 = "src\\routes\\Home.svelte";

    function create_fragment$5(ctx) {
    	let div100;
    	let h10;
    	let t3;
    	let div4;
    	let div0;
    	let t5;
    	let div1;
    	let t7;
    	let div2;
    	let t9;
    	let div3;
    	let t11;
    	let h11;
    	let t15;
    	let div9;
    	let div5;
    	let t17;
    	let div6;
    	let t19;
    	let div7;
    	let t21;
    	let div8;
    	let t23;
    	let h12;
    	let t27;
    	let div14;
    	let div10;
    	let t29;
    	let div11;
    	let t31;
    	let div12;
    	let t33;
    	let div13;
    	let t35;
    	let h13;
    	let t39;
    	let div19;
    	let div15;
    	let t41;
    	let div16;
    	let t43;
    	let div17;
    	let t45;
    	let div18;
    	let t47;
    	let h14;
    	let t51;
    	let div24;
    	let div20;
    	let t53;
    	let div21;
    	let t55;
    	let div22;
    	let t57;
    	let div23;
    	let t59;
    	let h15;
    	let t63;
    	let div29;
    	let div25;
    	let t65;
    	let div26;
    	let t67;
    	let div27;
    	let t69;
    	let div28;
    	let t71;
    	let h16;
    	let t75;
    	let div34;
    	let div30;
    	let t77;
    	let div31;
    	let t79;
    	let div32;
    	let t81;
    	let div33;
    	let t83;
    	let h17;
    	let t87;
    	let div39;
    	let div35;
    	let t89;
    	let div36;
    	let t91;
    	let div37;
    	let t93;
    	let div38;
    	let t95;
    	let h18;
    	let t99;
    	let div44;
    	let div40;
    	let t101;
    	let div41;
    	let t103;
    	let div42;
    	let t105;
    	let div43;
    	let t107;
    	let h19;
    	let t111;
    	let div49;
    	let div45;
    	let t113;
    	let div46;
    	let t115;
    	let div47;
    	let t117;
    	let div48;
    	let t119;
    	let h110;
    	let t123;
    	let div54;
    	let div50;
    	let t125;
    	let div51;
    	let t127;
    	let div52;
    	let t129;
    	let div53;
    	let t131;
    	let h111;
    	let t135;
    	let div59;
    	let div55;
    	let t137;
    	let div56;
    	let t139;
    	let div57;
    	let t141;
    	let div58;
    	let t143;
    	let h112;
    	let t147;
    	let div64;
    	let div60;
    	let t149;
    	let div61;
    	let t151;
    	let div62;
    	let t153;
    	let div63;
    	let t155;
    	let h113;
    	let t159;
    	let div69;
    	let div65;
    	let t161;
    	let div66;
    	let t163;
    	let div67;
    	let t165;
    	let div68;
    	let t167;
    	let h114;
    	let t171;
    	let div74;
    	let div70;
    	let t173;
    	let div71;
    	let t175;
    	let div72;
    	let t177;
    	let div73;
    	let t179;
    	let h115;
    	let t183;
    	let div79;
    	let div75;
    	let t185;
    	let div76;
    	let t187;
    	let div77;
    	let t189;
    	let div78;
    	let t191;
    	let h116;
    	let t195;
    	let div84;
    	let div80;
    	let t197;
    	let div81;
    	let t199;
    	let div82;
    	let t201;
    	let div83;
    	let t203;
    	let h117;
    	let t207;
    	let div89;
    	let div85;
    	let t209;
    	let div86;
    	let t211;
    	let div87;
    	let t213;
    	let div88;
    	let t215;
    	let h118;
    	let t219;
    	let div94;
    	let div90;
    	let t221;
    	let div91;
    	let t223;
    	let div92;
    	let t225;
    	let div93;
    	let t227;
    	let h119;
    	let t231;
    	let div99;
    	let div95;
    	let t233;
    	let div96;
    	let t235;
    	let div97;
    	let t237;
    	let div98;

    	const block = {
    		c: function create() {
    			div100 = element("div");
    			h10 = element("h1");
    			h10.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t3 = space();
    			div4 = element("div");
    			div0 = element("div");
    			div0.textContent = "First column";
    			t5 = space();
    			div1 = element("div");
    			div1.textContent = "Second column";
    			t7 = space();
    			div2 = element("div");
    			div2.textContent = "Third column";
    			t9 = space();
    			div3 = element("div");
    			div3.textContent = "Fourth column";
    			t11 = space();
    			h11 = element("h1");
    			h11.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t15 = space();
    			div9 = element("div");
    			div5 = element("div");
    			div5.textContent = "First column";
    			t17 = space();
    			div6 = element("div");
    			div6.textContent = "Second column";
    			t19 = space();
    			div7 = element("div");
    			div7.textContent = "Third column";
    			t21 = space();
    			div8 = element("div");
    			div8.textContent = "Fourth column";
    			t23 = space();
    			h12 = element("h1");
    			h12.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t27 = space();
    			div14 = element("div");
    			div10 = element("div");
    			div10.textContent = "First column";
    			t29 = space();
    			div11 = element("div");
    			div11.textContent = "Second column";
    			t31 = space();
    			div12 = element("div");
    			div12.textContent = "Third column";
    			t33 = space();
    			div13 = element("div");
    			div13.textContent = "Fourth column";
    			t35 = space();
    			h13 = element("h1");
    			h13.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t39 = space();
    			div19 = element("div");
    			div15 = element("div");
    			div15.textContent = "First column";
    			t41 = space();
    			div16 = element("div");
    			div16.textContent = "Second column";
    			t43 = space();
    			div17 = element("div");
    			div17.textContent = "Third column";
    			t45 = space();
    			div18 = element("div");
    			div18.textContent = "Fourth column";
    			t47 = space();
    			h14 = element("h1");
    			h14.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t51 = space();
    			div24 = element("div");
    			div20 = element("div");
    			div20.textContent = "First column";
    			t53 = space();
    			div21 = element("div");
    			div21.textContent = "Second column";
    			t55 = space();
    			div22 = element("div");
    			div22.textContent = "Third column";
    			t57 = space();
    			div23 = element("div");
    			div23.textContent = "Fourth column";
    			t59 = space();
    			h15 = element("h1");
    			h15.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t63 = space();
    			div29 = element("div");
    			div25 = element("div");
    			div25.textContent = "First column";
    			t65 = space();
    			div26 = element("div");
    			div26.textContent = "Second column";
    			t67 = space();
    			div27 = element("div");
    			div27.textContent = "Third column";
    			t69 = space();
    			div28 = element("div");
    			div28.textContent = "Fourth column";
    			t71 = space();
    			h16 = element("h1");
    			h16.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t75 = space();
    			div34 = element("div");
    			div30 = element("div");
    			div30.textContent = "First column";
    			t77 = space();
    			div31 = element("div");
    			div31.textContent = "Second column";
    			t79 = space();
    			div32 = element("div");
    			div32.textContent = "Third column";
    			t81 = space();
    			div33 = element("div");
    			div33.textContent = "Fourth column";
    			t83 = space();
    			h17 = element("h1");
    			h17.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t87 = space();
    			div39 = element("div");
    			div35 = element("div");
    			div35.textContent = "First column";
    			t89 = space();
    			div36 = element("div");
    			div36.textContent = "Second column";
    			t91 = space();
    			div37 = element("div");
    			div37.textContent = "Third column";
    			t93 = space();
    			div38 = element("div");
    			div38.textContent = "Fourth column";
    			t95 = space();
    			h18 = element("h1");
    			h18.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t99 = space();
    			div44 = element("div");
    			div40 = element("div");
    			div40.textContent = "First column";
    			t101 = space();
    			div41 = element("div");
    			div41.textContent = "Second column";
    			t103 = space();
    			div42 = element("div");
    			div42.textContent = "Third column";
    			t105 = space();
    			div43 = element("div");
    			div43.textContent = "Fourth column";
    			t107 = space();
    			h19 = element("h1");
    			h19.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t111 = space();
    			div49 = element("div");
    			div45 = element("div");
    			div45.textContent = "First column";
    			t113 = space();
    			div46 = element("div");
    			div46.textContent = "Second column";
    			t115 = space();
    			div47 = element("div");
    			div47.textContent = "Third column";
    			t117 = space();
    			div48 = element("div");
    			div48.textContent = "Fourth column";
    			t119 = space();
    			h110 = element("h1");
    			h110.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t123 = space();
    			div54 = element("div");
    			div50 = element("div");
    			div50.textContent = "First column";
    			t125 = space();
    			div51 = element("div");
    			div51.textContent = "Second column";
    			t127 = space();
    			div52 = element("div");
    			div52.textContent = "Third column";
    			t129 = space();
    			div53 = element("div");
    			div53.textContent = "Fourth column";
    			t131 = space();
    			h111 = element("h1");
    			h111.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t135 = space();
    			div59 = element("div");
    			div55 = element("div");
    			div55.textContent = "First column";
    			t137 = space();
    			div56 = element("div");
    			div56.textContent = "Second column";
    			t139 = space();
    			div57 = element("div");
    			div57.textContent = "Third column";
    			t141 = space();
    			div58 = element("div");
    			div58.textContent = "Fourth column";
    			t143 = space();
    			h112 = element("h1");
    			h112.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t147 = space();
    			div64 = element("div");
    			div60 = element("div");
    			div60.textContent = "First column";
    			t149 = space();
    			div61 = element("div");
    			div61.textContent = "Second column";
    			t151 = space();
    			div62 = element("div");
    			div62.textContent = "Third column";
    			t153 = space();
    			div63 = element("div");
    			div63.textContent = "Fourth column";
    			t155 = space();
    			h113 = element("h1");
    			h113.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t159 = space();
    			div69 = element("div");
    			div65 = element("div");
    			div65.textContent = "First column";
    			t161 = space();
    			div66 = element("div");
    			div66.textContent = "Second column";
    			t163 = space();
    			div67 = element("div");
    			div67.textContent = "Third column";
    			t165 = space();
    			div68 = element("div");
    			div68.textContent = "Fourth column";
    			t167 = space();
    			h114 = element("h1");
    			h114.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t171 = space();
    			div74 = element("div");
    			div70 = element("div");
    			div70.textContent = "First column";
    			t173 = space();
    			div71 = element("div");
    			div71.textContent = "Second column";
    			t175 = space();
    			div72 = element("div");
    			div72.textContent = "Third column";
    			t177 = space();
    			div73 = element("div");
    			div73.textContent = "Fourth column";
    			t179 = space();
    			h115 = element("h1");
    			h115.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t183 = space();
    			div79 = element("div");
    			div75 = element("div");
    			div75.textContent = "First column";
    			t185 = space();
    			div76 = element("div");
    			div76.textContent = "Second column";
    			t187 = space();
    			div77 = element("div");
    			div77.textContent = "Third column";
    			t189 = space();
    			div78 = element("div");
    			div78.textContent = "Fourth column";
    			t191 = space();
    			h116 = element("h1");
    			h116.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t195 = space();
    			div84 = element("div");
    			div80 = element("div");
    			div80.textContent = "First column";
    			t197 = space();
    			div81 = element("div");
    			div81.textContent = "Second column";
    			t199 = space();
    			div82 = element("div");
    			div82.textContent = "Third column";
    			t201 = space();
    			div83 = element("div");
    			div83.textContent = "Fourth column";
    			t203 = space();
    			h117 = element("h1");
    			h117.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t207 = space();
    			div89 = element("div");
    			div85 = element("div");
    			div85.textContent = "First column";
    			t209 = space();
    			div86 = element("div");
    			div86.textContent = "Second column";
    			t211 = space();
    			div87 = element("div");
    			div87.textContent = "Third column";
    			t213 = space();
    			div88 = element("div");
    			div88.textContent = "Fourth column";
    			t215 = space();
    			h118 = element("h1");
    			h118.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t219 = space();
    			div94 = element("div");
    			div90 = element("div");
    			div90.textContent = "First column";
    			t221 = space();
    			div91 = element("div");
    			div91.textContent = "Second column";
    			t223 = space();
    			div92 = element("div");
    			div92.textContent = "Third column";
    			t225 = space();
    			div93 = element("div");
    			div93.textContent = "Fourth column";
    			t227 = space();
    			h119 = element("h1");
    			h119.textContent = `Welcome to ${/*name*/ ctx[0]}'s world!`;
    			t231 = space();
    			div99 = element("div");
    			div95 = element("div");
    			div95.textContent = "First column";
    			t233 = space();
    			div96 = element("div");
    			div96.textContent = "Second column";
    			t235 = space();
    			div97 = element("div");
    			div97.textContent = "Third column";
    			t237 = space();
    			div98 = element("div");
    			div98.textContent = "Fourth column";
    			add_location(h10, file$5, 7, 1, 67);
    			attr_dev(div0, "class", "column");
    			add_location(div0, file$5, 9, 8, 136);
    			attr_dev(div1, "class", "column");
    			add_location(div1, file$5, 12, 2, 196);
    			attr_dev(div2, "class", "column");
    			add_location(div2, file$5, 15, 2, 257);
    			attr_dev(div3, "class", "column");
    			add_location(div3, file$5, 18, 2, 317);
    			attr_dev(div4, "class", "columns");
    			add_location(div4, file$5, 8, 1, 105);
    			add_location(h11, file$5, 22, 1, 386);
    			attr_dev(div5, "class", "column");
    			add_location(div5, file$5, 24, 8, 455);
    			attr_dev(div6, "class", "column");
    			add_location(div6, file$5, 27, 2, 515);
    			attr_dev(div7, "class", "column");
    			add_location(div7, file$5, 30, 2, 576);
    			attr_dev(div8, "class", "column");
    			add_location(div8, file$5, 33, 2, 636);
    			attr_dev(div9, "class", "columns");
    			add_location(div9, file$5, 23, 1, 424);
    			add_location(h12, file$5, 37, 1, 705);
    			attr_dev(div10, "class", "column");
    			add_location(div10, file$5, 39, 8, 774);
    			attr_dev(div11, "class", "column");
    			add_location(div11, file$5, 42, 2, 834);
    			attr_dev(div12, "class", "column");
    			add_location(div12, file$5, 45, 2, 895);
    			attr_dev(div13, "class", "column");
    			add_location(div13, file$5, 48, 2, 955);
    			attr_dev(div14, "class", "columns");
    			add_location(div14, file$5, 38, 1, 743);
    			add_location(h13, file$5, 52, 1, 1024);
    			attr_dev(div15, "class", "column");
    			add_location(div15, file$5, 54, 8, 1093);
    			attr_dev(div16, "class", "column");
    			add_location(div16, file$5, 57, 2, 1153);
    			attr_dev(div17, "class", "column");
    			add_location(div17, file$5, 60, 2, 1214);
    			attr_dev(div18, "class", "column");
    			add_location(div18, file$5, 63, 2, 1274);
    			attr_dev(div19, "class", "columns");
    			add_location(div19, file$5, 53, 1, 1062);
    			add_location(h14, file$5, 67, 1, 1343);
    			attr_dev(div20, "class", "column");
    			add_location(div20, file$5, 69, 8, 1412);
    			attr_dev(div21, "class", "column");
    			add_location(div21, file$5, 72, 2, 1472);
    			attr_dev(div22, "class", "column");
    			add_location(div22, file$5, 75, 2, 1533);
    			attr_dev(div23, "class", "column");
    			add_location(div23, file$5, 78, 2, 1593);
    			attr_dev(div24, "class", "columns");
    			add_location(div24, file$5, 68, 1, 1381);
    			add_location(h15, file$5, 82, 1, 1662);
    			attr_dev(div25, "class", "column");
    			add_location(div25, file$5, 84, 8, 1731);
    			attr_dev(div26, "class", "column");
    			add_location(div26, file$5, 87, 2, 1791);
    			attr_dev(div27, "class", "column");
    			add_location(div27, file$5, 90, 2, 1852);
    			attr_dev(div28, "class", "column");
    			add_location(div28, file$5, 93, 2, 1912);
    			attr_dev(div29, "class", "columns");
    			add_location(div29, file$5, 83, 1, 1700);
    			add_location(h16, file$5, 97, 1, 1981);
    			attr_dev(div30, "class", "column");
    			add_location(div30, file$5, 99, 8, 2050);
    			attr_dev(div31, "class", "column");
    			add_location(div31, file$5, 102, 2, 2110);
    			attr_dev(div32, "class", "column");
    			add_location(div32, file$5, 105, 2, 2171);
    			attr_dev(div33, "class", "column");
    			add_location(div33, file$5, 108, 2, 2231);
    			attr_dev(div34, "class", "columns");
    			add_location(div34, file$5, 98, 1, 2019);
    			add_location(h17, file$5, 112, 1, 2300);
    			attr_dev(div35, "class", "column");
    			add_location(div35, file$5, 114, 8, 2369);
    			attr_dev(div36, "class", "column");
    			add_location(div36, file$5, 117, 2, 2429);
    			attr_dev(div37, "class", "column");
    			add_location(div37, file$5, 120, 2, 2490);
    			attr_dev(div38, "class", "column");
    			add_location(div38, file$5, 123, 2, 2550);
    			attr_dev(div39, "class", "columns");
    			add_location(div39, file$5, 113, 1, 2338);
    			add_location(h18, file$5, 127, 1, 2619);
    			attr_dev(div40, "class", "column");
    			add_location(div40, file$5, 129, 8, 2688);
    			attr_dev(div41, "class", "column");
    			add_location(div41, file$5, 132, 2, 2748);
    			attr_dev(div42, "class", "column");
    			add_location(div42, file$5, 135, 2, 2809);
    			attr_dev(div43, "class", "column");
    			add_location(div43, file$5, 138, 2, 2869);
    			attr_dev(div44, "class", "columns");
    			add_location(div44, file$5, 128, 1, 2657);
    			add_location(h19, file$5, 142, 1, 2938);
    			attr_dev(div45, "class", "column");
    			add_location(div45, file$5, 144, 8, 3007);
    			attr_dev(div46, "class", "column");
    			add_location(div46, file$5, 147, 2, 3067);
    			attr_dev(div47, "class", "column");
    			add_location(div47, file$5, 150, 2, 3128);
    			attr_dev(div48, "class", "column");
    			add_location(div48, file$5, 153, 2, 3188);
    			attr_dev(div49, "class", "columns");
    			add_location(div49, file$5, 143, 1, 2976);
    			add_location(h110, file$5, 157, 1, 3257);
    			attr_dev(div50, "class", "column");
    			add_location(div50, file$5, 159, 8, 3326);
    			attr_dev(div51, "class", "column");
    			add_location(div51, file$5, 162, 2, 3386);
    			attr_dev(div52, "class", "column");
    			add_location(div52, file$5, 165, 2, 3447);
    			attr_dev(div53, "class", "column");
    			add_location(div53, file$5, 168, 2, 3507);
    			attr_dev(div54, "class", "columns");
    			add_location(div54, file$5, 158, 1, 3295);
    			add_location(h111, file$5, 172, 1, 3576);
    			attr_dev(div55, "class", "column");
    			add_location(div55, file$5, 174, 8, 3645);
    			attr_dev(div56, "class", "column");
    			add_location(div56, file$5, 177, 2, 3705);
    			attr_dev(div57, "class", "column");
    			add_location(div57, file$5, 180, 2, 3766);
    			attr_dev(div58, "class", "column");
    			add_location(div58, file$5, 183, 2, 3826);
    			attr_dev(div59, "class", "columns");
    			add_location(div59, file$5, 173, 1, 3614);
    			add_location(h112, file$5, 187, 1, 3895);
    			attr_dev(div60, "class", "column");
    			add_location(div60, file$5, 189, 8, 3964);
    			attr_dev(div61, "class", "column");
    			add_location(div61, file$5, 192, 2, 4024);
    			attr_dev(div62, "class", "column");
    			add_location(div62, file$5, 195, 2, 4085);
    			attr_dev(div63, "class", "column");
    			add_location(div63, file$5, 198, 2, 4145);
    			attr_dev(div64, "class", "columns");
    			add_location(div64, file$5, 188, 1, 3933);
    			add_location(h113, file$5, 202, 1, 4214);
    			attr_dev(div65, "class", "column");
    			add_location(div65, file$5, 204, 8, 4283);
    			attr_dev(div66, "class", "column");
    			add_location(div66, file$5, 207, 2, 4343);
    			attr_dev(div67, "class", "column");
    			add_location(div67, file$5, 210, 2, 4404);
    			attr_dev(div68, "class", "column");
    			add_location(div68, file$5, 213, 2, 4464);
    			attr_dev(div69, "class", "columns");
    			add_location(div69, file$5, 203, 1, 4252);
    			add_location(h114, file$5, 217, 1, 4533);
    			attr_dev(div70, "class", "column");
    			add_location(div70, file$5, 219, 8, 4602);
    			attr_dev(div71, "class", "column");
    			add_location(div71, file$5, 222, 2, 4662);
    			attr_dev(div72, "class", "column");
    			add_location(div72, file$5, 225, 2, 4723);
    			attr_dev(div73, "class", "column");
    			add_location(div73, file$5, 228, 2, 4783);
    			attr_dev(div74, "class", "columns");
    			add_location(div74, file$5, 218, 1, 4571);
    			add_location(h115, file$5, 232, 1, 4852);
    			attr_dev(div75, "class", "column");
    			add_location(div75, file$5, 234, 8, 4921);
    			attr_dev(div76, "class", "column");
    			add_location(div76, file$5, 237, 2, 4981);
    			attr_dev(div77, "class", "column");
    			add_location(div77, file$5, 240, 2, 5042);
    			attr_dev(div78, "class", "column");
    			add_location(div78, file$5, 243, 2, 5102);
    			attr_dev(div79, "class", "columns");
    			add_location(div79, file$5, 233, 1, 4890);
    			add_location(h116, file$5, 247, 1, 5171);
    			attr_dev(div80, "class", "column");
    			add_location(div80, file$5, 249, 8, 5240);
    			attr_dev(div81, "class", "column");
    			add_location(div81, file$5, 252, 2, 5300);
    			attr_dev(div82, "class", "column");
    			add_location(div82, file$5, 255, 2, 5361);
    			attr_dev(div83, "class", "column");
    			add_location(div83, file$5, 258, 2, 5421);
    			attr_dev(div84, "class", "columns");
    			add_location(div84, file$5, 248, 1, 5209);
    			add_location(h117, file$5, 262, 1, 5490);
    			attr_dev(div85, "class", "column");
    			add_location(div85, file$5, 264, 8, 5559);
    			attr_dev(div86, "class", "column");
    			add_location(div86, file$5, 267, 2, 5619);
    			attr_dev(div87, "class", "column");
    			add_location(div87, file$5, 270, 2, 5680);
    			attr_dev(div88, "class", "column");
    			add_location(div88, file$5, 273, 2, 5740);
    			attr_dev(div89, "class", "columns");
    			add_location(div89, file$5, 263, 1, 5528);
    			add_location(h118, file$5, 277, 1, 5809);
    			attr_dev(div90, "class", "column");
    			add_location(div90, file$5, 279, 8, 5878);
    			attr_dev(div91, "class", "column");
    			add_location(div91, file$5, 282, 2, 5938);
    			attr_dev(div92, "class", "column");
    			add_location(div92, file$5, 285, 2, 5999);
    			attr_dev(div93, "class", "column");
    			add_location(div93, file$5, 288, 2, 6059);
    			attr_dev(div94, "class", "columns");
    			add_location(div94, file$5, 278, 1, 5847);
    			add_location(h119, file$5, 292, 1, 6128);
    			attr_dev(div95, "class", "column");
    			add_location(div95, file$5, 294, 8, 6197);
    			attr_dev(div96, "class", "column");
    			add_location(div96, file$5, 297, 2, 6257);
    			attr_dev(div97, "class", "column");
    			add_location(div97, file$5, 300, 2, 6318);
    			attr_dev(div98, "class", "column");
    			add_location(div98, file$5, 303, 2, 6378);
    			attr_dev(div99, "class", "columns");
    			add_location(div99, file$5, 293, 1, 6166);
    			add_location(div100, file$5, 5, 0, 53);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div100, anchor);
    			append_dev(div100, h10);
    			append_dev(div100, t3);
    			append_dev(div100, div4);
    			append_dev(div4, div0);
    			append_dev(div4, t5);
    			append_dev(div4, div1);
    			append_dev(div4, t7);
    			append_dev(div4, div2);
    			append_dev(div4, t9);
    			append_dev(div4, div3);
    			append_dev(div100, t11);
    			append_dev(div100, h11);
    			append_dev(div100, t15);
    			append_dev(div100, div9);
    			append_dev(div9, div5);
    			append_dev(div9, t17);
    			append_dev(div9, div6);
    			append_dev(div9, t19);
    			append_dev(div9, div7);
    			append_dev(div9, t21);
    			append_dev(div9, div8);
    			append_dev(div100, t23);
    			append_dev(div100, h12);
    			append_dev(div100, t27);
    			append_dev(div100, div14);
    			append_dev(div14, div10);
    			append_dev(div14, t29);
    			append_dev(div14, div11);
    			append_dev(div14, t31);
    			append_dev(div14, div12);
    			append_dev(div14, t33);
    			append_dev(div14, div13);
    			append_dev(div100, t35);
    			append_dev(div100, h13);
    			append_dev(div100, t39);
    			append_dev(div100, div19);
    			append_dev(div19, div15);
    			append_dev(div19, t41);
    			append_dev(div19, div16);
    			append_dev(div19, t43);
    			append_dev(div19, div17);
    			append_dev(div19, t45);
    			append_dev(div19, div18);
    			append_dev(div100, t47);
    			append_dev(div100, h14);
    			append_dev(div100, t51);
    			append_dev(div100, div24);
    			append_dev(div24, div20);
    			append_dev(div24, t53);
    			append_dev(div24, div21);
    			append_dev(div24, t55);
    			append_dev(div24, div22);
    			append_dev(div24, t57);
    			append_dev(div24, div23);
    			append_dev(div100, t59);
    			append_dev(div100, h15);
    			append_dev(div100, t63);
    			append_dev(div100, div29);
    			append_dev(div29, div25);
    			append_dev(div29, t65);
    			append_dev(div29, div26);
    			append_dev(div29, t67);
    			append_dev(div29, div27);
    			append_dev(div29, t69);
    			append_dev(div29, div28);
    			append_dev(div100, t71);
    			append_dev(div100, h16);
    			append_dev(div100, t75);
    			append_dev(div100, div34);
    			append_dev(div34, div30);
    			append_dev(div34, t77);
    			append_dev(div34, div31);
    			append_dev(div34, t79);
    			append_dev(div34, div32);
    			append_dev(div34, t81);
    			append_dev(div34, div33);
    			append_dev(div100, t83);
    			append_dev(div100, h17);
    			append_dev(div100, t87);
    			append_dev(div100, div39);
    			append_dev(div39, div35);
    			append_dev(div39, t89);
    			append_dev(div39, div36);
    			append_dev(div39, t91);
    			append_dev(div39, div37);
    			append_dev(div39, t93);
    			append_dev(div39, div38);
    			append_dev(div100, t95);
    			append_dev(div100, h18);
    			append_dev(div100, t99);
    			append_dev(div100, div44);
    			append_dev(div44, div40);
    			append_dev(div44, t101);
    			append_dev(div44, div41);
    			append_dev(div44, t103);
    			append_dev(div44, div42);
    			append_dev(div44, t105);
    			append_dev(div44, div43);
    			append_dev(div100, t107);
    			append_dev(div100, h19);
    			append_dev(div100, t111);
    			append_dev(div100, div49);
    			append_dev(div49, div45);
    			append_dev(div49, t113);
    			append_dev(div49, div46);
    			append_dev(div49, t115);
    			append_dev(div49, div47);
    			append_dev(div49, t117);
    			append_dev(div49, div48);
    			append_dev(div100, t119);
    			append_dev(div100, h110);
    			append_dev(div100, t123);
    			append_dev(div100, div54);
    			append_dev(div54, div50);
    			append_dev(div54, t125);
    			append_dev(div54, div51);
    			append_dev(div54, t127);
    			append_dev(div54, div52);
    			append_dev(div54, t129);
    			append_dev(div54, div53);
    			append_dev(div100, t131);
    			append_dev(div100, h111);
    			append_dev(div100, t135);
    			append_dev(div100, div59);
    			append_dev(div59, div55);
    			append_dev(div59, t137);
    			append_dev(div59, div56);
    			append_dev(div59, t139);
    			append_dev(div59, div57);
    			append_dev(div59, t141);
    			append_dev(div59, div58);
    			append_dev(div100, t143);
    			append_dev(div100, h112);
    			append_dev(div100, t147);
    			append_dev(div100, div64);
    			append_dev(div64, div60);
    			append_dev(div64, t149);
    			append_dev(div64, div61);
    			append_dev(div64, t151);
    			append_dev(div64, div62);
    			append_dev(div64, t153);
    			append_dev(div64, div63);
    			append_dev(div100, t155);
    			append_dev(div100, h113);
    			append_dev(div100, t159);
    			append_dev(div100, div69);
    			append_dev(div69, div65);
    			append_dev(div69, t161);
    			append_dev(div69, div66);
    			append_dev(div69, t163);
    			append_dev(div69, div67);
    			append_dev(div69, t165);
    			append_dev(div69, div68);
    			append_dev(div100, t167);
    			append_dev(div100, h114);
    			append_dev(div100, t171);
    			append_dev(div100, div74);
    			append_dev(div74, div70);
    			append_dev(div74, t173);
    			append_dev(div74, div71);
    			append_dev(div74, t175);
    			append_dev(div74, div72);
    			append_dev(div74, t177);
    			append_dev(div74, div73);
    			append_dev(div100, t179);
    			append_dev(div100, h115);
    			append_dev(div100, t183);
    			append_dev(div100, div79);
    			append_dev(div79, div75);
    			append_dev(div79, t185);
    			append_dev(div79, div76);
    			append_dev(div79, t187);
    			append_dev(div79, div77);
    			append_dev(div79, t189);
    			append_dev(div79, div78);
    			append_dev(div100, t191);
    			append_dev(div100, h116);
    			append_dev(div100, t195);
    			append_dev(div100, div84);
    			append_dev(div84, div80);
    			append_dev(div84, t197);
    			append_dev(div84, div81);
    			append_dev(div84, t199);
    			append_dev(div84, div82);
    			append_dev(div84, t201);
    			append_dev(div84, div83);
    			append_dev(div100, t203);
    			append_dev(div100, h117);
    			append_dev(div100, t207);
    			append_dev(div100, div89);
    			append_dev(div89, div85);
    			append_dev(div89, t209);
    			append_dev(div89, div86);
    			append_dev(div89, t211);
    			append_dev(div89, div87);
    			append_dev(div89, t213);
    			append_dev(div89, div88);
    			append_dev(div100, t215);
    			append_dev(div100, h118);
    			append_dev(div100, t219);
    			append_dev(div100, div94);
    			append_dev(div94, div90);
    			append_dev(div94, t221);
    			append_dev(div94, div91);
    			append_dev(div94, t223);
    			append_dev(div94, div92);
    			append_dev(div94, t225);
    			append_dev(div94, div93);
    			append_dev(div100, t227);
    			append_dev(div100, h119);
    			append_dev(div100, t231);
    			append_dev(div100, div99);
    			append_dev(div99, div95);
    			append_dev(div99, t233);
    			append_dev(div99, div96);
    			append_dev(div99, t235);
    			append_dev(div99, div97);
    			append_dev(div99, t237);
    			append_dev(div99, div98);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div100);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let name = 'coding-orca';
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ name });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\routes\About.svelte generated by Svelte v3.48.0 */

    const file$4 = "src\\routes\\About.svelte";

    function create_fragment$4(ctx) {
    	let section;
    	let div5;
    	let div4;
    	let div3;
    	let div2;
    	let h1;
    	let t1;
    	let hr0;
    	let t2;
    	let h20;
    	let t4;
    	let hr1;
    	let t5;
    	let div0;
    	let p0;
    	let t7;
    	let p1;
    	let t9;
    	let p2;
    	let t11;
    	let p3;
    	let t13;
    	let br;
    	let t14;
    	let h21;
    	let t16;
    	let hr2;
    	let t17;
    	let div1;
    	let p4;
    	let t19;
    	let p5;
    	let t21;
    	let p6;
    	let t23;
    	let p7;
    	let t25;
    	let p8;
    	let t27;
    	let p9;
    	let t29;
    	let p10;
    	let t31;
    	let p11;
    	let t33;
    	let p12;
    	let t35;
    	let p13;
    	let t37;
    	let p14;
    	let t39;
    	let p15;
    	let t41;
    	let p16;
    	let t43;
    	let p17;
    	let t45;
    	let p18;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Who is Coding Orca?";
    			t1 = space();
    			hr0 = element("hr");
    			t2 = space();
    			h20 = element("h2");
    			h20.textContent = "Career";
    			t4 = space();
    			hr1 = element("hr");
    			t5 = space();
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "2013 ~ 2018";
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "Catholic University Of Korea :: Psycology & Sociology";
    			t9 = space();
    			p2 = element("p");
    			p2.textContent = "2020 ~ Now";
    			t11 = space();
    			p3 = element("p");
    			p3.textContent = "Foresys";
    			t13 = space();
    			br = element("br");
    			t14 = space();
    			h21 = element("h2");
    			h21.textContent = "Projects";
    			t16 = space();
    			hr2 = element("hr");
    			t17 = space();
    			div1 = element("div");
    			p4 = element("p");
    			p4.textContent = "2020.03 ~ 2020.09";
    			t19 = space();
    			p5 = element("p");
    			p5.textContent = "Foresys 내부 정산시스템";
    			t21 = space();
    			p6 = element("p");
    			p6.textContent = "마케터들이 사용하는 내사용 정산 시스템을 개발했습니다.\r\n\t\t\t\t사용 기술 : mysql, java, mybatis, jquery, bootstrap, slickgrid, tomcat, apache";
    			t23 = space();
    			p7 = element("p");
    			p7.textContent = "2020.03 ~ 2020.09";
    			t25 = space();
    			p8 = element("p");
    			p8.textContent = "Foresys 검색광고 크롤링 시스템 설계 및 개발";
    			t27 = space();
    			p9 = element("p");
    			p9.textContent = "네이버 쇼핑 API, 구글 ads API, Jsoup, Selenium을 활용하여 키워드를 통해 특정 상품을 검색 했을 때 네이버 쇼핑에서 보여지는 광고 순위와 그 외 마케팅에 도움될만한 다양한 data를 보여주는 대시보드 사이트를 DB 부터 UI까지 설계 및 구축하였습니다.\r\n\t\t\t\t사용 기술 : mysql, java, mybatis, jquery, bootstrap, slickgrid, tomcat, apache, 네이버 api, 구글 ads api, selenium, jsoup";
    			t29 = space();
    			p10 = element("p");
    			p10.textContent = "2020.09 ~ 2020.10";
    			t31 = space();
    			p11 = element("p");
    			p11.textContent = "LG CNS 광고 데이터 대시보드 유지보수";
    			t33 = space();
    			p12 = element("p");
    			p12.textContent = "LG CNS에서 의뢰한 LG 전자 광고 관련 데이터 대시보드를 유지보수 했습니다.\r\n\t\t\t\tBackend에서 Frontend까지 폭넓게 업무를 담당했었습니다.\r\n\t\t\t\t사용 기술 : mysql, java, mybatis, jquery, bootstrap, slickgrid, tomcat, apache";
    			t35 = space();
    			p13 = element("p");
    			p13.textContent = "2020.10 ~ 2021.02";
    			t37 = space();
    			p14 = element("p");
    			p14.textContent = "삼성 미주 내사용 자제관리 웹 개발";
    			t39 = space();
    			p15 = element("p");
    			p15.textContent = "삼성 미국지사의 내부 자제관리 웹을 개발했습니다. 주로 프론트엔드를 담당하였으며 Kendo UI를 활용한 데이터 표현을 중점적으로 업무를 진행했습니다.\r\n\t\t\t\t사용 기술 : mssql, java, mybatis, springboot, kendo UI, jquery";
    			t41 = space();
    			p16 = element("p");
    			p16.textContent = "2021.03 ~ 2021.08";
    			t43 = space();
    			p17 = element("p");
    			p17.textContent = "우리금융저축은행 모바일 하이브리드 앱 개발";
    			t45 = space();
    			p18 = element("p");
    			p18.textContent = "우리금융 저축은행 모바일 하이브리드 앱의 프론트엔드 부분 구조를 설계 하였으며 프론트엔드 공통함수 및 공통 컴포넌트를 만드는 역할을 맡았습니다.\r\n\t\t\t\t사용 기술 : vue.js, require.js, java, springboot";
    			attr_dev(h1, "class", "title");
    			add_location(h1, file$4, 31, 2, 602);
    			add_location(hr0, file$4, 32, 2, 648);
    			attr_dev(h20, "class", "subtitle");
    			add_location(h20, file$4, 33, 2, 656);
    			attr_dev(hr1, "class", "content-divider");
    			add_location(hr1, file$4, 34, 2, 692);
    			attr_dev(p0, "class", "year svelte-dkcb49");
    			add_location(p0, file$4, 36, 3, 749);
    			attr_dev(p1, "class", "desc svelte-dkcb49");
    			add_location(p1, file$4, 37, 3, 786);
    			attr_dev(p2, "class", "year svelte-dkcb49");
    			add_location(p2, file$4, 38, 3, 864);
    			attr_dev(p3, "class", "desc svelte-dkcb49");
    			add_location(p3, file$4, 39, 3, 900);
    			attr_dev(div0, "class", "column");
    			add_location(div0, file$4, 35, 2, 724);
    			add_location(br, file$4, 41, 2, 941);
    			attr_dev(h21, "class", "subtitle");
    			add_location(h21, file$4, 42, 2, 949);
    			attr_dev(hr2, "class", "content-divider");
    			add_location(hr2, file$4, 43, 2, 987);
    			attr_dev(p4, "class", "year svelte-dkcb49");
    			add_location(p4, file$4, 45, 3, 1044);
    			attr_dev(p5, "class", "project-name svelte-dkcb49");
    			add_location(p5, file$4, 46, 3, 1087);
    			attr_dev(p6, "class", "desc svelte-dkcb49");
    			add_location(p6, file$4, 47, 3, 1136);
    			attr_dev(p7, "class", "year svelte-dkcb49");
    			add_location(p7, file$4, 51, 3, 1282);
    			attr_dev(p8, "class", "project-name svelte-dkcb49");
    			add_location(p8, file$4, 52, 3, 1325);
    			attr_dev(p9, "class", "desc svelte-dkcb49");
    			add_location(p9, file$4, 53, 3, 1387);
    			attr_dev(p10, "class", "year svelte-dkcb49");
    			add_location(p10, file$4, 57, 3, 1695);
    			attr_dev(p11, "class", "project-name svelte-dkcb49");
    			add_location(p11, file$4, 58, 3, 1738);
    			attr_dev(p12, "class", "desc svelte-dkcb49");
    			add_location(p12, file$4, 59, 3, 1794);
    			attr_dev(p13, "class", "year svelte-dkcb49");
    			add_location(p13, file$4, 64, 3, 1998);
    			attr_dev(p14, "class", "project-name svelte-dkcb49");
    			add_location(p14, file$4, 65, 3, 2041);
    			attr_dev(p15, "class", "desc svelte-dkcb49");
    			add_location(p15, file$4, 66, 3, 2093);
    			attr_dev(p16, "class", "year svelte-dkcb49");
    			add_location(p16, file$4, 70, 3, 2277);
    			attr_dev(p17, "class", "project-name svelte-dkcb49");
    			add_location(p17, file$4, 71, 3, 2320);
    			attr_dev(p18, "class", "desc svelte-dkcb49");
    			add_location(p18, file$4, 72, 3, 2376);
    			attr_dev(div1, "class", "column");
    			add_location(div1, file$4, 44, 2, 1019);
    			attr_dev(div2, "class", "column is-10 is-offset-3");
    			add_location(div2, file$4, 30, 2, 560);
    			attr_dev(div3, "class", "column");
    			add_location(div3, file$4, 29, 1, 536);
    			attr_dev(div4, "class", "container");
    			add_location(div4, file$4, 28, 1, 510);
    			attr_dev(div5, "class", "hero-body");
    			add_location(div5, file$4, 27, 0, 484);
    			attr_dev(section, "id", "parallax-1");
    			attr_dev(section, "class", "hero is-large ");
    			add_location(section, file$4, 26, 0, 434);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, h1);
    			append_dev(div2, t1);
    			append_dev(div2, hr0);
    			append_dev(div2, t2);
    			append_dev(div2, h20);
    			append_dev(div2, t4);
    			append_dev(div2, hr1);
    			append_dev(div2, t5);
    			append_dev(div2, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t7);
    			append_dev(div0, p1);
    			append_dev(div0, t9);
    			append_dev(div0, p2);
    			append_dev(div0, t11);
    			append_dev(div0, p3);
    			append_dev(div2, t13);
    			append_dev(div2, br);
    			append_dev(div2, t14);
    			append_dev(div2, h21);
    			append_dev(div2, t16);
    			append_dev(div2, hr2);
    			append_dev(div2, t17);
    			append_dev(div2, div1);
    			append_dev(div1, p4);
    			append_dev(div1, t19);
    			append_dev(div1, p5);
    			append_dev(div1, t21);
    			append_dev(div1, p6);
    			append_dev(div1, t23);
    			append_dev(div1, p7);
    			append_dev(div1, t25);
    			append_dev(div1, p8);
    			append_dev(div1, t27);
    			append_dev(div1, p9);
    			append_dev(div1, t29);
    			append_dev(div1, p10);
    			append_dev(div1, t31);
    			append_dev(div1, p11);
    			append_dev(div1, t33);
    			append_dev(div1, p12);
    			append_dev(div1, t35);
    			append_dev(div1, p13);
    			append_dev(div1, t37);
    			append_dev(div1, p14);
    			append_dev(div1, t39);
    			append_dev(div1, p15);
    			append_dev(div1, t41);
    			append_dev(div1, p16);
    			append_dev(div1, t43);
    			append_dev(div1, p17);
    			append_dev(div1, t45);
    			append_dev(div1, p18);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\routes\Console.svelte generated by Svelte v3.48.0 */

    const { console: console_1 } = globals;
    const file$3 = "src\\routes\\Console.svelte";

    function create_fragment$3(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let p;
    	let span;
    	let t2;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			p = element("p");
    			span = element("span");
    			span.textContent = "DARAM x BUMGO:\\";
    			t2 = space();
    			input = element("input");
    			add_location(div0, file$3, 57, 4, 1160);
    			add_location(span, file$3, 61, 8, 1222);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "consoleInput svelte-vhznsz");
    			input.value = /*caption*/ ctx[0];
    			add_location(input, file$3, 62, 8, 1260);
    			attr_dev(p, "class", "console svelte-vhznsz");
    			add_location(p, file$3, 60, 4, 1193);
    			attr_dev(div1, "class", "consoleDiv svelte-vhznsz");
    			add_location(div1, file$3, 56, 0, 1111);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t0);
    			append_dev(div1, p);
    			append_dev(p, span);
    			append_dev(p, t2);
    			append_dev(p, input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "keydown", /*onKeyDown*/ ctx[1], false, false, false),
    					listen_dev(div1, "click", click_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const click_handler = () => {
    	
    };

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Console', slots, []);
    	let captionLength = 0;
    	let caption = '';
    	let blinkOpacity = 10;
    	let minus = 1;

    	const onKeyDown = e => {
    		console.log(e);
    	};

    	onMount(() => {
    		// const blinking = setInterval(() => {
    		//     if(blinkOpacity === 10) {
    		//         minus = 1
    		//     } else if(blinkOpacity === 0){
    		//         minus = -1
    		//     }
    		//     blinkOpacity -= minus;
    		// }, 30);
    		return () => {
    			
    		}; // clearInterval(blinking);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Console> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		captionLength,
    		caption,
    		blinkOpacity,
    		minus,
    		onKeyDown
    	});

    	$$self.$inject_state = $$props => {
    		if ('captionLength' in $$props) captionLength = $$props.captionLength;
    		if ('caption' in $$props) $$invalidate(0, caption = $$props.caption);
    		if ('blinkOpacity' in $$props) blinkOpacity = $$props.blinkOpacity;
    		if ('minus' in $$props) minus = $$props.minus;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [caption, onKeyDown];
    }

    class Console extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Console",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\routes\404.svelte generated by Svelte v3.48.0 */

    const file$2 = "src\\routes\\404.svelte";

    function create_fragment$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "404ERROR";
    			add_location(div, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('_404', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<_404> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class _404 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "_404",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    var routes = {
      '/': Home,
      '/about': About,
      '/console' : Console,
      "*": _404
    };

    /* src\components\Header.svelte generated by Svelte v3.48.0 */
    const file$1 = "src\\components\\Header.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (49:16) {#each navItems as item}
    function create_each_block(ctx) {
    	let a;
    	let t0_value = /*item*/ ctx[5].label + "";
    	let t0;
    	let t1;
    	let a_href_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "class", "navbar-item");
    			attr_dev(a, "href", a_href_value = /*item*/ ctx[5].href);
    			toggle_class(a, "is-active", /*item*/ ctx[5].active);
    			add_location(a, file$1, 49, 20, 1624);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			append_dev(a, t1);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a)),
    					listen_dev(a, "click", /*click_handler_1*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*navItems*/ 2 && t0_value !== (t0_value = /*item*/ ctx[5].label + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*navItems*/ 2 && a_href_value !== (a_href_value = /*item*/ ctx[5].href)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*navItems*/ 2) {
    				toggle_class(a, "is-active", /*item*/ ctx[5].active);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(49:16) {#each navItems as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let nav;
    	let div6;
    	let div3;
    	let div1;
    	let div0;
    	let a;
    	let t1;
    	let div2;
    	let span0;
    	let t2;
    	let span1;
    	let t3;
    	let span2;
    	let t4;
    	let div5;
    	let div4;
    	let t5;
    	let hr;
    	let t6;
    	let section;
    	let figure;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;
    	let each_value = /*navItems*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div6 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			a = element("a");
    			a.textContent = "CODING ORCA";
    			t1 = space();
    			div2 = element("div");
    			span0 = element("span");
    			t2 = space();
    			span1 = element("span");
    			t3 = space();
    			span2 = element("span");
    			t4 = space();
    			div5 = element("div");
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			hr = element("hr");
    			t6 = space();
    			section = element("section");
    			figure = element("figure");
    			img = element("img");
    			attr_dev(a, "class", "brand-text has-text-white m-3");
    			attr_dev(a, "href", "/");
    			add_location(a, file$1, 33, 20, 982);
    			attr_dev(div0, "class", "has-background-grey");
    			add_location(div0, file$1, 32, 16, 927);
    			attr_dev(div1, "class", "navbar-item");
    			add_location(div1, file$1, 31, 12, 884);
    			add_location(span0, file$1, 41, 16, 1328);
    			add_location(span1, file$1, 42, 16, 1359);
    			add_location(span2, file$1, 43, 16, 1390);
    			attr_dev(div2, "class", "navbar-burger burger");
    			toggle_class(div2, "is-active", /*isBurgerActive*/ ctx[0]);
    			add_location(div2, file$1, 38, 12, 1158);
    			attr_dev(div3, "class", "navbar-brand");
    			add_location(div3, file$1, 30, 8, 844);
    			attr_dev(div4, "class", "navbar-start");
    			add_location(div4, file$1, 47, 12, 1534);
    			attr_dev(div5, "id", "navMenu");
    			attr_dev(div5, "class", "navbar-menu");
    			toggle_class(div5, "is-active", /*isBurgerActive*/ ctx[0]);
    			add_location(div5, file$1, 46, 8, 1449);
    			attr_dev(div6, "class", "container");
    			add_location(div6, file$1, 29, 4, 811);
    			attr_dev(nav, "class", "navbar is-white is-fixed-top");
    			add_location(nav, file$1, 28, 0, 763);
    			add_location(hr, file$1, 62, 0, 1993);
    			if (!src_url_equal(img.src, img_src_value = "/images/swimmingOrca1.gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "banner");
    			add_location(img, file$1, 65, 8, 2092);
    			attr_dev(figure, "class", "image is-3by1");
    			add_location(figure, file$1, 64, 4, 2052);
    			attr_dev(section, "class", "hero is-medium ml-4 mr-4 mb-3");
    			add_location(section, file$1, 63, 0, 1999);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div6);
    			append_dev(div6, div3);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, a);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, span0);
    			append_dev(div2, t2);
    			append_dev(div2, span1);
    			append_dev(div2, t3);
    			append_dev(div2, span2);
    			append_dev(div6, t4);
    			append_dev(div6, div5);
    			append_dev(div5, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			insert_dev(target, t5, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, figure);
    			append_dev(figure, img);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a)),
    					listen_dev(div2, "click", /*click_handler*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*isBurgerActive*/ 1) {
    				toggle_class(div2, "is-active", /*isBurgerActive*/ ctx[0]);
    			}

    			if (dirty & /*navItems, checkNowPage*/ 6) {
    				each_value = /*navItems*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div4, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*isBurgerActive*/ 1) {
    				toggle_class(div5, "is-active", /*isBurgerActive*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(section);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let isBurgerActive = false;

    	let navItems = [
    		{ label: "Home", href: "/", active: true },
    		{
    			label: "About",
    			href: "/about",
    			active: false
    		}
    	]; // { label: "Console", href: "/console", active: false }

    	function checkNowPage() {
    		let nowPath = window.location.hash;

    		if (nowPath !== "") {
    			for (let item of navItems) {
    				if (item.href === nowPath.replace("#", "")) {
    					item["active"] = true;
    				} else {
    					item["active"] = false;
    				}
    			}
    		}

    		$$invalidate(1, navItems);
    	}

    	checkNowPage();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, isBurgerActive = !isBurgerActive);
    	};

    	const click_handler_1 = () => {
    		checkNowPage();
    	};

    	$$self.$capture_state = () => ({
    		link,
    		isBurgerActive,
    		navItems,
    		checkNowPage
    	});

    	$$self.$inject_state = $$props => {
    		if ('isBurgerActive' in $$props) $$invalidate(0, isBurgerActive = $$props.isBurgerActive);
    		if ('navItems' in $$props) $$invalidate(1, navItems = $$props.navItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isBurgerActive, navItems, checkNowPage, click_handler, click_handler_1];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.48.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let header;
    	let t;
    	let section;
    	let router;
    	let current;
    	header = new Header({ $$inline: true });
    	router = new Router({ props: { routes }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t = space();
    			section = element("section");
    			create_component(router.$$.fragment);
    			attr_dev(section, "class", "section");
    			add_location(section, file, 8, 0, 158);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, section, anchor);
    			mount_component(router, section, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(section);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Router, routes, Header });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
