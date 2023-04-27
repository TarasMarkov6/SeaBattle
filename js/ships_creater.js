let language = localStorage.getItem("sea_battle_lang") || "UA";
let shipsTypes = ["submarine", "destroyer", "cruiser", "battleship"];
let backSound;
let isPlayerAction = false;

class Ship {

    constructor(position) {
        
        this.angle = 0;
        this.shipLength = position + 1;
        this.shipsNumber = 4 - position;
		this.shipShadow = null;
		this.shipType = shipsTypes[position];
    }

    createShip(element) {
		
		this.createShipMainBlock(element);
		this.createShipAsideBlock(element);
	}
	
	createShipMainBlock(element) {
        
        let blocks = [];
        this.createBlocks(blocks, "div", 2);

        let [shipMain, ship] = blocks;
      
        shipMain.classList.add("ship_main");
        ship.classList.add("war_ship");
		this.shipElement = ship;

        this.fillShipByBlocks(ship);
        shipMain.append(ship);
        element.append(shipMain);
    }
	
	createShipAsideBlock(element) {
		
		let blocks = [];

        this.createBlocks(blocks, "div", 1);

        let [shipAsideBlock] = blocks;
		
		shipAsideBlock.classList.add("ship_aside");
		
		this.createShipNumberBlock(shipAsideBlock);
		this.createShipRotateBlock(shipAsideBlock);
		
		element.append(shipAsideBlock);
	}
	
	createShipNumberBlock(element) {
		
		let blocks = [];
        let paragraphs = [];

        this.createBlocks(blocks, "div", 2);
        this.createBlocks(paragraphs, "p", 1);
		
		let [shipsNumber, shipsNumberInner] = blocks;
        let [shipsNumberValue] = paragraphs;

        shipsNumberValue.textContent = this.shipsNumber;
		shipsNumber.classList.add("ships_number");
		this.shipsNumberBlock = shipsNumberValue;
		
		shipsNumberInner.append(shipsNumberValue);
		shipsNumber.append(shipsNumberInner);
		element.append(shipsNumber);
	}
	
	createShipRotateBlock(element) {
		
		let blocks = [];
        let paragraphs = [];

        this.createBlocks(blocks, "div", 2);
        this.createBlocks(paragraphs, "p", 1);
		
		let [shipRotate, shipRotateInner] = blocks;
        let [shipRotateValue] = paragraphs;

        shipRotateValue.textContent = "R";
		shipRotate.classList.add("ship_rotate");
		this.shipRotateElement = shipRotateInner;		
		
		if (this.shipLength == 1) shipRotateInner.classList.add("not_active");
		
		shipRotateInner.append(shipRotateValue);
		shipRotate.append(shipRotateInner);
		element.append(shipRotate);
	}
	
	fillShipByBlocks(ship) {

		this.innerElements = [];
        
        for (let i = 0; i < this.shipLength; i++) {
            
            const shipInnerElement = document.createElement("div");
            
			ship.append(shipInnerElement);
			this.innerElements.push(shipInnerElement);
        }
    }

    createBlocks(array, selector, number) {
        
        for (let i = 0; i < number; i++) {
            
            const block = document.createElement(selector);
            array.push(block);
        }
    }
}

class Shadow {

	createShadow(ship, angle, e, indexOfShipElement) {

		this.block = document.createElement("div");
		
		const main = document.querySelector(".main");
		const cell = document.querySelector(".cell");
		this.subBlockHeight = parseInt(getComputedStyle(cell).height);
        this.subBlockWidth = parseInt(getComputedStyle(cell).width);
		
		for (let i = 0; i < ship.shipLength; i++) {

			const subBlock = document.createElement("div");
			
			subBlock.style.height = this.subBlockHeight + "px";
			subBlock.style.width = this.subBlockWidth + "px";

			this.block.append(subBlock);
		}

		this.id = (ship.innerElements.indexOf(e.target) == -1) ? indexOfShipElement : ship.innerElements.indexOf(e.target);
		this.block.classList.add("ship_shadow");
		this.block.style.flexDirection = (angle == 0) ? "column" : "row";

		this.block.style.top = (angle == 0) ? e.clientY - this.subBlockHeight * 0.5 - this.subBlockHeight * this.id + "px" :
		e.clientY - this.subBlockHeight * 0.5 + "px";
		
		this.block.style.left = (angle == 0) ? e.clientX - this.subBlockWidth * 0.5 + "px" :
		e.clientX - this.subBlockWidth * 0.5 - this.subBlockWidth * this.id + "px";
		
		main.style.cursor = "grabbing";
		ship.shipElement.classList.add("not_active");
		
		main.append(this.block);
	}
}

