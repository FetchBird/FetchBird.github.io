import { setupContactForm } from "./modules/contactForm.js";
import { setupSupport } from "./modules/support.js";
import { ativarFiltro } from "./modules/filter.js";
import  Slide  from "./modules/Slide.js";
import { setupSlideTrigger } from "./modules/trigger.js";
import { ScrollButtonHandler } from "./modules/header.js";
import { FilterCategories } from "./modules/filterCategories.js";


window.onload = () => {
    const botao = document.querySelector('.btn-mobile');
    const nav = document.querySelector('nav[aria-label="nav_principal"]');
    const scrollHandler = new ScrollButtonHandler('.btn-mobile', 0.4);
    scrollHandler.init();

    const filterCategories = new FilterCategories('.choose');
    filterCategories.init();
  

  const slider = new Slide(".temas_slides_container", {
    slidesToScroll: 5,   // quantos slides avançar por clique
    duration: 400,        // velocidade da transição (ms)
    
  });

  const slider2 = new Slide(".slide2", {
    slidesToScroll: 5,   // quantos slides avançar por clique
    duration: 400,        // velocidade da transição (ms)
  });

  const slider3 = new Slide(".slide3", {
    slidesToScroll: 5,   // quantos slides avançar por clique
    duration: 400,        // velocidade da transição (ms)
  });

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
   


    // Função de redirecionamento
function redirectToGoogleOnClick(buttonSelector) {

    const buttons = document.querySelectorAll(buttonSelector);
  
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        window.location.href = 'https://www.google.com';
       
      });
    });
  }
  
 setTimeout(()=>{
   // Ativa nos botões
   redirectToGoogleOnClick('.hover button');
   redirectToGoogleOnClick('.cardHover button');
 },3000)

};
