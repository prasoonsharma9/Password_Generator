const inputslider = document.querySelector("[data-passwordSlider]");
const lengthDisplay = document.querySelector("[data-numberLength]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-strengthCircle]");
const generateBtn = document.querySelector("[data-passwordButton]");
const allChecks = document.querySelectorAll("input[type=checkbox]");
const symbol = '~/.,<>:][{}\|!@#$%^&*()_+=-';
 
let password = "";
let passwordLength = 17;  
let checkCount = 0 ;
handleSlide();
setIndicator("#ccc"); 



 
// --------- FUNCTION FOR HANDLING SLIDINNG BAR------
function handleSlide(){
  inputslider.value = passwordLength;
  lengthDisplay.innerText = inputslider.value;

  const mini = inputslider.min;
  const maxi = inputslider.max;
  inputslider.style.backgroundSize = ((passwordLength - mini)*100 / (maxi - mini)) + "% 100%";

}

// ---------- FUNCTION TO SET THE COLOR OF STRENGTH CITCLE --------------
function setIndicator(color){
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// -------- FUNCTION TO GET RANDOM INTEGER AND VLAUES ---------
function getRandomInteger(min, max){
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
  return getRandomInteger(0,9);
}

function generateLowercase(){
  return String.fromCharCode(getRandomInteger(97,123));
}

function generateUppercase(){
  return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol(){
  const index = getRandomInteger(0, symbol.length);
  return symbol.charAt(index);
}


// ------------ FUNCTION TO CALCULATE STRENGTH OF PASSWORD -------------
function calStrength(){
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;

  if(uppercaseCheck.checked) hasUpper = true;
  if(lowercaseCheck.checked) hasLower = true;
  if(numberCheck.checked) hasNumber = true;
  if(symbolCheck.checked) hasSymbol = true;

  if(hasUpper && hasLower && (hasNumber || hasSymbol) && password.length >= 8){
    setIndicator("#0f0");
  }
  else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && password.length >=6){
    setIndicator("#ff0");
  }
  else{
    setIndicator("#f00");
  }
}

// FUNCTION FOR COPYING THE CONTENT
async function copyContent(){
  try{
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  }
  catch(e){ 
    copyMsg.innerText = "failed";
  }

  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active")
  },2000)
} 


// FUNCTION FOR SHUFFLING THE PASSWORD
function shufflePassword(array){
  // Fisher Yates method..
  for(let i=array.length-1; i>0; i--){
    const j = Math.floor(Math.random() * (i+1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

// FUNCTION FOR handleCheckboxChange
function handleCheckboxChange(){
  checkCount = 0;
  allChecks.forEach((checkbox) => {
    if(checkbox.checked){
      checkCount++;
    }
  });

  if(passwordLength < checkCount){
    passwordLength = checkCount;
    handleSlide();
  }
} 

// EVENT LISTNER AT CHECKBOX
allChecks.forEach((checkbox) => {
  checkbox.addEventListener('change', handleCheckboxChange);
})


// EVENT LISTENER AT SLIDER
inputslider.addEventListener('input', (Event) => {
  passwordLength = Event.target.value;
  handleSlide();
});

// EVENT LISTENER AT COPY BUTTON
copyBtn.addEventListener('click', () => {
  if(passwordDisplay.value)
    copyContent();
})

// FUNCTION TO GENERATE PASSWORD ON CLICKING THE GENERATE BUTTON
generateBtn.addEventListener("click", () => {
  
  if(checkCount == 0) return;
  if(passwordLength < checkCount){
    passwordLength = checkCount; 
    handleSlide();
  }

console.log("starting the journey");

  password = "";
  let funcArr = [];

  if(uppercaseCheck.checked){
    funcArr.push(generateUppercase);
  }

  if(lowercaseCheck.checked){
    funcArr.push(generateLowercase);
  }

  if(numberCheck.checked){
    funcArr.push(generateRandomNumber);
  }

  if(symbolCheck.checked){
    funcArr.push(generateSymbol);
  }

  // compulsory addition
  for(let i=0; i<funcArr.length; i++){
    password += funcArr[i]();
  }
console.log("Compulsory addition done");


  // remaining addition
  for(let i=0; i<passwordLength-funcArr.length; i++){
    let randomIdx = getRandomInteger(0, funcArr.length);
    password += funcArr[randomIdx]();
  }
console.log("Remainning addition done");

  // SHUFFLING THE PASSWORD
  console.log("shuffking start");
  password = shufflePassword(Array.from(password));
console.log("Shuffling done");

  passwordDisplay.value = password;
console.log("UI addition done");

  // AFTER SHOWING THE PASSWORD WE HAVE TO SHOW ITS STRENGTH..
  calStrength();

});

