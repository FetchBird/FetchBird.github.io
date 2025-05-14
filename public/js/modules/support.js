import lottie from '../libs/lottie/lottie.min.js';
import { gsap } from "../libs/gsap-public/esm/all.js";
import { ScrollTrigger } from "../libs/gsap-public/esm/ScrollTrigger.js";

const seta = document.querySelector(".arrow-container");
const services = document.querySelector(".services");
const secondContainer = document.querySelector(".service-second-container");

const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    console.log('entry', entry.isIntersecting)
    if (entry.isIntersecting) {
        console.log('Elemento visível!');
        observer.unobserve(entry.target); // opcional: para de observar depois de disparar
    }
}, {
    root: null,
    threshold: 0.3
});

observer.observe(secondContainer);

// let setaLargura = seta.getBoundingClientRect().width;
// let paiLargura = seta.parentElement.getBoundingClientRect().width;
// let porcetagem = (setaLargura / paiLargura) * 100;

let porcetagem = 5

let servicesLeftUltima = services.getBoundingClientRect().left;

function setaAnimacao() {
    let setaPosicaoAtual = seta.getBoundingClientRect().left;
    let servicesLeftAtual = services.getBoundingClientRect().left;
    console.log('container', secondContainer.getBoundingClientRect().left)
    console.log('window', window.innerWidth)
    console.log('------------------------------------')
    if (servicesLeftAtual > servicesLeftUltima) {
        if (porcetagem > 5) {
            porcetagem -= 0.2
            seta.style.width = `${porcetagem}%`;
        }
    } else {
        if (porcetagem < 17) {
            porcetagem += 0.2
            seta.style.width = `${porcetagem}%`;
        }
    }
    servicesLeftUltima = servicesLeftAtual;
}

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

    // console.log('isMobileDevice', isMobileDevice())
    scrollLateral();
}