const Keyboard = window.SimpleKeyboard.default;

let isEnglish = false; // 현재 언어 상태를 저장하는 변수 
let isSpecial = false; // 특수 기호
let isCaps = false; // Caps 상태를 저장하는 변수

const initButtonTheme = [
  {
    class:"lg-button highlight-button",
    buttons: "{bksp} {enter} {lang} {special} {del}"
  },
  {
    class:"m-button",
    buttons: "{lock}"
  },
  {
    class:"m-button highlight-button",
    buttons: ".com"
  },
  {
    class:"lg-button disabled",
    buttons: "{lgBlank}"
  },
  {
    class:"sm-button disabled",
    buttons:"{smBlank}"
  },
  {
    class:"highlight-button",
    buttons: "@"
  }
]

const initKorDisplay = {
    "{lang}": "ABC",
    "{bksp}": "←",
    "{enter}": "Enter",
    "{lock}": `<div style="line-height: 1;"><span style="font-size: 1rem;">CAPS</span><br/><span class="caps-label">ㄱ→ㄲ</span></div>`,
    "{space}": " ",
    "{smBlank}": " ",
    "{lgBlank}": " ",
    "{special}": "!#1",
    "{del}": "Del",
}

const initEngDisplay = {
  "{lang}": "가나다",
  "{bksp}": "←",
  "{enter}": "Enter",
  "{lock}": `<div style="line-height: 1;"><span style="font-size: 1rem;">CAPS</span><br/><span class="caps-label">a→A</span></div>`,
  "{space}": " ",
  "{smBlank}": " ",
  "{lgBlank}": " ",
  "{special}": "!#1",
  "{del}": "Del",
}

const myKeyboard = new Keyboard({
  onChange: input => {
    onChange(input);
  },
  onKeyPress: button => onKeyPress(button),
  onKeyReleased: button => onKeyReleased(button),
  layout: {
    language: ["1 2 3 4 5 6 7 8 9 0 {bksp}", "q w e r t y u i o p {del}", "{smBlank} a s d f g h j k l {lang}", "{lock} z x c v b n m . {special}", ".com @ {space} {enter}"],
    languageShift: ["1 2 3 4 5 6 7 8 9 0 {bksp}", "Q W E R T Y U I O P {del}", "{smBlank} A S D F G H J K L {lang}", "{lock} Z X C V B N M . {special}", ".com @ {space} {enter}"],
    default: ["1 2 3 4 5 6 7 8 9 0 {bksp}", "ㅂ ㅈ ㄷ ㄱ ㅅ ㅛ ㅕ ㅑ ㅐ ㅔ {del}", "{smBlank} ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ {lang}", "{lock} ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ . {special}", ".com @ {space} {enter}"],
    shift: ["1 2 3 4 5 6 7 8 9 0 {bksp}", "ㅃ ㅉ ㄸ ㄲ ㅆ ㅛ ㅕ ㅑ ㅒ ㅖ {del}", "{smBlank} ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ {lang}", "{lock} ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ . {special}", ".com @ {space} {enter}"], // Shift 상태에서의 한글 키 배열
    special: ["1 2 3 4 5 6 7 8 9 0 {bksp}", "! @ # $ % ^ & * ( ) {del}", "~ - _ + = \\ { } [ ] {lang}", "| \\ ; : \" ' ? / < > , .", "{space} {enter}"],
    num: ["1 2 3", "4 5 6", "7 8 9", "010 0 {bksp}", "{enter}"]
  },
  display: initKorDisplay,
  buttonTheme: initButtonTheme
});


let keyboardContainer = myKeyboard.keyboardDOM;

// 최초에 키보드를 숨김
myKeyboard.keyboardDOM.classList.add("hidden");

// 키보드 영역 선택 시 키보드 닫히지 않도록 설정
keyboardContainer.addEventListener('mousedown', function (event) {
  event.preventDefault();
});

// input 요소를 선택했을 때 키보드를 표시
let inputs = document.querySelectorAll("input");
inputs.forEach(input => {
  input.addEventListener("focus", () => {
  
    let focusedInput = document.activeElement;
    
	if (focusedInput && focusedInput.tagName === "INPUT" && focusedInput.name ==="hpNo") {
	    // numPad Setting
		myKeyboard.setOptions({
		    layoutName: "num",
		    buttonTheme: [
		      {
		        class:"numPad",
		        buttons: "1 2 3 4 5 6 7 8 9 0 010 {bksp} {enter}"
		      },
		    ],
		});
	}else{
    isCaps = false;
    // English First Setting
    if(focusedInput && (focusedInput.name === "email" || focusedInput.name === "usrPw" || focusedInput.name === "originUsrId")){
      isEnglish = true;
      myKeyboard.setOptions({
          layoutName: "language",
          display: initEngDisplay,
          buttonTheme: initButtonTheme,
      });
    }else{
      // Basic(Korean First) Setting
      isEnglish = false;
      myKeyboard.setOptions({
          layoutName: "default",
          display: initKorDisplay,
          buttonTheme: initButtonTheme,
      });
    }
	}
	// 선택한 input의 value로 myKeyBoard Input 초기화
	myKeyboard.setInput(input.value);
    myKeyboard.keyboardDOM.classList.remove("hidden");
  });

  // 물리 키보드의 입력을 가상 키보드에 반영
  input.addEventListener("keyup", (event) => {
    myKeyboard.setInput(event.target.value);
  });

  // input 요소에서 포커스를 잃었을 때 키보드를 숨김
  input.addEventListener("blur", () => {
  	myKeyboard.setInput("");
    myKeyboard.keyboardDOM.classList.add("hidden");
  });
});


