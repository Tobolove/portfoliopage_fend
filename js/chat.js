// Chat Interface JavaScript
class PortfolioChatbot {
    constructor() {
        this.isDetailedMode = false;
        this.isLoading = false;
        this.isMobileExpanded = false;
        this.messages = [
            {
                type: 'bot',
                content: "Hi! I'm your **live AI assistant** powered by OpenAI and connected to Tobias's personal database via Vercel. I can provide intelligent answers about his projects, skills, experience, and background using real AI! What would you like to know? 🚀"
            }
        ];

        this.init();
        this.bindEvents();
        this.loadChatHistory();
    }

    init() {
        // Initialize elements
        this.desktopMessagesContainer = document.getElementById('messages-container');
        this.mobileMessagesContainer = document.getElementById('mobile-messages-container');
        this.desktopInput = document.getElementById('message-input');
        this.mobileInput = document.getElementById('mobile-message-input');
        this.desktopSendBtn = document.getElementById('send-btn');
        this.mobileSendBtn = document.getElementById('mobile-send-btn');
        this.mobileToggle = document.getElementById('mobile-chat-toggle');
        this.mobileOverlay = document.getElementById('mobile-chat-overlay');
        this.mobileCloseBtn = document.getElementById('mobile-chat-close');
        this.clearChatBtn = document.getElementById('clear-chat');
        this.modeToggleBtn = document.getElementById('mode-toggle');
        this.mobileModeToggleBtn = document.getElementById('mobile-mode-toggle');

        // Render initial messages
        this.renderMessages();
        this.scrollToBottom();
    }

    bindEvents() {
        // Desktop form submission
        document.getElementById('chat-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage(this.desktopInput.value.trim(), false);
        });

