let langData = {
	UA : {
		label: "Введіть ваше ім'я",
		buttonValue: "Підтвердити",
		hintMin: "Мінімальна кількість символів становить 3",
		hintMax: "Максимальна кількість символів становить 9",
	},
	EN : {
		label: "Enter your name",
		buttonValue: "Confirm",
		hintMin: "Minimal number of symbols is 3",
		hintMax: "Maximal number of symbols is 9",
	}
};

document.addEventListener("DOMContentLoaded", function() {
	
	let text = document.querySelector(".first_row p");
	let button = document.querySelector("[type='button']");
	let langId = localStorage.getItem("sea_battle_lang") || "UA";
	
	text.textContent = langData[langId].label;
	button.value = langData[langId].buttonValue;
})

let j;

document.addEventListener("click", function(e) {
	
	let langId = localStorage.getItem("sea_battle_lang") || "UA";
	let button = document.querySelector("[type='button']");
	let customerName = document.querySelector("[type='text']");

	if (e.target == button) {
		
		if (customerName.value.length >= 3 && customerName.value.length <= 9) {
			localStorage.setItem("sea_battle_name", customerName.value);
			customerName.value = "";
			window.open("./Game.html", "_self");
		
		} else {
			
			let hint = document.querySelector(".name_hint");
			
			hint.style.display = "none";
			hint.style.display = "flex";
			
			if (customerName.value.length < 3) {
				hint.firstElementChild.textContent = langData[langId].hintMin;
			} else {
				hint.firstElementChild.textContent = langData[langId].hintMax;				
			} 
			
			j = 0;
			let id = setInterval(function() {
			hint.style.opacity = j;
			j += 0.1;
			if (j > 0.6) clearInterval(id);
			},50);
		}
	}
})

document.addEventListener("keydown", function(e) {

	let langId = localStorage.getItem("sea_battle_lang") || "UA";

	if (e.code == "Enter") {
		
		if (customerName.value.length >= 3 && customerName.value.length <= 9) {
			localStorage.setItem("sea_battle_name", customerName.value);
			customerName.value = "";
			window.open("./Game.html", "_self");
		
		} else {
			
			let hint = document.querySelector(".name_hint");
			
			hint.style.display = "none";
			hint.style.display = "flex";
			
			if (customerName.value.length < 3) {
				hint.firstElementChild.textContent = langData[langId].hintMin;
			} else {
				hint.firstElementChild.textContent = langData[langId].hintMax;				
			} 
			
			j = 0;
			let id = setInterval(function() {
			hint.style.opacity = j;
			j += 0.1;
			if (j > 0.6) clearInterval(id);
			},50);
		}
	}
})

let customerName = document.querySelector("[type='text']");
let p = document.querySelector(".second_row");

customerName.addEventListener("input", function() {
	
	customerName.value = customerName.value[0].toUpperCase() + customerName.value.slice(1);
	
	if (customerName.value == "Маряна") {
		customerName.value = "Мар'яна";
	}
})