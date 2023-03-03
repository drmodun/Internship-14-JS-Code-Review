import {UpdateLikedComment, GetCode, GetCommentsServer, PostComment, DeleteComment} from "./fetch.js";   
import {MakeNewComment, MakeNewLine, DialogueWindow} from "./helpers.js"
let allComments = []
const allCommentsElements = [];
const local = window.localStorage;
let localComments = [];
let localCommentsTry = local.getItem("comments");
if (localCommentsTry === null) {
    console.log("local storage is empty");
    local.setItem("comments", JSON.stringify(localComments));
}
else {
    localComments = JSON.parse(localCommentsTry);
}

function StartUp() {
    const lines = [...document.querySelectorAll(".line")];
    const commentsByLine = [];
    const closedEvent = new Event("close")
    const allCancelButtons = [...document.querySelectorAll(".button-cancel")];
    const allLocalSubmitButtons = [...document.querySelectorAll(".button-local")]
    const allServerSubmitButtons = [...document.querySelectorAll(".button-server")];
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
            element.dispatchEvent(closedEvent);
            lines.forEach(turnOffLine => {
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

    allCancelButtons.forEach(button => {
        button.addEventListener("click", event => {
            const cancelComment = button.parentElement.parentElement;
            console.log(button.parentElement.parentElement.children[0]);
            cancelComment.children[0].value = "";
            lines[allCancelButtons.indexOf(button)].dispatchEvent(closedEvent);
        })
    })

    const allDeleteButtons = [...document.querySelectorAll(".button-delete")];
    console.log(allDeleteButtons);
    allDeleteButtons.forEach(button => {
        const index = allCommentsElements.indexOf(button.parentElement.parentElement)
        if (!localComments.includes(allComments[index])) {
            button.addEventListener("click", async e => {
                const confirmation = DialogueWindow()
                if (!confirmation)
                    return;
                const index = allCommentsElements.indexOf(button.parentElement.parentElement)
                allCommentsElements.splice(index, 1);
                const deleteResponse = await DeleteComment(allComments[index].id);
                if (deleteResponse === -1) {
                    return
                }
                allComments.splice(index, 1);
                button.parentElement.parentElement.remove();
            })
        }
        else {
            button.addEventListener("click", event => {
                const confirmation = DialogueWindow()
                if (!confirmation)
                    return;
                const index = allCommentsElements.indexOf(button.parentElement.parentElement)
                localComments.splice(localComments.indexOf(allComments[index]), 1);
                allComments.splice(index, 1);
                local.setItem("comments", JSON.stringify(localComments));
                allCommentsElements[index].remove();
                allCommentsElements.splice(index, 1);
            })
        }
    })

    allServerSubmitButtons.forEach(button => {
        button.addEventListener("click", async e => {
            const inputValue = button.parentElement.parentElement.children[0].value.trim();
            if (inputValue.length === 0) {
                button.parentElement.parentElement.children[2].style.display = "flex";
                return
            }
            button.parentElement.parentElement.children[2].style.display = "none";
            const postResponse = await PostComment(inputValue, allServerSubmitButtons.indexOf(button) + 1);
            if (postResponse === -1) {
                return
            }
            const responseComment = postResponse.comment;
            const comment = MakeNewComment(inputValue, false, new Date(), false, allCommentsElements);
            allComments.push(responseComment);
            comment.children[0].children[1].addEventListener("click", async e => {
                const index = allComments.indexOf(responseComment);
                if (allComments[index].isLiked) {
                    const updateResponse = await UpdateLikedComment(allComments[index].id, false);
                    if (updateResponse === -1) {
                        return;
                    }
                    allComments[index].isLiked = false
                    comment.children[0].children[1].children[0].src = "assets/likeoff.png";
                }
                else {
                    allComments[index].isLiked = true;
                    const updateResponse = await UpdateLikedComment(allComments[index].id, true);
                    if (updateResponse === -1) {
                        return;
                    }
                    comment.children[0].children[1].children[0].src = "assets/likeon.png";
                }
            })
            comment.children[1].children[0].addEventListener("click", async e => {
                const index = allComments.indexOf(responseComment);
                const confirmation = DialogueWindow()
                if (!confirmation)
                    return;
                const responseDelete = await DeleteComment(responseComment.id);
                if (responseDelete === -1) {
                    return -1;
                }
                allCommentsElements.splice(index, 1);
                allComments.splice(index, 1);
                comment.remove();
            })
            comment.children[1].children[0].addEventListener("mouseover", event=>{
                comment.children[1].children[0].style.cursor = "pointer"
            })
            comment.children[1].children[0].addEventListener("mouseout", event=>{
                comment.children[1].children[0].style.cursor = "default"
            })
            lines[allServerSubmitButtons.indexOf(button)].children[2].appendChild(comment);
            lines[allServerSubmitButtons.indexOf(button)].dispatchEvent(closedEvent);
            button.parentElement.parentElement.children[0].value = "";
            return 1;
        })
        
    })

    allLocalSubmitButtons.forEach(button => {
        button.addEventListener("click", event => {
            const inputValue = button.parentElement.parentElement.children[0].value.trim();
            if (inputValue.length === 0) {
                button.parentElement.parentElement.children[2].style.display = "flex";
                return
            }
            button.parentElement.parentElement.children[2].style.display = "none";
            const newComment = {
                text: inputValue,
                createdAt: new Date(),
                line: allLocalSubmitButtons.indexOf(button),
                isLiked: false
            };
            const comment = MakeNewComment(inputValue, false, newComment.createdAt, true, allCommentsElements);
            allComments.push(newComment);
            localComments.push(newComment);
            local.setItem("comments", JSON.stringify(localComments));
            comment.children[0].children[1].addEventListener("click", event => {
                const index = allComments.indexOf(newComment);
                if (newComment.isLiked) {
                    newComment.isLiked = false;
                    comment.children[0].children[1].children[0].src = "assets/likeoff.png";
                    local.setItem("comments", JSON.stringify(localComments));
                }
                else {
                    newComment.isLiked = true;
                    comment.children[0].children[1].children[0].src = "assets/likeon.png";
                    local.setItem("comments", JSON.stringify(localComments));
                }
            })
            comment.children[1].children[0].addEventListener("click", event => {
                const index = allComments.indexOf(newComment);
                const confirmation = DialogueWindow()
                if (!confirmation)
                    return;
                allCommentsElements.splice(index, 1);
                allComments.splice(index, 1);
                localComments.splice(localComments.indexOf(newComment), 1);
                local.setItem("comments", JSON.stringify(localComments));
                comment.remove();
            })
            comment.children[1].children[0].addEventListener("mouseover", event=>{
                comment.children[1].children[0].style.cursor = "pointer"
            })
            comment.children[1].children[0].addEventListener("mouseout", event=>{
                comment.children[1].children[0].style.cursor = "default"
            })
            lines[allLocalSubmitButtons.indexOf(button)].dispatchEvent(closedEvent);
            button.parentElement.parentElement.children[0].value = "";
            lines[allLocalSubmitButtons.indexOf(button)].children[2].appendChild(comment);
        })
    })

    let allLikeButtons = [...document.querySelectorAll(".like-button")];
    allLikeButtons.forEach(button => {
        const index = allCommentsElements.indexOf(button.parentElement.parentElement);
        if (!localComments.includes(allComments[index])) {
            button.addEventListener("click", async e => {
                const index = allCommentsElements.indexOf(button.parentElement.parentElement);
                if (allComments[index].isLiked) {
                    const updateResponse = await UpdateLikedComment(allComments[index].id, false);
                    if (updateResponse === -1) {
                        return;
                    }
                    allComments[index].isLiked = false
                    button.children[0].src = "assets/likeoff.png";
                }
                else {
                    allComments[index].isLiked = true;
                    const updateResponse = await UpdateLikedComment(allComments[index].id, true);
                    if (updateResponse === -1) {
                        return;
                    }
                    button.children[0].src = "assets/likeon.png";
                }
            })
        }
        else {
            button.addEventListener("click", event => {
                const index = allCommentsElements.indexOf(button.parentElement.parentElement);
                if (allComments[index].isLiked) {
                    allComments[index].isLiked = false
                    button.children[0].src = "assets/likeoff.png";
                    local.setItem("comments", JSON.stringify(localComments));
                }
                else {
                    allComments[index].isLiked = true
                    button.children[0].src = "assets/likeon.png";
                    local.setItem("comments", JSON.stringify(localComments));
                }
            })
        }
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

async function ConstructCode() {
    try {
        const code = await GetCode();
        if (code.length === 0)
            throw "Error on Code request";
        const comments = await GetCommentsServer();
        console.log(comments)
        if (comments.length === 0)
            throw "Error on comments request";
        let iterator = 0;
        code.forEach(line => {
            MakeNewLine(line, comments.filter(comment => {
                return comment.line === iterator + 1;
            }), localComments.filter(comment => { return comment.line === iterator }), iterator, allComments, allCommentsElements);
            iterator += 1;
        })
        StartUp();

    }
    catch (err) {
        console.log(err);
    }
}
ConstructCode()