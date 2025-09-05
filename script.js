const video = document.getElementById('video');
let recordedBlob = null;
const downloadBtn = document.getElementById('downloadBtn');
const deleteBtn = document.getElementById('deleteBtn');

async function captureMediaDevices(mediaConstraints = {
    video: {
      width: 1280,
      height: 720
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100
    }
  }) {
  const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
  video.src = null;
  video.srcObject = stream;
  video.muted = true;
  return stream;
}

async function captureScreen(mediaConstraints = {
    video: {
      cursor: 'always',
      resizeMode: 'crop-and-scale'
    }
  }) {
  const screenStream = await navigator.mediaDevices.getDisplayMedia(mediaConstraints);
  return screenStream;
}

let recorder = null;

async function recordStream() {
  const stream = await captureMediaDevices();
  video.src = null;
  video.srcObject = stream;
  video.muted = true;

  downloadBtn.disabled = true;
  deleteBtn.disabled = true;
  recordedBlob = null;

  recorder = new MediaRecorder(stream);
  let chunks = [];

  recorder.ondataavailable = event => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    recordedBlob = blob;
    chunks = [];
    const blobUrl = URL.createObjectURL(blob);

    video.srcObject = null;
    video.src = blobUrl;
    video.muted = false;

    downloadBtn.disabled = false;
    deleteBtn.disabled = false;
  };

  recorder.start(200);
}

function stopRecording() {
  if (recorder && recorder.state !== "inactive") {
    recorder.stop();
    if (recorder.stream) {
      recorder.stream.getTracks().forEach(track => track.stop());
    }
  }
}

async function recordScreenAndAudio() {
  const screenStream = await captureScreen();
  const audioStream = await captureMediaDevices({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100
    },
    video: false
  });

  const stream = new MediaStream([
    ...screenStream.getTracks(),
    ...audioStream.getTracks()
  ]);

  video.src = null;
  video.srcObject = stream;
  video.muted = true;

  downloadBtn.disabled = true;
  deleteBtn.disabled = true;
  recordedBlob = null;

  recorder = new MediaRecorder(stream);
  let chunks = [];

  recorder.ondataavailable = event => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    recordedBlob = blob;
    chunks = [];
    const blobUrl = URL.createObjectURL(blob);

    video.srcObject = null;
    video.src = blobUrl;
    video.muted = false;

    downloadBtn.disabled = false;
    deleteBtn.disabled = false;
  };

  recorder.start(200);
}

function downloadRecording() {
  if (!recordedBlob) return;
  const url = URL.createObjectURL(recordedBlob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'recording.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

function deleteRecording() {
  recordedBlob = null;
  video.src = '';
  downloadBtn.disabled = true;
  deleteBtn.disabled = true;
}