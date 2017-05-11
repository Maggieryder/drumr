!(function(window){
  'use strict';
  function Delay(ctx){
    this.delay = ctx.createDelay();
    this.feedback = ctx.createGain();
    this.filter = ctx.createBiquadFilter();
    this.mixNode;
    this.isOn = false;
  }
  Delay.prototype.init = function(mixNode){
    console.log('DELAY INIT beatsecs', this.delay.delayTime.value);
    this.mixNode = mixNode;
    // this is the magic formula
    this.updateDelayTime(.25);
    this.updateFeedbackGain(.5);
    this.updateFrequency(1000);
    //this.connect();
  }
  Delay.prototype.delayNode = function(){
    return this.delay;
  }
  Delay.prototype.updateDelayTime = function(val){
    console.log('updateDelayTime', val);
    this.delay.delayTime.value = val;
  }
  Delay.prototype.updateFeedbackGain = function(val){
    console.log('updateFeedbackGain', val);
    this.feedback.gain.value = val;
  }
  Delay.prototype.updateFrequency = function(val){
    console.log('updateFrequency', val);
    this.filter.frequency.value = val;
  }
  Delay.prototype.connect = function(){
    this.delay.connect(this.feedback);
    this.feedback.connect(this.filter);
    this.filter.connect(this.delay);
    this.delay.connect(this.mixNode);
  }
  Delay.prototype.disconnect = function(){
    this.delay.disconnect(this.feedback);
    this.feedback.disconnect(this.filter);
    this.filter.disconnect(this.delay);
    this.delay.disconnect(this.mixNode);
  }
  Delay.prototype.isConnected = function(){
    return this.isOn;
  }
  Delay.prototype.toggleDelay = function(e){
    console.log('toggleDelay', e.target);
    e.target.classList.toggle('on');
    this.isOn = !this.isOn;
    this.isOn ? this.connect() : this.disconnect();
  }
  window.Delay = Delay;
}(window));
