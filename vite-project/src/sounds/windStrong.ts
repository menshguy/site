let audioContext: AudioContext;
let noiseNode: AudioBufferSourceNode;
let filterNode: BiquadFilterNode; // Specify the type here
let gainNode: GainNode;

function createStrongWindSound() {
  audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();

  // Create a buffer for noise
  const bufferSize = 2 * audioContext.sampleRate;
  const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  // Fill the buffer with random values (white noise)
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  // Create a buffer source node
  noiseNode = audioContext.createBufferSource();
  noiseNode.buffer = noiseBuffer;
  noiseNode.loop = true;

  // Create a low-pass filter node
  filterNode = audioContext.createBiquadFilter();
  filterNode.type = 'lowpass';
  filterNode.frequency.setValueAtTime(500, audioContext.currentTime);

  // Create a gain node for volume control
  gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);

  // Connect the nodes
  noiseNode.connect(filterNode);
  filterNode.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Start the noise
  noiseNode.start();

  // Simulate wind by modulating the filter frequency and gain
  simulateWind();
}

function simulateWind() {
  setInterval(() => {
    const newFreq = Math.random() * 300 + 200; // Random frequency between 200 and 500 Hz
    const newGain = Math.random() * 0.1 + 0.15; // Random gain between 0.15 and 0.25

    filterNode.frequency.setTargetAtTime(newFreq, audioContext.currentTime, 0.5);
    gainNode.gain.setTargetAtTime(newGain, audioContext.currentTime, 0.5);
  }, 2000);
}

export { createStrongWindSound, simulateWind }