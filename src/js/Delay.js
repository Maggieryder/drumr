!(function(window){
  'use strict';
  function Delay(ctx){
    this.delay = ctx.createDelay();
    this.feedback = ctx.createGain();
    this.filter = ctx.createBiquadFilter();
    this.sources = [];
    this.isOn = false;
  }
  Delay.prototype.init = function(){
    console.log('DELAY INIT beatsecs', this.delay.delayTime.value);
    // this is the magic formula
    this.delay.connect(this.feedback);
    this.feedback.connect(this.filter);
    this.filter.connect(this.delay);
    // do the connexions
    this.updateDelayTime(.25);
    this.updateFeedbackGain(.5);
    this.updateFrequency(1000);
    //this.connect();
  }
  Delay.prototype.addSource = function(src){
    //console.log('DELAY ADD SOURCE', src);
    this.sources.push(src);
    //this.sources[this.sources.length-1].connect(this.delay);
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
  Delay.prototype.kill = function(){
    this.delay.disconnect();
    this.feedback.disconnect();
    this.filter.disconnect();
    this.disconnect();
  }
  Delay.prototype.connect = function(){
    let self = this;
    this.sources.forEach(function(src){
      console.log('CONNECT source', src);
      src.connect(self.delay);
    });
  }
  Delay.prototype.disconnect = function(){
    let self = this;
    this.sources.forEach(function(src){
      console.log('DISCONNECT source', src);
      src.disconnect(self.delay);
    });
  }
  Delay.prototype.toggleDelay = function(e){
    console.log('toggleDelay', e.target);
    e.target.classList.toggle('on');
    this.isOn = !this.isOn;
    this.isOn ? this.connect() : this.disconnect();
  }
  window.Delay = Delay;
}(window));
