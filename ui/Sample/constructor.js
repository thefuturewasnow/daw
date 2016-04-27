"use strict";

ui.Sample = function( uifile ) {
	this.uifile = uifile;
	this.wbuff = uifile.wbuff;

	this.offsetEm = 0;

	this.jqSample = $( "<div class='sample'>" );
	this.jqWaveformWrapper = $( "<div class='waveformWrapper'>" )
		.appendTo( this.jqSample );
	this.jqWaveform = $( "<canvas class='waveform'>" ).appendTo( this.jqWaveformWrapper );
	var canvas = this.jqWaveform[ 0 ];
	canvas.width = ~~( this.wbuff.buffer.duration * 300 );
	canvas.height = 50;
	this.wbuff.drawWaveform( canvas, [ 0xDD, 0xDD, 0xFF, 0xFF ] );
	this.jqName = $( "<span class='text-overflow'>" )
		.text( uifile.name ).appendTo( this.jqSample );

	this.jqName[ 0 ].uisample =
	this.jqWaveformWrapper[ 0 ].uisample =
	this.jqWaveform[ 0 ].uisample = this;
};