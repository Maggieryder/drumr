const CTX = initAudioCtx();
//console.log('AudioCtx', CTX)
const SEQUENCER = new Sequencer(CTX);
const DELAY = new Delay(CTX);
const REVERB = new Reverb(CTX);
const MIXER = new Mixer(CTX);
const COMPRESSOR = new Compressor(CTX);

/* MOVE  THIS INTO UI.js??? */
/* NOT BEING USED
var sheet = document.createElement('style'),
	prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'],
  style = '';

document.body.appendChild(sheet);

var getTrackStyle = function (target, val) {
		//style = '';
	for (var i = 0; i < prefs.length; i++) {
		style += 'input[name='+target+']::-' + prefs[i] + '{background: linear-gradient(to right, #CBE86B 0%, #CBE86B ' + val + '%, #333 ' + val + '%, #333 100%)}';
	}
	return style;
}
/* END NOT BEING USED */

/* MOVE THIS INTO UI.js??? */
function updateInputStyle(target, val){
  //TODO get this working!!!!
  //console.log('updateInputStyle', $('input[name='+target+']'));
  $('input[name='+target+']').css(
   //{background:'-webkit-linear-gradient(left, #CBE86B 0%,#CBE86B '+val+'%, #333 '+val+'%, #333 100%);'},
   //{'background-image': '-moz-linear-gradient(left, #CBE86B 0%, #CBE86B '+val+'%, #333 '+val+'%, #333 100%)'},
   {'background-image':'linear-gradient(to right, #CBE86B 0%,#CBE86B '+val+'%, #333 '+val+'%, #333 100%)'});
}

//let soundInited = false;
let samplesToLoad;
// basic beat
let sequences = [];
sequences[0] = {steps:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], sample: null } //kick
sequences[1] = {steps:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], sample: null } //snr
sequences[2] = {steps:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0], sample: null }  //hh
sequences[3] = {steps:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0], sample: null }  //ohh

function initDrumr(buffers){
  console.log('START', sequences[0]);
  SEQUENCER.init();
  REVERB.init();
  REVERB.loadImpulse('assets/IMreverbs/FiveColumnsLong.wav'); // Currently hard coded - TODO make this dynamic
  DELAY.init();
  MIXER.addFX(REVERB,DELAY);
  MIXER.addCompressor(COMPRESSOR);

  for (let i= 0; i<buffers.length;i++){
    let track = new Track(CTX);
    track.assignId(i);
    track.assignSample(buffers[i].buffer);
    track.assignInstrumentName(i, buffers[i].name);
    MIXER.addTrack(track);
    SEQUENCER.addTrack(track);
  }
  updateInputStyle('tempo', (90/130)*100);//((120-30)/(160-30))*100)
  updateInputStyle('swing', 0);
  updateInputStyle('wet', 70);
  updateInputStyle('dry', 70);
  updateInputStyle('volume', 70);
  addListeners();
}

function initAudioCtx(){
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    console.log('Web Audio API is WORKING!!!')
    //console.log(context.sampleRate); // → 44100
    //console.log(context.destination.channelCount); // → 2
    //console.log(context.currentTime); // → 1182.5980952380953
    return context;
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
}

function loadSample(context, url, callback) {
  const request = new XMLHttpRequest();
  //header('Access-Control-Allow-Origin: *');
  request.open('get', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      callback(buffer);
    });
  };
  request.send();
}

function loadBuffers(kit){
  let buffers = [];
  samplesToLoad = kit.length -1;
  for (let i = 0;i<kit.length;i++){
    buffers[i] = {name:kit[i].name,buffer:{}};
    loadSample(CTX, kit[i].smple, function(buffer){
      //console.log(buffer);
      buffers[i].buffer = buffer;
      //console.log('samplesToLoad', samplesToLoad);
      samplesToLoad === 0 ? initDrumr(buffers) : samplesToLoad --;
    });
  }
}