        // Mobile form submission
        document.getElementById('mobile-chat-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage(this.mobileInput.value.trim(), true);
        });

        // Input handlers
        this.desktopInput.addEventListener('input', () => {
            this.autoResizeTextarea(this.desktopInput);
            this.updateSendButton(false);
        });

        this.mobileInput.addEventListener('input', () => {
            this.autoResizeTextarea(this.mobileInput);
            this.updateSendButton(true);
        });

        // Keyboard handlers
        this.desktopInput.addEventListener('keydown', (e) => this.handleKeyDown(e, false));
        this.mobileInput.addEventListener('keydown', (e) => this.handleKeyDown(e, true));

        // Mobile toggle
        this.mobileToggle.addEventListener('click', () => this.toggleMobileChat());
        this.mobileCloseBtn.addEventListener('click', () => this.toggleMobileChat());

        // Clear chat
        this.clearChatBtn.addEventListener('click', () => this.clearChat());

        // Mode toggles
        this.modeToggleBtn.addEventListener('click', () => this.toggleDetailedMode(false));
        this.mobileModeToggleBtn.addEventListener('click', () => this.toggleDetailedMode(true));

        // Close mobile overlay on outside click
        this.mobileOverlay.addEventListener('click', (e) => {
            if (e.target === this.mobileOverlay) {
                this.toggleMobileChat();
            }
        });
    }

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    updateSendButton(isMobile) {
        const input = isMobile ? this.mobileInput : this.desktopInput;
        const button = isMobile ? this.mobileSendBtn : this.desktopSendBtn;
        
        const hasContent = input.value.trim().length > 0;
        button.disabled = !hasContent || this.isLoading;
    }

    handleKeyDown(e, isMobile) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const input = isMobile ? this.mobileInput : this.desktopInput;
            this.sendMessage(input.value.trim(), isMobile);
        }
    }

    async sendMessage(content, isMobile) {
        if (!content || this.isLoading) return;

        // Add user message
        this.messages.push({ type: 'user', content });
        
        // Clear input
        const input = isMobile ? this.mobileInput : this.desktopInput;
        input.value = '';
        input.style.height = 'auto';
        this.updateSendButton(isMobile);

        // Render messages and show loading
        this.renderMessages();
        this.showLoading();
        this.scrollToBottom();

        try {
            // Direct call to your deployed API
            const response = await fetch('https://personal-api-sand.vercel.app/personal/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    question: content,
                    personal_ids: [1], // Tobias Frei VIVAVIS profile
                    detailed_mode: this.isDetailedMode
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.answer) {
                // Success! Show real AI response
                this.messages.push({ type: 'bot', content: data.answer });
                console.log('✅ Real AI response received from deployed API');
            } else {
                throw new Error(data.error || 'API returned unsuccessful response');
            }

        } catch (error) {
            console.error('API Error:', error);
            
            // Fallback to enhanced local responses with helpful error info
            let fallbackMessage;
            
            if (error.message.includes('Failed to fetch')) {
                fallbackMessage = "🤖 **Connection Issue**\n\nI'm temporarily unable to reach my AI brain on the server. Don't worry though - I have smart fallback responses!\n\n";
            } else if (error.message.includes('500')) {
                fallbackMessage = "⚡ **Server Busy**\n\nMy AI backend is processing other requests. Using local intelligence for now!\n\n";
            } else {
                fallbackMessage = "🔄 **Fallback Mode**\n\nSwitching to local responses while the AI connection sorts itself out.\n\n";
            }
            
            const localResponse = this.generateResponse(content);
            this.messages.push({ type: 'bot', content: fallbackMessage + localResponse });
        } finally {
            // Hide loading and render final messages
            this.hideLoading();
            this.renderMessages();
            this.scrollToBottom();
            this.saveChatHistory();
        }
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // SGOP World specific responses
        if (message.includes('sgop') || message.includes('vivavis') || message.includes('grid operator')) {
            const responses = [
                "**🔥 SGOP World - AI-Powered Knowledge Ecosystem**\n\nThis is my current **professional project at VIVAVIS**, focusing on creating an AI-powered knowledge ecosystem specifically designed for grid operators in the energy sector.\n\n**Key Features:**\n- AI-enhanced knowledge management\n- Grid operator workflow optimization\n- Enterprise-scale solution\n- Real-world application in energy infrastructure\n\nIt represents the perfect combination of my **strategy consulting background** with **AI/software engineering** skills!",
                "**SGOP World** is my flagship project at **VIVAVIS** - it's an **AI-Powered Knowledge Ecosystem for Grid Operators**.\n\n🎯 **Purpose**: Streamline knowledge management in electrical grid operations\n🤖 **Technology**: AI-enhanced search and insights\n🏢 **Scale**: Enterprise-level energy sector application\n💡 **Innovation**: Combines domain expertise with cutting-edge AI\n\nThis project showcases how **strategy consulting experience** translates perfectly into understanding complex business requirements for technical solutions!",
                "**SGOP World Project Highlights:**\n\n- **Company**: VIVAVIS (energy sector technology)\n- **Role**: Leading AI knowledge ecosystem development\n- **Target Users**: Grid operators and energy professionals\n- **Technology Stack**: AI/ML, knowledge management systems\n- **Impact**: Improving efficiency in critical energy infrastructure\n\nThis project perfectly demonstrates the transition from **strategy consulting** to **software engineering** - understanding business needs and delivering technical solutions!"
            ];
            return this.getRandomResponse(responses);
        }
        
        // Project-related responses (Based on actual portfolio data)
        if (message.includes('project') || message.includes('work') || message.includes('portfolio')) {
            const responses = [
                "**Current Projects:**\n\n🔥 **SGOP World** - AI-Powered Knowledge Ecosystem for Grid Operators (Professional work at VIVAVIS)\n\n📚 **Personal Knowledge Base** - AI-Supercharged Book Library with advanced search and chat features\n\n🎵 **Fyyur** - Musical Venue & Artist Booking Site with full-stack functionality\n\n☕ **Coffee Shop** - Digital Dynamic Drink Menu Platform with secure authentication\n\n🧠 **Trivia** - Dynamic Quiz Learning Platform with interactive features",
                "The portfolio showcases **5 major projects** ranging from enterprise AI solutions to educational applications. The **SGOP World** project demonstrates professional experience with AI-powered knowledge systems at VIVAVIS, while the **Personal Knowledge Base** shows innovation in AI-enhanced learning tools.",
                "**Project highlights:**\n- **SGOP World**: Enterprise AI knowledge platform\n- **Personal Knowledge Base**: AI-enhanced book companion\n- **Fyyur**: Full-stack booking system\n- **Coffee Shop**: Secure digital menu platform\n- **Trivia**: Interactive learning application\n\nEach project demonstrates different aspects of modern web development, from AI integration to responsive design."
            ];
            return this.getRandomResponse(responses);
        }
        
        // Skills-related responses (Based on actual data)
        if (message.includes('skill') || message.includes('technology') || message.includes('programming') || message.includes('language')) {
            const responses = [
                "**Technical Skills:**\n\n💻 **Frontend & Backend Programming** (as confirmed in personal database)\n🌐 **Full-Stack Development**: HTML5, CSS3/SCSS, JavaScript (ES6+), React, Vue.js\n🔧 **Backend Technologies**: Node.js, Python, Flask, Express.js\n🗄️ **Databases**: PostgreSQL, Neon DB\n☁️ **DevOps & Cloud**: Vercel, deployment automation\n🤖 **AI Integration**: LangChain, OpenAI API, AI-powered applications",
                "**Core Expertise:**\n- **Frontend & Backend Programming** (confirmed specialty)\n- **Modern JavaScript/TypeScript development**\n- **AI-Enhanced Applications** (SGOP World, Knowledge Base)\n- **Database Design & Integration** (PostgreSQL/Neon)\n- **Responsive Design & Accessibility**\n- **DevOps & Deployment** (Vercel, CI/CD)",
                "The technical profile shows **Front and Backend Programming** expertise with focus on:\n\n🔹 Modern web frameworks (React, Vue.js)\n🔹 Server-side development (Python/Flask, Node.js)\n🔹 AI/ML integration (LangChain, OpenAI)\n🔹 Database management (PostgreSQL)\n🔹 Cloud deployment (Vercel)\n🔹 DevOps practices and automation"
            ];
            return this.getRandomResponse(responses);
        }
        
        // Experience-related responses (Based on actual data)
        if (message.includes('experience') || message.includes('background') || message.includes('career')) {
            const responses = [
                "**Professional Background:**\n\n📊 **Strategy Consulting** (confirmed experience from personal database)\n🏢 **Current Role**: Working at **VIVAVIS** on enterprise AI solutions\n🤖 **SGOP World Project**: Leading AI-Powered Knowledge Ecosystem for Grid Operators\n💻 **Technical Transition**: Successfully transitioned from strategy consulting to software engineering\n🎯 **Focus Areas**: DevOps, AI integration, and scalable application development",
                "**Career Journey:**\n- **Strategy Consulting Background** (business analysis & insights)\n- **Current**: Software Engineer at **VIVAVIS**\n- **Specialty**: AI-powered enterprise solutions\n- **Key Project**: SGOP World (AI Knowledge Ecosystem)\n- **Interests**: DevOps and dogs 🐕 (as noted in personal profile)\n- **Transition**: Combining business strategy with technical implementation",
                "The professional profile shows a unique combination of **Strategy Consulting** experience now applied to software engineering at **VIVAVIS**. Currently working on the **SGOP World** project - an AI-Powered Knowledge Ecosystem for Grid Operators. This background brings a valuable business perspective to technical problem-solving, especially in enterprise AI applications."
            ];
            return this.getRandomResponse(responses);
        }
        
        // Contact/hiring related responses
        if (message.includes('contact') || message.includes('hire') || message.includes('available') || message.includes('work together')) {
            const responses = [
                "I'd love to help you get in touch! You can reach out through the contact form on this site, or check out the contact page for more information. Always excited to discuss new opportunities and collaborations!",
                "Great that you're interested in connecting! The contact page has all the information you need to get in touch. Whether it's about potential projects, collaborations, or just to say hello - feel free to reach out!",
                "Absolutely! The best way to get in touch is through the contact form. I'm always open to discussing new projects, opportunities, or just connecting with fellow developers and creatives."
            ];
            return this.getRandomResponse(responses);
        }
        
        // Greeting responses
        if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good')) {
            const responses = [
                "Hello! Welcome to the portfolio. I'm here to help you learn more about the projects, skills, and experience showcased here. What would you like to know?",
                "Hi there! Thanks for visiting the portfolio. Feel free to ask me anything about the projects, technical skills, or professional background. How can I help you today?",
                "Hey! Great to meet you. I'm the AI assistant for this portfolio and I'd love to help you explore the work and experience showcased here. What interests you most?"
            ];
            return this.getRandomResponse(responses);
        }
        
        // About/personal responses (Based on actual data)
        if (message.includes('about') || message.includes('who') || message.includes('tell me') || message.includes('interest')) {
            const responses = [
                "**About Tobias Frei:**\n\n👨‍💼 **Background**: Strategy consultant turned software engineer\n🏢 **Current Role**: Working at **VIVAVIS** on enterprise AI solutions\n🎯 **Interests**: **DevOps and dogs** 🐕 (confirmed from personal database)\n💻 **Specialty**: Frontend & Backend Programming\n🚀 **Current Focus**: AI-powered knowledge systems and scalable applications",
                "**Personal Profile:**\n- **Name**: Tobias Frei\n- **Company**: VIVAVIS\n- **Background**: Strategy Consulting → Software Engineering\n- **Interests**: DevOps and dogs 🐕\n- **Passion**: Combining business strategy with technical innovation\n- **Key Project**: SGOP World (AI Knowledge Ecosystem for Grid Operators)",
                "Meet **Tobias Frei** - a unique professional who successfully transitioned from **strategy consulting** to software engineering. Currently working at **VIVAVIS**, he combines business insights with technical expertise. His interests include **DevOps and dogs** 🐕, and he's passionate about AI-powered solutions, particularly his work on the **SGOP World** project."
            ];
            return this.getRandomResponse(responses);
        }
        
        // Technical detail responses
        if (message.includes('how') || message.includes('built') || message.includes('made') || message.includes('technical')) {
            const responses = [
                "Great technical question! The projects use a variety of modern technologies and approaches. For example, this portfolio itself is built with semantic HTML5, modern CSS/SCSS, and vanilla JavaScript, with a focus on accessibility and performance.",
                "The technical implementation varies by project, but common themes include responsive design, accessibility compliance, performance optimization, and clean, maintainable code. Each project demonstrates different aspects of modern web development.",
                "Technical approaches include mobile-first responsive design, semantic HTML structure, CSS Grid and Flexbox for layouts, and progressive enhancement. The focus is always on creating fast, accessible, and user-friendly experiences."
            ];
            return this.getRandomResponse(responses);
        }
        
        // Default responses
        const defaultResponses = [
            "That's an interesting question! While I can share information about the projects, skills, and experience in this portfolio, I'd love to help you find what you're looking for. Could you be more specific about what you'd like to know?",
            "I'm here to help you learn about this portfolio! I can tell you about the projects, technical skills, experience, or anything else you'd like to know. What specifically interests you?",
            "Thanks for your question! I'd be happy to provide more information about the portfolio, projects, or technical background. What would you like to explore?",
            "I'm designed to help you navigate this portfolio and learn about the work showcased here. Feel free to ask about specific projects, technologies used, or anything else that catches your interest!",
            this.isDetailedMode ? 
                "Since you have detailed mode enabled, I can provide more in-depth information about any aspect of the portfolio. What specific area would you like me to elaborate on?" :
                "I can provide information about projects, skills, experience, and more. You can also toggle detailed mode for more comprehensive responses. What would you like to know?"
        ];
        
        return this.getRandomResponse(defaultResponses);
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    toggleDetailedMode(isMobile) {
        this.isDetailedMode = !this.isDetailedMode;
        
        const button = isMobile ? this.mobileModeToggleBtn : this.modeToggleBtn;
        button.classList.toggle('active', this.isDetailedMode);
        
        const input = isMobile ? this.mobileInput : this.desktopInput;
        input.style.backgroundColor = this.isDetailedMode ? 'rgba(59, 130, 246, 0.05)' : '';
        
        // Add mode change message
        const modeMessage = this.isDetailedMode ? 
            'Detailed mode enabled! I\'ll provide more comprehensive responses.' :
            'Detailed mode disabled. I\'ll provide concise responses.';
            
        this.messages.push({ type: 'bot', content: modeMessage });
        this.renderMessages();
        this.scrollToBottom();
        this.saveChatHistory();
    }

    showLoading() {
        this.isLoading = true;
        this.updateSendButton(false);
        this.updateSendButton(true);
        
        const loadingHtml = `
            <div class="chat-loading" id="loading-indicator">
                <div class="chat-loading__avatar">
                    <img src="../img/bio-pic.jpg" alt="AI Assistant" class="chat-loading__avatar-img">
                </div>
                <div class="chat-loading__bubble">
                    <div class="chat-loading__dots">
                        <div class="chat-loading__dot"></div>
                        <div class="chat-loading__dot"></div>
                        <div class="chat-loading__dot"></div>
                    </div>
                </div>
            </div>
        `;
        
        this.desktopMessagesContainer.insertAdjacentHTML('beforeend', loadingHtml);
        this.mobileMessagesContainer.insertAdjacentHTML('beforeend', loadingHtml);
    }

    hideLoading() {
        this.isLoading = false;
        this.updateSendButton(false);
        this.updateSendButton(true);
        
        const loadingIndicators = document.querySelectorAll('#loading-indicator');
        loadingIndicators.forEach(indicator => indicator.remove());
    }

    renderMessages() {
        const messagesHtml = this.messages.map(message => this.createMessageHtml(message)).join('');
        this.desktopMessagesContainer.innerHTML = messagesHtml;
        this.mobileMessagesContainer.innerHTML = messagesHtml;
    }

    createMessageHtml(message) {
        const isBot = message.type === 'bot';
        const avatarHtml = isBot ? `
            <div class="chat-message__avatar">
                <img src="../img/bio-pic.jpg" alt="AI Assistant" class="chat-message__avatar-img">
            </div>
        ` : '';

        return `
            <div class="chat-message chat-message--${message.type}">
                ${avatarHtml}
                <div class="chat-message__bubble">
                    ${this.formatMessage(message.content)}
                </div>
            </div>
        `;
    }

    formatMessage(content) {
        // Simple markdown-like formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    scrollToBottom() {
        setTimeout(() => {
            this.desktopMessagesContainer.scrollTop = this.desktopMessagesContainer.scrollHeight;
            this.mobileMessagesContainer.scrollTop = this.mobileMessagesContainer.scrollHeight;
        }, 100);
    }

    toggleMobileChat() {
        this.isMobileExpanded = !this.isMobileExpanded;
        
        if (this.isMobileExpanded) {
            this.mobileOverlay.classList.add('active');
            this.mobileToggle.style.display = 'none';
            this.renderMessages();
            this.scrollToBottom();
            // Focus on mobile input
            setTimeout(() => this.mobileInput.focus(), 300);
        } else {
            this.mobileOverlay.classList.remove('active');
            this.mobileToggle.style.display = 'block';
        }
    }

    clearChat() {
        this.messages = [
            {
                type: 'bot',
                content: "Chat cleared! Hi again! I'm your **live AI assistant** powered by OpenAI and connected to Tobias's personal database via Vercel. What would you like to know? 🚀"
            }
        ];
        this.renderMessages();
        this.scrollToBottom();
        this.saveChatHistory();
    }

    saveChatHistory() {
        try {
            sessionStorage.setItem('portfolio_chat_history', JSON.stringify(this.messages));
        } catch (e) {
            console.warn('Could not save chat history:', e);
        }
    }

    loadChatHistory() {
        try {
            const saved = sessionStorage.getItem('portfolio_chat_history');
            if (saved) {
                this.messages = JSON.parse(saved);
                this.renderMessages();
                this.scrollToBottom();
            }
        } catch (e) {
            console.warn('Could not load chat history:', e);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioChatbot();
}); 