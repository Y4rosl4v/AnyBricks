document.addEventListener('DOMContentLoaded', function() {
    // Обработка FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            
            if (this.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = 0;
            }
        });
    });
    
    // Обработка формы поддержки
    const supportForm = document.getElementById('supportForm');
    
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('support-name').value;
            const email = document.getElementById('support-email').value;
            const subject = document.getElementById('support-subject').value;
            const message = document.getElementById('support-message').value;
            
            // Здесь можно добавить отправку данных на сервер
            // В демо-версии просто показываем сообщение
            alert(`Спасибо, ${name}! Ваше обращение по теме "${getSubjectText(subject)}" получено. Мы ответим вам на email ${email} в течение 24 часов.`);
            
            supportForm.reset();
        });
    }
    
    function getSubjectText(value) {
        const subjects = {
            'order': 'Вопрос по заказу',
            'payment': 'Проблемы с оплатой',
            'delivery': 'Доставка',
            'technical': 'Техническая проблема',
            'other': 'Другое'
        };
        return subjects[value] || 'Другое';
    }
});