class Ships {
	
	static number = 0;

	createShips(element) {
	
		const ships = document.querySelector(element);

		for (let i = 0; i < shipsTypes.length; i++) {
    
			const shipBlock = document.createElement("div");
			const shipType = shipsTypes[i];
			const ship = new Ship(i);

			ship.createShip(shipBlock);
			ships.prepend(shipBlock);
			
			this[shipType] = ship;			
		}

		const aside = document.querySelector("#playerAside");
		const main = document.querySelector(".main");
		const playerField = document.querySelector("#player");


		let isShipShadow = false;
		let isPickedShip = false;
		let pickedShipAngle;
		let message;
		let rotateElementsArray = Array.from(aside.querySelectorAll(".ship_rotate > div"));
		
		aside.addEventListener("click", (e) => {

			this.createRotateHandler(e);
		}, false);
		
		aside.addEventListener("mouseover", (e) => {
			
			this.createShipSelector(e);
		}, false);
		
		aside.addEventListener("mouseout", (e) => {
			
			this.createShipDeselector(e);
		}, false);

		main.addEventListener("mousedown", (e) => {
			
			if (backSound == undefined) {
		
				backSound = new Audio("../audio/skay.mp3");
				backSound.play();
				backSound.loop = true;
				backSound.volume = 0.5;
			}

			this.createShipShadow(e);
			isShipShadow = true;

			if (e.target.closest(".war_ship")) {
				
				rotateElementsArray.forEach(item => {
					item.parentElement.classList.add("not_active");
				});
			}

			if (e.target.closest(".confirm_message")) {

				const playerBattlefield = document.querySelector("#player");
				const rivalBattlefield = document.querySelector("#rival");
				
				playerBattlefield.style.pointerEvents = "none";

				e.target.closest(".confirm_message").remove();
			}
		}, false);

		main.addEventListener("mouseup", (e) => {
			
			this.deleteShipShadow(e, pickedShipAngle);
			isShipShadow = false;
			
			rotateElementsArray.forEach(item => {
				item.parentElement.classList.remove("not_active");
			});
 
			main.style.cursor = "auto";
			pickedShipAngle = undefined;

			let number = 0;
			

			for (let key in playerShips) {

				number = (playerShips[key].shipsNumber > number) ? playerShips[key].shipsNumber : number;
			}

			if (number == 0) {

				if (!message) {

					message = this.createConfirmMessage(language);
				}
			} else {

				if (message) {
					
					this.deleteConfirmMessage(message);
					message = undefined;
				}
			}
		}, false);

		main.addEventListener("mousemove", (e) => {

			this.moveShipShadow(e, pickedShipAngle);
		}, false);

		
		playerField.addEventListener("mousemove", function(e) {

			if (e.target.closest(".cell > div")) {

				if (isShipShadow == false) {

					e.target.style.cursor = "grab";
				} else {

					e.target.style.cursor = "grabbing";
				}
			}

		}, false);

		playerField.addEventListener("mousedown", (e) => {
			
			if (e.target.closest(".cell > div")) {

				main.style.cursor = "grabbing";

				const typePickedShip = e.target.closest(".cell").dataset.type;
				const mainShip = playerShips[typePickedShip];
								
				let pickedShip;

				for (let key in mainShip) {

					if (key.includes(typePickedShip) && mainShip[key]["battlefieldShipElements"].includes(e.target)) {

						pickedShip = key;
					}
				}

				const indexOfShipElement = mainShip[pickedShip]["battlefieldShipElements"].indexOf(e.target);

				mainShip[pickedShip]["battlefieldShipElements"].forEach(item => item.remove());

				const cells = Object.values(playerBattlefield);
				cells.forEach(item => {

					if (item.shipsGenerateRestriction.includes(pickedShip)) {

						const index = item.shipsGenerateRestriction.indexOf(pickedShip);
						item.shipsGenerateRestriction.splice(index,1);
					}
					
					if (item.shipsGenerateRestriction.length == 0) {

						item.isFree = true;
					}
				});
				
				isPickedShip = true;
				pickedShipAngle = mainShip[pickedShip].angle;
				this.createShipShadow(e, mainShip, indexOfShipElement, pickedShipAngle);
				this.shipsNumberIncrease(mainShip);
				delete mainShip[pickedShip];
			}
		}, false);
	}
	
