function generateRow(rowData) { 
    //Format data and create row.
    //Return the String.
}

function generateTable( rowsArray ){
    //Simply join each row from array into one large string
    //Return the string.
}

function resetTable ()
{    
    var tableBodyData = document.getElementById("tbody");
    while (tableBodyData.firstChild) 
    {
        tableBodyData.removeChild(tableBodyData.firstChild);
    }
}