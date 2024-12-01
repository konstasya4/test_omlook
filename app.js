class ProgressBar {
  constructor(inputPercentId, checkboxHiddenId, checkboxAnimateId, circleSelector, backgroundCircleSelector) {
    this.inputPercent = document.getElementById(inputPercentId);
    this.checkboxHidden = document.getElementById(checkboxHiddenId);
    this.checkboxAnimate = document.getElementById(checkboxAnimateId);
    this.circle = document.querySelector(circleSelector);
    this.backgroundCircle = document.querySelector(backgroundCircleSelector);
    this.radius = this.circle.r.baseVal.value;
    this.circumference = 2 * Math.PI * this.radius;
    this.computedStyle = window.getComputedStyle(this.circle);
    this.currentOffset = 0;

    this.init();
  }

  init() {
    this.setSegmentLength(this.inputPercent.value);

    this.checkboxAnimate.addEventListener("change", () => {
      if (this.checkboxAnimate.checked) {
        this.startAnimation();
      } else {
        this.stopAnimation();
      }
    });

    this.inputPercent.addEventListener("input", () => {
      let percent = this.inputPercent.value;
      if (percent > 100) {
        percent = percent.toString().slice(0, 2);
      } else if (percent < 0) {
        percent = '0';
      }
      this.inputPercent.value = percent;
      this.setSegmentLength(Math.min(Math.max(percent, 0), 100));
    });

    this.checkboxHidden.addEventListener("change", this.toggleCircleVisibility.bind(this));
  }

  setSegmentLength(percent) {
    const segmentLength = (percent / 100) * this.circumference;
    this.circle.style.strokeDasharray = `${segmentLength} ${this.circumference - segmentLength}`;
  }

  startAnimation() {
    const startOffset = parseFloat(this.computedStyle.strokeDashoffset) || 0;
    const endOffset = startOffset - this.circumference;

    this.circle.style.setProperty("--dash-offset-start", `${startOffset}px`);
    this.circle.style.setProperty("--dash-offset-end", `${endOffset}px`);
    this.circle.style.animation = `dash-move 4s linear infinite`;
  }

  stopAnimation() {
    this.currentOffset = parseFloat(this.computedStyle.strokeDashoffset);
    this.circle.style.animation = "none";
    this.circle.style.strokeDashoffset = `${this.currentOffset}px`;
    this.circle.style.setProperty("--dash-offset-start", `${this.currentOffset}`);
  }

  toggleCircleVisibility() {
    const visibility = this.checkboxHidden.checked ? "hidden" : "visible";
    this.circle.style.visibility = visibility;
    this.backgroundCircle.style.visibility = visibility;
  }
}

const progressBar = new ProgressBar('input_percent', 'checkbox_hidden', 'checkbox_animate', '.foreground_circle', '.background_circle');
