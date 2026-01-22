import {Howl, Howler} from 'howler';

// son d'ambiance
const ambient = new Howl({
  src: ['/audio/ambient.mp3'],
  loop: true,
  volume: 0.5,
  html5: true,
});

const ambientDark = new Howl({
  src: ['/audio/dark-ambient.mp3'],
  loop: true,
  volume: 0.5,
  html5: true,
});


const onboardingSound = new Howl({
  src: ['/audio/onboarding.wav'],
  volume: 0.8,
});

const revealSound = new Howl({
  src: ['/audio/appear.wav'],
  volume: 0.8,
});

const cloudsSound = new Howl({
  src: ['/audio/appear.wav'],
  volume: 0.8,
});


const cameraSound = new Howl({
    src: ['/audio/appear.wav'],
    volume: 0.8,
});


const voiceSound = new Howl({
  src: ['/audio/voice1.wav'],
  volume: 0.8,
});

const voiceSound2 = new Howl({
  src: ['/audio/voice2.wav'],
  volume: 0.8,
});

const voiceSound3 = new Howl({
  src: ['/audio/voice3.wav'],
  volume: 0.8,
});



const successSound = new Howl({
  src: ['/audio/onboarding.wav'],
  volume: 0.8,
});

const midSound = new Howl({
  src: ['/audio/voice2.wav'],
  volume: 0.8,
});

const defeatSound = new Howl({
  src: ['/audio/appear.wav'],
  volume: 0.8,
});



const isMuted = ref(false);

export const useAudio = () => {

    const initAudioContext = () => {
        if (Howler.ctx && Howler.ctx.state === 'suspended') {
            Howler.ctx.resume();
        }
    };


    // musique ambiance
    const playGoodAmbient = () => {
        ambient.stop();
        ambient.volume(0.5);
        ambient.play();
        
        if (ambientDark.playing()) {
            ambientDark.fade(ambientDark.volume(), 0, 2000);
            setTimeout(() => ambientDark.stop(), 2000);
        }
    };

    const playDarkAmbient = () => {
        ambientDark.stop();
        ambientDark.volume(0.5);
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
            revealSound.play();
        }, 300);
    };

    const playClouds = () => {
        cloudsSound.play();
    };

    const playCamera = () => {
        cameraSound.play();
    };


    // sounds onboarding voices
    const playVoice1 = () => {
        voiceSound.stop();
        voiceSound.volume(0.8);

        const id = voiceSound.play();
        setTimeout(() => {
            if (voiceSound.playing(id)) {
                voiceSound.fade(0.8, 0, 500, id);
            }
        }, 2200);

        setTimeout(() => {
            voiceSound.stop(id);
        }, 2500);
    };

    const playVoice2 = () => {
        voiceSound2.stop();
        voiceSound2.volume(0.8);

        const id = voiceSound2.play();
        setTimeout(() => {
            if (voiceSound2.playing(id)) {
                voiceSound2.fade(0.8, 0, 500, id);
            }
        }, 2200);

        setTimeout(() => {
            voiceSound2.stop(id);
        }, 2500);
    };

    const playVoice3 = () => {
        voiceSound3.stop();
        voiceSound3.volume(0.8);

        const id = voiceSound3.play();
        setTimeout(() => {
            if (voiceSound3.playing(id)) {
                voiceSound3.fade(0.8, 0, 500, id);
            }
        }, 2200);

        setTimeout(() => {
            voiceSound3.stop(id);
        }, 2500);
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
    playVoice1,
    playVoice2,
    playVoice3,
    playReveal,
    playClouds,
    playCamera,
    playSuccess,
    playMid,
    playDefeat,
    isMuted
  };
};