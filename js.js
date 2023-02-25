const code = document.querySelector(".code-content")
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

function MakeNewComment(text, liked, date){
    let comment = document.createElement("div");
    comment.classList.add("comment");
    let commentHeader = document.createElement("div");
    commentHeader.classList.add("comment-header");
    const commentDate = document.createElement("div");
    commentDate.classList.add("date");
    let dateText = document.createTextNode(date.toLocaleString());
    commentDate.appendChild(dateText);
    const commentLiked = document.createElement("a");
    const commentPicture = document.createElement("img")
    commentPicture.src = liked ? "assets/likeon.png" : "assets/likeoff.png";
    commentLiked.classList.add("like-button");
    commentLiked.appendChild(commentPicture);
    commentHeader.appendChild(commentDate);
    commentHeader.appendChild(commentLiked);
    comment.appendChild(commentHeader);
    const commentContent = document.createElement("div");
    const commentText = document.createTextNode(text);
    commentContent.appendChild(commentText)
    commentContent.classList.add("comment-content");
    const deleteButton = document.createElement("button")
    deleteButton.innerHTML = "Delete comment"
    deleteButton.classList.add("button-delete");
    commentContent.appendChild(deleteButton);
    comment.appendChild(commentContent);
    code.appendChild(comment);    

}

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
    element.addEventListener("reload", event=>{
        const reloadComments = element.children[2];

    })
})
let local = window.localStorage;
if (local.getItem("comments") === null)
    local.setItem("comments", JSON.stringify(commentsByLine))
let localComments = JSON.parse(local.getItem("comments"));
allCancelButtons.forEach(button=>{
    button.addEventListener("click", event=>{
        lines[allCancelButtons.indexOf(button)].dispatchEvent(closedEvent);
    });
})
allLocalSubmitButtons.forEach(button=>{
    button.addEventListener("click", event=>{
        button.parentElement.parentElement.children[2].style.display = "none"
        const inputValue = button.parentElement.parentElement.children[0].value.trim()
        if (inputValue.length>0){
            const newComment = {
                date : new Date(),
                content : inputValue,
                liked: false
            };
            console.log(newComment);
            localComments[allLocalSubmitButtons.indexOf(button)].push(newComment);
            local.setItem("comments", localComments)
        }
        else{
            button.parentElement.parentElement.children[2].style.display = "flex"
        }
    })
})
