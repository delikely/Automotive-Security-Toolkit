var Risk_Likelihood_Assessment_Matrix = [
    ["高","较高","中","较低"],
    ["较高","中","较低","低"],
    ["中","较低","较低","低"],
    ["低","低","低","低"]
];

var Risk_Level_Maritx = [
    [1,2,2,3,3],
    [2,2,3,3,4],
    [2,3,3,4,4],
    [3,3,4,4,5],
    [3,3,4,5,5]
];

$(document).on('click', '.metric label', function(event) {
    var input_element = event.currentTarget.previousElementSibling;

    // uncheck all INPUT with same classname
    var input_className = input_element.className;
    var elements = document.getElementsByClassName(input_className);
     for (var i = 0; i < elements.length; i++) {
        elements[i].checked = false;
    }
    // checked current INPUT 
    input_element.checked = true
    // console.log(input_className,input_element.value);
    
    try{
        var Accessibility_Level = parseInt(document.querySelector('.Accessibility_Level').querySelectorAll('input[type="radio"]:checked')[0].value); 
        var Exploit_Difficulty_Level = parseInt(document.querySelector('.Exploit_Difficulty_Level').querySelectorAll('input[type="radio"]:checked')[0].value); 

        var Risk_Likelihood_Assessment_Level = Risk_Likelihood_Assessment_Matrix[Accessibility_Level][Exploit_Difficulty_Level];

        console.log("漏洞可获取性等级:",Accessibility_Level);
        console.log("漏洞利用难易程度等级:",Exploit_Difficulty_Level);
        console.log("漏洞可获取性等级:",Risk_Likelihood_Assessment_Level);


        $(".needBaseMetrics1").hide();

        document.getElementById("baseMetricScore1").innerHTML = Risk_Likelihood_Assessment_Level;
        document.getElementById("baseSeverity1").innerHTML = "(可能性)"

        var scoreRating_className = "scoreRating1";      
        if(Risk_Likelihood_Assessment_Level == "高"){
            scoreRating_className = scoreRating_className + " critical";

        }
        if(Risk_Likelihood_Assessment_Level == "较高"){
            scoreRating_className = scoreRating_className + " high";

        }
        if(Risk_Likelihood_Assessment_Level == "中"){
            scoreRating_className = scoreRating_className + " medium";

        }
        if(Risk_Likelihood_Assessment_Level == "较低"){
            scoreRating_className = scoreRating_className + " low";
        }

        if(Risk_Likelihood_Assessment_Level == "低"){
            scoreRating_className = scoreRating_className + " none";
        }
        
        $(".scoreRating1")[0].className = scoreRating_className;
        selectExploitCell(Accessibility_Level,Exploit_Difficulty_Level)

    }catch{
        return false
    }

})


