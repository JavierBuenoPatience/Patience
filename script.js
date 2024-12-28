// Definimos constantes para colores y URLs
const COLORS = {
    primary: '#1F3A93',
    secondary: '#22A7F0',
    accent: '#F5F7FA',
    background: '#FFFFFF',
    text: '#2C3E50',
    secondaryText: '#7F8C8D'
};

const discordInviteLink = "https://discord.gg/qGB36SqR";

// Obtenemos los usuarios almacenados o inicializamos uno vacío
const users = JSON.parse(localStorage.getItem('users')) || {};

// Datos de academias
const academies = [
    /* MANTENER LISTA COMPLETA DE ACADEMIAS: NO OMITIR
       (igual que en versiones anteriores, 16 academias)
    */
    {
        id: 1,
        name: 'TecnosZubia',
        city: 'Granada',
        phone: '958 890 387',
        email: 'info@tecnoszubia.es',
        specialties: ['Maestros', 'Profesores', 'Administrativos', 'Seguridad', 'SAS'],
        rating: '4.8/5',
        image: 'academia-1.jpg'
    },
    {
        id: 2,
        name: 'CEAPRO',
        city: 'Sevilla',
        phone: '954 32 00 00',
        email: 'info@ceapro.es',
        specialties: ['Junta de Andalucía', 'Administración', 'Justicia', 'Educación', 'SAS'],
        rating: '4.7/5',
        image: 'academia-2.jpg'
    },
    // ...
    {
        id: 16,
        name: 'Academia Claustro',
        city: 'Sevilla',
        phone: '954 00 11 22',
        email: 'info@academiaclaustro.com',
        specialties: ['Educación', 'Administración', 'Justicia'],
        rating: '3.4/5',
        image: 'academia-16.jpg'
    }
];

// Datos de especialidades (IA)
const specialties = [
    /* MANTENER LISTA COMPLETA DE IA ESPECIALIZADA */
    {
        name: 'Biología y Geología',
        image: 'bio-geologia.jpg',
        url: 'https://chatgpt.com/g/g-xgl7diXqb-patience-biologia-y-geologia'
    },
    {
        name: 'Inglés como Segunda Lengua',
        image: 'ingles.jpg',
        url: 'https://chatgpt.com/g/g-mBJ4r4s53-patience-ingles'
    },
    {
        name: 'Matemáticas',
        image: 'matematicas.jpg',
        url: 'https://chatgpt.com/g/g-67535b2f2b308191a87e2d15a89d6513-patience-matematicas'
    },
    {
        name: 'Geografía e Historia',
        image: 'geografia-historia.jpg',
        url: 'https://chatgpt.com/g/g-67535eb0d2688191b60c3ee2be32f29e-patience-geografia-e-historia'
    },
    {
        name: 'Francés como Lengua Extranjera',
        image: 'frances.jpg',
        url: 'https://chatgpt.com/g/g-67535fd05bdc8191856a432c21df2968-patience-frances'
    }
];

// Preguntas para el Quiz Diario (estáticas)
const dailyQuizQuestions = [
    {
        question: "¿Cuál es la capital de Francia?",
        options: ["París", "Londres", "Berlín"],
        answer: 0
    },
    {
        question: "¿Cuál es el resultado de 5x5?",
        options: ["20", "25", "30"],
        answer: 1
    },
    {
        question: "¿La célula es la unidad...?",
        options: ["De heredabilidad", "De estructura y función de los seres vivos", "De la fotosíntesis"],
        answer: 1
    },
    {
        question: "¿Cuál es el río más largo del mundo?",
        options: ["Nilo", "Amazonas", "Yangtsé"],
        answer: 1
    },
    {
        question: "¿Quién escribió 'Don Quijote de la Mancha'?",
        options: ["Miguel de Cervantes", "Federico García Lorca", "Gabriel García Márquez"],
        answer: 0
    }
];
let currentQuizIndex = -1;

