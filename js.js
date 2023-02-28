let allComments = []
const allCommentsElements = []
function StartUp() {
    const code = document.querySelector(".code-content")
    const lines = [...document.querySelectorAll(".line")];
    const commentsByLine = [];
    let localComments = [];
    const closedEvent = new Event("close")
    const allCancelButtons = [...document.querySelectorAll(".button-cancel")];
    const allLocalSubmitButtons = [...document.querySelectorAll(".button-local")]
    const allServerSubmitButtons = [...document.querySelectorAll(".button-server")];
    let allDeleteButtons = document.querySelectorAll(".button-delete")
    lines.forEach(element => {
        element.tabIndex = -1;
        const index = lines.indexOf(element);
        element.parentElement.tabIndex = 1;
        let isFocused = false;
        const lineComments = [...element.children[2].querySelectorAll(".comment")];
        commentsByLine.push(lineComments)
        const lineComponents = [...element.children];
        allDeleteButtons = [...document.querySelectorAll(".button-delete")]
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
            element.dispatchEvent(closedEvent);
            lines.forEach(turnOffLine=>{
                turnOffLine.parentElement.children[1].style.display = "none"
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
    /*allLocalSubmitButtons.forEach(button => {
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
                button.parentElement.parentElement.children[2].style.display = "flex";
            }
        })
    })*/
    allDeleteButtons.forEach(button => {
        button.addEventListener("click", async e=>{
            const index = allCommentsElements.indexOf(button.parentElement.parentElement)
            allCommentsElements.splice(index, 1);
            const deleteResponse = await DeleteComment(allComments[index].id);
            if (deleteResponse===-1){
                console.error("Error in  deleting comment");
                return
            }
            allComments.splice(index, 1);
            button.parentElement.parentElement.remove();
        })
    })
    allServerSubmitButtons.forEach(button=>{
        button.addEventListener("click", async e =>{
            console.log()
            const inputValue = button.parentElement.parentElement.children[0].value.trim();
            if (inputValue.length===0){     
                console.error("You cannot send an empty message");
                button.parentElement.parentElement.children[2].style.display = "flex";
                return
            }
            const postResponse = await PostComment(inputValue, allServerSubmitButtons.indexOf(button)+1);
            if (postResponse===-1){
                console.error("Error on comment post");
                return
            }
            const responseComment = postResponse.comment;
            const comment = MakeNewComment(inputValue, false, new Date());
            allCommentsElements.push(comment);
            allComments.push(responseComment);
            console.log(comment);
            comment.children[0].children[1].addEventListener("click", async e=>{
                const index = allComments.indexOf(responseComment);
                if (allComments[index].isLiked) {
                    const updateResponse = await UpdateLikedComment(allComments[index].id, false);
                    if (updateResponse===-1){
                        console.error("Error on comment update");
                        return;
                    }
                    allComments[index].isLiked = false
                    comment.children[0].children[1].children[0].src = "assets/likeoff.png";
                }
                else {
                    allComments[index].isLiked = true;
                    const updateResponse = await UpdateLikedComment(allComments[index].id, true);
                    if (updateResponse===-1){
                        console.error("Error on comment update");
                        return;
                    }
                    comment.children[0].children[1].children[0].src = "assets/likeon.png";
                }
            })
            comment.children[1].children[0].addEventListener("click", async e=>{
                const index = allComments.indexOf(responseComment);
                const respnseDelete = await DeleteComment(responseComment.id);
                if (respnseDelete===-1){
                    console.log("Error on delete posted comment");
                    return -1;
                }
                allCommentsElements.splice(index, 1);
                allComments.splice(index,1);
                comment.remove();
            })
            lines[allServerSubmitButtons.indexOf(button)].children[2].appendChild(comment);
            lines[allServerSubmitButtons.indexOf(button)].dispatchEvent(closedEvent);
            button.parentElement.parentElement.children[0].value = "";
            return 1;       
        })
    })
    let allLikeButtons = [...document.querySelectorAll(".like-button")];
    allLikeButtons.forEach(button => {
        const index = allCommentsElements.indexOf(button.parentElement.parentElement);
        button.addEventListener("click", async e => {
            if (allComments[index].isLiked) {
                const updateResponse = await UpdateLikedComment(allComments[index].id, false);
                if (updateResponse===-1){
                    console.error("Error on comment update");
                    return;
                }
                allComments[index].isLiked = false
                button.children[0].src = "assets/likeoff.png";
            }
            else {
                button.children[0].src = "assets/likeon.png";
                allComments[index].isLiked = true;
                const updateResponse = await UpdateLikedComment(allComments[index].id, true);
                if (updateResponse===-1){
                    console.error("Error on comment update");
                    return;
                }
            }
        })


    })
    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("mouseover", event => {
            button.style.cursor = "pointer"
        })
        button.addEventListener("mouseout", event => {
            button.style.cursor = "default"
        })
    })
}

const key = "drmodun";
const baseURL = "https://homework-server1.onrender.com/"


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
    deleteButton.addEventListener("click", async e=>{
    })
    commentContent.appendChild(deleteButton);
    comment.appendChild(commentContent);
    allCommentsElements.push(comment);
    return comment;
    
}

/*let local = window.localStorage;
if (local.getItem("comments") === null)
local.setItem("comments", JSON.stringify(localComments))
localComments = JSON.parse(local.getItem("comments"));
allCancelButtons.forEach(button => {
    button.addEventListener("click", event => {
        lines[allCancelButtons.indexOf(button)].dispatchEvent(closedEvent);
    });
})
*/
/*function GetComments() {
    fetch(baseURL + "comments", {
        headers: {
            key: "drmodun"
        },
        method: "GET"
    }).
}
function GetCode() {
    
}*/
function MakeNewLine(text, comments, lineNumber) {
    const lineRow = document.createElement("div");
    lineRow.classList.add("line-main");
    const line = document.createElement("div");
    line.classList.add("line");
    const lineNumberLabel = document.createElement("span");
    lineNumberLabel.classList.add("line-number");
    lineNumberLabel.innerHTML = lineNumber+1;
    const lineContent = document.createElement("span");
    lineContent.classList.add("line-content");
    lineContent.innerHTML = text;
    const lineComments =  document.createElement("div");
    lineComments.classList.add("line-comments")
    comments.forEach(comment=>{
        allComments.push(comment);
        lineComments.appendChild(MakeNewComment(comment.text, comment.isLiked, Date.parse(comment.createdAt)));
    })
    line.appendChild(lineNumberLabel);
    line.appendChild(lineContent);
    line.appendChild(lineComments);
    const newCommentRow = document.createElement("div");
    const newComment = document.createElement("div")
    newCommentRow.classList.add("new-comment");
    newComment.classList.add("comment", "user-input");
    let commentHeader = document.createElement("div");
    commentHeader.classList.add("comment-header");
    commentHeader.innerHTML = "This is your new comment";
    newComment.appendChild(commentHeader);
    const commentContent = document.createElement("div");
    const commentTextArea = document.createElement("textarea");
    const commentButtons = document.createElement("div");
    commentButtons.classList.add("comment-buttons");
    commentTextArea.rows = 10;
    commentTextArea.cols = 20;
    commentTextArea.wrap = "hard";
    commentTextArea.placeholder = "Write comment text here";
    commentTextArea.classList.add("comment-input");
    commentContent.appendChild(commentTextArea);
    commentContent.classList.add("comment-content");
    const cancelButton = document.createElement("button")
    cancelButton.innerHTML = "Cancel"
    cancelButton.classList.add("button-cancel");
    const makePrivateCommentButton = document.createElement("button")
    makePrivateCommentButton.innerHTML = "Save as private Note"
    makePrivateCommentButton.classList.add("button-local");
    commentButtons.appendChild(makePrivateCommentButton);
    const makeServerCommentButton = document.createElement("button")
    makeServerCommentButton.innerHTML = "Save to server"
    makeServerCommentButton.classList.add("button-server");
    commentButtons.appendChild(makeServerCommentButton);
    commentButtons.appendChild(cancelButton);
    commentContent.appendChild(commentButtons);
    const errorMessage = document.createElement("span");
    errorMessage.classList.add("error-message");
    errorMessage.innerHTML = "You cannot send an empty comment";
    commentContent.appendChild(errorMessage);
    newComment.appendChild(commentContent);
    newCommentRow.appendChild(newComment);
    lineRow.appendChild(line);
    lineRow.appendChild(newCommentRow);
    const insertLocation = document.querySelector(".code-content");
    insertLocation.appendChild(lineRow);
}
async function GetCode() {
    try {
        const response = await fetch(baseURL + "code", {
            headers: {
                key,
            },
            method: "GET"
        })
        if (!response.ok)
            throw response.status;
        else {
            const returnValue = await response.json();
            console.log(returnValue)
            const code = returnValue.code.split("\n");
            console.log(code)
            return code;
        }
    }
    catch (err) {
        console.error(err);
    }
}
async function GetCommentsServer() {
    try {
        const response = await fetch(baseURL + "comments", {
            headers: {
                key,
            },
            method: "GET"
        })
        if (!response.ok)
            throw response.status;
        else {
            const returnValue = await response.json();
            console.log(returnValue)
            return returnValue.comments;
        }
    }
    catch (err) {
        console.error(err);
        return ""
    }
}
async function PostComment(text, line){
    try{
        const response = await fetch(baseURL + "create", {
            method: "POST",
            headers: {
                key,
                "Content-Type": "application/json" 
            },
            body : JSON.stringify({
                line,
                text
            })
        })
        const returnValue = await response.json()
        if (!response.ok){
            console.log(returnValue);
            throw response.status;
        }
        console.log(returnValue);
        return returnValue;
    }
    catch(err){
        console.log(err)
        return -1;
    }
}
async function DeleteComment(id){
    try{
        const response = await fetch(baseURL+"remove/"+id, {
            headers: {
                key
            },
            method : "DELETE"
        })
        if (!response.ok){
            console.error(response)
            throw response.status;
        }
    }
    catch(err){
        console.log(err);
        return -1;
    }
}
async function UpdateLikedComment(id, isLiked){
    try{
        const response = await fetch(baseURL+"update-is-liked/"+id, {
            headers : {
                key,
                "Content-Type" : "application/json"
            },
            method : "PUT",
            body : JSON.stringify({
                isLiked
            })
        })
        if (!response.ok){
            console.error(xresponse.ok)
        throw response.status}
    }
    catch(err){
        console.log(err);
        return -1;
    }
}
async function ConstructCode() {
    try {
        const code = await GetCode();
        if (code.length === 0)
            throw "Error on Code request";
        const comments = await GetCommentsServer();
        console.log(comments)
        if (comments.length === 0)
            throw "Error on comments request";
        //formatedComments = [...comments];
        let iterator = 0;
        code.forEach(line => {
            MakeNewLine(line, comments.filter(comment=>{
                return comment.line===iterator+1;
            }), iterator);
            iterator+=1;
        })
        StartUp();

    }
    catch (err) {
        console.log(err);
    }
}