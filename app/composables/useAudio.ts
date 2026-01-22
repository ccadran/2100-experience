import { Howl, Howler } from "howler";

// son d'ambiance
const ambient = new Howl({
  src: ["/audio/ambient.ogg"],
  loop: true,
  volume: 0.1,
  html5: true,
});

const ambientDark = new Howl({
  src: ["/audio/dark-ambient.ogg"],
  loop: true,
  volume: 0.3,
  html5: true,
});

const onboardingSound = new Howl({
  src: ["/audio/onboarding.wav"],
  volume: 0.7,
});


const revealSounds = [
  new Howl({
    src: ["/audio/pop1.wav"],
    volume: 0.8,
  }),
  new Howl({
    src: ["/audio/pop3.wav"],
    volume: 0.8,
  }),
  new Howl({
    src: ["/audio/pop3.wav"],
    volume: 0.8,
  }),
];

const cloudsSound = new Howl({
  src: ["/audio/clouds.wav"],
  volume: 1.8,
});

const cameraSound = new Howl({
  src: ["/audio/camera.mp3"],
  volume: 0.2,
});


const successSound = new Howl({
  src: ["/audio/success.wav"],
  volume: 0.8,
});

const midSound = new Howl({
  src: ["/audio/mid.wav"],
  volume: 0.8,
});

const defeatSound = new Howl({
  src: ["/audio/defeat.wav"],
  volume: 0.8,
});

const isMuted = ref(false);

export const useAudio = () => {
  const initAudioContext = () => {
    if (Howler.ctx && Howler.ctx.state === "suspended") {
      Howler.ctx.resume();
    }
  };

  // musique ambiance
  const playGoodAmbient = () => {
    if (ambient.playing()) return;

    ambient.volume(0.1);
    ambient.play();

    if (ambientDark.playing()) {
      ambientDark.fade(ambientDark.volume(), 0, 2000);
      setTimeout(() => ambientDark.stop(), 2000);
    }
  };

  const playDarkAmbient = () => {
    if (ambientDark.playing()) return;

    ambientDark.volume(0.3);
    ambientDark.play();

    if (ambient.playing()) {
      ambient.fade(ambient.volume(), 0, 2000);
      setTimeout(() => ambient.stop(), 2000);
    }
  };

  // sounds design
  const playOnboarding = () => {
    onboardingSound.play();
  };

  const playReveal = () => {
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * revealSounds.length);
      revealSounds[randomIndex].play();
    }, 500);
  };

  const playClouds = () => {
    cloudsSound.play();
  };

  const playCamera = () => {
    setTimeout(() => {
      cameraSound.play();
    }, 300);
  };

  // success sounds

  const playSuccess = () => {
    successSound.play();
  };

  const playMid = () => {
    midSound.play();
  };

  const playDefeat = () => {
    defeatSound.play();
  };

  return {
    initAudioContext,
    playGoodAmbient,
    playDarkAmbient,
    playOnboarding,
    playReveal,
    playClouds,
    playCamera,
    playSuccess,
    playMid,
    playDefeat,
    isMuted,
  };
};
