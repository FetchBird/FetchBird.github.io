import lottie from '../libs/lottie/lottie.min.js';
import { gsap } from "../libs/gsap-public/esm/all.js";
import { ScrollTrigger } from "../libs/gsap-public/esm/ScrollTrigger.js";

function animateBoxOnScroll() {
    const box = document.querySelector('.services');
    if (!box) return;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.to(box, {
                    xPercent: -50,
                    ease: "power1.out",
                    scrollTrigger: {
                        trigger: box,
                        start: "top top",
                        end: () => "+=" + window.innerHeight * 0.7,
                        scrub: 1,
                        pin: true,
                        anticipatePin: 1,
                        markers: false
                    }
                });

                observer.unobserve(box); // garante que a animação será configurada apenas uma vez
            }
        });
    }, { threshold: 0.1 });

    observer.observe(box);
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

    const seta = document.querySelector(".seta");
    const services = document.querySelector(".services");
    
    let initialWidth = 200; // px
    let maxAdditionalWidth = services.scrollWidth;

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
                        console.log('aumentando a seta')
                        const services = document.querySelector('.services');

                        const currentX = gsap.getProperty(services, "x"); // em pixels, geralmente negativo

                        const deslocamento = Math.abs(currentX); // quanto já andou pra direita
                        const newWidth = initialWidth + deslocamento; // cresce conforme anda

                        seta.style.width = `${newWidth}px`;
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