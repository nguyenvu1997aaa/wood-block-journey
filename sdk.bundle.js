"use strict";(self.webpackChunkgame_core=self.webpackChunkgame_core||[]).push([[630],{643:function(t,n,e){var r=e(63),s=e(17),i=e(46),a=e.n(i),o=e(84),c=e.n(o),u=function(){function t(){this.payments=void 0}var n=t.prototype;return n.getLocale=function(){return null},n.getPlatform=function(){return null},n.getSDKVersion=function(){return"0.0"},n.getSupportedAPIs=function(){return[]},n.getEntryPointData=function(){return null},n.getEntryPointAsync=function(){return new(c())((function(t){t("")}))},n.canCreateShortcutAsync=function(){return new(c())((function(t,n){n(new Error("Not implemented"))}))},n.quit=function(){},n.performHapticFeedbackAsync=function(){return c().resolve()},t}(),d=function(){function t(){}var n=t.prototype;return n.getID=function(){return null},n.getType=function(){return"SOLO"},t}(),l=function(t){function n(n){var e;return(e=t.call(this)||this).sdk=void 0,e.sdk=n,e}(0,s.Z)(n,t);var e=n.prototype;return e.getID=function(){return this.sdk.getID()},e.getType=function(){return this.sdk.getType()},e.isSizeBetween=function(t,n){return this.sdk.isSizeBetween(t,n)},e.switchAsync=function(t){return this.sdk.switchAsync(t)},e.chooseAsync=function(t){return this.sdk.chooseAsync(t)},e.createAsync=function(t){return this.sdk.createAsync(t)},e.getPlayersAsync=function(){return this.sdk.getPlayersAsync()},n}(d),h=l,f=function(){},y=function(t){function n(n){var e;return(e=t.call(this)||this).sdk=void 0,e.sdk=n,e}(0,s.Z)(n,t);var e=n.prototype;return e.getID=function(){return this.sdk.getID()},e.getASIDAsync=function(){return this.sdk.getASIDAsync()},e.getSignedASIDAsync=function(){return this.sdk.getSignedASIDAsync()},e.getName=function(){return this.sdk.getName()},e.getPhoto=function(){return this.sdk.getPhoto()},e.getDataAsync=function(t){return this.sdk.getDataAsync(t)},e.setDataAsync=function(t){return this.sdk.setDataAsync(t)},e.flushDataAsync=function(){return this.sdk.flushDataAsync()},e.getSignedPlayerInfoAsync=function(t){return this.sdk.getSignedPlayerInfoAsync(t)},e.canSubscribeBotAsync=function(){return this.sdk.canSubscribeBotAsync()},e.subscribeBotAsync=function(){return this.sdk.subscribeBotAsync()},e.getConnectedPlayersAsync=function(){return this.sdk.getConnectedPlayersAsync()},e.isGuest=function(){return!1},n}(f),p=y,g=function(t){function n(n){var e;return(e=t.call(this)||this).sdk=void 0,e.player=void 0,e.context=void 0,e.graphApi=void 0,e.tournament=void 0,e.sdk=n,e.player=new p(n.player),e.context=new h(n.context),e}(0,s.Z)(n,t);var e=n.prototype;return e.getLocale=function(){return this.sdk.getLocale()},e.getPlatform=function(){return this.sdk.getPlatform()},e.getSDKVersion=function(){return this.sdk.getSDKVersion()},e.initializeAsync=function(){return this.sdk.initializeAsync()},e.setLoadingProgress=function(t){this.sdk.setLoadingProgress(t)},e.getSupportedAPIs=function(){return this.sdk.getSupportedAPIs()},e.getEntryPointData=function(){return this.sdk.getEntryPointData()},e.getEntryPointAsync=function(){return this.sdk.getEntryPointAsync()},e.setSessionData=function(t){this.sdk.setSessionData(t)},e.startGameAsync=function(){return this.sdk.startGameAsync()},e.shareAsync=function(t){return this.sdk.shareAsync(t)},e.updateAsync=function(t){return this.sdk.updateAsync(t)},e.switchGameAsync=function(t,n){return this.sdk.switchGameAsync(t,n)},e.canCreateShortcutAsync=function(){return this.sdk.canCreateShortcutAsync()},e.createShortcutAsync=function(){return this.sdk.createShortcutAsync()},e.quit=function(){this.sdk.quit()},e.logEvent=function(t,n,e){return this.sdk.logEvent(t,n,e)},e.onPause=function(t){this.sdk.onPause(t)},e.getInterstitialAdAsync=function(t){return this.sdk.getInterstitialAdAsync(t)},e.getRewardedVideoAsync=function(t){return this.sdk.getRewardedVideoAsync(t)},e.matchPlayerAsync=function(t,n,e){return this.sdk.matchPlayerAsync(t,n,e)},e.checkCanPlayerMatchAsync=function(){return this.sdk.checkCanPlayerMatchAsync()},e.getLeaderboardAsync=function(t){return this.sdk.getLeaderboardAsync(t)},e.postSessionScoreAsync=function(t){return this.sdk.postSessionScoreAsync(t)},e.loadBannerAdAsync=function(t,n){return this.sdk.loadBannerAdAsync(t)},e.hideBannerAdAsync=function(){return this.sdk.hideBannerAdAsync()},e.showGameRating=function(){var t=(0,r.Z)(a().mark((function t(){return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",c().reject(new Error("CLIENT_UNSUPPORTED_OPERATION")));case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),e.getTournamentAsync=function(){return this.sdk.getTournamentAsync()},e.inviteAsync=function(t){return this.sdk.inviteAsync(t)},e.shareLinkAsync=function(t){return this.sdk.shareLinkAsync(t)},e.submitGameResultsAsync=function(t){return c().reject(new Error("CLIENT_UNSUPPORTED_OPERATION"))},e.scheduleNotificationAsync=function(t){return c().reject(new Error("CLIENT_UNSUPPORTED_OPERATION"))},n}(u),v=g,A=e(62),S=e(86),w=e.n(S),m={instanceId:""},I=function(t){function n(n,e){var r;return(r=t.call(this)||this).sdk=void 0,r.type=void 0,r.response=void 0,r.sdk=e,r.type=n,r.response=m,r}(0,s.Z)(n,t);var e=n.prototype;return e.getPlacementID=function(){return this.response.instanceId},e.loadAsync=function(){var t=this;return new(c())((function(n,e){"interstitial"===t.type?t.sdk.loadAdsAsync(!1).then((function(e){t.response=e,n()})).catch((function(t){e(t)})):"rewarded"===t.type?t.sdk.loadAdsAsync(!0).then((function(e){t.response=e,n()})).catch((function(t){e(t)})):e(new Error("Unknown ad type"))}))},e.showAsync=function(){var t=this;return new(c())((function(n,e){t.response.instanceId||e(new Error("Ad is not loaded")),t.sdk.showAdsAsync(t.response.instanceId).then((function(r){t.response=m,r.showAdsCompletedAsync?r.showAdsCompletedAsync.then((function(){n()})).catch((function(t){e(t)})):e(new Error("Ad is not loaded"))})).catch((function(t){e(t)}))}))},n}((function(){})),k=I,D=function(t){function n(n){var e;return(e=t.call(this)||this).sdk=void 0,e.sdk=n,e}(0,s.Z)(n,t);var e=n.prototype;return e.getID=function(){return null},e.getType=function(){return"SOLO"},e.isSizeBetween=function(t,n){return null},e.switchAsync=function(t){return new(c())((function(t,n){n(new Error("Unsupported"))}))},e.chooseAsync=function(){return new(c())((function(t,n){n(new Error("Unsupported"))}))},e.createAsync=function(t){return new(c())((function(t,n){n(new Error("Unsupported"))}))},e.getPlayersAsync=function(){return new(c())((function(t,n){n(new Error("Unsupported"))}))},n}(d),P=D,_=e(37),b=e.n(_),L=e(87),E=e.n(L),x=e(470),B=e.n(x),G=e(65),N=e.n(G),T=e(66),U=e.n(T),Z=e(620),C="Game Core",q=C+"_GuestID",R=C+"_GuestData",O=C+"GuestStats",j=function(){function t(){this._personalInfo=void 0,this._uniqueId=void 0,this._playerData=void 0,this._playerStats=void 0,this._uniqueId=this.checkAndGetIdFromLocalStorage(),this._personalInfo={id:this._uniqueId,avatarIdHash:"0",lang:"en",publicName:this.getName(),uniqueID:this._uniqueId,scopePermissions:{avatar:"forbid",public_name:"forbid"}},this._playerData=this.getDataFromLocalStorage(),this._playerStats=this.getStatsFromLocalStorage()}var n=t.prototype;return n.getUniqueID=function(){return this._uniqueId},n.getName=function(){return this.getUniqueID().replace("_"," ")},n.getPhoto=function(){return""},n.getMode=function(){return""},n.getData=function(t){var n=this;if(t){var e=E()(t).call(t,(function(t,e){var r;return(0,A.Z)({},t,((r={})[e]=n._playerData[e],r))}),{});return c().resolve(e)}return c().resolve(this._playerData)},n.setData=function(t){return this._playerData=(0,A.Z)({},this._playerData,t),this.writeDataToLocalStorage(this._playerData),c().resolve(!0)},n.setStats=function(t){return this._playerStats=(0,A.Z)({},this._playerStats,t),this.writeStatsToLocalStorage(this._playerStats),c().resolve(!0)},n.incrementStats=function(t){for(var n=0,e=B()(t);n<e.length;n++){var r=e[n],s=r[0],i=r[1];this._playerStats[s]=(this._playerStats[s]||0)+i}return this.writeStatsToLocalStorage(this._playerStats),c().resolve(this._playerStats)},n.getStats=function(t){var n=this;if(t){var e=E()(t).call(t,(function(t,e){var r;return(0,A.Z)({},t,((r={})[e]=n._playerStats[e],r))}),{});return c().resolve(e)}return c().resolve(this._playerStats)},n.checkAndGetIdFromLocalStorage=function(){var t,n=localStorage.getItem(q);if(null!=n&&-1===N()(t=n.toLowerCase()).call(t,"guest"))return n;var e=this.getRandomID();return localStorage.setItem(q,e),e},n.getRandomID=function(){return(0,Z.Z)().replace(" ","_")},n.getDataFromLocalStorage=function(){var t=localStorage.getItem(R);return t?JSON.parse(t):{}},n.writeDataToLocalStorage=function(t){return localStorage.setItem(R,U()(t))},n.getStatsFromLocalStorage=function(){var t=localStorage.getItem(O);return t?JSON.parse(t):{}},n.writeStatsToLocalStorage=function(t){return localStorage.setItem(O,U()(t))},t}(),F="Game Core",M=F+"_GuestID",z=F+"_GuestData",V=F+"GuestStats",K=function(){function t(t){this._personalInfo=void 0,this._uniqueId=void 0,this.photo=void 0,this._playerData=void 0,this._playerStats=void 0,this._uniqueId=t.playerId,localStorage.setItem(M,this._uniqueId),this._personalInfo={id:this._uniqueId,avatarIdHash:"0",lang:"en",publicName:this._uniqueId,uniqueID:this._uniqueId,scopePermissions:{avatar:"forbid",public_name:"forbid"}},this._playerData=this.getDataFromLocalStorage(),this._playerStats=this.getStatsFromLocalStorage()}var n=t.prototype;return n.getUniqueID=function(){return this._uniqueId},n.getName=function(){return this._personalInfo.publicName.replace("_"," ")},n.getPhoto=function(){return""},n.getMode=function(){return"logged"},n.getData=function(t){var n=this;if(t){var e=E()(t).call(t,(function(t,e){var r;return(0,A.Z)({},t,((r={})[e]=n._playerData[e],r))}),{});return c().resolve(e)}return c().resolve(this._playerData)},n.setData=function(t){return this._playerData=(0,A.Z)({},this._playerData,t),this.writeDataToLocalStorage(this._playerData),c().resolve(!0)},n.setStats=function(t){return this._playerStats=(0,A.Z)({},this._playerStats,t),this.writeStatsToLocalStorage(this._playerStats),c().resolve(!0)},n.incrementStats=function(t){for(var n=0,e=B()(t);n<e.length;n++){var r=e[n],s=r[0],i=r[1];this._playerStats[s]=(this._playerStats[s]||0)+i}return this.writeStatsToLocalStorage(this._playerStats),c().resolve(this._playerStats)},n.getStats=function(t){var n=this;if(t){var e=E()(t).call(t,(function(t,e){var r;return(0,A.Z)({},t,((r={})[e]=n._playerStats[e],r))}),{});return c().resolve(e)}return c().resolve(this._playerStats)},n.getDataFromLocalStorage=function(){var t=localStorage.getItem(z);return t?JSON.parse(t):{}},n.writeDataToLocalStorage=function(t){return localStorage.setItem(z,U()(t))},n.getStatsFromLocalStorage=function(){var t=localStorage.getItem(V);return t?JSON.parse(t):{}},n.writeStatsToLocalStorage=function(t){return localStorage.setItem(V,U()(t))},t}(),H=function(t){function n(n){var e;return(e=t.call(this)||this).sdk=void 0,e.player=void 0,e.signature="",e.sdk=n,e}(0,s.Z)(n,t);var e=n.prototype;return e.initPlayerAsync=function(){var t=(0,r.Z)(a().mark((function t(){var n;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.tryGettingSignedInPlayer();case 2:if(null!==(n=t.sent)){t.next=8;break}return this.player=new j,t.abrupt("return",c().resolve());case 8:this.player=new K(n),this.signature=n.signature;case 10:return t.abrupt("return",c().resolve());case 11:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}(),e.tryGettingSignedInPlayer=function(){var t=(0,r.Z)(a().mark((function t(){var n;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=null,t.prev=1,t.next=4,this.sdk.getSignedInUserAsync();case 4:n=t.sent,t.next=9;break;case 7:t.prev=7,t.t0=t.catch(1);case 9:return t.abrupt("return",c().resolve(n));case 10:case"end":return t.stop()}}),t,this,[[1,7]])})));return function(){return t.apply(this,arguments)}}(),e.tryMakingPlayerSignedIn=function(){var t=(0,r.Z)(a().mark((function t(){var n;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=null,t.prev=1,t.next=4,this.sdk.signInAsync();case 4:n=t.sent,t.next=9;break;case 7:t.prev=7,t.t0=t.catch(1);case 9:return t.abrupt("return",c().resolve(n));case 10:case"end":return t.stop()}}),t,this,[[1,7]])})));return function(){return t.apply(this,arguments)}}(),e.rejectPlayerNotInitialized=function(){return c().reject(new Error("Player is not initialized"))},e.getID=function(){var t,n;return null!=(t=null==(n=this.player)?void 0:n.getUniqueID())?t:null},e.getASIDAsync=function(){var t;return c().resolve(null!=(t=this.getID())?t:"")},e.getSignedASIDAsync=function(){var t=this;return c().resolve({getASID:function(){var n;return null!=(n=t.getID())?n:""},getSignature:function(){return t.signature}})},e.getName=function(){var t,n,e=null!=(t=null==(n=this.player)?void 0:n.getName())?t:null;return""===e?"Anonymous":e},e.getPhoto=function(){var t,n;return null!=(t=null==(n=this.player)?void 0:n.getPhoto())?t:null},e.getDataAsync=function(t){var n=this;return new(c())((function(e,r){n.validateIsLogged(r),n.player.getData(t).then(e).catch(r)}))},e.setDataAsync=function(t){var n=this;return new(c())((function(e,r){n.validateIsLogged(r),n.getDataAsync().then((function(s){var i=(0,A.Z)({},s,t);n.player.setData(i).then((function(){e()})).catch(r)})).catch(r)}))},e.flushDataAsync=function(){var t,n;return null!=(t=null==(n=this.player)?void 0:n.setData({}).then())?t:this.rejectPlayerNotInitialized()},e.getSignedPlayerInfoAsync=function(){var t=this;return c().resolve({getPlayerID:function(){var n;return null!=(n=t.getID())?n:"10"},getSignature:function(){return t.signature}})},e.canSubscribeBotAsync=function(){return new(c())((function(t){t(!1)}))},e.subscribeBotAsync=function(){return new(c())((function(t,n){n(new Error("Unsupported"))}))},e.getStatsAsync=function(t){var n=this;return new(c())((function(e,r){n.validateIsLogged(r),e(n.player.getStats(t))}))},e.setStatsAsync=function(t){var n=this;return new(c())((function(e,r){n.validateIsLogged(r),n.player.setStats(t).then((function(){return e()})).catch(r)}))},e.incrementStatsAsync=function(t){var n=this;return new(c())((function(e,r){n.validateIsLogged(r),n.player.incrementStats(t).then(e).catch(r)}))},e.getConnectedPlayersAsync=function(){return new(c())((function(t,n){n(new Error("Unsupported"))}))},e.isGuest=function(){if(!this.player)return!0;if("lite"===this.player.getMode())return!0;var t=this.getID();return!t||"GUEST"==b()(t).call(t,0,5)},e.validateIsLogged=function(t){this.player||t(new Error("Player is not initialized"))},n}(f),J=H,W="Game Core",$=function(t){function n(n){var e;return(e=t.call(this)||this).sdk=void 0,e.player=void 0,e.context=void 0,e.graphApi=void 0,e.tournament=void 0,e.rewardedAdInstance=void 0,e.interstitialAdInstance=void 0,e.currentPercentLoading=0,e.shareImageBase64=void 0,e.notificationImageBase64=void 0,e.initSDKAsync=function(){return new(c())((function(t){e.player=new J(e.sdk),e.context=new P(e.sdk),e.rewardedAdInstance=new k("rewarded",e.sdk),e.interstitialAdInstance=new k("interstitial",e.sdk),e.player.initPlayerAsync().finally(t)}))},e.sdk=n,e}(0,s.Z)(n,t);var e=n.prototype;return e.loadImageAsync=function(){var t=(0,r.Z)(a().mark((function t(n){var e;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(n).then((function(t){return t.blob()})).then((function(t){var n=new FileReader;return new(c())((function(e,r){try{n.onload=function(){e(this.result)},n.onerror=r,n.readAsDataURL(t)}catch(s){r(s)}}))}));case 2:if(!(e=t.sent)||"string"!==typeof e){t.next=5;break}return t.abrupt("return",c().resolve(e));case 5:return t.abrupt("return",c().reject());case 6:case"end":return t.stop()}}),t)})));return function(n){return t.apply(this,arguments)}}(),e.getLocale=function(){return this.sdk.getLocale()},e.getSDKVersion=function(){return"v1.0.0-rc.12"},e.getSupportedAPIs=function(){return["getLocale","getSDKVersion","initializeAsync","startGameAsync","setLoadingProgress","getInterstitialAdAsync","getRewardedVideoAsync","getPlatform","loadBannerAdAsync","hideBannerAdAsync","getLeaderboardAsync","canCreateShortcutAsync","getPlayerEntryAsync"]},e.initializeAsync=function(){var t=this;return new(c())((function(n,e){var r=document.getElementById("lds-content");if(r)r.hidden=!1;else{var s='<div id="lds-content"><div id="lds-dual-ring"></div><div id="lds-text"><span id="lds-percent">0</span>% loaded</div></div>';"complete"===document.readyState?t.appendHtml(document.body,s):window.addEventListener("load",(function(){t.appendHtml(document.body,s)}))}t.initSDKAsync().then(n).catch(e)}))},e.startGameAsync=function(){var t;return this.setLoadingProgress(100),null==(t=document.getElementById("lds-content"))||t.remove(),c().resolve()},e.setLoadingProgress=function(t){var n=document.getElementById("lds-percent");n&&(this.currentPercentLoading=Math.round(Math.max(Math.min(t,100),this.currentPercentLoading)),n.innerHTML=""+this.currentPercentLoading,this.currentPercentLoading=t)},e.setSessionData=function(t){},e.shareAsync=function(){var t=(0,r.Z)(a().mark((function t(n){var e=this;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.shareImageBase64){t.next=4;break}return t.next=3,this.loadImageAsync("/assets/images/others/share.jpg");case 3:this.shareImageBase64=t.sent;case 4:return t.abrupt("return",new(c())((function(t,n){e.sdk.shareAsync({title:W,text:"Play now!",image:e.shareImageBase64}).then((function(){return t()})).catch(n)})));case 5:case"end":return t.stop()}}),t,this)})));return function(n){return t.apply(this,arguments)}}(),e.updateAsync=function(t){return new(c())((function(t,n){n(new Error("Unsupported"))}))},e.switchGameAsync=function(t,n){return this.sdk.switchGameAsync({id:t,payloadData:n})},e.canCreateShortcutAsync=function(){return c().resolve(!0)},e.createShortcutAsync=function(){var t=this;return new(c())((function(n,e){t.sdk.promptInstallAsync().then((function(){return n()})).catch(e)}))},e.logEvent=function(){return null},e.onPause=function(t){},e.getInterstitialAdAsync=function(t){var n=this;return new(c())((function(t){t(n.interstitialAdInstance)}))},e.getRewardedVideoAsync=function(t){var n=this;return new(c())((function(t){t(n.rewardedAdInstance)}))},e.matchPlayerAsync=function(t){return new(c())((function(t,n){n(new Error("Unsupported"))}))},e.checkCanPlayerMatchAsync=function(){return new(c())((function(t,n){n(!1)}))},e.getLeaderboardAsync=function(t){return new(c())((function(t,n){n(new Error("Unsupported"))}))},e.appendHtml=function(t,n){var e=document.createElement("div");for(e.innerHTML=n;e.children.length>0;)t.appendChild(e.children[0])},e.getPlatform=function(){var t=navigator.userAgent||navigator.vendor;return/android/i.test(t)?"ANDROID":/iPad|iPhone|iPod/.test(t)&&!window.MSStream?"IOS":"WEB"},e.postSessionScoreAsync=function(t){return c().reject(new Error("Unsupported"))},e.loadBannerAdAsync=function(t,n){var e=this,r=n.position+":"+n.bannerWidth+"x"+n.bannerHeight;return this.isValidDisplayAdPlacement(r)?new(c())((function(t,n){e.sdk.showDisplayAdsAsync(r).then((function(){return t()})).catch(n)})):c().reject(new Error("Invalid banner ad placement"))},e.isValidDisplayAdPlacement=function(t){var n=["top:728x90","bottom:728x90","left:300x250","right:300x250","topleft:300x250","topright:300x250","bottomleft:300x250","bottomright:300x250","top:320x50","right:320x50","bottom:320x50","left:320x50","left:300x600","right:300x600","top:970x250","bottom:970x250","left:160x600","right:160x600"];return!!w()(n).call(n,t)},e.hideBannerAdAsync=function(){var t=this;return new(c())((function(n,e){t.sdk.hideDisplayAdsAsync().then((function(){return n()})).catch(e)}))},e.showGameRating=function(){var t=(0,r.Z)(a().mark((function t(){return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",c().reject(new Error("Unsupported")));case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),e.getTournamentAsync=function(){return c().reject(new Error("Unsupported"))},e.inviteAsync=function(t){return c().reject(new Error("Unsupported"))},e.shareLinkAsync=function(t){return c().reject(new Error("Unsupported"))},e.submitGameResultsAsync=function(t){return this.sdk.submitGameResultsAsync(t)},e.scheduleNotificationAsync=function(){var t=(0,r.Z)(a().mark((function t(n){var e,r=this;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.notificationImageBase64){t.next=4;break}return t.next=3,this.loadImageAsync("/assets/images/others/notification.jpg");case 3:this.notificationImageBase64=t.sent;case 4:return e={title:W,description:"We miss you!",type:0,minDelayInSeconds:3.6,imageData:this.notificationImageBase64,callToAction:"Play now!"},e=(0,A.Z)({},e,n),t.abrupt("return",new(c())((function(t,n){r.sdk.scheduleNotificationAsync(e).then((function(){return t()})).catch(n)})));case 7:case"end":return t.stop()}}),t,this)})));return function(n){return t.apply(this,arguments)}}(),n}(u),Q=$;"FBInstant"in window&&(window.GameSDK=new v(window.FBInstant)),"$msstart"in window&&(window.GameSDK=new Q(window.$msstart)),window.FBInstant=window.GameSDK}}]);