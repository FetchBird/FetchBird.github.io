/FETCH-BIRD
│
├── public/                        # Tudo que será servido diretamente ao navegador
│   ├── assets/
│   │   ├── images/                # Imagens, logos, ícones
│   │   └── fonts/                 # Fontes personalizadas (se houver)
│   │
│   ├── css/
│   │   ├── styles.css        # Estilos principais
│   │   ├── variables.css    # Variáveis CSS (usando custom properties)
│   │   └── sections/        # Estilos específicos para cada seção
│   │       ├── header.css
│   │       ├── about.css
│   │       ├── services.css
│   │       └── footer.css
│   │
│   ├── js/
│   │   │── libs/
│   │   |   |── animation.js       # Tudo relacionado ao GSAP
|   |   |   └── slider.js          # Swiper.js configuração
|   |   |── modules/
│   │   │   ├── header.js
│   │   │   ├── about.js
│   │   │   ├── services.js
│   │   │   └── footer.js
│   │   |── utils/                 # Funções utilitárias (ex: debounce.js, helpers.js)
│   │   └── main.js                # Script principal (inicialização)
│   │
│   ├── index.html                 # Sua única página
│   └── favicon.ico
│
├── backend/                       # Código Node.js para envio de e-mail
│   ├── mailer.js                  # Configuração do Nodemailer
│   ├── server.js                  # Express ou http server
│   └── .env                       # Senhas, chaves (SMTP, Gmail, etc.)
│
└── README.md