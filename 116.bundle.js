"use strict";(self.webpackChunkgame_core=self.webpackChunkgame_core||[]).push([[116],{682:function(t,e,n){n.r(e);var i=n(4),a=n(71),s=n.n(a),o=n(90),r=n(489),h=n(675),c=n(223),l=n(672),f=n(673),d=o.A.DEMO_SPINE,u=function(t){function e(){for(var e,n,i=arguments.length,a=new Array(i),o=0;o<i;o++)a[o]=arguments[o];return(n=t.call.apply(t,s()(e=[this]).call(e,a))||this).fontName=void 0,n.text=void 0,n.run=function(){},n}(0,i.A)(e,t);var n=e.prototype;return n.preload=function(){this.events.on("wake",this.run),this.events.once("create",this.run),this.scene.isPaused(),this.fontName=c.A.FONT_FAMILY,this.textStyler.addFont({type:"local",fontName:this.fontName,fontType:"opentype"})},n.create=function(){t.prototype.create.call(this),this.testRoad()},n.testRoad=function(){var t=new l.A(this);this.add.existing(t),Phaser.Display.Align.In.Center(t,this.gameZone,0,100),t.listRoadLevel.forEach((function(t){t.kill()}));var e=this.add.graphics({lineStyle:{width:2,color:16711680}});this.game.globalScene.events.on(Phaser.Scenes.Events.UPDATE,(function(){e.clear(),e.strokeRect(t.x-t.width/2,t.y-t.height/2,t.width,t.height)}))},n.testPipe=function(){var t=new f.A(this);t.setTexture(o.A.DEFAULT.KEY,o.A.DEFAULT.FRAME.PROGRESS_BOT_RIGHT),t.setStartAngle(Math.PI/2),t.setClockWise(!1),t.setCrop(Math.PI/3),t.setWorldSize(200,200),t.setDepth(99999),t.setPosition(200,200);var e=this.add.graphics({lineStyle:{width:2,color:16711680}});e.scale=.5,t.setDebug(e),this.tweens.addCounter({from:0,to:Math.PI/2,duration:2e3,repeat:-1,onUpdate:function(e){t.setCrop(e.getValue())}})},n.createGenerateBitmapText=function(){h.A.generateFont(this,"test-font-texture",[{fontKey:"test",characters:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:?!-_'#\"\\/<>()[]{}@",fontStyle:{fontFamily:c.A.FONT_FAMILY,fontSize:166}}]),this.cameras.main.setBackgroundColor(4868682),this.createTextObject(),this.add.bitmapText(187.5,433.5,"test","RETRY",100).setOrigin(.5,.5)},n.createTextObject=function(){this.text=this.add.text(0,0,"Text Styler",{fontFamily:this.fontName,fontSize:"50px",color:"#ffffff",stroke:"#000000",strokeThickness:3}),this.text.setHighQuality(),Phaser.Display.Align.In.Center(this.text,this.gameZone)},n.createSpine=function(){var t=this.add.spine(200,300,d.KEY);t.setScale(.5);var e=t.getAnimationList();console.log("\ud83e\udd16 ? Spine animations",e);var n=Math.floor(Math.random()*e.length);t.setAnimation(0,e[n],!0)},n.alignYOffsetGenerateBitmapText=function(){var t=this.add.bitmapText(187.5,433.5,c.A.MIKADO_DARK_GRAY.KEY,"Retry",166).setOrigin(.5,.5),e=this.add.graphics({lineStyle:{width:2,color:16711680}});this.game.globalScene.events.on(Phaser.Scenes.Events.UPDATE,(function(){e.clear(),e.strokeRect(t.x-t.width/2,t.y-t.height/2,t.width,t.height)}))},e}(r.A);e.default=u}}]);