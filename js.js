const code = document.querySelector(".code-content")
const lines = [...document.querySelectorAll(".line")];
const comments = [...document.querySelectorAll(".comment")];
const commentsByLine = [];
let localComments = [];
const closedEvent = new Event("close")
const reloadEvent = new Event("reload")
const allCancelButtons = [...document.querySelectorAll(".button-cancel")];
const allLocalSubmitButtons = [...document.querySelectorAll(".button-local")]
let allDeleteButtons = document.querySelectorAll(".button-delete")
document.querySelectorAll("button").forEach(button => {
    button.addEventListener("mouseover", event => {
        button.style.cursor = "pointer"
    })
    button.addEventListener("mouseout", event => {
        button.style.cursor = "default"
    })
})

function MakeNewComment(text, liked, date) {
    date = new Date(date)
    let comment = document.createElement("div");
    comment.classList.add("comment");
    let commentHeader = document.createElement("div");
    commentHeader.classList.add("comment-header");
    const commentDate = document.createElement("div");
    commentDate.classList.add("date");
    console.log(date)
    let dateText = document.createTextNode(date.toLocaleDateString() + " " + date.toLocaleTimeString());
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
    return comment;

}

let local = window.localStorage;
if (local.getItem("comments") === null)
    local.setItem("comments", JSON.stringify(localComments))
localComments = JSON.parse(local.getItem("comments"));
allCancelButtons.forEach(button => {
    button.addEventListener("click", event => {
        lines[allCancelButtons.indexOf(button)].dispatchEvent(closedEvent);
    });
})
lines.forEach(element => {
    element.tabIndex = -1;
    const index = lines.indexOf(element);
    element.parentElement.tabIndex = 1;
    let isFocused = false;
    const lineComments = [...element.children[2].querySelectorAll(".comment")];
    commentsByLine.push(lineComments)
    const lineComponents = [...element.children];
    const reloadComments = element.children[2];
    localComments.forEach(comment => {
        if (comment.line === index) {
            let addComment = MakeNewComment(comment.content, comment.liked, comment.date);
            reloadComments.appendChild(addComment);
        }
    })
    allDeleteButtons = document.querySelectorAll(".button-delete")
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
    element.addEventListener("close", event => {
        element.parentElement.children[1].style.display = "none";

    })
})
allLocalSubmitButtons.forEach(button => {
    button.addEventListener("click", event => {
        button.parentElement.parentElement.children[2].style.display = "none"
        const inputValue = button.parentElement.parentElement.children[0].value.trim()
        if (inputValue.length > 0) {
            const newComment = {
                line: allLocalSubmitButtons.indexOf(button),
                date: new Date(),
                content: inputValue,
                liked: false
            };
            console.log(newComment);
            localComments.push(newComment);
            localComments.sort((a, b) => {
                if (a.line > b.line)
                    return 1
                else if (a.line === b.line)
                    return 0;
                else
                    return -1;
            });
            local.setItem("comments", JSON.stringify(localComments));
            console.log()
            location.reload()
        }
        else {
            button.parentElement.parentElement.children[2].style.display = "flex"
        }
    })
})

