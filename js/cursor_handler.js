document.addEventListener("mousemove", function(e) {

    let div = document.querySelector(".target_main");
    div.style.top = e.clientY - parseInt(getComputedStyle(div).height)/2 + "px";
    div.style.left = e.clientX - parseInt(getComputedStyle(div).width)/2 + "px";
})

setInterval(()=>handler(),50);
let b = 0;
let k = 1;

function handler() {
let div = document.querySelector(".rotated");
div.style.transform = `rotate(${b+=5*k}deg)`;
if (b == 270) k = -1;
if (b == 0) k = 1;
}

let rival = document.querySelector("#rival");
let player = document.querySelector("#player");
let isPlayerWin = true;

rival.addEventListener("mouseover", function(){
    let div = document.querySelector(".target_main");
    div.style.visibility = "visible";
})

rival.addEventListener("mouseout", function(){
    let div = document.querySelector(".target_main");
    div.style.visibility = "hidden";
})

document.addEventListener("click", function(e) {
	const mine = new Audio(" ../audio/mine.mp3 ");
	const fire = new Image();
	fire.src = "../img/fire.png";
	fire.style.width = "100%";
	fire.style.position = "absolute";
	fire.style.zIndex = "2";
	fire.style.transform = "translate(0, -20%)";
	
	let cell = e.target.closest(".shell");
	let mainBlock = document.querySelector(".submain > div:nth-child(2)");
	let messageBlock = mainBlock.firstElementChild;
	let isShipFired = false;
			
	if (cell) {
		
		if (messageBlock) messageBlock.remove();
		const playerCellsArray = Object.values(playerBattlefield);
		cell.firstElementChild.style.backgroundColor = "transparent";
		cell.append(fire);
		cell.style.pointerEvents = "none";
		mine.play();
		
		const firedShip = findFiredShip(cell, mainBlock, messageBlock);
		
		if (!firedShip) {
			
			setTimeout(function(){
				
				fire.remove();
				isPlayerAction = false;
				messageBlock = createMessage(gameHints[language].missPlayerMessage);
			}, 1000);

			rival.style.pointerEvents = "none";
			
			let timeRange = Math.floor(Math.random()*3000 + 4000);
			
			let id = setInterval(function() {
				const firePlayerShips = new Image();
				firePlayerShips.src = "../img/fire.png";
				firePlayerShips.style.width = "100%";
				firePlayerShips.style.position = "absolute";
				firePlayerShips.style.zIndex = "2";
				firePlayerShips.style.transform = "translate(0, -20%)";

				mine.play();
				clearInterval(waitSymbolsId);
				messageBlock.remove();
				let playerFieldTargetCells = Object.values(playerBattlefield).filter(item => item.isFired == false);
				let targetCell = playerFieldTargetCells[Math.floor(Math.random()*playerFieldTargetCells.length)];
				let parentTargetCell = targetCell.cellElement.closest(".cell");
				targetCell.isFired = true;

				let targetCellShip = Object.values(playerBattlefield).filter(item => item.cellShip == targetCell.cellShip && item.cellShip != null);
				
				if (targetCellShip.length != 0) {

					let targetCellisFiredShip = targetCellShip.filter(item => item.isFired == false);

					if (targetCellisFiredShip.length == 0) {

						let currentShip = Object.values(playerShips).find(item => item[targetCell.cellShip]);
						currentShip[targetCell.cellShip].battlefieldRestrictedCells.forEach(item => item.isFired = true);
						isShipFired = true;
					}
				}

				parentTargetCell.append(firePlayerShips);

				if (targetCell.cellShip == null) {

					setTimeout(function(){
						
						rival.style.pointerEvents = "all";
						firePlayerShips.remove();
						clearInterval(id);
						clearInterval(waitSymbolsId);
						isPlayerAction = true;
						messageBlock = createMessage(gameHints[language].missRivalMessage);
					}, 2000);
				} else {

					setTimeout(function(){
						clearInterval(waitSymbolsId);
						if (isShipFired)  {
							
							messageBlock = createMessage(gameHints[language].wreckRivalMessage);
						} else {

							messageBlock = createMessage(gameHints[language].damageRivalMessage);
						}

					}, 2000);
				}

				if (Object.values(playerBattlefield).filter(item => item.cellShip != null && item.isFired == false).length == 0) {
					
					clearInterval(id);
					isPlayerWin = false;
					rival.style.pointerEvents = "none";
					
					setTimeout(()=>createFinalMessage(), 1500);
				}
			}, timeRange);
		}
	}
})

let coinValue = 10;