	createRotateHandler(e) {

		const shipsArray = Object.values(this);
		const currentShip = shipsArray.find(item => item.shipRotateElement == e.target.closest(".ship_rotate > div"));
		
		if (currentShip) {

			currentShip.angle -= 90;
			
			if (currentShip.angle == -180) currentShip.angle = 0;

			currentShip.shipElement.style.transform = `rotate(${currentShip.angle}deg)`;
		}
	}

	createShipSelector(e) {

		const shipsArray = Object.values(this);
		const currentShip = shipsArray.find(item => item.shipElement == e.target.closest(".war_ship"));

		if (currentShip) {

			currentShip.shipElement.style.transform = `scale(1.1) rotate(${currentShip.angle}deg)`;
			Array.from(currentShip.shipElement.children).forEach(item => item.style.backgroundColor = "rgb(189, 81, 4)");
		}
	}
	
	createShipDeselector(e) {

		const shipsArray = Object.values(this);
		const currentShip = shipsArray.find(item => item.shipElement == e.target.closest(".war_ship"));

		if (currentShip) {

			currentShip.shipElement.style.transform = `scale(1.0) rotate(${currentShip.angle}deg)`;
			Array.from(currentShip.shipElement.children).forEach(item => item.style.backgroundColor = "chocolate");
		}
	}

	createShipShadow(e, battlefieldShip, index, pickedShipAngle) {

		const shipsArray = Object.values(this);
		const asideShip = shipsArray.find(item => item.shipElement == e.target.closest(".war_ship"));
		const currentShip = asideShip || battlefieldShip;

		const currentShipAngle = (asideShip) ? asideShip.angle : pickedShipAngle;

		if (currentShip) {

			currentShip.shipShadow = new Shadow();
			currentShip.shipShadow.createShadow(currentShip, currentShipAngle, e, index);

			this.cellsSketching();
		}
	}

	deleteShipShadow(e, pickedShipAngle) {

		const shipsArray = Object.values(this);
		const currentShip = shipsArray.find(item => item.shipShadow);

		
		if (currentShip) {
			
			currentShip.shipShadow.block.remove();
			currentShip.shipElement.classList.remove("not_active");

			this.cellsUnSketching();
		}

		this.setShipInBattlefield(e, currentShip, pickedShipAngle);
		
		if (currentShip) {
			
			currentShip.shipShadow = null;
			pickedShipAngle = undefined;
		}
	}

	moveShipShadow(e, pickedShipAngle, isPickedShip) {
		
		const shipsArray = Object.values(this);
		const currentShip = shipsArray.find(item => item.shipShadow);
		
		if (currentShip && currentShip.shipShadow) {
			
			const angle = pickedShipAngle ?? currentShip.angle;
			currentShip.shipShadow.block.style.pointerEvents = "none";
			
			currentShip.shipShadow.block.style.top = (angle == 0) ? e.clientY - currentShip.shipShadow.subBlockHeight * 0.5 - currentShip.shipShadow.subBlockHeight * currentShip.shipShadow.id + "px" :
			e.clientY - currentShip.shipShadow.subBlockHeight * 0.5 + "px";
			
			currentShip.shipShadow.block.style.left = (angle == 0) ? e.clientX - currentShip.shipShadow.subBlockWidth * 0.5 + "px" :
			e.clientX - currentShip.shipShadow.subBlockWidth * 0.5 - currentShip.shipShadow.subBlockWidth * currentShip.shipShadow.id + "px";
			
			if (e.target.closest("#rival")) {

				currentShip.shipShadow.block.style.visibility = "hidden";
			} else {

				currentShip.shipShadow.block.style.visibility = "visible";
			}
		}
	}

