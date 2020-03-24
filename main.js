var table = document.getElementById('table');

window.onload = function() {
    updateDisplay(table);
};
function updateDisplay(table) {
    var url = 'http://uncovid.com/wp-json/cov/mapcases';
    fetch(url)
        .then(function(response) {
        response.json()
        .then(function(table) {
            console.log(table);
            table.DataTable( {
                data: url,
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
            } );
        });
    });
};