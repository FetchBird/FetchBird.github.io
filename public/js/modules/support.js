import { gsap } from "../libs/gsap-public/esm/gsap-core.js";
import lottie from '../libs/lottie/lottie.min.js';


export function setupSupport() {
    lottie.loadAnimation({
        container: document.getElementById('project'),
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: 'public/assets/images/support/project.json'
    });

    lottie.loadAnimation({
        container: document.getElementById('arrow'),
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: 'public/assets/images/support/arrow.json'
    });

    gsap.to(".arrow-line", {
        width: "500px", // ou a largura desejada
        duration: 2,
        ease: "power2.out"
    });

}