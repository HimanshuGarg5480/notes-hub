let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modalcont = document.querySelector(".modal-cont");
let mainCont=document.querySelector(".main-cont");
let textareaCont = document.querySelector(".textarea-cont");
let allPriorityColor = document.querySelectorAll(".priority-color");
let toolBoxColors = document.querySelectorAll(".color");

let colors = ["lightpink","lightblue","lightgreen","black"];
let modalPriorityColor = colors[colors.length-1];

let addFlag=false;
let removeFlag=false;

let ticketsArr = [];


if(localStorage.getItem("jira_tickets")){
    ticketsArr = JSON.parse(localStorage.getItem("jira_tickets"));
    console.log(ticketsArr);
    ticketsArr.forEach((ticketObj)=>{
        createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.id);
    })
}




for(let i=0;i<toolBoxColors.length;i++){
    toolBoxColors[i].addEventListener("click",(e)=>{
        let currentToolBoxColor=toolBoxColors[i].classList[1];
        let filteredTickets = ticketsArr.filter((ticketObj,idx)=>{
            return currentToolBoxColor === ticketObj.ticketColor;
        });
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }

        filteredTickets.forEach((ticketObj,idx)=>{
            console.log(ticketObj.ticketId);
            createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.id);
        })
    })

    toolBoxColors[i].addEventListener("dblclick", (e) => {
        // Remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketsCont.length; i++) {
            allTicketsCont[i].remove();
        }

        ticketsArr.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.id);
        })
    })
}

allPriorityColor.forEach((colorElem,idx)=>{
    colorElem.addEventListener("click",(e)=>{
         allPriorityColor.forEach((priorityColorElem,idx)=>{
            priorityColorElem.classList.remove("border");
         });
        colorElem.classList.add("border");
        modalPriorityColor=colorElem.classList[0];

    })
})

addBtn.addEventListener("click",function (e){
        
        addFlag=!addFlag;
        if(addFlag){
            modalcont.style.display="flex";
        }
        else{
            modalcont.style.display="none";
        }
});


removeBtn.addEventListener("click",(e)=>{
    removeFlag=!removeFlag;
    console.log(removeFlag); 
})


modalcont.addEventListener("keydown",function(event){
    let key = event.key;
    if(key==="Shift"){
        
        createTicket(modalPriorityColor,textareaCont.value);
        modalcont.style.display="none";
        console.log(modalcont.style.display);
        addFlag=false;
        textareaCont.value="";
    }
})

function createTicket(ticketColor,ticketTask,ticketId){
    let id=ticketId;
    if(!ticketId){
        id = shortid();
    }
    console.log(id);
    let ticketcont=document.createElement("div");
    ticketcont.setAttribute("class","ticket-cont");
    ticketcont.innerHTML=
        `<div class="ticket-cont ">
            <div class="ticket-color ${ticketColor}"></div>
            <div class="ticket-id ">${id}</div>
            <div class="task-area ">${ticketTask}</div>
            <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
            </div>
        </div>`;
    mainCont.appendChild(ticketcont);
    if(!ticketId) {
        console.log("hello "+ticketId);
        ticketsArr.push({ticketColor, ticketTask, id})
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
    }
 
    handleRemoval(ticketcont,id) ;
    handleLock(ticketcont,id);
    handleColor(ticketcont,id);
}

function handleRemoval(ticket, id) {
    // removeFlag -> true -> remove
    ticket.addEventListener("click", (e) => {
        if (removeFlag) {
            let idx = getTicketID(id);

        // DB removal
        ticketsArr.splice(idx, 1);
        let strTicketsArr = JSON.stringify(ticketsArr);
        localStorage.setItem("jira_tickets", strTicketsArr);
        
        ticket.remove();
        }

         //UI removal
    })
}

function handleLock(ticket,id){
    let lockElem = document.querySelector(".ticket-lock");
    let ticketLock = lockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");
    ticketLock.addEventListener("click",(e)=>{
        let ticketIdx = getTicketID(id);
        console.log(ticketIdx);
        if(ticketLock.classList.contains("fa-lock")){
            ticketLock.classList.remove("fa-lock");
            ticketLock.classList.add("fa-unlock");
            ticketTaskArea.setAttribute("contenteditable","true");
        }
        else{
            ticketLock.classList.remove("fa-unlock");
            ticketLock.classList.add("fa-lock");
            ticketTaskArea.setAttribute("contenteditable","false");

        }
        console.log(ticketsArr[ticketIdx]);
        ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerHTML;
        localStorage.setItem("jira_tickets",json.stringify(ticketsArr));
    });
    
    
}

function handleColor(ticket,id){
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click",(e)=>{
        let ticketIdx = getTicketID(id);
        let currentTicketColor = ticketColor.classList[1];
    let currentTicketColorIdx = colors.findIndex((color)=>{
        return currentTicketColor === color;
    })
    currentTicketColorIdx++;
    let newTicketColorIdx = currentTicketColorIdx%colors.length;
    let newTicketColor = colors[newTicketColorIdx];
    ticketColor.classList.remove(currentTicketColor);
    ticketColor.classList.add(newTicketColor);

    ticketsArr[ticketIdx].ticketColor = newTicketColor;
    localStorage.setItem("jira_tickets",ticketsArr);
    })
    
}

function getTicketID(id){
    let ticketIdx = ticketsArr.findIndex((ticketObj)=>{
        return ticketObj.ticketId===id;
    });
    return ticketIdx;
}