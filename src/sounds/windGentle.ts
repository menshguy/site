let noiseNode;
let filterNode;
let gainNode;

function createGentleWindSound() {
  let audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();

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
  filterNode.frequency.setValueAtTime(300, audioContext.currentTime); // Lower frequency for gentler sound

  // Create a gain node for volume control
  gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // Lower gain for softer sound

  // Connect the nodes
  noiseNode.connect(filterNode);
  filterNode.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Start the noise
  noiseNode.start();

  // Simulate gentle wind by modulating the filter frequency and gain
  simulateGentleWind(audioContext, filterNode, gainNode);

  function simulateGentleWind(audioContext: AudioContext, filterNode: BiquadFilterNode, gainNode: GainNode) {
    setInterval(() => {
      const newFreq = Math.random() * 100 + 200; // Random frequency between 200 and 300 Hz
      const newGain = Math.random() * 0.02 + 0.03; // Random gain between 0.03 and 0.05
  
      filterNode.frequency.setTargetAtTime(newFreq, audioContext.currentTime, 1);
      gainNode.gain.setTargetAtTime(newGain, audioContext.currentTime, 1);
    }, 3000); // Change every 3 seconds for a more relaxed variation
  }
}



export {createGentleWindSound}