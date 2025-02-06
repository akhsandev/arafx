const messages = [
"yakinki?",
"deh bu aslinda",
"hamma e, klik mki yes",
"HEH KLIK YES!!",
"awwiiii kenapaje merah di tindis!",
"plis sayang eeeeee",
"pliss sekalii lope2 ku",
"klik ki je yes!",
"plis :'(",
];

let messageIndex = 0;

function handleNoClick() {
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');
    noButton.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1.5}px`;
}

function handleYesClick() {
    window.location.href = "yes_page.html";
}