const hamburger = document.querySelector('.hamburger');
const sidebarMenu = document.querySelector('.sidebar-menu');
const sidebarClose = document.querySelector('.sidebar-close');

// GSAP timeline for smooth opening/closing
const menuTl = gsap.timeline({ paused: true });

menuTl.to(sidebarMenu, {
    x: "0%",
    duration: 0.7,
    ease: "power3.inOut"
});

// Stagger links fading and sliding in
menuTl.from(".sidebar-links a", {
    x: 30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: "power2.out"
}, "-=0.3");

hamburger.addEventListener('click', () => {
    menuTl.timeScale(1).play();
});

sidebarClose.addEventListener('click', () => {
    menuTl.timeScale(1.5).reverse();
});

// --- SCHEDULE PAGE BOOKING LOGIC --- //

// Live IST Clock Update
const liveIstTimeEl = document.getElementById('live-ist-time');
if (liveIstTimeEl) {
    function updateIST() {
        const now = new Date();
        const options = {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        liveIstTimeEl.textContent = "Current Time: " + formatter.format(now);
    }
    updateIST();
    setInterval(updateIST, 1000);
}

// Calendar Interactivity
const calendarDays = document.querySelectorAll('.calendar-grid .cal-day');
const availabilityPanel = document.querySelector('.availability-info');
const btnNext = document.querySelector('.btn-next');

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function renderTimeSlots() {
    const slots = ['10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm'];
    let html = '<div class="time-slots-grid">';
    slots.forEach(slot => {
        html += `<button class="time-slot-btn" onclick="selectTimeSlot(this)">${slot}</button>`;
    });
    html += '</div><a class="show-all-btn">Show all sessions</a>';
    return html;
}

window.selectTimeSlot = function(btn) {
    document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    if (btnNext) {
        btnNext.classList.add('active');
        btnNext.style.backgroundColor = 'var(--primary-dark)';
        btnNext.style.cursor = 'pointer';
        btnNext.disabled = false;
    }
}

if (calendarDays.length > 0 && availabilityPanel) {
    calendarDays.forEach((dayEl, index) => {
        // all days can be clicked for Demo
        // skip blank days if any (but current html has numbers everywhere)
        dayEl.addEventListener('click', () => {
            // Remove previous selection
            document.querySelectorAll('.cal-day.selected').forEach(el => {
                el.classList.remove('selected');
                el.classList.add('has-dots'); 
            });
            // Mark new selection
            dayEl.classList.add('selected');
            dayEl.classList.remove('has-dots');

            const dayNum = dayEl.textContent.trim();
            const dayOfWeekIndex = index % 7; 
            const dayName = weekdays[dayOfWeekIndex];

            // Reset Next Button
            if (btnNext) {
                btnNext.classList.remove('active');
                btnNext.style.backgroundColor = '#ccc';
                btnNext.style.cursor = 'not-allowed';
                btnNext.disabled = true;
            }

            let panelHTML = `<h3>Availability for ${dayName}, March ${dayNum}</h3>`;

            if (dayOfWeekIndex === 0) {
                // Sunday
                panelHTML += `<p class="no-avail">Check availability</p>`;
                panelHTML += `<button class="btn-check-next">Check Next Availability</button>`;
            } else {
                // Other days
                panelHTML += renderTimeSlots();
            }

            availabilityPanel.innerHTML = panelHTML;
        });
    });
}

// Step Navigation
function goToStep2() {
    if (btnNext && btnNext.disabled) return; // Prevent if NO time slot selected
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'flex';
}

function goToStep1() {
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-1').style.display = 'flex';
}

// Phone Input enforcement
const phoneInput = document.getElementById('phone-input');
if (phoneInput) {
    const prefix = "+91 ";
    phoneInput.addEventListener('input', (e) => {
        if (!phoneInput.value.startsWith(prefix)) {
            phoneInput.value = prefix;
        }
    });

    phoneInput.addEventListener('keydown', (e) => {
        if (phoneInput.selectionStart < prefix.length && (e.key === 'Backspace' || e.key === 'ArrowLeft')) {
            e.preventDefault();
        }
    });
    
    phoneInput.addEventListener('click', () => {
        if (phoneInput.selectionStart < prefix.length) {
            phoneInput.setSelectionRange(prefix.length, phoneInput.value.length);
        }
    });
}