function onChange(input) {
  // 한글 분리 재조합.
  let temp = Hangul.disassemble(input).join("");
  let result = Hangul.assemble(temp.split(''));

  // 키보드 입력 길이와 실제 문자열 길이 저장
  let keyBoardInputLen = myKeyboard.getInput().length;
  let resultInputLen = result.length;

  // 현재 포커스된 input 요소를 찾습니다.
  var focusedInput = document.activeElement;
  if (focusedInput && focusedInput.tagName === "INPUT") {
      // input 요소의 값을 simple-keyboard의 입력 값으로 변경합니다.
      focusedInput.value = result;
      
      // 해당 input에 설정된 change 와 keyup 이벤트 실행되도록 합니다.
	  var event = new Event('change');
	  focusedInput.dispatchEvent(event);

	  event = new Event('keyup');
	  focusedInput.dispatchEvent(event);
  }

  myKeyboard.setInput(result);

  // 키보드 입력 길이와 실제 문자열 길이 비교하여 보정 (한글 입력 시에 발생하는 caretPosition 이슈 해결)
  if(keyBoardInputLen != resultInputLen){
    const caretPosition = myKeyboard.getCaretPosition();
    myKeyboard.setCaretPosition(caretPosition ? caretPosition-1 : null)
  }
}


function onKeyPress(button) {
  if (button === "{lock}") handleCapsClick();
  if (button === "{lang}") handleLanguageChange();
  if (button === "{special}") handleLanguageChange("special");
  if (button === "{del}") handleDelClick();
}

function onKeyReleased(button) {
  if (button === "{enter}") handleEnterClick();
}



// 언어 변경 핸들러
function handleLanguageChange(type) {

  let layoutName = isEnglish ? "default" : "language";
  let lockDisplay = isEnglish ?
  `<div style="line-height: 1;"><span style="font-size: 1rem;">CAPS</span><br/><span class="caps-label">ㄱ→ㄲ</span></div>`:
  `<div style="line-height: 1;"><span style="font-size: 1rem;">CAPS</span><br/><span class="caps-label">a→A</span></div>`
  let langDisplay = isEnglish ? `ABC`: `가나다`

  let currentDisplayOption = myKeyboard.options.display;
  let currentButtonThemeOption = myKeyboard.options.buttonTheme;
  let specialButtonThemeOption = [...currentButtonThemeOption, {class:"escape m-button", buttons:"."}, {class:"escape xl-button", buttons:"{space}"}, {class:"black-button", buttons:"@"}]

  let buttonThemeOption = initButtonTheme;

  // type이 special
  if(type === "special"){
    isSpecial= true;
    layoutName = "special"
    buttonThemeOption = specialButtonThemeOption;
  }

  myKeyboard.setOptions({
    layoutName: layoutName,
    display: {
      ...currentDisplayOption,
      "{lock}": lockDisplay,
      "{lang}": langDisplay
    },
    buttonTheme : buttonThemeOption
  });

  isEnglish = !isEnglish;

  // 언어를 변경하면 isCaps 초기화
  isCaps = false;
}


// Caps 핸들러
function handleCapsClick() {
  let layoutName;

  if (isCaps) {
    layoutName = isEnglish ? "language" : "default";
  } else {
    layoutName = isEnglish ? "languageShift" : "shift";
  }

  myKeyboard.setOptions({
    layoutName: layoutName
  });

  if (isCaps) {
    document.querySelector(".hg-button-lock").classList.remove("activeCaps")
  } else {
    document.querySelector(".hg-button-lock").classList.add("activeCaps")
  }

  isCaps = !isCaps;
}


// Delete 핸들러
function handleDelClick(){
    // input clear
    myKeyboard.setInput("")
    myKeyboard.setCaretPosition(0)
    
    // 현재 포커스된 input 요소를 찾습니다.
    var focusedInput = document.activeElement;
    if (focusedInput && focusedInput.tagName === "INPUT") {
      // input clear
      focusedInput.value = "";
      focusedInput.focus();
    }
    
}

// Enter 핸들러
function handleEnterClick(){
	// 키보드가 즉각 사라지면 터치 이벤트가 키보드 뒤에서도 발생하여 setTimeOut 처리
	setTimeout(function(){
		myKeyboard.keyboardDOM.classList.add("hidden"); // 키보드 숨김
	}, 100)
}