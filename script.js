const tables = document.querySelectorAll("table.notecard");
const table = tables[1];
const rows = table.querySelectorAll("tbody tr")[1].querySelectorAll("td table tbody")[0];
const tds = rows.children;
tds[tds.length - 3].querySelector("td").innerHTML += '<br><div><button id="addGrade" class="genesisButton">Add Grade</button><button id="editGrade" class="genesisButton">Edit Grade</button><button id="dropGrade" class="genesisButton">Drop Grade</button><button id="unround" class="genesisButton">Unround Grade</button></div>'

document.getElementById("addGrade").addEventListener("click", function() {addGrade();});
document.getElementById("editGrade").addEventListener("click", function() {editWrapper();});
document.getElementById("dropGrade").addEventListener("click", function() {dropWrapper();})
document.getElementById("unround").addEventListener("click", function() {calcGrade();})
const catTable = tds[tds.length-2].querySelector("td div table tbody").children;
const categories = new Map();
for(var i = 2; i < catTable.length; i++) {
    const tab = catTable[i].children;
    categories.set(tab[0].innerText, tab[1].innerText);

}
function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }

function addGrade() {
    var cat = "";
    while(!categories.has(cat)) {
        cat = window.prompt("Please type which category:")
    }
    var totalPoints = -1;
    while(totalPoints < 0 || !isNumber(totalPoints)) {
        totalPoints = parseFloat(window.prompt("Please enter the maximum points for the assignment:"))
    }
    var earnedPoints = -1;
    while(earnedPoints < 0 || !isNumber(earnedPoints)) {
            earnedPoints = parseFloat(window.prompt("Please enter the earned points for the assignment:"))
    }
    var assignmentName = window.prompt("Please enter the assignment name:")
    var newClassName = "";
    if(tds[tds.length-4].className === "listrowodd")
        newClassName = "listroweven";
    else
        newClassName = "listrowodd";
    var element = document.createElement('tr')
    if(tds[2].innerText === "No graded assignments found for this course")
        tds[2].remove();
    rows.insertBefore(element, tds[tds.length-3]);
    element.className = newClassName;
    element.style.height = "25px";
    element.innerHTML += '<td class="cellCenter" height="25px"><div>N/A</div><div>N/A</div>'
    element.innerHTML += `<td class="cellLeft">
                                             <div style="display:none;background-color: white;border:1px ridge #dcdcdc;position:absolute; width:400px;min-height:100px;overflow: hidden;"  class="boxShadow">
                                                 <table width="100%" cellpadding="2" cellspacing="2">
                                                     <tbody><tr><td class="cellRight" style="background-color: beige;"><span style="color:blue;cursor:pointer;text-decoration: underline;">Close</span></td></tr>
                                                     <tr><td class="cellCenter" style="font-weight:bold;border: 1px solid black;">`+ assignmentName +`</td></tr>
                                                     <tr>
                                                         <td style="font-size: 9pt;" align="center">
                                                             <div style="width:94%;font-size: 9pt; min-height: 100px;text-align: left;"></div>
                                                         </td>
                                                     </tr>
                                                     <tr><td align="center">
                                                         <input type="button"  class="fieldvalue" value="Close Window">
                                                     </td></tr>
                                                 </tbody></table>
                                             </div>
                                             <div style="font-size: 8pt;font-style: italic;">
                                                 ` + cat + `

                                             </div>

                                             <input type="hidden"  value="">

                                                <b>` + assignmentName +`</b>

                                         </td>`
    element.innerHTML += `<td class="cellLeft" nowrap="">

                                                  ` + earnedPoints + `

                                                      / ` + totalPoints + `

                                                      <div style="font-weight: bold;">
                                                          ` + (Number((earnedPoints/totalPoints)*100).toFixed(2)) + `%
                                                      </div>

                                              </td>`
    calcGrade();


}
function editWrapper() {
    var assName = window.prompt("Please enter the assignment name EXACT:");
    var earnedPoints = -1;
    while(earnedPoints < 0 || !isNumber(earnedPoints)) {
        earnedPoints = window.prompt("Please enter the earned points for the assignment:")
    }
    editGrade(assName, earnedPoints);
}

