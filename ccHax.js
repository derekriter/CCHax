function cchax() {
    /*CLASSES*/
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
        constructor(_type, _hint, _tooltip) {
            this.type = _type;
            this.hint = _hint;
            this.tooltip = _tooltip;
            
            this.html = undefined;
        }
        
        gen() {
            this.html = document.createElement("input");
            this.html.className = "haxTextInput";
            
            this.html.type = "text";
            this.html.placeholder = this.hint;
            if(this.tooltip !== undefined) this.html.title = this.tooltip;
            
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
.haxBlock:last-child {
    border-bottom: none;
    margin-bottom: 0;
}
.haxBlock::after {
    content: "";
    height: 7px;
    width: 100%;
}
.haxBlock:last-child::after {
    display: none;
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
    
    /*ELEMENTS*/
    let clicks;
    {
        const ULTRACLK_AMT = 1e30;
        
        function ultraclick() {
            Game.cookies += ULTRACLK_AMT;
            Game.cookiesEarned += ULTRACLK_AMT;
        }
        
        let ultraclkEnabled = false;
        let autoclkEnabled = false;
        let autoclkID = undefined;
        
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
        
        clicks = new HaxBlock([ultraclkBtn, ultraclkDisp, autoclkBtn, autoclkDisp]);
    }
    
    let resources;
    {
        const addCookiesBtn = new HaxButton("Add Cookies", "Adds x cookies", () => {
            const amt = addCookiesAmt.getInt();
            if(isNaN(amt)) return;
            console.log(amt);
            Game.cookies += amt;
            Game.cookiesEarned += amt;
        });
        const addCookiesAmt = new HaxTextInput("number", "#");
        const addLumpsBtn = new HaxButton("Add Sugar Lumps", "Adds x sugar lumps", () => {
            const amt = addLumpsAmt.getInt();
            if(isNaN(amt)) return;
            
            Game.lumps += amt;
            Game.lumpsTotal += amt;
        });
        const addLumpsAmt = new HaxTextInput("number", "#");
        const addChipsBtn = new HaxButton("Add Heavenly Chips", "Adds x heavenly chips", () => {
            let val = addChipsAmt.getInt();
            if(isNaN(val)) return;
            
            Game.heavenlyChips += val;
        });
        const addChipsAmt = new HaxTextInput("number", "#");
        
        resources = new HaxBlock([addCookiesBtn, addCookiesAmt, addLumpsBtn, addLumpsAmt, addChipsBtn, addChipsAmt]);
    }
    
    let buildings;
    {
        const addBuildingsBtn = new HaxButton("Add Buildings", "Adds x of y buildings", () => {
            const amt = addBuildingsAmt.getInt();
            if(isNaN(amt)) return;
            
            Game.Objects[addBuildingsDrp.getValue()].getFree(amt);
        });
        const addBuildingsDrp = new HaxDropdown([["Cursor", "Cursor"], ["Grandma", "Grandma"], ["Farm", "Farm"], ["Mine", "Mine"], ["Factory", "Factory"], ["Bank", "Bank"], ["Temple", "Temple"], ["Wizard tower", "Wizard Tower"], ["Shipment", "Shipment"], ["Alchemy lab", "Alchemy Lab"], ["Portal", "Portal"], ["Time machine", "Time Machine"], ["Antimatter condenser", "Antimatter Condenser"], ["Prism", "Prism"], ["Chancemaker", "Chancemaker"], ["Fractal engine", "Fractal Engine"], ["Javascript console", "Javascript Console"], ["Idleverse", "Idleverse"], ["Cortex baker", "Cortex Baker"], ["You", "You"]]);
        const addBuildingsAmt = new HaxTextInput("number", "#");
        
        buildings = new HaxBlock([addBuildingsBtn, addBuildingsDrp, addBuildingsAmt]);
    }
    
    let upgrades;
    {
        let autoupgdEnabled = false;
        let autoupgdID = undefined;
        
        const unlockupgdBtn = new HaxButton("Unlock Upgrade", "Unlocks x upgrade", () => {
            Game.Unlock(unlockupgdDrp.getValue());
        });
        const unlockupgdDrp = new HaxDropdown(Object.keys(Game.Upgrades));
        
        const unlockAllUpgdBtn = new HaxButton("Unlock All Upgrades", "Unlocks all non-toggle and non-debug upgrades", () => {
            Object.keys(Game.Upgrades).forEach((u) => {
                let obj = Game.Upgrades[u];
                if(obj.pool === "toggle" || obj.pool === "debug") return;
                
                Game.Unlock(u);
            });
        });
        const autoupgdBtn = new HaxButton("Auto Upgrade", "Automatically buys available upgrades for free", () => {
            autoupgdEnabled = !autoupgdEnabled;
            autoupgdDisp.setValue(autoupgdEnabled);
            
            if(autoupgdEnabled) {
                autoupgdID = setInterval(() => {
                    Game.UpgradesInStore.forEach((u) => {
                        if(u.pool !== "toggle" && u.pool !== "debug" && u.name !== "One mind" && u.name !== "Communal brainsweep" && u.name !== "Elder Pact") u.earn();
                    });
                }, 100);
            }
            else clearInterval(autoupgdID);
        });
        const autoupgdDisp = new HaxBoolDisplay(autoupgdEnabled);
        
        upgrades = new HaxBlock([unlockupgdBtn, unlockupgdDrp, unlockAllUpgdBtn, autoupgdBtn, autoupgdDisp]);
    }
    
    let achievements;
    {
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
        
        achievements = new HaxBlock([unlockAchvmtBtn, unlockAchvmtDrp, unlockAllAchvmtBtn]);
    }
    
    let goldenCookies;
    {
        let goldFarmEnabled = false;
        let goldFarmID = undefined;
        
        const spawnGoldenBtn = new HaxButton("Spawn Golden Cookie", "Spawns a golden cookie with x effect (Default is the normal game behaviour)", () => {
            let c = new Game.shimmer("golden");
            c.wrath = 0;
            if(spawnGoldenDrp.getValue() !== "default") c.force = spawnGoldenDrp.getValue();
        });
        const spawnGoldenDrp = new HaxDropdown([["default", "Default"], ["free sugar lump", "Sugar Lump"], ["frenzy", "Frenzy"], ["dragon harvest", "Dragon Harvest"], ["everything must go", "Everything Must Go"], ["multiply cookies", "Multiply Cookies"], ["ruin cookies", "Ruin Cookies"], ["blood frenzy", "Blood Frenzy"], ["clot", "Clot"], ["cursed finger", "Cursed Finger"], ["click frenzy", "Click Frenzy"], ["dragonflight", "Dragon Flight"], ["chain cookies", "Chain Cookie"], ["cookie storm", "Cookie Storm"], ["cookie storm drop", "Cookie Storm Drop"], ["blab", "Blab (Doesn't have any effects, extremely rare in normal behaviour)"]]);
        const goldFarmBtn = new HaxButton("Farm Golden Cookies", "Automatically clicks on golden cookies", () => {
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
        
        goldenCookies = new HaxBlock([spawnGoldenBtn, spawnGoldenDrp, goldFarmBtn, goldFarmDisp]);
    }
    
    let wrinklers;
    {
        let farmWrinklersEnabled = false;
        let farmWrinklersID = undefined;
        
        const spawnWrinklerBtn = new HaxButton("Spawn Wrinkler", "Spawns a wrinkler", () => {
            let before = Game.elderWrath;
            
            Game.elderWrath = 1;
            Game.SpawnWrinkler();
            Game.elderWrath = before;
        });
        const spawnShinyWrinklerBtn = new HaxButton("Spawn Shiny Wrinkler", "Spawns a shiny wrinkler", () => {
            let before = Game.elderWrath;
            
            Game.elderWrath = 1;
            let w = Game.SpawnWrinkler();
            Game.elderWrath = before;
            
            if(w) w.type = 1;
        });
        const farmWrinklersBtn = new HaxButton("Farm Wrinklers", "Automatically pops winklers after they have been feeding for 10 minutes", () => {
            farmWrinklersEnabled = !farmWrinklersEnabled;
            farmWrinklersDisp.setValue(farmWrinklersEnabled);
            
            if(farmWrinklersEnabled) {
                farmWrinklersID = setInterval(() => {
                    Game.wrinklers.forEach((w) => {
                        if(w.phase < 2) return;
                        
                        if(w.timer === undefined) w.timer = 0;
                        else if(w.timer < 600) w.timer++;
                        else {
                            delete w.timer;
                            w.hp = 0;
                        }
                    });
                }, 1000);
            }
            else clearInterval(farmWrinklersID);
        });
        const farmWrinklersDisp = new HaxBoolDisplay(farmWrinklersEnabled);
        
        wrinklers = new HaxBlock([spawnWrinklerBtn, spawnShinyWrinklerBtn, farmWrinklersBtn, farmWrinklersDisp]);
    }
    
    let buffs;
    {
        const addBuffBtn = new HaxButton("Add Buff", "Adds x buff for y seconds, with extra data z and w", () => {
            
        });
        const addBuffType = new HaxDropdown(Object.keys(Game.buffTypesByName));
        const addBuffTime = new HaxTextInput("number", "Duration (sec)");
        const addBuffDat1 = new HaxTextInput("text", "Hover for help", "dat1");
        const addBuffDat2 = new HaxTextInput("text", "Hover for help", "dat2");
        const clearBuffsBtn = new HaxButton("Clear Buffs", "Removes all active buffs", () => {
            Game.killBuffs();
        });
        
        buffs = new HaxBlock([addBuffBtn, addBuffType, addBuffTime, addBuffDat1, addBuffDat2, clearBuffsBtn]);
    }
    
    /*const changeTextureFromField = createField("text", "Texture");
    const changeTextureToField = createField("text", "URL");
    const changeTextureAction = createAction("Retexture", "Changes the texture of the provided texture to the image from the provided URL", () => {
        Game.Loader.Replace(changeTextureFromField.value, changeTextureToField.value);
    });
    
    const buffName = createField("text", "Buff Name");
    const buffTime = createField("text", "Buff Time");
    const buffArg1 = createField("text", "Buff Arg1");
    const buffAction = createAction("Add Buff", "Adds a buff", () => {
        Game.gainBuff(buffName.value, parseInt(buffTime.value), parseInt(buffArg1.value));
    });
    
    /*INJECTION*/
    const style = genStyle();
    document.head.appendChild(style);
    
    const panel = genPanel([clicks, resources, buildings, upgrades, achievements, goldenCookies, wrinklers, buffs]);
    document.body.appendChild(panel);
    
    Game.Notify("Loaded Hax", "", 0, 3);
    window.HAX_LOADED = true;
}

if(window.HAX_LOADED !== true) cchax();
else Game.Notify("Hax already loaded", "", 0, 3);
