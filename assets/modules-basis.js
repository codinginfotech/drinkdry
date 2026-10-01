class ScrollSnapSlider extends HTMLUListElement {
  constructor() {
    super();
    
    this.prevButton = this.parentNode.querySelector(".slider-buttons .slider-button--prev");
    this.nextButton = this.parentNode.querySelector(".slider-buttons .slider-button--next");
    this.indicatorContainer = this.parentNode.querySelector(".slider-indicators");
    this.isAutoplay = (this.dataset.autoplay || "false") === 'true';
    this.isLoop = (this.dataset.loop || "false") === 'true';
    this.isDraggable = (this.dataset.draggable || "false") === 'true';
    this.autoplayInterval = this.dataset.autoplayInterval ? this.dataset.autoplayInterval : 3000;

    theme.initWhenVisible({
      element: this,
      callback: this.init.bind(this),
      threshold: 200
    });
  }

  async init() {
    const { ScrollSnapSlider, ScrollSnapDraggable, ScrollSnapAutoplay, ScrollSnapLoop } = await import('mdl-scrollsnap');

    const sliderElement = this;
    const sliderSimple = new ScrollSnapSlider({ element: this });
    const draggablePlugin = new ScrollSnapDraggable(70);
    const autoplayPlugin = new ScrollSnapAutoplay(this.autoplayInterval);
    const loopPlugin = new ScrollSnapLoop();
    
    this.slider = sliderSimple;
    if (window.innerWidth > 768) {
    const hiddenSlides = this.querySelectorAll('.large-up-hide');
    hiddenSlides.forEach(slide => slide.remove());
  }

    draggablePlugin.slider = sliderSimple;
    autoplayPlugin.slider = sliderSimple;
    loopPlugin.slider = sliderSimple;

    // 🔹 Create dots dynamically (only for mobile)
    if (window.innerWidth <= 768) {
      this.createDots();
    }

    // 🔹 Buttons
    this.prevButton?.addEventListener("click", () => {
      autoplayPlugin.disableTemporarily();
      sliderSimple.slideTo(sliderSimple.slide - 1);
    });
    this.nextButton?.addEventListener("click", () => {
     
      autoplayPlugin.disableTemporarily();
      sliderSimple.slideTo(sliderSimple.slide + 1);
    });

    // 🔹 Update dots on slide
    this.slider.addEventListener("slide-stop", (e) => {
      this.updateSlideState(e);
      this.updateDots(e.detail);
    });

    if (!this.isLoop || this.isDraggable) {
      this.slider.addEventListener("slide-stop", () => {
        this.prevButton?.removeAttribute('disabled');
        this.nextButton?.removeAttribute('disabled');
        console.log(sliderSimple)
        if (sliderSimple.firstItemInView) {
         // this.prevButton?.setAttribute('disabled', 'disabled');
        }
        if (sliderSimple.lastItemInView) {
          //this.nextButton?.setAttribute('disabled', 'disabled');
        }
      });
    }

    if (this.isAutoplay) {
      this.enablePlugin(autoplayPlugin);
    }

    if (this.isLoop) {
      this.enablePlugin(loopPlugin);
    }

    if (this.isDraggable) {
      this.enablePlugin(draggablePlugin);
      if (this.isLoop) {
        this.disablePlugin(loopPlugin);
      }
      return;
    }
    this.disablePlugin(draggablePlugin);
  }


 // 🔹 Create pagination dots
createDots() {
  if (!this.indicatorContainer) {
    this.indicatorContainer = document.createElement("div");
    this.indicatorContainer.className = "slider-dots";

    const viewAll = this.parentNode.querySelector(".view-all");
    if (viewAll) {
      viewAll.insertAdjacentElement("afterend", this.indicatorContainer);
    } else {
      this.parentNode.appendChild(this.indicatorContainer);
    }
  }

  this.indicatorContainer.innerHTML = "";

  Array.from(this.children).forEach((slide, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      this.slider.slideTo(index);
    });

    this.indicatorContainer.appendChild(dot);
  });
}

  // 🔹 Update dots on scroll/slide
  updateDots(index) {
    if (!this.indicatorContainer) return;
    const dots = this.indicatorContainer.querySelectorAll(".dot");
    dots.forEach(dot => dot.classList.remove("active"));
    dots[index]?.classList.add("active");
  }
  

  updateSlideState(event) {
    const children = event.target.children; 
    if (!children || event.detail < 0 || event.detail >= children.length) {
      return; 
    }
    for (let child of children) {
      child.classList.remove('-active');
    }
    children[event.detail].classList.add('-active');
  }

  enablePlugin(plugin) {
    plugin.enable();
    this.slider.plugins.set(plugin.id, plugin);
  }

  disablePlugin(plugin) {
    plugin.disable();
    this.slider.plugins.delete(plugin.id);
  }
}
customElements.define('scroll-snap-slider', ScrollSnapSlider, { extends: 'ul' });