	setShipInBattlefield(e, currentShip, pickedShipAngle) {

		if (e.target.closest("#player")) {
				
			for (let cell in playerBattlefield) {

				if (playerBattlefield[cell].cellElement == e.target && currentShip) {

					const rowNumber = playerBattlefield[cell].rowNumber;
					const columnNumber = playerBattlefield[cell].columnNumber;

					const id = currentShip.shipShadow.id;
					const length = currentShip.shipLength;
					const angle = pickedShipAngle ?? currentShip.angle;
					const type = currentShip.shipType;
					
					let shipBowRow = 9;
					let shipBowColumn = 9;
					let shipSternRow = 0;
					let shipSternColumn = 0;

					let cellsForShip = [];
					
					if (angle == 0) {

						for (let i = 0; i < id; i++) {

							const neighbourRowNumber = rowNumber - i - 1;
							const neighbourColumnNumber = columnNumber;

							if (neighbourRowNumber >= 0) {

								const key = Object.keys(playerBattlefield).find(item => item == "cellCoords" + neighbourRowNumber + neighbourColumnNumber);
								const cell = playerBattlefield[key].cellElement;

								if (!playerBattlefield[key].isFree) {

									cellsForShip.length = 0;
									break;
								} else {

									cellsForShip.push(cell);
								}

							} else {

								cellsForShip.length = 0;
								break;
							}
						}

						for (let j = 0; j <= (length-id-1); j++) {

							const neighbourRowNumber = rowNumber + j;
							const neighbourColumnNumber = columnNumber;

							if (neighbourRowNumber <= 9) {

								const key = Object.keys(playerBattlefield).find(item => item == "cellCoords" + neighbourRowNumber + neighbourColumnNumber);
								const cell = playerBattlefield[key].cellElement;

								if (!playerBattlefield[key].isFree) {

									cellsForShip.length = 0;
									break;
								} else {

									cellsForShip.push(cell);
								}

							} else {

								cellsForShip.length = 0;
								break;
							}
						}
					} else {

						for (let i = 0; i < id; i++) {

							const neighbourRowNumber = rowNumber;
							const neighbourColumnNumber = columnNumber - i - 1;

							if (neighbourColumnNumber >= 0) {

								const key = Object.keys(playerBattlefield).find(item => item == "cellCoords" + neighbourRowNumber + neighbourColumnNumber);
								const cell = playerBattlefield[key].cellElement;

								if (!playerBattlefield[key].isFree) {

									cellsForShip.length = 0;
									break;
								} else {

									cellsForShip.push(cell);
								}

							} else {

								cellsForShip.length = 0;
								break;
							}
						}

						for (let j = 0; j <= (length-id-1); j++) {

							const neighbourRowNumber = rowNumber;
							const neighbourColumnNumber = columnNumber  + j;

							if (neighbourRowNumber <= 9) {

								const key = Object.keys(playerBattlefield).find(item => item == "cellCoords" + neighbourRowNumber + neighbourColumnNumber);
								const cell = playerBattlefield[key].cellElement;

								if (!playerBattlefield[key].isFree) {

									cellsForShip.length = 0;
									break;
								} else {

									cellsForShip.push(cell);
								}

							} else {

								cellsForShip.length = 0;
								break;
							}
						}
					}

					if (cellsForShip.length == length) {
						
						cellsForShip.forEach(item => {

							const cell = Object.values(playerBattlefield).find(elem => elem.cellElement == item);
							cell.cellShip = type + Ships.number;
							item.dataset.type = type;

							shipBowRow = (shipBowRow >= cell.rowNumber) ? cell.rowNumber : shipBowRow;
							shipBowColumn = (shipBowColumn >= cell.columnNumber) ? cell.columnNumber : shipBowColumn;
							shipSternRow = (shipSternRow <= cell.rowNumber) ? cell.rowNumber : shipSternRow;
							shipSternColumn = (shipSternColumn <= cell.columnNumber) ? cell.columnNumber : shipSternColumn;	

							const shipElement = document.createElement("div");
							shipElement.classList.add("battlefieldShip");
	
							item.append(shipElement);
						});

						this.shipsNumberDecrease(currentShip);

						const cells = Object.values(playerBattlefield);

						let restrictedCells = cells.filter(item => item.rowNumber >= shipBowRow-1 && item.rowNumber <= shipSternRow+1 && 
																	item.columnNumber >= shipBowColumn-1 && item.columnNumber <= shipSternColumn+1);

						restrictedCells.forEach(item => {

							item.isFree = false;
							item.shipsGenerateRestriction.push(type + Ships.number);
						});

						currentShip[type + Ships.number] = {

							battlefieldShipElements: cellsForShip.map(item => item.firstElementChild),
							battlefieldRestrictedCells: restrictedCells,
							angle: angle,
						}

						Ships.number++;
					}
				}
			}
			
			let setSound = new Audio("../audio/ignite.mp3");
			setSound.play();
		}
	}
/*
	movingShipInBattlefield(e) {

		const currentShip = Object.values(playerBattlefield).find(elem => elem.cellElement == e.target);
	}
*/
	shipsNumberDecrease(ship) {

		const shipsNumber = --ship.shipsNumber;
		ship.shipsNumberBlock.textContent = shipsNumber;

		if (shipsNumber == 0) {

			ship.shipElement.classList.add("not_active");
			ship.shipRotateElement.classList.add("not_active");
		}
	}

