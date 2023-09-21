import { resetTable, generateRow, generateTable } from "./spreadsheet";

export function duration(startAge, endAge) {
  //  Check for undefined values, and pass in defaults
  startAge = typeof startAge !== "undefined" ? startAge : 21;
  endAge = typeof endAge !== "undefined" ? endAge : 65;
  //  Return the duration of the investment
  return endAge - startAge;
}

export function inflation(inflationRate) {
  // Check for undefined and return inflation rate
  inflationRate = typeof inflationRate !== "undefined" ? inflationRate : 3.0;
  return inflationRate;
}

export function calulateNextYearsPayment(
  currentPaymentAmount,
  paymentMaxAmount,
  increasePA_Rate
) {
  currentPaymentAmount =
    typeof currentPaymentAmount !== "undefined" ? currentPaymentAmount : 5000;
  paymentMaxAmount =
    typeof paymentMaxAmount !== "undefined" ? paymentMaxAmount : 1000;
  increasePA_Rate =
    typeof increasePA_Rate !== "undefined" ? increasePA_Rate : 0.0; // This means flat, Every year is the same monthly rate

  if (increasePA_Rate !== 0.0) {
    if (!increasePA_Rate > 0.0) {
      increasePA_Rate == 0.0;
    }
  }

  let nextYearsMoPayment = currentPaymentAmount * (1 + increasePA_Rate);
  if (nextYearsMoPayment >= paymentMaxAmount) {
    return paymentMaxAmount;
  } else {
    return nextYearsMoPayment;
  }
}

export function calculateYearsCreditPayments(
  paymentStartAmount = 200,
  paymentMaxAmount = 1000,
  increasePA_Rate = 0.0
) {
  // This means flat, Every year is the same monthly rate
  // Calculate the years total payments.
  let totalCredit;
  if (increasePA_Rate == "undefined") {
    increasePA_Rate = 0.0;
  }
  if (paymentStartAmount == "undefined") {
    paymentStartAmount = 200.0;
  }

  if (increasePA_Rate > 0.0) {
    console.log(1 + increasePA_Rate / 100.0);

    if (
      paymentStartAmount * (1 + increasePA_Rate / 100.0) >=
      paymentMaxAmount
    ) {
      paymentStartAmount = paymentMaxAmount;
    }
    totalCredit = paymentStartAmount * 12 * (1 + increasePA_Rate / 100.0);
  } else {
    totalCredit = paymentStartAmount * 12.0;
  }

  //console.log(">>"+totalCredit);
  return totalCredit;
}

export function calculate_monthly_payment(
  paymentStartAmount = 200,
  paymentMaxAmount = 1000,
  increasePA_Rate = 0.0
) {
  if (increasePA_Rate == "0.00") {
    return paymentStartAmount;
  }
  let calculated_ammount =
    paymentStartAmount * (1 + increasePA_Rate / paymentStartAmount);
  console.log(
    "[" +
      increasePA_Rate +
      "] Mo Amount: " +
      (1 + increasePA_Rate / paymentStartAmount)
  );
  if (calculated_ammount > paymentMaxAmount) {
    calculated_ammount = paymentMaxAmount;
  }
  return calculated_ammount;
}

export function calculate_year_investment(
  currentInvestment,
  currentYearPayment,
  investmentYield = 8.0
) {
  let increase_amount = 1 + investmentYield / 100.0;

  let end_amount = eval(
    (eval(currentInvestment) + eval(currentYearPayment)) * increase_amount
  );
  console.log(
    "Yeild Calc: inv [" +
      currentInvestment +
      "] + [" +
      currentYearPayment +
      "] x" +
      increase_amount +
      " = $" +
      end_amount
  );
  return end_amount;
}

export function calculate_yearly_div(currentInvestment, dividendRate) {
  let div_year = eval(currentInvestment) * eval(dividendRate / 100);
  console.log("Potential year div: " + div_year);
  return div_year;
}

