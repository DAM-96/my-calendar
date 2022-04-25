let scheduledTasks = localStorage.getItem("schedule");
let curTime = moment();
let textAreaID = "-tasks";
let saveButtonID = "-save-button";
let scheduleRowDisplay = "d-flex p-2";
const timeRange = [
    "7AM",
    "8AM",
    "9AM",
    "10AM",
    "11AM",
    "12PM",
    "1PM",
    "2PM",
    "3PM",
    "4PM",
    "5PM",
    "6PM",
    "7PM",
    "8PM",
    "9PM",
];

function runCalendar() {
    console.log("Starting app")
    renderSchedule();
    updateTime();
}

function renderSchedule() {
    for(let i = 0; i < timeRange.length; i++) {
        $(".container").append(`
        <div class="${scheduleRowDisplay}" id="${timeRange[i]}-row">
            <div class="hour-text-container p-2 flex-sm-fill bd-highlight">
                <span id="${timeRange[i]}-hour-text">${timeRange[i]}</span>
            </div>
            <textarea name="${timeRange[i]}-text-area" class="p-2 flex-lg-fill bd-highlight" id="${timeRange[i]}${textAreaID}" cols="30" rows="3"></textarea>
            <div class="save-button-container p-2 flex-sm-fill bd-highlight">
                <button id="${timeRange[i]}${saveButtonID}" class="saveBtn"></button>
            </div>
        </div>
      `);
    }

    document.querySelectorAll(".saveBtn").forEach( button => {
        button.addEventListener("click", saveTask);
    })
    renderTasks();
}

function updateTime() {
    getCurTime();
    colorTimeboxes();
}

function renderTasks(){
    let tempTasks;
    if (scheduledTasks != null) {
        tempTasks = JSON.parse(scheduledTasks);
    } else {
        tempTasks = [];
    }

    //Assing the value of each hour's placeholder with the stored task value for said hour.
    for(let i = 0; i < tempTasks.length; i++) {
        $(`#${tempTasks[i].hour}${textAreaID}`).val(tempTasks[i].task);
    }
    colorTimeboxes();
}

function getCurTime(){
    curTime = moment();
    $("#currentDay").text(curTime.format("dddd, MMMM Do"));
}

function colorTimeboxes() {
    getCurTime();
    for(let i = 0; i < timeRange.length; i++) {
        let curHour = moment(curTime.format("hA"), "hA");
        let targetHour = moment(timeRange[i], "hA");

        // Color if the hour has passed
        if( targetHour.isBefore(curHour)){
            $(`#${timeRange[i]}${textAreaID}`).addClass("past");
            $(`#${timeRange[i]}${textAreaID}`).prop("disabled", "true");
            $(`#${timeRange[i]}${saveButtonID}`).prop("disabled", "true");
        } else if (targetHour.isSame(curHour)){
            $(`#${timeRange[i]}${textAreaID}`).addClass("present");
            $(`#${timeRange[i]}${textAreaID}`).removeProp("disabled");
            $(`#${timeRange[i]}${saveButtonID}`).removeProp("disabled");
        } else if (targetHour.isAfter(curHour)){
            $(`#${timeRange[i]}${textAreaID}`).addClass("future");
            $(`#${timeRange[i]}${textAreaID}`).removeProp("disabled");
            $(`#${timeRange[i]}${saveButtonID}`).removeProp("disabled");
        }
    }   
}

function saveTask(event) {
    let idAr = event.target.id.split("-");
    let hour = idAr[0];
    let tempTasks;
    if (scheduledTasks != null) {
        tempTasks = JSON.parse(scheduledTasks);
    } else {
        tempTasks = [];
    }
    let linkedButton = $(`#${hour}${textAreaID}`);
    let task = {
        task: "",
        hour: hour
    }
    if(linkedButton.val() != null && linkedButton.val() != "") {
        task.task = linkedButton.val();
        for(let i = 0; i < tempTasks.length; i++) {
            if(tempTasks[i].hour == task.hour) {
                tempTasks.splice(i, 1);
            }
        }
        tempTasks.push(task);
        localStorage.clear();
        localStorage.setItem("schedule", JSON.stringify(tempTasks));
    } else {
        console.log("Unable to log an empty task");
    }
}

runCalendar()