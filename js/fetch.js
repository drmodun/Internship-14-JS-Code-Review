const key = "drmodun";
const baseURL = "https://homework-server1.onrender.com/"
export async function GetCode() {
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
export async function GetCommentsServer() {
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
export async function PostComment(text, line) {
    try {
        const response = await fetch(baseURL + "create", {
            method: "POST",
            headers: {
                key,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                line,
                text
            })
        })
        const returnValue = await response.json()
        if (!response.ok) {
            console.log(returnValue);
            throw response.status;
        }
        console.log(returnValue);
        return returnValue;
    }
    catch (err) {
        console.log(err)
        return -1;
    }
}
export async function DeleteComment(id) {
    try {
        const response = await fetch(baseURL + "remove/" + id, {
            headers: {
                key
            },
            method: "DELETE"
        })
        if (!response.ok) {
            console.error(response)
            throw response.status;
        }
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}
export async function UpdateLikedComment(id, isLiked) {
    try {
        const response = await fetch(baseURL + "update-is-liked/" + id, {
            headers: {
                key,
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify({
                isLiked
            })
        })
        if (!response.ok) {
            console.error(response.ok)
            throw response.status
        }
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}