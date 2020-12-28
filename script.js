const calcKeys = document.querySelector('.all-buttons');
const userInput = document.querySelector('#user-input');
const calculator = document.querySelector('.calculator');
const displayResult = document.querySelector('#result');
let isEqualsPressed = false;
let equation = 0;
let checkForDecimal = '';

calcKeys.addEventListener('click', (event) => {

	//Check if button is clicked
	if(!event.target.closest('button')) return;

	const key = event.target;
	const keyValue = key.textContent;
	let inputDisplay = userInput.textContent;
	const { type } = key.dataset;
	const { previousKeyType } = calculator.dataset;

	if(type === 'number' && !isEqualsPressed) {
		
		if (inputDisplay === '0') {
			userInput.textContent = (previousKeyType === 'operator') ? inputDisplay + keyValue : keyValue;
			equation = (previousKeyType === 'operator') ? equation + key.value : key.value;
			checkForDecimal = checkForDecimal + keyValue;
		}else {
			//Check length so that number stays within display box
			if (checkForDecimal.length >= 19) {
				var replaceNumber = checkForDecimal;
				checkForDecimal = Number(checkForDecimal).toExponential(2);
				userInput.textContent = inputDisplay.replace(replaceNumber, checkForDecimal);
			}else {
				//Check for Infinity OR NaN in Display
				userInput.textContent = userInput.textContent.includes('N') ? 'NaN' : 
										userInput.textContent.includes('I') ? 'Infinity' : inputDisplay + keyValue;
				equation = equation + key.value;
				checkForDecimal = checkForDecimal + keyValue;
			}
		}
	}

	//Check if operator is pressed 
	if (type === 'operator' && previousKeyType !== 'operator'
		&& !isEqualsPressed && !inputDisplay.includes('Infinity')) {
		checkForDecimal = '';
		userInput.textContent = inputDisplay + ' ' + keyValue + ' ';
		equation = equation + ' ' + key.value + ' ';

	}

	//Check if Decimal button is pressed
	if (type === 'decimal' && (previousKeyType === 'number' || inputDisplay === '0')
		&& !isEqualsPressed && !inputDisplay.includes('Infinity')) {
		if (!checkForDecimal.includes('.')) {
			userInput.textContent = inputDisplay + keyValue;
			equation = equation + key.value;
			checkForDecimal = checkForDecimal + keyValue;
		}
	}

	if ((type === 'backspace' || type === 'reset') && inputDisplay !== '0') {
		if (type === 'backspace' && !isEqualsPressed) {
			userInput.textContent = inputDisplay.substring(0, inputDisplay.length - 1);
			equation = equation.substring(0, equation.length - 1);
			checkForDecimal = checkForDecimal.substring(0, checkForDecimal.length - 1);
		} else {
			inputDisplay = '0';
			userInput.textContent = inputDisplay;
			displayResult.innerHTML = '&nbsp;';
			isEqualsPressed = false;
			equation = '';
			checkForDecimal = '';
		}

	}

	//Check if equal is pressed
	if (type === 'equal') {
    	// Perform the calculation
	    isEqualsPressed = true;
	    const finalResult = handleEquation(equation);
	    
	    if (finalResult || finalResult === 0) {
	    	displayResult.textContent = (!Number.isInteger(finalResult)) ? finalResult.toFixed(2) : 
	    								(finalResult.toString().length >= 16) ? finalResult.toExponential(2) : finalResult ;
	    } else {
	    	displayResult.textContent = 'Math Error';
	    }
	    
  }

	calculator.dataset.previousKeyType = type;
})

//Calculate result based on operator
function calculate(firstNumber, operator, secondNumber) {

	firstNumber = Number(firstNumber);
	secondNumber = Number(secondNumber);

	switch(operator) {
		case "plus": 
			return firstNumber + secondNumber;
		case "+": 
			return firstNumber + secondNumber;
		case "minus": 
			return firstNumber - secondNumber;
		case "-": 
			return firstNumber - secondNumber;
		case "multiply": 
			return firstNumber * secondNumber;
		case "x": 
			return firstNumber * secondNumber;
		case "divide": 
			return firstNumber / secondNumber;
		case "/": 
			return firstNumber / secondNumber;
		case "remainder": 
			return firstNumber % secondNumber;
		case "%": 
			return firstNumber % secondNumber;
	} 
}

function handleEquation(equation) {

	equation = equation.split(" ");
	const operators = ['/', 'x', '%', '+', '-'];
	let firstNumber;
	let secondNumber;
	let operator;
	let operatorIndex;
	let result;

	// 1. Perform calculations		
	for (var i = 0; i < operators.length; i++) {
		while (equation.includes(operators[i])) {
			operatorIndex = equation.findIndex(item => item === operators[i]);
			firstNumber = equation[operatorIndex-1];
			operator = equation[operatorIndex];
			secondNumber = equation[operatorIndex+1];
			result = calculate(firstNumber, operator, secondNumber);
			equation.splice(operatorIndex - 1, 3, result);
		}
	}

	return result;
}

// Event Listener for keyboard button press
document.addEventListener('keydown', (event) => {
	
	let getOperators = {
		'/': 'divide',
		'x': 'multiply',
		'*': 'multiply',
		'%': 'remainder',
		'+': 'plus',
		'-': 'minus'
	}

	if(!isNaN(event.key) && event.key !== ' '){
		document.getElementById(`digit-${event.key}`).click();
	}
	if (['/', 'x', '+', '-', '*', '%'].includes(event.key)) {
		document.getElementById(getOperators[event.key]).click();
	}
	if (event.key === 'Backspace' || event.key ==='c' || event.key === 'C') {
		document.getElementById('clear').click();	
	}
	if (event.key === '=' || event.key === 'Enter') {
		document.getElementById('equals').click();	
	}
	if (event.key === '.') {
		document.getElementById('decimal').click();	
	}
});