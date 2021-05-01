import * as calc from './calculate';
import * as graphing from './graphing';
import {makeHumanReadable} from './utils';
import {resetTable,generateRow,generateTable} from './spreadsheet';
import {download_csv,export_table_to_csv} from './csv';
import '../styles/style.css';



let isFormVisible = true;
let chart = null;
let principleArray = ["Principle"];
let dividendArray = ["Dividend"];
let y2axisMaxRange = 0;
let y1axisMaxRange = 0;
let check = false;
let currentTheme = null;
let darkMode = false;

function toggleTheme(e){
  var checked = e.target.checked;
  console.log("User pressed toggle");
  console.log(e.target.checked);

  if (checked) {
    check = true;
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    console.log("Setting theme to Dark");
  } else {
    check = false;
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("theme");
    console.log("Setting theme to Light");
  }
}



function resetGraphArray() {
  principleArray = ["Principle"];
  dividendArray = ["Dividend"];
  chart.destroy();
}

/*
/*  Setting up 
*/

function init() {
  currentTheme = localStorage.getItem("theme");
  //const [darkMode, toggleDarkMode] = useState(false);
  //const [forceRender, setForceRender] = useState(false);
  


  if (currentTheme === null) {
    console.log("No theme saved: defaulting to Dark " + darkMode);
  } else {
    console.log(currentTheme);
    darkMode = true;
    //toggleDarkMode(true);
    console.log("Saved theme found: defaulting to Dark " + darkMode);
  }

  if (darkMode) {
    document.documentElement.setAttribute("data-theme", "dark");
    check = true;
    console.log(check);
  }

  var darkSlider = document.getElementById("checkbox");
  darkSlider.checked = darkMode;
  darkSlider.addEventListener("click", function (event) {
    toggleTheme(event);
  });

  var hideBtn = document.getElementById("hideMain");

  /*
    Hide or Show Investment Properties Panel
  */
  hideBtn.addEventListener("click", function () {
    if (!isFormVisible) {
      document.getElementById("form-wrapper").style.display = "flex";
      isFormVisible = true;
      document.getElementById("hideMain").value = "Hide";
    } else {
      document.getElementById("form-wrapper").style.display = "none";
      document.getElementById("hideMain").value = "Show";
      isFormVisible = false;
    }
  });

  /*
  /*  Calculate Ivestment, Display Graphed results and show Table.
  */
  var calcBtn = document.getElementById("calculate");
  calcBtn.addEventListener("click", function () {
    if (document.getElementById("tablewrapper").style.visibility == "visible") {
      //Just remove and re-add.
      resetTable();
      resetGraphArray();
    }
    document.getElementById("tablewrapper").style.visibility = "visible";
    let start_age = document.getElementById("startAge").value;
    let end_age = document.getElementById("endAge").value;
    let start_amount = document.getElementById("startAmount").value;
    let investment_yield = document.getElementById("yield").value;
    let monthly_payment = document.getElementById("startPaymentAmount").value;
    let monthly_payment_increase = document.getElementById(
      "monthlyPaymentIncreasePa"
    ).value;
    console.log("monthly_payment_increase: ", +monthly_payment_increase);
    console.log(
      "monthlyPaymentMax: ",
      +document.getElementById("monthlyPaymentMax")
    );
    let monthly_payment_max_cap = document.getElementById("monthlyPaymentMax").value;
    let inflation_rate = document.getElementById("inflationRate").value;
    let dividend_yield = document.getElementById("dividendRate").value;
    let reinvest_dividend = document.getElementById("divReinvest").checked;
    let period = calc.duration(start_age, end_age);
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
        current_mo_payment = calc.calculate_monthly_payment(
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

        current_mo_payment = calc.calculate_monthly_payment(
          current_mo_payment,
          monthly_payment_max_cap,
          monthly_payment_increase
        );

        console.debug("After mo payment calc: " + current_mo_payment);
      }
      var yearsPayments = calc.calculateYearsCreditPayments(
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
      current_investment = calc.calculate_year_investment(
        current_investment,
        yearsPayments,
        investment_yield
      );
      investmentAfterYield = current_investment;
      investmentAfterDiv = investmentAfterYield;
      divReturned = eval(
        calc.calculate_yearly_div(current_investment, dividend_yield)
      );
      if (reinvest_dividend) {
        current_investment = eval(current_investment) + divReturned;
        investmentAfterDiv = current_investment;
      }
      
      let newInvestmentPeriod = {
        currentYearsPrinciple: currentYearsPrinciple,
        current_mo_payment: current_mo_payment,
        yearsPayments: yearsPayments,
        sumYearsPrinciple: parseFloat(currentYearsPrinciple) + parseFloat(yearsPayments),
        investmentAfterYield: investmentAfterYield,
        divReturned: divReturned,
        investmentAfterDiv: investmentAfterDiv,
        year: year
      };

      generateRow(newInvestmentPeriod);
      document.getElementById("dynamic").appendChild(generateRow(newInvestmentPeriod));
      
      console.debug(
        "[ " + year + " ] After yield added: " + current_investment
      );
      principleArray.push(parseInt(currentYearsPrinciple));
      dividendArray.push(parseInt(divReturned));
    }
    if (chart === null) {
      chart = graphing.generateChart(dividendArray, principleArray);
    } else {
      chart.destroy();
      chart = graphing.generateChart(dividendArray, principleArray);
    }
  });
  
  var resetBtn = document.getElementById("reset");
  resetBtn.addEventListener("click", function () {
    document.getElementById("tablewrapper").style.visibility = "hidden";
    resetGraphArray();
    resetTable();
    document.getElementById("divReinvest").checked = false;
    document.getElementById("startAge").value = 21;
    document.getElementById("endAge").value = 65;
    document.getElementById("startAmount").value = 5000;
    document.getElementById("startPaymentAmount").value = 200;
    document.getElementById("monthlyPaymentIncreasePa").value = 0.0;
    document.getElementById("inflationRate").value = 3.0;
  });
  var csvBtn = document.getElementById("csvfile");
  csvBtn.addEventListener("click", function () {
    if (document.getElementById("tablewrapper").style.visibility == "hidden") {
      // Do nothing (Make sure button is already greyed out!)
      //alert("Test");
    } else {
      //Download the table to csv format.
      var html = document.querySelector("table").outerHTML;
      console.log("CSV Button pressed!");
      export_table_to_csv(html, "table.csv");
    }
  });
}

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

window.onload = init();
