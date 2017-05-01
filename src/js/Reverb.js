!(function(window){
  'use strict';
  function Reverb(ctx){
    this.context = ctx;
    this.convolver = ctx.createConvolver();
    this.convolverGain = ctx.createGain();
    this.sources = [];
  }
  Reverb.prototype.init = function(){
    //console.log('REVERB INIT beatsecs');
    this.convolverGain.gain.value = 0;
    this.convolver.loop = true;
    this.convolver.normalize = true;
  }
  Reverb.prototype.loadImpulse = function(url){
    let self = this;
    this.convolverGain.gain.value = 0;
    const request = new XMLHttpRequest();
    //header('Access-Control-Allow-Origin: *');
    request.open('get', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      self.context.decodeAudioData(request.response, function(buffer) {
        //callback(buffer);
        //console.log('LOAD IMPULSE', buffer);
        self.convolver.buffer = buffer;
        self.convolverGain.gain.value = .7;
        // do the connexions
        self.connect();
      });
    };
    request.send();
  }
  Reverb.prototype.addSource = function(src){
    //console.log('REVERB ADD SOURCE', src);
    this.sources.push(src);
    this.sources[this.sources.length-1].connect(this.convolverGain);
  }
  Reverb.prototype.convolverNode = function(){
    return this.convolver;
  }
  Reverb.prototype.gainNode = function(){
    return this.convolverGain;
  }
  Reverb.prototype.kill = function(){
    this.reverb.disconnect();
  }
  Reverb.prototype.connect = function(){
    let self = this;
    this.sources.forEach(function(src){
      //console.log('CONNECT source', src);
      src.connect(self.convolverGain);
    });
    this.convolverGain.connect(this.convolver);
    //this.convolver.connect(masterGain);
  }
  Reverb.prototype.disconnect = function(){
    let self = this;
    this.sources.forEach(function(src){
      //console.log('DISCONNECT source', src);
      src.disconnect(self.convolverGain);
    });
    this.convolverGain.disconnect(this.convolver);
    //this.convolver.disconnect(masterGain);
  }
  window.Reverb = Reverb;
}(window));
