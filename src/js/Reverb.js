!(function(window){
  'use strict';
  function Reverb(ctx){
    this.context = ctx;
    this.convolver = ctx.createConvolver();
    this.convolverGain = ctx.createGain();
    this.mixNode;
    this.isOn = false;
  }
  Reverb.prototype.init = function(mixNode){
    //console.log('REVERB INIT beatsecs');
    this.mixNode = mixNode;
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
        //console.log('LOAD IMPULSE', buffer);
        self.convolver.buffer = buffer;
        self.convolverGain.gain.value = .7;
        // do the connexions
        //self.connect();
      });
    };
    request.send();
  }
  Reverb.prototype.convolverNode = function(){
    return this.convolver;
  }
  Reverb.prototype.gainNode = function(){
    return this.convolverGain;
  }
  Reverb.prototype.connect = function(){
    this.convolverGain.connect(this.convolver);
    this.convolver.connect(this.mixNode);
  }
  Reverb.prototype.disconnect = function(){
    this.convolverGain.disconnect(this.convolver);
    this.convolver.disconnect(this.mixNode);
  }
  Reverb.prototype.isConnected = function(){
    return this.isOn;
  }
  Reverb.prototype.toggleReverb = function(e){
    console.log('toggleReverb', e.target);
    e.target.classList.toggle('on');
    this.isOn = !this.isOn;
    this.isOn ? this.connect() : this.disconnect();
  }
  window.Reverb = Reverb;
}(window));
