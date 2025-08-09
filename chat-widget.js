// Enhanced Chat Widget Script with Form & Multi-language Support - SECURE VERSION
(function() {
    // Wait for secure config to load
    function initializeWidget() {
        if (!window.ShopifySecureChatConfig) {
            setTimeout(initializeWidget, 100);
            return;
        }

        const secureConfig = window.ShopifySecureChatConfig;
        // Language translations
        const translations = {
            'ar': {
                welcomeText: 'مرحباً 👋، كيف يمكننا مساعدتك؟',
                sendMessage: 'أرسل لنا رسالة',
                responseTime: 'نحن نرد عادة على الفور',
                fullName: 'الاسم الكامل',
                email: 'البريد الإلكتروني',
                phone: 'رقم الهاتف',
                startChat: 'بدء المحادثة',
                fillRequired: 'يرجى ملء جميع الحقول المطلوبة',
                chatPlaceholder: 'اكتب رسالتك هنا...',
                send: 'إرسال',
                initialMessage: 'مرحباً، كيف يمكنني مساعدتك اليوم؟',
                poweredBy: 'مدعوم بواسطة n8n'
            },
            'es': {
                welcomeText: '¡Hola 👋! ¿Cómo podemos ayudarte?',
                sendMessage: 'Envíanos un mensaje',
                responseTime: 'Normalmente respondemos de inmediato',
                fullName: 'Nombre completo',
                email: 'Correo electrónico',
                phone: 'Teléfono',
                startChat: 'Iniciar chat',
                fillRequired: 'Por favor, completa todos los campos requeridos',
                chatPlaceholder: 'Escribe tu mensaje aquí...',
                send: 'Enviar',
                initialMessage: 'Hola, ¿cómo puedo ayudarte hoy?',
                poweredBy: 'Desarrollado por n8n'
            },
            'de': {
                welcomeText: 'Hallo 👋, wie können wir helfen?',
                sendMessage: 'Senden Sie uns eine Nachricht',
                responseTime: 'Wir antworten normalerweise sofort',
                fullName: 'Vollständiger Name',
                email: 'E-Mail',
                phone: 'Telefon',
                startChat: 'Chat starten',
                fillRequired: 'Bitte füllen Sie alle erforderlichen Felder aus',
                chatPlaceholder: 'Geben Sie hier Ihre Nachricht ein...',
                send: 'Senden',
                initialMessage: 'Hallo, wie kann ich Ihnen heute helfen?',
                poweredBy: 'Unterstützt von n8n'
            },
            'nb': {
                welcomeText: 'Hei 👋, hvordan kan vi hjelpe?',
                sendMessage: 'Send oss en melding',
                responseTime: 'Vi svarer vanligvis med en gang',
                fullName: 'Fullt navn',
                email: 'E-post',
                phone: 'Telefon',
                startChat: 'Start chat',
                fillRequired: 'Vennligst fyll ut alle påkrevde felt',
                chatPlaceholder: 'Skriv meldingen din her...',
                send: 'Send',
                initialMessage: 'Hei, hvordan kan jeg hjelpe deg i dag?',
                poweredBy: 'Drevet av n8n'
            },
            'fr': {
                welcomeText: 'Salut 👋, comment pouvons-nous aider ?',
                sendMessage: 'Envoyez-nous un message',
                responseTime: 'Nous répondons généralement tout de suite',
                fullName: 'Nom complet',
                email: 'E-mail',
                phone: 'Téléphone',
                startChat: 'Commencer le chat',
                fillRequired: 'Veuillez remplir tous les champs requis',
                chatPlaceholder: 'Tapez votre message ici...',
                send: 'Envoyer',
                initialMessage: 'Salut, comment puis-je vous aider aujourd\'hui ?',
                poweredBy: 'Propulsé par n8n'
            },
            'en': {
                welcomeText: 'Hi 👋, how can we help?',
                sendMessage: 'Send us a message',
                responseTime: 'We typically respond right away',
                fullName: 'Full Name',
                email: 'Email',
                phone: 'Phone',
                startChat: 'Start Chat',
                fillRequired: 'Please fill all required fields',
                chatPlaceholder: 'Type your message here...',
                send: 'Send',
                initialMessage: 'Hi, how can I help you today?',
                poweredBy: 'Powered by n8n'
            }
        };

        // Detect language
        function detectLanguage() {
            const htmlLang = document.documentElement.lang;
            const navLang = navigator.language.split('-')[0];
            
            if (htmlLang && translations[htmlLang]) return htmlLang;
            if (translations[navLang]) return navLang;
            return 'en'; // fallback
        }

        const currentLang = detectLanguage();
        const t = translations[currentLang];
        const isRTL = currentLang === 'ar';

        // Create and inject styles
        const styles = `
            .n8n-chat-widget {
                --chat--color-primary: var(--n8n-chat-primary-color, #b28331);
                --chat--color-secondary: var(--n8n-chat-secondary-color, #9a7129);
                --chat--color-background: var(--n8n-chat-background-color, #ffffff);
                --chat--color-font: var(--n8n-chat-font-color, #333333);
                font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                direction: ${isRTL ? 'rtl' : 'ltr'};
            }

            .n8n-chat-widget .chat-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                display: none;
                width: 380px;
                height: 600px;
                background: var(--chat--color-background);
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(178, 131, 49, 0.15);
                border: 1px solid rgba(178, 131, 49, 0.2);
                overflow: hidden;
                font-family: inherit;
                direction: ${isRTL ? 'rtl' : 'ltr'};
                transition: width 0.3s, height 0.3s;
            }

            .n8n-chat-widget .chat-container.position-left {
                right: auto;
                left: 20px;
            }

            .n8n-chat-widget .chat-container.open {
                display: flex;
                flex-direction: column;
            }

            .n8n-chat-widget .brand-header {
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
                border-bottom: 1px solid rgba(178, 131, 49, 0.1);
                position: relative;
                direction: ${isRTL ? 'rtl' : 'ltr'};
                min-height: 64px;
            }

            .n8n-chat-widget .close-button {
                position: absolute;
                ${isRTL ? 'left: 16px' : 'right: 16px'};
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: var(--chat--color-font);
                cursor: pointer;
                padding: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s;
                font-size: 20px;
                opacity: 0.6;
                min-width: 44px;
                min-height: 44px;
            }

            .n8n-chat-widget .close-button:hover {
                opacity: 1;
            }

            .n8n-chat-widget .brand-header img {
                width: 32px;
                height: 32px;
                flex-shrink: 0;
            }

            .n8n-chat-widget .brand-header span {
                font-size: 18px;
                font-weight: 500;
                color: var(--chat--color-font);
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .n8n-chat-widget .form-container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 20px;
                text-align: center;
                width: 100%;
                max-width: 320px;
            }

            .n8n-chat-widget .welcome-text {
                font-size: 22px;
                font-weight: 600;
                color: var(--chat--color-font);
                margin-bottom: 24px;
                line-height: 1.3;
            }

            .n8n-chat-widget .contact-form {
                display: flex;
                flex-direction: column;
                gap: 16px;
                margin-bottom: 20px;
            }

            .n8n-chat-widget .form-group {
                text-align: ${isRTL ? 'right' : 'left'};
            }

            .n8n-chat-widget .form-group label {
                display: block;
                margin-bottom: 6px;
                font-size: 14px;
                font-weight: 500;
                color: var(--chat--color-font);
            }

            .n8n-chat-widget .form-group input {
                width: 100%;
                padding: 14px 12px;
                border: 1px solid rgba(178, 131, 49, 0.2);
                border-radius: 8px;
                background: var(--chat--color-background);
                color: var(--chat--color-font);
                font-family: inherit;
                font-size: 16px;
                box-sizing: border-box;
                direction: ${isRTL ? 'rtl' : 'ltr'};
                min-height: 48px;
            }

            .n8n-chat-widget .form-group input::placeholder {
                color: var(--chat--color-font);
                opacity: 0.6;
            }

            .n8n-chat-widget .form-group input:focus {
                outline: none;
                border-color: rgba(178, 131, 49, 0.3);
            }

            .n8n-chat-widget .start-chat-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                width: 100%;
                padding: 16px 24px;
                background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                transition: transform 0.3s;
                font-weight: 500;
                font-family: inherit;
                margin-bottom: 12px;
                min-height: 52px;
            }

            .n8n-chat-widget .start-chat-btn:hover {
                transform: scale(1.02);
            }

            .n8n-chat-widget .start-chat-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }

            .n8n-chat-widget .message-icon {
                width: 20px;
                height: 20px;
            }

            .n8n-chat-widget .response-text {
                font-size: 14px;
                color: var(--chat--color-font);
                opacity: 0.7;
                margin: 0;
            }

            .n8n-chat-widget .error-message {
                color: #e74c3c;
                font-size: 12px;
                margin-top: 8px;
                text-align: center;
            }

            .n8n-chat-widget .chat-interface {
                display: none;
                flex-direction: column;
                height: 100%;
            }

            .n8n-chat-widget .chat-interface.active {
                display: flex;
            }

            .n8n-chat-widget .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: var(--chat--color-background);
                display: flex;
                flex-direction: column;
                -webkit-overflow-scrolling: touch;
            }

            .n8n-chat-widget .chat-message {
                padding: 12px 16px;
                margin: 8px 0;
                border-radius: 12px;
                max-width: 80%;
                word-wrap: break-word;
                font-size: 14px;
                line-height: 1.5;
            }

            .n8n-chat-widget .chat-message.user {
                background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
                color: white;
                align-self: ${isRTL ? 'flex-start' : 'flex-end'};
                box-shadow: 0 4px 12px rgba(178, 131, 49, 0.2);
                border: none;
            }

            .n8n-chat-widget .chat-message.bot {
                background: var(--chat--color-background);
                border: 1px solid rgba(178, 131, 49, 0.2);
                color: var(--chat--color-font);
                align-self: ${isRTL ? 'flex-end' : 'flex-start'};
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }

            .n8n-chat-widget .typing-indicator span {
                height: 8px;
                width: 8px;
                background-color: #999;
                border-radius: 50%;
                display: inline-block;
                margin: 0 1px;
                animation: blink 1.4s infinite both;
            }
            .n8n-chat-widget .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
            .n8n-chat-widget .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes blink {
                0% { opacity: 0.2; }
                20% { opacity: 1; }
                100% { opacity: 0.2; }
            }

            .n8n-chat-widget .chat-input {
                padding: 16px;
                background: var(--chat--color-background);
                border-top: 1px solid rgba(178, 131, 49, 0.1);
                display: flex;
                gap: 8px;
                direction: ${isRTL ? 'rtl' : 'ltr'};
                align-items: flex-end;
            }

            .n8n-chat-widget .chat-input textarea {
                flex: 1;
                padding: 12px;
                border: 1px solid rgba(178, 131, 49, 0.2);
                border-radius: 8px;
                background: var(--chat--color-background);
                color: var(--chat--color-font);
                resize: none;
                font-family: inherit;
                font-size: 16px;
                direction: ${isRTL ? 'rtl' : 'ltr'};
                transition: border-color 0.2s, box-shadow 0.2s;
                overflow-y: hidden;
                min-height: 46px;
            }
            
            .n8n-chat-widget .chat-input textarea:focus {
                outline: none;
                border-color: rgba(178, 131, 49, 0.5);
                box-shadow: 0 0 0 3px rgba(178, 131, 49, 0.15);
            }

            .n8n-chat-widget .chat-input textarea::placeholder {
                color: var(--chat--color-font);
                opacity: 0.6;
            }

            .n8n-chat-widget .chat-input button {
                background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
                color: white;
                border: none;
                border-radius: 8px;
                padding: 0 20px;
                cursor: pointer;
                font-family: inherit;
                font-weight: 500;
                transition: filter 0.2s;
                height: 46px;
                min-width: 60px;
            }

            .n8n-chat-widget .chat-input button:hover {
                filter: brightness(1.1);
            }

            .n8n-chat-widget .chat-input button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                filter: none;
            }

            .n8n-chat-widget .chat-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                border-radius: 30px;
                background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
                color: white;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(178, 131, 49, 0.3);
                z-index: 999;
                transition: transform 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .n8n-chat-widget .chat-toggle.position-left {
                right: auto;
                left: 20px;
            }

            .n8n-chat-widget .chat-toggle:hover {
                transform: scale(1.05);
            }

            .n8n-chat-widget .chat-toggle svg {
                width: 24px;
                height: 24px;
                fill: currentColor;
            }

            .n8n-chat-widget .loading {
                opacity: 0.6;
                pointer-events: none;
            }

            /* Mobile Optimizations */
            @media (max-width: 480px) {
                .n8n-chat-widget .chat-container {
                    width: calc(100vw - 20px);
                    height: calc(100vh - 40px);
                    bottom: 10px;
                    right: 10px;
                    left: 10px;
                    border-radius: 16px;
                    max-width: none;
                    max-height: none;
                }
                
                .n8n-chat-widget .chat-container.position-left {
                    left: 10px;
                    right: 10px;
                }

                .n8n-chat-widget .chat-toggle {
                    bottom: 20px;
                    right: 20px;
                    width: 56px;
                    height: 56px;
                    border-radius: 28px;
                }

                .n8n-chat-widget .chat-toggle.position-left {
                    right: auto;
                    left: 20px;
                }

                .n8n-chat-widget .chat-toggle svg {
                    width: 22px;
                    height: 22px;
                }

                .n8n-chat-widget .brand-header {
                    padding: 12px 16px;
                    min-height: 56px;
                }

                .n8n-chat-widget .brand-header img {
                    width: 28px;
                    height: 28px;
                }

                .n8n-chat-widget .brand-header span {
                    font-size: 16px;
                }

                .n8n-chat-widget .close-button {
                    padding: 12px;
                    min-width: 48px;
                    min-height: 48px;
                    font-size: 18px;
                }

                .n8n-chat-widget .form-container {
                    padding: 16px;
                    max-width: none;
                    width: calc(100% - 32px);
                }

                .n8n-chat-widget .welcome-text {
                    font-size: 20px;
                    margin-bottom: 20px;
                }

                .n8n-chat-widget .form-group input {
                    font-size: 16px;
                    padding: 16px 12px;
                    min-height: 52px;
                }

                .n8n-chat-widget .start-chat-btn {
                    padding: 18px 24px;
                    font-size: 16px;
                    min-height: 56px;
                }

                .n8n-chat-widget .chat-messages {
                    padding: 16px;
                }

                .n8n-chat-widget .chat-message {
                    padding: 12px 14px;
                    margin: 6px 0;
                    max-width: 85%;
                    font-size: 15px;
                    line-height: 1.4;
                }

                .n8n-chat-widget .chat-input {
                    padding: 12px 16px;
                    gap: 10px;
                }

                .n8n-chat-widget .chat-input textarea {
                    font-size: 16px;
                    padding: 14px 12px;
                    min-height: 48px;
                    border-radius: 12px;
                }

                .n8n-chat-widget .chat-input button {
                    height: 48px;
                    min-width: 64px;
                    border-radius: 12px;
                    font-size: 14px;
                }
            }

            /* Very small screens */
            @media (max-width: 360px) {
                .n8n-chat-widget .chat-container {
                    width: calc(100vw - 10px);
                    height: calc(100vh - 20px);
                    bottom: 5px;
                    right: 5px;
                    left: 5px;
                    border-radius: 12px;
                }

                .n8n-chat-widget .form-container {
                    padding: 12px;
                    width: calc(100% - 24px);
                }

                .n8n-chat-widget .welcome-text {
                    font-size: 18px;
                }

                .n8n-chat-widget .chat-messages {
                    padding: 12px;
                }

                .n8n-chat-widget .chat-input {
                    padding: 10px 12px;
                }
            }

            /* Landscape mobile optimization */
            @media (max-width: 768px) and (orientation: landscape) {
                .n8n-chat-widget .chat-container {
                    width: calc(100vw - 20px);
                    height: calc(100vh - 20px);
                    bottom: 10px;
                    right: 10px;
                    left: 10px;
                    border-radius: 12px;
                }

                .n8n-chat-widget .brand-header {
                    padding: 8px 16px;
                    min-height: 48px;
                }

                .n8n-chat-widget .chat-messages {
                    padding: 12px 16px;
                }

                .n8n-chat-widget .form-container {
                    padding: 16px;
                    transform: translate(-50%, -50%) scale(0.9);
                }
            }

            /* Tablet optimizations */
            @media (min-width: 481px) and (max-width: 768px) {
                .n8n-chat-widget .chat-container {
                    width: 420px;
                    height: 650px;
                    bottom: 20px;
                    right: 20px;
                }

                .n8n-chat-widget .chat-container.position-left {
                    right: auto;
                    left: 20px;
                }
            }

            /* Ensure proper touch targets */
            @media (hover: none) and (pointer: coarse) {
                .n8n-chat-widget .close-button,
                .n8n-chat-widget .start-chat-btn,
                .n8n-chat-widget .chat-input button,
                .n8n-chat-widget .chat-toggle {
                    min-height: 44px;
                    min-width: 44px;
                }

                .n8n-chat-widget .form-group input {
                    min-height: 48px;
                }
            }
        `;

        // Sound Effects - Initialize Audio objects
        const sendSound = new Audio('https://cdn.jsdelivr.net/gh/WayneSimpson/n8n-chatbot-template@main/assets/send.mp3');
        const receiveSound = new Audio('https://cdn.jsdelivr.net/gh/WayneSimpson/n8n-chatbot-template@main/assets/receive.mp3');
        sendSound.preload = 'auto';
        receiveSound.preload = 'auto';

        // Sound Effects - Create a safe play function
        function playSound(audio) {
            audio.currentTime = 0;
            audio.play().catch(error => {
                console.warn("Audio playback prevented by browser:", error);
            });
        }

        // Load Geist font
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
        document.head.appendChild(fontLink);

        // Inject styles
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Default configuration merged with secure config
        const defaultConfig = {
    webhook: {
        url: secureConfig.webhook.url,
        route: secureConfig.webhook.route
    },
            branding: {
                logo: 'https://maroc4products.com/cdn/shop/files/UphZTEuF0AiBurH5lAtNAgQLFYjN3biYaF4SMEHJ-removebg-preview.png',
                name: 'Maroc4Products',
                welcomeText: t.welcomeText,
                responseTimeText: t.responseTime,
                poweredBy: {
                    text: t.poweredBy,
                    link: 'https://n8n.partnerlinks.io/m8a94i19zhqq?utm_source=nocodecreative.io'
                }
            },
            style: {
                primaryColor: '#b28331',
                secondaryColor: '#9a7129',
                position: 'right',
                backgroundColor: '#ffffff',
                fontColor: '#333333'
            },
        };

        // Merge user config with defaults
        const config = window.ChatWidgetConfig ? 
            {
                webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
                branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
                style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style },
                ghl: { ...defaultConfig.ghl, ...window.ChatWidgetConfig.ghl }
            } : defaultConfig;

        // Prevent multiple initializations
        if (window.N8NChatWidgetInitialized) return;
        window.N8NChatWidgetInitialized = true;

        let currentSessionId = '';
        let contactId = '';

        // Storage helper functions
        const storage = {
            save: (key, data) => {
                try {
                    localStorage.setItem(`n8n_chat_${key}`, JSON.stringify(data));
                } catch (e) {
                    console.warn('localStorage not available');
                }
            },
            load: (key) => {
                try {
                    const data = localStorage.getItem(`n8n_chat_${key}`);
                    return data ? JSON.parse(data) : null;
                } catch (e) {
                    console.warn('localStorage not available');
                    return null;
                }
            },
            remove: (key) => {
                try {
                    localStorage.removeItem(`n8n_chat_${key}`);
                } catch (e) {
                    console.warn('localStorage not available');
                }
            }
        };

        // Create widget container
        const widgetContainer = document.createElement('div');
        widgetContainer.className = 'n8n-chat-widget';
        
        // Set CSS variables for colors
        widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
        widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
        widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
        widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

        const chatContainer = document.createElement('div');
        chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
        
        const formHTML = `
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="${config.branding.name}">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="form-container">
                <h2 class="welcome-text">${config.branding.welcomeText}</h2>
                <form class="contact-form">
                    <div class="form-group">
                        <label for="fullName">${t.fullName}</label>
                        <input type="text" id="fullName" name="fullName" required>
                    </div>
                    <div class="form-group">
                        <label for="email">${t.email}</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">${t.phone}</label>
                        <input type="tel" id="phone" name="phone" required>
                    </div>
                    <div class="error-message" style="display: none;"></div>
                </form>
                <button class="start-chat-btn">
                    <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                    </svg>
                    ${t.startChat}
                </button>
                <p class="response-text">${config.branding.responseTimeText}</p>
            </div>
        `;

        const chatInterfaceHTML = `
            <div class="chat-interface">
                <div class="brand-header">
                    <img src="${config.branding.logo}" alt="${config.branding.name}">
                    <span>${config.branding.name}</span>
                    <button class="close-button">×</button>
                </div>
                <div class="chat-messages"></div>
                <div class="chat-input">
                    <textarea placeholder="${t.chatPlaceholder}" rows="1"></textarea>
                    <button type="submit">${t.send}</button>
                </div>
            </div>
        `;
        
        chatContainer.innerHTML = formHTML + chatInterfaceHTML;
        
        const toggleButton = document.createElement('button');
        toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
        toggleButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
            </svg>`;
        
        widgetContainer.appendChild(chatContainer);
        widgetContainer.appendChild(toggleButton);
        document.body.appendChild(widgetContainer);

        // Get elements
        const startChatBtn = chatContainer.querySelector('.start-chat-btn');
        const chatInterface = chatContainer.querySelector('.chat-interface');
        const messagesContainer = chatContainer.querySelector('.chat-messages');
        const textarea = chatContainer.querySelector('textarea');
        const sendButton = chatContainer.querySelector('button[type="submit"]');
        const errorMessage = chatContainer.querySelector('.error-message');
        const contactForm = chatContainer.querySelector('.contact-form');

        function generateUUID() {
            return crypto.randomUUID();
        }

        // GHL API functions
        async function searchContact(email, phone) {
            try {
                let response = await fetch(`https://services.leadconnectorhq.com/contacts/?locationId=${config.ghl.locationId}&query=${encodeURIComponent(email)}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${config.ghl.accessToken}`, 'Version': '2021-07-28' }
                });
                let data = await response.json();
                if (data.contacts && data.contacts.length > 0) return data.contacts[0].id;
                response = await fetch(`https://services.leadconnectorhq.com/contacts/?locationId=${config.ghl.locationId}&query=${encodeURIComponent(phone)}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${config.ghl.accessToken}`, 'Version': '2021-07-28' }
                });
                data = await response.json();
                if (data.contacts && data.contacts.length > 0) return data.contacts[0].id;
                return null;
            } catch (error) { console.error('Error searching contact:', error); return null; }
        }

        async function createContact(fullName, email, phone) {
            try {
                const [firstName, ...lastNameParts] = fullName.trim().split(' ');
                const lastName = lastNameParts.join(' ');
                const response = await fetch('https://services.leadconnectorhq.com/contacts/', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${config.ghl.accessToken}`, 'Content-Type': 'application/json', 'Version': '2021-07-28' },
                    body: JSON.stringify({ firstName, lastName, email, phone, locationId: config.ghl.locationId })
                });
                const data = await response.json();
                return data.contact ? data.contact.id : null;
            } catch (error) { console.error('Error creating contact:', error); return null; }
        }

        async function handleFormSubmit() {
            const fullName = contactForm.querySelector('#fullName').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const phone = contactForm.querySelector('#phone').value.trim();
            if (!fullName || !email || !phone) { showError(t.fillRequired); return; }
            startChatBtn.classList.add('loading');
            startChatBtn.disabled = true;
            try {
                let foundContactId = await searchContact(email, phone);
                if (!foundContactId) { foundContactId = await createContact(fullName, email, phone); }
                if (foundContactId) {
                    contactId = foundContactId;
                    storage.save('contactData', { fullName, email, phone, contactId });
                    await startNewConversation();
                } else { throw new Error('Failed to create/find contact'); }
            } catch (error) {
                console.error('Error handling form:', error);
                showError('An error occurred. Please try again.');
            } finally {
                startChatBtn.classList.remove('loading');
                startChatBtn.disabled = false;
            }
        }

        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            setTimeout(() => { errorMessage.style.display = 'none'; }, 5000);
        }

        async function startNewConversation() {
            currentSessionId = generateUUID();
            const initialMessageData = {
                action: "sendMessage", sessionId: currentSessionId, route: config.webhook.route,
                chatInput: "Conversation started after form submission. Please provide a welcome message.",
                metadata: { userId: contactId }
            };
            try {
                const response = await fetch(config.webhook.url, {
                    method: 'POST', 
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': config.webhook.auth
                    }, 
                    body: JSON.stringify(initialMessageData)
                });
                const responseData = await response.json();
                chatContainer.querySelector('.brand-header').style.display = 'none';
                chatContainer.querySelector('.form-container').style.display = 'none';
                chatInterface.classList.add('active');
                const botMessageDiv = document.createElement('div');
                botMessageDiv.className = 'chat-message bot';
                botMessageDiv.textContent = Array.isArray(responseData) ? responseData[0].output || t.initialMessage : responseData.output || t.initialMessage;
                messagesContainer.appendChild(botMessageDiv);
                playSound(receiveSound);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                storage.save('sessionData', {
                    sessionId: currentSessionId, contactId: contactId,
                    messages: [{ type: 'bot', content: botMessageDiv.textContent }]
                });
            } catch (error) {
                console.error('Error starting conversation:', error);
                showError('Failed to start conversation. Please try again.');
            }
        }

        async function sendMessage(message) {
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'chat-message user';
            userMessageDiv.textContent = message;
            messagesContainer.appendChild(userMessageDiv);
            
            let sessionData = storage.load('sessionData') || { messages: [] };
            sessionData.messages.push({ type: 'user', content: message });
            storage.save('sessionData', sessionData);

            textarea.disabled = true;
            sendButton.disabled = true;
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'chat-message bot typing-indicator';
            typingIndicator.innerHTML = '<span></span><span></span><span></span>';
            messagesContainer.appendChild(typingIndicator);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            const messageData = {
                action: "sendMessage", sessionId: currentSessionId, route: config.webhook.route,
                chatInput: message, metadata: { userId: contactId }
            };

            try {
                const response = await fetch(config.webhook.url, {
                    method: 'POST', 
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': config.webhook.auth
                    }, 
                    body: JSON.stringify(messageData)
                });
                const data = await response.json();
                
                const botMessageDiv = document.createElement('div');
                botMessageDiv.className = 'chat-message bot';
                botMessageDiv.textContent = Array.isArray(data) ? data[0].output : data.output;
                
                messagesContainer.removeChild(typingIndicator);
                messagesContainer.appendChild(botMessageDiv);
                playSound(receiveSound);

                sessionData = storage.load('sessionData');
                sessionData.messages.push({ type: 'bot', content: botMessageDiv.textContent });
                storage.save('sessionData', sessionData);

            } catch (error) {
                console.error('Error sending message:', error);
                messagesContainer.removeChild(typingIndicator);
                const errorDiv = document.createElement('div');
                errorDiv.className = 'chat-message bot';
                errorDiv.textContent = 'Sorry, there was an error. Please try again.';
                messagesContainer.appendChild(errorDiv);
            } finally {
                textarea.disabled = false;
                sendButton.disabled = false;
                textarea.focus();
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }

        function restoreSession() {
            const contactData = storage.load('contactData');
            const sessionData = storage.load('sessionData');
            if (contactData && sessionData) {
                contactId = contactData.contactId;
                currentSessionId = sessionData.sessionId;
                chatContainer.querySelector('.brand-header').style.display = 'none';
                chatContainer.querySelector('.form-container').style.display = 'none';
                chatInterface.classList.add('active');
                messagesContainer.innerHTML = '';
                sessionData.messages.forEach(msg => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = `chat-message ${msg.type}`;
                    messageDiv.textContent = msg.content;
                    messagesContainer.appendChild(messageDiv);
                });
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                return true;
            }
            return false;
        }

        function resetChat() {
            storage.remove('contactData');
            storage.remove('sessionData');
            currentSessionId = '';
            contactId = '';
            contactForm.reset();
            errorMessage.style.display = 'none';
            chatContainer.querySelector('.brand-header').style.display = 'flex';
            chatContainer.querySelector('.form-container').style.display = 'block';
            chatInterface.classList.remove('active');
            messagesContainer.innerHTML = '';
        }

        function handleSend() {
            const message = textarea.value.trim();
            if (message) {
                playSound(sendSound);
                sendMessage(message);
                textarea.value = '';
                textarea.style.height = 'auto';
            }
        }

        // Event listeners
        startChatBtn.addEventListener('click', (e) => { e.preventDefault(); handleFormSubmit(); });
        contactForm.addEventListener('submit', (e) => { e.preventDefault(); handleFormSubmit(); });
        sendButton.addEventListener('click', handleSend);
        textarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
        });
        
        toggleButton.addEventListener('click', () => {
            const isOpen = chatContainer.classList.contains('open');
            if (!isOpen) {
                if (!restoreSession()) { resetChat(); }
            }
            chatContainer.classList.toggle('open');
        });

        const closeButtons = chatContainer.querySelectorAll('.close-button');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => { chatContainer.classList.remove('open'); });
        });

        toggleButton.addEventListener('dblclick', () => {
            if (confirm('Reset chat session?')) { resetChat(); }
        });

        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        });

        document.addEventListener('DOMContentLoaded', () => {});
    }

    // Initialize the widget
    initializeWidget();
})();
