var table = $('table');

window.onload = function() {
    updateDisplay(table);
};
function updateDisplay(table) {
    var url = 'http://uncovid.com/wp-json/cov/mapcases';
    fetch(url)
        .then(function(response) {
        response.json()
        .then(function(response) {
            //dataСonversion(response);
            console.log(dataСonversion(response));
            table.DataTable( {
                data: dataСonversion(response),
                columns: [
                    { title: "Date-time" },
                    { title: "Country" },
                    { title: "Cases" },
                    { title: "Deaths" },
                    { title: "Total recovered" },
                    { title: "New cases" },
                    { title: "New deaths" },
                    { title: "Serious critical" },
                    { title: "Total cases per 1m population" },
                    { title: "Active cases" },
                    { title: "% of cases in the world" }
                ]
            });
        });
    });
};

function dataСonversion(response) {
    var dataSet = [];
    response.forEach((value) => {
        dataSet.push(Object.values(value));
    });
    var totalLength = dataSet[0].length;
    var totalCount = 0;
    dataSet.forEach((value) => {
        if(value.length<totalLength) {
            value.splice(value.length-1, 1);
        } else {
            value.splice(value.length-3, 3);
        }
        value.splice(0, 1);
        value.splice(2, 1);
        totalCount = totalCount + (+value[2]);
    });
    dataSet.forEach((value) => {
        var specificGravity = (+value[2])/totalCount*100;
        value.push(specificGravity.toFixed(4)+"%");
    });


    return dataSet;
}