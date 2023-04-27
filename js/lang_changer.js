let langData = {
	UA : {
		newGame: "Нова гра",
		continueGame: "Продовжити гру",
		langHint: "Select language",
	},
	EN : {
		newGame: "New game",
		continueGame: "Continue game",
		langHint: "Оберіть мову",
	}
};

document.addEventListener("DOMContentLoaded", function() {
	
	let newGameButton = document.querySelector("#new_game");
	let continueGameButton = document.querySelector("#continue_game");
	let langId = localStorage.getItem("sea_battle_lang") || "UA";
	let lang = document.querySelector("#" + langId) || document.querySelector("#UA");
	lang.classList.add("selected_language");
	newGameButton.textContent = langData[langId].newGame;
	continueGameButton.textContent = langData[langId].continueGame;
})


document.addEventListener("click", function(e) {
	
	let newGameButton = document.querySelector("#new_game");
	let continueGameButton = document.querySelector("#continue_game");
	
	if(e.target.parentElement.classList.contains("language")) {
		
		let langElementArray = document.querySelectorAll(".language > div");
		
		langElementArray.forEach(item => {
			item.classList.remove("selected_language");
			if (item == e.target) {
				item.classList.add("selected_language");
				newGameButton.textContent = langData[e.target.id].newGame;
				continueGameButton.textContent = langData[e.target.id].continueGame;
			};
		});
	
	localStorage.setItem("sea_battle_lang", e.target.id);
	}
})

let i = 0;

document.addEventListener("mouseover", function(e) {
	
	let hint = document.querySelector(".language_hint");
	let langId = localStorage.getItem("sea_battle_lang") || "UA";
	let lang = document.querySelector("#" + langId) || document.querySelector("#UA");
	hint.textContent = langData[langId].langHint;
	
	if (e.target.parentElement.classList.contains("language")) {
		
		hint.style.display = "block";
		let id = setInterval(function() {
				hint.style.opacity = i;
				i += 0.1;
				if (i > 0.6) clearInterval(id);
		},50);
	}
})

document.addEventListener("mouseout", function(e) {
	
	let hint = document.querySelector(".language_hint");
	
	if (e.target.parentElement.classList.contains("language")) {
		hint.style.display = "none";
		hint.style.opacity = 0;
		i = 0;
	}
})