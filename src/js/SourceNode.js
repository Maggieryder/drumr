!(function(window){
  'use strict';
  function SourceNode(ctx, buffer){
    this.source = ctx.createBufferSource();
    this.source.buffer = this.buffer;
    return this.source;
  }
  window.SourceNode = SourceNode;
}(window));
