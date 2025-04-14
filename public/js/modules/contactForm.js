export default function contactForm() {
    const radios = document.querySelectorAll('input[name="contact"]');
    const slider = document.querySelector('.slider');
    const whatsappIcon  = document.querySelector('.whatsapp-icon-container');
    const emailIcon  = document.querySelector('.email-icon-container');

    radios.forEach((radio, index) => {
        radio.addEventListener('change', () => {
            if (index == 0) {
                slider.classList.toggle('right');
                
                whatsappIcon.querySelector('.whatsapp-icon-black').classList.toggle('active');
                whatsappIcon.querySelector('.whatsapp-icon-orange').classList.remove('active');
                
                emailIcon.querySelector('.email-icon-black').classList.remove('active');
                emailIcon.querySelector('.email-icon-orange').classList.add('active');
            } else {
                slider.classList.toggle('right');
                
                whatsappIcon.querySelector('.whatsapp-icon-black').classList.remove('active');
                whatsappIcon.querySelector('.whatsapp-icon-orange').classList.add('active');

                emailIcon.querySelector('.email-icon-black').classList.add('active');
                emailIcon.querySelector('.email-icon-orange').classList.remove('active');
                
            }
        });
    });
};