	shipsNumberIncrease(ship) {

		const shipsNumber = ++ship.shipsNumber;
		ship.shipsNumberBlock.textContent = shipsNumber;

		if (shipsNumber > 0) {

			ship.shipRotateElement.classList.remove("not_active");
		}
	}

	cellsSketching() {

		for (let cell in playerBattlefield) {

			if (playerBattlefield[cell].isFree) {

				playerBattlefield[cell].cellElement.classList.add("free_cell");
			} else {

				playerBattlefield[cell].cellElement.classList.add("restricted_cell");
			}
		}
	}

	cellsUnSketching() {

		for (let cell in playerBattlefield) {

			if (playerBattlefield[cell].isFree) {

				playerBattlefield[cell].cellElement.classList.remove("free_cell");
			} else {

				playerBattlefield[cell].cellElement.classList.remove("restricted_cell");
			}
		}
	}

	createConfirmMessage(lang) {

		const submainDiv = document.querySelector(".submain").firstElementChild;
		const messageDiv = document.createElement("div");
		const parDiv = document.createElement("p");

		messageDiv.append(parDiv);
		parDiv.textContent = gameHints[lang].confirmButton;

		messageDiv.classList.add("confirm_message");
		
		if (!submainDiv.firstElementChild) {
			
			submainDiv.append(messageDiv);
			
			messageDiv.style.display = "flex";
			let id = setInterval(function() {
					messageDiv.style.opacity = Ships.i;
					Ships.i += 0.1;
					if (Ships.i > 1) clearInterval(id);
			},50);
		}

		return messageDiv;
	}

	deleteConfirmMessage(message) {

		Ships.i = 1;
		let id = setInterval(function() {
			message.style.opacity = Ships.i;
			Ships.i -= 0.1;
			if (Ships.i < 0) {
				Ships.i = 0;
				message.style.opacity = Ships.i;
				clearInterval(id);
			}
			},50);
		
		message.remove();
	}

	static i = 0;
	
