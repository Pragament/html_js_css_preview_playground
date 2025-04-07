const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const stepInfo = document.querySelector('.step-info');
const stepContainer = document.getElementById('step-container');
let currentStep = 1;
        let totalSteps = 1; // Default

fetch('https://staticapis.pragament.com/online_courses/freecodecamp-html.json')
    .then(response => response.json())
    .then(data => {
        const chapters = data.chapters;
        totalSteps = chapters.length;

                // Create step indicators
        chapters.forEach((chapter, index) => {
            const step = document.createElement('span');
            step.classList.add('step');
            step.setAttribute('data-step', index + 1);
            if (index === 0) {
                step.classList.add('active');
            }
            stepContainer.appendChild(step);
        });

        updateSteps();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

function updateSteps() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    stepInfo.textContent = `Step ${currentStep} of ${totalSteps}`;
}

prevButton.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateSteps();
    }
});

nextButton.addEventListener('click', () => {
    if (currentStep < totalSteps) {
        currentStep++;
        updateSteps();
    }
});

        // Initial update (if data is already available)
if (stepContainer.children.length > 0) {
    updateSteps();
}
    