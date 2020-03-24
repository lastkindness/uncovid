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
            dataСonversion(response);
            console.log(dataСonversion(response));
            table.DataTable( {
                data: dataСonversion(response),
                columns: [
                    { title: "ID"},
                    { title: "Date-time" },
                    { title: "Country" },
                    { title: "Region"},
                    { title: "Cases" },
                    { title: "Deaths" },
                    { title: "Total recovered" },
                    { title: "New cases" },
                    { title: "New deaths" },
                    { title: "Serious critical" },
                    { title: "Total cases per 1m population" },
                    { title: "Active cases" },
                    { title: "TotalCount" },
                    { title: "lat" },
                    { title: "long" }
                ]
            });
        });
    });
};

function dataСonversion(response) {
    var dataSet = [];
    response.forEach((value, index, array) => {
        dataSet.push(Object.values(value));
    })
    return dataSet;
}