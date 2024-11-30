function toggleSound(createWindSound: Function) {
  if (!audioContext) {
    createWindSound();
  } else if (audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      console.log('Audio context resumed');
    });
  } else {
    audioContext.suspend().then(() => {
      console.log('Audio context suspended');
    });
  }
}

function createToggleElement () {
  document.getElementById('startButton').addEventListener('click', toggleSound);
}

export {toggleSound, createToggleElement}