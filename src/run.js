"use strict";

( function() {

gs.wctx = new gswaContext();
gs.ctx = gs.wctx.ctx;
gs.composition = gs.wctx.createComposition();

ui.resize();
ui.setFilesWidth( 200 );
ui.setTrackLinesLeft( 0 );
ui.setTrackNamesWidth( 125 );
ui.setGridZoom( 1.5, 0 );
ui.btnMagnet.toggle( true );
ui.tracksBg.update();
ui.timelineLoop.toggle( false );

gs.history.reset();
gs.currentTime( 0 );
gs.compositions.init();
gs.composition.onended( gs.compositionStop );
ui.dom.btnFiles.click();
ui.dom.clockUnits.querySelector( ".s" ).click();
ui.dom.menu.querySelector( "[data-tool='paint']" ).click();

waFwk.analyser.fftSize = 256;
waFwk.analyserData = new Uint8Array( waFwk.analyser.frequencyBinCount );
waFwk.do.setBPM( 120 );

for ( var i = 0; i < 42; ++i ) {
	waFwk.do.addTrack( {} );
}

ui.trackHeight = waFwk.tracks[ 0 ].userData.elColNamesTrack.offsetHeight;
ui.visual.on();

} )();