// Variables para mensajes motivacionales
const motivationalMessages = [
    "¡Ánimo! Ya estás un poco más cerca de la meta.",
    "Lo estás haciendo genial, ¡sigue así!",
    "Un poco más y nos tomamos un descanso, ¡ánimo!"
];
let motivationalMessageIndex = 0;

// Variables para Racha Diaria (Daily Streak)
let dailyStreak = 0;

// Variables para el cronómetro
let timerInterval;
let elapsedTime = 0;
let isTimerRunning = false;

// Variables para la vista de documentos (lista o cuadrícula)
let documentsViewMode = 'list'; // 'list' o 'grid'

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('loggedIn') === 'true') {
        hideLoginAndRegistrationScreens();
        showProgressMainScreen();
    } else {
        showLoginScreen();
    }

    const uploadInput = document.getElementById('upload-document');
    if (uploadInput) {
        uploadInput.addEventListener('change', uploadDocuments);
    }

    const documentSearch = document.getElementById('document-search');
    if (documentSearch) {
        documentSearch.addEventListener('input', filterDocuments);
    }

    initAcademyDirectory();
    initSpecialties();
    updateNotifications();
    document.addEventListener('click', (event) => {
        const notificationIcon = document.querySelector('.notification-icon');
        const notificationPanel = document.getElementById('notification-panel');
        if (notificationIcon && notificationPanel && 
            !notificationIcon.contains(event.target) && 
            !notificationPanel.contains(event.target)) {
            notificationPanel.classList.remove('show-notifications');
        }
    });
    loadSidebarState();
    updateMotivationalMessage();
    setInterval(updateMotivationalMessage, 5 * 60 * 1000);
    loadDailyStreak();
    loadDailyCheckInStatus();
    loadRecentActivity();
    updateRecentActivitySummary();
});

// ============= Funciones para ocultar login/registro =============
function hideLoginAndRegistrationScreens() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('registration-screen').style.display = 'none';
}

// ================== Secciones Principales ===================
function hideAllMainSections() {
    document.getElementById('progress-main-screen').style.display = 'none';
    document.getElementById('study-main-screen').style.display = 'none';
    document.getElementById('communities-main-screen').style.display = 'none';
    document.getElementById('news-help-screen').style.display = 'none';
    document.getElementById('account-screen').style.display = 'none';
}

function showProgressMainScreen() {
    hideAllMainSections();
    if (localStorage.getItem('loggedIn') === 'true') {
        hideLoginAndRegistrationScreens();
        document.querySelector('header').style.display = 'flex';
        document.querySelector('footer').style.display = 'block';
    }
    document.getElementById('progress-main-screen').style.display = 'block';
    hideAllSubScreensOfProgress();
    document.getElementById('progress-screen').style.display = 'block';

    updateProfileIcon();
    updateDashboard();
    loadTimerState();
    updateDailyStreakDisplay();
    updateRecentActivitySummary();
}

function hideAllSubScreensOfProgress() {
    document.getElementById('progress-screen').style.display = 'none';
    document.getElementById('study-time-screen').style.display = 'none';
    document.getElementById('activity-screen').style.display = 'none';
}

function showStudyMainScreen() {
    hideAllMainSections();
    if (localStorage.getItem('loggedIn') === 'true') {
        hideLoginAndRegistrationScreens();
        document.querySelector('header').style.display = 'flex';
        document.querySelector('footer').style.display = 'block';
    }
    document.getElementById('study-main-screen').style.display = 'block';
    hideAllSubScreensOfStudy();
    document.getElementById('documents-screen').style.display = 'block'; // Por defecto
}

function hideAllSubScreensOfStudy() {
    document.getElementById('documents-screen').style.display = 'none';
    document.getElementById('ai-screen').style.display = 'none';
    // quitamos la "guía-screen" de esta sección (ahora la movimos a "Noticias & Ayuda") 
}

function showCommunitiesMainScreen() {
    hideAllMainSections();
    if (localStorage.getItem('loggedIn') === 'true') {
        hideLoginAndRegistrationScreens();
        document.querySelector('header').style.display = 'flex';
        document.querySelector('footer').style.display = 'block';
    }
    document.getElementById('communities-main-screen').style.display = 'block';
    hideAllSubScreensOfCommunities();
    document.getElementById('groups-screen').style.display = 'block'; // Por defecto
}