function findFiredShip(cell, mainBlock, messageBlock) {
	
	let firedShip = cell.querySelector(".battlefieldShip");
	let currentCell;
	let currentShip;
	
	if (firedShip) {
		
		isPlayerAction = true;
		messageBlock = createMessage(gameHints[language].damagePlayerMessage);
		mainBlock.append(messageBlock);
		
		for (let key in rivalShips[cell.dataset.type]) {
			
			if (key.includes(cell.dataset.type)) {
				
				currentCell = rivalShips[cell.dataset.type][key]["battlefieldRestrictedCells"].find(item => item.cellElement == firedShip.parentElement);
			}
			
			if (currentCell) {
					
				currentShip = currentCell.cellShip;
				currentCell.isFired = true;
				coinCounter(coinValue);
				coinValue += 10;
			}
		}
		
		if ( checkShipWreck(currentShip) ) {
			
			messageBlock.remove();
			isPlayerAction = true;
			messageBlock = createMessage(gameHints[language].wreckPlayerMessage);
			mainBlock.append(messageBlock);
			
			rivalShips[cell.dataset.type][currentShip]["battlefieldRestrictedCells"].forEach( item => {
				
				item.cellElement.firstElementChild.style.backgroundColor = "transparent";
				item.cellElement.style.pointerEvents = "none";
			});
			
			coinCounter(50);
		}
		
		if ( checkForEndGame() ) {

			Object.values(rivalBattlefield).forEach(item => item.cellElement.firstElementChild.style.backgroundColor = "transparent");

			setTimeout(()=>createFinalMessage(), 1500);
		};
		
		return firedShip;
	} else {
		
		coinValue = 10;
		return;
	}
}

function checkShipWreck(currentShip) {
	
	let shipCells = Object.values(rivalBattlefield).filter(item => item.cellShip == currentShip);
	let firedShipCells = shipCells.filter(item => item.isFired == true);

	if (shipCells.length == firedShipCells.length) return true;
}

let id;
let scaleValue = 1.3;

function coinCounter(value) {
	
	const valueCoin = document.querySelector(".value_coin");
	valueCoin.textContent = +valueCoin.textContent + value;
	
	if (id == undefined) {
		
		id = setInterval(function() {
			
			valueCoin.style.transform = `scale(${scaleValue}) translate(20px,0)`;
			
			valueCoin.style.textShadow = "0 0 5px black, 0 0 20px gold";
			scaleValue -= 0.1;
			
			if (scaleValue <= 1.0) {
				valueCoin.style.textShadow = "0 0 5px black";
				scaleValue = 1.3
				valueCoin.style.transform = `scale(1) translate(20px,0)`;
				clearInterval(id);
				id = undefined;
			}
		},100);
		
	}

	const moneySound = new Audio("../audio/cash.mp3");
	moneySound.play();
}

function checkForEndGame() {
	
	let isNotFired = Object.values(rivalBattlefield).filter(item => item.isFired == false && item.cellShip != null);
	
	if (isNotFired.length == 0) return true;
}

function createMessage(text) {

	let mainBlock = document.querySelector(".submain > div:nth-child(2)");
	let messageBlock = document.createElement("div");
	messageBlock.classList.add("message_block");
	messageBlock.style.backgroundColor = "lightgreen";

	let textBlock = document.createElement("div");
	textBlock.textContent = text;
	
	let waitShowBlock;
	
	if (isPlayerAction == false) {
		
		messageBlock.style.backgroundColor = "pink";

		waitShowBlock = document.createElement("div");

			waitSymbolsId = setInterval(function(){
		
			waitSymbols += ".";
			waitShowBlock.textContent = waitSymbols;
		
			if (waitSymbols == ".....") {

				waitSymbols = "";
			}
		}, 1000);
	}
	
	
	messageBlock.append(textBlock);
	if (isPlayerAction == false) messageBlock.append(waitShowBlock);
	
	mainBlock.append(messageBlock);

	return messageBlock;
}

function createFinalMessage(){
	
	let coinsValue = document.querySelector(".value_coin").textContent;
	
	const main = document.querySelector(".main");
	const messageBlock = document.createElement("div");
	messageBlock.classList.add("final_message");
	
	const messageText = document.createElement("div");
	const playerName = document.querySelector("#playerName");
	
	if (language == "UA") {
		
		if (isPlayerWin) {
			
			if ( playerName.textContent[playerName.textContent.length-1] == "a" || playerName.textContent[playerName.textContent.length-1]  == "а" || playerName.textContent[playerName.textContent.length-1] == "я" ) {
			
				messageText.textContent = gameHints[language].winMessage[0] + coinsValue + " монет";
			} else {
			
				messageText.textContent = gameHints[language].winMessage[1] + coinsValue + " монет";
			}
		} else {
			
			if ( playerName.textContent[playerName.textContent.length-1] == "a" || playerName.textContent[playerName.textContent.length-1]  == "а" || playerName.textContent[playerName.textContent.length-1] == "я" ) {
			
				messageText.textContent = gameHints[language].loseMessage[0] + coinsValue + " монет";
			} else {
			
				messageText.textContent = gameHints[language].loseMessage[1] + coinsValue + " монет";
			}
			
		}
	} else {
		
		if (isPlayerWin) {
			
			messageText.textContent = gameHints[language].winMessage + coinsValue + " coins";
		} else {
			
			messageText.textContent = gameHints[language].loseMessage + coinsValue + " coins";
		}
	}
	
	const continueGameText = document.createElement("div");
	continueGameText.textContent = gameHints[language].continueGameMessage;
	
	const btnBlock = document.createElement("div");
	btnBlock.insertAdjacentHTML("beforeend","<button>OK</button>");

	btnBlock.firstElementChild.addEventListener("click", function(){

		window.open("./Game.html", "_self");
	});

	
	messageBlock.append(messageText);
	messageBlock.append(continueGameText);
	messageBlock.append(btnBlock);
	
	main.append(messageBlock);
}
