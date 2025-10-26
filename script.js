        // Calculator class to manage state and operations
        class Calculator {
            constructor(previousOperandElement, currentOperandElement) {
                this.previousOperandElement = previousOperandElement;
                this.currentOperandElement = currentOperandElement;
                this.clear();
            }

            // Clear the calculator display and reset state
            clear() {
                this.currentOperand = '0';
                this.previousOperand = '';
                this.operation = undefined;
                this.updateDisplay();
            }

            // Delete the last character from current operand
            delete() {
                if (this.currentOperand === '0') return;
                this.currentOperand = this.currentOperand.toString().slice(0, -1);
                if (this.currentOperand === '') {
                    this.currentOperand = '0';
                }
                this.updateDisplay();
            }

            // Append a number to the current operand
            appendNumber(number) {
                // Prevent multiple decimal points
                if (number === '.' && this.currentOperand.includes('.')) return;
                
                // Replace initial zero if needed
                if (this.currentOperand === '0' && number !== '.') {
                    this.currentOperand = number;
                } else {
                    this.currentOperand = this.currentOperand.toString() + number;
                }
                this.updateDisplay();
            }

            // Choose an operation to perform
            chooseOperation(operation) {
                // If current operand is empty, do nothing
                if (this.currentOperand === '') return;
                
                // If previous operand exists, calculate first
                if (this.previousOperand !== '') {
                    this.calculate();
                }
                
                this.operation = operation;
                this.previousOperand = this.currentOperand;
                this.currentOperand = '';
                this.updateDisplay();
            }

            // Perform the calculation based on the chosen operation
            calculate() {
                let computation;
                const prev = parseFloat(this.previousOperand);
                const current = parseFloat(this.currentOperand);
                
                // If either operand is not a number, return
                if (isNaN(prev) || isNaN(current)) return;
                
                // Perform the appropriate calculation
                switch (this.operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '-':
                        computation = prev - current;
                        break;
                    case '×':
                        computation = prev * current;
                        break;
                    case '÷':
                        // Handle division by zero
                        if (current === 0) {
                            alert("Cannot divide by zero!");
                            this.clear();
                            return;
                        }
                        computation = prev / current;
                        break;
                    default:
                        return;
                }
                
                // Set the result as the current operand and reset other values
                this.currentOperand = computation.toString();
                this.operation = undefined;
                this.previousOperand = '';
                this.updateDisplay();
            }

            // Update the display with current calculator state
            updateDisplay() {
                this.currentOperandElement.innerText = this.currentOperand;
                
                // Show the operation in the previous operand display if applicable
                if (this.operation != null) {
                    this.previousOperandElement.innerText = 
                        `${this.previousOperand} ${this.operation}`;
                } else {
                    this.previousOperandElement.innerText = '';
                }
            }
        }

        // Get DOM elements
        const previousOperandElement = document.querySelector('.previous-operand');
        const currentOperandElement = document.querySelector('.current-operand');
        const numberButtons = document.querySelectorAll('[data-number]');
        const operationButtons = document.querySelectorAll('[data-operation]');
        const equalsButton = document.querySelector('[data-action="calculate"]');
        const clearButton = document.querySelector('[data-action="clear"]');
        const deleteButton = document.querySelector('[data-action="delete"]');

        // Create calculator instance
        const calculator = new Calculator(previousOperandElement, currentOperandElement);

        // Add event listeners to number buttons
        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                calculator.appendNumber(button.getAttribute('data-number'));
            });
        });

        // Add event listeners to operation buttons
        operationButtons.forEach(button => {
            button.addEventListener('click', () => {
                calculator.chooseOperation(button.getAttribute('data-operation'));
            });
        });

        // Add event listener to equals button
        equalsButton.addEventListener('click', () => {
            calculator.calculate();
        });

        // Add event listener to clear button
        clearButton.addEventListener('click', () => {
            calculator.clear();
        });

        // Add event listener to delete button
        deleteButton.addEventListener('click', () => {
            calculator.delete();
        });

        // Add keyboard support
        document.addEventListener('keydown', (event) => {
            // Prevent default behavior for calculator keys
            if (
                event.key >= '0' && event.key <= '9' ||
                event.key === '.' ||
                event.key === '+' || event.key === '-' ||
                event.key === '*' || event.key === '/' ||
                event.key === 'Enter' || event.key === 'Escape' || 
                event.key === 'Backspace'
            ) {
                event.preventDefault();
            }

            // Handle number and decimal point keys
            if (event.key >= '0' && event.key <= '9' || event.key === '.') {
                calculator.appendNumber(event.key);
            }

            // Handle operation keys
            if (event.key === '+' || event.key === '-') {
                calculator.chooseOperation(event.key);
            }

            // Handle multiplication and division with different key representations
            if (event.key === '*') {
                calculator.chooseOperation('×');
            }
            if (event.key === '/') {
                calculator.chooseOperation('÷');
            }

            // Handle equals and Enter key
            if (event.key === '=' || event.key === 'Enter') {
                calculator.calculate();
            }

            // Handle clear (Escape) and delete (Backspace) keys
            if (event.key === 'Escape') {
                calculator.clear();
            }
            if (event.key === 'Backspace') {
                calculator.delete();
            }
        });
