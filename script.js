`use strict`;
// load the dom
document.addEventListener("DOMContentLoaded", fetchJson);

// create the necessary global variables
let jsonObj;
let myJson;
let clone;
// let countHigh;
// let countMod;
// let countLow;
let current;
let currentTrim;
// let totalNumber;
let reqCount;




// FETCH JSON FILE
async function fetchJson() {
    jsonObj = await fetch("https://kea-alt-del.dk/customersupport/");
  // store json in myJson
    myJson = await jsonObj.json();
    // console.log(myJson)
    // make a forEach to display the content of the json for each element
    myJson.forEach(elm => {
        // store the template in a variable - propably not necessary?
        let template = document.querySelector("template");
        // clone the template's content
        clone = template.content.cloneNode(true);
        // console.log(clone);
        // make the first letter of their first name appear - if they have a middle name, display the first letter of that also - and their last name.
        if(elm.middle) {
            clone.querySelector("#sup-name").textContent = elm.first.charAt(0) + ". " + elm.middle.charAt(0) + ". " + elm.last;
        }else {
            clone.querySelector("#sup-name").textContent = elm.first.charAt(0) + ". " + elm.last;
        }
        clone.querySelector("#sup-subj").textContent = elm.message;
        if(elm.time.minute < 10) {
            clone.querySelector("#sup-date").textContent = elm.time.day + "-" + elm.time.month + "-" + elm.time.year + ", " + elm.time.hour + ":0" + elm.time.minute;    
        }else {
            clone.querySelector("#sup-date").textContent = elm.time.day + "-" + elm.time.month + "-" + elm.time.year + ", " + elm.time.hour + ":" + elm.time.minute;
        }
        // create a visualization of the importance of the requests
        if(elm.importance <= 30) {
           // make the lesser third of the requests a low priority
           clone.querySelector("#sup-con").classList.add("lowimportance");
            clone.querySelector("#sup-importance").style.backgroundColor = "var(--impLow)";
        }else if(elm.importance <= 60) {
            clone.querySelector("#sup-con").classList.add("modimportance");
            // make the middle third of the requests a moderate priority
            clone.querySelector("#sup-importance").style.backgroundColor = "var(--impMod)";
        }else if(elm.importance <= 100) {
            clone.querySelector("#sup-con").classList.add("highimportance");
            // make the higher third of the requests a high priority
            clone.querySelector("#sup-importance").style.backgroundColor = "var(--impHigh)";
        }
        clone.querySelector("#sup-subj").addEventListener("click", readMessage);        
        let supDone = clone.querySelector("#sup-done");
        supDone.addEventListener("click", () => {

            let doneSiblings = supDone.parentNode.children;
            let doneSibArr = Array.from(doneSiblings);
            doneSibArr.forEach(function(elm) {
                elm.style.opacity = "0";
                setTimeout(closeReq, 400);
            })
        });
        let reqBox = clone.querySelector("#sup-con");
        function closeReq() {
            reqBox.style.marginLeft = "-105%";
            reqBox.parentNode.style.overflow = "hidden";
            setTimeout(() => {
                reqBox.remove();
            }, 1000)
        }
        
        // append the clone to the #main-con in the html
        document.querySelector("#main-con").appendChild(clone);
        
        reqCount = document.querySelector("#main-con").children;
        // show details when hover over the total number of reqs
/*         document.querySelector("#number-total").addEventListener("mouseover", numberDet);
 */    }); 

    }

// total number of requests animation
/* function numberDet() {
    document.querySelector("#number-add").style.top = "7vw";
    document.querySelector("#number-total").addEventListener("mouseout", () => {
        document.querySelector("#number-add").style.top = "4vw";
    });
} */
 // read full message
function readMessage(evt) {
    document.querySelector("#mod-close").addEventListener("click", () => {
        document.querySelector("#modal").style.display = "none"; 
    })   
    // show modal
    document.querySelector("#modal").style.display = "grid";
    // store the clicked element in a variable and get the text content of the first p tag
    current = evt.currentTarget.parentNode.parentNode.children[0].textContent;
    // trim current
    currentTrim = current.trim();
    console.log(currentTrim);
    // get the json object that matches the last name from the clicked object
    let singleView = myJson.find(function (elm) {
        return currentTrim.includes(elm.last);
    })
    console.log(singleView);
    if(singleView.middle) {
        document.querySelector("#mod-from").textContent = singleView.first + " " + singleView.middle + " " + singleView.last;    
    } else {        
        document.querySelector("#mod-from").textContent = singleView.first + " " + singleView.last;   
    }   
    document.querySelector("#mod-date").textContent = singleView.time.day + "-" + singleView.time.month + "-" + singleView.time.year + " " + singleView.time.hour + ":" + singleView.time.minute;    
    document.querySelector("#mod-subj").textContent = singleView.message;   
    document.querySelector("#mod-message").textContent = singleView.full;      
    }