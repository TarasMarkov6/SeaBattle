document.querySelector(".icon_mode").addEventListener("mouseover", function(){

    let textBlock = document.querySelector(".text_mode");
    let lang = localStorage.getItem("sea_battle_lang") || "UA";
    
    if (!document.fullscreenElement) {

        textBlock.textContent = gameHints[lang].fullScreenMode;
    } else {

        textBlock.textContent = gameHints[lang].commonMode;
    }
})

document.querySelector(".icon_mode").addEventListener("mouseleave", function(){

    let textBlock = document.querySelector(".text_mode");
    
    textBlock.textContent = "";
})

document.querySelector(".icon_mode").addEventListener("click", function(){

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
})