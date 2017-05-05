!(function(window){
  'use strict';
  function Visualizer(ctx){
    this.analyser = ctx.createAnalyser();
    this.waveform;
    this.spectrum;
    this.analyser.smoothingTimeConstant = 0.6;
    this.analyser.fftSize = 1024;//2048 default
  }

  Visualizer.prototype.init = function(masterGain){
    masterGain.connect(this.analyser);
    this.waveform = new Float32Array(this.analyser.frequencyBinCount);
    this.spectrum = new Uint8Array(this.analyser.frequencyBinCount);
    //this.analyser.getFloatTimeDomainData(this.waveform);
    //this.analyser.getByteFrequencyData(this.spectrum);
    this.freqData = new Float32Array(this.fftsize/2);
    this.timeData = new Float32Array(this.fftsize/2);
    this.update();
  }

  Visualizer.prototype.update = function(data){
    this.analyser.getFloatTimeDomainData(this.waveform);
    this.analyser.getByteFrequencyData(this.spectrum);
    //this.analyser.getFloatFrequencyData(this.freqData);
    //this.analyser.getFloatTimeDomainData(this.timeData);
  }
  Visualizer.prototype.renderData = function(){

  }
  window.Visualizer = Visualizer;
}(window));
