function getRandomColor(){
    const randomNum = Math.floor(Math.random()*16777216);
    const hexString = randomNum.toString(16);
    const paddedHex = hexString.padStart(6,"0");
    return `#${paddedHex}`;
}

const colorDisplay = document.getElementById("color-code"); 
const randomBtn = document.getElementById("random-btn");
const gradientBtn = document.getElementById("gradient-btn");
const copyBtn = document.getElementById("copy-btn");
const toast = document.getElementById("toast");
const historyList = document.getElementById("history-list");

const gradientModal = document.getElementById("gradient-modal");
const gradientInputsContainer = document.getElementById("gradient-inputs-container");
const addColorBtn = document.getElementById("add-color-btn");
const cancelGradBtn = document.getElementById("cancel-grad-btn");
const applyGradBtn = document.getElementById("apply-grad-btn");

let colorHistory = [];

function updateHistory(color) {
    if (!colorHistory.includes(color)) {
        colorHistory.unshift(color);
        if (colorHistory.length > 20) colorHistory.pop();
        renderHistory();
    }
}

function deleteHistoryItem(index) {
    colorHistory.splice(index, 1);
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    colorHistory.forEach((color, index) => {
        const container = document.createElement('div');
        container.className = 'history-item-container';

        const preview = document.createElement('div');
        preview.className = 'history-color-preview';
        preview.style.background = color;
        preview.title = color;
        preview.addEventListener('click', () => applyColor(color));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'history-delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteHistoryItem(index));

        container.appendChild(preview);
        container.appendChild(deleteBtn);
        historyList.appendChild(container);
    });
}

function applyColor(color) {
    document.body.style.background = color;
    colorDisplay.textContent = color.toUpperCase();
}

function changecolor(){
    const newColor = getRandomColor();
    applyColor(newColor);
    updateHistory(newColor);
}

function openGradientModal() {
    gradientModal.classList.add('show');
    gradientInputsContainer.innerHTML = `
        <div class="color-input-group">
          <label>Color 1 (Hex, RGB, or Name):</label>
          <input type="text" class="grad-color-input" placeholder="e.g. #FF0000 or red">
        </div>
        <div class="color-input-group">
          <label>Color 2 (Hex, RGB, or Name):</label>
          <input type="text" class="grad-color-input" placeholder="e.g. #0000FF or blue">
        </div>
    `;
    const inputs = document.querySelectorAll('.grad-color-input');
    inputs[0].value = getRandomColor();
    inputs[1].value = getRandomColor();
}

function addColorInput() {
    const inputsCount = document.querySelectorAll('.grad-color-input').length;
    const newGroup = document.createElement('div');
    newGroup.className = 'color-input-group';
    newGroup.innerHTML = `
        <label>Color ${inputsCount + 1} (Hex, RGB, or Name):</label>
        <input type="text" class="grad-color-input" placeholder="e.g. #00FF00 or green">
    `;
    gradientInputsContainer.appendChild(newGroup);
    newGroup.querySelector('input').value = getRandomColor();
}

function closeGradientModal() {
    gradientModal.classList.remove('show');
}

function applyCustomGradient() {
    const inputs = document.querySelectorAll('.grad-color-input');
    const colors = Array.from(inputs).map(input => input.value.trim() || getRandomColor());
    const angle = Math.floor(Math.random() * 360);
    const newGradient = `linear-gradient(${angle}deg, ${colors.join(', ')})`;
    applyColor(newGradient);
    updateHistory(newGradient);
    closeGradientModal();
}

function copyColor(){
    const color = colorDisplay.textContent;
    navigator.clipboard.writeText(color).then(()=>{
        toast.classList.add("show");
        setTimeout(()=>toast.classList.remove("show"),1500);
    });
}

randomBtn.addEventListener("click",changecolor);
gradientBtn.addEventListener("click", openGradientModal);
addColorBtn.addEventListener("click", addColorInput);
cancelGradBtn.addEventListener("click", closeGradientModal);
applyGradBtn.addEventListener("click", applyCustomGradient);
copyBtn.addEventListener("click",copyColor);

colorDisplay.addEventListener("click",copyColor);

document.addEventListener("keydown",(e)=>{
    if(e.code=="space"){
        e.preventDefault();
        changecolor();
    }
});

// Suggested Gradients
const suggestionsList = document.getElementById('suggestions-list');
const refreshSuggestionsBtn = document.getElementById('refresh-suggestions-btn');

function generateRandomGradientString() {
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    const angle = Math.floor(Math.random() * 360);
    return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
}

function initSuggestions() {
  if(!suggestionsList) return;
  suggestionsList.innerHTML = '';
  for(let i = 0; i < 6; i++) {
     const grad = generateRandomGradientString();
     const div = document.createElement('div');
     div.className = 'suggestion-item';
     div.style.background = grad;
     div.title = grad;
     div.addEventListener('click', () => {
         applyColor(grad);
         updateHistory(grad);
     });
     suggestionsList.appendChild(div);
  }
}

if (refreshSuggestionsBtn) {
    refreshSuggestionsBtn.addEventListener('click', initSuggestions);
}

initSuggestions();