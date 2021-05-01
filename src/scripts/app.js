import * as calc from './calculate';
import * as graphing from './graphing';
import {resetTable,generateRow,generateTable} from './spreadsheet';
import {download_csv,export_table_to_csv} from './csv';
import '../styles/style.css';

let isFormVisible = true;
let chart = null;
global.principleArray = ["Principle"];
global.dividendArray = ["Dividend"];
let check = false;
let currentTheme = null;
let darkMode = false;


/*
/*  Handle toggling of site theme. Light/Dark mode
*/
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

/*
/*  Resets Graph data and backing Arrays  
*/
function resetGraphArray() {
  principleArray = ["Principle"];
  dividendArray = ["Dividend"];
  chart.destroy();
}

/*
/*  Setting up Investment properties, Graph and Table
*/

function init() {
  //Pre-select user theme from local browser storage
  currentTheme = localStorage.getItem("theme");

  if (currentTheme === null) {
    console.log("No theme saved: defaulting to Dark " + darkMode);
  } else {    
    darkMode = true;
    console.log("Saved theme found: defaulting to Dark " + darkMode);
  }

  //Initilize page based on theme
  if (darkMode) {
    document.documentElement.setAttribute("data-theme", "dark");
    check = true;
    console.log(check);
  }

  //Theme toggle button evenet listener
  var darkSlider = document.getElementById("checkbox");
  darkSlider.checked = darkMode;
  darkSlider.addEventListener("click", function (event) {
    toggleTheme(event);
  });

  /*
    Hide or Show Investment Properties Panel
  */
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

  /*
  /*  Calculate Ivestment, Display Graphed results and show Table.
  */
  var calcBtn = document.getElementById("calculate");
  calcBtn.addEventListener("click", function () {
    if (document.getElementById("tablewrapper").style.visibility == "visible") {
      //If graph & table visible remove and re-add to simulate a reset/recalculate
      resetTable();
      resetGraphArray();
    }
    //Calculate Investment
    document.getElementById("tablewrapper").style.visibility = "visible";
    calc.calculateInvestment();

    //Generate new graph or update existing
    if (chart === null) {
      chart = graphing.generateChart(dividendArray, principleArray);
    } else {
      //Easier to just destroy and re-create new Graph instead of update
      chart.destroy();
      chart = graphing.generateChart(dividendArray, principleArray);
    }
  });
  
  /*
  /*  Handle Reset button, reset Grapch/Table and Investment properties to default
  */
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
