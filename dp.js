function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) {
        return seconds + " seconds ago";
    } else if (seconds < 3600) {
        return Math.floor(seconds / 60) + " minutes ago";
    } else if (seconds < 86400) {
        return Math.floor(seconds / 3600) + " hours ago";
    } else {
        return Math.floor(seconds / 86400) + " days ago";
    }
}

let lrparent = document.querySelector(".lrparent");
let chatarea = document.querySelector(".chatarea");
let title = document.getElementById("title");
let question = document.getElementById("question");
let submitQuesButton = document.getElementById("submitquestion");
let rightpane = document.querySelector(".rightpane");
let chat_storage_array = [];
let response_obj = {};
let searchfunctionality = document.getElementById("searchbox");

window.onload = function () {
    reloadingchats();
    question1_div_create();
    startUpdatingTimeAgo();
    searchfunctionality.addEventListener("input", searchChats);
};

function searchChats() {
    const query = searchfunctionality.value.toLowerCase();
    const chatDivs = document.querySelectorAll(".chatn");

    chatDivs.forEach(div => {
        const titleText = div.querySelector("h3").innerText.toLowerCase();
        const dataText = div.querySelector("p").innerText.toLowerCase();

        if (query && (titleText.includes(query) || dataText.includes(query))) {
            if(titleText.includes(query)){
                div.firstChild.style.backgroundColor = "yellow";
            }
            else if(dataText.includes(query)){
                ("div:nth-child(2)").style.backgroundColor = "yellow";
            }
        } else {
            div.style.backgroundColor = "white"; // Set to default background color
        }
    });
}


function reloadingchats() {
    let storedChats = JSON.parse(localStorage.getItem("chat_local_storage"));
    if (storedChats) {
        chat_storage_array = storedChats;

        chat_storage_array.forEach(chat => {
            createChatDiv(chat.id_current_storage, chat.title_in_storage, chat.chat_data_in_storage);
        });
    }
}

function createChatDiv(id, titleText, dataText) {
    let chat_div = document.createElement("div");
    chat_div.setAttribute("id", id);
    chat_div.setAttribute("class", "chatn");

    let chat_title = document.createElement("h3");
    let chat_data = document.createElement("p");
    let chat_time = document.createElement("span");

    chat_title.innerText = titleText;
    chat_data.innerText = dataText;
    chat_time.innerText = getTimeAgo(parseInt(id));
    chat_time.className = "chat-time-ago";

    let q1favbutton = document.createElement("img");
    q1favbutton.setAttribute("src", "atom.png");
    q1favbutton.setAttribute("class", "fav");

    chat_div.appendChild(chat_title);
    chat_div.appendChild(chat_data);
    chat_div.appendChild(chat_time);
    chat_div.appendChild(q1favbutton);

    chatarea.prepend(chat_div);

    chat_div.addEventListener("click", function () {
        question2_div_create(chat_title.innerText, chat_data.innerText, this);
    });

    q1favbutton.addEventListener("click", function () {
        if (this.src.includes("atom.png")) {
            chat_div.remove();
            chatarea.prepend(chat_div);
            this.src = "pinwheel.png";
        } else {
            chat_div.remove();
            chatarea.append(chat_div);
            this.src = "atom.png";
        }
    });
}

function question1_div_create() {
    rightpane.innerHTML = "";

    let q1title = document.createElement("h2");
    q1title.innerText = "Enter your query here : ";
    let q1input_title = document.createElement("textarea");
    q1input_title.placeholder = "Title here : ";
    q1input_title.setAttribute("class", "pretty-textarea");
    let q1input_qdata = document.createElement("textarea");
    q1input_qdata.setAttribute("class", "pretty-textarea");
    q1input_qdata.placeholder = "My question is..............?";
    q1input_qdata.style.display = "block ";
    let q1button = document.createElement("button");
    q1button.setAttribute("class", "button-33");
    q1button.innerText = "Submit";

    rightpane.appendChild(q1title);
    rightpane.appendChild(q1input_title);
    rightpane.appendChild(q1input_qdata);
    rightpane.appendChild(q1button);

    q1button.addEventListener("click", function () {
        let timestamp = Date.now().toString();
        createChatDiv(timestamp, q1input_title.value, q1input_qdata.value);

        let chat_obj = {
            title_in_storage: q1input_title.value,
            chat_data_in_storage: q1input_qdata.value,
            id_current_storage: timestamp,
            responses: []
        };
        chat_storage_array.push(chat_obj);

        localStorage.setItem("chat_local_storage", JSON.stringify(chat_storage_array));

        q1input_title.value = "";
        q1input_qdata.value = "";
    });
}

function getChatIndexById(chatId) {
    return chat_storage_array.findIndex(chat => chat.id_current_storage === chatId);
}