export function calculate_monthly_div(currentInvestment, dividendRate) {
  let mo_div = eval(calculate_yearly_div(currentInvestment, dividendRate) / 12);
  console.log("Monthly div is: " + mo_div);
  return mo_div;
}

export function calculateInvestment() {
  let start_age = document.getElementById("startAge").value;
  let end_age = document.getElementById("endAge").value;
  let start_amount = document.getElementById("startAmount").value;
  let investment_yield = document.getElementById("yield").value;
  let monthly_payment = document.getElementById("startPaymentAmount").value;
  let monthly_payment_increase = document.getElementById(
    "monthlyPaymentIncreasePa"
  ).value;
  console.log("monthly_payment_increase: ", monthly_payment_increase);
  console.log(
    "monthlyPaymentMax: ",
    document.getElementById("monthlyPaymentMax")
  );
  let monthly_payment_max_cap = document.getElementById("monthlyPaymentMax")
    .value;
  let inflation_rate = document.getElementById("inflationRate").value;
  let dividend_yield = document.getElementById("dividendRate").value;
  let reinvest_dividend = document.getElementById("divReinvest").checked;
  let period = duration(start_age, end_age);
  console.log(start_age.value + "," + end_age.value);
  let total_Credit_Payments = 0.0;
  let current_mo_payment = monthly_payment;
  let current_investment = start_amount;
  let investmentAfterYield = 0;
  let divReturned = 0;
  let investmentAfterDiv = 0;
  var currentYearsPrinciple = 0;
  console.log("=============================== New run ===================");

  for (let year = 0; year < period; year++) {
    currentYearsPrinciple = current_investment;
    if (year == 0) {
      console.debug(
        "[ " +
          year +
          " ] Before mo payment calc: " +
          current_mo_payment +
          "{ " +
          monthly_payment_increase +
          " }"
      );
      current_mo_payment = calculate_monthly_payment(
        current_mo_payment,
        monthly_payment_max_cap,
        undefined
      );
      console.debug("After mo payment calc: " + current_mo_payment);
    } else {
      console.debug(
        "[ " +
          year +
          " ] Before mo payment calc: " +
          current_mo_payment +
          "{ " +
          monthly_payment_increase +
          " }"
      );

      current_mo_payment = calculate_monthly_payment(
        current_mo_payment,
        monthly_payment_max_cap,
        monthly_payment_increase
      );

      console.debug("After mo payment calc: " + current_mo_payment);
    }
    var yearsPayments = calculateYearsCreditPayments(
      current_mo_payment,
      monthly_payment_max_cap,
      undefined
    );
    total_Credit_Payments += yearsPayments;

    console.debug(
      "[ " +
        year +
        " ] Before Inv yield added: " +
        current_investment +
        " year in payments credit: " +
        yearsPayments
    );
    current_investment = calculate_year_investment(
      current_investment,
      yearsPayments,
      investment_yield
    );
    investmentAfterYield = current_investment;
    investmentAfterDiv = investmentAfterYield;
    divReturned = eval(
      calculate_yearly_div(current_investment, dividend_yield)
    );
    if (reinvest_dividend) {
      current_investment = eval(current_investment) + divReturned;
      investmentAfterDiv = current_investment;
    }

    let newInvestmentPeriod = {
      currentYearsPrinciple: currentYearsPrinciple,
      current_mo_payment: current_mo_payment,
      yearsPayments: yearsPayments,
      sumYearsPrinciple:
        parseFloat(currentYearsPrinciple) + parseFloat(yearsPayments),
      investmentAfterYield: investmentAfterYield,
      divReturned: divReturned,
      investmentAfterDiv: investmentAfterDiv,
      year: year,
    };
    investmentArray.push(newInvestmentPeriod);
    generateRow(newInvestmentPeriod);
    document
      .getElementById("dynamic")
      .appendChild(generateRow(newInvestmentPeriod));

    console.debug("[ " + year + " ] After yield added: " + current_investment);
    principleArray.push(parseInt(currentYearsPrinciple));
    dividendArray.push(parseInt(divReturned));
  }
}
