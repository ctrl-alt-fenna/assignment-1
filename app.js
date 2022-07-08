let laptopCollection = [];
const workBtn = document.getElementById('work-pay')
const bankBtn = document.getElementById('work-bank')
const loanBtn = document.getElementById('loan')
const salary = 100

let selMenu = document.getElementById('laptops')
let payLoanBtn = document.getElementById('pay-loan')
let loanBal = document.getElementById('loan-bal')
let outLoan = document.getElementById('out-loan')
let balance = document.getElementById('bal')
let pay = document.getElementById('pay')
let lapSpec = document.getElementById('lap-spec')
let lapDesc = document.getElementById('lap-desc')
let lapMain = document.getElementById('lap-main')

let currLoan = Number(loanBal.innerHTML)
let currBalance = Number(balance.innerHTML)
let currPay = Number(balance.innerHTML)

let hasLoan = false

outLoan.style.visibility = "hidden"
payLoanBtn.style.visibility = "hidden"

getLaptops();

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
            outLoan.style.visibility = "hidden"
            payLoanBtn.style.visibility = "hidden"
            outLoan.innerHTML = currLoan
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
        currLoan = Number(loanBal.innerHTML) + Number(amount)
        loanBal.innerHTML = currLoan
        payLoanBtn.style.visibility = "visible"
        outLoan.style.visibility = "visible"
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


function getLaptops() {
    var xhttp = new XMLHttpRequest();
    let laptopOptions;
    xhttp.onload = () => {
        if (xhttp.readyState == 4) {
            laptopOptions = JSON.parse(xhttp.response)
            createOptions(laptopOptions)
        }
    }
    xhttp.open('GET', 'https://noroff-komputer-store-api.herokuapp.com/computers')
    xhttp.send()
}

function createOptions(laptopOptions) {
    for (const iterator of laptopOptions) {
        let optNode = document.createElement('option')
        optNode.value = iterator.id;
        optNode.text = iterator.title;
        selMenu.appendChild(optNode)
        laptopCollection.push(iterator);
    }
    changeSpecs(0)
}

function changeSpecs(id) {
    lapSpec.textContent = ' '
    laptopCollection[id].specs.map((e) => {
        let textItem = document.createElement('li')
        textItem.textContent = e
        lapSpec.appendChild(textItem)
    })
    let lapTitle = document.getElementById('lap-title')
    let lapImg = document.getElementById('lap-img')
    let lapPrice = document.getElementById('price')
    lapPrice.textContent = laptopCollection[id].price;
    lapTitle.textContent = laptopCollection[id].title
    lapDesc.textContent = laptopCollection[id].description;
    lapImg.src = 'https://noroff-komputer-store-api.herokuapp.com/' + laptopCollection[id].image
}