function hideAllSubScreensOfCommunities() {
    document.getElementById('groups-screen').style.display = 'none';
    document.getElementById('directory-screen').style.display = 'none';
}

function showNewsHelpScreen() {
    hideAllMainSections();
    if (localStorage.getItem('loggedIn') === 'true') {
        hideLoginAndRegistrationScreens();
        document.querySelector('header').style.display = 'flex';
        document.querySelector('footer').style.display = 'block';
    }
    document.getElementById('news-help-screen').style.display = 'block';
    hideAllSubScreensOfNewsHelp();
    // Por defecto, mostramos "Noticias"
    document.getElementById('news-screen').style.display = 'block';
}

function hideAllSubScreensOfNewsHelp() {
    document.getElementById('news-screen').style.display = 'none';
    document.getElementById('guide-screen').style.display = 'none';
    document.getElementById('training-screen').style.display = 'none';
    document.getElementById('help-screen').style.display = 'none';
}

function showAccountScreen() {
    hideAllMainSections();
    if (localStorage.getItem('loggedIn') === 'true') {
        hideLoginAndRegistrationScreens();
        document.querySelector('header').style.display = 'flex';
        document.querySelector('footer').style.display = 'block';
    }
    document.getElementById('account-screen').style.display = 'block';
    hideAllSubScreensOfAccount();
    document.getElementById('profile-screen').style.display = 'block'; // Por defecto
}

function hideAllSubScreensOfAccount() {
    document.getElementById('profile-screen').style.display = 'none';
    document.getElementById('coming-soon-screen').style.display = 'none';
}

// ================== Subpantallas concretas ===================
function showStudyTimeScreen() {
    showProgressMainScreen();
    hideAllSubScreensOfProgress();
    document.getElementById('study-time-screen').style.display = 'block';
}

function showActivityScreen() {
    showProgressMainScreen();
    hideAllSubScreensOfProgress();
    document.getElementById('activity-screen').style.display = 'block';
}

// Estudio
function showAIScreen() {
    showStudyMainScreen();
    hideAllSubScreensOfStudy();
    document.getElementById('ai-screen').style.display = 'block';
}

function showDocuments() {
    showStudyMainScreen();
    hideAllSubScreensOfStudy();
    document.getElementById('documents-screen').style.display = 'block';
}

// Comunidades
function showGroups() {
    showCommunitiesMainScreen();
    hideAllSubScreensOfCommunities();
    document.getElementById('groups-screen').style.display = 'block';
}

function showDirectoryScreen() {
    showCommunitiesMainScreen();
    hideAllSubScreensOfCommunities();
    document.getElementById('directory-screen').style.display = 'block';
}

// Noticias & Ayuda
function showNews() {
    showNewsHelpScreen();
    hideAllSubScreensOfNewsHelp();
    document.getElementById('news-screen').style.display = 'block';
}

function showGuideScreen() {
    showNewsHelpScreen();
    hideAllSubScreensOfNewsHelp();
    document.getElementById('guide-screen').style.display = 'block';
}

function showTraining() {
    showNewsHelpScreen();
    hideAllSubScreensOfNewsHelp();
    document.getElementById('training-screen').style.display = 'block';
}

function showHelp() {
    showNewsHelpScreen();
    hideAllSubScreensOfNewsHelp();
    document.getElementById('help-screen').style.display = 'block';
}

// Mi Cuenta
function showProfile() {
    showAccountScreen();
    hideAllSubScreensOfAccount();
    document.getElementById('profile-screen').style.display = 'block';
}

function showComingSoon() {
    showAccountScreen();
    hideAllSubScreensOfAccount();
    document.getElementById('coming-soon-screen').style.display = 'block';
}

