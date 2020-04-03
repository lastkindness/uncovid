var table = $('#table');
var urlTable = 'https://uncovid.com/wp-json/cov/mapcases';
var schedule = document.getElementById('myChart').getContext('2d');
var urlSchedule = 'https://uncovid.com/wp-json/cov/gettotalcases';

window.onload = function() {
    updateDisplay(table, schedule, urlTable, urlSchedule);
};
function updateDisplay(table, schedule, urlTable, urlSchedule) {
    fetch(urlTable)
    .then(function(response) {
        response.json()
        .then(function(response) {
            dataTableFunction(response, table);
        });
    });
    fetch(urlSchedule)
    .then(function(response) {
        response.json()
        .then(function(response) {
            var dataDate = response.map(function(item) {
                    return item.statistic_taken_at.split(' ')[0];
                });
            var labelArr = [];
            var iter = 0;
            var oldFrom = dataDate[0];
            var oldTo = dataDate[dataDate.length-1];
            var oldSelect = [];
            var chart = new Chart(schedule, {});
            dataScheduleFunction(response, schedule, dataDate, labelArr, iter, chart);
            updateDay(response, dataDate, labelArr, chart, oldTo, oldFrom, iter);
            select2(labelArr, response, schedule, dataDate, iter, chart, oldFrom, oldTo);
        });
    });
};

function dataTableFunction(response, table) {
    var dataСonversion = response.map(function(item) {
        var itemValue = [item.statistic_taken_at, item.country_name, item.cases, item.deaths, item.total_recovered, item.new_cases, item.new_deaths, item.serious_critical, item.total_cases_per_1m_population, item.active_cases, ((+item.cases/item.TotalCount)*100).toFixed(4)+"%"];
        return itemValue;
    });
    var keys = Object.keys(response[0]);
    var keysArr = [];
    for (var i = 0; i < keys.length-3; i++) {
        keysArr[i] = {
            title: keys[i].charAt(0).toUpperCase() + keys[i].substr(1).replace(/[_]/g, ' ')
        };
        keysArr[keys.length-3] = {
            title: "% of cases in the world"
        };
    }
    keysArr.splice(0, 1);
    keysArr.splice(2, 1);
    table.DataTable({
        data: dataСonversion,
        columns: keysArr
    });
}

function dataScheduleFunction(response, schedule, dataDate, labelArr, iter, chart) {
    var result = createDatasetsArr(response, dataDate, labelArr, iter);
    chart = new Chart(schedule, {
        type: 'line',
        data: {
            labels: result[0],
            datasets: result[1]
        }
    });
    return chart;
};

function createDatasetsArr(response, dataDate, labelArr, iter) {
    console.log(iter);
    var keys = Object.keys(response[0]),
        dataArr = [],
        datasetsArr = [];
    if(iter==0) {
        for (var i = 2; i < keys.length-1; i++) {
            labelArr.push(keys[i]);
        }
    }
    for (var z = 0; z < labelArr.length; z++) {
        var kayVal = labelArr[z],
            index = keys.findIndex(key => key === kayVal),
            valueArr = [];
        for (var i = 0; i < response.length; i++) {
            var responseVal = Object.values(response[i]);
            valueArr.push(responseVal[index]);
        }
        dataArr.push(valueArr);
    }
    for (var i = 0; i < labelArr.length; i++) {
        var r = 255-(i*35),
            g = 85+(i*25),
            b = 0+(i*35);
        datasetsArr[i] = {
            label: labelArr[i],
            borderColor: 'rgb('+r+', '+g+', '+b+')',
            data: dataArr[i]
        };
    }
    iter++;
    return [dataDate, datasetsArr];
}

function updateDay(response, dataDate, labelArr, chart, oldTo, oldFrom, iter) {
    var dateFormat = "yy-mm-dd",
        dateFrom = "",
        dateTo = "",
        from = $("#from")
        .datepicker({
          dateFormat: dateFormat,
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 1
        })
        .on( "change", function() {
          to.datepicker( "option", "minDate", getDate( this ));
          dateFrom =  $(this).datepicker({ dateFormat: dateFormat }).val();
        }),
      to = $( "#to" ).datepicker({
        dateFormat: dateFormat,
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1
      })
      .on( "change", function() {
        from.datepicker("option", "maxDate", getDate( this ));
        dateTo =  $(this).datepicker({ dateFormat: dateFormat }).val();
        oldTo = dateTo;
        oldFrom = dateFrom;
        iter++;
        updateData(updateSchedule(dateFrom, dateTo, response, dataDate), select2(oldSelect, response, schedule, dataDate, iter, chart, oldFrom, oldTo), response, iter, chart);
    });
    function getDate(element) {
      var date;
      try {
        date = $.datepicker.parseDate( dateFormat, element.value );
      } catch( error ) {
        date = null;
      }
      return date;
    }
    return [oldFrom, oldTo];
};

function updateSchedule(dateFrom, dateTo, response, dataDate) {
   var start = dateFrom,
       end = dateTo,
       dateNew = [],
       selectDates = filterDate(dates=[],start,end),
       selectIndexes = [];
   for (var i = 0; i < selectDates.length; i++) {
        var index = dataDate.find(key => key === selectDates[i]);
        if(index!=undefined) {
            dateNew.push(index);
        }
   }
   return dateNew;
}

function filterDate(dates=[],start,end){
    var start = new Date(start),
        end = new Date(end),
        result = [];
    function pad(s){ return ('00' + s).slice(-2)}
    while(start.getTime() <= end.getTime()) {
      result.push( '' + start.getFullYear() +'-'+ pad(start.getMonth()+1) +'-'+ pad(start.getDate()));
      start.setDate(start.getDate()+1);
    }
    return result;
}


function select2(labelArr, response, schedule, dataDate, iter, chart, oldFrom, oldTo) {
    var select = $("#select2");
    if(iter==0) {
        for (var i = 0; i < labelArr.length; i++) {
            var option = document.createElement('option');
            option.innerHTML = labelArr[i];
            document.getElementById('select2').append(option);
        }
    }
    oldSelect = labelArr;
    select.select2({
    width: '30%',
    minimumResultsForSearch: -1,
    dropdownCssClass: "hide-option"
    }).on('change', function(e) {
        iter++;
        if($(this).val()=="All") {
            updateData(updateSchedule(oldFrom, oldTo, response, dataDate), labelArr, response, iter, chart);
            oldSelect = labelArr;
            console.log("All");
        } else {
            updateData(updateSchedule(oldFrom, oldTo, response, dataDate), [$(this).val()], response, iter, chart);
            oldSelect = [$(this).val()];
            console.log("NOT All");
        }
    });
    return oldSelect;
};

function updateData(update1, update2, response, iter, chart) {
    var resut = createDatasetsArr(response, update1, update2, iter);
    chart.data.labels = resut[0];
    chart.data.datasets = resut[1];
    chart.type = 'bar';
    console.log(chart.data.labels, chart.data.datasets, chart);
    chart.update();
}