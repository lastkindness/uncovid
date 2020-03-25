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
            var dataСonversion = response.map(function(item, i) {
                var itemValue = [item.statistic_taken_at, item.country_name, item.cases, item.deaths, item.total_recovered, item.new_cases, item.new_deaths, item.serious_critical, item.total_cases_per_1m_population, item.active_cases, ((+item.cases/item.TotalCount)*100).toFixed(4)+"%"];
                return itemValue;
            });
            console.log(response);
            table.DataTable( {
                //data: dataСonversion(response),
                data: dataСonversion,
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

// function dataСonversion(response) {
//     var dataSet = [];
//     response.forEach((value) => {
//         dataSet.push(Object.values(value));
//     });
//     var totalCount = dataSet[0][12];
//     dataSet.forEach((value) => {
//         value.splice(0, 1);
//         value.splice(2, 1);
//         var specificGravity = (+value[2])/totalCount*100;
//         value.splice(10, 1, specificGravity.toFixed(4)+"%");
//     });

//     return dataSet;
// }