// ================== Sidebar & Notificaciones ===================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const isPinned = localStorage.getItem('sidebarPinned') === 'true';
    if (isPinned) return;
    sidebar.classList.toggle('show-sidebar');
}

function togglePinSidebar() {
    const pinButton = document.getElementById('pin-sidebar');
    const sidebar = document.getElementById('sidebar');
    const isPinned = localStorage.getItem('sidebarPinned') === 'true';

    if (isPinned) {
        localStorage.setItem('sidebarPinned', 'false');
        pinButton.classList.remove('pinned');
        sidebar.classList.remove('pinned');
    } else {
        localStorage.setItem('sidebarPinned', 'true');
        pinButton.classList.add('pinned');
        sidebar.classList.add('pinned');
    }
}

function loadSidebarState() {
    const pinButton = document.getElementById('pin-sidebar');
    const sidebar = document.getElementById('sidebar');
    const isPinned = localStorage.getItem('sidebarPinned') === 'true';

    if (isPinned) {
        pinButton.classList.add('pinned');
        sidebar.classList.add('pinned');
    } else {
        pinButton.classList.remove('pinned');
        sidebar.classList.remove('pinned');
    }
}

function toggleNotifications() {
    const notificationPanel = document.getElementById('notification-panel');
    notificationPanel.classList.toggle('show-notifications');
}

function updateNotifications() {
    const notificationCount = document.getElementById('notification-count');
    const notificationList = document.getElementById('notification-list');

    const email = localStorage.getItem('email');
    const user = users[email];
    const notifications = user?.notifications || [];

    notificationCount.textContent = notifications.length;

    notificationList.innerHTML = '';
    if (notifications.length === 0) {
        const noNotifications = document.createElement('li');
        noNotifications.textContent = 'No tienes notificaciones nuevas.';
        notificationList.appendChild(noNotifications);
    } else {
        notifications.forEach(notification => {
            const notificationItem = document.createElement('li');
            notificationItem.textContent = notification;
            notificationList.appendChild(notificationItem);
        });
    }
}

function addNotification(message) {
    const email = localStorage.getItem('email');
    const user = users[email];
    if (!user.notifications) {
        user.notifications = [];
    }
    user.notifications.push(message);
    localStorage.setItem('users', JSON.stringify(users));
    updateNotifications();
    addActivity("Notificación: " + message);
}

// ================== Login y Registro ===================
function handleRegistration(event) {
    event.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    if (!validateEmail(email)) {
        alert('Por favor, utiliza un correo de Gmail o Hotmail.');
        return;
    }

    if (users[email]) {
        alert('Ese correo ya está registrado. Por favor, inicia sesión o utiliza otro correo.');
        return;
    }

    users[email] = {
        name,
        email,
        password,
        profile: {},
        documents: [],
        folders: [],
        studyHours: 0,
        examDate: null,
        lastDocument: null,
        annotations: {},
        notifications: [],
        studySessions: [],
        recentActivities: [],
        onboardingCompleted: false
    };
    localStorage.setItem('users', JSON.stringify(users));

    document.getElementById('registration-form').reset();
    document.getElementById('registration-message').style.display = 'block';
    document.getElementById('welcome-button').style.display = 'block';
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!validateEmail(email)) {
        alert('Por favor, utiliza un correo de Gmail o Hotmail.');
        return;
    }

    if (users[email] && users[email].password === password) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('email', email);
        localStorage.setItem('name', users[email].name);

        hideLoginAndRegistrationScreens();
        document.querySelector('header').style.display = 'flex';
        document.querySelector('footer').style.display = 'block';

        // Mostramos la sección "Mi Progreso"
        showProgressMainScreen();

        if (!users[email].onboardingCompleted) {
            startOnboarding();
        }
    } else {
        alert('Correo o contraseña incorrectos. Revisa tus datos o regístrate si no tienes cuenta.');
    }
}

function handleLogout() {
    if (isTimerRunning) {
        pauseTimer();
        saveStudySession();
    }
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    hideAllMainSections();
    showLoginScreen();
}

