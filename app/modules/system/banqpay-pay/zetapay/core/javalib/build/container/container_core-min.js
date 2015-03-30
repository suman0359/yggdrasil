/*
Copyright (c) 2006, BANQPAY! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.BANQPAY.net/yui/license.txt
version: 0.10.0
*/
BANQPAY.util.Config=function(owner){if(owner){this.init(owner);}}
BANQPAY.util.Config.prototype={owner:null,configChangedEvent:null,queueInProgress:false,addProperty:function(key,propertyObject){},getConfig:function(){},getProperty:function(key){},resetProperty:function(key){},setProperty:function(key,value,silent){},queueProperty:function(key,value){},refireEvent:function(key){},applyConfig:function(userConfig,init){},refresh:function(){},fireQueue:function(){},subscribeToConfigEvent:function(key,handler,obj,override){},unsubscribeFromConfigEvent:function(key,handler,obj){},checkBoolean:function(val){if(typeof val=='boolean'){return true;}else{return false;}},checkNumber:function(val){if(isNaN(val)){return false;}else{return true;}}}
BANQPAY.util.Config.prototype.init=function(owner){this.owner=owner;this.configChangedEvent=new BANQPAY.util.CustomEvent("configChanged");this.queueInProgress=false;var config={};var initialConfig={};var eventQueue=[];var fireEvent=function(key,value){key=key.toLowerCase();var property=config[key];if(typeof property!='undefined'&&property.event){property.event.fire(value);}}
this.addProperty=function(key,propertyObject){key=key.toLowerCase();config[key]=propertyObject;propertyObject.event=new BANQPAY.util.CustomEvent(key);propertyObject.key=key;if(propertyObject.handler){propertyObject.event.subscribe(propertyObject.handler,this.owner,true);}
this.setProperty(key,propertyObject.value,true);if(!propertyObject.suppressEvent){this.queueProperty(key,propertyObject.value);}}
this.getConfig=function(){var cfg={};for(var prop in config){var property=config[prop]
if(typeof property!='undefined'&&property.event){cfg[prop]=property.value;}}
return cfg;}
this.getProperty=function(key){key=key.toLowerCase();var property=config[key];if(typeof property!='undefined'&&property.event){return property.value;}else{return undefined;}}
this.resetProperty=function(key){key=key.toLowerCase();var property=config[key];if(typeof property!='undefined'&&property.event){this.setProperty(key,initialConfig[key].value);}else{return undefined;}}
this.setProperty=function(key,value,silent){key=key.toLowerCase();if(this.queueInProgress&&!silent){this.queueProperty(key,value);return true;}else{var property=config[key];if(typeof property!='undefined'&&property.event){if(property.validator&&!property.validator(value)){return false;}else{property.value=value;if(!silent){fireEvent(key,value);this.configChangedEvent.fire([key,value]);}
return true;}}else{return false;}}}
this.queueProperty=function(key,value){key=key.toLowerCase();var property=config[key];if(typeof property!='undefined'&&property.event){if(typeof value!='undefined'&&property.validator&&!property.validator(value)){return false;}else{if(typeof value!='undefined'){property.value=value;}else{value=property.value;}
var foundDuplicate=false;for(var i=0;i<eventQueue.length;i++){var queueItem=eventQueue[i];if(queueItem){var queueItemKey=queueItem[0];var queueItemValue=queueItem[1];if(queueItemKey.toLowerCase()==key){eventQueue[i]=null;eventQueue.push([key,(typeof value!='undefined'?value:queueItemValue)]);foundDuplicate=true;break;}}}
if(!foundDuplicate&&typeof value!='undefined'){eventQueue.push([key,value]);}}
if(property.supercedes){for(var s=0;s<property.supercedes.length;s++){var supercedesCheck=property.supercedes[s];for(var q=0;q<eventQueue.length;q++){var queueItemCheck=eventQueue[q];if(queueItemCheck){var queueItemCheckKey=queueItemCheck[0];var queueItemCheckValue=queueItemCheck[1];if(queueItemCheckKey.toLowerCase()==supercedesCheck.toLowerCase()){eventQueue.push([queueItemCheckKey,queueItemCheckValue]);eventQueue[q]=null;break;}}}}}
return true;}else{return false;}}
this.refireEvent=function(key){key=key.toLowerCase();var property=config[key];if(typeof property!='undefined'&&property.event&&typeof property.value!='undefined'){if(this.queueInProgress){this.queueProperty(key);}else{fireEvent(key,property.value);}}}
this.applyConfig=function(userConfig,init){if(init){initialConfig=userConfig;}
for(var prop in userConfig){this.queueProperty(prop,userConfig[prop]);}}
this.refresh=function(){for(var prop in config){this.refireEvent(prop);}}
this.fireQueue=function(){this.queueInProgress=true;for(var i=0;i<eventQueue.length;i++){var queueItem=eventQueue[i];if(queueItem){var key=queueItem[0];var value=queueItem[1];var property=config[key];property.value=value;fireEvent(key,value);}}
this.queueInProgress=false;eventQueue=new Array();}
this.subscribeToConfigEvent=function(key,handler,obj,override){key=key.toLowerCase();var property=config[key];if(typeof property!='undefined'&&property.event){if(!BANQPAY.util.Config.alreadySubscribed(property.event,handler,obj)){property.event.subscribe(handler,obj,override);}
return true;}else{return false;}}
this.unsubscribeFromConfigEvent=function(key,handler,obj){key=key.toLowerCase();var property=config[key];if(typeof property!='undefined'&&property.event){return property.event.unsubscribe(handler,obj);}else{return false;}}
this.outputEventQueue=function(){var output="";for(var q=0;q<eventQueue.length;q++){var queueItem=eventQueue[q];if(queueItem){output+=queueItem[0]+"="+queueItem[1]+", ";}}
return output;}}
BANQPAY.util.Config.alreadySubscribed=function(evt,fn,obj){for(var e=0;e<evt.subscribers.length;e++){var subsc=evt.subscribers[e];if(subsc&&subsc.obj==obj&&subsc.fn==fn){return true;break;}}
return false;}
BANQPAY.widget.Module=function(el,userConfig){if(el){this.init(el,userConfig);}}
BANQPAY.widget.Module.IMG_ROOT="http://us.i1.yimg.com/us.yimg.com/i/";BANQPAY.widget.Module.IMG_ROOT_SSL="https://a248.e.akamai.net/sec.yimg.com/i/";BANQPAY.widget.Module.CSS_MODULE="module";BANQPAY.widget.Module.CSS_HEADER="hd";BANQPAY.widget.Module.CSS_BODY="bd";BANQPAY.widget.Module.CSS_FOOTER="ft";BANQPAY.widget.Module.prototype={constructor:BANQPAY.widget.Module,element:null,header:null,body:null,footer:null,id:null,childNodesInDOM:null,imageRoot:BANQPAY.widget.Module.IMG_ROOT,beforeInitEvent:null,initEvent:null,appendEvent:null,beforeRenderEvent:null,renderEvent:null,changeHeaderEvent:null,changeBodyEvent:null,changeFooterEvent:null,changeContentEvent:null,destroyEvent:null,beforeShowEvent:null,showEvent:null,beforeHideEvent:null,hideEvent:null,initEvents:function(){this.beforeInitEvent=new BANQPAY.util.CustomEvent("beforeInit");this.initEvent=new BANQPAY.util.CustomEvent("init");this.appendEvent=new BANQPAY.util.CustomEvent("append");this.beforeRenderEvent=new BANQPAY.util.CustomEvent("beforeRender");this.renderEvent=new BANQPAY.util.CustomEvent("render");this.changeHeaderEvent=new BANQPAY.util.CustomEvent("changeHeader");this.changeBodyEvent=new BANQPAY.util.CustomEvent("changeBody");this.changeFooterEvent=new BANQPAY.util.CustomEvent("changeFooter");this.changeContentEvent=new BANQPAY.util.CustomEvent("changeContent");this.destroyEvent=new BANQPAY.util.CustomEvent("destroy");this.beforeShowEvent=new BANQPAY.util.CustomEvent("beforeShow");this.showEvent=new BANQPAY.util.CustomEvent("show");this.beforeHideEvent=new BANQPAY.util.CustomEvent("beforeHide");this.hideEvent=new BANQPAY.util.CustomEvent("hide");},platform:function(){var ua=navigator.userAgent.toLowerCase();if(ua.indexOf("windows")!=-1||ua.indexOf("win32")!=-1){return"windows";}else if(ua.indexOf("macintosh")!=-1){return"mac";}else{return false;}}(),browser:function(){var ua=navigator.userAgent.toLowerCase();if(ua.indexOf('opera')!=-1){return'opera';}else if(ua.indexOf('msie 7')!=-1){return'ie7';}else if(ua.indexOf('msie')!=-1){return'ie';}else if(ua.indexOf('safari')!=-1){return'safari';}else if(ua.indexOf('gecko')!=-1){return'gecko';}else{return false;}}(),isSecure:function(){if(window.location.href.toLowerCase().indexOf("https")==0){this.imageRoot=BANQPAY.widget.Module.IMG_ROOT_SSL;return true;}else{return false;}}(),initDefaultConfig:function(){this.cfg.addProperty("visible",{value:true,handler:this.configVisible,validator:this.cfg.checkBoolean});this.cfg.addProperty("effect",{suppressEvent:true,supercedes:["visible"]});this.cfg.addProperty("monitorresize",{value:true,handler:this.configMonitorResize});},init:function(el,userConfig){this.initEvents();this.beforeInitEvent.fire(BANQPAY.widget.Module);this.cfg=new BANQPAY.util.Config(this);if(typeof el=="string"){var elId=el;el=document.getElementById(el);if(!el){el=document.createElement("DIV");el.id=elId;}}
this.element=el;if(el.id){this.id=el.id;}
var childNodes=this.element.childNodes;if(childNodes){for(var i=0;i<childNodes.length;i++){var child=childNodes[i];switch(child.className){case BANQPAY.widget.Module.CSS_HEADER:this.header=child;break;case BANQPAY.widget.Module.CSS_BODY:this.body=child;break;case BANQPAY.widget.Module.CSS_FOOTER:this.footer=child;break;}}}
this.initDefaultConfig();BANQPAY.util.Dom.addClass(this.element,BANQPAY.widget.Module.CSS_MODULE);if(userConfig){this.cfg.applyConfig(userConfig,true);}
if(!BANQPAY.util.Config.alreadySubscribed(this.renderEvent,this.cfg.fireQueue,this.cfg)){this.renderEvent.subscribe(this.cfg.fireQueue,this.cfg,true);}
this.initEvent.fire(BANQPAY.widget.Module);},initResizeMonitor:function(){var resizeMonitor=document.getElementById("_yuiResizeMonitor");if(!resizeMonitor){resizeMonitor=document.createElement("DIV");resizeMonitor.style.position="absolute";resizeMonitor.id="_yuiResizeMonitor";resizeMonitor.style.width="1em";resizeMonitor.style.height="1em";resizeMonitor.style.top="-1000px";resizeMonitor.style.left="-1000px";resizeMonitor.innerHTML="&nbsp;";document.body.appendChild(resizeMonitor);}
this.resizeMonitor=resizeMonitor;BANQPAY.util.Event.addListener(this.resizeMonitor,"resize",this.onDomResize,this,true);},onDomResize:function(e,obj){},setHeader:function(headerContent){if(!this.header){this.header=document.createElement("DIV");this.header.className=BANQPAY.widget.Module.CSS_HEADER;}
if(typeof headerContent=="string"){this.header.innerHTML=headerContent;}else{this.header.innerHTML="";this.header.appendChild(headerContent);}
this.changeHeaderEvent.fire(headerContent);this.changeContentEvent.fire();},appendToHeader:function(element){if(!this.header){this.header=document.createElement("DIV");this.header.className=BANQPAY.widget.Module.CSS_HEADER;}
this.header.appendChild(element);this.changeHeaderEvent.fire(element);this.changeContentEvent.fire();},setBody:function(bodyContent){if(!this.body){this.body=document.createElement("DIV");this.body.className=BANQPAY.widget.Module.CSS_BODY;}
if(typeof bodyContent=="string")
{this.body.innerHTML=bodyContent;}else{this.body.innerHTML="";this.body.appendChild(bodyContent);}
this.changeBodyEvent.fire(bodyContent);this.changeContentEvent.fire();},appendToBody:function(element){if(!this.body){this.body=document.createElement("DIV");this.body.className=BANQPAY.widget.Module.CSS_BODY;}
this.body.appendChild(element);this.changeBodyEvent.fire(element);this.changeContentEvent.fire();},setFooter:function(footerContent){if(!this.footer){this.footer=document.createElement("DIV");this.footer.className=BANQPAY.widget.Module.CSS_FOOTER;}
if(typeof footerContent=="string"){this.footer.innerHTML=footerContent;}else{this.footer.innerHTML="";this.footer.appendChild(footerContent);}
this.changeFooterEvent.fire(footerContent);this.changeContentEvent.fire();},appendToFooter:function(element){if(!this.footer){this.footer=document.createElement("DIV");this.footer.className=BANQPAY.widget.Module.CSS_FOOTER;}
this.footer.appendChild(element);this.changeFooterEvent.fire(element);this.changeContentEvent.fire();},render:function(appendToNode,moduleElement){this.beforeRenderEvent.fire();if(!moduleElement){moduleElement=this.element;}
var me=this;var appendTo=function(element){if(typeof element=="string"){element=document.getElementById(element);}
if(element){element.appendChild(me.element);me.appendEvent.fire();}}
if(appendToNode){appendTo(appendToNode);}else{if(!BANQPAY.util.Dom.inDocument(this.element)){return false;}}
if(this.header&&!BANQPAY.util.Dom.inDocument(this.header)){var firstChild=moduleElement.firstChild;if(firstChild){moduleElement.insertBefore(this.header,firstChild);}else{moduleElement.appendChild(this.header);}}
if(this.body&&!BANQPAY.util.Dom.inDocument(this.body)){if(this.footer&&BANQPAY.util.Dom.isAncestor(this.moduleElement,this.footer)){moduleElement.insertBefore(this.body,this.footer);}else{moduleElement.appendChild(this.body);}}
if(this.footer&&!BANQPAY.util.Dom.inDocument(this.footer)){moduleElement.appendChild(this.footer);}
this.renderEvent.fire();return true;},destroy:function(){if(this.element){var parent=this.element.parentNode;}
if(parent){parent.removeChild(this.element);}
this.element=null;this.header=null;this.body=null;this.footer=null;this.destroyEvent.fire();},show:function(){this.cfg.setProperty("visible",true);},hide:function(){this.cfg.setProperty("visible",false);},configVisible:function(type,args,obj){var visible=args[0];if(visible){this.beforeShowEvent.fire();BANQPAY.util.Dom.setStyle(this.element,"display","block");this.showEvent.fire();}else{this.beforeHideEvent.fire();BANQPAY.util.Dom.setStyle(this.element,"display","none");this.hideEvent.fire();}},configMonitorResize:function(type,args,obj){var monitor=args[0];if(monitor){this.initResizeMonitor();}else{BANQPAY.util.Event.removeListener(this.resizeMonitor,"resize",this.onDomResize);this.resizeMonitor=null;}}}
BANQPAY.widget.Overlay=function(el,userConfig){if(arguments.length>0){BANQPAY.widget.Overlay.superclass.constructor.call(this,el,userConfig);}}
BANQPAY.widget.Overlay.prototype=new BANQPAY.widget.Module();BANQPAY.widget.Overlay.prototype.constructor=BANQPAY.widget.Overlay;BANQPAY.widget.Overlay.superclass=BANQPAY.widget.Module.prototype;BANQPAY.widget.Overlay.IFRAME_SRC="promo/m/irs/blank.gif";BANQPAY.widget.Overlay.TOP_LEFT="tl";BANQPAY.widget.Overlay.TOP_RIGHT="tr";BANQPAY.widget.Overlay.BOTTOM_LEFT="bl";BANQPAY.widget.Overlay.BOTTOM_RIGHT="br";BANQPAY.widget.Overlay.CSS_OVERLAY="overlay";BANQPAY.widget.Overlay.prototype.beforeMoveEvent=null;BANQPAY.widget.Overlay.prototype.moveEvent=null;BANQPAY.widget.Overlay.prototype.init=function(el,userConfig){BANQPAY.widget.Overlay.superclass.init.call(this,el);this.beforeInitEvent.fire(BANQPAY.widget.Overlay);BANQPAY.util.Dom.addClass(this.element,BANQPAY.widget.Overlay.CSS_OVERLAY);if(userConfig){this.cfg.applyConfig(userConfig,true);}
if(this.platform=="mac"&&this.browser=="gecko"){if(!BANQPAY.util.Config.alreadySubscribed(this.showEvent,this.showMacGeckoScrollbars,this)){this.showEvent.subscribe(this.showMacGeckoScrollbars,this,true);}
if(!BANQPAY.util.Config.alreadySubscribed(this.hideEvent,this.hideMacGeckoScrollbars,this)){this.hideEvent.subscribe(this.hideMacGeckoScrollbars,this,true);}}
this.initEvent.fire(BANQPAY.widget.Overlay);}
BANQPAY.widget.Overlay.prototype.initEvents=function(){BANQPAY.widget.Overlay.superclass.initEvents.call(this);this.beforeMoveEvent=new BANQPAY.util.CustomEvent("beforeMove",this);this.moveEvent=new BANQPAY.util.CustomEvent("move",this);}
BANQPAY.widget.Overlay.prototype.initDefaultConfig=function(){BANQPAY.widget.Overlay.superclass.initDefaultConfig.call(this);this.cfg.addProperty("x",{handler:this.configX,validator:this.cfg.checkNumber,suppressEvent:true,supercedes:["iframe"]});this.cfg.addProperty("y",{handler:this.configY,validator:this.cfg.checkNumber,suppressEvent:true,supercedes:["iframe"]});this.cfg.addProperty("xy",{handler:this.configXY,suppressEvent:true,supercedes:["iframe"]});this.cfg.addProperty("context",{handler:this.configContext,suppressEvent:true,supercedes:["iframe"]});this.cfg.addProperty("fixedcenter",{value:false,handler:this.configFixedCenter,validator:this.cfg.checkBoolean,supercedes:["iframe","visible"]});this.cfg.addProperty("width",{handler:this.configWidth,suppressEvent:true,supercedes:["iframe"]});this.cfg.addProperty("height",{handler:this.configHeight,suppressEvent:true,supercedes:["iframe"]});this.cfg.addProperty("zIndex",{value:null,handler:this.configzIndex});this.cfg.addProperty("constraintoviewport",{value:false,handler:this.configConstrainToViewport,validator:this.cfg.checkBoolean,supercedes:["iframe","x","y","xy"]});this.cfg.addProperty("iframe",{value:(this.browser=="ie"?true:false),handler:this.configIframe,validator:this.cfg.checkBoolean,supercedes:["zIndex"]});}
BANQPAY.widget.Overlay.prototype.moveTo=function(x,y){this.cfg.setProperty("xy",[x,y]);}
BANQPAY.widget.Overlay.prototype.hideMacGeckoScrollbars=function(){BANQPAY.util.Dom.removeClass(this.element,"show-scrollbars");BANQPAY.util.Dom.addClass(this.element,"hide-scrollbars");}
BANQPAY.widget.Overlay.prototype.showMacGeckoScrollbars=function(){BANQPAY.util.Dom.removeClass(this.element,"hide-scrollbars");BANQPAY.util.Dom.addClass(this.element,"show-scrollbars");}
BANQPAY.widget.Overlay.prototype.configVisible=function(type,args,obj){var visible=args[0];var currentVis=BANQPAY.util.Dom.getStyle(this.element,"visibility");var effect=this.cfg.getProperty("effect");var effectInstances=new Array();if(effect){if(effect instanceof Array){for(var i=0;i<effect.length;i++){var eff=effect[i];effectInstances[effectInstances.length]=eff.effect(this,eff.duration);}}else{effectInstances[effectInstances.length]=effect.effect(this,effect.duration);}}
var isMacGecko=(this.platform=="mac"&&this.browser=="gecko");if(visible){if(isMacGecko){this.showMacGeckoScrollbars();}
if(effect){if(visible){if(currentVis!="visible"){this.beforeShowEvent.fire();for(var i=0;i<effectInstances.length;i++){var e=effectInstances[i];if(i==0&&!BANQPAY.util.Config.alreadySubscribed(e.animateInCompleteEvent,this.showEvent.fire,this.showEvent)){e.animateInCompleteEvent.subscribe(this.showEvent.fire,this.showEvent,true);}
e.animateIn();}}}}else{if(currentVis!="visible"){this.beforeShowEvent.fire();BANQPAY.util.Dom.setStyle(this.element,"visibility","visible");this.cfg.refireEvent("iframe");this.showEvent.fire();}}}else{if(isMacGecko){this.hideMacGeckoScrollbars();}
if(effect){if(currentVis!="hidden"){this.beforeHideEvent.fire();for(var i=0;i<effectInstances.length;i++){var e=effectInstances[i];if(i==0&&!BANQPAY.util.Config.alreadySubscribed(e.animateOutCompleteEvent,this.hideEvent.fire,this.hideEvent)){e.animateOutCompleteEvent.subscribe(this.hideEvent.fire,this.hideEvent,true);}
e.animateOut();}}}else{if(currentVis!="hidden"){this.beforeHideEvent.fire();BANQPAY.util.Dom.setStyle(this.element,"visibility","hidden");this.cfg.refireEvent("iframe");this.hideEvent.fire();}}}}
BANQPAY.widget.Overlay.prototype.doCenterOnDOMEvent=function(){if(this.cfg.getProperty("visible")){this.center();}}
BANQPAY.widget.Overlay.prototype.configFixedCenter=function(type,args,obj){var val=args[0];if(val){this.center();if(!BANQPAY.util.Config.alreadySubscribed(this.beforeShowEvent,this.center,this)){this.beforeShowEvent.subscribe(this.center,this,true);}
if(!BANQPAY.util.Config.alreadySubscribed(BANQPAY.widget.Overlay.windowResizeEvent,this.doCenterOnDOMEvent,this)){BANQPAY.widget.Overlay.windowResizeEvent.subscribe(this.doCenterOnDOMEvent,this,true);}
if(!BANQPAY.util.Config.alreadySubscribed(BANQPAY.widget.Overlay.windowScrollEvent,this.doCenterOnDOMEvent,this)){BANQPAY.widget.Overlay.windowScrollEvent.subscribe(this.doCenterOnDOMEvent,this,true);}}else{BANQPAY.widget.Overlay.windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent,this);BANQPAY.widget.Overlay.windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent,this);}}
BANQPAY.widget.Overlay.prototype.configHeight=function(type,args,obj){var height=args[0];var el=this.element;BANQPAY.util.Dom.setStyle(el,"height",height);this.cfg.refireEvent("iframe");}
BANQPAY.widget.Overlay.prototype.configWidth=function(type,args,obj){var width=args[0];var el=this.element;BANQPAY.util.Dom.setStyle(el,"width",width);this.cfg.refireEvent("iframe");}
BANQPAY.widget.Overlay.prototype.configzIndex=function(type,args,obj){var zIndex=args[0];var el=this.element;if(!zIndex){zIndex=BANQPAY.util.Dom.getStyle(el,"zIndex");if(!zIndex||isNaN(zIndex)){zIndex=0;}}
if(this.iframe){if(zIndex<=0){zIndex=1;}
BANQPAY.util.Dom.setStyle(this.iframe,"zIndex",(zIndex-1));}
BANQPAY.util.Dom.setStyle(el,"zIndex",zIndex);this.cfg.setProperty("zIndex",zIndex,true);}
BANQPAY.widget.Overlay.prototype.configXY=function(type,args,obj){var pos=args[0];var x=pos[0];var y=pos[1];this.cfg.setProperty("x",x);this.cfg.setProperty("y",y);this.beforeMoveEvent.fire([x,y]);x=this.cfg.getProperty("x");y=this.cfg.getProperty("y");this.cfg.refireEvent("iframe");this.moveEvent.fire([x,y]);}
BANQPAY.widget.Overlay.prototype.configX=function(type,args,obj){var x=args[0];var y=this.cfg.getProperty("y");this.cfg.setProperty("x",x,true);this.cfg.setProperty("y",y,true);this.beforeMoveEvent.fire([x,y]);x=this.cfg.getProperty("x");y=this.cfg.getProperty("y");BANQPAY.util.Dom.setX(this.element,x,true);this.cfg.setProperty("xy",[x,y],true);this.cfg.refireEvent("iframe");this.moveEvent.fire([x,y]);}
BANQPAY.widget.Overlay.prototype.configY=function(type,args,obj){var x=this.cfg.getProperty("x");var y=args[0];this.cfg.setProperty("x",x,true);this.cfg.setProperty("y",y,true);this.beforeMoveEvent.fire([x,y]);x=this.cfg.getProperty("x");y=this.cfg.getProperty("y");BANQPAY.util.Dom.setY(this.element,y,true);this.cfg.setProperty("xy",[x,y],true);this.cfg.refireEvent("iframe");this.moveEvent.fire([x,y]);}
BANQPAY.widget.Overlay.prototype.configIframe=function(type,args,obj){var val=args[0];var el=this.element;if(val){var x=this.cfg.getProperty("x");var y=this.cfg.getProperty("y");if(!x||!y){this.syncPosition();x=this.cfg.getProperty("x");y=this.cfg.getProperty("y");}
if(!isNaN(x)&&!isNaN(y)){if(!this.iframe){this.iframe=document.createElement("iframe");var parent=el.parentNode;if(parent){parent.appendChild(this.iframe);}else{document.body.appendChild(this.iframe);}
this.iframe.src=this.imageRoot+BANQPAY.widget.Overlay.IFRAME_SRC;BANQPAY.util.Dom.setStyle(this.iframe,"position","absolute");BANQPAY.util.Dom.setStyle(this.iframe,"border","none");BANQPAY.util.Dom.setStyle(this.iframe,"margin","0");BANQPAY.util.Dom.setStyle(this.iframe,"padding","0");BANQPAY.util.Dom.setStyle(this.iframe,"opacity","0");}
BANQPAY.util.Dom.setStyle(this.iframe,"left",x-2+"px");BANQPAY.util.Dom.setStyle(this.iframe,"top",y-2+"px");var width=el.clientWidth;var height=el.clientHeight;BANQPAY.util.Dom.setStyle(this.iframe,"width",(width+2)+"px");BANQPAY.util.Dom.setStyle(this.iframe,"height",(height+2)+"px");if(!this.cfg.getProperty("visible")){this.iframe.style.display="none";}else{this.iframe.style.display="block";}}}else{if(this.iframe){this.iframe.style.display="none";}}}
BANQPAY.widget.Overlay.prototype.configConstrainToViewport=function(type,args,obj){var val=args[0];if(val){if(!BANQPAY.util.Config.alreadySubscribed(this.beforeMoveEvent,this.enforceConstraints,this)){this.beforeMoveEvent.subscribe(this.enforceConstraints,this,true);}}else{this.beforeMoveEvent.unsubscribe(this.enforceConstraints,this);}}
BANQPAY.widget.Overlay.prototype.configContext=function(type,args,obj){var contextArgs=args[0];if(contextArgs){var contextEl=contextArgs[0];var elementMagnetCorner=contextArgs[1];var contextMagnetCorner=contextArgs[2];if(contextEl){if(typeof contextEl=="string"){this.cfg.setProperty("context",[document.getElementById(contextEl),elementMagnetCorner,contextMagnetCorner],true);}
if(elementMagnetCorner&&contextMagnetCorner){this.align(elementMagnetCorner,contextMagnetCorner);}}}}
BANQPAY.widget.Overlay.prototype.align=function(elementAlign,contextAlign){var contextArgs=this.cfg.getProperty("context");if(contextArgs){var context=contextArgs[0];var element=this.element;var me=this;if(!elementAlign){elementAlign=contextArgs[1];}
if(!contextAlign){contextAlign=contextArgs[2];}
if(element&&context){var elementRegion=BANQPAY.util.Dom.getRegion(element);var contextRegion=BANQPAY.util.Dom.getRegion(context);var doAlign=function(v,h){switch(elementAlign){case BANQPAY.widget.Overlay.TOP_LEFT:me.moveTo(h,v);break;case BANQPAY.widget.Overlay.TOP_RIGHT:me.moveTo(h-element.offsetWidth,v);break;case BANQPAY.widget.Overlay.BOTTOM_LEFT:me.moveTo(h,v-element.offsetHeight);break;case BANQPAY.widget.Overlay.BOTTOM_RIGHT:me.moveTo(h-element.offsetWidth,v-element.offsetHeight);break;}}
switch(contextAlign){case BANQPAY.widget.Overlay.TOP_LEFT:doAlign(contextRegion.top,contextRegion.left);break;case BANQPAY.widget.Overlay.TOP_RIGHT:doAlign(contextRegion.top,contextRegion.right);break;case BANQPAY.widget.Overlay.BOTTOM_LEFT:doAlign(contextRegion.bottom,contextRegion.left);break;case BANQPAY.widget.Overlay.BOTTOM_RIGHT:doAlign(contextRegion.bottom,contextRegion.right);break;}}}}
BANQPAY.widget.Overlay.prototype.enforceConstraints=function(type,args,obj){var pos=args[0];var x=pos[0];var y=pos[1];var width=parseInt(this.cfg.getProperty("width"));if(isNaN(width)){width=0;}
var offsetHeight=this.element.offsetHeight;var offsetWidth=(width>0?width:this.element.offsetWidth);var viewPortWidth=BANQPAY.util.Dom.getViewportWidth();var viewPortHeight=BANQPAY.util.Dom.getViewportHeight();var scrollX=window.scrollX||document.documentElement.scrollLeft;var scrollY=window.scrollY||document.documentElement.scrollTop;var topConstraint=scrollY+10;var leftConstraint=scrollX+10;var bottomConstraint=scrollY+viewPortHeight-offsetHeight-10;var rightConstraint=scrollX+viewPortWidth-offsetWidth-10;if(x<leftConstraint){x=leftConstraint;}else if(x>rightConstraint){x=rightConstraint;}
if(y<topConstraint){y=topConstraint;}else if(y>bottomConstraint){y=bottomConstraint;}
this.cfg.setProperty("x",x,true);this.cfg.setProperty("y",y,true);this.cfg.setProperty("xy",[x,y],true);}
BANQPAY.widget.Overlay.prototype.center=function(){var scrollX=window.scrollX||document.documentElement.scrollLeft;var scrollY=window.scrollY||document.documentElement.scrollTop;var viewPortWidth=BANQPAY.util.Dom.getClientWidth();var viewPortHeight=BANQPAY.util.Dom.getClientHeight();var elementWidth=this.element.offsetWidth;var elementHeight=this.element.offsetHeight;var x=(viewPortWidth/2)-(elementWidth/2)+scrollX;var y=(viewPortHeight/2)-(elementHeight/2)+scrollY;this.element.style.left=parseInt(x)+"px";this.element.style.top=parseInt(y)+"px";this.syncPosition();this.cfg.refireEvent("iframe");}
BANQPAY.widget.Overlay.prototype.syncPosition=function(){var pos=BANQPAY.util.Dom.getXY(this.element);this.cfg.setProperty("x",pos[0],true);this.cfg.setProperty("y",pos[1],true);this.cfg.setProperty("xy",pos,true);}
BANQPAY.widget.Overlay.prototype.onDomResize=function(e,obj){BANQPAY.widget.Overlay.superclass.onDomResize.call(this,e,obj);this.cfg.refireEvent("iframe");}
BANQPAY.widget.Overlay.windowScrollEvent=new BANQPAY.util.CustomEvent("windowScroll");BANQPAY.widget.Overlay.windowResizeEvent=new BANQPAY.util.CustomEvent("windowResize");BANQPAY.widget.Overlay.windowScrollHandler=function(e){BANQPAY.widget.Overlay.windowScrollEvent.fire();}
BANQPAY.widget.Overlay.windowResizeHandler=function(e){BANQPAY.widget.Overlay.windowResizeEvent.fire();}
if(BANQPAY.widget.Overlay._initialized==undefined){BANQPAY.util.Event.addListener(window,"scroll",BANQPAY.widget.Overlay.windowScrollHandler);BANQPAY.util.Event.addListener(window,"resize",BANQPAY.widget.Overlay.windowResizeHandler);BANQPAY.widget.Overlay._initialized=true;}
BANQPAY.widget.OverlayManager=function(userConfig){this.init(userConfig);}
BANQPAY.widget.OverlayManager.CSS_FOCUSED="focused";BANQPAY.widget.OverlayManager.prototype={constructor:BANQPAY.widget.OverlayManager,overlays:new Array(),initDefaultConfig:function(){this.cfg.addProperty("overlays",{suppressEvent:true});this.cfg.addProperty("focusevent",{value:"mousedown"});},getActive:function(){},focus:function(overlay){},remove:function(overlay){},blurAll:function(){},init:function(userConfig){this.cfg=new BANQPAY.util.Config(this);this.initDefaultConfig();if(userConfig){this.cfg.applyConfig(userConfig,true);}
this.cfg.fireQueue();var activeOverlay=null;this.getActive=function(){return activeOverlay;}
this.focus=function(overlay){var o=this.find(overlay);if(o){this.blurAll();activeOverlay=o;BANQPAY.util.Dom.addClass(activeOverlay.element,BANQPAY.widget.OverlayManager.CSS_FOCUSED);this.overlays.sort(this.compareZIndexDesc);var topZIndex=BANQPAY.util.Dom.getStyle(this.overlays[0].element,"zIndex");if(!isNaN(topZIndex)&&this.overlays[0]!=overlay){activeOverlay.cfg.setProperty("zIndex",(parseInt(topZIndex)+1));}
this.overlays.sort(this.compareZIndexDesc);}}
this.remove=function(overlay){var o=this.find(overlay);if(o){var originalZ=BANQPAY.util.Dom.getStyle(o.element,"zIndex");o.cfg.setProperty("zIndex",-1000,true);this.overlays.sort(this.compareZIndexDesc);this.overlays=this.overlays.slice(0,this.overlays.length-1);o.cfg.setProperty("zIndex",originalZ,true);o.cfg.setProperty("manager",null);o.focusEvent=null
o.blurEvent=null;o.focus=null;o.blur=null;}}
this.blurAll=function(){activeOverlay=null;for(var o=0;o<this.overlays.length;o++){BANQPAY.util.Dom.removeClass(this.overlays[o].element,BANQPAY.widget.OverlayManager.CSS_FOCUSED);}}
var overlays=this.cfg.getProperty("overlays");if(overlays){this.register(overlays);this.overlays.sort(this.compareZIndexDesc);}},register:function(overlay){if(overlay instanceof BANQPAY.widget.Overlay){overlay.cfg.addProperty("manager",{value:this});overlay.focusEvent=new BANQPAY.util.CustomEvent("focus");overlay.blurEvent=new BANQPAY.util.CustomEvent("blur");var mgr=this;overlay.focus=function(){mgr.focus(this);this.focusEvent.fire();}
overlay.blur=function(){mgr.blurAll();this.blurEvent.fire();}
var focusOnDomEvent=function(e,obj){mgr.focus(overlay);}
var focusevent=this.cfg.getProperty("focusevent");BANQPAY.util.Event.addListener(overlay.element,focusevent,focusOnDomEvent,this,true);var zIndex=BANQPAY.util.Dom.getStyle(overlay.element,"zIndex");if(!isNaN(zIndex)){overlay.cfg.setProperty("zIndex",parseInt(zIndex));}else{overlay.cfg.setProperty("zIndex",0);}
this.overlays.push(overlay);return true;}else if(overlay instanceof Array){var regcount=0;for(var i=0;i<overlay.length;i++){if(this.register(overlay[i])){regcount++;}}
if(regcount>0){return true;}}else{return false;}},find:function(overlay){if(overlay instanceof BANQPAY.widget.Overlay){for(var o=0;o<this.overlays.length;o++){if(this.overlays[o]==overlay){return this.overlays[o];}}}else if(typeof overlay=="string"){for(var o=0;o<this.overlays.length;o++){if(this.overlays[o].id==overlay){return this.overlays[o];}}}
return null;},compareZIndexDesc:function(o1,o2){var zIndex1=o1.cfg.getProperty("zIndex");var zIndex2=o2.cfg.getProperty("zIndex");if(zIndex1>zIndex2){return-1;}else if(zIndex1<zIndex2){return 1;}else{return 0;}},showAll:function(){for(var o=0;o<this.overlays.length;o++){this.overlays[o].show();}},hideAll:function(){for(var o=0;o<this.overlays.length;o++){this.overlays[o].hide();}}}
BANQPAY.util.KeyListener=function(attachTo,keyData,handler,event){if(!event){event=BANQPAY.util.KeyListener.KEYDOWN;}
var keyEvent=new BANQPAY.util.CustomEvent("keyPressed");this.enabledEvent=new BANQPAY.util.CustomEvent("enabled");this.disabledEvent=new BANQPAY.util.CustomEvent("disabled");if(typeof attachTo=='string'){attachTo=document.getElementById(attachTo);}
if(typeof handler=='function'){keyEvent.subscribe(handler);}else{keyEvent.subscribe(handler.fn,handler.scope,handler.correctScope);}
var handleKeyPress=function(e,obj){var keyPressed=e.charCode||e.keyCode;if(!keyData.shift)keyData.shift=false;if(!keyData.alt)keyData.alt=false;if(!keyData.ctrl)keyData.ctrl=false;if(e.shiftKey==keyData.shift&&e.altKey==keyData.alt&&e.ctrlKey==keyData.ctrl){if(keyData.keys instanceof Array){for(var i=0;i<keyData.keys.length;i++){if(keyPressed==keyData.keys[i]){keyEvent.fire(keyPressed,e);break;}}}else{if(keyPressed==keyData.keys){keyEvent.fire(keyPressed,e);}}}}
this.enable=function(){if(!this.enabled){BANQPAY.util.Event.addListener(attachTo,event,handleKeyPress);this.enabledEvent.fire(keyData);}
this.enabled=true;}
this.disable=function(){if(this.enabled){BANQPAY.util.Event.removeListener(attachTo,event,handleKeyPress);this.disabledEvent.fire(keyData);}
this.enabled=false;}}
BANQPAY.util.KeyListener.KEYDOWN="keydown";BANQPAY.util.KeyListener.KEYUP="keyup";BANQPAY.util.KeyListener.prototype.enable=function(){};BANQPAY.util.KeyListener.prototype.disable=function(){};BANQPAY.util.KeyListener.prototype.enabledEvent=null;BANQPAY.util.KeyListener.prototype.disabledEvent=null;