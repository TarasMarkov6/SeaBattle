class Battlefield {

    createBattlefield(element) {

        const mainBattlefieldBlock = document.querySelector(element);

        for (let i = 0; i < 10; i++) {

            const row = document.createElement("div");

            row.classList.add("row");

            for (let j = 0; j < 10; j++) {

                const cell = document.createElement("div");

                cell.classList.add("cell");

                row.append(cell);

                this["cellCoords" + i + j] = {

                    rowNumber: i,
                    columnNumber: j,
                    cellElement: cell,
                    cellShip: null,
                    isFree: true,
                    shipsGenerateRestriction: [],
                    isFired: false,
                };
            }

            mainBattlefieldBlock.append(row);
        }
    }
}

const playerBattlefield = new Battlefield();
playerBattlefield.createBattlefield("#player");

const rivalBattlefield = new Battlefield();
rivalBattlefield.createBattlefield("#rival");