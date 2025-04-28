function moveSlider(radio, slider) {
    const whatsappIcon = document.querySelector('.whatsapp-icon-container');
    const emailIcon = document.querySelector('.email-icon-container');

    if (radio.value == 'email') {
        slider.classList.remove('right');

        whatsappIcon.querySelector('.whatsapp-icon-black').classList.add('active');
        whatsappIcon.querySelector('.whatsapp-icon-orange').classList.remove('active');

        emailIcon.querySelector('.email-icon-black').classList.remove('active');
        emailIcon.querySelector('.email-icon-orange').classList.add('active');
    } else {
        slider.classList.add('right');

        whatsappIcon.querySelector('.whatsapp-icon-black').classList.remove('active');
        whatsappIcon.querySelector('.whatsapp-icon-orange').classList.add('active');

        emailIcon.querySelector('.email-icon-black').classList.add('active');
        emailIcon.querySelector('.email-icon-orange').classList.remove('active');

    }
}

function initContactMethod(radios = [], slider) {
    const radioChecked = Array.from(radios).find(x => x.checked);

    if (!radioChecked) return;

    moveSlider(radioChecked, slider);
}

function toggleContactMethod() {
    const radios = document.querySelectorAll('input[name="contact"]');
    const slider = document.querySelector('.slider');

    initContactMethod(radios, slider)

    radios.forEach((radio, index) => {
        radio.addEventListener('change', () => {
            moveSlider(radio, slider)
        });
    });
};

function toggleBudgetInput() {
    const budget = document.getElementById('budget-container');
    const select = document.getElementById('subject');
    if (!select) return;

    select.addEventListener('change', () => {
        const value = select.value;
        if (value === 'orcamento') {
            budget.classList.remove('hidden');
        } else {
            budget.classList.add('hidden');
        }
    });
}

function initiContactInfoLabel(radios, contactInfoLabel) {
    const radioChecked = Array.from(radios).find(x => x.checked);

    if (!radioChecked) return;

    if (radioChecked.value === 'email') {
        contactInfoLabel.innerText = 'Email';
    } else if (radioChecked.value === 'whatsapp') {
        contactInfoLabel.innerText = 'WhatsApp';
    }
}

function toggleContactInfoLabel() {
    const radios = document.querySelectorAll('input[name="contact"]');
    const contactInfoLabel = document.querySelector('#contact-info-container > label');

    initiContactInfoLabel(radios, contactInfoLabel);

    radios.forEach((radio, index) => {
        radio.addEventListener('change', () => {
            if (radio.value === 'email') {
                contactInfoLabel.innerText = 'Email';
            } else if (radio.value === 'whatsapp') {
                contactInfoLabel.innerText = 'WhatsApp';
            }
        })
    });
}

function toggleContactForm() {
    const dialog = document.querySelector('.contact-container');
    const body = document.querySelector('body');
    const h1 = document.querySelector('.titulo-principal');

    h1.addEventListener('click', (event) => {
        event.stopPropagation();

        if (dialog.hasAttribute('open')) {
            dialog.removeAttribute('open');
            body.classList.remove('modal-open');
        } else {
            dialog.setAttribute('open', '');
            body.classList.add('modal-open');
        }
    });

    document.addEventListener('click', (event) => {
        if (dialog.hasAttribute('open') && !dialog.contains(event.target)) {
            dialog.removeAttribute('open');
            body.classList.remove('modal-open');
        }
    });

}

// TODO: 
// input de nome: regex para apenas letras e espaços,
// condicionar o input de email/whatsapp e não só o label,
// inserir prefixo de moeda no orçamento e inserir mascaras de celular,
// validação de caracteres maximos e regex,
// limpar form quando modal fechar
export function initContactForm() {
    toggleContactForm()
    toggleContactMethod();
    toggleBudgetInput();
    toggleContactInfoLabel();
}