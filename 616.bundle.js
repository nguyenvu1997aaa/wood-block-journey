(self.webpackChunkgame_core=self.webpackChunkgame_core||[]).push([[616],{648:function(e,t){!function(e){"use strict";function t(e){return e}const n="tp";function i(e){return(t,i)=>[n,"-",e,"v",t?`_${t}`:"",i?`-${i}`:""].join("")}function r(e,n){return t(Object.keys(n).reduce(((t,i)=>{if(void 0===t)return;const r=(0,n[i])(e[i]);return r.succeeded?Object.assign(Object.assign({},t),{[i]:r.value}):void 0}),{}))}function o(e,t){return e.reduce(((e,n)=>{if(void 0===e)return;const i=t(n);return i.succeeded&&void 0!==i.value?[...e,i.value]:void 0}),[])}function a(e){return null!==e&&"object"===typeof e}function s(e){return t=>n=>{if(!t&&void 0===n)return{succeeded:!1,value:void 0};if(t&&void 0===n)return{succeeded:!0,value:void 0};const i=e(n);return void 0!==i?{succeeded:!0,value:i}:{succeeded:!1,value:void 0}}}function c(e){return{custom:t=>s(t)(e),boolean:s((e=>"boolean"===typeof e?e:void 0))(e),number:s((e=>"number"===typeof e?e:void 0))(e),string:s((e=>"string"===typeof e?e:void 0))(e),function:s((e=>"function"===typeof e?e:void 0))(e),constant:t=>s((e=>e===t?t:void 0))(e),raw:s((e=>e))(e),object:t=>s((e=>{if(a(e))return r(e,t)}))(e),array:t=>s((e=>{if(Array.isArray(e))return o(e,t)}))(e)}}const l={optional:c(!0),required:c(!1)};function u(e,t){const n=l.required.object(t)(e);return n.succeeded?n.value:void 0}function d(e,t,n,i){function r(e){return e instanceof n?e:new n((function(t){t(e)}))}return new(n||(n=Promise))((function(n,o){function a(e){try{c(i.next(e))}catch(t){o(t)}}function s(e){try{c(i.throw(e))}catch(t){o(t)}}function c(e){e.done?n(e.value):r(e.value).then(a,s)}c((i=i.apply(e,t||[])).next())}))}function f(){const e=document.createElement("canvas");e.width=128,e.height=64;const t=e.getContext("2d");return t.fillStyle="#222",t.fillRect(0,0,e.width,e.height),t.fillStyle="#ddd",t.font="monospaced",t.textAlign="center",t.textBaseline="middle",t.fillText("No image",.5*e.width,.5*e.height),new Promise((t=>{e.toBlob((e=>{const n=new Image;n.src=URL.createObjectURL(e),n.onload=()=>{t(n)}}))}))}function g(e){return d(this,void 0,void 0,(function*(){const t=new Image;return t.crossOrigin="anonymous",new Promise((n=>{t.src=e,t.onload=()=>{n(t)}}))}))}function h(e){const t=document.createElement("canvas");t.width=e.width,t.height=e.height,t.getContext("2d").drawImage(e,0,0);const n=new Image;return new Promise((e=>{t.toBlob((t=>{n.src=URL.createObjectURL(t),n.onload=()=>{e(n)}}))}))}const v=i("img");class p{constructor(e,t){this.element=e.createElement("div"),this.element.classList.add(v()),t.viewProps.bindClassModifiers(this.element),this.input=e.createElement("input"),this.input.classList.add(v("input")),this.input.setAttribute("type","file"),this.input.setAttribute("accept",t.extensions.join(",")),this.element.appendChild(this.input),this.image_=e.createElement("img"),this.image_.classList.add(v("image")),this.image_.classList.add(v(`image_${t.imageFit}`)),this.element.classList.add(v("area_root")),this.element.appendChild(this.image_)}changeImage(e){this.image_.src=e}changeDraggingState(e){const t=this.element;e?null===t||void 0===t||t.classList.add(v("area_dragging")):null===t||void 0===t||t.classList.remove(v("area_dragging"))}}class m{constructor(e,t){this.placeholderImage=null,this.value=t.value,this.viewProps=t.viewProps,this.view=new p(e,{viewProps:this.viewProps,extensions:t.extensions,imageFit:t.imageFit}),this.onFile=this.onFile.bind(this),this.onDrop=this.onDrop.bind(this),this.onDragOver=this.onDragOver.bind(this),this.onDragLeave=this.onDragLeave.bind(this),this.view.input.addEventListener("change",this.onFile),this.view.element.addEventListener("drop",this.onDrop),this.view.element.addEventListener("dragover",this.onDragOver),this.view.element.addEventListener("dragleave",this.onDragLeave),this.viewProps.handleDispose((()=>{this.view.input.removeEventListener("change",this.onFile),this.view.input.removeEventListener("drop",this.onDrop),this.view.input.removeEventListener("dragover",this.onDragOver),this.view.input.removeEventListener("dragleave",this.onDragLeave)})),this.value.emitter.on("change",this.handleValueChange.bind(this)),this.handleValueChange()}onFile(e){const t=(null===e||void 0===e?void 0:e.target).files;if(!t||!t.length)return;const n=t[0],i=URL.createObjectURL(n);this.setValue(i),this.updateImage(i)}onDrop(e){return d(this,void 0,void 0,(function*(){e.preventDefault();try{const{dataTransfer:t}=e,n=null===t||void 0===t?void 0:t.files[0];if(n){const e=URL.createObjectURL(n);this.updateImage(e),this.setValue(e)}else{const e=null===t||void 0===t?void 0:t.getData("url");if(!e)throw new Error("No url");g(e).then((e=>d(this,void 0,void 0,(function*(){const t=yield h(e);this.updateImage(t.src),this.setValue(t)}))))}}catch(t){console.error("Could not parse the dropped image",t)}finally{this.view.changeDraggingState(!1)}}))}onDragOver(e){e.preventDefault(),this.view.changeDraggingState(!0)}onDragLeave(){this.view.changeDraggingState(!1)}handleImage(e){return d(this,void 0,void 0,(function*(){if(e instanceof HTMLImageElement)h(e).then((e=>{this.updateImage(e.src)}));else if("string"===typeof e){let n="";try{if("placeholder"===e)throw new Error("placeholder");new URL(e),n=(yield g(e)).src}catch(t){n=(yield this.handlePlaceholderImage()).src}finally{this.updateImage(n),this.setValue(n)}}}))}updateImage(e){this.view.changeImage(e)}setValue(e){return d(this,void 0,void 0,(function*(){e instanceof HTMLImageElement?this.value.setRawValue(e):e?this.value.setRawValue(yield g(e)):this.value.setRawValue(yield this.handlePlaceholderImage())}))}handleValueChange(){this.handleImage(this.value.rawValue)}handlePlaceholderImage(){return d(this,void 0,void 0,(function*(){return this.placeholderImage||(this.placeholderImage=yield f()),this.placeholderImage}))}}const w=[".jpg",".png",".gif"],y={id:"input-image",type:"input",css:".tp-imgv{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0}.tp-imgv{background-color:var(--in-bg);border-radius:var(--elm-br);box-sizing:border-box;color:var(--in-fg);font-family:inherit;height:var(--bld-us);line-height:var(--bld-us);min-width:0;width:100%}.tp-imgv:hover{background-color:var(--in-bg-h)}.tp-imgv:focus{background-color:var(--in-bg-f)}.tp-imgv:active{background-color:var(--in-bg-a)}.tp-imgv:disabled{opacity:0.5}:root{--tp-plugin-image-dragging-color: hsla(230, 100%, 66%, 1.00)}.tp-imgv{cursor:pointer;display:grid;height:calc(var(--bld-us) * 3);overflow:hidden;position:relative}.tp-imgv.tp-v-disabled{opacity:0.5}.tp-imgv_input{width:100%;height:100%;opacity:0}.tp-imgv_image{width:100%;height:100%;position:absolute;pointer-events:none;border:0}.tp-imgv_image_contain{-o-object-fit:contain;object-fit:contain}.tp-imgv_image_cover{-o-object-fit:cover;object-fit:cover}.tp-imgv_area_root{transition:opacity 0.16s ease-in-out}.tp-imgv_area_dragging{border:2px dashed var(--tp-plugin-image-dragging-color);border-radius:6px;opacity:0.6}",accept(e,t){if(!(e instanceof HTMLImageElement||"string"===typeof e))return null;const n=l,i=u(t,{view:n.required.constant("input-image"),acceptUrl:n.optional.boolean,imageFit:n.optional.custom((e=>"contain"===e||"cover"===e?e:void 0)),extensions:n.optional.array(n.required.string)});return i?{initialValue:e,params:i}:null},binding:{reader:e=>e=>e instanceof HTMLImageElement?""===e.src?"placeholder":e.src:"string"===typeof e?e:"placeholder",writer:e=>(e,t)=>{e.write(t)}},controller(e){var t,n;return new m(e.document,{value:e.value,imageFit:null!==(t=e.params.imageFit)&&void 0!==t?t:"cover",viewProps:e.viewProps,extensions:null!==(n=e.params.extensions)&&void 0!==n?n:w})}};e.plugin=y,Object.defineProperty(e,"__esModule",{value:!0})}(t)},655:function(e,t,n){"use strict";n.d(t,{RZ:function(){return x}}),"stream"in Blob.prototype||Object.defineProperty(Blob.prototype,"stream",{value(){return new Response(this).body}}),"setBigUint64"in DataView.prototype||Object.defineProperty(DataView.prototype,"setBigUint64",{value(e,t,n){const i=Number(0xffffffffn&t),r=Number(t>>32n);this.setUint32(e+(n?0:4),i,n),this.setUint32(e+(n?4:0),r,n)}});var i=e=>new DataView(new ArrayBuffer(e)),r=e=>new Uint8Array(e.buffer||e),o=e=>(new TextEncoder).encode(String(e)),a=e=>Math.min(4294967295,Number(e)),s=e=>Math.min(65535,Number(e));function c(e,t){if(void 0===t||t instanceof Date||(t=new Date(t)),e instanceof File)return{isFile:1,t:t||new Date(e.lastModified),i:e.stream()};if(e instanceof Response)return{isFile:1,t:t||new Date(e.headers.get("Last-Modified")||Date.now()),i:e.body};if(void 0===t)t=new Date;else if(isNaN(t))throw new Error("Invalid modification date.");if(void 0===e)return{isFile:0,t:t};if("string"==typeof e)return{isFile:1,t:t,i:o(e)};if(e instanceof Blob)return{isFile:1,t:t,i:e.stream()};if(e instanceof Uint8Array||e instanceof ReadableStream)return{isFile:1,t:t,i:e};if(e instanceof ArrayBuffer||ArrayBuffer.isView(e))return{isFile:1,t:t,i:r(e)};if(Symbol.asyncIterator in e)return{isFile:1,t:t,i:l(e[Symbol.asyncIterator]())};throw new TypeError("Unsupported input format.")}function l(e,t=e){return new ReadableStream({async pull(t){let n=0;for(;t.desiredSize>n;){const i=await e.next();if(!i.value){t.close();break}{const e=u(i.value);t.enqueue(e),n+=e.byteLength}}},cancel(e){t.throw?.(e)}})}function u(e){return"string"==typeof e?o(e):e instanceof Uint8Array?e:r(e)}function d(e,t,n){let[i,a]=function(e){return e?e instanceof Uint8Array?[e,1]:ArrayBuffer.isView(e)||e instanceof ArrayBuffer?[r(e),1]:[o(e),0]:[void 0,0]}(t);if(e instanceof File)return{o:g(i||o(e.name)),u:BigInt(e.size),l:a};if(e instanceof Response){const t=e.headers.get("content-disposition"),r=t&&t.match(/;\s*filename\*?=["']?(.*?)["']?$/i),s=r&&r[1]||e.url&&new URL(e.url).pathname.split("/").findLast(Boolean),c=s&&decodeURIComponent(s),l=n||+e.headers.get("content-length");return{o:g(i||o(c)),u:BigInt(l),l:a}}return i=g(i,void 0!==e||void 0!==n),"string"==typeof e?{o:i,u:BigInt(o(e).length),l:a}:e instanceof Blob?{o:i,u:BigInt(e.size),l:a}:e instanceof ArrayBuffer||ArrayBuffer.isView(e)?{o:i,u:BigInt(e.byteLength),l:a}:{o:i,u:f(e,n),l:a}}function f(e,t){return t>-1?BigInt(t):e?void 0:0n}function g(e,t=1){if(!e||e.every((e=>47===e)))throw new Error("The file must have a name.");if(t)for(;47===e[e.length-1];)e=e.subarray(0,-1);else 47!==e[e.length-1]&&(e=new Uint8Array([...e,47]));return e}var h=new Uint32Array(256);for(let E=0;E<256;++E){let e=E;for(let t=0;t<8;++t)e=e>>>1^(1&e&&3988292384);h[E]=e}function v(e,t=0){t^=-1;for(var n=0,i=e.length;n<i;n++)t=t>>>8^h[255&t^e[n]];return(-1^t)>>>0}function p(e,t,n=0){const i=e.getSeconds()>>1|e.getMinutes()<<5|e.getHours()<<11,r=e.getDate()|e.getMonth()+1<<5|e.getFullYear()-1980<<9;t.setUint16(n,i,1),t.setUint16(n+2,r,1)}function m({o:e,l:t},n){return 8*(!t||(n??function(e){try{w.decode(e)}catch{return 0}return 1}(e)))}var w=new TextDecoder("utf8",{fatal:1});function y(e,t=0){const n=i(30);return n.setUint32(0,1347093252),n.setUint32(4,754976768|t),p(e.t,n,10),n.setUint16(26,e.o.length,1),r(n)}async function*b(e){let{i:t}=e;if("then"in t&&(t=await t),t instanceof Uint8Array)yield t,e.m=v(t,0),e.u=BigInt(t.length);else{e.u=0n;const n=t.getReader();for(;;){const{value:t,done:i}=await n.read();if(i)break;e.m=v(t,e.m),e.u+=BigInt(t.length),yield t}}}function U(e,t){const n=i(16+(t?8:0));return n.setUint32(0,1347094280),n.setUint32(4,e.isFile?e.m:0,1),t?(n.setBigUint64(8,e.u,1),n.setBigUint64(16,e.u,1)):(n.setUint32(8,a(e.u),1),n.setUint32(12,a(e.u),1)),r(n)}function I(e,t,n=0,o=0){const s=i(46);return s.setUint32(0,1347092738),s.setUint32(4,755182848),s.setUint16(8,2048|n),p(e.t,s,12),s.setUint32(16,e.isFile?e.m:0,1),s.setUint32(20,a(e.u),1),s.setUint32(24,a(e.u),1),s.setUint16(28,e.o.length,1),s.setUint16(30,o,1),s.setUint16(40,e.isFile?33204:16893,1),s.setUint32(42,a(t),1),r(s)}function B(e,t,n){const o=i(n);return o.setUint16(0,1,1),o.setUint16(2,n-4,1),16&n&&(o.setBigUint64(4,e.u,1),o.setBigUint64(12,e.u,1)),o.setBigUint64(n-8,t,1),r(o)}function L(e){return e instanceof File||e instanceof Response?[[e],[e]]:[[e.input,e.name,e.size],[e.input,e.lastModified]]}var D=e=>function(e){let t=BigInt(22),n=0n,i=0;for(const r of e){if(!r.o)throw new Error("Every file must have a non-empty name.");if(void 0===r.u)throw new Error(`Missing size for file "${(new TextDecoder).decode(r.o)}".`);const e=r.u>=0xffffffffn,o=n>=0xffffffffn;n+=BigInt(46+r.o.length+(e&&8))+r.u,t+=BigInt(r.o.length+46+(12*o|28*e)),i||(i=e)}return(i||n>=0xffffffffn)&&(t+=BigInt(76)),t+n}(function*(e){for(const t of e)yield d(...L(t)[0])}(e));function x(e,t={}){const n={"Content-Type":"application/zip","Content-Disposition":"attachment"};return("bigint"==typeof t.length||Number.isInteger(t.length))&&t.length>0&&(n["Content-Length"]=String(t.length)),t.metadata&&(n["Content-Length"]=String(D(t.metadata))),new Response(F(e,t),{headers:n})}function F(e,t={}){const n=function(e){const t=e[Symbol.iterator in e?Symbol.iterator:Symbol.asyncIterator]();return{async next(){const e=await t.next();if(e.done)return e;const[n,i]=L(e.value);return{done:0,value:Object.assign(c(...i),d(...n))}},throw:t.throw?.bind(t),[Symbol.asyncIterator](){return this}}}(e);return l(async function*(e,t){const n=[];let o=0n,c=0n,l=0;for await(const i of e){const e=m(i,t.buffersAreUTF8);yield y(i,e),yield i.o,i.isFile&&(yield*b(i));const r=i.u>=0xffffffffn,a=12*(o>=0xffffffffn)|28*r;yield U(i,r),n.push(I(i,o,e,a)),n.push(i.o),a&&n.push(B(i,o,a)),r&&(o+=8n),c++,o+=BigInt(46+i.o.length)+i.u,l||(l=r)}let u=0n;for(const i of n)yield i,u+=BigInt(i.length);if(l||o>=0xffffffffn){const e=i(76);e.setUint32(0,1347094022),e.setBigUint64(4,BigInt(44),1),e.setUint32(12,755182848),e.setBigUint64(24,c,1),e.setBigUint64(32,c,1),e.setBigUint64(40,u,1),e.setBigUint64(48,o,1),e.setUint32(56,1347094023),e.setBigUint64(64,o+u,1),e.setUint32(72,1,1),yield r(e)}const d=i(22);d.setUint32(0,1347093766),d.setUint16(8,s(c),1),d.setUint16(10,s(c),1),d.setUint32(12,a(u),1),d.setUint32(16,a(o),1),yield r(d)}(n,t),n)}}}]);