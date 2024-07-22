function ultraclick() {
    Game.cookies += 100000000000000000000;
    Game.cookiesEarned += 100000000000000000000;
}
function createAction(display, details, event) {
    const action = document.createElement("button");
    action.innerHTML = display;
    action.title = details;
    action.style.backgroundColor = "#008CBA55";
    action.style.color = "white";
    action.style.display = "inline-block";
    action.style.marginBottom = "5px";
    action.style.border = "none";
    action.style.textAlign = "center";
    action.style.padding = "5px 5px 5px 5px";
    action.style.fontFamily = "monospace";
    action.style.transitionDuration = "0.4s";
    action.style.outline = "none";
    action.addEventListener("mouseover", () => {
        action.style.backgroundColor = "#008CBA";
    });
    action.addEventListener("mouseout", () => {
        action.style.backgroundColor = "#008CBA55";
    });
    action.addEventListener("mousedown", () => {
        action.style.backgroundColor = "#008CBA88";
    });
    action.addEventListener("mouseup", () => {
        action.style.backgroundColor = "#008CBA";
    });
    action.addEventListener("click", event);
    return action;
}
function createField(type, hint) {
    const field = document.createElement("input");
    if (type != "text") {
        field.type = type;
    }field.placeholder = hint;
    field.style.backgroundColor = "#00000000";
    field.style.width = "80px";
    field.style.height = "16px";
    field.style.color = "white";
    field.style.marginBottom = "5px";
    field.style.padding = "5px 5px 5px 5px";
    field.style.fontFamily = "monospace";
    field.style.border = "none";
    field.style.transitionDuration = "0.4s";
    field.style.outline = "none";
    field.style.marginLeft = "3px";
    field.addEventListener("mouseover", () => {
        field.style.backgroundColor = "#008CBA88";
    });
    field.addEventListener("mouseout", () => {
        field.style.backgroundColor = "#00000000";
    });
    field.addEventListener("focusin", () => {
        field.style.borderTop = "none";
        field.style.borderLeft = "none";
        field.style.borderRight = "none";
        field.style.borderBottom = "2px solid #008CBA";
    });
    field.addEventListener("focusout", () => {
        field.style.border = "none";
    });
    return field;
}
function createDisplay() {
    const display = document.createElement("p");
    display.innerHTML = "Disabled";
    display.style.color = "#F00";
    display.style.marginBottom = "5px";
    display.style.display = "inline-block";
    display.style.fontFamily = "monospace";
    display.style.marginLeft = "3px";
    display.style.backgroundColor = "#FF000055";
    display.style.padding = "5px 5px 5px 0px";
    return display;
}
function updateDisplay(display, state) {
    display.innerHTML = state ? "Enabled" : "Disabled";
    display.style.color = state ? "#0F0" : "#F00";
    display.style.backgroundColor = state ? "#00FF0055" : "#FF000055";
}

const panel = document.createElement("div");
panel.style.position = "absolute";
panel.style.left = "0px";
panel.style.top = "0px";
panel.style.backgroundColor = "black";
panel.style.borderBottom = "2px solid #008CBA";
panel.style.width = "100%";
panel.style.height = "calc(100% - 20px)";
panel.style.textAlign = "left";
panel.style.paddingLeft = "10px";
panel.style.paddingTop = "10px";
panel.style.overflowX = "hidden";

const addCookiesField = createField("number", "A Number");
const addCookiesAction = createAction("Add Cookies", "Instantly adds x amount of cookies", () => {
    Game.cookies += parseInt(addCookiesField.value);
    Game.cookiesEarned += parseInt(addCookiesField.value);
});

const addLumpsField = createField("number", "A Number");
const addLumpsAction = createAction("Add Sugar Lumps", "Instantly adds x amount of sugar lumps", () => {
    Game.lumps += parseInt(addLumpsField.value);
    Game.lumpsTotal += parseInt(addLumpsField.value);
});

const addUnitsType = createField("text", "Unit Name");
const addUnitsAmount = createField("number", "A Number");
const addUnitsAction = createAction("Add Units","Instantly adds x amount of y units",() => {
    Game.Objects[addUnitsType.value].getFree(parseInt(addUnitsAmount.value));
});

