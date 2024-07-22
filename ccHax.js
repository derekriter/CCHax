function cchax() {
    class HaxBlock {
        constructor(_children) {
            this.children = _children;
            
            this.html = undefined;
        }
        
        gen() {
            this.html = document.createElement("div");
            this.html.className = "haxBlock";
            
            this.children.forEach((e) => {
                if(e.html === undefined) e.gen();
                
                this.html.appendChild(e.html);
            });
        }
        addChild(c) {
            this.children.push(c);
        }
        addChildren(c) {
            this.children = this.children.concat(c);
        }
    }
    class HaxButton {
        constructor(_label, _tooltip, _onclick) {
            this.label = _label;
            this.tooltip = _tooltip;
            this.onclick = _onclick;
            
            this.html = undefined;
        }
        
        gen() {
            this.html = document.createElement("button");
            this.html.className = "haxButton";
            
            this.html.innerHTML = this.label;
            this.html.title = this.tooltip;
            this.html.addEventListener("click", this.onclick);
        }
    }
    class HaxTextInput{
        constructor(_type, _hint) {
            this.type = _type;
            this.hint = _hint;
            
            this.html = undefined;
        }
        
        gen() {
            this.html = document.createElement("input");
            this.html.className = "haxTextInput";
            
            this.html.type = "text";
            this.html.placeholder = this.hint;
            
            switch(this.type) {
                case "number":
                    this.html.addEventListener("input", () => {
                        this.html.value = this.html.value.replace(/\D/g, "");
                    });
                    break;
            }
        }
        getValue() {
            if(this.html === undefined) return "";
            return this.html.value;
        }
        getInt() {
            if(this.html === undefined || this.html.value === "") return NaN;
            return parseInt(this.html.value);
        }
    }
    class HaxDropdown {
        constructor(_options) {
            this.options = _options;
            
            this.html = undefined;
        }
        
        gen() {
            this.html = document.createElement("select");
            this.html.className = "haxDropdown";
            
            this.options.forEach((o) => {
                if(o.length !== 2 && typeof o !== "string") return;
                
                let sub = document.createElement("option");
                if(typeof o !== "string") {
                    sub.value = o[0];
                    sub.innerHTML = o[1];
                }
                else {
                    sub.value = o;
                    sub.innerHTML = o;
                }
                
                this.html.appendChild(sub);
            });
        }
        getValue() {
            if(this.html === undefined) return undefined;
            return this.html.value;
        }
    }
    class HaxBoolDisplay {
        constructor(_initVal) {
            this.val = _initVal;
            
            this.html = undefined;
        }
        
        gen() {
            this.html = document.createElement("p");
            this.html.className = "haxBoolDisplay";
            
            this.setValue(this.val);
        }
        setValue(_val) {
            this.val = _val;
            
            if(this.html === undefined) return;
            this.html.innerHTML = this.val ? "Enabled" : "Disabled";
            this.html.style.color = this.val ? "#0F0" : "#F00";
            this.html.style.backgroundColor = this.val ? "#00FF0055" : "#FF000055";
        }
    }
    
    /*CONSTS*/
    const ULTRACLK_AMT = 1e30;
    const UNITS_LIST = [["Cursor", "Cursor"], ["Grandma", "Grandma"], ["Farm", "Farm"], ["Mine", "Mine"], ["Factory", "Factory"], ["Bank", "Bank"], ["Temple", "Temple"], ["Wizard tower", "Wizard Tower"], ["Shipment", "Shipment"], ["Alchemy lab", "Alchemy Lab"], ["Portal", "Portal"], ["Time machine", "Time Machine"], ["Antimatter condenser", "Antimatter Condenser"], ["Prism", "Prism"], ["Chancemaker", "Chancemaker"], ["Fractal engine", "Fractal Engine"], ["Javascript console", "Javascript Console"], ["Idleverse", "Idleverse"], ["Cortex baker", "Cortex Baker"], ["You", "You"]];
    
    /*FUNCS*/
    function genPanel(blocks) {
        let p = document.createElement("div");
        p.id = "haxPanel";
        
        blocks.forEach((b) => {
            b.gen();
            p.appendChild(b.html);
        });
        
        return p;
    }
    function genStyle() {
        let s = document.createElement("style");
        s.innerHTML = `
#haxPanel {
    background: black;
    width: 300px;
    height: 30vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 1000000002;
    overflow-y: scroll;
}

.haxBlock {
    border-bottom: 1px solid #222;
    margin: 0 0 10px 0;
    padding: 0;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    column-gap: 5px;
    row-gap: 5px;
    overflow: hidden;
    flex-shrink: 0;
}
.haxBlock::after {
    content: "";
    height: 7px;
    width: 100%;
}

.haxButton {
    background: #008CBA55;
    color: white;
    margin: 0;
    border: none;
    text-align: center;
    padding: 5px;
    font-family: sans-serif;
    outline: none;
    flex: 1 100%;
    white-space: nowrap;
    cursor: pointer;
}
.haxButton:hover {
    background: #008CBA00;
    border: 1px solid #008CBA;
    padding: 4px;
}
.haxButton:active {
    background: #008CBA;
}
.haxButton:focus {
    outline: none;
}

.haxTextInput {
    background: #00000000;
    width: 100px;
    height: 16px;
    color: white;
    margin: 0;
    padding: 5px;
    font-family: sans-serif;
    border: none !important;
    outline: none;
    border-radius: 0 !important;
    box-shadow: none !important;
}
.haxTextInput:hover {
    background: #008CBA88;
}
.haxTextInput:focus {
    border-bottom: 1px solid #008CBA !important;
    padding-bottom: 4px;
}

.haxDropdown {
    font-family: sans-serif;
    padding: 5px;
    border-radius: 0;
    border: none;
    color: white;
    background: #000000;
    outline: none;
    cursor: pointer;
    max-width: 100%;
    margin: 0;
}
.haxDropdown:focus {
    border-left: 1px solid #008CBA;
    border-right: 1px solid #008CBA;
    padding-left: 4px;
    padding-right: 4px;
}
.haxDropdown option {
    color: black;
}

.haxBoolDisplay {
    margin: 0;
    display: inline-block;
    font-family: monospace;
    padding: 5px 5px 5px 0;
    width: 80px;
    text-align: center;
}
`;
        
        return s;
    }
    function ultraclick() {
        Game.cookies += ULTRACLK_AMT;
        Game.cookiesEarned += ULTRACLK_AMT;
    }
    
    /*VARS*/
    let ultraclkEnabled = false;
    let autoclkEnabled = false;
    let autoclkID = undefined;
    let goldFarmEnabled = false;
    let goldFarmID = undefined;
    
    /*ELEMENTS*/
    const ultraclkBtn = new HaxButton("Ultraclick", `Makes clicks worth ${ULTRACLK_AMT.toExponential()} cookies`, () => {
        ultraclkEnabled = !ultraclkEnabled;
        ultraclkDisp.setValue(ultraclkEnabled);
        
        if(ultraclkEnabled) Game.registerHook("click", ultraclick);
        else Game.removeHook("click", ultraclick);
    });
    const ultraclkDisp = new HaxBoolDisplay(ultraclkEnabled);
    const autoclkBtn = new HaxButton("Autoclick", "Autoclicks the cookie", () => {
        autoclkEnabled = !autoclkEnabled;
        autoclkDisp.setValue(autoclkEnabled);
        
        if(autoclkEnabled) {
            autoclkID = setInterval(() => {
                Game.lastClick = 0;
                document.getElementById("bigCookie").click();
            }, 1);
        }
        else clearInterval(autoclkID);
    });
    const autoclkDisp = new HaxBoolDisplay(autoclkEnabled);
    const clickUpgrades = new HaxBlock([ultraclkBtn, ultraclkDisp, autoclkBtn, autoclkDisp]);
    
    const addCookiesBtn = new HaxButton("Add Cookies", "Adds x cookies", () => {
        const amt = addCookiesAmt.getInt();
        if(isNaN(amt)) return;
        console.log(amt);
        Game.cookies += amt;
        Game.cookiesEarned += amt;
    });
    const addCookiesAmt = new HaxTextInput("number", "#");
    const addCookies = new HaxBlock([addCookiesBtn, addCookiesAmt]);
    
    const addLumpsBtn = new HaxButton("Add Sugar Lumps", "Adds x sugar lumps", () => {
        const amt = addLumpsAmt.getInt();
        if(isNaN(amt)) return;
        
        Game.lumps += amt;
        Game.lumpsTotal += amt;
    });
    const addLumpsAmt = new HaxTextInput("number", "#");
    const addLumps = new HaxBlock([addLumpsBtn, addLumpsAmt]);
    
    const addUnitsBtn = new HaxButton("Add Units", "Adds x of y units", () => {
        const amt = addUnitsAmt.getInt();
        if(isNaN(amt)) return;
        
        Game.Objects[addUnitsDrp.getValue()].getFree(amt);
    });
    const addUnitsDrp = new HaxDropdown(UNITS_LIST);
    const addUnitsAmt = new HaxTextInput("number", "#");
    const addUnits = new HaxBlock([addUnitsBtn, addUnitsDrp, addUnitsAmt]);
    
    const addChipsBtn = new HaxButton("Add Heavenly Chips", "Adds x heavenly chips", () => {
        let val = addChipsAmt.getInt();
        if(isNaN(val)) return;
        
        Game.heavenlyChips += val;
    });
    const addChipsAmt = new HaxTextInput("number", "#");
    const addChips = new HaxBlock([addChipsBtn, addChipsAmt]);
    
    const unlockAchvmtBtn = new HaxButton("Unlock Achievement", "Unlocks x achievement", () => {
        Game.Win(unlockAchvmtDrp.getValue());
    });
    const unlockAchvmtDrp = new HaxDropdown(Object.keys(Game.Achievements));
    const unlockAllAchvmtBtn = new HaxButton("Unlock All Achievements", "Unlocks all non-shadow and non-dungeon achievements", () => {
        Object.keys(Game.Achievements).forEach((a) => {
            let achvmt = Game.Achievements[a];
            if(achvmt.pool !== "shadow" && achvmt.pool !== "dungeon") Game.Win(a);
        });
    });
    const unlockAchvmt = new HaxBlock([unlockAchvmtBtn, unlockAchvmtDrp, unlockAllAchvmtBtn]);
    
    const spawnGoldenBtn = new HaxButton("Spawn Golden Cookie", "Spawns a golden cookie", () => {
        new Game.shimmer("golden").wrath = 0;
    });
    const goldFarmBtn = new HaxButton("Gold Farm", "Automatically clicks on golden cookies", () => {
        goldFarmEnabled = !goldFarmEnabled;
        goldFarmDisp.setValue(goldFarmEnabled);
        
        if(goldFarmEnabled) {
            goldFarmID = setInterval(() => {
                Game.shimmers.forEach((s) => {
                    if(s.wrath === 0) s.pop();
                });
            }, 100);
        }
        else clearInterval(goldFarmID);
    });
    const goldFarmDisp = new HaxBoolDisplay(goldFarmEnabled);
    const golden = new HaxBlock([spawnGoldenBtn, goldFarmBtn, goldFarmDisp]);
    
    /*const toggleUpgradeDisplay = createDisplay();
    let toggleUpgrade = false;
    let upgradeID = -1;
    const toggleUpgradeAction = createAction("Auto Upgrade", "Automatically buys available upgrades", () => {
        toggleUpgrade = !toggleUpgrade;
        updateDisplay(toggleUpgradeDisplay, toggleUpgrade);
        if(toggleUpgrade) {
            upgradeID = setInterval(() => {
                Game.UpgradesInStore.forEach((upgrade) => {
                    if(upgrade.pool != "toggle") upgrade.buy(1);
                });
            }, 100);
        } else {
            clearInterval(upgradeID);
        }
    });
    
    const changeTextureFromField = createField("text", "Texture");
    const changeTextureToField = createField("text", "URL");
    const changeTextureAction = createAction("Retexture", "Changes the texture of the provided texture to the image from the provided URL", () => {
        Game.Loader.Replace(changeTextureFromField.value, changeTextureToField.value);
    });
    
    let toggleUpgradeUnit = false;
    let upgradeUnitID = -1;
    const autoUpgradeUnitDisplay = createDisplay();
    const autoUpgradeUnitAction = createAction("Auto Upgrade Units", "Automatically upgrades your units with sugar lumps", () => {
        toggleUpgradeUnit = !toggleUpgradeUnit;
        updateDisplay(autoUpgradeUnitDisplay, toggleUpgradeUnit);
        if(toggleUpgradeUnit) {
            upgradeUnitID = setInterval(() => {
                Game.ObjectsById.forEach((unit) => {
                    unit.levelUp();
                });
            }, 500);
        } else {
            clearInterval(upgradeUnitID);
        }
    });
    
    const spawnWrinklerAction = createAction("Spawn Wrinkler", "Spawns a wrinkler", () => {
        Game.SpawnWrinkler();
    });
    
    const unlockUpgradeField = createField("text", "Upgrade Name");
    const unlockUpgradeAction = createAction("Unlock Upgrade", "Unlocks the provided upgrade", () => {
        Game.Unlock(unlockUpgradeField.value);
    });
    
    const unlockAllUpgradesAction = createAction("Unlock All Upgrades", "Unlocks all the upgrades", () => {
        for(var i in Game.UpgradesById) {
            Game.Unlock(Game.UpgradesById[i].name);
        }
    });
    
    const buffName = createField("text", "Buff Name");
    const buffTime = createField("text", "Buff Time");
    const buffArg1 = createField("text", "Buff Arg1");
    const buffAction = createAction("Add Buff", "Adds a buff", () => {
        Game.gainBuff(buffName.value, parseInt(buffTime.value), parseInt(buffArg1.value));
    });
    
    const clearBuffAction = createAction("Clear Buffs", "Clears all active buffs", () => {
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
                    } else if(wrinkler.timer < 121 && wrinkler.phase == 2 && wrinkler.hp > 0) {
                        wrinkler.timer++;
                    } else if(wrinkler.timer == 121 && wrinkler.phase == 2 && wrinkler.hp > 0) {
                        wrinkler.hp = -10;
                    }
                });
            }, 1000);
        } else {
            clearInterval(farmWrinklersID);
        }
    });*/
    
    
    const style = genStyle();
    document.head.appendChild(style);
    
    const panel = genPanel([clickUpgrades, addCookies, addLumps, addUnits, addChips, unlockAchvmt, golden]);
    document.body.appendChild(panel);
    
    Game.Notify("Loaded Hax", "", 0, 3);
    window.HAX_LOADED = true;
}

if(window.HAX_LOADED !== true) cchax();
else Game.Notify("Hax already loaded", "", 0, 3);