function dropWrapper() {
    var assName = window.prompt("Please enter the assignment name EXACT:");
    editGrade(assName, 0, 0);
}

function editGrade(name, earned, max) {
    var assName = name;
    var earnedPoints = earned;
    for(var i = 2; i < tds.length - 3; i++) {
        var name = tds[i].children[1].innerText;
        if(name.split("\n")[1] === assName) {
            var points = tds[i].children[2].innerText.trim();
            var totalPoints = max
            if(max === undefined) {
                totalPoints = parseFloat(points.substring(points.indexOf("/") + 2));
            }
            tds[i].children[2].innerHTML = `<td class="cellLeft" nowrap="">

                                                                                             ` + earnedPoints + `

                                                                                                 / ` + totalPoints + `

                                                                                                 <div style="font-weight: bold;">
                                                                                                     ` + (Number((earnedPoints/totalPoints)*100).toFixed(2)) + `%
                                                                                                 </div>

                                                                                         </td>`
            calcGrade();
            return;
        }
    }
    window.alert("Assignment Not Found - please check spelling and capitalization")

}

function calcGrade() {
    const gradeMapEarned = new Map();
    const gradeMapMax = new Map();
    for (const key of categories.keys()) {
        gradeMapMax.set(key, 0);
        gradeMapEarned.set(key, 0);
    }
    for(var i = 2; i < tds.length-3; i++) {
        var points = tds[i].children[2].innerText.trim();
        var assWeight = 1;
        if(tds[i].children[2].children.length > 1 && tds[i].children[2].children[1].className !== "icon") {
            assWeight = parseFloat(tds[i].children[2].children[0].innerText.substring(1));
        }
        var maxPoints = assWeight * parseFloat(points.substring(points.indexOf("/") + 2));
        var earnedPoints = assWeight * parseFloat(points.substring(0, points.indexOf("/") - 1));
        if(!isNumber(earnedPoints)) {
            var arr = points.split("\n")
            var score = arr[arr.length -1];
            earnedPoints = (parseFloat(score)/100) * maxPoints;
        }
        var cat = tds[i].children[1].children[1].innerText;
        gradeMapEarned.set(cat, gradeMapEarned.get(cat) + earnedPoints);
        gradeMapMax.set(cat, gradeMapMax.get(cat) + maxPoints);
    }
    var sumOfCatScores = 0;
    var sumOfCatWeights = 0;
    for(const key of categories.keys()) {
        if(parseFloat(gradeMapMax.get(key)) !== 0.0) {
            sumOfCatWeights += parseFloat(categories.get(key).replaceAll("%",""));
            var catAverage = (parseFloat(gradeMapEarned.get(key)) / parseFloat(gradeMapMax.get(key))) * 100
            sumOfCatScores +=  catAverage * parseFloat(categories.get(key).replaceAll("%","") / 100);
        }


    }
    var totalScore = (sumOfCatScores * 100) / sumOfCatWeights;
    totalScore = Number(totalScore.toFixed(2));
    var letterGrade = "";
    if(totalScore >= 96.5) letterGrade = "A+";
    else if(totalScore >=93.5) letterGrade = "A";
    else if(totalScore >= 89.5) letterGrade = "A-";
    else if(totalScore >= 86.5) letterGrade = "B+";
    else if(totalScore >=83.5) letterGrade = "B";
    else if(totalScore >=79.5) letterGrade = "B-";
    else if(totalScore >= 76.5) letterGrade = "C+";
    else if(totalScore >= 73.5) letterGrade = "C";
    else if(totalScore >=69.5) letterGrade = "C-";
    else if(totalScore >= 66.5) letterGrade = "D+";
    else if(totalScore >= 64.5) letterGrade = "D";
    else letterGrade = "E";
    var text = tables[0].children[0].children[1].children[0].children[2].innerHTML
    tables[0].children[0].children[1].children[0].children[2].innerHTML = text.substring(0, text.indexOf("<b>")) + `<b>` + totalScore + `% &nbsp;` + letterGrade + `</b> ` + text.substring(text.indexOf("</b>") + 4)
}
