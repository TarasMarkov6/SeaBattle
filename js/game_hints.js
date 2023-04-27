let isHint = false;
let hintOpacityValue = 0;
let hintBlock;

let gameHints = {
	UA: {
		
		ship: "Перемістіть корабель на ігрове поле",
		rotate: "Натисніть кнопку, щоб змінити положення корабля",
		number: "Кількість кораблів, що залишилось перемістити",
		confirmButton: "Підтвердити розташування",
		fullScreenMode: "Перейти до повноекранного режиму",
		commonMode: "Повернутися до режиму вікна",
		locateRivalShips: "Зачекайте, будь ласка! Розміщую кораблі на своєму полі",
		firstShootMessage: "Робіть свій перший постріл",
		winMessage:	["Поздоровляю! Ти перемогла, та здобула ", "Поздоровляю! Ти переміг, та здобув "],
		loseMessage: ["Нажаль ти програла, але здобула ", "Нажаль ти програв, але здобув "],
		continueGameMessage: "Бажаєш зіграти щє раз?",
		damagePlayerMessage: "Ви поцілили мій корабель. Робіть ще один постріл",
		wreckPlayerMessage: "Ви потопили мій корабель. Робіть ще один постріл",
		missPlayerMessage: "Ви не влучили. Моя черга робити постріл",
		damageRivalMessage: "Я поцілив Ваш корабель. Роблю ще один постріл",
		wreckRivalMessage: "Я потопив Ваш корабель. Роблю ще один постріл",
		missRivalMessage: "Я не влучив. Ваша черга робити постріл",
	},
	
	EN: {
		
		ship: "Move the ship onto the playing field",
		rotate: "Press the button to rotate the ship",
		number: "Number of ships that remain for moving onto the playing field",
		confirmButton: "Confirm location",
		fullScreenMode: "Move to the fullsreen mode",
		commonMode: "Return to the window mode",
		locateRivalShips: "Wait, please! I'm locating ships on my battlefield",
		firstShootMessage: "Make your first shoot",
		winMessage:	"Congratulations! You've win and earn coins",
		loseMessage: "Unfortunatly you've lose but earn coins",
		continueGameMessage: "Are you going to play one more time?",
		damagePlayerMessage: "You've damaged my ship. Make one more shoot",
		wreckPlayerMessage: "You've wrecked my ship. Make one more shoot",
		missPlayerMessage: "You've missed. It's my turn to shoot",
		damageRivalMessage: "I've damaged your ship. I'm going to make one more shoot",
		wreckRivalMessage: "I've wrecked your ship. I'm going to make one more shoot",
		missRivalMessage: "I've missed. It's your turn to shoot",
	},
	
	shipsHintCounter: 0,
	rotateHintCounter: 0,
	numberHintCounter: 0,
}

function showHint(e) {
	
	let hintTarget;
	let counter;
	
	if (e.target.closest(".war_ship")) {
		
		hintTarget = "ship";
		counter = "shipsHintCounter";
	} else if (e.target.closest(".ship_rotate > div")) {
		
		hintTarget = "rotate";
		counter = "rotateHintCounter";		
	} else if (e.target.closest(".ships_number > div")) {
		
		hintTarget = "number";
		counter = "numberHintCounter";		
	}

	if (gameHints[counter] < 3 && isHint == false) {

		isHint = true;
		gameHints[counter]++;
		
		let targetX = parseInt(e.clientX);
		let targetY = parseInt(e.clientY);
		hintBlock = document.createElement("div");
		
		hintBlock.classList.add("hint");
	
		hintBlock.style.display = "block";
		hintBlock.style.top = targetY + 10 + "px";
		hintBlock.style.left = targetX + 30 + "px";
		hintBlock.textContent = gameHints[language][hintTarget];

		document.querySelector("body").append(hintBlock);
		
		let id = setInterval(function() {
			hintBlock.style.opacity = hintOpacityValue;
			hintOpacityValue += 0.1;
			if (hintOpacityValue > 0.8) clearInterval(id);
		},50);
	}
}

function hideHint() {

	isHint = false;
	hintBlock.remove();
	hintOpacityValue = 0;
}

const aside = document.querySelector("#playerAside");
aside.addEventListener("mouseover", (e) => {

	showHint(e);
}, false);


aside.addEventListener("mousemove", (e) => {

	if (isHint && (e.target.classList.contains("ship_main") || e.target.classList.contains("ships_number") || 
	e.target.classList.contains("ship_rotate") || e.target.classList.contains("ship_aside") || 
	e.target.classList.contains("aside"))) {
		
		hideHint();
	}
}, false);

let waitSymbols = "";
let waitSymbolsId;
