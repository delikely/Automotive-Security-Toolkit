
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
    console.log(input_className,input_element.value);
    try{
        var Elapsed_Time_score = document.querySelector('.Elapsed_Time').querySelectorAll('input[type="radio"]:checked')[0].value; 
        var Expertise_score = document.querySelector('.Expertise').querySelectorAll('input[type="radio"]:checked')[0].value; 
        var Knowledge_of_TOE_score = document.querySelector('.Knowledge_of_TOE').querySelectorAll('input[type="radio"]:checked')[0].value; 
        var Window_of_Opportunity_score = document.querySelector('.Window_of_Opportunity').querySelectorAll('input[type="radio"]:checked')[0].value; 
        var Equipment_score = document.querySelector('.Equipment').querySelectorAll('input[type="radio"]:checked')[0].value; 

        var sum_score = parseInt(Elapsed_Time_score) + parseInt(Expertise_score) + parseInt(Knowledge_of_TOE_score) + parseInt(Window_of_Opportunity_score) + parseInt(Equipment_score);

        $(".needBaseMetrics").hide();
        var attack_feasibility = attack_potential_mapping(sum_score);
        console.log(attack_feasibility);

        document.getElementById("baseMetricScore").innerHTML = sum_score;
        document.getElementById("baseSeverity").innerHTML = "(" + attack_feasibility + ")";

        var scoreRating_className = "scoreRating";      
        if(attack_feasibility == "Basic"){
            scoreRating_className = scoreRating_className + " critical";
        }
        if(attack_feasibility == "EnhancedBasic"){
            scoreRating_className = scoreRating_className + " high";
        }
        if(attack_feasibility == "Medium"){
            scoreRating_className = scoreRating_className + " medium";
        }
        if(attack_feasibility == "High"){
            scoreRating_className = scoreRating_className + " low";
        }
        if(attack_feasibility == "Beyond High"){
            scoreRating_className = scoreRating_className + " low";
        }
        
        $(".scoreRating")[0].className = scoreRating_className;

    }catch{
        return false
    }

})

function attack_potential_mapping(score){
    var Attack_Feasibility = "";
    if(score>=0 && score<=9){
        Attack_Feasibility = "Basic";
    }
    if(score>=10 && score<=13){
        Attack_Feasibility = "Enhanced-Basic";
    }
    if(score>=14 && score<=19){
        Attack_Feasibility = "Medium";
    }
    if(score>=20 && score<=24){
        Attack_Feasibility = "High";
    }
    if(score>=25){
        Attack_Feasibility = "Beyond High";
    }
    return Attack_Feasibility;
}



