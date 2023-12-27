let resize = function () {
    console.log("resize called");
    let winHeight = window.innerHeight;
    let winWidth = window.innerWidth;

    //#region screenSafe
    let screenSafe = document.getElementById("screenSafe");
    let ss_height = Math.round(winHeight * .91); //leave 4.5% margin on all sides
    let ss_width = Math.round(ss_height / 9 * 16);
    let ss_top = (winHeight - ss_height) / 2;
    let ss_left = (winWidth - ss_width) / 2;
    let ss_position = "position:absolute;top:" + ss_top.toString() + "px;right:" + ss_left.toString() + "px;bottom:" + ss_top.toString() + "px;left:" + ss_left.toString() + "px;";
    screenSafe.setAttribute("style", ss_position);
    //#endregion

    //#region border
    let border = document.getElementById("border");
    let brdr_brdRadi = "border-radius:" + Math.round(ss_height / 32) + "px;";
    let brdr_pad = "padding:" + Math.round(border.clientHeight / 112) + "px;";
    let brdr_bgclr = "background:linear-gradient(170deg, rgba(100,180,255,.3), rgba(100,210,255,.3) 100%);";
    let brdr_brdr = "";
    let brdr_bxshdw = "box-shadow:0 0 " + Math.round(border.clientHeight / 10) + "px rgba(255,255,255,.1);";
    border.setAttribute("style", brdr_brdRadi + brdr_pad + brdr_bgclr + brdr_brdr + brdr_bxshdw);
    //#endregion

    //#region question-container
    let qc = document.getElementById("question-container");
    let qc_pad = "padding:" + Math.round(border.clientHeight / 18) + "px 0 0 0;";
    qc.setAttribute("style", qc_pad);
    //#endregion

    //#region content
    let content = document.getElementById("content");
    let cnt_pad = "padding:" + Math.round(border.clientHeight / 28) + "px;";
    let cnt_brdRadi = "border-radius:" + Math.round(border.clientHeight / 40) + "px;";
    let cnt_bxshdw = "";
    content.setAttribute("style", cnt_brdRadi + cnt_pad + cnt_bxshdw);
    //#endregion

    //#region prize
    let prizeBorder = document.getElementById("prizeBorder");
    let pb_brdRadi = "";
    let pb_bgclr = "";
    let pb_bxshdw = "";
    prizeBorder.setAttribute("style", pb_bgclr + pb_bxshdw + pb_brdRadi);

    let prizeArea = document.getElementById("prizeArea");
    let pi_brdRadi = "border-radius:" + Math.round(window.innerHeight / 50) + "px;";
    prizeArea.setAttribute("style", pi_brdRadi);
    //#endregion

    console.log("window.innerHeight " + window.innerHeight);

    let fontHeight = winHeight / 20;
    body.setAttribute("style", "font-size:" + fontHeight + "px;");
    document.getElementById("prizeText").setAttribute("style","font-size:" + fontHeight * .7 + "px;");
};

class Trivia {
    constructor() {
        this.currentQuestionIndex = 0;
        this.currentQuestion = questions[this.currentQuestionIndex];
        this.loadQuestion(this.currentQuestionIndex);
        this.showingQuestion = false;

        this.selectedGuestIndex = 0;
        this.currentGuest = 0;
        this.loadGuest(this.selectedGuestIndex);

        this.currentPrizeIndex = 0;
        this.currentPrize = 0;
        this.loadPrize(this.currentPrizeIndex);
        //alert(questions.length);
    }

    //#region Question
	loadQuestion = function (index) {
    	this.clearQuestion();
    	if (this.showingQuestion) {
    		this.showingQuestion = false;
    	} else {
    		this.currentQuestionIndex += index;
    		this.resolveQuestionIndex();
    		this.currentQuestion = questions[this.currentQuestionIndex];
    		//console.log("question number " + this.currentQuestionIndex);
    		let qc = document.getElementById("question-container");
    		qc.classList.add(this.currentQuestion.type);
    		qc.appendChild(this.questionDiv());

    		switch (this.currentQuestion.type) {
    			case "multiple-choice":
    				qc.appendChild(this.answerDiv("a", "A) " + this.currentQuestion.a));
    				qc.appendChild(this.answerDiv("b", "B) " + this.currentQuestion.b));
    				qc.appendChild(this.answerDiv("c", "C) " + this.currentQuestion.c));
    				qc.appendChild(this.answerDiv("d", "D) " + this.currentQuestion.d));
    				break;
    			case "response":
    				qc.appendChild(this.answerDiv("answer", ""));
    				break;
    		}
    		this.showingQuestion = true;
    	}
    }

    clearQuestion = function () {
        let qc = document.getElementById("question-container");
        qc.innerHTML = "";
        qc.classList = [];
        qc.dataset.questionType = "";
        qc.dataset.correctAnswer = "";
    }

    resolveQuestionIndex = function () {
        if (this.currentQuestionIndex === questions.length) {
            this.currentQuestionIndex = 0;
        } else if (this.currentQuestionIndex < 0) {
            this.currentQuestionIndex = questions.length - 1;
        }
    }

