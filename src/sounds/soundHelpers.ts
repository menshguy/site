function toggleSound(createWindSound: Function, audioContext: AudioContext) {
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

/** Pass this function the toggleSound function */
function createToggleElement(toggleFunction: (this: HTMLElement, ev: MouseEvent) => any) {
  document.getElementById('startButton')?.addEventListener('click', toggleFunction);
}

export {toggleSound, createToggleElement}