	moveShipsOnRivalBattlefield() {
		
		let rivalShipsArray = shipsTypes.slice();
		let ship = rivalShipsArray[Math.floor(Math.random()*rivalShipsArray.length)];
		let pickedShip = rivalShips[ship];
		let block = this.creatRivalShipShadow(pickedShip);
		let messageBlock = createMessage(gameHints[language].locateRivalShips);
			
		let X = 3;
		let Y = (5-pickedShip.shipLength)*1.25;
		let a = 1;
		let b = 1
		
		block.style.transform = `translate(${X}vw, ${Y}vh)`;
		let pullSound;
		
		let id = setInterval(function() {
			
			if (pullSound == undefined) {
				
				pullSound = new Audio("../audio/pull.mp3");
				pullSound.play();
			}
			
			X -=0.05;
			Y +=0.02*pickedShip.shipLength;

		block.style.transform = `translate(${X}vw, ${Y}vh)`;
			
			if (X < -22) {
				
				pullSound = undefined;
				block.remove();
				pickedShip.shipsNumberBlock.textContent = --pickedShip.shipsNumber;

				if (pickedShip.shipsNumber == 0) {
					
					let index = rivalShipsArray.indexOf(ship);
					pickedShip.shipElement.classList.add("not_active");
					
					rivalShipsArray.splice(index, 1);
				}
				
				if (rivalShipsArray.length != 0) {

					ship = rivalShipsArray[Math.floor(Math.random()*rivalShipsArray.length)];
					pickedShip = rivalShips[ship];
					block = rivalShips.creatRivalShipShadow(pickedShip);
				
					X = 3;
					Y = (5-pickedShip.shipLength)*1.25;
		
					block.style.transform = `translate(${X}vw, ${Y}vh)`;

				} else {

					clearInterval(id);
					id = undefined;
					
					clearInterval(waitSymbolsId);
					waitSymbolsId = undefined;
					waitSymbols = ".";
					setTimeout( () => messageBlock.remove(), 1000 );
					setTimeout( ()=> {
						isPlayerAction = true;
						messageBlock = createMessage(gameHints[language].firstShootMessage);
					}, 1500);
					setTimeout( () => {
						document.querySelector("#rival").style.pointerEvents = "all";
					}, 2000);
				}
			}
		}, 5);
	}
	
	creatRivalShipShadow(pickedShip) {
		
		const block = document.createElement("div");
		const cell = document.querySelector(".cell");
		const rivalAside = document.querySelector("#rivalAside");
		const warShipArray = rivalAside.querySelectorAll(".war_ship");
		
		const subBlockHeight = parseInt(getComputedStyle(cell).height);
        const subBlockWidth = parseInt(getComputedStyle(cell).width);
		
		for (let i = 0; i < pickedShip.shipLength; i++) {

			const subBlock = document.createElement("div");
			
			subBlock.style.height = subBlockHeight + "px";
			subBlock.style.width = subBlockWidth + "px";
			
			block.append(subBlock);
		}

		block.classList.add("ship_shadow");
		block.style.flexDirection = "column";
		

		warShipArray.forEach(warShip => {
			
			if (warShip.querySelectorAll("div").length == pickedShip.shipLength) {
				
				warShip.parentElement.append(block);
			};
		});

		return block;
	}