    questionDiv = function () {
        let div = document.createElement("div");
        div.id = "question";
        div.dataset.type = this.currentQuestion.type;
        div.dataset.answer = this.currentQuestion.answer;
        div.innerText = this.currentQuestion.question;
        return div;
    }

    answerDiv = function (id, text) {
        let div = document.createElement("div");
        div.id = id;
        div.innerText = text;
        return div;
    }

    showAnswer = function () {
        let txtShadow = "text-shadow: 0 0 " + window.innerHeight / 100 + "px rgba(255,198,10,1);";
        if (this.currentQuestion.type === "multiple-choice") {
            let a = document.getElementById(this.currentQuestion.answer);
            a.classList.add("correct-choice");
            a.setAttribute("style", txtShadow);
            //text-shadow: 0 0 3px rgba(255,255,255,.8);
        }
        if (this.currentQuestion.type === "response") {
            let a = document.getElementById("answer");
            if (this.currentQuestion.answer.toLowerCase() === "true" || this.currentQuestion.answer.toLowerCase() === "false") {
                a.setAttribute("style", "font-size:" + window.innerHeight / 7 + "px;");
            }
            a.innerText = this.currentQuestion.answer;
            a.classList.add("response-answer");
        }
    }
    //#endregion

    //#region Guest
    loadGuest = function (index) {
        console.log("loadGuest called");
        if (index === 0) {
            this.clearGuest();
            return;
        }
        this.currentGuest = guests[index];
        let gt = document.getElementById("guestText");
        let gi = document.getElementById("guestImage");
        gt.innerText = this.currentGuest.text;
        let gi_bgSz = "background-size: auto 100%;";
        //if (this.currentGuest.w > this.currentGuest.h) {
        //    gi_bgSz += "100% auto;";
        //} else {
        //    gi_bgSz += "auto 100%;";
        //}
        let gi_bg = "background: url(images/Logos/" + this.currentGuest.file + " ) no-repeat top center;";
        gi.setAttribute("style", gi_bg + gi_bgSz);
    }

    clearGuest = function () {
        console.log("clearPrize called");
        let pt = document.getElementById("guestText");
        let pi = document.getElementById("guestImage");
        pt.innerText = "";
        pi.removeAttribute("style");
    }
    //#endregion

    //#region Prize
    loadPrize = function (index) {
        //console.log("loadPrize called");
        this.clearPrize();
        if (this.currentPrize === 0) {
            //this.resolvePrizeIndex();
            this.currentPrize = prizes[this.currentPrizeIndex];
        } else {
            this.currentPrizeIndex += index;
            this.resolvePrizeIndex();
            let pt = document.getElementById("prizeText");
            pt.innerText = this.currentPrize.description;

            let pi = document.getElementById("prizeImage");
            let pi_bg = "background: url(images/Prizes/" + this.currentPrize.file + " ) no-repeat top center;";
            let pi_bgClr = "background-color: rgb(255,255,255);";
            let pi_bgSz = "background-size:";
            if (this.currentPrize.w > this.currentPrize.h) {
                pi_bgSz += "100% auto;";
            } else {
                pi_bgSz += "auto 100%;";
            }
            let pi_brdRadi = "border-radius:" + Math.round(border.clientHeight / 40) + "px;";
            let pi_pad = "padding:" + Math.round(border.clientHeight / 112) + "px;";
            pi_pad += "margin-top:" + Math.round(border.clientHeight / 112) + "px;";
            pi.setAttribute("style", pi_bg + pi_bgSz + pi_brdRadi + pi_pad + pi_bgClr);
            this.currentPrize = 0;
        }
    }

    clearPrize = function () {
        console.log("clearPrize called");
        let pt = document.getElementById("prizeText");
        let pi = document.getElementById("prizeImage");
        pt.innerText = "";
        pi.removeAttribute("style");
    }

    resolvePrizeIndex = function () {
        console.log("resolvePrizeIndex called");
        if (this.currentPrizeIndex === prizes.length) {
            this.currentPrizeIndex = 0;
        } else if (this.currentPrizeIndex < 0) {
            this.currentPrizeIndex = prizes.length - 1;
        }
    }
    //#endregion
}

let trivia = new Trivia();

let keyEventHandler = function (event) {
    if (event.ctrlKey) {
        if (event.keyCode === 37) { // Left Arrow
            trivia.loadPrize(-1);
            console.log("Previous Prize");
        }
        if (event.keyCode === 39) { // Right Arrow
            trivia.loadPrize(1);
            console.log("Next Prize");
        }
    }
    if (event.shiftKey) {
        if (event.keyCode === 37) { // Left Arrow
            console.log("Previous Question");
            trivia.loadQuestion(-1);
        }
        if (event.keyCode === 39) { // Right Arrow
            console.log("Next Question");
            trivia.loadQuestion(1);
        }
    }
    if (event.keyCode > 47 && event.keyCode < 58) {
        trivia.loadGuest(event.keyCode - 48);
    }
    if (event.keyCode === 32) { // Spacebar
        console.log("Show Answer");
        trivia.showAnswer();
    }
    if (event.keyCode === 122) { // F11
        console.log("F11");
        resize();
    }
};

document.getElementById("body").addEventListener("keydown", function (event) { keyEventHandler(event); });

window.onresize = function () { resize(); };

window.onload = function () { resize(); };