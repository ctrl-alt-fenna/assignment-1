let laptopCollection = [];
const salary = 100
const URL = 'https://noroff-komputer-store-api.herokuapp.com/'

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

parseLaptops();

loanBtn.onclick = () => {
    // First check if there is already a loan out
    if (hasLoan) alert('ERROR: Only one loan per client allowed')
    else {
        let ans = prompt('How much do you wish to loan?')
        updateLoan(Number(ans));
    }
}
bankBtn.onclick = () => {
    currPay = Number(pay.innerHTML)
    transferMoney(currPay)
    currPay = 0
    pay.innerHTML = 0
}
workBtn.onclick = () => {
    currPay += salary
    pay.innerHTML = currPay
}
payLoanBtn.onclick = () => {
    currPay = Number(pay.innerHTML);
    updateLoan(currPay);
    pay.innerHTML = 0;
    currPay = 0;
}
selMenu.onchange = (e) => {
    changeSpecs(e.target.value - 1)
}
buyBtn.onclick = () => {
    buyLaptop()
}

function parseLaptops() {
    var xhttp = new XMLHttpRequest();
    let laptopItems;
    xhttp.onload = () => {
        if (xhttp.readyState == 4) {
            laptopItems = JSON.parse(xhttp.response)
            createOptions(laptopItems)
        }
    }
    xhttp.open('GET', URL + "computers")
    xhttp.send()
}

function createOptions(laptopItems) {
    for (const iterator of laptopItems) {
        let optNode = document.createElement('option')
        optNode.value = iterator.id;
        optNode.text = iterator.title;
        selMenu.appendChild(optNode)
        laptopCollection.push(iterator);
    }
    changeSpecs()
}

function changeSpecs(id = currID) {
    lapSpec.textContent = ' '
    let currLaptop = laptopCollection[id]
    currLaptop.specs.map((e) => {
        let textItem = document.createElement('li')
        textItem.textContent = e
        lapSpec.appendChild(textItem)
    })
    let lapTitle = document.getElementById('lap-title')
    let lapImg = document.getElementById('lap-img')
    let lapPrice = document.getElementById('price')
    lapPrice.textContent = currLaptop.price;
    lapTitle.textContent = currLaptop.title
    lapDesc.textContent = currLaptop.description;
    stockCount.innerHTML = currLaptop.stock;
    lapImg.src = URL + currLaptop.image
    currID = id
}

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
        console.log(currLoan)
        loanBal.innerHTML = currLoan
        payLoanBtn.style.visibility = 'visible'
        outLoan.style.visibility = 'visible'
        updateBalance(amount)
    }
}

function updateBalance(amount) {
    currBalance = Number(balance.innerHTML) + Number(amount)
    balance.innerHTML = currBalance
}

function transferMoney(amount) {
    // If the user currently has an outstanding loan, reduce paycheck by 10% and reduce loan by this amount
    if (hasLoan) {
        updateLoan(amount * 0.1)
        updateBalance(amount * 0.9)
    } else updateBalance(amount)
    currPay = 0
    pay.innerHTML = 0
}


function buyLaptop() {
    if (Number(stockCount.innerHTML) == 0) alert('Laptop already sold!')
    else if (laptopCollection[currID].price > Number(balance.innerHTML)) alert('Insufficient funds')
    else {
        alert('Laptop bought!')
        currBalance = Number(balance.innerHTML) - laptopCollection[currID].price;
        balance.innerHTML = currBalance
        stockCount.innerHTML = Number(stockCount.innerHTML) - 1
    }
}