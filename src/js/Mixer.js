!(function(window){
  'use strict';
  function Mixer(ctx){
    //this.context = ctx;
    ctx.listener.setOrientation(0, 0, -1, 0, 1, 0);
    this.destination = ctx.destination;
    // final output
    this.finalOutput = ctx.createGain();
    this.finalOutput.gain.value = .7;
    // Create master wet and dry.
    this.masterDry = ctx.createGain();
    this.masterDry.gain.value = .7;
    this.masterWet = ctx.createGain();
    this.masterWet.gain.value = .7;
    // tracks array
    this.tracks = [];
    // Solo vars
    this.soloBtns = document.querySelectorAll('.solo');
    this.muteBtns = document.querySelectorAll('.mute');
    this.soloTracks = [];
    this.mutedTracks = [];
    // Connect master dry and wet to finalOutput.
    this.masterDry.connect(this.finalOutput);
    this.masterWet.connect(this.finalOutput);
    // Connect to speakers
    this.finalOutput.connect(ctx.destination);
    // FX
    this.compressor;
    this.reverb;
    this.delay;
    /*
    // separate reverb & delay :::
    this.reverbMix = this.context.createGain();
    this.reverbMix.gain.value = 0;
    this.reverb.connect(this.reverbMix);
    this.reverbMix.connect(this.masterWet);
    this.delayMix = this.context.createGain();
    this.delayMix.gain.value = 0;
    this.delay.connect(this.delayMix);
    this.delayMix.connect(this.masterWet);
    */
  }
  Mixer.prototype.addFX = function(reverb, delay){
    this.reverb = reverb;
    this.reverb.convolverNode().connect(this.masterWet);
    this.delay = delay;
    this.delay.delayNode().connect(this.masterWet);
    //this.reverb.init(this.masterWet);
    //this.delay.init(this.masterWet);
  }
  Mixer.prototype.addCompressor = function(compressor){
    this.compressor = compressor;
    this.compressor.init(this.finalOutput, this.destination);
  }

  Mixer.prototype.updateGlobalVolume = function(val){
    this.finalOutput.gain.value = val;
    //console.log('masterDry', this.masterDry.gain.value);
  }
  Mixer.prototype.updateDryVolume = function(val){
    this.masterDry.gain.value = val;
  }
  Mixer.prototype.updateWetVolume = function(val){
    this.masterWet.gain.value =  val;
  }
  Mixer.prototype.toggleTrackMute = function(index){
    //console.log('toggleTrackMute', index);
    this.muteBtns[index].classList.toggle('on');
    this.tracks[index].toggleMute();
  }
  Mixer.prototype.toggleTrackSolo = function(index){
    let self = this;
    if (this.soloTracks.length<1){
      //make record of what tracks were muted before first solo triggered
      this.mutedTracks = this.tracks.filter(function(track) {
        return track.isMute();
      });
      console.log('this.mutedTracks', this.mutedTracks);
    }

    this.soloBtns[index].classList.toggle('on');
    this.tracks[index].toggleSolo();

    this.soloTracks = this.tracks.filter(function(track) {
      return track.isSolo();
    });
    console.log('this.soloTracks', this.soloTracks);

    // NO MORE SOLOS
    if (this.soloTracks.length<1){
      // toggle mute on all tracks
      this.tracks.forEach(function(track){
        if (track.isMute()) self.toggleTrackMute(track.getId());
      });
      // reset previously muted tracks
      this.mutedTracks.forEach(function(track){
        if (!track.isMute()) self.toggleTrackMute(track.getId());
      });
      // clear muted tracks array
      this.mutedTracks = [];
      console.log('this.mutedTracks', this.mutedTracks);
      return;
    }
    // ONE OR MORE SOLO BUTTONS ACTIVE
    // else mute un-flagged tracks
    let unsoloed = this.tracks.filter(function(track) {
      return !track.isSolo();
    });
    console.log('unsoloed', unsoloed);
    unsoloed.forEach(function(track){
      if (!track.isMute()) self.toggleTrackMute(track.getId());
    });
    // and solo flagged tracks
    this.soloTracks.forEach(function(track){
      if (track.isMute()) self.toggleTrackMute(track.getId());
    });
  }
  Mixer.prototype.soloOn = function(){
    return this.soloTracks.length>0;
  }
  Mixer.prototype.updateTrackPan = function(index,val){
    this.tracks[index].panX(val);
  }
  Mixer.prototype.updateTrackReverb = function(trackIndex, val){
    this.tracks[trackIndex].updateSendGain(0,val);
  }
  Mixer.prototype.updateTrackDelay = function(trackIndex, val){
    this.tracks[trackIndex].updateSendGain(1,val);
  }
  /*
  Mixer.prototype.updateReverbVolume = function(val){
    this.reverbMix.gain.value = val;
  }
  Mixer.prototype.updateDelayVolume = function(val){
    this.delayMix.gain.value = val;
  }
  */
  Mixer.prototype.addTrack = function(track){
    track.init(this.masterDry, this.masterWet, this.masterWet);
    track.updateSendGain(0,0); // reverb
    track.updateSendGain(1,0); // delay
    this.reverb.addSource(track.auxSend(0));
    this.delay.addSource(track.auxSend(1));
    this.tracks.push(track);
  }
  Mixer.prototype.removeTrackAtIndex = function(index){
    this.tracks[index].disconnect();
    this.tracks.splice(index,1);
  }
  Mixer.prototype.updateTrackVolume = function(index, val){
    this.tracks[index].updateVolume(val);
  }
  window.Mixer = Mixer;
}(window));
