
!(function(window){
  'use strict';
  function Track(ctx){
    this.context = ctx;
    this.id;
    this.sample;
    this.instrumentName;

    this.outputGain = this.context.createGain();
    this.sendGains = [];
    this.sendGains[0] = this.context.createGain();
    this.sendGains[1] = this.context.createGain();
    this.panner = this.context.createPanner();

    this.panner.panningModel = 'equalpower';
    this.panner.distanceModel = 'linear';
    this.panner.rolloffFactor = 0;
    this.panner.coneOuterAngle = 0;
    /*this.panner.refDistance = 1;
    this.panner.maxDistance = 10000;
    this.panner.rolloffFactor = 0;
    this.panner.coneInnerAngle = 360;
    this.panner.coneOuterAngle = 0;
    this.panner.coneOuterGain = 0;*/

    this.destination;
    this.reverb;
    this.delay;
    this.mute = false;
    this.solo = false;
  }
  Track.prototype.init = function(destination, reverb, delay){
    this.destination = destination;
    this.reverb = reverb;
    this.delay = delay;
    // connect it all up!
    this.connect();
    // default settings
    this.panX(0);
    this.updateVolume(.7);
    this.updateSendGain(0,0);
    this.updateSendGain(1,0);
  }
  Track.prototype.assignId = function(id){
    this.id = id;
  }
  Track.prototype.getId = function(){
    return this.id;
  }
  Track.prototype.assignSample = function(buffer){
    this.sample = new Sample(this.context, buffer, this.panner, this.outputGain);
  }
  Track.prototype.triggerSample = function(time){
    this.sample.trigger(time);
  }
  Track.prototype.assignInstrumentName = function(index, str){
    this.instrumentName = str;
    document.querySelectorAll('.name')[index].innerHTML = str;
  }
  Track.prototype.isMute = function(){
    return this.mute;
  }
  Track.prototype.toggleMute = function(){
    //console.log('toggleMute', this.getId());
    this.isMute() ? this.connect() : this.disconnect();
    this.mute = !this.mute;
  }
  Track.prototype.isSolo = function(){
    return this.solo;
  }
  Track.prototype.toggleSolo = function(){
    this.solo = !this.solo;
  }
  Track.prototype.auxSend = function(i){
    return this.sendGains[i];
  }
  Track.prototype.updateSendGain = function(index, val){
    this.sendGains[index].gain.value = val;
  }
  Track.prototype.updateVolume = function(val){
    this.outputGain.gain.value = val;
  }
  Track.prototype.panX = function(val){
    let xpos = val,
    zpos = 1 - Math.abs(xpos);
    this.panner.setPosition(xpos, 0, zpos);
    //console.log('pan', this.panner.positionX.value, this.panner.positionZ.value);
  }
  Track.prototype.connect = function(){
    //console.log('track connect', this.getId());
    this.outputGain.connect(this.sendGains[0]);
    this.outputGain.connect(this.sendGains[1]);
    this.outputGain.connect(this.destination);
  }
  Track.prototype.disconnect = function(){
    //console.log('track disconnect', this.getId());
    this.outputGain.disconnect(this.sendGains[0]);
    this.outputGain.disconnect(this.sendGains[1]);
    this.outputGain.disconnect(this.destination);
  }
  window.Track = Track;
}(window));
