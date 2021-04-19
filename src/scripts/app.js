import bb, {line} from 'billboard.js';
import {duration, inflation, calulateNextYearsPayment,calculateYearsCreditPayments, calculate_monthly_payment,calculate_year_investment, calculate_yearly_div, calculate_monthly_div} from './calculate';
import {resetTable,generateRow,generateTable} from './spreadsheet';
import {download_csv,export_table_to_csv} from './csv';



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

function generateChart() {
  y2axisMaxRange = parseInt(dividendArray[dividendArray.length - 1]);
  y1axisMaxRange = parseInt(principleArray[principleArray.length - 1]) * 1.1;
  console.log(
    "----> Div Max Axis " +
      y2axisMaxRange +
      "\n ----> Principle Max Axis :" +
      y1axisMaxRange
  );
  chart = bb.generate({
    bindto: "#chart",
    data: {
      type: line(),
      columns: [principleArray, dividendArray],
      axes: {
        Principle: "y",
        Principle2: "y2",
        Dividend: "y3",
      },
    },
    grid: {
      x: {
        show: true,
      },
      y: {
        show: true,
      },
    },
    axis: {
      x: {
        label: "Year",
      },
      y: {
        label: "Dollers ($)",
        // max: eval(y1axisMaxRange),
        // min: 0,
      } /*
            y2: {
              show: true,
              label: "Principle $",
            },
            y3: {
              show: true,
              label: "Dividend $",
              
              max: y2axisMaxRange*2,
              min: 0,
            }*/,
    },
  });
}

function resetGraphArray() {
  principleArray = ["Principle"];
  dividendArray = ["Dividend"];
}

function formatForTable(amount) {
  return parseFloat(amount).toLocaleString("en-NZ", {
    maximumFractionDigits: 0,
  });
}

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
    let monthly_payment_max_cap = document.getElementById("monthlyPaymentMax")
      .value;
      let inflation_rate = document.getElementById("inflationRate").value;
      let dividend_yield = document.getElementById("dividendRate").value;
      let reinvest_dividend = document.getElementById("divReinvest").checked;
      let period = duration(start_age, end_age);
    console.log(start_age.value + "," + end_age.value);
    let first_years_total_monthly_payments = calculateYearsCreditPayments(
      monthly_payment,
      monthly_payment_max_cap,
      0.0
    );
    let second_years_total_monthly_payments =
      eval(first_years_total_monthly_payments) *
      eval(1 + monthly_payment_increase / 100.0);
    let total_Credit_Payments = 0.0;
    let current_mo_payment = monthly_payment;
    let current_investment = start_amount;
    let investmentAfterYield = 0;
    let divReturned = 0;
    let investmentAfterDiv = 0;
    var currentYearsPrinciple = 0;
    console.log("=============================== New run ===================");

    var rowsArray = [];
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
      /*
            Below is the table row structure
            <tr>
              <th scope="row" >1</th>
              <td>$10000</td><td>$200</td><td>$2400</td><td>$12400</td><td>$16800</td><td>$160</td><td>$16960</td>
            </tr>
          */
      let decemalPlaces = 0;
      var newTableRow = document.createElement("tr");
      var newRowHeader = document.createElement("th");
      newRowHeader.scope = "row";
      newRowHeader.innerText = eval(year) + 1;
      newTableRow.appendChild(newRowHeader);

      var newRowData0_Principle = document.createElement("td");
      newRowData0_Principle.innerText = formatForTable(currentYearsPrinciple);
      var newRowData1_MoCredit = document.createElement("td");
      newRowData1_MoCredit.innerText = formatForTable(current_mo_payment);
      var newRowData2_TotalCredit = document.createElement("td");
      newRowData2_TotalCredit.innerText = formatForTable(yearsPayments);
      var newRowData3_BeforeYield = document.createElement("td");
      let sumYearsPrinciple =
        parseFloat(currentYearsPrinciple) + parseFloat(yearsPayments);
      newRowData3_BeforeYield.innerText = formatForTable(sumYearsPrinciple);
      var newRowData4_Afteryield = document.createElement("td");
      newRowData4_Afteryield.innerText = formatForTable(investmentAfterYield);
      var newRowData5_DivReturned = document.createElement("td");
      newRowData5_DivReturned.innerText = formatForTable(divReturned);
      var newRowData6_InvestDiv = document.createElement("td");
      newRowData6_InvestDiv.innerText = formatForTable(investmentAfterDiv);

      newTableRow.appendChild(newRowData0_Principle);
      newTableRow.appendChild(newRowData1_MoCredit);
      newTableRow.appendChild(newRowData2_TotalCredit);
      newTableRow.appendChild(newRowData3_BeforeYield);
      newTableRow.appendChild(newRowData4_Afteryield);
      newTableRow.appendChild(newRowData5_DivReturned);
      newTableRow.appendChild(newRowData6_InvestDiv);

      document.getElementById("dynamic").appendChild(newTableRow);
      console.debug(
        "[ " + year + " ] After yield added: " + current_investment
      );
      principleArray.push(parseInt(currentYearsPrinciple));
      dividendArray.push(parseInt(divReturned));
      //console.log("Year "+year+": $"+current_mo_payment);
    }
    let message =
      "Investment period of: " +
      period +
      " Years" +
      " Initial Investment: $" +
      start_amount +
      " Monthly Payments of: $" +
      monthly_payment +
      " Payment Increase rate: " +
      monthly_payment_increase +
      "% PA" +
      "Inflation rate of: " +
      inflation_rate +
      "%\n" +
      "First Years Total Payments: $" +
      first_years_total_monthly_payments +
      "\nSecond Years Total Payments: $" +
      second_years_total_monthly_payments +
      "\nTotal Credit Payments: $" +
      total_Credit_Payments +
      "\nYour Investment is worth: $" +
      current_investment;
    //alert(message);

    if (chart === null) {
      generateChart();
    } else {
      chart.destroy();
      generateChart();
    }
  });
  
  var resetBtn = document.getElementById("reset");
  resetBtn.addEventListener("click", function () {
    document.getElementById("tablewrapper").style.visibility = "hidden";
    resetGraphArray();
    resetTable();
    document.getElementById("startAge").value = 21;
    document.getElementById("endAge").value = 65;
    document.getElementById("startAmount").value = 5000;
    document.getElementById("startPaymentAmount").value = 200;
    document.getElementById("monthlyPaymentIncreasePa").value = 0.0;
    document.getElementById("inflationRate").value = 3.0;
    // console.log(eval(start_age.value) + "," + eval(end_age.value));
    chart.destroy();
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
window.onload = init();
