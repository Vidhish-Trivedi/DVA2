d3.csv("./year-wise.csv", function (err, rows) {
    function unpack(rows, key) {
        return rows.map(function (row) {
            return row[key];
        });
    }

    var data1 = [
        {
            type: "parcoords",
            line: {
                showscale: true,
                reversescale: false,
                colorscale: 'Jet',
                cmin: 0,
                cmax: 3000,
                color: unpack(rows, "colorVal")
            },

            dimensions: [
                {
                    range: [2015, 2025],
                    label: "Year",
                    values: unpack(rows, "year"),
                },
                {
                    range: [700, 2000],
                    label: "Number of Incidents Reported",
                    values: unpack(rows, "incidents"),
                },
                {
                    label: "Number of health workers injured",
                    range: [100, 400],
                    values: unpack(rows, "injured"),
                },
                {
                    label: "Number of health workers arrested",
                    range: [90, 650],
                    values: unpack(rows, "arrested"),
                },
                {
                    range: [30, 330],
                    label: "Number of health workers kidnapped",
                    values: unpack(rows, "kidnapped"),
                },
                {
                    range: [90, 250],
                    label: "Number of health workers killed",
                    values: unpack(rows, "killed"),
                },
            ],
        },
    ];

    var layout = {
        title: {
            text:'Data Aggregated By Years',
            font: {
              family: 'Courier New, monospace',
              size: 24,
              weight: 800
            },
            xref: 'paper',
            x: 0.005,
            color: "#000000"
        },   
        width: window.width
      };
    
    Plotly.newPlot("myDiv1", data1, layout);

    // Find a <table> element with id="myTable":
    var table = document.getElementById("myTable1");

    for(var i = 0; i < unpack(rows, "year").length; i++) {
        var row = table.insertRow(i + 1);

        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);

        // Add some text to the new cells:
        cell1.innerHTML = unpack(rows, "year")[i];
        cell2.innerHTML = unpack(rows, "colorVal")[i];
    }
});

d3.csv("./country-wise.csv", function (err, rows) {
    function unpack(rows, key) {
        return rows.map(function (row) {
            return row[key];
        });
    }
    
    var data2 = [
        {
            type: "parcoords",
            line: {
                showscale: true,
                reversescale: false,
                colorscale: 'Jet',
                cmin: 0,
                cmax: 33000,
                color: unpack(rows, "colorVal")
            },

            dimensions: [
                {
                    range: [0, 35],
                    label: "Country Code",
                    values: unpack(rows, "CountryCode"),
                },
                {
                    range: [1, 800],
                    label: "Number of Incidents Reported",
                    values: unpack(rows, "incidents"),
                },
                {
                    label: "Number of health workers injured",
                    range: [0, 250],
                    values: unpack(rows, "injured"),
                },
                {
                    label: "Number of health workers arrested",
                    range: [0, 700],
                    values: unpack(rows, "arrested"),
                },
                {
                    range: [0, 100],
                    label: "Number of health workers kidnapped",
                    values: unpack(rows, "kidnapped"),
                },
                {
                    range: [0, 100],
                    label: "Number of health workers killed",
                    values: unpack(rows, "killed"),
                },
            ],
        },
    ];

    // var layout = {
    //     width: window.width,
    //     annotations: [
    //         {showarrow: false,
    //         text: 'Higher sepal width',
    //         x: 0, y: 1, xref: 'paper', yref: 'paper'},
    //         {showarrow: false,
    //         text: 'Lower petal width and length',
    //         x: 0.9, y: .25, xref: 'paper', yref: 'paper'
    //       }]
    //   };

    var layout = {
        title: {
            text:'Data Aggregated By Countries',
            font: {
              family: 'Courier New, monospace',
              size: 24,
              weight: 800
            },
            xref: 'paper',
            x: 0.005,
            color: "#000000"
        },   
        width: window.width
      };

    Plotly.newPlot("myDiv2", data2, layout);

    // Find a <table> element with id="myTable":
    var table = document.getElementById("myTable2");

    // Create an empty <tr> element and add it to the 1st position of the table:
    for(var i = 0; i < unpack(rows, "CountryCode").length; i++) {
        var row = table.insertRow(i + 1);

        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

        // Add some text to the new cells:
        cell1.innerHTML = unpack(rows, "Country")[i];
        cell2.innerHTML = unpack(rows, "CountryCode")[i];
        cell3.innerHTML = unpack(rows, "colorVal")[i];
    }
});

