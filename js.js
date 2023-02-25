const lines = [...document.querySelectorAll(".line")];
const comments = [...document.querySelectorAll(".comment")];
const commentsByLine = [];
const closedEvent = new Event("close")
const allCancelButtons = [...document.querySelectorAll(".button-cancel")];
const allLocalSubmitButtons = [...document.querySelectorAll(".button-local")]
document.querySelectorAll("button").forEach(button=>{
    button.addEventListener("mouseover", event=>{
        button.style.cursor = "pointer"
    })
    button.addEventListener("mouseout", event=>{
        button.style.cursor = "default"
    })
})
let local = window.localStorage
lines.forEach(element => {
    element.tabIndex = -1;
    element.parentElement.tabIndex = 1;
    let isFocused = false;
    const lineComments = [...element.children[2].querySelectorAll(".comment")];
    commentsByLine.push(lineComments)
    const lineComponents = [...element.children];
    element.addEventListener("mouseover", (event) => {
        if (isFocused)
            return;
        element.style.backgroundColor = "	#404040"
        element.style.cursor = "pointer"
        lineComponents.forEach(component => {
            component.style.backgroundColor = "	#404040"
        })
    })
    element.addEventListener("mouseout", (event) => {
        if (isFocused)
            return;
        element.style.backgroundColor = "#28282B"
        element.style.cursor = "default"
        lineComponents.forEach(component => {
            component.style.backgroundColor = "#28282B"
        })
    })
    element.addEventListener("focus", event => {
        isFocused = true
        element.style.backgroundColor = "#54524c"
        lineComponents.forEach(component => {
            component.style.backgroundColor = "	#54524c"
        })
        element.parentElement.children[1].style.display = "flex";
    })

    element.addEventListener("focusout", event => {
        isFocused = false
        element.style.backgroundColor = "#28282B"
        lineComponents.forEach(component => {
            component.style.backgroundColor = "	#28282B"
        })
    })
    element.addEventListener("close", event=>{
        element.parentElement.children[1].style.display = "none";
        
    })
})
allCancelButtons.forEach(button=>{
    button.addEventListener("click", event=>{
        lines[allCancelButtons.indexOf(button)].dispatchEvent(closedEvent);
    });
})
