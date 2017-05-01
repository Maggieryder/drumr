!(function(window){
  'use strict';
  function Compressor(ctx, source, destination){
    this.compressor = ctx.createDynamicsCompressor();
    this.source;
    this.destination;
    this.isCompressed;
  }
  Compressor.prototype.init = function(source, destination){
    //console.log('COMPRESSOR INIT');
    this.source = source;
    this.destination = destination;
    // set to defaults
    this.updateThreshold(-24);
    this.updateKnee(30);
    this.updateRatio(12);
    // readonly attribute: this.updateReduction(-20.0);
    this.updateAttack(0.003);
    this.updateRelease(.25);    
    console.log('this.compressor.reduction',this.compressor.reduction)
    //this.connect();
  }
  Compressor.prototype.updateThreshold = function(val){
    //console.log('updateThreshold', val);
    this.compressor.threshold.value = val;
  }
  Compressor.prototype.updateKnee = function(val){
    //console.log('updateKnee', val);
    this.compressor.knee.value = val;
  }
  Compressor.prototype.updateRatio = function(val){
    //console.log('updateRatio', val);
    this.compressor.ratio.value = val;
  }
  Compressor.prototype.updateReduction = function(val){
    //console.log('updateReduction', val);
    //if (typeof this.compressor.reduction === 'float') {
      this.compressor.reduction = val;
    //} else {
      //this.compressor.reduction.value = val;
    //}
  }
  Compressor.prototype.updateAttack = function(val){
    //console.log('updateAttack', val);
    this.compressor.attack.value = val;
  }
  Compressor.prototype.updateRelease = function(val){
    //console.log('updateRelease', val);
    this.compressor.release.value = val;
  }
  Compressor.prototype.connect = function(){
    this.source.disconnect(this.destination);
    this.source.connect(this.compressor);
    this.compressor.connect(this.destination);
    this.isCompressed = true;
  }
  Compressor.prototype.disconnect = function(){
    this.source.disconnect(this.compressor);
    this.compressor.disconnect(this.destination);
    this.source.connect(this.destination);
    this.isCompressed = false;
  }
  Compressor.prototype.toggleCompressor = function(e){
    console.log('toggleCompressor',e.target);
    e.target.classList.toggle('on');
    this.isCompressed = !this.isCompressed;
    console.log('compressed',this.isCompressed);
    (this.isCompressed) ? this.connect() : this.disconnect();
  }
  Compressor.prototype.compressorNode = function(){
    return this.compressor;
  }
  window.Compressor = Compressor;
}(window));