function addListeners(){
  let evt = isMobile.any ? 'touchstart' : 'click';
  alert('isMobile: '+ isMobile.any+' evt is: '+evt);
  //$('window').on(evt, initSound);
  let controls = $("#controls");
  controls.find('input[name="tempo"]').on('input', updateTempo);
  controls.find('input[name="swing"]').on('input', updateSwingFactor);
  //controls.find('input[name="volume"]').on('input', updateGlobalVolume);
  //controls.find('input[name="wet"]').on('input', updateWetVolume);
  //controls.find('input[name="dry"]').on('input', updateDryVolume);
  $('.note').on(evt, onNoteTap);
  $('.mute').on(evt, onMute);
  $('.solo').on(evt, onSolo);
  $('.compressor').on(evt, toggleCompressor);
  $('.reverb').on(evt, toggleReverb);
  $('.delaytoggle').on(evt, toggleDelay);
  $('#playBtn').on(evt, function(e){
    e.preventDefault();
    let html = SEQUENCER.togglePlay();
    $(this).html(html);
  });
  $('.verb').on('change', updateReverbSend);
  $('.delay').on('change', updateDelaySend);
  $('.volume').on('change', updateTrackVolume);
  $('.pan').on('change', updateTrackPan);
  let mixer = $('#mixer');
  mixer.find('input[name="volume"]').on('input', updateGlobalVolume);
  mixer.find('input[name="wet"]').on('input', updateWetVolume);
  mixer.find('input[name="dry"]').on('input', updateDryVolume);
  let delay = $('#delay');
  delay.find('input[name="time"]').on('change', updateDelayTime);
  delay.find('input[name="feedback"]').on('change', updateFeedbackGain);
  delay.find('input[name="freq"]').on('change', updateFrequency);
  let compressor = $("#compressor");
  compressor.find('input[name="threshold"]').on('change', updateThreshold);
  compressor.find('input[name="knee"]').on('change', updateKnee);
  compressor.find('input[name="ratio"]').on('change', updateRatio);
  compressor.find('input[name="attack"]').on('change', updateAttack);
  compressor.find('input[name="release"]').on('change', updateRelease);
}
// SEQUENCER FUNCTIONS
function onNoteTap(e){
  e.preventDefault();
  let trackIndex = $(this).parent().parent().parent().parent().index();
  let beat = $(this).parent().parent().index();
  let subbeat = $(this).index();
  let step = (beat*4) + subbeat;
  $(this).toggleClass('on');
  //console.log('trackIndex', trackIndex, 'step', step);
  if (!SEQUENCER.running())
    MIXER.tracks[trackIndex].triggerSample(CTX.currentTime);
  sequenceNote(trackIndex,step);
}
function sequenceNote(index, step){
  sequences[index].steps[step] = sequences[index].steps[step]===0 ? 1 : 0;
  SEQUENCER.updateParams({sequences});
  console.log(index, 'sequence', sequences[index].steps);
}
function updateSwingFactor(e){
  let val = e.target.value;
  updateInputStyle('swing', val);
  //sheet.textContent = getTrackStyle('swing', val);
	SEQUENCER.updateParams({swingFactor:val/100});
  $('#swingMeter').html(val+'%');
}
function updateTempo(e){
  let val = e.target.value,
  tot = e.target.max - e.target.min,
  perc = (val-e.target.min)/tot;
  updateInputStyle('tempo', perc*100);
  //sheet.textContent = getTrackStyle('tempo', perc*100);
  SEQUENCER.updateParams({tempo:val});
  DELAY.updateDelayTime(SEQUENCER.secondsPerBeat()*.5);
  $('#tempoMeter').html(val+' bpm');
}
// MIXER FUNCTIONS
function updateGlobalVolume(e){
  let val = e.target.value;
  updateInputStyle('volume', val);
  //sheet.textContent = getTrackStyle('volume', val);
  MIXER.updateGlobalVolume(val/100);
  $('#volumeMeter').html(Math.round(val/10));
}
function updateDryVolume(e){
  let val = e.target.value;
  updateInputStyle('dry', val);
  //sheet.textContent = getTrackStyle('dry', val);
  MIXER.updateDryVolume(val/100);
  $('#dryMeter').html(Math.round(val/10));
}
function updateWetVolume(e){
  let val = e.target.value;
  console.log('updateWetVolume', val);
  //sheet.textContent = getTrackStyle('wet', val);
  updateInputStyle('wet', val);
  MIXER.updateWetVolume(val/100);
  $('#wetMeter').html(Math.round(val/10));
}
// REVERB FUNCTIONS
function toggleReverb(e){
  e.preventDefault();
  REVERB.toggleReverb(e);
}
function updateReverbSend(e){
  let index = $(this).parent().parent().parent().parent().index();
  let meter = $('.verbmeter')[index];
  //console.log('DELAY',e.target.value);
  MIXER.updateTrackReverb(index, e.target.value/10);
  $(meter).html(Math.round(e.target.value));
}
// DELAY FUNCTIONS
function toggleDelay(e){
  e.preventDefault();
  DELAY.toggleDelay(e);
}
function updateDelaySend(e){
  let index = $(this).parent().parent().parent().parent().index();
  let meter = $('.delaymeter')[index];
  //console.log('DELAY',e.target.value);
  MIXER.updateTrackDelay(index, e.target.value/10);
  $(meter).html(Math.round(e.target.value));
}
function updateDelayTime(e){
  let val = e.target.value;
  console.log('updateDelayTime', val);
  DELAY.updateDelayTime(SEQUENCER.secondsPerBeat()*(val/100));
  $('#timeMeter').html(val/100);
}
function updateFeedbackGain(e){
  let val = e.target.value;
  console.log('updateFeedbackGain', val);
  DELAY.updateFeedbackGain(val/100);
  $('#feedMeter').html(val/100);
}
function updateFrequency(e){
  let val = e.target.value;
  console.log('updateFrequency', val);
  DELAY.updateFrequency(val*100);
  $('#freqMeter').html(val*100);
}
// COMPRESSOR FUNCTIONS
function updateThreshold(e){
  let val = e.target.value;
  console.log('updateThreshold', val);
  COMPRESSOR.updateThreshold(val);
  $('#thresholdMeter').html(val);
}
function updateKnee(e){
  let val = e.target.value;
  console.log('updateKnee', val);
  COMPRESSOR.updateKnee(val);
  $('#kneeMeter').html(val);
}
function updateRatio(e){
  let val = e.target.value;
  console.log('updateRatio', val);
  COMPRESSOR.updateRatio(val);
  $('#ratioMeter').html(val);
}
function updateAttack(e){
  let val = e.target.value;
  console.log('updateAttack', val);
  COMPRESSOR.updateAttack(val/100);
  $('#attackMeter').html(val/100);
}
function updateRelease(e){
  let val = e.target.value;
  console.log('updateRelease', val);
  COMPRESSOR.updateRelease(val/100);
  $('#releaseMeter').html(val/100);
}
function toggleCompressor(e){
  e.preventDefault();
  COMPRESSOR.toggleCompressor(e);
}
// TRACK FUNCTIONS
function onMute(e){
  e.preventDefault();
  let $target = $(this).parent().parent().parent();
  switch ($target.attr('id')){
    case 'wetmix':
    MIXER.toggleWetMute(e);
    break;
    case 'drymix':
    MIXER.toggleDryMute(e);
    break;
    default:
    MIXER.toggleTrackMute($target.index());
    break;
  }
  //let index = $target.index();
  //console.log('MUTE track index', index);

}
function onSolo(e){
  e.preventDefault();
  let index = $(this).parent().parent().parent().index();
  //console.log('SOLO track index', index);
  MIXER.toggleTrackSolo(index);
}
function updateTrackVolume(e){
  let index = $(this).parent().parent().parent().parent().index();
  let meter = $('.trackmeter')[index];
  console.log('VOLUME',$(this).val(),'index',index);
  MIXER.updateTrackVolume(index, e.target.value/10);
  $(meter).html(Math.round(e.target.value));
}
function updateTrackPan(e){
  let index = $(this).parent().parent().parent().parent().index();
  let meter = $('.panmeter')[index];
  //console.log('PAN',e.target.value);
  MIXER.updateTrackPan(index, e.target.value*.2);
  $(meter).html(Math.round(e.target.value));
}
function updateKit(){
  // TODO load drum samples dynamically
}