$(document).on('click', '.metric label', function(event) {
    var input_element = event.currentTarget.previousElementSibling;

    // uncheck all INPUT with same classname
    var input_className = input_element.className;
    var elements = document.getElementsByClassName(input_className);
     for (var i = 0; i < elements.length; i++) {
        elements[i].checked = false;
    }
    // checked current INPUT 
    input_element.checked = true
    // console.log(input_className,input_element.value);
    
    try{
        var Accessibility_Level = parseInt(document.querySelector('.Accessibility_Level').querySelectorAll('input[type="radio"]:checked')[0].value); 
        var Exploit_Difficulty_Level = parseInt(document.querySelector('.Exploit_Difficulty_Level').querySelectorAll('input[type="radio"]:checked')[0].value); 
        var Risk_Severity_Level = parseInt(document.querySelector('.Risk_Severity_Level').querySelectorAll('input[type="radio"]:checked')[0].value); 

        var Risk_Likelihood_Assessment_Level = Risk_Likelihood_Assessment_Matrix[Accessibility_Level][Exploit_Difficulty_Level];
        var Risk_Likelihood_Assessment_Level_num = 0;
        if(Risk_Likelihood_Assessment_Level=="低"){
            Risk_Likelihood_Assessment_Level_num=0;
        }
        else if(Risk_Likelihood_Assessment_Level=="较低"){
            Risk_Likelihood_Assessment_Level_num=1;
        }
        else if(Risk_Likelihood_Assessment_Level=="中"){
            Risk_Likelihood_Assessment_Level_num=2;
        }
        else if(Risk_Likelihood_Assessment_Level=="较高"){
            Risk_Likelihood_Assessment_Level_num=3;
        }
        else if(Risk_Likelihood_Assessment_Level=="高"){
            Risk_Likelihood_Assessment_Level_num=4;
        }

        var Risk_Level = Risk_Level_Maritx[Risk_Likelihood_Assessment_Level_num][Risk_Severity_Level];


        var result_level = "";
        if(Risk_Level ==5 || Risk_Level == 4){
            result_level = "信息缺陷";
        }
        else if(Risk_Level ==3){
            result_level = "信息缺陷/普通漏洞";
        }
        else if(Risk_Level ==2 || Risk_Level == 1){
            result_level = "普通漏洞";
        }

        console.log("漏洞可获取性等级:",Accessibility_Level);
        console.log("漏洞利用难易程度等级:",Exploit_Difficulty_Level);
        console.log("漏洞可获取性等级:",Risk_Likelihood_Assessment_Level);
        console.log("漏洞被利用风险严重性等级:",Risk_Severity_Level);
        console.log("漏洞风险等级:",Risk_Level);
        console.log("缺陷认定:",result_level);

        $(".needBaseMetrics1").hide();
        $(".needBaseMetrics").hide();

        document.getElementById("baseMetricScore1").innerHTML = Risk_Likelihood_Assessment_Level;

        document.getElementById("baseMetricScore").innerHTML = Risk_Level;
        document.getElementById("baseSeverity1").innerHTML = "(可能性)"
        document.getElementById("baseSeverity").innerHTML = "(风险等级)"

        var scoreRating_className = "scoreRating";      
        if(Risk_Level == 5){
            scoreRating_className = scoreRating_className + " critical";

        }
        if(Risk_Level == 4){
            scoreRating_className = scoreRating_className + " high";

        }
        if(Risk_Level == 3){
            scoreRating_className = scoreRating_className + " medium";

        }
        if(Risk_Level == 2){
            scoreRating_className = scoreRating_className + " low";
        }

        if(Risk_Level == 1){
            scoreRating_className = scoreRating_className + " none";
        }
        
        $(".scoreRating")[0].className = scoreRating_className;

        selectRiskCell(Risk_Likelihood_Assessment_Level_num,Risk_Severity_Level);

    }catch{
        return false
    }

})



// 漏洞被利用风险可能性评估矩阵
const exploitTable = document.getElementById("exploitMatrix");
const infoBox = document.getElementById("exploitInfo");
const rows = ["容易", "中", "难", "极难"];
const cols = ["容易", "中", "难", "极难"];

function updateExploitSelection(cell, rowIdx, colIdx) {
    exploitTable.querySelectorAll("td").forEach(td => td.classList.remove("selected"));
    cell.classList.add("selected");

    infoBox.textContent = `可获取性：${rows[rowIdx]}，利用难度：${cols[colIdx]}，可能性等级：${cell.textContent}`;
}

function selectExploitCell(rowIdx, colIdx) {
    const row = exploitTable.tBodies[0].rows[rowIdx];
    const cell = row.cells[colIdx + 1];
    if (cell) updateExploitSelection(cell, rowIdx, colIdx);
}

// 风险评估矩阵
const table = document.getElementById("riskTable");
const info = document.getElementById("riskInfo");
const rowLabels = ["低", "较低", "中", "较高", "高"];
const colLabels = ["低", "较低", "中", "较高", "高"];

function updateSelection(cell, rowIndex, colIndex) {
    table.querySelectorAll("td").forEach(td => td.classList.remove("selected"));
    cell.classList.add("selected");

    const rowLabel = rowLabels[rowIndex];
    const colLabel = colLabels[colIndex];
    const riskValue = cell.textContent;

    info.textContent = `可能性: ${rowLabel}，严重性: ${colLabel}，风险等级: ${riskValue}`;
}

function selectRiskCell(rowIndex, colIndex) {
    const tbody = table.tBodies[0];
    if (!tbody || rowIndex > 4 || colIndex > 4) return;

    const row = tbody.rows[rowIndex];
    const cell = row.cells[colIndex + 1]; // 第一列是表头
    if (cell) updateSelection(cell, rowIndex, colIndex);
}
