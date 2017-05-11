
!(function(window){
  'use strict';
  function Track(ctx){
    this.context = ctx;
    this.id;
    this.sample;
    this.sourceNode;
    this.instrumentName;

    this.outputGain = ctx.createGain();
    this.sendGains = [];
    this.sendGains[0] = ctx.createGain();
    this.sendGains[1] = ctx.createGain();
    this.panner = ctx.createPanner();
    this.meter = ctx.createScriptProcessor(2048, 1, 1);

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
    this.reverbNode;
    this.delayNode;
    this.mute = false;
    this.solo = false;
  }
  Track.prototype.init = function(destination, reverbNode, delayNode){
    let self = this;
    this.destination = destination;
    this.reverbNode = reverbNode;
    this.delayNode = delayNode;
    // connect it all up!
    this.connect();
    // default settings
    this.panX(0);
    this.updateVolume(.7);
    this.updateSendGain(0,0);
    this.updateSendGain(1,0);
    this.meter.onaudioprocess = function(e) { self.processAudio(e) };
    this.renderMeter();
  }

  Track.prototype.processAudio = function(e) {
    //console.log('processAudio', e);
    let leftBuffer = e.inputBuffer.getChannelData(0);
    this.checkClipping(leftBuffer);
    /*
    var rightBuffer = e.inputBuffer.getChannelData(1);
    this.checkClipping(rightBuffer);
    */
  }
  Track.prototype.checkClipping = function(buffer) {
    let isClipping = false;
    // Iterate through buffer to check if any of the |values| exceeds 1.
    for (var i = 0; i < buffer.length; i++) {
      var absValue = Math.abs(buffer[i]);
      if (absValue >= .33) {
        isClipping = true;
        break;
      }
    }
    //console.log('isClipping', isClipping);
    if (isClipping) {
      this.lastClipTime = new Date();
    }
  }
  Track.prototype.renderMeter = function() {
    let self = this;
    let muteBtn = document.querySelectorAll('.mute')[this.id];
    let now = new Date()
    let didRecentlyClip = (now - this.lastClipTime) < 100;
    muteBtn.classList.toggle('clip', didRecentlyClip);
    requestAnimationFrame(function() { self.renderMeter() });
  }
  Track.prototype.assignId = function(id){
    this.id = id;
  }
  Track.prototype.getId = function(){
    return this.id;
  }
  Track.prototype.assignSample = function(buffer){
    this.sample = new Sample(this.context, buffer, this.panner, this.outputGain,this.sendGains[0],this.sendGains[1]);
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
    this.sendGains[0].connect(this.reverbNode);
    this.sendGains[1].connect(this.delayNode);
    this.outputGain.connect(this.meter);
    this.meter.connect(this.destination);
    this.outputGain.connect(this.destination);
  }
  Track.prototype.disconnect = function(){
    //console.log('track disconnect', this.getId());
    this.sendGains[0].disconnect(this.reverbNode);
    this.sendGains[1].disconnect(this.delayNode);
    this.outputGain.disconnect(this.meter);
    this.meter.disconnect(this.destination);
    this.outputGain.disconnect(this.destination);
  }
  window.Track = Track;
}(window));
