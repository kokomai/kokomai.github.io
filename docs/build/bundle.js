this.kokomai=this.kokomai||{},this.kokomai.github=this.kokomai.github||{},this.kokomai.github.io=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function r(t){return"function"==typeof t}function c(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function i(t){t.parentNode.removeChild(t)}let u;function s(t){u=t}const a=[],f=[],l=[],d=[],h=Promise.resolve();let $=!1;function m(t){l.push(t)}const p=new Set;let g=0;function b(){const t=u;do{for(;g<a.length;){const t=a[g];g++,s(t),y(t.$$)}for(s(null),a.length=0,g=0;f.length;)f.pop()();for(let t=0;t<l.length;t+=1){const n=l[t];p.has(n)||(p.add(n),n())}l.length=0}while(a.length);for(;d.length;)d.pop()();$=!1,p.clear(),s(t)}function y(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(m)}}const _=new Set;function k(t,n){-1===t.$$.dirty[0]&&(a.push(t),$||($=!0,h.then(b)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function x(c,a,f,l,d,h,$,p=[-1]){const g=u;s(c);const y=c.$$={fragment:null,ctx:null,props:h,update:t,not_equal:d,bound:e(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(a.context||(g?g.$$.context:[])),callbacks:e(),dirty:p,skip_bound:!1,root:a.target||g.$$.root};$&&$(y.root);let x=!1;if(y.ctx=f?f(c,a.props||{},((t,n,...e)=>{const o=e.length?e[0]:n;return y.ctx&&d(y.ctx[t],y.ctx[t]=o)&&(!y.skip_bound&&y.bound[t]&&y.bound[t](o),x&&k(c,t)),n})):[],y.update(),x=!0,o(y.before_update),y.fragment=!!l&&l(y.ctx),a.target){if(a.hydrate){const t=function(t){return Array.from(t.childNodes)}(a.target);y.fragment&&y.fragment.l(t),t.forEach(i)}else y.fragment&&y.fragment.c();a.intro&&((w=c.$$.fragment)&&w.i&&(_.delete(w),w.i(E))),function(t,e,c,i){const{fragment:u,on_mount:s,on_destroy:a,after_update:f}=t.$$;u&&u.m(e,c),i||m((()=>{const e=s.map(n).filter(r);a?a.push(...e):o(e),t.$$.on_mount=[]})),f.forEach(m)}(c,a.target,a.anchor,a.customElement),b()}var w,E;s(g)}function w(n){let e;return{c(){e=function(t){return document.createElement(t)}("h1"),e.textContent=`Welcome to ${E}'s world!`},m(t,n){!function(t,n,e){t.insertBefore(n,e||null)}(t,e,n)},p:t,i:t,o:t,d(t){t&&i(e)}}}let E="coding-orca";return new class extends class{$destroy(){!function(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}{constructor(t){super(),x(this,t,null,w,c,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map