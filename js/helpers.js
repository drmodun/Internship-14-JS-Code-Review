export function MakeNewComment(text, liked, date, isLocal, allCommentsElements) {
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
    if (isLocal)
        commentContent.classList.add("comment-local-content");
    const commentText = document.createTextNode(text);
    commentContent.appendChild(commentText)
    commentContent.classList.add("comment-content");
    const deleteButton = document.createElement("button")
    deleteButton.innerHTML = "Delete comment"
    deleteButton.classList.add("button-delete");
    deleteButton.addEventListener("click", async e => {
    })
    commentContent.appendChild(deleteButton);
    comment.appendChild(commentContent);
    allCommentsElements.push(comment);
    return comment;

}
export function MakeNewLine(text, comments, localComments, lineNumber, allComments, allCommentsElements) {
    const lineRow = document.createElement("div");
    lineRow.classList.add("line-main");
    const line = document.createElement("div");
    line.classList.add("line");
    const lineNumberLabel = document.createElement("span");
    lineNumberLabel.classList.add("line-number");
    lineNumberLabel.innerHTML = lineNumber + 1;
    const lineContent = document.createElement("span");
    lineContent.classList.add("line-content");
    const lineText = document.createTextNode(text);
    const lineTextElement = document.createElement("pre");
    lineTextElement.appendChild(lineText);
    lineContent.appendChild(lineTextElement);
    const lineComments = document.createElement("div");
    lineComments.classList.add("line-comments")
    comments.forEach(comment => {
        allComments.push(comment);
        lineComments.appendChild(MakeNewComment(comment.text, comment.isLiked, Date.parse(comment.createdAt), false, allCommentsElements));
    });
    localComments.forEach(comment => {
        allComments.push(comment);
        lineComments.appendChild(MakeNewComment(comment.text, comment.isLiked, Date.parse(comment.createdAt), true, allCommentsElements));
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
export function DialogueWindow() {
    const answer = confirm("Ova akcija ce trajno promijeniti podatke aplikacije, kliknite ok za nastavak");
    return answer;
}