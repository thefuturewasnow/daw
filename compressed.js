"use strict";function walContext(){this.ctx=new window.AudioContext,this.destination=this.ctx.destination,this.filters=this.createFilters(),this.buffers=[],this.compositions=[],this.nbPlaying=0,this.filters.connect(this.destination),this.nodeIn=this.filters.nodeIn,delete this.filters.connect}function extractData(e){function i(e){var t=new Promise(function(t){e.isFile?e.file(function(e){e.type&&"text/plain"!==e.type?a.push(e):n||(n=e,gs.reset()),t()}):e.isDirectory&&(s=e.createReader(),s.readEntries(function(e){var s=[];$.each(e,function(){s.push(i(this))}),Promise.all(s).then(function(){t()})}))});return t}var t,s,n,a=[],o=[];$.each(e,function(){(t=this.webkitGetAsEntry())&&o.push(i(t))}),Promise.all(o).then(function(){gs.load(n).then(function(){loadFile(a)})})}function loadFile(e){e.forEach(function(e){gs.files.some(function(i){var t=i.file?i.file.size:i.size;return i.fullname===e.name&&t===e.size?(i.file||i.joinFile(e),!0):void 0})||gs.fileCreate(e)})}window.AudioContext=window.AudioContext||window.webkitAudioContext,walContext.prototype={gain:function(e){return arguments.length?(this.filter.gain(e),this):this.filter.gain()},createBuffer:function(e){var i=this;return new Promise(function(t,s){new walContext.Buffer(i,e,t,s)}).then(function(e){return i.buffers.push(e),e})},createFilters:function(){return new walContext.Filters(this)},createComposition:function(){var e=new walContext.Composition(this);return this.compositions.push(e),e}},function(){function e(e){var i,t=null,s=0;e.wSamples.forEach(function(e){i=e.getEndTime(),i>s&&(s=i,t=e)}),e.lastSample=t,e.duration=t?t.getEndTime():0}function i(i){clearTimeout(i.playTimeoutId),e(i);var t=i.duration&&i.duration-i.currentTime();0>=t?i.onended():i.playTimeoutId=setTimeout(i.onended.bind(i),1e3*t)}function t(e,i){var t=e.when-i;e.start(t,t>0?e.offset:e.offset-t,t>0?e.duration:e.duration+t)}function s(e,s,n,a){var o=e.currentTime();s.getEndTime()>o&&"rm"!==n&&(s.load(),t(s,o)),e.lastSample===a&&"mv"!==n||i(e)}function n(e){clearTimeout(e.playTimeoutId),e.wSamples.forEach(function(e){e.stop()})}function a(e){var i=e.currentTime();e.wSamples.forEach(function(e){e.getEndTime()>i&&e.load()})}function o(e){var s=e.currentTime();e.wSamples.forEach(function(e){e.getEndTime()>s&&t(e,s)}),i(e)}walContext.Composition=function(e){this.wCtx=e,this.wSamples=[],this.lastSample=null,this.isPlaying=this.isPaused=!1,this.duration=this.startedTime=this._currentTime=0,this.fnOnended=this.fnOnpaused=function(){}},walContext.Composition.prototype={addSamples:function(e){var i=this;return e.forEach(function(e){i.wSamples.indexOf(e)<0&&(i.wSamples.push(e),e.composition=this,i.update(e))}),this},removeSamples:function(e){var i,t=this;return e.forEach(function(e){i=t.wSamples.indexOf(e),i>-1&&(t.wSamples.splice(i,1),e.composition=null,t.update(e,"rm"))}),this},update:function(i,t){var n,a=this,o=this.lastSample;return e(this),this.isPlaying&&(i.started?(n=i.fnOnended,i.onended(function(){s(a,i,t,o),n(),i.onended(n)}),i.stop()):s(this,i,t,o)),this},currentTime:function(e){return arguments.length?(this.isPlaying&&n(this),this._currentTime=Math.max(0,Math.min(e,this.duration)),this.isPlaying&&(this.startedTime=this.wCtx.ctx.currentTime,a(this),o(this)),this):this._currentTime+(this.isPlaying&&wa.wctx.ctx.currentTime-this.startedTime)},play:function(){return this.isPlaying||(this.isPlaying=!0,this.isPaused=!1,this.startedTime=wa.wctx.ctx.currentTime,a(this),o(this)),this},stop:function(){return(this.isPlaying||this.isPaused)&&(n(this),this.onended()),this},pause:function(){this.isPlaying&&(this.isPlaying=!1,this.isPaused=!0,this._currentTime+=wa.wctx.ctx.currentTime-this.startedTime,this.startedTime=0,n(this),this.fnOnpaused())},onended:function(e){return"function"==typeof e?this.fnOnended=e:(this.isPlaying=this.isPaused=!1,this.startedTime=this._currentTime=0,this.fnOnended()),this}}}(),function(){walContext.Buffer=function(e,i,t,s){function n(e){a.wCtx.ctx.decodeAudioData(e,function(e){a.buffer=e,a.isReady=!0,t(a)},s)}var a=this,o=new FileReader;this.wCtx=e,this.isReady=!1,i.name?(o.addEventListener("loadend",function(){n(o.result)}),o.readAsArrayBuffer(i)):n(i)},walContext.Buffer.prototype={createSample:function(){var e=new walContext.Sample(this.wCtx,this);return e},getPeaks:function(e,i,t,s){t=t||0,s=s||this.buffer.duration;for(var n,a,o,u=0,r=new Array(i),l=this.buffer.getChannelData(e),c=(s-t)*this.buffer.sampleRate,d=t*this.buffer.sampleRate,m=c/i,f=m/10;i>u;++u){for(n=d+u*m,a=n+m,o=0;a>n;n+=f)o=Math.max(o,Math.abs(l[~~n]));r[u]=o}return r}}}(),function(){function e(e,i,t){e[i]=t[0],e[i+1]=t[1],e[i+2]=t[2],e[i+3]=t[3]}function i(i,t,s,n){var a,o,u,r=t.data,l=0,c=t.width,d=t.height,m=d/2,f=i.getPeaks(0,c),h=i.buffer.numberOfChannels>1?i.getPeaks(1,c):f;if(n){for(;l<r.length;l+=4)e(r,l,s);s=[0,0,0,0]}for(l=0;c>l;++l){for(o=~~(m*(1-f[l])),u=~~(m*(1+h[l])),a=o;u>=a;++a)e(r,4*(a*c+l),s);e(r,4*(m*c+l),s)}return t}walContext.Buffer.prototype.drawWaveform=function(e,t){return i(this,e,t)},walContext.Buffer.prototype.drawInvertedWaveform=function(e,t){return i(this,e,t,!0)}}(),walContext.Filters=function(e){this.wCtx=e,this.nodes=[],this.nodeIn=e.ctx.createGain(),this.nodeOut=e.ctx.createGain(),this.nodeIn.connect(this.nodeOut),this.connect(e)},walContext.Filters.prototype={connect:function(e){e=e.nodeIn||e,e instanceof AudioNode&&(this.connectedTo=e,this.nodeOut.connect(e))},disconnect:function(){this.nodeOut.disconnect(),this.connectedTo=null},empty:function(){this.nodes.length&&(this.nodes[this.nodes.length-1].disconnect(),this.nodeIn.disconnect(),this.nodeIn.connect(this.nodeOut),this.nodes=[])},gain:function(e){return arguments.length?void(this.nodeOut.gain.value=e):this.nodeOut.gain.value},pushBack:function(e){if(this.nodes.length){var i=this.nodes[this.nodes.length-1];i.disconnect(),i.connect(e)}else this.nodeIn.disconnect(),this.nodeIn.connect(e);e.connect(this.nodeOut),this.nodes.push(e)},pushFront:function(e){this.nodes.length?(this.nodeIn.disconnect(),this.nodeIn.connect(e),e.connect(this.nodes[0]),this.nodes.unshift(e)):this.pushBack(e)},popBack:function(){var e=this.nodes.pop();if(e)if(e.disconnect(),this.nodes.length){var i=this.nodes[this.nodes.length-1];i.disconnect(),i.connect(this.nodeOut)}else this.nodeIn.disconnect(),this.nodeIn.connect(this.nodeOut);return e},popFront:function(){var e=this.nodes.shift();return e&&(e.disconnect(),this.nodeIn.disconnect(),this.nodeIn.connect(this.nodes[0]||this.nodeOut)),e}},walContext.Sample=function(e,i,t){this.wCtx=e,this.wBuffer=i,this.connectedTo=t?t.nodeIn:e.nodeIn,this.when=this.offset=0,this.duration=this.bufferDuration=i.buffer.duration,this.fnOnended=function(){},this.loaded=this.started=this.playing=!1},walContext.Sample.prototype={connect:function(e){return e=e.nodeIn||e,e instanceof AudioNode&&(this.connectedTo=e,this.source&&this.source.connect(e)),this},disconnect:function(){return this.source&&(this.source.disconnect(),this.connectedTo=null),this},load:function(){return this.loaded||(this.loaded=!0,this.source=this.wCtx.ctx.createBufferSource(),this.source.buffer=this.wBuffer.buffer,this.source.onended=this.onended.bind(this),this.connectedTo&&this.source.connect(this.connectedTo)),this},start:function(e,i,t){function s(){++n.wCtx.nbPlaying,n.playing=!0}if(this.loaded)if(this.started)console.warn("WebAudio Library: can not start a sample twice.");else{var n=this;this.started=!0,e=void 0!==e?e:this.when,this.source.start(this.wCtx.ctx.currentTime+e,void 0!==i?i:this.offset,void 0!==t?t:this.duration),e?this.playTimeoutId=setTimeout(s,1e3*e):s()}else console.warn("WebAudio Library: can not start an unloaded sample.");return this},stop:function(){return this.started&&(this.source.onended=null,this.source.stop(0),this.onended()),this},getEndTime:function(){return this.when+this.duration},onended:function(e){return"function"==typeof e?this.fnOnended=e:this.loaded&&(this.playing&&(this.playing=!1,--this.wCtx.nbPlaying),this.started&&(this.started=!1,clearTimeout(this.playTimeoutId)),this.loaded=!1,this.source=null,this.fnOnended()),this}},function(){function e(i){for(var t,s=i.firstChild;null!==s;)e(t=s),s=s.nextSibling,1!==t.nodeType&&/^\s*$/.test(t.textContent)&&i.removeChild(t)}var i=$("#app"),t=Handlebars.templates;for(var s in t)"_app"!==s&&Handlebars.registerPartial(s,t[s]);i.append(Handlebars.templates._app({})),e(document.body),window.ui={jqWindow:$(window),jqBody:$("body"),jqApp:i,jqAbout:$("#about"),jqVisual:$("#visual"),jqVisualCanvas:$("#visual canvas"),jqVisualClockUnits:$("#visual .clock .units"),jqClockMin:$("#visual .clock > .min"),jqClockSec:$("#visual .clock > .sec"),jqClockMs:$("#visual .clock > .ms"),jqMenu:$("#menu"),jqPlay:$("#menu .btn.play"),jqStop:$("#menu .btn.stop"),jqBpmA:$("#menu .bpm .a-bpm"),jqBpmInt:$("#menu .bpm .int"),jqBpmDec:$("#menu .bpm .dec"),jqBpmList:$("#menu .bpm-list"),jqBtnTools:$("#menu .tools [data-tool]"),jqBtnMagnet:$("#menu .tools .magnet"),jqBtnSave:$("#menu .tools .save"),jqBtnAbout:$("#menu .about"),jqFiles:$("#files"),jqFileFilters:$("#files .filters"),jqFilelist:$("#files .filelist"),jqInputFile:$("#files .filelist input[type='file']"),jqGrid:$("#grid"),jqGridEm:$("#grid .emWrapper"),jqGridHeader:$("#grid .header"),jqTimeline:$("#grid .timeline"),jqTimeArrow:$("#grid .timeArrow"),jqTimeCursor:$("#grid .timeCursor"),jqTrackList:$("#grid .trackList"),jqGridCols:$("#grid .cols"),jqGridColB:$("#grid .colB"),jqTrackNames:$("#grid .trackNames"),jqTrackLines:$("#grid .trackLines"),jqTrackLinesBg:$("#grid .trackLinesBg"),jqTrackNamesExtend:$("#grid .trackNames .extend"),tool:{},tracks:[],nbTracksOn:0},ui.gridEm=parseFloat(ui.jqGrid.css("fontSize")),ui.gridColsY=ui.jqGridCols.offset().top,ui.jqVisualCanvas[0].height=ui.jqVisualCanvas.height()}(),function(){function e(){var a=t;wa.wctx.nbPlaying&&(a=wa.analyserArray,wa.analyser.getByteTimeDomainData(a)),wa.oscilloscope(s,n,a),i=requestAnimationFrame(e)}var i,t=[],s=ui.jqVisualCanvas[0],n=s.getContext("2d");ui.analyserEnabled=!1,ui.analyserToggle=function(t){"boolean"!=typeof t&&(t=!ui.analyserEnabled),ui.analyserEnabled=t,t?i=requestAnimationFrame(e):(n.clearRect(0,0,s.width,s.height),cancelAnimationFrame(i))}}(),ui.BPMem=1,ui.bpm=function(e){var i=~~e,t=Math.min(Math.round(100*(e-i)),99);ui.BPMem=e/60,ui.jqBpmInt.text(100>i?"0"+i:i),ui.jqBpmDec.text(10>t?"0"+t:t)},ui.setClockUnit=function(e){ui.jqVisualClockUnits.attr("data-unit",e),ui.currentTime(gs.currentTime())},function(){function e(e){e>0&&ui.jqTimeCursor.add(ui.jqTimeArrow).css("left",e*ui.BPMem+"em"),ui.jqTimeCursor[0].classList.toggle("visible",e>0),ui.jqTimeArrow[0].classList.toggle("visible",e>0)}function i(e){var i,t,s;"s"===gs.clockUnit?(i=~~(e/60),t=~~(e%60)):(e*=ui.BPMem,i=1+~~e,e*=4,t=1+~~e%4),t=10>t?"0"+t:t,s=Math.floor(1e3*(e-~~e)),10>s?s="00"+s:100>s&&(s="0"+s),ui.jqClockMin.text(i),ui.jqClockSec.text(t),ui.jqClockMs.text(s)}ui.currentTime=function(t){e(t),i(t)}}(),function(){function e(e,i){return Math.abs(e-i)<1e-4}function i(e){var i=e%t;return e-=i,i>s&&(e+=t),e}var t=.25,s=t/2;ui.xemFloor=function(s){var n=i(s);return s>n||e(n,s)?n:n-t},ui.xemCeil=function(s){var n=i(s);return n>s||e(n,s)?n:n+t},ui.getGridXem=function(e){var t=(e-ui.filesWidth-ui.trackNamesWidth-ui.trackLinesLeft)/ui.gridEm;return ui.isMagnetized?i(t):t}}(),ui.getTrackFromPageY=function(e){return ui.tracks[Math.floor((e-ui.gridColsY+ui.gridScrollTop)/ui.gridEm)]},ui.CSS_fileUnloaded=function(e){e.jqIcon.addClass("fa-download").removeClass("fa-question"),e.jqFile.addClass("unloaded")},ui.CSS_fileWithoutData=function(e){e.jqIcon.addClass("fa-question").removeClass("fa-download"),e.jqFile.addClass("unloaded")},ui.CSS_fileLoading=function(e){e.jqIcon.addClass("fa-refresh fa-spin").removeClass("fa-download")},ui.CSS_fileLoaded=function(e){e.jqFile.addClass("loaded").removeClass("unloaded"),e.jqIcon.remove()},ui.CSS_fileError=function(e){e.jqIcon.addClass("fa-times").removeClass("fa-refresh fa-spin")},ui.CSS_fileUsed=function(e){e.jqFile.addClass("used")},ui.CSS_fileUnused=function(e){e.jqFile.removeClass("used")},ui.newTrack=function(){ui.tracks.push(new ui.Track(this))},function(){function e(){ui.currentTime(wa.composition.currentTime()),i=requestAnimationFrame(e)}var i;ui.play=function(){ui.jqPlay[0].classList.remove("fa-play"),ui.jqPlay[0].classList.add("fa-pause"),e()},ui.pause=function(){cancelAnimationFrame(i),ui.jqPlay[0].classList.remove("fa-pause"),ui.jqPlay[0].classList.add("fa-play")},ui.stop=function(){ui.pause(),ui.currentTime(0)}}(),ui.resize=function(){ui.screenWidth=ui.jqWindow.width(),ui.screenHeight=ui.jqWindow.height(),ui.gridColsWidth=ui.jqGridCols.width(),ui.gridColsHeight=ui.jqTrackList.height(),ui.trackLinesWidth=ui.gridColsWidth-ui.trackNamesWidth,ui.updateTimeline(),ui.updateTrackLinesBg()},ui.CSS_sampleTrack=function(e){e.track.jqColLinesTrack.append(e.jqSample)},ui.CSS_sampleWhen=function(e){e.jqSample.css("left",e.wsample.when*ui.BPMem+"em")},ui.CSS_sampleSelect=function(e){e.jqSample.toggleClass("selected",e.selected)},ui.CSS_sampleDelete=function(e){e.jqSample.remove()},ui.CSS_sampleOffset=function(e){e.jqWaveform.css("marginLeft",-e.wsample.offset*ui.BPMem+"em")},ui.CSS_sampleDuration=function(e){e.jqSample.css("width",e.wsample.duration*ui.BPMem+"em"),e.jqWaveform.css("width",e.wsample.bufferDuration*ui.BPMem+"em")},ui.CSS_sampleWaveform=function(e){var i=e.canvas.width=~~(300*e.wsample.bufferDuration),t=e.canvas.height=50,s=e.canvasCtx.createImageData(i,t);e.wsample.wBuffer.drawWaveform(s,[221,221,255,255]),e.canvasCtx.putImageData(s,0,0)},ui.selectTool=function(){var e;return function(i){var t,s=ui.jqBtnTools.tool[i];s!==e&&(e&&(e.classList.remove("active"),(t=ui.tool[ui.currentTool].mouseup)&&t({})),e=s,ui.jqGrid[0].dataset.tool=ui.currentTool=i,s.classList.add("active"))}}(),ui.setFilesWidth=function(e){ui.jqFiles.css("width",e),ui.filesWidth=e=ui.jqFiles.outerWidth(),ui.gridColsWidth=ui.screenWidth-e,ui.trackLinesWidth=ui.gridColsWidth-ui.trackNamesWidth,ui.jqGrid.css("left",e),ui.jqVisual.css("width",e+ui.trackNamesWidth),ui.jqMenu.css("left",e+ui.trackNamesWidth),ui.jqVisualCanvas[0].width=ui.jqVisualCanvas.width(),ui.updateTimeline(),ui.updateTrackLinesBg()},ui.gridScrollTop=0,ui.setGridScrollTop=function(e){ui.jqGridCols[0].scrollTop=ui.gridScrollTop=0>=e?0:Math.min(e,ui.tracks.length*ui.gridEm-ui.gridColsHeight),ui.updateGridTopShadow()},ui.gridZoom=1,ui.setGridZoom=function(e,i,t){e=Math.min(Math.max(1,e),8);var s=e/ui.gridZoom;ui.gridZoom=e,ui.gridEm*=s,ui.jqGridEm.css("fontSize",e+"em"),ui.jqGrid.attr("data-sample-size",ui.gridEm<40?"small":ui.gridEm<80?"medium":"big"),ui.setGridScrollTop(-(t-(ui.gridScrollTop+t)*s)),ui.setTrackLinesLeft(i-(-ui.trackLinesLeft+i)*s),ui.updateTimeline(),ui.updateTrackLinesBg()},ui.setTrackLinesLeft=function(e){ui.trackLinesLeft=e=Math.min(~~e,0),ui.jqTrackLines.css("marginLeft",e/ui.gridEm+"em"),ui.updateGridLeftShadow()},ui.trackNamesWidth=0,ui.setTrackNamesWidth=function(e){var i,t=ui.trackNamesWidth;ui.jqTrackNames.css("width",e),ui.trackNamesWidth=e=ui.jqTrackNames.outerWidth(),ui.trackLinesWidth=ui.gridColsWidth-e,i=ui.filesWidth+e,ui.jqGridColB.css("left",e),ui.jqTimeline.css("left",e),ui.jqVisual.css("width",i),ui.jqMenu.css("left",i),ui.jqVisualCanvas[0].width=i,ui.trackLinesLeft<0&&ui.setTrackLinesLeft(ui.trackLinesLeft-(e-t)),ui.updateTimeline(),ui.updateTrackLinesBg()},ui.toggleAbout=function(e){ui.jqAbout.toggleClass("show",e)},ui.isMagnetized=!1,ui.toggleMagnetism=function(e){"boolean"!=typeof e&&(e=!ui.isMagnetized),ui.isMagnetized=e,ui.jqBtnMagnet.toggleClass("active",e)},ui.toggleTracks=function(e){for(var i,t=0,s=e.isOn&&1===ui.nbTracksOn;i=ui.tracks[t++];)i.toggle(s);e.toggle(!0)},function(){var e=2,i="rgba(0,0,0,.3)",t="px "+e+"px "+i;ui.updateGridLeftShadow=function(){var e=-ui.trackLinesLeft;ui.jqTrackNames.css("boxShadow",e?Math.min(2+e/8,5)+"px 0"+t:"none")},ui.updateGridTopShadow=function(){var e=ui.gridScrollTop;ui.jqGridHeader.css("boxShadow",e?"0px "+Math.min(2+e/8,5)+t:"none")}}(),function(){function e(e){if(e>i){var s,n="",a=i;for(i=e;a++<e;)n+="<div><span></span></div>";s=$(n),ui.jqTimeline.append(s),t.length<2&&(t=t.add(s.eq(0)))}}var i=0,t=$(ui.jqTimeArrow);ui.updateTimeline=function(){var i=ui.trackLinesLeft/ui.gridEm,s=ui.trackLinesWidth/ui.gridEm;e(Math.ceil(-i+s)),t.css("marginLeft",i+"em")}}(),function(){function e(e){var s,n,a,o=e-t,u="";for(t=Math.max(e,t),s=0;o>s;++s){for(u+="<div>",n=0;4>n;++n){for(u+="<div>",a=0;4>a;++a)u+="<div></div>";u+="</div>"}u+="</div>"}ui.jqTrackLinesBg.append(u),i=i||ui.jqTrackLinesBg.children().eq(0)}var i,t=0;ui.updateTrackLinesBg=function(){e(Math.ceil(ui.trackLinesWidth/ui.gridEm/4)+2),i.css("marginLeft",ui.trackLinesLeft/ui.gridEm%8+"em")}}(),ui.Track=function(e,i){i=i||{},this.grid=e,this.id=ui.tracks.length,this.jqColNamesTrack=$("<div class='track'>").appendTo(ui.jqTrackNames),this.jqColLinesTrack=$("<div class='track'>").appendTo(ui.jqTrackLines),this.jqColNamesTrack[0].uitrack,this.jqColLinesTrack[0].uitrack=this,this.wfilters=wa.wctx.createFilters(),this.samples=[],this.initToggle().initEditName().toggle(i.toggle!==!1).editName(i.name||"")},ui.Track.prototype={removeSample:function(e){var i=this.samples.indexOf(e);i>=0&&this.samples.splice(i,1)}},ui.Track.prototype.initEditName=function(){var e=this;return this.jqName=$("<span class='name text-overflow'>").appendTo(this.jqColNamesTrack).dblclick(this.editName.bind(this,!0)),this.jqNameInput=$("<input type='text'/>").appendTo(this.jqColNamesTrack).blur(function(){e.editName(this.value).editName(!1)}).keydown(function(i){13!==i.keyCode&&27!==i.keyCode||e.editName(13===i.keyCode?this.value:e.name).editName(!1),i.stopPropagation()}),this},ui.Track.prototype.editName=function(e){var i=this.jqNameInput[0],t="Track "+(this.id+1);return"string"==typeof e?(e=e.replace(/^\s+|\s+$/,"").replace(/\s+/g," "),e=e===t?"":e,this.jqName.toggleClass("empty",""===e).text(e||t),this.name=e):e?(this.jqColNamesTrack.addClass("editing"),i.value=this.name||t,i.focus(),i.select()):(i.blur(),this.jqColNamesTrack.removeClass("editing")),this},ui.Track.prototype.initToggle=function(){var e=this;return this.jqToggle=$("<a class='toggle'>").appendTo(this.jqColNamesTrack).on("contextmenu",!1).mousedown(function(i){0===i.button?e.toggle():2===i.button&&ui.toggleTracks(e)}),this},ui.Track.prototype.toggle=function(e){return"boolean"!=typeof e&&(e=!this.isOn),this.isOn!==e&&(this.wfilters.gain(+e),this.isOn=e,this.grid.nbTracksOn+=e?1:-1,this.jqToggle.toggleClass("on",e),this.jqColNamesTrack.add(this.jqColLinesTrack).toggleClass("off",!e)),this},function(){var e=new walContext,i=e.ctx.createAnalyser();i.fftSize=1024,e.filters.pushBack(i),window.wa={wctx:e,ctx:e.ctx,analyser:i,analyserArray:new Uint8Array(i.frequencyBinCount),composition:e.createComposition()}}(),wa.oscilloscope=function(){var e=0,i=Math.PI/2;return function(t,s,n){var a,o=0,u=t.width,r=t.height,l=n.length,c=l/2,d=u/l;for(s.globalCompositeOperation="source-in",s.fillStyle="rgba("+Math.round(255-255*e)+","+Math.round(64*e)+","+Math.round(255*e)+","+(.95-.25*(1-Math.cos(e*i)))+")",s.fillRect(0,0,u,r),e=0,s.globalCompositeOperation="source-over",s.save(),s.translate(0,r/2),s.beginPath(),s.moveTo(0,0);l>o;++o)a=(n[o]-128)/128,e=Math.max(Math.abs(a),e),a*=.5-Math.cos((c>o?o:l-o)/c*Math.PI)/2,s.lineTo(o*d,a*r);s.lineJoin="round",s.lineWidth=1+Math.round(2*e),s.strokeStyle="rgba(255,255,255,"+Math.min(.3+4*e,1)+")",s.stroke(),s.restore()}}(),window.gs={files:[],samples:[],selectedSamples:[]},gs.bpm=function(e){if(!arguments.length)return gs._bpm;var i=gs.currentTime()*ui.BPMem;gs._bpm=Math.max(20,Math.min(e,999)),ui.bpm(gs._bpm),gs.samples.forEach(function(e){e.wsample?(e.wsample.when=e.xem/ui.BPMem,ui.CSS_sampleDuration(e),ui.CSS_sampleOffset(e)):(e.savedWhen=e.xem/ui.BPMem,e.jqSample.css("width",e.savedDuration*ui.BPMem+"em"))}),gs.currentTime(i/ui.BPMem)},gs.currentTime=function(e){return arguments.length?(wa.composition.currentTime(e),void ui.currentTime(wa.composition.currentTime())):wa.composition.currentTime()},gs.playToggle=function(e){"boolean"!=typeof e&&(e=!wa.composition.isPlaying),e?gs.play():gs.pause()},gs.play=function(){!wa.composition.isPlaying&&wa.composition.wSamples.length&&gs.samples.length&&(wa.composition.play(),wa.composition.isPlaying&&(gs.isPaused=!(gs.isPlaying=!0),ui.play()))},gs.pause=function(){wa.composition.isPlaying&&(wa.composition.pause(),gs.isPaused=!(gs.isPlaying=!1),ui.pause())},gs.stop=function(){wa.composition.stop(),gs.currentTime(0),gs.isPaused=gs.isPlaying=!1,ui.stop()},function(){function e(e,i){var t=JSON.parse(i.target.result);gs.bpm(t.bpm),t.files.forEach(function(e){var i=gs.fileCreate(e);i.samplesToSet=[]}),t.tracks.forEach(function(e){for(var i=e[0];i>=ui.tracks.length;)ui.newTrack();ui.tracks[i].toggle(e[1]).editName(e[2])}),t.samples.forEach(function(e){var i=gs.sampleCreate(gs.files[e[2]]);i.gsfile.samplesToSet.push(i),i.xem=e[0],i.savedWhen=e[3],i.savedOffset=e[4],i.savedDuration=e[5],i.track=ui.tracks[e[1]],i.track.samples.push(i),ui.CSS_sampleTrack(i),i.jqSample.css("left",e[3]*ui.BPMem+"em"),i.jqSample.css("width",e[5]*ui.BPMem+"em")}),e()}gs.load=function(i){return new Promise(function(t,s){if(i){var n=new FileReader;n.onload=e.bind(null,t),n.readAsText(i)}else t()})}}(),gs.save=function(){var e={bpm:this._bpm,files:[],samples:[],tracks:[]};return gs.files.forEach(function(i){e.files.push([i.id,i.fullname,i.file?i.file.size:i.size])}),gs.samples.forEach(function(i){e.samples.push([i.xem,i.track.id,i.gsfile.id,i.wsample?i.wsample.when:i.savedWhen,i.wsample?i.wsample.offset:i.savedOffset,i.wsample?i.wsample.duration:i.savedDuration])}),ui.tracks.forEach(function(i){(i.isOn||i.samples.length||i.name||i.wfilters&&i.wfilters.length)&&e.tracks.push([i.id,i.isOn,i.name])}),{href:"data:text/plain;charset=utf-8,"+encodeURIComponent(JSON.stringify(e)),download:"s.txt"}},gs.reset=function(){return ui.tracks.forEach(function(e){e.editName(""),e.toggle(!0)}),gs.samples.forEach(function(e){gs.sampleSelect(e,!0)}),gs.samplesDelete(),gs.files.forEach(function(e){e.jqFile.remove()}),gs.files=[],this},window.onhashchange=function(){ui.toggleAbout("#about"===location.hash)},function(){function e(e,i){i=i.originalEvent.deltaY,gs.bpm(gs._bpm+(i>0?-e:i?e:0))}ui.jqBpmA.mousedown(function(){return ui.jqBpmA.toggleClass("clicked"),!1}),ui.jqBpmList.children().mousedown(function(){gs.bpm(+this.textContent)}),ui.jqBody.mousedown(function(){ui.jqBpmA.removeClass("clicked")}),ui.jqBpmInt.on("wheel",e.bind(null,1)),ui.jqBpmDec.on("wheel",e.bind(null,.01))}(),ui.jqTimeline.mouseup(function(e){gs.currentTime(ui.getGridXem(e.pageX)/ui.BPMem)}),ui.jqVisualClockUnits.click(function(e){var i=e.target.className;return"s"!==i&&"b"!==i||ui.setClockUnit(gs.clockUnit=i),!1}),function(){var e,i=!1,t={files:function(e){var i=e.pageX;ui.setFilesWidth(35>i?0:i)},trackNames:function(e){var i=e.pageX-ui.jqGrid.offset().left;ui.setTrackNamesWidth(35>i?0:i)}};$(".extend").mousedown(function(s){0===s.button&&(i=!0,ui.jqBody.addClass("cursor-ewResize"),e=t[this.dataset.mousemoveFn])}),ui.jqBody.mouseup(function(e){0===e.button&&i&&(i=!1,ui.jqBody.removeClass("cursor-ewResize"))}).mousemove(function(t){i&&e(t)})}(),ui.jqBody.on({dragover:!1,drop:function(e){e=e.originalEvent;var i=e&&e.dataTransfer,t=!1,s=[];return i.items?extractData(i.items):i.files.length?($.each(i&&i.files,function(){this.type&&"text/plain"!==this.type?s.push(this):t||(t=this,gs.reset())}),gs.load(t).then(function(){loadFile(s)})):alerte("Your browser doesn't support folders."),!1}}),function(){function e(e){return s.every(function(t){return t===e||!i.contains(t)})}var i=ui.jqFileFilters[0].classList,t="used loaded unloaded",s=t.split(" ");ui.jqFileFilters.addClass(t).on({click:!1,contextmenu:!1,mouseup:function(s){var n=s.target;"A"===n.nodeName&&(0===s.button?i.toggle(n.className):2===s.button&&(i.contains(n.className)&&e(n.className)?ui.jqFileFilters.addClass(t):(ui.jqFileFilters.removeClass(t),i.add(n.className))))}})}(),function(){function e(){t&&(ui.selectTool(t),t=null),i=!1}var i,t,s,n=0,a=0;ui.jqWindow.blur(e),ui.jqGridCols.on({wheel:function(e){return"zoom"===ui.currentTool?(ui.tool.zoom.wheel(e.originalEvent),!1):void 0},scroll:function(){ui.gridScrollTop=ui.jqGridCols[0].scrollTop,ui.updateGridTopShadow()}}),ui.jqTrackLines.on({contextmenu:!1,mousedown:function(e){if(!i){i=!0,s=ui.getGridXem(e.pageX),n=e.pageX,a=e.pageY,2===e.button&&(t=ui.currentTool,ui.selectTool("delete"));var o=ui.tool[ui.currentTool].mousedown;o&&o(e,e.target.gsSample)}}}),ui.jqBody.on({wheel:function(e){return e.ctrlKey?!1:void 0},mousemove:function(e){if(i){var t=ui.tool[ui.currentTool].mousemove,o=ui.getGridXem(e.pageX);t&&t(e,e.target.gsSample,"hand"!==ui.currentTool?(o-s)*ui.gridEm:e.pageX-n,e.pageY-a),s=o,n=e.pageX,a=e.pageY}},mouseup:function(t){if(i){var s=ui.tool[ui.currentTool].mouseup;s&&s(t,t.target.gsSample),e()}}})}(),function(){function e(){a&&ui.selectTool(a),n=a=null}function i(e){switch(e.keyCode){case m:ui.jqAbout.hasClass("show")&&(ui.toggleAbout(!1),location.hash="");break;case c:e.ctrlKey?gs.playToggle():gs.isPlaying?gs.stop():gs.play();break;case o:gs.fileStop(),gs.stop();break;case d:gs.samplesDelete();break;case g:ui.toggleMagnetism();break;case h:e.ctrlKey&&gs.samplesCopy();break;case j:e.ctrlKey&&gs.samplesPaste();break;default:return!0}}function t(i){var t=i.keyCode;T[t]=!1,t===n&&(n=null,lg(n),e())}function s(e){var t,s,d=e.keyCode;return T[d]||(T[d]=!0,i(e)&&(t=S[d],t&&t!==ui.currentTool&&(s=d===r||d===l||d===u,s&&n||(s&&(n=d,lg(n),a=ui.currentTool),ui.selectTool(t))))),d===c||d===o||d===l?!1:void 0}ui.jqWindow.blur(e),ui.jqBody.keydown(s).keyup(t);var n,a,o=8,u=16,r=17,l=18,c=32,d=46,m=27,f=66,h=67,p=68,g=71,w=72,v=77,q=83,j=86,C=90,T=[],S={};S[f]="paint",S[p]="delete",S[v]="mute",S[q]="slip",S[h]="cut",S[l]=S[w]="hand",S[u]=S[j]="select",S[r]=S[C]="zoom"}(),ui.jqPlay.click(function(){gs.fileStop(),gs.playToggle()}),ui.jqStop.click(function(){gs.fileStop(),gs.stop()}),wa.composition.onended(gs.stop),ui.jqWindow.on("resize",ui.resize),ui.jqBtnSave.click(function(){ui.jqBtnSave.attr(gs.save())}),ui.jqBtnMagnet.click(ui.toggleMagnetism),ui.jqBtnTools.tool={},ui.jqBtnTools.each(function(){ui.jqBtnTools.tool[this.dataset.tool]=this}).click(function(){ui.selectTool(this.dataset.tool)}),function(){var e;ui.tool.cut={mousedown:function(i,t){e=t},mouseup:function(i){e&&gs.samplesCut(e,ui.getGridXem(i.pageX)/ui.BPMem),e=null}}}(),ui.tool["delete"]={mousedown:function(e,i){gs.sampleDelete(i)},mousemove:function(e,i){gs.sampleDelete(i)}},ui.tool.hand={mousedown:function(){ui.jqBody.addClass("cursor-move")},mouseup:function(){ui.jqBody.removeClass("cursor-move")},mousemove:function(e,i,t,s){ui.setTrackLinesLeft(ui.trackLinesLeft+t),ui.setGridScrollTop(ui.gridScrollTop-s),ui.updateTimeline(),ui.updateTrackLinesBg()}},ui.tool.mute={mousedown:function(e,i){i&&i.mute()},mousemove:function(e,i){i&&i.mute()}},function(){var e,i,t,s;ui.tool.paint={mousedown:function(n,a){a?(t=n.target.classList.contains("start"),s=n.target.classList.contains("end"),i=t||s,i&&(ui.jqBody.addClass("cursor-ewResize"),a[t?"jqCropStart":"jqCropEnd"].addClass("hover")),e=a):gs.samplesUnselect()},mouseup:function(){e&&(gs.samplesForEach(e,function(e){wa.composition.update(e.wsample,"mv")}),i&&(e[t?"jqCropStart":"jqCropEnd"].removeClass("hover"),i=t=s=!1,ui.jqBody.removeClass("cursor-ewResize")),e=null)},mousemove:function(t,n,a,o){if(e)if(a/=ui.gridEm,i)s?gs.samplesDuration(e,a):(a=-gs.samplesDuration(e,-a))&&(gs.samplesMoveX(e,a),gs.samplesSlip(e,-a));else{gs.samplesMoveX(e,a),t=t.target;var u,r=1/0,l=t.uitrack||t.gsSample&&t.gsSample.track;l&&(e.selected?(u=l.id-e.track.id,0>u&&(gs.selectedSamples.forEach(function(e){r=Math.min(e.track.id,r)}),u=-Math.min(r,-u)),gs.selectedSamples.forEach(function(e){e.inTrack(e.track.id+u)})):e.inTrack(l.id))}}}}(),function(){var e,i,t,s,n,a,o=0,u={width:0,height:0},r=$("<div id='squareSelection'>");ui.tool.select={mousedown:function(t,s){n=!0,e=t.pageX,i=t.pageY,t.shiftKey||gs.samplesUnselect(),s&&gs.sampleSelect(s,!s.selected)},mouseup:function(){n=a=!1,r.css(u).detach()},mousemove:function(u){if(n){var l,c,d=u.pageX,m=u.pageY;if(!a&&Math.max(Math.abs(d-e),Math.abs(m-i))>5&&(++o,a=!0,t=ui.getTrackFromPageY(i).id,s=ui.getGridXem(e),r.appendTo(ui.jqTrackLines)),a){l=ui.getTrackFromPageY(m),l=l?l.id:0,c=Math.max(0,ui.getGridXem(d));var f=Math.min(t,l),h=Math.max(t,l),p=Math.min(s,c),g=Math.max(s,c);gs.samples.forEach(function(e){var i,t,s=e.track.id;if(e.wsample){if(s>=f&&h>=s&&(i=e.xem,t=i+e.wsample.duration*ui.BPMem,i>=p&&g>i||t>p&&g>=t||p>=i&&t>=g))return void(e.selected||(e.squareSelected=o,gs.sampleSelect(e,!0)));e.squareSelected===o&&gs.sampleSelect(e,!1)}}),r.css({top:f+"em",left:p+"em",width:g-p+"em",height:h-f+1+"em"})}}}}}(),function(){var e;ui.tool.slip={mousedown:function(i,t){e=t},mouseup:function(){e&&gs.samplesForEach(e,function(e){wa.composition.update(e.wsample,"mv")}),e=null},mousemove:function(i,t,s){e&&gs.samplesSlip(e,s/ui.gridEm)}}}(),function(){function e(e,i){ui.setGridZoom(ui.gridZoom*i,e.pageX-ui.filesWidth-ui.trackNamesWidth,e.pageY-ui.gridColsY)}ui.tool.zoom={wheel:function(i){e(i,i.deltaY<0?1.1:.9)},mousedown:function(i){0===i.button&&e(i,i.altKey?.7:1.3)}}}(),gs.fileCreate=function(e){var i=new gs.File(e);return i.id=gs.files.length,gs.files.push(i),ui.jqFilelist.append(i.jqFile),i},function(){var e,i=$("<div class='cursor'>");gs.filePlay=function(t){e&&e.stop(),t.isLoaded&&(t.jqCanvasWaveform.after(i.css("transitionDuration",0).css("left",0)),e=t.wbuff.createSample().onended(gs.fileStop).load().start(),setTimeout(function(){i.css("transitionDuration",t.wbuff.buffer.duration+"s").css("left","100%")},20))},gs.fileStop=function(){e&&(e.stop(),i.detach())}}(),function(){var e;ui.jqInputFile.change(function(){e&&(e.joinFile(this.files[0]),e=null)}),gs.File=function(i){var t=this;this.isLoaded=this.isLoading=!1,this.file=i.length?null:i,this.fullname=i.name||i[1],this.name=this.fullname.replace(/\.[^.]+$/,""),this.nbSamples=0,this.jqFile=$(Handlebars.templates.file(this)),this.jqIcon=this.jqFile.find(".icon"),this.jqName=this.jqFile.find(".name"),this.file?ui.CSS_fileUnloaded(this):(this.size=i[2],ui.CSS_fileWithoutData(this)),this.jqFile.on({contextmenu:!1,dragstart:this.dragstart.bind(this),mousedown:function(e){0!==e.button&&gs.fileStop()},click:function(){t.isLoaded?gs.filePlay(t):t.file?t.isLoading||t.load(gs.filePlay):(alert("Choose the file to associate or drag and drop "+t.name),e=t,ui.jqInputFile.click())}})}}(),function(){var e,i;ui.jqBody.mousemove(function(t){e&&i.css({left:t.pageX,top:t.pageY})}).mouseup(function(t){if(e){var s=ui.getTrackFromPageY(t.pageY),n=ui.getGridXem(t.pageX);i.remove(),s&&n>=0&&gs.sampleCreate(e,s.id,n),e=null}}),gs.File.prototype.dragstart=function(t){if(this.isLoaded&&!e){e=this,i=this.jqCanvasWaveform.clone();var s=i[0];s.getContext("2d").drawImage(this.jqCanvasWaveform[0],0,0,s.width,s.height),i.addClass("dragging").css({left:t.pageX,top:t.pageY}).appendTo(ui.jqBody)}return!1}}(),gs.File.prototype.joinFile=function(e){this.file=e,ui.CSS_fileUnloaded(this),this.fullname!==e.name&&(this.fullname=e.name,this.name=this.fullname.replace(/\.[^.]+$/,""),this.jqName.text(this.name)),this.samplesToSet.length&&this.load(function(e){e.samplesToSet.forEach(function(i){i.wsample=e.wbuff.createSample(),i.when(i.savedWhen),i.slip(i.savedOffset),i.duration(i.savedDuration),i.wsample.connect(i.track.wfilters),wa.composition.addSamples([i.wsample]),i.jqName.text(e.name),ui.CSS_sampleDuration(i),ui.CSS_sampleWaveform(i)})})},gs.File.prototype.load=function(e){var i=this;this.isLoading=!0,ui.CSS_fileLoading(this),wa.wctx.createBuffer(this.file).then(function(t){var s,n,a;i.wbuff=t,i.isLoaded=!0,i.isLoading=!1,ui.CSS_fileLoaded(i),i.jqCanvasWaveform=$("<canvas class='waveform'>"),s=i.jqCanvasWaveform[0],n=s.getContext("2d"),s.width=400,s.height=50,a=n.createImageData(s.width,s.height),t.drawWaveform(a,[57,57,90,255]),
n.putImageData(a,0,0),i.jqFile.prepend(s),e(i)},function(){i.isLoading=!1,ui.CSS_fileError(i),alert('At this day, the file: "'+i.fullname+'" can not be decoded by your browser.\n')})},gs.sampleCreate=function(e,i,t){var s=new gs.Sample(e,i,t);return gs.samples.push(s),ui.CSS_fileUsed(e),++e.nbSamples,s},gs.sampleSelect=function(e,i){e&&e.wsample&&e.selected!==i&&(e.select(i),i?gs.selectedSamples.push(e):gs.selectedSamples.splice(gs.selectedSamples.indexOf(e),1))},gs.sampleDelete=function(e){e&&e.wsample&&(gs.sampleSelect(e,!1),gs.samples.splice(gs.samples.indexOf(e),1),--e.gsfile.nbSamples||ui.CSS_fileUnused(e.gsfile),e["delete"]())},gs.samplesForEach=function(e,i){e&&e.wsample&&(e.selected?gs.selectedSamples.forEach(function(e){e.wsample&&i(e)}):i(e))},function(){var e,i=[];gs.samplesCopy=function(){var t=1/0,s=-(1/0);i=gs.selectedSamples.map(function(e){return t=Math.min(t,e.xem),s=Math.max(s,e.xem+e.wsample.duration*ui.BPMem),e}),ui.isMagnetized&&(t=ui.xemFloor(t),s=ui.xemCeil(s)),e=s-t},gs.samplesPaste=function(){gs.samplesUnselect(),i.forEach(function(i){var t=gs.sampleCreate(i.gsfile,i.track.id,i.xem+e);t.slip(i.wsample.offset),t.duration(i.wsample.duration),gs.sampleSelect(t,!0)}),gs.samplesCopy()}}(),gs.samplesCut=function(e,i){if(e.wsample){var t=i-e.wsample.when;gs.samplesForEach(e,function(e){e.cut(t)})}},gs.samplesDelete=function(){gs.selectedSamples.slice(0).forEach(gs.sampleDelete),gs.selectedSamples=[]},gs.samplesDuration=function(e,i){function t(e){s=Math.min(s,e.wsample.duration),i=Math.min(i,e.wsample.bufferDuration-e.wsample.duration)}var s=1/0;return e.wsample&&(i/=ui.BPMem,e.selected?gs.selectedSamples.forEach(t):t(e),0>i&&(i=-Math.min(s,-i)),gs.samplesForEach(e,function(e){e.duration(e.wsample.duration+i)})),i*ui.BPMem},gs.samplesMoveX=function(e,i){if(e.selected&&e.wsample&&0>i){var t=1/0;gs.selectedSamples.forEach(function(e){t=Math.min(t,e.xem)}),i=-Math.min(t,-i)}gs.samplesForEach(e,function(e){e.moveX(Math.max(0,e.xem+i))})},gs.samplesSlip=function(e,i){i/=ui.BPMem,gs.samplesForEach(e,function(e){e.slip(e.wsample.offset-i)})},gs.samplesUnselect=function(){gs.selectedSamples.forEach(function(e){e.select(!1)}),gs.selectedSamples=[]},gs.Sample=function(e,i,t){this.gsfile=e,this.jqSample=$(Handlebars.templates.sample(e)),this.jqWaveformWrapper=this.jqSample.find(".waveformWrapper"),this.jqWaveform=this.jqSample.find(".waveform"),this.jqName=this.jqSample.find(".name"),this.jqCropStart=this.jqSample.find(".crop.start"),this.jqCropEnd=this.jqSample.find(".crop.end"),this.canvas=this.jqWaveform[0],this.canvasCtx=this.canvas.getContext("2d");var s=this;this.jqSample.find("*").each(function(){this.gsSample=s}),e.file&&(this.wsample=e.wbuff.createSample(),this.inTrack(i),this.moveX(t),ui.CSS_sampleDuration(this),ui.CSS_sampleWaveform(this),wa.composition.addSamples([this.wsample])),this.select(!1)},gs.Sample.prototype.cut=function(e){if(this.wsample&&this.wsample.duration>e){var i=gs.sampleCreate(this.gsfile,this.track.id,(this.wsample.when+e)*ui.BPMem);i.slip(this.wsample.offset+e),i.duration(this.wsample.duration-e),this.duration(e)}},gs.Sample.prototype["delete"]=function(){this.wsample&&(this.wsample.stop(),this.track.removeSample(this),wa.composition.removeSamples([this.wsample],"rm"),ui.CSS_sampleDelete(this))},gs.Sample.prototype.duration=function(e){this.wsample&&(this.wsample.duration=Math.max(0,Math.min(e,this.wsample.bufferDuration)),ui.CSS_sampleDuration(this))},gs.Sample.prototype.inTrack=function(e){var i=ui.tracks[e];i!==this.track&&this.wsample&&(this.wsample.disconnect(),this.wsample.connect(i.wfilters),this.track&&this.track.removeSample(this),this.track=i,this.track.samples.push(this),ui.CSS_sampleTrack(this))},gs.Sample.prototype.moveX=function(e){this.wsample&&(this.xem=e,this.when(e/ui.BPMem))},gs.Sample.prototype.mute=function(){lg("sample muted (in development)")},gs.Sample.prototype.select=function(e){this.wsample&&(this.selected=e,ui.CSS_sampleSelect(this))},gs.Sample.prototype.slip=function(e){this.wsample&&(this.wsample.offset=Math.min(this.wsample.bufferDuration,Math.max(e,0)),ui.CSS_sampleOffset(this))},gs.Sample.prototype.when=function(e){this.wsample&&(this.wsample.when=e,ui.CSS_sampleWhen(this))},ui.resize(),ui.setFilesWidth(200),ui.setTrackLinesLeft(0),ui.setTrackNamesWidth(125),ui.setGridZoom(1.5,0,0),ui.analyserToggle(!0),ui.toggleMagnetism(!0),ui.updateTrackLinesBg(),gs.bpm(120),gs.currentTime(0),ui.jqBtnTools.filter("[data-tool='paint']").click(),ui.jqVisualClockUnits.find(".s").click();for(var i=0;42>i;++i)ui.newTrack();window.onhashchange();