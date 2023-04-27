document.addEventListener("DOMContentLoaded", function() {
    
    let storageName = localStorage.getItem("sea_battle_name");
    let customerName = document.querySelector("#playerName");

    customerName.textContent = storageName;
})

