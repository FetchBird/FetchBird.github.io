import { setupContactForm } from "./modules/contactForm.js";
import { setupSupport } from "./modules/support.js";

window.onload = () => {
    const botao = document.querySelector('.btn-mobile');
    const nav = document.querySelector('nav[aria-label="nav_principal"]');

    botao.addEventListener('click', () => {
        nav.classList.toggle('on');
        botao.classList.toggle('on'); // Para ativar o estilo do X
    });

    const contactButton = document.querySelector('.btn_contato');
    setupContactForm(contactButton);
    setupSupport();
};
