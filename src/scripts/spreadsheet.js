import {makeHumanReadable} from './utils'
export function generateRow(rowData) {
  //Format data and create row.
  //Return the String.
  var newTableRow = document.createElement("tr");
  var newRowHeader = document.createElement("th");
  newRowHeader.scope = "row";
  newRowHeader.innerText = eval(rowData.year) + 1;
  newTableRow.appendChild(newRowHeader);

  var newRowData0_Principle = document.createElement("td");
  newRowData0_Principle.innerText = makeHumanReadable(rowData.currentYearsPrinciple);
  var newRowData1_MoCredit = document.createElement("td");
  newRowData1_MoCredit.innerText = makeHumanReadable(rowData.current_mo_payment);
  var newRowData2_TotalCredit = document.createElement("td");
  newRowData2_TotalCredit.innerText = makeHumanReadable(rowData.yearsPayments);
  var newRowData3_BeforeYield = document.createElement("td");
  newRowData3_BeforeYield.innerText = makeHumanReadable(rowData.sumYearsPrinciple);
  var newRowData4_Afteryield = document.createElement("td");
  newRowData4_Afteryield.innerText = makeHumanReadable(rowData.investmentAfterYield);
  var newRowData5_DivReturned = document.createElement("td");
  newRowData5_DivReturned.innerText = makeHumanReadable(rowData.divReturned);
  var newRowData6_InvestDiv = document.createElement("td");
  newRowData6_InvestDiv.innerText = makeHumanReadable(rowData.investmentAfterDiv);

  newTableRow.appendChild(newRowData0_Principle);
  newTableRow.appendChild(newRowData1_MoCredit);
  newTableRow.appendChild(newRowData2_TotalCredit);
  newTableRow.appendChild(newRowData3_BeforeYield);
  newTableRow.appendChild(newRowData4_Afteryield);
  newTableRow.appendChild(newRowData5_DivReturned);
  newTableRow.appendChild(newRowData6_InvestDiv);
  return newTableRow;
}

export function generateTable(rowsArray) {
  //Simply join each row from array into one large string
  //Return the string.
}

export function resetTable() {
  var tableBodyData = document.getElementById("dynamic");
  //document.getElementById("dynamic")
  tableBodyData.textContent = null;
}
