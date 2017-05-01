!(function(window){
  'use strict';
  function Sample(ctx, buffer, panner, destination){
    this.context = ctx;
    this.buffer = buffer;
    this.panner = panner;
    this.destination = destination;
  }

  Sample.prototype.init = function(){
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.panner);
    this.panner.connect(this.destination);
  }

  Sample.prototype.trigger = function(time){
    this.init();
    this.source.start(time);
  }
  window.Sample = Sample;
}(window));
