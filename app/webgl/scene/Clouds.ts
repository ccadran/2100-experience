import gsap from "gsap";

export default class CloudsTransition {
  clouds: HTMLElement[];
  cloudsContainer: HTMLElement;
  cloudsTimeline: gsap.core.Timeline;
  constructor() {
    const cloud1 = document.querySelector(
      ".clouds-transition .cloud:nth-of-type(1)"
    ) as HTMLElement;
    const cloud2 = document.querySelector(
      ".clouds-transition .cloud:nth-of-type(2)"
    ) as HTMLElement;
    const cloud3 = document.querySelector(
      ".clouds-transition .cloud:nth-of-type(3)"
    ) as HTMLElement;
    const cloud4 = document.querySelector(
      ".clouds-transition .cloud:nth-of-type(4)"
    ) as HTMLElement;

    const cloudsContainer = document.querySelector(
      ".clouds-transition"
    ) as HTMLElement;

    this.clouds = [cloud1, cloud2, cloud3, cloud4];
    this.cloudsContainer = cloudsContainer;
    this.cloudsContainer.style.display = "block";

    this.cloudsTimeline = gsap.timeline({ paused: true });

    this.cloudsTimeline
      .fromTo(
        this.clouds[0]!,
        { x: "100%" },
        { x: "0%", duration: 0.75, ease: "power2.out" },
        0
      )
      .fromTo(
        this.clouds[1]!,
        { x: "-100%" },
        { x: "0%", duration: 0.75, ease: "power2.out" },
        0.15
      )
      .fromTo(
        this.clouds[2]!,
        { x: "120%" },
        { x: "0%", duration: 0.75, ease: "power2.out" },
        0.25
      )
      .fromTo(
        this.clouds[3]!,
        { x: "100%" },
        { x: "0%", duration: 0.75, ease: "power2.out" },
        0.3
      );
  }

  async showClouds() {
    await this.cloudsTimeline.play(0).then();
  }

  async hideClouds() {
    await this.cloudsTimeline.reverse().then();
  }
}
