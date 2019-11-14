
function duration(startAge, endAge) {
  //  Check for undefined values, and pass in defaults
  startAge = typeof startAge !== 'undefined' ? startAge : 21;
  endAge = typeof endAge !== 'undefined' ? endAge : 65;
  //  Return the duration of the investment
  return endAge - startAge;
};

function inflation(inflationRate) {
  // Check for undefined and return inflation rate
  inflationRate = typeof inflationRate !== 'undefined' ? inflationRate : 3.00;
  return inflationRate;
};

function calulateNextYearsPayment(currentPaymentAmount, paymentMaxAmount, increasePA_Rate) {
  currentPaymentAmount = typeof currentPaymentAmount !== 'undefined' ? currentPaymentAmount : 5000;
  paymentMaxAmount = typeof paymentMaxAmount !== 'undefined' ? paymentMaxAmount : 1000;
  increasePA_Rate = typeof increasePA_Rate !== 'undefined' ? increasePA_Rate : 0.00; // This means flat, Every year is the same monthly rate 

  if (increasePA_Rate !== 0.00) {
    if (!increasePA_Rate > 0.00) {
      increasePA_Rate == 0.00;
    }
  }

  nextYearsMoPayment = currentPaymentAmount * (1 + increasePA_Rate)
  if (nextYearsMoPayment >= paymentMaxAmount) {
    return paymentMaxAmount;
  }
  else {
    return nextYearsMoPayment;
  }
};

function calculateYearsCreditPayments(paymentStartAmount = 200, paymentMaxAmount = 1000, increasePA_Rate = 0.00) {
  // This means flat, Every year is the same monthly rate 
  // Calculate the years total payments.
  if (increasePA_Rate == "undefined") {
    increasePA_Rate = 0.00;
  }
  if (paymentStartAmount == "undefined") {
    paymentStartAmount = 200.00;
  }

  if (increasePA_Rate > 0.00) {
    console.log(1 + (increasePA_Rate / 100.00));

    if (paymentStartAmount * (1 + (increasePA_Rate / 100.00)) >= paymentMaxAmount) {
      paymentStartAmount = paymentMaxAmount;
    }
    totalCredit = (paymentStartAmount * 12) * (1 + (increasePA_Rate / 100.00));
  }
  else {
    totalCredit = paymentStartAmount * 12.00;
  }


  //console.log(">>"+totalCredit);
  return totalCredit;
};

function calculate_monthly_payment(paymentStartAmount = 200, paymentMaxAmount = 1000, increasePA_Rate = 0.00) {
  if (increasePA_Rate == "0.00") {
    return paymentStartAmount;
  }
  calculated_ammount = paymentStartAmount * (1 + (increasePA_Rate / 100.00));
  console.log("[" + increasePA_Rate + "] Mo Amount: " + (1 + (increasePA_Rate / 100.00)));
  if (calculated_ammount > paymentMaxAmount) {
    calculated_ammount = paymentMaxAmount;

  }
  return calculated_ammount;
}


function calculate_year_investment(currentInvestment, currentYearPayment, investmentYield = 8.00) {
  increase_amount = (1 + (investmentYield / 100.00));

  end_amount = eval((eval(currentInvestment) + eval(currentYearPayment)) * increase_amount);
  console.log("Yeild Calc: inv [" + currentInvestment + "] + [" + currentYearPayment + "] x" + increase_amount + " = $" + end_amount);
  return end_amount;
}

function calculate_yearly_div(currentInvestment, dividendRate) {
  div_year = eval(currentInvestment) * eval(dividendRate / 100);
  console.log("Potential year div: " + div_year);
  return div_year;
}

function calculate_monthly_div(currentInvestment, dividendRate) {
  mo_div = eval(calculate_yearly_div(currentInvestment, dividendRate) / 12);
  console.log("Monthly div is: " + mo_div);
  return mo_div;
}

/*
document.getElementById("calculate").onclick = function () {
  start_age = document.getElementById("startAge").value;
  end_age = document.getElementById("endAge").value;
  start_amount = document.getElementById("startAmount").value;
  investment_yeild = document.getElementById("yeild").value;
  monthly_payment = document.getElementById("startPaymentAmount").value;
  monthly_payment_increase = document.getElementById("monthlyPaymentIncreasePa").value;
  monthly_payment_max_cap = document.getElementById("monthlyPaymentMax").value;
  inflation_rate = document.getElementById("inflationRate").value;
  dividend_yeild = document.getElementById("dividendRate").value;
  reinvest_dividend = document.getElementById("divReinvest").checked;
  period = duration(start_age, end_age);
  //console.log(start_age.value+","+end_age.value);
  first_years_total_monthly_payments = calculateYearsCreditPayments(monthly_payment, monthly_payment_max_cap, 0.00);
  second_years_total_monthly_payments = eval(first_years_total_monthly_payments) * eval(1 + monthly_payment_increase / 100.00);
  total_Credit_Payments = 0.00;
  current_mo_payment = monthly_payment;
  current_investment = start_amount;
  console.log("=============================== New run ===================");
  for (year = 0; year < period; year++) {
    if (year == 0) {
      console.log("[ " + year + " ] Before mo payment calc: " + current_mo_payment + "{ " + monthly_payment_increase + " }");
      current_mo_payment = calculate_monthly_payment(current_mo_payment, monthly_payment_max_cap, undefined);
      console.log("After mo payment calc: " + current_mo_payment);
    }
    else {
      console.log("[ " + year + " ] Before mo payment calc: " + current_mo_payment + "{ " + monthly_payment_increase + " }");

      current_mo_payment = calculate_monthly_payment(current_mo_payment, monthly_payment_max_cap, monthly_payment_increase);

      console.log("After mo payment calc: " + current_mo_payment);
    }
    yearsPayments = calculateYearsCreditPayments(current_mo_payment, monthly_payment_max_cap, undefined)
    total_Credit_Payments += yearsPayments;
    console.log("[ " + year + " ] Before Inv Yeild added: " + current_investment + " year in payments credit: " + yearsPayments);
    current_investment = calculate_year_investment(current_investment, yearsPayments, investment_yeild);
    if (reinvest_dividend) {
      current_investment = eval(current_investment) + eval(calculate_yearly_div(current_investment, dividend_yeild));
    }
    console.log("[ " + year + " ] After Yeild added: " + current_investment);
    //console.log("Year "+year+": $"+current_mo_payment);
  }
  document.getElementById("reset").onclick = function () {
    document.getElementById("startAge").value = 21;
    document.getElementById("endAge").value = 65;
    document.getElementById("startAmount").value = 5000;
    document.getElementById("startPaymentAmount").value = 200;
    document.getElementById("monthlyPaymentIncreasePa").value = 0.00;
    document.getElementById("inflationRate").value = 3.00;
    console.log(start_age.value + "," + end_age.value);
  };
  message = "Investment period of: " + period + " Years" +
    " Initial Investment: $" + start_amount +
    " Monthly Payments of: $" + monthly_payment +
    " Payment Increase rate: " + monthly_payment_increase + "% PA" +
    "Inflation rate of: " + inflation_rate + "%\n" +
    "First Years Total Payments: $" + first_years_total_monthly_payments +
    "\nSecond Years Total Payments: $" + second_years_total_monthly_payments +
    "\nTotal Credit Payments: $" + total_Credit_Payments +
    "\nYour Investment is worth: $" + current_investment;
  alert(message);
};*/

