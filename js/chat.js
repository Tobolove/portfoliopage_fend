// Chat Interface JavaScript
class PortfolioChatbot {
    constructor() {
        this.isDetailedMode = false;
        this.isLoading = false;
        this.isMobileExpanded = false;
        this.messages = [
            {
                type: 'bot',
                content: "Hi! I'm your portfolio AI assistant. Feel free to ask me about projects, skills, experience, or anything else you'd like to know!"
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

        // Simulate AI response delay
        await this.delay(800 + Math.random() * 1200);

        // Generate and add bot response
        const response = this.generateResponse(content);
        this.messages.push({ type: 'bot', content: response });

        // Hide loading and render final messages
        this.hideLoading();
        this.renderMessages();
        this.scrollToBottom();
        this.saveChatHistory();
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Project-related responses
        if (message.includes('project') || message.includes('work') || message.includes('portfolio')) {
            const responses = [
                "I'd be happy to tell you about the portfolio projects! There are several exciting ones including Fyyur (a booking site for musical venues), a coffee shop website, and trivia applications. Each project demonstrates different technical skills and approaches to problem-solving.",
                "The portfolio showcases a variety of projects ranging from web applications to interactive sites. The Fyyur project is particularly interesting as it involves venue booking functionality, while the coffee shop site focuses on modern design principles.",
                "Great question about the projects! The portfolio includes full-stack applications, responsive websites, and interactive user interfaces. Each project was built with attention to accessibility, performance, and user experience."
            ];
            return this.getRandomResponse(responses);
        }
        
        // Skills-related responses
        if (message.includes('skill') || message.includes('technology') || message.includes('programming') || message.includes('language')) {
            const responses = [
                "The skillset includes modern web technologies like HTML5, CSS3, JavaScript (ES6+), React, Node.js, Python, and various frameworks. There's also experience with databases, version control (Git), and responsive design principles.",
                "Technical skills span both frontend and backend development, including React, Vue.js, Express.js, PostgreSQL, and modern CSS frameworks. The portfolio also demonstrates proficiency in accessibility best practices and performance optimization.",
                "The technical expertise covers full-stack development with JavaScript/TypeScript, Python, modern CSS (including SCSS), and various frameworks. There's also experience with databases, API development, and modern development tools."
            ];
            return this.getRandomResponse(responses);
        }
        
        // Experience-related responses
        if (message.includes('experience') || message.includes('background') || message.includes('career')) {
            const responses = [
                "The background combines technical expertise with creative problem-solving. Experience ranges from frontend development to full-stack applications, with a focus on creating user-centered, accessible web experiences.",
                "Professional experience includes working with modern web technologies, building responsive applications, and implementing best practices for accessibility and performance. Each project demonstrates growth and learning in different areas.",
                "The professional journey has focused on continuous learning and staying current with web development trends. Experience includes both independent projects and collaborative work, with emphasis on clean code and user experience."
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
        
        // About/personal responses
        if (message.includes('about') || message.includes('who') || message.includes('tell me')) {
            const responses = [
                "This portfolio belongs to a passionate web developer focused on creating accessible, performant, and user-friendly applications. The work demonstrates expertise in modern web technologies and a commitment to best practices.",
                "You're looking at the work of a dedicated developer who loves building engaging web experiences. The portfolio showcases projects that combine technical skill with creative problem-solving and attention to detail.",
                "This is the portfolio of a web developer passionate about creating meaningful digital experiences. The projects here represent a journey of continuous learning and growth in modern web development."
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
                content: "Chat cleared! Hi again! I'm your portfolio AI assistant. What would you like to know?"
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