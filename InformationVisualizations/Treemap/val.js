let dataN = [];
let columnsList = [];
let firstColumnNameSelected = "";
let secondColumnNameSelected = "";
let showed = false;
let parsedData = null;
let valIsNotInt = false;
let isAnyChart = false;
let algorithm = "squarified";
let orientAlgorithm = "vertical";

FusionCharts.ready(() => {
    document.getElementById('convertButton').addEventListener('click', () => {
        convertCSV();
    })

});


function wrapper(check = 0) {
    if (check == 0) {
        let checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', 'checkbox');
        checkbox.setAttribute('class', 'checkbox');
        checkbox.setAttribute('style', 'margin-left: 16px; margin-right: 16px;');

        let description = document.createElement('label');
        description.setAttribute('for', 'checkbox');
        description.innerHTML = "Is the value of the second column not an integer?";
        //   set some styles of the description label like font and font-size
        description.setAttribute('style', 'font: Consolas', 'font-size: 19px; font-weight: normal;');
        document.getElementById('container').appendChild(description);
        document.getElementById('container').appendChild(checkbox);
        return checkbox;
    } else if (check == 1) {
        let selectBtn = document.createElement('select');
        selectBtn.setAttribute('id', 'selectBtn');
        selectBtn.setAttribute('class', 'button button1');
        selectBtn.setAttribute('style', 'margin-left: 16px; margin-right: 16px;');
        document.getElementById('container').appendChild(selectBtn);

        let option = document.createElement('option');
        option.setAttribute('value', '-select-column-name-');
        option.setAttribute('value', '-select-column-name-');
        option.innerHTML = "-select-column-name-";
        option.disabled = true;
        option.selected = true;
        selectBtn.appendChild(option);


        for (let i = 1; i < columnsList.length; i++) {
            let option = document.createElement('option');
            option.setAttribute('value', columnsList[i]);
            option.innerHTML = columnsList[i];
            selectBtn.appendChild(option);

        }
        return selectBtn;
    } else if (check == 2) {
        let checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', 'checkbox');
        checkbox.setAttribute('class', 'checkbox');
        checkbox.setAttribute('style', 'margin-left: 16px; margin-right: 16px;');

        let description = document.createElement('label');
        description.setAttribute('for', 'checkbox');
        description.innerHTML = "Use AnyChart?";
        //   set some styles of the description label like font and font-size
        description.setAttribute('style', 'font: Consolas', 'font-size: 19px; font-weight: normal;');
        document.getElementById('container').appendChild(description);
        document.getElementById('container').appendChild(checkbox);
        return checkbox;
    } else if (check == 3) {
        let selectBtn = document.createElement('select');
        selectBtn.setAttribute('id', 'selectBtn');
        selectBtn.setAttribute('class', 'button button1');
        selectBtn.setAttribute('style', 'margin-left: 16px; margin-right: 16px;');
        document.getElementById('container').appendChild(selectBtn);

        let option = document.createElement('option');
        option.setAttribute('value', '-select-method-name-');
        option.innerHTML = "-select-method-name-";
        option.disabled = true;
        option.selected = true;
        selectBtn.appendChild(option);

        let opt_list = ["Squarified", "Slice And Dice (Horizontal)", "Slice And Dice (Vertical)", "Slice And Dice (Alternate)"]
        for (let i = 0; i < opt_list.length; i++) {
            let option = document.createElement('option');
            option.setAttribute('value', opt_list[i]);
            option.innerHTML = opt_list[i];
            selectBtn.appendChild(option);
        }

        return selectBtn;
    }
};

function convertCSV() {

    document.getElementById('map').innerHTML = "";
    const fileInput = document.getElementById('csvFileInput');
    const outputElement = document.getElementById('output');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const csvData = event.target.result;
            if (firstColumnNameSelected == "" || secondColumnNameSelected == "") addColumnList(csvData);
            parsedData = parseCSV(csvData);
            console.log("Data parsed");

            if (firstColumnNameSelected != "" && secondColumnNameSelected != "") {
                if (isAnyChart) {
                    dataN = buildHierarchy(parsedData);
                    loadTree(dataN);
                }// Assign the data
                else {
                    dataN = buildHierarchyFusion(parsedData);
                    loadTreeFusion(dataN);
                }
                outputElement.textContent = JSON.stringify(dataN, null, 2);
            } else {
                outputElement.textContent = "Please select a column name.";
            }
        };

        reader.readAsText(file);
    } else {
        outputElement.textContent = "Please select a CSV file.";
    }
};

