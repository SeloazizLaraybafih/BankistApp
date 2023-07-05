'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Seloaziz Laraybafih',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Ajamie Mandak',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//* FUNCTIONS *//

// format //
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// DISPLAY MOVEMENTS //
const displayMovements = function (account, sorted = false) {
  containerMovements.innerHTML = '';
  const movs = sorted
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  movs.forEach(function (mov, i) {
    let type;
    mov >= 0 ? (type = 'deposit') : (type = 'withdrawal');

    // display date
    const date = new Date(account.movementsDates[i]);
    const displayDate = new Intl.DateTimeFormat(currentAccount.locale).format(
      date
    );

    const formattedMov = formatCur(mov, account.locale, account.currency);

    // Ngedisplay html ke page, PENTING
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">
      ${i + 1} ${type}
    </div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// CALC & DISPLAY BALANCE //
const calcDisplayBalance = function (account) {
  let balance = account.movements.reduce(function (acc, current) {
    return acc + current;
  }, 0);
  account.balance = balance;

  const formattedMov = formatCur(
    account.balance,
    account.locale,
    account.currency
  );

  labelBalance.textContent = `${formattedMov}`;
};

// CALCSUMMARY //

const displaySumAndInt = function (account) {
  let movement = account.movements;
  const sumIn = movement
    .filter(mov => {
      return mov > 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  const formattedSumIn = formatCur(sumIn, account.locale, account.currency);
  labelSumIn.textContent = `${formattedSumIn}`;

  const sumOut = movement
    .filter(mov => {
      return mov < 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  const sumOutNoMinus = sumOut - sumOut * 2;
  const formattedSumOut = formatCur(
    sumOutNoMinus,
    account.locale,
    account.currency
  );
  labelSumOut.textContent = `${formattedSumOut}`;

  const sumInt = movement
    .filter(mov => {
      return mov > 0;
    })
    .map((deposit, i, arr) => {
      const jumlah = (deposit * account.interestRate) / 100;
      return jumlah;
    })
    .filter((int, i, arr) => {
      return int > 1;
    })
    .reduce((acc, Int) => {
      return acc + Int;
    });
  const formattedSumInt = formatCur(sumInt, account.locale, account.currency);
  labelSumInterest.textContent = `${formattedSumInt}`;
};

// UPDATE UI //

const UpdateUI = function (account) {
  displayMovements(account);
  calcDisplayBalance(account);
  displaySumAndInt(account);
};

// CREATE USERNAME //
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// TIMER //

const startLogoutTimer = function () {
  const jamMundur = function (milisec) {
    let totalSecond = Math.floor(milisec / 1000);
    let minutes = Math.floor(totalSecond / 60);
    let sec = totalSecond % 60;
    return `${minutes}:${sec < 10 ? 0 : ''}${sec}`;
  };

  // set time to 5 minute
  let timeRemain = 1000 * 20;
  let second = 1000;

  if (timeRemain > 0) {
    // call the timer every second (bikin jam mundur)
    const timer = setInterval(function () {
      timeRemain -= second;
      console.log(timeRemain);
      labelTimer.textContent = jamMundur(timeRemain);

      if (timeRemain <= 0) {
        clearInterval(timer);
        //when 0n second, stop timer and logout user
        labelWelcome.textContent = `Log in to get started`;
        containerApp.style.opacity = 0;
      }
    }, 1000);
  }
};
// startLogoutTimer();

//* EVENT HANDLER *//

// currentAccount adalah account yang digunakan untuk login
// currentAccount scope = Global
let currentAccount;
// LOGIN //
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  let numberedPin = Number(inputLoginPin.value);
  if (currentAccount?.pin === numberedPin) {
    // Clear input field
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // display date
    const nowAPI = new Date();
    const formatDate = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      formatDate
    ).format(nowAPI);

    // Display UI and Message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }!`;
    // jalanin timer
    startLogoutTimer();
    // ngeupdate UI
    UpdateUI(currentAccount);
    // munculin main app
    containerApp.style.opacity = 100;
  } else {
    console.log('Sorry wrong username or password');
  }
});

// LOAN //
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(function (mov) {
      return mov > (amount * 10) / 100;
    })
  ) {
    console.log('waiting...');
    setTimeout(function () {
      currentAccount.movementsDates.push(new Date().toISOString());
      // push loan to account and update UI
      currentAccount.movements.push(amount);
      UpdateUI(currentAccount);
    }, 3000); // add loan date
  }
});

// TRANSFER //
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  console.log(receiverAcc);
  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc.username !== currentAccount.username
  ) {
    console.log('terimakasih sudah transfer');
    // Transfer money
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // display UI
    UpdateUI(currentAccount);
  }
});

// CLOSE ACCOUNT //
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // cari index akun
    let index = accounts.findIndex(function (acc) {
      return (
        acc.username === currentAccount.username &&
        acc.pin === currentAccount.pin
      );
    });
    console.log(index);

    // ngehapus akun
    accounts.splice(index, 1);

    // hide UI & hapus residu teks
    containerApp.style.opacity = 0;
    inputCloseUsername.value = '';
    inputClosePin.value = '';
  }
});

// SORTING //
let cektrue = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  console.log(cektrue);
  displayMovements(currentAccount, !cektrue);
  cektrue = !cektrue;
  console.log(cektrue);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// // Coding practice #1
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((accum, movArr) => accum + movArr, 0);

// console.log(bankDepositSum);

// // Coding practice #2
// const above1000Num = accounts
//   .flatMap(acc => acc.movements)
//   .filter(curr => {
//     if (curr >= 1000) {
//       return curr;
//     }
//   }).length;

// console.log(above1000Num);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
