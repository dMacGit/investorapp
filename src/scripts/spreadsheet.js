export function generateRow(rowData) { 
    //Format data and create row.
    //Return the String.
}

export function generateTable( rowsArray ){
    //Simply join each row from array into one large string
    //Return the string.
}

export function resetTable ()
{    
    var tableBodyData = document.getElementById("dynamic");
    //document.getElementById("dynamic")
    tableBodyData.textContent = null;
}