function addColumnList(csvData) {

    columnsList = csvData.split('\n')[0].split(',').map(column => column.trim());

    let clmBtnList = []


    if (showed == false) clmBtnList.push(wrapper(check = 1));
    if (showed == false) clmBtnList.push(wrapper(check = 1));
    if (showed == false) clmBtnList.push(wrapper(check = 0));
    if (showed == false) clmBtnList.push(wrapper(check = 2));
    if (showed == false) clmBtnList.push(wrapper(check = 3));
    
    showed = true;


    clmBtnList[0].addEventListener('change', () => {
        firstColumnNameSelected = clmBtnList[0].value;
        convertCSV();
    });

    clmBtnList[1].addEventListener('change', () => {
        secondColumnNameSelected = clmBtnList[1].value;
        convertCSV();
    });

    clmBtnList[2].addEventListener('change', () => {
        valIsNotInt = clmBtnList[2].checked;
        convertCSV();
    });

    clmBtnList[3].addEventListener('change', () => {
        isAnyChart = clmBtnList[3].checked;
        convertCSV();
    });

    clmBtnList[4].addEventListener('change', () => {
        let method = clmBtnList[4].value;
        if (method == "Squarified") {
            algorithm = "squarified";
        } else if (method == "Slice And Dice (Horizontal)") {
            algorithm = "sliceanddice";
            orientAlgorithm = "horizontal";
        } else if (method == "Slice And Dice (Vertical)") {
            algorithm = "sliceanddice";
            orientAlgorithm = "vertical";
        } else if (method == "Slice And Dice (Alternate)") {
            algorithm = "sliceanddice";
            orientAlgorithm = "alternate";
        }
        convertCSV();
    });
};

function parseCSV(csv) {
    const lines = csv.split('\n');
    const data = [];
    const header = lines[0].split(',').map(column => column.trim());
    const cityColumnIndex = header.indexOf(firstColumnNameSelected);
    const stateColumnIndex = header.indexOf(secondColumnNameSelected);

    if (cityColumnIndex === -1 || stateColumnIndex === -1) {
        return data;
    }

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(value => value.trim());
        const city = values[cityColumnIndex];
        const state = values[stateColumnIndex];

        if (city && state) {
            data.push({ state, city });
        }
    }
    return data;
};

function buildHierarchy(parsedData) {

    // use children instead of data for anychart and name instead of label

    const hierarchy = [{ name: "World", children: [] }];
    let tot = parsedData.length;
    parsedData.forEach(item => {
        const { state, city } = item;
        let stateNode = hierarchy[0].children.find(node => node.name === state);
        if (!stateNode) {
            if (valIsNotInt) {
                stateNode = { name: state, value: city, svalue: 0 };
            } else {
                stateNode = { name: state, value: parseInt(city), svalue: 0 };
            }
            hierarchy[0].children.push(stateNode);
        }

        if (valIsNotInt) {
            if (stateNode.children == undefined) {
                stateNode.children = [];
            }

            cityNode = stateNode.children.find(node => node.name === city);

            if (cityNode) {
                cityNode.value++;
            } else {
                stateNode.children.push({ name: city, value: 1 });
            }
        }
    });
    console.log(hierarchy);
    return hierarchy;
};
function buildHierarchyFusion(parsedData) {

    // use children instead of data for anychart and name instead of label

    const hierarchy = [{ label: "World", data: [] }];
    let tot = parsedData.length;
    parsedData.forEach(item => {
        const { state, city } = item;
        let stateNode = hierarchy[0].data.find(node => node.label === state);
        if (!stateNode) {
            stateNode = { label: state, value: 0, svalue: 0, data: [] };
            hierarchy[0].data.push(stateNode);
        }

        // let cityNode = stateNode.data.find(node => node.label === city);
        // if (!cityNode) {
        //     cityNode = { label: city, value: 0, svalue: 0 };
        //     stateNode.data.push(cityNode);
        // }
        // cityNode.value++;
        stateNode.value++;
    });

    // calculate the max and min from the hierarchy[0].data
    let max = 0;
    let min = 1000000
    hierarchy[0].data.forEach(stateNode => {
        if (stateNode.value > max) max = stateNode.value;
        if (stateNode.value < min) min = stateNode.value;
    });

    hierarchy[0].data.forEach(stateNode => {
        stateNode.svalue = ((stateNode.value - min) / (max - min)) * 1.6;
        // stateNode.data.forEach(cityNode => {
        //     cityNode.svalue = stateNode.svalue + cityNode.value / stateNode.value * 0.8;
        // });
    });

    console.log(hierarchy);
    return hierarchy;
};

