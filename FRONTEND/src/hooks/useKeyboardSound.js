// 1. PRE-LOADING THE AUDIO FILES (Global Memory Allocation)
// We instantiate an array of native browser 'Audio' objects outside the hook function.
// This is a crucial performance practice: it loads the audio files from your '/public/sounds/' 
// directory into the browser's memory exactly ONCE when the app starts, instead of creating 
// a heavy new download request every single time the user types a single letter.
const keyStrokeSounds = [
  new Audio("/sounds/keystroke1.mp3"),
  new Audio("/sounds/keystroke2.mp3"),
  new Audio("/sounds/keystroke3.mp3"),
  new Audio("/sounds/keystroke4.mp3"),
];

/**
 * CUSTOM REACT HOOK: useKeyboardSound
 * Provides a clean, reusable function to attach interactive sound effects to chat inputs.
 */
function useKeyboardSound() {
  
  // The primary execution function exposed to your text area panels
  const playRandomKeyStrokeSound = () => {
    
    // 2. THE RANDOM SELECTION ALGORITHM
    // - 'Math.random()': Generates a random decimal number between 0 and 1 (e.g., 0.542).
    // - 'Math.random() * keyStrokeSounds.length': Multiplies it by 4 (giving a range from 0 to 3.99).
    // - 'Math.floor()': Chops off the decimal entirely, rounding down to a clean integer index: 0, 1, 2, or 3.
    const randomSound = keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];

    // 3. THE PRO UX RESET TRICK (Instant Rewind)
    // Normally, if an audio track is already playing and you tell it to '.play()' again, it will ignore you.
    // By forcefully setting '.currentTime = 0', we snap the track timeline straight back to the very 
    // first millisecond. This cuts off any previous click audio mid-air and restarts it instantly, 
    // which is absolutely required to keep up with fast typing speeds without stuttering or skipping notes!
    randomSound.currentTime = 0; 
    
    // 4. TRIGGERING NATIVE AUDIO PLAYBACK
    // Media play calls return a JavaScript Promise. Modern browsers block unsolicited background noise 
    // unless a user interacts with the page first. We append a tiny '.catch()' handler here to prevent 
    // scary red error logs from filling up your console dev-tools if a user hasn't clicked anything yet.
    randomSound.play().catch((error) => console.log("Audio play failed:", error));
  };

  // Expose the play function as an object property so components can grab it easily via destructuring
  return { playRandomKeyStrokeSound };
}

export default useKeyboardSound;