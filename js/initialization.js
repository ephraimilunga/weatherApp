import Glide from "@glidejs/glide";

// new Glide(".glide").mount();

new Glide(".glide", {
  type: "carousel",
  perView: 4,
  animationTimingFunc: "bounce",
  //autoplay: 2000,
  hoverpause: false
}).mount();
