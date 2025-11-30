// Элементы DOM
const openFormBtn = document.getElementById('openFormBtn');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModalBtn');
const feedbackForm = document.getElementById('feedbackForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Ключ для localStorage
const STORAGE_KEY = 'feedbackFormData';

// Открытие модального окна
openFormBtn.addEventListener('click', openModal);

// Закрытие модального окна
closeModalBtn.addEventListener('click', closeModal);

// Закрытие модального окна при клике на оверлей
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

// Обработка отправки формы
feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitForm();
});

// Обработка нажатия кнопки "Назад" в браузере
window.addEventListener('popstate', () => {
    if (modalOverlay.classList.contains('active')) closeModal();
});

// Функция открытия модального окна
function openModal() {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    history.pushState({ modalOpen: true }, '', '#feedback');
    restoreFormData();
    hideMessages();
}

// Функция закрытия модального окна
function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    if (history.state?.modalOpen) history.back();
}

// Функция сохранения данных формы в localStorage
function saveFormData() {
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        organization: document.getElementById('organization').value,
        message: document.getElementById('message').value,
        privacyPolicy: document.getElementById('privacyPolicy').checked
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
}

// Функция восстановления данных из localStorage
function restoreFormData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        const formData = JSON.parse(savedData);
        document.getElementById('fullName').value = formData.fullName || '';
        document.getElementById('email').value = formData.email || '';
        document.getElementById('phone').value = formData.phone || '';
        document.getElementById('organization').value = formData.organization || '';
        document.getElementById('message').value = formData.message || '';
        document.getElementById('privacyPolicy').checked = formData.privacyPolicy || false;
    }
}

// Функция очистки данных в localStorage
function clearFormData() {
    localStorage.removeItem(STORAGE_KEY);
    feedbackForm.reset();
}

// Функция скрытия сообщений
function hideMessages() {
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
}

// Функция отправки формы для formcarry.com (ИСПРАВЛЕННАЯ)
function submitForm() {
    // Валидация формы
    if (!feedbackForm.checkValidity()) {
        alert('Пожалуйста, заполните все обязательные поля (отмеченные *)');
        return;
    }
    
    // Блокировка кнопки отправки
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    hideMessages();
    
    // Создаем объект с данными вместо FormData
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        organization: document.getElementById('organization').value,
        message: document.getElementById('message').value,
        privacyPolicy: document.getElementById('privacyPolicy').checked
    };
    
    console.log('📤 Отправляемые данные:', formData);
    
    // Отправка данных на formcarry.com в формате JSON
    fetch('https://formcarry.com/s/e2PU58utTxG', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        console.log('📨 HTTP статус ответа:', response.status, response.statusText);
        
        if (response.status === 406) {
            throw new Error('Сервер не принимает данные. Проверьте формат отправки.');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    })
    .then(result => {
        console.log('🔍 Полный ответ Formcarry:', result);
        
        // Formcarry возвращает успех если данные приняты
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        
        // Очистка данных формы
        clearFormData();
        
        // Закрытие модального окна через 2 секунды
        setTimeout(() => {
            closeModal();
        }, 2000);
    })
    .catch(error => {
        console.error('❌ Ошибка отправки:', error);
        
        // Показ сообщения об ошибке
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        
        // Обновляем текст ошибки
        errorMessage.textContent = `Произошла ошибка: ${error.message}. Пожалуйста, попробуйте позже.`;
    })
    .finally(() => {
        // Разблокировка кнопки отправки
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';
    });
}

// Сохранение данных формы при изменении
feedbackForm.addEventListener('input', saveFormData);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    restoreFormData();
    if (window.location.hash === '#feedback') openModal();
});


//Я ЭТОТ КОД МЕНЯЛА РАЗ 15, НЕ ЛЮБЛЮ ВОТ ПОНИМАЕТЕ ЭТО, ОШИБКА НА ОШИБКЕ БЫЛА, У МЕНЯ ДИПСИК НЕ МОГ ПОНЯТЬ ЧТО С МОИМ КОДОМ НЕ ТАК
