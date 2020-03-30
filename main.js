var table = $('#table');
var urlTable = 'http://uncovid.com/wp-json/cov/mapcases';
var schedule = document.getElementById('myChart').getContext('2d');
var urlSchedule = 'http://uncovid.com/wp-json/cov/gettotalcases';

window.onload = function() {
    updateDisplay(table, schedule, urlTable, urlSchedule);
    updateDay();
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
            dataScheduleFunction(response, schedule);
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

function dataScheduleFunction(response, schedule) {
    var dataDate = response.map(function(item) {
        return item.statistic_taken_at.split(' ')[0];
    }),
        keys = Object.keys(response[0]);
        labelArr = [];
        dataArr = [];
        datasetsArr = [];
    for (var i = 2; i < keys.length-1; i++) {
        labelArr.push(keys[i]);
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
    var chart = new Chart(schedule, {
        type: 'line',
        data: {
            labels: dataDate,
            datasets: datasetsArr
        }
    });
};

function updateDay() {
    var dateFormat = "mm/dd/yy",
        dateFrom = "",
        dateTo = "",
      from = $("#from")
        .datepicker({
          dateFormat: "yy-mm-dd",
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 3
        })
        .on( "change", function() {
          to.datepicker( "option", "minDate", getDate( this ) );
          dateFrom =  $(this).datepicker({ dateFormat: 'dd-mm-yy' }).val();
        }),
      to = $( "#to" ).datepicker({
        dateFormat: "yy-mm-dd",
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 3
      })
      .on( "change", function() {
        from.datepicker("option", "maxDate", getDate( this ));
        dateTo =  $(this).datepicker({ dateFormat: 'dd-mm-yy' }).val();
        console.log(dateFrom + " - " + dateTo);
      });
    function getDate( element ) {
      var date;
      try {
        date = $.datepicker.parseDate( dateFormat, element.value );
      } catch( error ) {
        date = null;
      }
      return date;
    }
};


$("#select2").select2({
    width: '30%',
    minimumResultsForSearch: -1,
    dropdownCssClass: "hide-option"
}).on('change', function(e) {
    console.log($(this).val());
});