import lottie from '../libs/lottie/lottie.min.js';
import { gsap } from "../libs/gsap-public/esm/all.js";
import { ScrollTrigger } from "../libs/gsap-public/esm/ScrollTrigger.js";
import { isMobile } from '../utils/deviceDetector.js';
import { setupSlideTrigger } from "./trigger.js";


// const seta = document.querySelector(".arrow-container");
// const services = document.querySelector(".services");
// const secondContainer = document.querySelector(".service-second-container");

// const observer = new IntersectionObserver((entries) => {
//     const entry = entries[0];
//     if (entry.isIntersecting) {
//         observer.unobserve(entry.target); // opcional: para de observar depois de disparar
//     }
// }, {
//     root: null,
//     threshold: 0.3
// });

// observer.observe(secondContainer);

// // let setaLargura = seta.getBoundingClientRect().width;
// // let paiLargura = seta.parentElement.getBoundingClientRect().width;
// // let porcetagem = (setaLargura / paiLargura) * 100;

// let porcetagem = 5

// let servicesLeftUltima = services.getBoundingClientRect().left;

// function setaAnimacao() {
//     let setaPosicaoAtual = seta.getBoundingClientRect().left;
//     let servicesLeftAtual = services.getBoundingClientRect().left;
//     if (servicesLeftAtual > servicesLeftUltima) {
//         if (porcetagem > 5) {
//             porcetagem -= 0.2
//             seta.style.width = `${porcetagem}%`;
//         }
//     } else {
//         if (porcetagem < 17) {
//             porcetagem += 0.2
//             seta.style.width = `${porcetagem}%`;
//         }
//     }
//     servicesLeftUltima = servicesLeftAtual;
// }

function scrollLateral() {

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.matchMedia({
        // Para telas maiores (desktop e tablets)
        "(min-width: 768px)": function () {
            gsap.to('.services', {
                xPercent: -50,
                scrollTrigger: {
                    trigger: '.services',
                    start: "top top",
                    end: "+=100%", // duração do scroll
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    markers: false, // coloque true se quiser ver os marcadores,
                    onUpdate: (self) => {
                        // setaAnimacao();
                    }
                }
            });
        },
        // Para mobile (telas pequenas)
        "(max-width: 767px)": function () {
            // Aqui você pode desativar o efeito ou fazer uma animação mais simples
            ScrollTrigger.create({
                trigger: ".services",
                start: "top top",
                end: "+=100%",
                scrub: true,
                markers: false,
                onUpdate: (self) => {
                    // Exemplo de fade só pra não deixar em branco
                    gsap.to('.services', {
                        opacity: 1 - self.progress // só pra parecer que tá animando
                    });
                }
            });
        }
    });


}

export function setupSupport() {
    lottie.loadAnimation({
        container: document.getElementById('arrow'),
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: 'public/assets/images/support/arrow.json'
    });

    lottie.loadAnimation({
        container: document.getElementById('project'),
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: 'public/assets/images/support/project.json'
    });

    lottie.loadAnimation({
        container: document.getElementById('rocket'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'public/assets/images/support/rocket.json'
    });

    if (!isMobile()) {
        scrollLateral();
    } else {
        console.log('mobile');
        const slideContainer = document.querySelector('.slide-container');
        const sliderContainer = document.querySelector('.slider-container');
        const services = document.querySelector('.services');
        const servicesContainer = document.querySelector('.services-container');
        const firstContainer = document.querySelector('.service-first-container');
        const secondContainer = document.querySelector('.service-second-container');
        slideContainer.classList.add('slide');
        sliderContainer.classList.add('slider');
        services.classList.add('listSlides');
        servicesContainer.classList.add('slide-placeholder');
        firstContainer.classList.add('slide1');
        secondContainer.classList.add('slide2');

        setupSlideTrigger();
    }
}