function validateEmail(email) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const hotmailRegex = /^[a-zA-Z0-9._%+-]+@(hotmail|outlook)\.com$/;
    return gmailRegex.test(email) || hotmailRegex.test(email);
}

function showLoginScreen() {
    hideAllMainSections();
    document.getElementById('login-screen').style.display = 'block';
    document.getElementById('registration-screen').style.display = 'none';
    document.querySelector('header').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
}

function showRegistrationScreen() {
    hideAllMainSections();
    document.getElementById('registration-screen').style.display = 'block';
    document.getElementById('login-screen').style.display = 'none';
    document.querySelector('header').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
}

// ================== Perfil ===================
function handleProfileUpdate(event) {
    event.preventDefault();
    const email = localStorage.getItem('email');
    const user = users[email];
    const profile = {
        fullName: document.getElementById('full-name').value,
        phone: document.getElementById('phone').value,
        examDate: document.getElementById('exam-date').value,
        specialty: document.getElementById('specialty').value,
        hobbies: document.getElementById('hobbies').value,
        location: document.getElementById('location').value,
        profileImage: document.getElementById('profile-img').src
    };

    user.profile = profile;
    user.examDate = profile.examDate;
    // Actualizamos name en localStorage si el usuario escribe su nombre completo
    user.name = profile.fullName || user.name;

    localStorage.setItem('users', JSON.stringify(users));
    alert('Perfil actualizado con éxito.');

    // Actualizamos el icono y el "Hola, XX" en la pantalla principal
    updateProfileIcon();
    updateUserNameHome();
    updateDashboard();
}

function updateUserNameHome() {
    const email = localStorage.getItem('email');
    const user = users[email];
    if (user && user.profile && user.profile.fullName) {
        document.getElementById('user-name-home').textContent = user.profile.fullName;
    } else {
        document.getElementById('user-name-home').textContent = user?.name || 'Opositor';
    }
}

function updateProfileIcon() {
    const email = localStorage.getItem('email');
    const profile = users[email]?.profile || {};
    const profileIcon = document.getElementById('profile-icon');
    if (profileIcon) {
        profileIcon.src = profile.profileImage || 'assets/default-profile.png';
    }
}

// Para subir imagen de perfil
function handleImageUpload(event) {
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('profile-img').src = e.target.result;
    };
    if (event.target.files && event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
    }
}

// ================== Actividad Reciente, Onboarding, etc. ===================
function loadRecentActivity() {
    // si hubiera alguna lógica para cargar actividad
}

function updateRecentActivitySummary() {
    const email = localStorage.getItem('email');
    const user = users[email];
    const recentActivitySummary = document.getElementById('recent-activity-summary');
    if (recentActivitySummary) {
        if (user.recentActivities && user.recentActivities.length > 0) {
            const lastActivity = user.recentActivities[user.recentActivities.length - 1];
            recentActivitySummary.textContent = `Última actividad: ${lastActivity}`;
        } else {
            recentActivitySummary.textContent = 'Última actividad: --';
        }
    }
}

function displayFullActivity() {
    const email = localStorage.getItem('email');
    const user = users[email];
    const fullActivityList = document.getElementById('full-activity-list');
    if (!fullActivityList) return;

    fullActivityList.innerHTML = '';
    if (!user.recentActivities || user.recentActivities.length === 0) {
        fullActivityList.textContent = 'No hay actividades registradas.';
    } else {
        user.recentActivities.slice().reverse().forEach(act => {
            const li = document.createElement('li');
            li.textContent = act;
            fullActivityList.appendChild(li);
        });
    }
}

function addActivity(message) {
    const email = localStorage.getItem('email');
    const user = users[email];
    if (!user.recentActivities) {
        user.recentActivities = [];
    }
    const now = new Date();
    const timestamp = now.toLocaleString();
    user.recentActivities.push(`[${timestamp}] ${message}`);
    localStorage.setItem('users', JSON.stringify(users));
    updateRecentActivitySummary();
}

// Onboarding
function startOnboarding() {
    showOverlay();
    showOnboardingStep(1);
}

