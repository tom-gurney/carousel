import extendDefaults from "@giantpeach/extend-defaults";
import {
    animationEnd
} from "cssevents";
import Debounce from "debounce";

// import "./index.scss";
class Carousel {
    constructor(options) {
        this.options = {
            autoplay: false,
            classes: {
                container: ".carousel",
                slides: ".carousel__slide"
            },
            events: {
                init: "",
                beforeTransitionOut: "",
                beforeTransitionIn: "",
                afterTransitionOut: "",
                afterTransitionIn: "",
                onResize: ""
            }
        };

        this.elements = {
            nav: {
                next: "",
                prev: ""
            }
        };

        this.state = {
            total: 0,
            current: 0
        };

        if (typeof options === "object") {
            extendDefaults(this.options, options);
        }

        this.configureElements();
        this.eventListeners();

        if (typeof this.options.events.init === "function") {
            this.options.events.init.call(this, this.state);
        }
    }

    /**
     * Configure the carousel elements
     */
    configureElements() {
        this.elements.container = document.querySelector(
            this.options.classes.container
        );
        this.elements.slides = document.querySelectorAll(
            this.options.classes.slides
        );
        this.state.total = this.elements.slides.length;
    }

    eventListeners() {
        this.elements.slides[0].classList.add("is-active");
        this.elements.slides[this.getNextSlideID()].classList.add("is-next");
        window.addEventListener("resize", Debounce(this.onResize.bind(this), 250));
    }

    getNextSlideID() {
        if (this.state.current + 1 >= this.state.total) {
            return 0;
        } else {
            return this.state.current + 1;
        }
    }

    getPrevSlideID() {
        if (this.state.current == 0) {
            return this.state.total - 1;
        } else {
            return this.state.current - 1;
        }
    }

    /**
     * Goto Slide
     * @param {int} id ID of desired slide
     */
    gotoSlide(id) {
        let currentSlide = this.elements.slides[this.state.current];
        let nextSlide = this.elements.slides[id];

        currentSlide.addEventListener(
            animationEnd,
            this.slideAnimateOut.bind(this, currentSlide)
        );
        nextSlide.addEventListener(
            animationEnd,
            this.slideAnimateIn.bind(this, nextSlide)
        );

        currentSlide.classList.add("animate-out");
        nextSlide.classList.add("animate-in");
        this.elements.container.classList.add("is-transitioning");

        this.state.current = id;

        nextSlide = this.elements.slides[this.getNextSlideID()];
        nextSlide.classList.add("is-next");
    }

    /**
     * On Animation End event for the current slide
     * @param {HTMLElement} slide Current active slide
     */
    slideAnimateOut(slide) {
        if (typeof this.options.events.beforeTransitionOut === "function") {
            this.options.events.beforeTransitionOut.call(this, this.state);
        }

        slide.classList.remove("animate-out");
        slide.classList.remove("is-active");

        slide.removeEventListener(
            animationEnd,
            this.slideAnimateOut.bind(this, slide)
        );

        if (typeof this.options.events.afterTransitionOut === "function") {
            this.options.events.afterTransitionOut.call(this, this.state);
        }
    }

    /**
     * On Animation End event for the next slide
     * @param {HTMLElement} slide Next slide
     */
    slideAnimateIn(slide) {
        if (typeof this.options.events.beforeTransitionIn === "function") {
            this.options.events.beforeTransitionIn.call(this, this.state);
        }

        slide.classList.remove("animate-in");
        slide.classList.remove("is-next");
        slide.classList.add("is-active");

        this.elements.container.classList.remove("is-transitioning");

        slide.removeEventListener(
            animationEnd,
            this.slideAnimateIn.bind(this, slide)
        );

        if (typeof this.options.events.afterTransitionIn === "function") {
            this.options.events.afterTransitionIn.call(this, this.state);
        }
    }

    onResize() {
        if (typeof this.options.events.onResize === "function") {
            this.options.events.onResize.call(this, this.state);
        }
    }
}

export default Carousel;