	fillRivalBattlefield() {

		let shipsArray = [];
		let cellsArray = Object.values(rivalBattlefield).map(item => item.cellElement);
		let shipIndex = 0;
		
		cellsArray.forEach(item => {
			
			let frontElement = document.createElement("div");
			frontElement.classList.add("front");
			
			item.append(frontElement);
			item.classList.add("shell");
		});

		for (let i = 0; i < shipsTypes.length; i++) {

			const shipsNumber = shipsTypes.length - i;
			const shipLength = i + 1;
			shipsArray.push([shipsTypes[i], shipsNumber, shipLength]);
		}

		while (shipsArray.length != 0) {

			let randomCellNumber = Math.floor(Math.random()*cellsArray.length);
			let randomCellElement = cellsArray[randomCellNumber];
			let randomCellDatas = Object.values(rivalBattlefield).filter(item => item.cellElement == randomCellElement)[0];
			let randomCellColumnNumber = randomCellDatas.columnNumber;
			let randomCellRowNumber = randomCellDatas.rowNumber;
			let direction = ["horisontal", "vertical"][Math.round(Math.random())];
			let shipDatas = shipsArray[shipsArray.length-1];
			let shipType = shipDatas[0];
			let shipLength = shipDatas[2];
			let shipRightEndRow = (direction == "horisontal") ? randomCellRowNumber : randomCellRowNumber + shipLength - 1;
			let shipRightEndColumn = (direction == "horisontal") ? randomCellColumnNumber + shipLength - 1 : randomCellColumnNumber;
			let leftStartRow = randomCellRowNumber - 1;
			let leftStartColumn = randomCellColumnNumber - 1;
			let rightEndRow = (direction == "horisontal") ? randomCellRowNumber + 1 : randomCellRowNumber + shipLength;
			let rightEndColumn = (direction == "horisontal") ? randomCellColumnNumber + shipLength : randomCellColumnNumber + 1;
			let shipCellsArray = Object.values(rivalBattlefield).filter(item => {return item.columnNumber >= randomCellColumnNumber && item.rowNumber >= randomCellRowNumber 
																				&& item.columnNumber <= shipRightEndColumn && item.rowNumber <= shipRightEndRow});
			let shipCellsIsFreeArray = shipCellsArray.filter(item => item.isFree == true);
			let shipedCellsArray = Object.values(rivalBattlefield).filter(item => {return item.columnNumber >= leftStartColumn && item.rowNumber >= leftStartRow 
																				&& item.columnNumber <= rightEndColumn && item.rowNumber <= rightEndRow});
																				
			if (shipCellsArray.length == shipLength && shipCellsArray.length == shipCellsIsFreeArray.length) {
	
				shipCellsArray.forEach( item => {
				
				let block = document.createElement("div");
				block.classList.add("battlefieldShip");
								
				item.cellElement.append(block);
				item.cellShip = shipType + shipIndex;
				item.cellElement.dataset.type = shipType;

				shipedCellsArray.forEach(item => item.isFree = false);
			} );
			
			rivalShips[shipType][shipType + shipIndex] = {
				
				battlefieldRestrictedCells: shipedCellsArray,
			}

			shipIndex++;
			shipDatas[1]--;
			if (shipDatas[1] == 0) shipsArray.length--;

			} else continue;
		}
	}

	coinCreate() {

		let mainBlock = document.querySelector(".submain > div:nth-child(1)");
		let mainCoinBlock = document.createElement("div");
		mainCoinBlock.classList.add("main_coin");

		let coinFront = document.createElement("div");
		let coinBack = document.createElement("div");
		let coinValue = document.createElement("div");
		
		coinFront.innerHTML = "<span>SB</span>";
		coinBack.innerHTML = "<span>SB</span>";
		coinValue.textContent = 0;

		coinFront.classList.add("front_coin");
		coinBack.classList.add("back_coin");
		coinValue.classList.add("value_coin");
		
		mainCoinBlock.append(coinFront);
		mainCoinBlock.append(coinBack);
		
		
		mainBlock.append(mainCoinBlock);
		mainBlock.append(coinValue);
		mainBlock.style.alignContent = "center";
		mainBlock.style.flexWrap = "wrap";
		
		return mainCoinBlock;
	}
	
	rotateCoinHandler(block) {
		
		setInterval(function(){
			if (block.classList.contains("active_coin")) {
                block.classList.remove("active_coin");
            } else {
                block.classList.add("active_coin");
            }
		}, 3000);
	}
}

let playerShips = new Ships();
playerShips.createShips("#playerAside > .ships");

let rivalShips = new Ships();
rivalShips.createShips("#rivalAside > .ships");

document.querySelector(".main").addEventListener("mousedown", (e) => {
	
	if (e.target.closest(".confirm_message")) {
		
		Object.values(playerBattlefield).forEach(item => {

			if (item.cellElement.firstElementChild == undefined) {

				item.cellShip = null;
			}
		});
		
		rivalShips.moveShipsOnRivalBattlefield();
		rivalShips.fillRivalBattlefield();
		let mainCoinBlock = rivalShips.coinCreate();
		rivalShips.rotateCoinHandler(mainCoinBlock);
		console.log(playerBattlefield);
	}
});