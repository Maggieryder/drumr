audioContext.createSourceFromUrl = function (audioUrl, callback) {
  console.log('Downloading sound from ' + audioUrl);
  var sourceNode = audioContext.createBufferSource(),
    request = new XMLHttpRequest();
  request.open('GET', audioUrl, true);
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      console.log('Downloaded sound');
      decodeAndSetupBuffer(sourceNode, request.response, callback);
    }
  };
  request.onerror = function (e) {
    console.log('There was an error receiving the response: ' + e);
    reverbjs.networkError = e;
  };
  request.responseType = 'arraybuffer';
  request.send();
  return sourceNode;
};

function decodeAndSetupBuffer(node, arrayBuffer, callback) {
  audioContext.decodeAudioData(arrayBuffer, function (audioBuffer) {
    console.log('Finished decoding audio data.');
    node.buffer = audioBuffer;
    if (typeof callback === "function" && audioBuffer !== null) {
      callback(node);
    }
  }, function (e) {
    console.log('Could not decode audio data: ' + e);
  });
}

var reverbUrl = "http://reverbjs.org/Library/SampleBachCMinorPrelude.m4a";
reverb = context.createReverbFromUrl(url, function() {
  play(what);
});
reverbGain = context.createGain();
reverbGain.gain.value = 0.5;
reverbGain.connect(masterGain);
reverb.connect(reverbGain);

var sourceUrl = "http://reverbjs.org/Library/SampleBachCMinorPrelude.m4a";
source = context.createSourceFromUrl(sourceUrl, function() {
  source.connect(reverb);
  source.start();
  source.started = true;
})