const toggleultraclickEnabledDisplay = createDisplay();
var ultraclickEnabled = false;
const toggleultraclickEnabledAction = createAction("Ultraclick","When enabled, makes each click add 10^20 cookies",() => {
    ultraclickEnabled = !ultraclickEnabled;
    updateDisplay(toggleultraclickEnabledDisplay, ultraclickEnabled);
    if (ultraclickEnabled) {
        Game.registerHook("click", ultraclick);
    } else {
        Game.removeHook("click", ultraclick);
    }
});

const unlockField = createField("text", "Achievement Name");
const unlockAction = createAction("Unlock Achievement","Instantly unlocks the achievement named x",() => {
    Game.Win(unlockField.value);
});

const addChipsField = createField("number", "A Number");
const addChipsAction = createAction("Add Heavenly Chips","Instantly gives you x amount of heavenly chips",() => {
    Game.heavenlyChips += parseInt(addChipsField.value);
});

const toggleAutoDisplay = createDisplay();
var toggleAuto = false;
var autoclickerID = -1;
const toggleAutoAction = createAction("Autoclicker","Enables an autoclicker on the big cookie (doesn't require that your mouse is on the big cookie)",() => {
    toggleAuto = !toggleAuto;
    updateDisplay(toggleAutoDisplay, toggleAuto);
    if (toggleAuto) {
        autoclickerID = setInterval(() => {
            document.getElementById("bigCookie").click();
        }, 1);
    } else {
        clearInterval(autoclickerID);
    }
});

const spawnGoldenAction = createAction("Spawn Golden Cookie","Spawns a golden cookie",() => {
    new Game.shimmer("golden").wrath = 0;
});

const toggleGoldenDisplay = createDisplay();
var toggleGolden = false;
var goldenID = -1;
const toggleGoldenAction = createAction("Gold Farm","Automatically clicks on golden cookies",() => {
    toggleGolden = !toggleGolden;
    updateDisplay(toggleGoldenDisplay, toggleGolden);
    if (toggleGolden) {
        goldenID = setInterval(() => {
            Game.shimmers.forEach((shimmer) => {
                if (shimmer.wrath == 0) {
                    shimmer.pop();
                }
            });
        }, 100);
    } else {
        clearInterval(goldenID);
    }
});

const toggleUpgradeDisplay = createDisplay();
var toggleUpgrade = false;
var upgradeID = -1;
const toggleUpgradeAction = createAction("Auto Upgrade","Automatically buys available upgrades",() => {
    toggleUpgrade = !toggleUpgrade;
    updateDisplay(toggleUpgradeDisplay, toggleUpgrade);
    if (toggleUpgrade) {
        upgradeID = setInterval(() => {
            Game.UpgradesInStore.forEach((upgrade) => {
                if (upgrade.pool != "toggle") upgrade.buy(1);
            });
        }, 100);
    } else {
        clearInterval(upgradeID);
    }
});

const changeTextureFromField = createField("text", "Texture");
const changeTextureToField = createField("text", "URL");
const changeTextureAction = createAction("Retexture","Changes the texture of the provided texture to the image from the provided URL",() => {
    Game.Loader.Replace(changeTextureFromField.value, changeTextureToField.value);
});

var toggleUpgradeUnit;
var upgradeUnitID = -1;
const autoUpgradeUnitDisplay = createDisplay();
const autoUpgradeUnitAction = createAction("Auto Upgrade Units","Automatically upgrades your units with sugar lumps",() => {
    toggleUpgradeUnit = !toggleUpgradeUnit;
    updateDisplay(autoUpgradeUnitDisplay, toggleUpgradeUnit);
    if (toggleUpgradeUnit) {
        upgradeUnitID = setInterval(() => {
            Game.ObjectsById.forEach((unit) => {
                unit.levelUp();
            });
        }, 500);
    } else {
        clearInterval(upgradeUnitID);
    }
});

const spawnWrinklerAction = createAction("Spawn Wrinkler","Spawns a wrinkler",() => {
    Game.SpawnWrinkler();
});

const unlockUpgradeField = createField("text", "Upgrade Name");
const unlockUpgradeAction = createAction("Unlock Upgrade","Unlocks the provided upgrade",() => {
    Game.Unlock(unlockUpgradeField.value);
});

const unlockAllUpgradesAction = createAction("Unlock All Upgrades","Unlocks all the upgrades",() => {
    for (var i in Game.UpgradesById) {
        Game.Unlock(Game.UpgradesById[i].name);
    }
});

