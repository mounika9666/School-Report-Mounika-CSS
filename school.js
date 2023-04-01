let url = "http://stageapi.iguru.guru:222/api/ExamManagement/GetStudentProgressReports?schoolID=282&sectionID=2682&eXamMasID=8442&students=181521"

let fetchRes = fetch(url);
    // fetchRes is the promise to resolve
    // it by using.then() method
fetchRes.then(res =>
res.json()).then(data => {

 var studentName = document.getElementById("stdTable");
 var name = data["Response"]["ProgressList"]["lstStudentInfo"][0]["Name"]
 console.log(name)
 
//studentName.rows[2].cells[3].innerHTML = name
//console.log(studentName)




let intMarks = data["Response"]["ProgressList"]["lstInternal"]//[0]["InternalExam"]
// console.log("Internal marks: " + intMarks)

let stdGrades = data["Response"]["ProgressList"]["stGrades"]
let sbjName = data["Response"]["ProgressList"]["lstStudentInfo"][0]["lstStudent"][0]["SubjectName"]
// console.log(sbjName)
let internalMarks = data["Response"]["ProgressList"]["lstStudentInfo"][0]["stInternals"]// [0]["ScoredMarks"]
// console.log(internalMarks)
let result = data["Response"]["ProgressList"]["lstStudentInfo"][0]["lstStudent"][0]["Result"]
// console.log(result)
let marksNorl =  data["Response"]["ProgressList"]["lstStudentInfo"][0]["lstStudent"]//[0]["Marks"]
// console.log("Normal Marks: " + marksNorl)

grades = []
for(m in stdGrades)
{
    //console.log(stdGrades[m]["Range"].split("-"), stdGrades[m]["Grade"]);
    g = stdGrades[m]["Range"].split("-")
    grades.push([parseInt(g[0]), parseInt(g[1]), stdGrades[m]["Grade"].trim()])
}

var internalMap = {}
    for (m in internalMarks)
    {
        //console.log(internalMarks[m]["ExamSubjectName"] + ": " + internalMarks[m]["InternalExam"] + ": " + internalMarks[m]["ScoredMarks"])
        let key = internalMarks[m]["ExamSubjectName"];
        if (key in internalMap)
        {
            internalMap[key].push([internalMarks[m]["InternalExam"], internalMarks[m]["ScoredMarks"]]);
        }
        else
        {
            internalMap[key] = [[internalMarks[m]["InternalExam"], internalMarks[m]["ScoredMarks"]]];
        }

    }

    // for(key in internalMap)
    // {
    //     console.log(key + ": " + internalMap[key]);
    // }

    var normalMap = {}
    for (m in marksNorl)
    {
        //console.log(internalMarks[m]["ExamSubjectName"] + ": " + internalMarks[m]["InternalExam"] + ": " + internalMarks[m]["ScoredMarks"])
        let key = marksNorl[m]["SubjectName"];
        if (key in normalMap)
        {
            // normalMap[key] = Math.max(normalMap[key], marksNorl[m]["Marks"]);
            // console.log(marksNorl[m]["RptName"])
            normalMap[key].push([marksNorl[m]["RptName"], marksNorl[m]["Marks"]]);
        }
        else
        {
            normalMap[key] = [[marksNorl[m]["RptName"], marksNorl[m]["Marks"]]];
        }

    }

    // for(key in normalMap)
    // {
    //     console.log(key + ": " + normalMap[key][0] + " END " + normalMap[key][1]);
    // }

    var markTable = document.getElementById("markTable");
    var idx = 0;
    for(key in internalMap)
    {
        markTable.rows[idx].cells[0].innerHTML = key;
        markTable.rows[idx].cells[1].innerHTML = Math.max(internalMap[key][0][1], internalMap[key][1][1]);
        markTable.rows[idx].cells[2].innerHTML = normalMap[key][0][1];
        markTable.rows[idx].cells[3].innerHTML = parseInt(markTable.rows[idx].cells[1].innerHTML) +
            parseInt(markTable.rows[idx].cells[2].innerHTML);

        
        markTable.rows[idx].cells[4].innerHTML = Math.max(internalMap[key][2][1], internalMap[key][3][1]);
        markTable.rows[idx].cells[5].innerHTML = normalMap[key][1][1];
        markTable.rows[idx].cells[6].innerHTML = parseInt(markTable.rows[idx].cells[4].innerHTML) +
            parseInt(markTable.rows[idx].cells[5].innerHTML);

        let finalMarks = (parseInt(markTable.rows[idx].cells[3].innerHTML) + 
        parseInt(markTable.rows[idx].cells[6].innerHTML)) / 2;
        markTable.rows[idx].cells[7].innerHTML = finalMarks;

        for(i in grades)
        {
            if(finalMarks > grades[i][0] && finalMarks <= grades[i][1])
            {
                markTable.rows[idx].cells[8].innerHTML = grades[i][2];
                break;
            }
        }
        idx++;
    }

    let TOTAL_ROWS = markTable.rows.length - 1;
    let TOTAL_COLS = markTable.rows[0].cells.length - 1;

    for(let col = 1 ; col < TOTAL_COLS; col++)
    {
        let totalMarks = 0;
        for(let row = 0; row < TOTAL_ROWS; row++)
        {
            totalMarks += parseInt(markTable.rows[row].cells[col].innerHTML); 
        }
        console.log(totalMarks);
        markTable.rows[TOTAL_ROWS].cells[col].innerHTML = totalMarks;
    }

    let finalPercentage = parseInt(markTable.rows[TOTAL_ROWS].cells[TOTAL_COLS - 1].innerHTML) / TOTAL_ROWS;

    for(i in grades)
    {
        if(finalPercentage > grades[i][0] && finalPercentage <= grades[i][1])
        {
            markTable.rows[TOTAL_ROWS].cells[TOTAL_COLS].innerHTML = grades[i][2];
            break;
        }
    }


    let resTable = document.getElementById("resTable");
    resTable.rows[0].cells[0].innerHTML += " " + result;
    resTable.rows[0].cells[1].innerHTML += " " + finalPercentage;
    resTable.rows[0].cells[2].innerHTML += " " + markTable.rows[TOTAL_ROWS].cells[TOTAL_COLS].innerHTML;
})





