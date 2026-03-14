// =========================================
// NOTE FROM DEVELOPER LOGIC
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    const devNoteBtn = document.getElementById('dev-note-btn');
    const devNoteModal = document.getElementById('dev-note-modal');
    const closeBtn = document.getElementById('dev-note-close');
    const backBtn = document.getElementById('dev-note-back');
    
    const questionView = document.getElementById('dev-note-question-view');
    const adviceView = document.getElementById('dev-note-advice-view');
    const adviceTextContainer = document.getElementById('dev-note-advice-text');
    
    const guideBtn = document.getElementById('dev-note-guide-btn');
    const guideView = document.getElementById('dev-note-guide-view');
    const guideBackBtn = document.getElementById('dev-note-guide-back');
    
    const generalBtn = document.getElementById('dev-note-general-btn');
    const generalView = document.getElementById('dev-note-general-view');
    const generalBackBtn = document.getElementById('dev-note-general-back');
    
    const mistakesBtn = document.getElementById('dev-note-mistakes-btn');
    const mistakesView = document.getElementById('dev-note-mistakes-view');
    const mistakesBackBtn = document.getElementById('dev-note-mistakes-back');

    const philosophyBtn = document.getElementById('dev-note-philosophy-btn');
    const philosophyView = document.getElementById('dev-note-philosophy-view');
    const philosophyBackBtn = document.getElementById('dev-note-philosophy-back');
    
    const wpmBtns = document.querySelectorAll('.wpm-btn');

    // Dictionary of Advice mapped to WPM Tiers
    const adviceMap = {
        "1": "Welcome to the path! At this stage, your only goal is muscle memory. Speed will come naturally, but building the right foundation is critical. Head into <span class='hl-dojo'>Dojo Mode</span> and focus strictly on hitting the right keys with the correct fingers without looking down. Accuracy is everything right now. Don't rush—embrace the slow, deliberate practice.",
        
        "2": "You're building momentum, but this is the stage where bad habits take root. Your focus needs to shift entirely to rhythm and precision. Turn on <span class='hl-hagakure'>Hagakure Mode</span> (which forces you to type flawlessly) to unlearn any sloppy keystrokes. I also highly recommend enabling the <span class='hl-coach'>Coach</span>—having an accountability partner watching your stats will keep you focused. <em>(To enable the Coach: Open Settings > Typing Tab > scroll to Bottom-Left Widget > select 'Progress')</em>.",
        
        "3": "You've hit the great plateau. To break through, you need to eliminate hesitation and inconsistent bursts of speed. It's time to use <span class='hl-shadow'>Shadow Mode</span>. This mode will force you to maintain a relentless, consistent pace. Don't speed up when it's easy, and don't slow down when it's hard. Smoothness is the secret to unlocking the next tier.",
        
        "4": "You're fast, but to reach the elite levels, you need surgical precision. Small typos and backspaces are the only things holding you back now. Combine <span class='hl-hagakure'>Hagakure Mode</span> with intense burst sessions. Your goal is absolute perfection—every backspace at this speed costs you heavy WPM. Train your brain to refuse incorrect inputs.",
        
        "5": "You are entering the realm of mastery. At this level, improvement is about micro-optimizations and eliminating split-second hesitations. Engage the <span class='hl-coach'>Coach</span> to analyze your exact bottlenecks <em>(Settings > Typing Tab > Bottom-Left Widget > 'Progress')</em>. Use <span class='hl-shadow'>Shadow Mode</span> pushed to your absolute limit to force your brain to read ahead faster than your fingers. You're already great—now strive for perfection.",
        
        "6": "You are elite. You've transcended conscious thought and are typing entirely on instinct and raw nerve conduction. To push higher, you must train your visual processing. Push the <span class='hl-shadow'>Shadow Mode</span> speed far beyond your comfort zone to train your eyes to scan entire sentences at once. Let the layout disappear entirely. You have nothing left to prove—now it's just about seeing how far human limits can be pushed."
    };

    // Open Modal
    devNoteBtn?.addEventListener('click', () => {
        resetModal();
        devNoteModal.classList.remove('hidden');
    });

    // Close Modal
    const closeModal = () => {
        devNoteModal.classList.add('hidden');
    };

    closeBtn?.addEventListener('click', closeModal);
    
    // Close on overlay click
    devNoteModal?.addEventListener('click', (e) => {
        if (e.target === devNoteModal || e.target.classList.contains('dev-note-overlay')) {
            closeModal();
        }
    });

    // Go Back to Question View
    backBtn?.addEventListener('click', resetModal);
    guideBackBtn?.addEventListener('click', resetModal);
    generalBackBtn?.addEventListener('click', resetModal);
    mistakesBackBtn?.addEventListener('click', resetModal);
    philosophyBackBtn?.addEventListener('click', resetModal);

    // Guide Button Click
    guideBtn?.addEventListener('click', () => {
        questionView.classList.add('hidden');
        guideView.classList.remove('hidden');
    });

    // General Advice Button Click
    generalBtn?.addEventListener('click', () => {
        questionView.classList.add('hidden');
        generalView.classList.remove('hidden');
    });

    // Common Mistakes Button Click
    mistakesBtn?.addEventListener('click', () => {
        questionView.classList.add('hidden');
        mistakesView.classList.remove('hidden');
    });

    // Practice Philosophy Button Click
    philosophyBtn?.addEventListener('click', () => {
        questionView.classList.add('hidden');
        philosophyView.classList.remove('hidden');
    });

    // Handle WPM Button Clicks
    wpmBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tier = e.currentTarget.getAttribute('data-tier');
            const adviceHTML = adviceMap[tier];
            
            if (adviceHTML) {
                // Set text
                adviceTextContainer.innerHTML = adviceHTML;
                
                // Transition views
                questionView.classList.add('hidden');
                adviceView.classList.remove('hidden');
            }
        });
    });

    function resetModal() {
        questionView.classList.remove('hidden');
        adviceView.classList.add('hidden');
        if (guideView) guideView.classList.add('hidden');
        if (generalView) generalView.classList.add('hidden');
        if (mistakesView) mistakesView.classList.add('hidden');
        if (philosophyView) philosophyView.classList.add('hidden');
        adviceTextContainer.innerHTML = '';
    }
});