const buffName = createField("text", "Buff Name");
const buffTime = createField("text", "Buff Time");
const buffArg1 = createField("text", "Buff Arg1");
const buffAction = createAction("Add Buff", "Adds a buff", () => {
    Game.gainBuff(buffName.value,parseInt(buffTime.value),parseInt(buffArg1.value));
});

const clearBuffAction = createAction("Clear Buffs","Clears all active buffs",() => {
    Game.killBuffs();
});

const farmWrinklersDisplay = createDisplay();
var farmWrinklers = false;
var farmWrinklersID = -1;
const farmWrinklersAction = createAction("Auto Pop Wrinklers", "Automatically pops wrinklers after 2 minutes", () => {
    farmWrinklers = !farmWrinklers;
    updateDisplay(farmWrinklersDisplay, farmWrinklers);
    if(farmWrinklers) {
        farmWrinklersID = setInterval(() => {
            Game.wrinklers.forEach((wrinkler) => {
                if(wrinkler.timer == undefined && wrinkler.phase == 2 && wrinkler.hp > 0) {
                    wrinkler.timer = 1;
                }else if(wrinkler.timer < 121 && wrinkler.phase == 2 && wrinkler.hp > 0) {
                    wrinkler.timer++;
                }else if(wrinkler.timer == 121 && wrinkler.phase == 2 && wrinkler.hp > 0) {
                    wrinkler.hp = -10;
                }
            });
        }, 1000);
    } else {
        clearInterval(farmWrinklersID);
    }
});

const unlockAllAchievementsAction = createAction("Unlock All Achievements", "Unlocks all achievements (doesn't unlock shadow achievements)", () => {
    Game.AchievementsById.forEach((achievement) => {
        if(achievement.pool != "shadow") {
            Game.Win(achievement.name);
        }
    });
});

panel.appendChild(addCookiesAction);
panel.appendChild(addCookiesField);
panel.appendChild(addLumpsAction);
panel.appendChild(addLumpsField);
panel.appendChild(document.createElement("br"));
panel.appendChild(addUnitsAction);
panel.appendChild(addUnitsType);
panel.appendChild(addUnitsAmount);
panel.appendChild(document.createElement("br"));
panel.appendChild(toggleultraclickEnabledAction);
panel.appendChild(toggleultraclickEnabledDisplay);
panel.appendChild(document.createElement("br"));
panel.appendChild(unlockAction);
panel.appendChild(unlockField);
panel.appendChild(addChipsAction);
panel.appendChild(addChipsField);
panel.appendChild(toggleAutoAction);
panel.appendChild(toggleAutoDisplay);
panel.appendChild(document.createElement("br"));
panel.appendChild(spawnGoldenAction);
panel.appendChild(document.createElement("br"));
panel.appendChild(toggleGoldenAction);
panel.appendChild(toggleGoldenDisplay);
panel.appendChild(document.createElement("br"));
panel.appendChild(toggleUpgradeAction);
panel.appendChild(toggleUpgradeDisplay);
panel.appendChild(document.createElement("br"));
panel.appendChild(changeTextureAction);
panel.appendChild(changeTextureFromField);
panel.appendChild(changeTextureToField);
panel.appendChild(autoUpgradeUnitAction);
panel.appendChild(autoUpgradeUnitDisplay);
panel.appendChild(spawnWrinklerAction);
panel.appendChild(document.createElement("br"));
panel.appendChild(unlockUpgradeAction);
panel.appendChild(unlockUpgradeField);
panel.appendChild(unlockAllUpgradesAction);
panel.appendChild(document.createElement("br"));
panel.appendChild(buffAction);
panel.appendChild(buffName);
panel.appendChild(buffTime);
panel.appendChild(buffArg1);
panel.appendChild(document.createElement("br"));
panel.appendChild(clearBuffAction);
panel.appendChild(document.createElement("br"));
panel.appendChild(farmWrinklersAction);
panel.appendChild(farmWrinklersDisplay);
panel.appendChild(document.createElement("br"));
panel.appendChild(unlockAllAchievementsAction);
panel.appendChild(document.createElement("br"));

document.getElementById("smallSupport").appendChild(panel);
Game.Notify("Loaded Hax", "", 0, 3);