function question2_div_create(titleText, dataText, x) {
    rightpane.innerHTML = "";

    let q2heading = document.createElement("h3");
    q2heading.innerText = "Question";
    let q2displaybox = document.createElement("div");
    let q2ques_title = document.createElement("p");
    q2ques_title.style.backgroundColor = "antiquewhite";
    q2ques_title.innerText = titleText;
    let q2ques_data = document.createElement("p");
    q2ques_data.innerText = dataText;
    q2ques_data.style.backgroundColor = "grey";

    let q2button = document.createElement("button");
    q2button.setAttribute("class", "button-33");
    q2button.innerText = "Resolve";

    let solutionarea = document.createElement("div");
    solutionarea.id = "solutionarea";

    let Response = document.createElement("h4");
    Response.innerText = "Response";
    let addResponse = document.createElement("h3");
    addResponse.innerText = "Add response here : ";
    let addResponsetitlebox = document.createElement("textarea");
    addResponsetitlebox.innerText = "Add response here : ";
    let addResponsedatabox = document.createElement("textarea");
    addResponsedatabox.innerText = "Add response here : ";
    addResponsedatabox.style.display = "block";
    let addResponse_button = document.createElement("button");
    addResponse_button.innerText = "Add";
    addResponse_button.className = "button-33";

    q2button.addEventListener("click", function () {
        x.remove();
        chat_storage_array = chat_storage_array.filter(chat => chat.id_current_storage !== x.id);
        localStorage.setItem("chat_local_storage", JSON.stringify(chat_storage_array));
        question1_div_create();
    });

    solutionarea.appendChild(q2heading);
    solutionarea.appendChild(q2ques_title);
    solutionarea.appendChild(q2ques_data);
    solutionarea.appendChild(q2button);

    q2displaybox.appendChild(solutionarea);

    q2displaybox.appendChild(Response);
    q2displaybox.appendChild(addResponse);
    q2displaybox.appendChild(addResponsetitlebox);
    q2displaybox.appendChild(addResponsedatabox);
    q2displaybox.appendChild(addResponse_button);

    let current_index = getChatIndexById(x.id);
    if (current_index !== -1) {
        let responses = chat_storage_array[current_index].responses;
        responses.sort((a, b) => (b.like_storage - b.dislike_storage) - (a.like_storage - a.dislike_storage));
        responses_append(solutionarea, responses, current_index);
    }

    addResponse_button.addEventListener("click", function () {
        response_obj = {
            title: addResponsetitlebox.value,
            data: addResponsedatabox.value,
            like_storage: 0,
            dislike_storage: 0
        };

        if (current_index !== -1) {
            chat_storage_array[current_index].responses.push(response_obj);
            chat_storage_array[current_index].responses.sort((a, b) => (b.like_storage - b.dislike_storage) - (a.like_storage - a.dislike_storage));
            solutionarea.innerHTML = "";
            responses_append(solutionarea, chat_storage_array[current_index].responses, current_index);
            saveResponses(current_index);
        }
    });

    rightpane.appendChild(q2displaybox);
}

function responses_append(solutionarea, responses, current_index) {
    responses.forEach(response => {
        let particular_response = document.createElement("div");
        particular_response.className = "chatn";

        let particular_response_title = document.createElement("h2");
        let particular_response_data = document.createElement("p");

        let like_button = document.createElement("img");
        like_button.setAttribute("src", "like.png");
        like_button.setAttribute("class", "fav");
        let like_count_para = document.createElement("p");

        let dislike_button = document.createElement("img");
        dislike_button.setAttribute("src", "dislike.png");
        dislike_button.setAttribute("class", "fav");
        let dislike_count_para = document.createElement("p");

        particular_response_title.innerText = response.title;
        particular_response_data.innerText = response.data;
        like_count_para.innerText = response.like_storage;
        dislike_count_para.innerText = response.dislike_storage;

        like_button.addEventListener("click", function () {
            response.like_storage += 1;
            saveResponses(current_index);
            like_count_para.innerText = response.like_storage;
        });

        dislike_button.addEventListener("click", function () {
            response.dislike_storage += 1;
            saveResponses(current_index);
            dislike_count_para.innerText = response.dislike_storage;
        });

        particular_response.appendChild(particular_response_title);
        particular_response.appendChild(particular_response_data);
        particular_response.appendChild(like_button);
        particular_response.appendChild(like_count_para);
        particular_response.appendChild(dislike_button);
        particular_response.appendChild(dislike_count_para);

        solutionarea.appendChild(particular_response);
    });
}

function saveResponses(current_index) {
    localStorage.setItem("chat_local_storage", JSON.stringify(chat_storage_array));
}

function startUpdatingTimeAgo() {
    const chatTimes = document.querySelectorAll(".chat-time-ago");
    chatTimes.forEach(timeElement => {
        const timestamp = parseInt(timeElement.closest(".chatn").id);
        timeElement.innerText = getTimeAgo(timestamp);
    });

    setTimeout(startUpdatingTimeAgo, 60000);
}