function nextOnboardingStep() {
    const currentStep = parseInt(localStorage.getItem('onboardingStep')) || 1;
    const nextStep = currentStep + 1;
    showOnboardingStep(nextStep);
}

function showOnboardingStep(step) {
    const totalSteps = 5;
    for (let i = 1; i <= totalSteps; i++) {
        const stepElement = document.getElementById(`onboarding-step-${i}`);
        if (stepElement) {
            stepElement.style.display = i === step ? 'block' : 'none';
        }
    }
    localStorage.setItem('onboardingStep', step);
}

function finishOnboarding() {
    hideOverlay();
    const email = localStorage.getItem('email');
    users[email].onboardingCompleted = true;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.removeItem('onboardingStep');
}

function showOverlay() {
    const overlay = document.getElementById('onboarding-overlay');
    overlay.style.display = 'flex';
}

function hideOverlay() {
    const overlay = document.getElementById('onboarding-overlay');
    overlay.style.display = 'none';
}

// ================== Dashboard, Racha y Cronómetro ===================
function updateDashboard() {
    const email = localStorage.getItem('email');
    const user = users[email];
    const daysRemainingElement = document.getElementById('days-remaining');
    const studyHoursElement = document.getElementById('study-hours');

    // Si el usuario ha rellenado su nombre completo, lo reflejamos
    updateUserNameHome();

    // Días para el examen
    if (user?.examDate) {
        const examDate = new Date(user.examDate);
        const today = new Date();
        const timeDiff = examDate - today;
        const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        daysRemainingElement.textContent = daysRemaining > 0 ? daysRemaining + ' días' : 'Examen pasado';
    } else {
        daysRemainingElement.textContent = '--';
    }

    // Horas totales de estudio
    const totalStudyTime = calculateTotalStudyTime(email);
    studyHoursElement.textContent = totalStudyTime ? totalStudyTime + ' horas' : '--';

    updateMotivationalMessage();
    updateRecentActivitySummary();
}

function calculateTotalStudyTime(email) {
    const user = users[email];
    if (user.studySessions && user.studySessions.length > 0) {
        const totalMilliseconds = user.studySessions.reduce((acc, session) => acc + session.duration, 0);
        const totalHours = (totalMilliseconds / (1000 * 60 * 60)).toFixed(2);
        return totalHours;
    }
    return 0;
}

function handleLogoClick() {
    if (localStorage.getItem('loggedIn') === 'true') {
        showProgressMainScreen();
    } else {
        showLoginScreen();
    }
}

// Racha Diaria
function loadDailyStreak() {
    const email = localStorage.getItem('email');
    const user = users[email];
    if (!user.dailyStreak) {
        user.dailyStreak = 0;
        user.lastCheckinDate = null;
        localStorage.setItem('users', JSON.stringify(users));
    }
    dailyStreak = user.dailyStreak;
}

function updateDailyStreakDisplay() {
    const dailyStreakElement = document.getElementById('daily-streak');
    if (dailyStreakElement) {
        dailyStreakElement.textContent = dailyStreak + " días";
    }
}

function handleDailyCheckIn() {
    const email = localStorage.getItem('email');
    const user = users[email];
    const today = new Date().toDateString();
    const lastCheckin = user.lastCheckinDate ? new Date(user.lastCheckinDate).toDateString() : null;

    if (!lastCheckin) {
        user.dailyStreak = 1;
        user.lastCheckinDate = new Date();
        dailyStreak = 1;
        addNotification("Has hecho check-in por primera vez. ¡Racha iniciada!");
        addActivity("Check-in diario realizado");
    } else {
        const diff = (new Date(today) - new Date(lastCheckin)) / (1000 * 60 * 60 * 24);
        if (diff === 0) {
            document.getElementById('checkin-status').textContent = "Ya hiciste check-in hoy.";
            return;
        } else if (diff === 1) {
            user.dailyStreak = user.dailyStreak + 1;
            user.lastCheckinDate = new Date();
            dailyStreak = user.dailyStreak;
            addNotification(`Racha incrementada a ${dailyStreak} días.`);
            addActivity("Check-in diario incrementa racha a " + dailyStreak);
        } else {
            user.dailyStreak = 1;
            user.lastCheckinDate = new Date();
            dailyStreak = 1;
            addNotification("La racha se ha reiniciado. ¡Vuelve a empezar con fuerza!");
            addActivity("Check-in diario, racha reiniciada");
        }
    }
    localStorage.setItem('users', JSON.stringify(users));
    updateDailyStreakDisplay();
    document.getElementById('checkin-status').textContent = "Check-in completado hoy!";
    updateRecentActivitySummary();
}

