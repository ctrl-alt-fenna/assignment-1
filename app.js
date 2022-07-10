let laptopCollection = [];
const salary = 100
const baseURL = 'https://noroff-komputer-store-api.herokuapp.com/'

const workBtn = document.getElementById('work-pay')
const bankBtn = document.getElementById('work-bank')
const loanBtn = document.getElementById('loan')
const buyBtn = document.getElementById('buy')

let selMenu = document.getElementById('laptops')
let payLoanBtn = document.getElementById('pay-loan')

let loanBal = document.getElementById('loan-bal')
let outLoan = document.getElementById('out-loan')
let balance = document.getElementById('bal')
let stockCount = document.getElementById('stock')
let pay = document.getElementById('pay')
let lapSpec = document.getElementById('lap-spec')
let lapDesc = document.getElementById('lap-desc')
let lapMain = document.getElementById('lap-main')

let currLoan = Number(loanBal.innerHTML)
let currBalance = Number(balance.innerHTML)
let currPay = Number(balance.innerHTML)
let currID = 0
let hasLoan = false

outLoan.style.visibility = 'hidden'
payLoanBtn.style.visibility = 'hidden'


loanBtn.onclick = () => {
    // Check if there is already a loan outstanding
    if (hasLoan) alert('ERROR: Only one loan per client allowed')
    else {
        let ans = prompt('How much do you wish to loan?')
        updateLoan(Number(ans));
    }
}

// Interaction with bankBtn sends current pay to the bank and reduces any outstanding loan with 10% of pay
bankBtn.onclick = () => {
    currPay = Number(pay.innerHTML)
    transferMoney(currPay)
    currPay = 0
    pay.innerHTML = 0
}

// Interaction with workBtn adds salary amount to current pay
workBtn.onclick = () => {
    currPay += salary
    pay.innerHTML = currPay
}

// Interaction with payLoanBtn reduces the loan by full current pay amount. 
payLoanBtn.onclick = () => {
    currPay = Number(pay.innerHTML);
    updateLoan(currPay);
    pay.innerHTML = 0;
    currPay = 0;
}

// Interaction with selMenu changes currently shown laptop specifications to match the selected option
selMenu.onchange = (laptopSelection) => {
    changeSpecs(laptopSelection.target.value - 1)
}

// Interaction with buyBtn checks if user can buy laptop and then removes it from stock if they can
buyBtn.onclick = () => {
    buyLaptop()
}

parseLaptops();

/* 
    A function that gets the object of laptops from the API by http request
    INPUT: Nothing
    OUTPUT: A JSON object of Laptops as retrieved from the API
*/
function parseLaptops() {
    var xhttp = new XMLHttpRequest();
    let laptopItems;
    xhttp.onload = () => {
        if (xhttp.readyState == 4) {
            laptopItems = JSON.parse(xhttp.response)
            createOptions(laptopItems)
        }
    }
    xhttp.open('GET', baseURL + "computers")
    xhttp.send()
}

/*  
    Function that adds all laptops from the GET request to the select menu
    INPUT: Object of laptopItems retrieved from the API
    OUTPUT: A selection menu with all the laptops of the API as a select-option
*/
function createOptions(laptopItems) {
    for (const laptop of laptopItems) {
        let optNode = document.createElement('option')
        optNode.value = laptop.id;
        optNode.text = laptop.title;
        selMenu.appendChild(optNode)
        laptopCollection.push(laptop);
    }
    changeSpecs()
}

/*  
    Function that updates the currently shown laptop and specification
    INPUT: A Laptop ID, or a default of the current ID set when selection was made
    OUTPUT: Changes to the laptop specification section in index.html
*/
function changeSpecs(id = currID) {
    lapSpec.textContent = ' '
    let currLaptop = laptopCollection[id]
    currLaptop.specs.map((laptopSpecs) => {
        let textItem = document.createElement('li')
        textItem.textContent = laptopSpecs
        lapSpec.appendChild(textItem)
    })
    let lapTitle = document.getElementById('lap-title')
    let lapImg = document.getElementById('lap-img')
    let lapPrice = document.getElementById('price')
    lapPrice.textContent = currLaptop.price;
    lapTitle.textContent = currLaptop.title
    lapDesc.textContent = currLaptop.description;
    stockCount.innerHTML = currLaptop.stock;
    lapImg.src = baseURL + currLaptop.image
    currID = id
}

/*  
    Function that updates the loan by a given amount
    INPUT: Loan amount to be loaned or payed back
    OUTPUT: Changes to HTML elements to match the change in loan
*/
function updateLoan(amount) {
    if (hasLoan) {
        currLoan = Number(loanBal.innerHTML)
        if (amount < currLoan) {
            currLoan -= amount
            loanBal.innerHTML = currLoan
        } else {
            hasLoan = false
            amount -= currLoan
            currLoan = 0
            outLoan.style.visibility = 'hidden'
            payLoanBtn.style.visibility = 'hidden'
            updateBalance(amount);
        }
    }
    // If user entered invalid amount, don't allow them to take out a loan
    else if (amount == NaN || amount == 0) alert('ERROR: Please enter a number!')
        // If user has no balance or the amount is too high, alert them of it
    else if (amount > 2 * currBalance || currBalance == 0) alert('ERROR: Loan too high!')
        // If the user has an outstanding loan, do not allow a second loan to be taken
    else {
        hasLoan = true
        currLoan = Number(amount)
        loanBal.innerHTML = currLoan
        payLoanBtn.style.visibility = 'visible'
        outLoan.style.visibility = 'visible'
        updateBalance(amount)
    }
}
/*
    Function that updates the balance by a given amount
    INPUT: Amount to be added to balance
    OUTPUT: Updating of the visible balance
*/
function updateBalance(amount) {
    currBalance = Number(balance.innerHTML) + Number(amount)
    balance.innerHTML = currBalance
}

/*
    Function that transfers money to bank by the given amount.
    INPUT: Amount to be transferred:
    OUTPUT: Update of the bank balance and reduction of any outstanding loan 
*/
function transferMoney(amount) {
    // If the user currently has an outstanding loan, reduce paycheck by 10% and reduce loan by this amount
    if (hasLoan) {
        updateLoan(amount * 0.1)
        updateBalance(amount * 0.9)
    } else updateBalance(amount)
    currPay = 0
    pay.innerHTML = 0
}

/*
    Function that checks if user can buy laptop with current balance and stock. If so, the balance and stock are reduced
    INPUT: Nothing
    OUTPUT: Laptop removed from stock, update of current balance
*/
function buyLaptop() {
    if (Number(stockCount.innerHTML) == 0) alert('Laptop already sold!')
    else if (laptopCollection[currID].price > Number(balance.innerHTML)) alert('Insufficient funds')
    else {
        alert('Laptop bought!')
        currBalance = Number(balance.innerHTML) - laptopCollection[currID].price;
        balance.innerHTML = currBalance
        stockCount.innerHTML = Number(stockCount.innerHTML) - 1
        laptopCollection[currID].stock = Number(stockCount.innerHTML)
    }
}