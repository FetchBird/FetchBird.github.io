import { setupContactForm } from "./modules/contactForm.js";
import { setupSupport } from "./modules/support.js";
import { ativarFiltro } from "./modules/filter.js";
import { setupSlideTrigger } from "./modules/trigger.js";
import { ScrollButtonHandler } from "./modules/header.js";
window.onload = () => {
    const botao = document.querySelector('.btn-mobile');
    const nav = document.querySelector('nav[aria-label="nav_principal"]');
    const scrollHandler = new ScrollButtonHandler('.btn-mobile', 0.4);
    scrollHandler.init();
  
    
    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target) && !botao.contains(e.target)) {
            nav.classList.remove('on');
            botao.classList.remove('on');
        }
    });

    botao.addEventListener('click', () => {
        nav.classList.toggle('on');
        botao.classList.toggle('on');
    });

    const contactButton = document.querySelector('.btn_contato');
    setupContactForm(contactButton);
    setupSupport();
    ativarFiltro();
    setupSlideTrigger(); 
};
