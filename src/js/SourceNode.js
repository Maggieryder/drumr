!(function(window){
  'use strict';
  function SourceNode(ctx, buffer){
    this.context = ctx;
    this.buffer = buffer;
  }

  SourceNode.prototype.init = function(){
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;
    return this.source;
  }

  window.SourceNode = SourceNode;
}(window));


let sourceNode = new SourceNode();
let source = sourceNode.init();
source.connect(this.panner);
this.panner.connect(this.destination);
