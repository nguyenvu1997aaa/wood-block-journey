"use strict";(self.webpackChunkgame_core=self.webpackChunkgame_core||[]).push([[638],{637:function(t,e,n){n.r(e);var a=n(17),i=n(64),s=n.n(i),o=n(100),r=n(463),c=o.Z.DEMO_SPINE,h=function(t){function e(){for(var e,n,a=arguments.length,i=new Array(a),o=0;o<a;o++)i[o]=arguments[o];return(n=t.call.apply(t,s()(e=[this]).call(e,i))||this).fontName=void 0,n.text=void 0,n.run=function(){},n}(0,a.Z)(e,t);var n=e.prototype;return n.preload=function(){this.events.on("wake",this.run),this.events.once("create",this.run),this.scene.isPaused(),this.fontName="Bebas",this.textStyler.addFont({type:"local",fontName:this.fontName,fontType:"truetype"}),this.load.spine(c.KEY,c.jsonPATH,c.atlasPATH,!0)},n.create=function(){t.prototype.create.call(this),this.cameras.main.setBackgroundColor(4868682),this.createSpine(),this.createTextObject()},n.createTextObject=function(){this.text=this.add.text(0,0,"Text Styler",{fontFamily:this.fontName,fontSize:"50px",color:"#ffffff",stroke:"#000000",strokeThickness:3}),this.text.setHighQuality(),Phaser.Display.Align.In.Center(this.text,this.gameZone)},n.createSpine=function(){var t=this.add.spine(200,300,c.KEY);t.setScale(.5);var e=t.getAnimationList(),n=Math.floor(Math.random()*e.length);t.setAnimation(0,e[n],!0)},e}(r.Z);e.default=h}}]);