function loadTreeFusion(dataPassed) {
    console.log(dataPassed);


    const chartConfig = {
        type: 'treemap',
        renderAt: 'map',
        width: '100%',
        height: '100%',
        dataFormat: 'json',
        dataSource: {
            // Chart Configuration
            "chart": {
                // make the chart background with colour 2A3950
                "plotfillalpha": "80",
                "bgColor": "2A3950",
                "labelFontColor": "FFFFFF",
                "labelFontSize": "16",
                "labelGlow": "0",
                "labelFont": "Arial",
                "showChildLabels": "1",
                "showLegend": "1",
                "plotTooltext": "<b>$label</b><br>SHCC Incidents: <b>$value</b>",
                "hoverfillcolor": "CCCCCC",
                "hoverfillalpha": "50",
                "algorithm": algorithm,
                "slicingmode": orientAlgorithm,
                "caption": "SHCC Incidents",
                "subcaption": firstColumnNameSelected + " vs " + secondColumnNameSelected,
                "subcaptionFontBold": "0",
                "subcaptionGlow": "0",
                "subcaptionFontSize": "14",
                "subcaptionFontColor": "FFFFFF",
                "captionFontColor": "FFFFFF",
                "captionFontSize": "20",
                "captionGlow": "0",
                "xAxisName": "Country",
                "yAxisName": "Incidents",
                "numberSuffix": " pts",
                "theme": "fusion",
            },
            // Chart Data
            "data": dataPassed,
            "colorrange": {
                "mapbypercent": "0",
                "gradient": "1",
                "minvalue": "0",
                "code": "41436a",
                // "startlabel": "Ideal",
                // "endlabel": "Threshold",
                "color": [
                    {
                        "code": "980463",
                        "maxvalue": "0.8",
                        // "label": "Threshold"
                    },
                    {
                        "code": "f64668",
                        "maxvalue": "1.6",
                        // "label": "Threshold"
                    },
                    {
                        "code": "ff7b53",
                        "maxvalue": "2.4",
                        // "label": "Threshold"
                    },
                ]
            }
        }
    };


    var fusioncharts = new FusionCharts(chartConfig);
    fusioncharts.render();
};

function loadTree(dataPassed) {
    var treeData = anychart.data.tree(dataPassed, "as-tree");
    var chart = anychart.treeMap(treeData);

    chart.hintDepth(1);
    chart.hintOpacity(0.7);

    chart.hovered().fill("silver", 0.2);
    chart.selected().fill("silver", 0.6);
    chart.selected().hatchFill("backward-diagonal", "silver", 2, 20);
    chart.normal().stroke("silver");
    chart.hovered().stroke("black", 2);
    chart.selected().stroke("black", 2);


    var customColorScale = anychart.scales.linearColor();
    chart.background().fill("#2A3950");

    // colour scale colours for tree map that looks good on dark background

    let scale = [
        "#41436a",
        "#980463",
        "#f64668",
        "#ff7b53",
    ]

    customColorScale.colors(scale.reverse());
    chart.colorScale(customColorScale);
    // change the font colour of the labels to off white
    chart.labels().fontColor("#f5f5f5");

    chart.colorRange().enabled(true);
    chart.colorRange().length("90%");
    chart.title().useHtml(true);
    chart.title("<span style='font-size:18; font-style:bold'>" + firstColumnNameSelected + " vs " + secondColumnNameSelected + "</span><br><i><span style='font-size:14;");
    // add a subtitle to the chart with the column names
    chart.tooltip().useHtml(true);
    chart.tooltip().format("No. of attack on healthcare incidents: {%value} <br><i></i>");
    chart.labels().useHtml(true);
    chart.labels().format("<span style='font-weight:bold'>{%name}</span><br>{%value}");
    chart.container("map");
    chart.draw();
};