// Cronómetro
function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    const startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateTimerDisplay();
    }, 1000);

    const startBtn = document.getElementById('start-timer');
    const pauseBtn = document.getElementById('pause-timer');
    const resetBtn = document.getElementById('reset-timer');
    if (startBtn && pauseBtn && resetBtn) {
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
    }
}

function pauseTimer() {
    if (!isTimerRunning) return;
    isTimerRunning = false;
    clearInterval(timerInterval);
    saveStudySession();

    const startBtn = document.getElementById('start-timer');
    const pauseBtn = document.getElementById('pause-timer');
    if (startBtn && pauseBtn) {
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
}

function resetTimer() {
    if (isTimerRunning) {
        pauseTimer();
    }
    elapsedTime = 0;
    updateTimerDisplay();
    const resetBtn = document.getElementById('reset-timer');
    if (resetBtn) {
        resetBtn.disabled = true;
    }
}

function updateTimerDisplay() {
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60).toString().padStart(2, '0');
    const seconds = Math.floor((elapsedTime / 1000) % 60).toString().padStart(2, '0');
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
        timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

function saveStudySession() {
    const email = localStorage.getItem('email');
    const user = users[email];
    if (!user.studySessions) {
        user.studySessions = [];
    }
    user.studySessions.push({
        duration: elapsedTime,
        date: new Date()
    });
    localStorage.setItem('users', JSON.stringify(users));
    updateDashboard();
    elapsedTime = 0;
    updateTimerDisplay();
    addActivity("Sesión de estudio guardada.");
    updateRecentActivitySummary();
}

// Quiz Diario
function openQuizModal() {
    const quizModal = document.getElementById('quiz-modal');
    quizModal.style.display = 'block';
    loadDailyQuiz();
}

function closeQuizModal() {
    const quizModal = document.getElementById('quiz-modal');
    quizModal.style.display = 'none';
}

window.onclick = function(event) {
    const quizModal = document.getElementById('quiz-modal');
    if (event.target === quizModal) {
        quizModal.style.display = 'none';
    }
};

function loadDailyQuiz() {
    currentQuizIndex = (currentQuizIndex + 1) % dailyQuizQuestions.length;
    const questionObj = dailyQuizQuestions[currentQuizIndex];
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizResult = document.getElementById('quiz-result');

    quizQuestion.textContent = questionObj.question;
    quizOptions.innerHTML = '';
    quizResult.textContent = '';

    questionObj.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.onclick = () => checkDailyQuizAnswer(idx);
        quizOptions.appendChild(btn);
    });
}

function checkDailyQuizAnswer(selectedIndex) {
    const questionObj = dailyQuizQuestions[currentQuizIndex];
    const quizResult = document.getElementById('quiz-result');
    if (selectedIndex === questionObj.answer) {
        quizResult.textContent = "¡Correcto!";
        addActivity(`Quiz Diario: Respuesta correcta a "${questionObj.question}"`);
        addNotification("Has respondido correctamente al Quiz Diario.");
    } else {
        quizResult.textContent = "Respuesta incorrecta.";
        addActivity(`Quiz Diario: Respuesta incorrecta a "${questionObj.question}"`);
        addNotification("Has respondido incorrectamente al Quiz Diario.");
    }
    updateRecentActivitySummary();
}

// Discord (Grupos)
function redirectToDiscord() {
    window.open(discordInviteLink, '_blank');
}

