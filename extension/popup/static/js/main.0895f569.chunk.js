(window.webpackJsonp=window.webpackJsonp||[]).push([[0],[,,,,,,,,,,function(e,t,n){},function(e,t,n){},,,,function(e,t,n){e.exports=n(28)},,,,,,function(e,t,n){},,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),o=n(12),i=n.n(o),c=(n(21),n(3)),s=(n(10),n(1)),u=n.n(s),l=n(2);function m(){var e=document.querySelector("img.avatar"),t="",n="";if(e&&(t=(e.getAttribute("alt")||"").substring(1),n=e.getAttribute("src")),!t){var r=document.querySelector("[data-target='deferred-side-panel.panel'] .AppHeader-logo + div span.Truncate-text");r&&(t=r.textContent?r.textContent.trim():null)}return t?{id:t,avatar:n}:null}function h(){var e=void 0!==typeof window?window.location.href:"";if(!e)return null;var t=e.indexOf("github.com");return t<0?null:e.substring(t+"github.com".length+1).split("/")[0]}function p(){return d.apply(this,arguments)}function d(){return(d=Object(l.a)(u.a.mark(function e(){return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise(function(e){chrome.storage.sync.get(["github_token","github_id","github_avatar"],function(t){if(t.github_token)e({token:t.github_token||null,id:t.github_id||null,avatar:t.github_avatar||null,context:h()});else{var n=m();e({token:null,id:n?n.id:null,avatar:n?n.avatar:null,context:h()})}})}));case 1:case"end":return e.stop()}},e)}))).apply(this,arguments)}function f(e){return g.apply(this,arguments)}function g(){return(g=Object(l.a)(u.a.mark(function e(t){return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise(function(e){chrome.storage.sync.set({github_token:t},function(){e(!0)})}));case 1:case"end":return e.stop()}},e)}))).apply(this,arguments)}function v(e,t){return b.apply(this,arguments)}function b(){return(b=Object(l.a)(u.a.mark(function e(t,n){return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise(function(e){chrome.storage.sync.set({github_id:t,github_avatar:n},function(){e(!0)})}));case 1:case"end":return e.stop()}},e)}))).apply(this,arguments)}var y="9b9e17e168e82438cfb6",w="https://us-central1-git-meme-prod.cloudfunctions.net/api";n(23);var k=n(13),O=n.n(k),E=(n(24),n(11),O()({}));function j(e){var t=Object(r.useState)(-1),n=Object(c.a)(t,2),o=n[0],i=n[1];return a.a.createElement("div",{className:"ListWithBadges"},a.a.createElement("div",{className:"listHeader"},a.a.createElement("span",{className:"listLabel"},e.label),e.items.length>0?a.a.createElement("span",{className:"timesUsed"},"Times used"):null),e.items.length>0?function(e,t,n){function r(t){var r=t.target,a=parseInt(r.getAttribute("data-idx")||"-1",0),o=e.items[a].token;!function(e){var t=document.documentElement;if(!t||!document.body)return!1;var n="rtl"===t.getAttribute("dir"),r=document.createElement("textarea");function a(e,t){r.style.setProperty(e,t)}a("fontSize","12pt"),a("border","0"),a("padding","0"),a("margin","0"),a("position","absolute"),a(n?"right":"left","-9999px");var o=window.pageYOffset||t.scrollTop;if(a("top","".concat(o,"px")),r.setAttribute("readonly",""),r.value=e,!document.body)return!1;document.body.appendChild(r),r.focus(),r.selectionStart=0,r.selectionEnd=e.length;var i=!1;try{i=document.execCommand("copy")}catch(c){i=!1}r.parentNode&&r.parentNode.removeChild(r)}("/".concat(o)),n(a),t.preventDefault()}return a.a.createElement("ul",{className:"list-group"},e.items.map(function(e,n){return a.a.createElement("li",{className:"list-group-item d-flex align-items-left",key:n},a.a.createElement("span",{className:"idx"},n+1,"."),a.a.createElement("span",{className:"token","data-idx":n,onClick:r},"/",e.token),t===n?a.a.createElement("span",{className:"copiedText"},"Copied!"):null,a.a.createElement("span",{className:"count"},E(e.count)))}))}(e,o,i):function(e){return a.a.createElement("div",{className:"emptyList"},e.emptyMessage||a.a.createElement("span",null,a.a.createElement("strong",null,e.label),": No memes found, try choosing from another list!"))}(e))}n(25);function x(e,t,n){var r=chrome.identity.getRedirectURL("provider_cb"),a="https://us-central1-git-meme-prod.cloudfunctions.net/oauth/"+chrome.runtime.id,o=new RegExp(r+"[#?](.*)"),i={interactive:e,url:"https://github.com/login/oauth/authorize?client_id="+y+"&redirect_uri="+encodeURIComponent(a)};function c(){return(c=Object(l.a)(u.a.mark(function e(n){return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!n.hasOwnProperty("access_token")){e.next=5;break}return e.next=3,s(n.access_token,n.user_id,n.avatar);case 3:e.next=6;break;case 5:t(new Error("Neither access_token nor code available."));case 6:case"end":return e.stop()}},e)}))).apply(this,arguments)}function s(e,t,n){return m.apply(this,arguments)}function m(){return(m=Object(l.a)(u.a.mark(function e(n,r,a){return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f(n);case 2:return e.next=4,v(r,a);case 4:t(null,{token:n,id:r,avatar:a});case 5:case"end":return e.stop()}},e)}))).apply(this,arguments)}n.token&&n.id&&n.avatar||(console.log("calling launchWebAuthFlow with options",i),chrome.identity.launchWebAuthFlow(i,function(e){if(console.log("launchWebAuthFlow callback with redirect ",e),chrome.runtime.lastError)return console.error("launchWebAuthFlow error",chrome.runtime.lastError),void t(new Error(chrome.runtime.lastError));var n=e.match(o);console.log("matches = ",n),n&&n.length>1?(console.log("calling handleProviderResponse"),function(e){c.apply(this,arguments)}(function(e){var t=e.split(/&/),n={};return t.forEach(function(e){var t=e.split(/=/);n[t[0]]=t[1]}),console.log("parseRedirectFragment got values",n),n}(n[1]))):t("Invalid redirect URI")}))}n(26);var I=n(14),_=n(6),N=n(5),A=n(7),S=n(4),C=n(8),P={debug:!1},T=function(){function e(t){Object(S.a)(this,e),this.properties=void 0,this.properties=t||{}}return Object(C.a)(e,[{key:"toObject",value:function(){return this.properties}},{key:"toString",value:function(){return JSON.stringify(this.toObject())}},{key:"toJSON",value:function(){return JSON.stringify(this.properties)}},{key:"toQueryString",value:function(){var e=[],t=this.toObject();for(var n in t)t.hasOwnProperty(n)&&t[n]&&e.push(encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e.join("&")}}]),e}(),U=function(e){function t(e){var n;return Object(S.a)(this,t),(n=Object(_.a)(this,Object(N.a)(t).call(this,e))).sent=void 0,n.sent=!1,n}return Object(A.a)(t,e),t}(T),D=function(e){function t(e){return Object(S.a)(this,t),Object(_.a)(this,Object(N.a)(t).call(this,{dp:e,t:"pageview"}))}return Object(A.a)(t,e),t}(U),L=function(e){function t(e,n,r,a){return Object(S.a)(this,t),Object(_.a)(this,Object(N.a)(t).call(this,{ec:e,ea:n,el:r,ev:a,t:"event"}))}return Object(A.a)(t,e),t}(U);var M=new(function(){function e(t){var n=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:P;Object(S.a)(this,e),this.customDimensions=void 0,this.propertyId=void 0,this.options=void 0,this.userAgent=void 0,this.parameters=void 0,this.waitOnPromise=void 0,this.clientId=void 0,this.customDimensions=[],this.propertyId=t,this.options=a,this.clientId="",this.userAgent=window.navigator.userAgent,this.parameters=Object(I.a)({},r);this.waitOnPromise=new Promise(function(e,t){chrome.storage.local.get(["analytics_id"],function(t){var r=t.analytics_id;if(r)n.clientId=r;else{n.clientId=Date.now()+"_"+Math.floor(1e3*Math.random());var a={};a.analytics_id=n.clientId,chrome.storage.local.set(a)}e()})})}return Object(C.a)(e,[{key:"hit",value:function(e){return this.send(e)}},{key:"event",value:function(e){return this.send(e)}},{key:"addParameter",value:function(e,t){this.parameters[e]=t}},{key:"addCustomDimension",value:function(e,t){this.customDimensions[e]=t}},{key:"removeCustomDimension",value:function(e){delete this.customDimensions[e]}},{key:"send",value:function(e){var t=this;return this.waitOnPromise.then(function(){var n=t.customDimensions.map(function(e,t){return"cd".concat(t,"=").concat(e)}).join("&"),r=new T(t.parameters).toQueryString(),a="https://www.google-analytics.com/collect?tid=".concat(t.propertyId,"&v=1&cid=").concat(t.clientId,"&").concat(e.toQueryString(),"&").concat(r,"&").concat(n,"&z=").concat(Math.round(1e8*Math.random())),o={method:"get",headers:{"User-Agent":t.userAgent}};return fetch(a,o)})}}]),e}())("UA-11032269-7");function R(e,t,n,r){var a=function(e,t,n,r){return new L(e,t,n,r)}(e,t,n,r);return M.event(a)}var W=function(e){return a.a.createElement("div",{className:"Login"},a.a.createElement("button",{onClick:function(){console.log("Logging in");try{if(!chrome||!chrome.identity)return void console.log("Not in an extension");R("action","login","begin","popup"),t=!0,n=function(){var t=Object(l.a)(u.a.mark(function t(n,r){return u.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:console.log("getToken complete","Error is ",n,"info is ",r),n?(R("action","login","fail","popup"),console.error(n)):(console.log("got token info ",r),R("action","login","success","popup"),e.onAuth(r));case 2:case"end":return t.stop()}},t)}));return function(e,n){return t.apply(this,arguments)}}(),p().then(function(){var e=Object(l.a)(u.a.mark(function e(r){return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:x(t,n,r);case 1:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}())}catch(r){console.error(r)}var t,n}},"Log in with Github"))};function F(e){var t=Object(r.useState)({context:[],user:[],global:[]}),n=Object(c.a)(t,2),o=n[0],i=n[1],s=Object(r.useState)(""),u=Object(c.a)(s,2),l=u[0],m=u[1],h=Object(r.useState)(!0),p=Object(c.a)(h,2),d=p[0],f=p[1],g=Object(r.useState)(""),v=Object(c.a)(g,2),b=v[0],y=v[1];return Object(r.useEffect)(function(){var t,n,r=e.userInfo.token&&null!==e.userInfo.id?(t=e.userInfo.id,n=e.userInfo.token,{Authorization:"Bearer ".concat(t,"___").concat(n),"Content-Type":"application/json"}):{};chrome.tabs.query({active:!0,currentWindow:!0},function(e){var t=e[0],n="";if(t){var a=t.url;a||window.location.search.indexOf("currentUrl=")>-1&&(a=window.location.search.split("=")[1]);var o=a.split("/");("github.com"===o[2]||o[2].endsWith(".github.com"))&&(n=o[3]||"",y(n))}fetch("".concat(w,"/top_tokens?context=").concat(n),{headers:r}).then(function(e){if(e.ok)return e.json();throw new Error("Failed to fetch top tokens")}).then(function(e){i(e),f(!1)}).catch(function(e){m(e.message),f(!1)})})},[e.userInfo.id,e.userInfo.context]),d?null:a.a.createElement("div",{className:"TopTokensList"},l?a.a.createElement("div",null,"Error"):a.a.createElement(a.a.Fragment,null,o.context&&o.context.length>0?a.a.createElement(j,{label:"In ".concat(b),items:o.context}):null,a.a.createElement(j,{label:"Trending",items:o.global}),a.a.createElement(j,{label:"Your Memes",items:e.userInfo.token?o.user:[],emptyMessage:a.a.createElement("div",{className:"emptyMsg"},a.a.createElement("div",null,"Log in with your Github account to see the most popular memes used by you and your team"),a.a.createElement("div",null,a.a.createElement(W,{onAuth:e.onAuth})))})))}n(27);function G(){return r.createElement("div",{className:"Help"},r.createElement("strong",null,r.createElement("a",{href:"https://gitme.me",target:"_blank"},"GitMeme"))," ","brings lots of fun to Github by making it easy to include Gifs in your comments. In any text box, just type a forward slash and some text to insert a meme, e.g ",r.createElement("span",{className:"token"},"/shipit"))}function z(){return r.createElement("div",{style:{textAlign:"center",marginTop:"16px"}},r.createElement("a",{href:"https://spectrum.chat/gitmeme",target:"_blanks",style:{color:"#0066d6",fontSize:"14px",letterSpacing:"-0.15px"}},"Gift Feedback"))}var J=function(){var e=Object(r.useState)({token:"",id:"",avatar:""}),t=Object(c.a)(e,2),n=t[0],o=t[1],i=Object(r.useState)(!1),s=Object(c.a)(i,2),u=s[0],l=s[1];return Object(r.useEffect)(function(){p().then(function(e){o(e),l(!0)}),function(e){var t=new D(e);M.hit(t)}("popup")},[]),a.a.createElement("div",{className:"App"},a.a.createElement(G,null),u?a.a.createElement(F,{userInfo:n,onAuth:function(e){console.log("Using authInfo ",e),o(e)}}):null,a.a.createElement(z,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(a.a.createElement(J,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}],[[15,1,2]]]);
//# sourceMappingURL=main.0895f569.chunk.js.map