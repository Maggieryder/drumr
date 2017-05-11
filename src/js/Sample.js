!(function(window){
  'use strict';
  function Sample(ctx, buffer, panner, output, reverb, delay){
    this.context = ctx;
    this.buffer = buffer;
    this.panner = panner;
    this.reverb = reverb;
    this.delay = delay;
    this.output = output;
  }

  Sample.prototype.init = function(){
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.panner);
    this.panner.connect(this.reverb);
    this.panner.connect(this.delay);
    this.panner.connect(this.output);
  }

  Sample.prototype.trigger = function(time){
    this.init();
    this.source.start(time);
  }
  window.Sample = Sample;
}(window));
