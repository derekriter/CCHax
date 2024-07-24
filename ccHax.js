function cchax() {
    const VERSION = "v1.2";
    let SETTINGS = JSON.parse(window.localStorage.getItem("hax"));
    
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
        constructor(_type, _hint, _tooltip, _oninput) {
            this.type = _type;
            this.hint = _hint;
            this.tooltip = _tooltip;
            this.oninput = _oninput;
            
            this.html = undefined;
        }
        
        gen() {
            this.html = document.createElement("input");
            this.html.className = "haxTextInput";
            
            this.html.type = "text";
            this.html.placeholder = this.hint;
            if(this.tooltip !== undefined) this.html.title = this.tooltip;
            
            switch(this.type) {
                case "integer":
                    this.html.addEventListener("input", () => {
                        this.html.value = this.html.value.replace(/\D/g, "");
                    });
                    break;
                case "float":
                    this.html.addEventListener("input", () => {
                        this.html.value = this.html.value.replace(/[^.\d]/g, "");
                    });
            }
            
            if(this.oninput !== undefined) this.html.addEventListener("input", this.oninput);
        }
        getValue() {
            if(this.html === undefined) return "";
            return this.html.value;
        }
        getInt() {
            if(this.html === undefined || this.html.value === "") return NaN;
            return parseInt(this.html.value);
        }
        getFloat() {
            if(this.html === undefined || this.html.value === "") return NaN;
            return parseFloat(this.html.value);
        }
    }
    class HaxDropdown {
        constructor(_options, _tooltip) {
            this.options = _options;
            this.tooltip = _tooltip;
            
            this.html = undefined;
        }
        
        gen() {
            this.html = document.createElement("select");
            this.html.className = "haxDropdown";
            if(this.tooltip !== undefined) this.html.title = this.tooltip;
            
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
    class HaxToggle {
        constructor(_label, _tooltip, _onclick, _state=false) {
            this.label = _label;
            this.tooltip = _tooltip;
            this.onclick = _onclick;
            this.state = Boolean(_state);
            
            this.html = undefined;
        }
        
        gen() {
            this.html = document.createElement("button");
            this.html.className = "haxToggle";
            this.html.style.cssText = `--color: ${this.state ? "#00BA00" : "#BA0000"};`;
            
            this.html.innerHTML = this.label;
            this.html.title = this.tooltip;
            this.html.addEventListener("click", () => {
                this.state = !this.state;
                this.html.style.cssText = `--color: ${this.state ? "#00BA00" : "#BA0000"};`;
                
                this.onclick();
            });
        }
        getState() {
            return Boolean(this.state);
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
        
        let v = document.createElement("div");
        v.id = "haxFooter";
        v.innerHTML = `<p>CC Hax</p><a target="_blank" href="https://github.com/derekriter/cchax">${VERSION}</a>`;
        p.appendChild(v);
        
        return p;
    }
    function genStyle() {
        let s = document.createElement("style");
        s.innerHTML = `
#haxPanel {
    background: black;
    width: 300px;
    height: 30vh;
    padding: 20px 20px 10px 20px;
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    bottom: 20px;
    z-index: 1000000002;
    overflow-y: scroll;
}
#haxFooter {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 330px;
    height: 20px;
    background: black;
    border-top: 1px solid #222;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: white;
    font-family: sans-serif;
    font-weight: 900;
    padding: 0 5px 0 5px;
}
#haxFooter > p {
    text-indent: 0;
    padding: 0;
}
#haxFooter > a {
    all: unset;
    cursor: pointer;
}
#haxFooter > a:hover {
    color: #008CBA;
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
.haxBlock:nth-last-child(1 of .haxBlock) {
    border-bottom: none;
    margin-bottom: 0;
}
.haxBlock::after {
    content: "";
    height: 7px;
    width: 100%;
}
.haxBlock:nth-last-child(1 of .haxBlock)::after {
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

.haxToggle {
    --color: #FF00FF;
    background: color-mix(in srgb, var(--color) 66%, transparent);
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
.haxToggle:hover {
    background: transparent;
    border: 1px solid var(--color);
    padding: 4px;
}
.haxToggle:active {
    background: var(--color);
}
.haxToggle:focus {
    outline: none;
}
`;
        
        return s;
    }
    function getSettingsBool(prop, fallback=false) {
        if(SETTINGS === null || !Object.hasOwn(SETTINGS, prop)) return Boolean(fallback);
        
        return Boolean(SETTINGS[prop]);
    }
    function setSettingsBool(prop, val) {
        if(SETTINGS === null) SETTINGS = {};
        
        SETTINGS[prop] = Boolean(val);
        window.localStorage.setItem("hax", JSON.stringify(SETTINGS));
    }
    
    /*ELEMENTS*/
    let clicks;
    {
        const ULTRACLK_AMT = 1e30;
        
        function ultraclkHandler(init=false) {
            if(ultraclkTgl.getState()) Game.registerHook("click", ultraclick);
            else if(!init) Game.removeHook("click", ultraclick);
        }
        function autoclkHandler(init=false) {
            if(autoclkTgl.getState()) {
                autoclkID = setInterval(() => {
                    Game.lastClick = 0;
                    Game.ClickCookie();
                }, 1);
            }
            else if(!init) clearInterval(autoclkID);
        }
        function ultraclick() {
            Game.cookies += ULTRACLK_AMT;
            Game.cookiesEarned += ULTRACLK_AMT;
        }
        
        let autoclkID = undefined;
        
        const ultraclkTgl = new HaxToggle("Ultraclick", `Makes clicks worth ${ULTRACLK_AMT.toExponential()} cookies`, () => {
            setSettingsBool("ultraclick", ultraclkTgl.getState());
            ultraclkHandler();
        }, getSettingsBool("ultraclick", false));
        const autoclkTgl = new HaxToggle("Autoclick", "Autoclicks the cookie", () => {
            setSettingsBool("autoclick", autoclkTgl.getState());
            autoclkHandler();
        }, getSettingsBool("autoclick", false));
        
        clicks = new HaxBlock([ultraclkTgl, autoclkTgl]);
        
        ultraclkHandler(true);
        autoclkHandler(true);
    }
    
    let resources;
    {
        const addCookiesBtn = new HaxButton("Add Cookies", "Adds x cookies", () => {
            const amt = addCookiesAmt.getInt();
            if(isNaN(amt)) return;
            
            Game.cookies += amt;
            Game.cookiesEarned += amt;
        });
        const addCookiesAmt = new HaxTextInput("integer", "#");
        const addLumpsBtn = new HaxButton("Add Sugar Lumps", "Adds x sugar lumps", () => {
            const amt = addLumpsAmt.getInt();
            if(isNaN(amt)) return;
            
            Game.lumps += amt;
            Game.lumpsTotal += amt;
        });
        const addLumpsAmt = new HaxTextInput("integer", "#");
        const addChipsBtn = new HaxButton("Add Heavenly Chips", "Adds x heavenly chips", () => {
            let val = addChipsAmt.getInt();
            if(isNaN(val)) return;
            
            Game.heavenlyChips += val;
        });
        const addChipsAmt = new HaxTextInput("integer", "#");
        
        resources = new HaxBlock([addCookiesBtn, addCookiesAmt, addLumpsBtn, addLumpsAmt, addChipsBtn, addChipsAmt]);
    }
    
    let buildings;
    {
        const addBuildingsBtn = new HaxButton("Add Buildings", "Adds x of y buildings", () => {
            const amt = addBuildingsAmt.getInt();
            if(isNaN(amt)) return;
            
            Game.Objects[addBuildingsDrp.getValue()].getFree(amt);
        });
        const addBuildingsDrp = new HaxDropdown(Object.keys(Game.Objects));
        const addBuildingsAmt = new HaxTextInput("integer", "#");
        
        buildings = new HaxBlock([addBuildingsBtn, addBuildingsDrp, addBuildingsAmt]);
    }
    
    let upgrades;
    {
        let autoupgdID = undefined;
        
        function autoupgdHandler(init=false) {
            if(autoupgdTgl.getState()) {
                autoupgdID = setInterval(() => {
                    Game.UpgradesInStore.forEach((u) => {
                        if(u.pool !== "toggle" && u.pool !== "debug" && u.name !== "One mind" && u.name !== "Communal brainsweep" && u.name !== "Elder Pact") u.earn();
                    });
                }, 100);
            }
            else if(!init) clearInterval(autoupgdID);
        }
        
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
        const autoupgdTgl = new HaxToggle("Auto Upgrade", "Automatically buys available upgrades for free", () => {
            setSettingsBool("autoUpgrade", autoupgdTgl.getState());
            autoupgdHandler();
        }, getSettingsBool("autoUpgrade", false));
        
        upgrades = new HaxBlock([unlockupgdBtn, unlockupgdDrp, unlockAllUpgdBtn, autoupgdTgl]);
        
        autoupgdHandler(true);
    }
    
    let achievements;
    {
        const cheatAchievs = ["Cheated cookies taste awful", "True Neverclick", "Speed baking I", "Speed baking II", "Speed baking III", "Getting even with the oven", "Now this is pod-smashing", "Chirped out", "Follow the white rabbit", "God complex", "Third-party"];
        const vanillaWin = function(what)
        {
            if (typeof what==='string')
            {
                if (Game.Achievements[what])
                {
                    var it=Game.Achievements[what];
                    if (it.won==0)
                    {
                        var name=it.shortName?it.shortName:it.dname;
                        it.won=1;
                        Game.Notify(loc("Achievement unlocked"),'<div class="title" style="font-size:18px;margin-top:-2px;">'+name+'</div>',it.icon);
                        Game.NotifyTooltip('function(){return Game.crateTooltip(Game.AchievementsById['+it.id+']);}');
                        if (Game.CountsAsAchievementOwned(it.pool)) Game.AchievementsOwned++;
                        Game.recalculateGains=1;
                        if (App && it.vanilla) App.gotAchiev(it.id);
                    }
                }
            }
            else {for (var i in what) {Game.Win(what[i]);}}
        };
        const moddedWin = (what) => {
            if(typeof what === "string") {
                if(Game.Achievements[what]) {
                    if(cheatAchievs.includes(what)) return;
                    
                    let a = Game.Achievements[what];
                    if(a.won === 0) {
                        let name = a.shortName ? a.shortName : a.dname;
                        a.won = 1;
                        
                        Game.Notify(loc("Achievement unlocked"), '<div class="title" style="font-size:18px;margin-top:-2px;">' + name + '</div>', a.icon);
                        Game.NotifyTooltip('function() {return Game.crateTooltip(Game.AchievementsById[' + a.id + ']);}');
                        if(Game.CountsAsAchievementOwned(a.pool)) Game.AchievementsOwned++;
                        Game.recalculateGains=1;
                        if(App && a.vanilla) App.gotAchiev(a.id);
                    }
                }
            }
        };
        
        function removeCheatingHandler(init=false) {
            if(removeCheatingTgl.getState()) {
                Game.Win = moddedWin;
                
                cheatAchievs.forEach((a) => {Game.RemoveAchiev(a);});
            }
            else if(!init) Game.Win = vanillaWin;
        }
        
        const unlockAchvmtBtn = new HaxButton("Unlock Achievement", "Unlocks x achievement", () => {
            Game.Win(unlockAchvmtDrp.getValue());
        });
        const unlockAchvmtDrp = new HaxDropdown(Object.keys(Game.Achievements));
        const unlockAllAchvmtBtn = new HaxButton("Unlock All Achievements", "Unlocks all non-shadow and non-dungeon achievements", () => {
            Object.keys(Game.Achievements).forEach((a) => {
                let achvmt = Game.Achievements[a];
                if(!cheatAchievs.includes(achvmt.name)) Game.Win(a);
            });
        });
        const removeCheatingTgl = new HaxToggle("Remove Cheat Achievements", "Removes achievements only attainable through cheating", () => {
            setSettingsBool("removeCheatAchievements", removeCheatingTgl.getState());
            removeCheatingHandler();
        }, getSettingsBool("removeCheatAchievements", true));
        
        achievements = new HaxBlock([unlockAchvmtBtn, unlockAchvmtDrp, unlockAllAchvmtBtn, removeCheatingTgl]);
        
        removeCheatingHandler(true);
    }
    
    let goldenCookies;
    {
        let goldFarmID = undefined;
        
        function goldFarmHandler(init=false) {
            if(goldFarmTgl.getState()) {
                goldFarmID = setInterval(() => {
                    Game.shimmers.forEach((s) => {
                        if(s.wrath === 0) s.pop();
                    });
                }, 100);
            }
            else if(!init) clearInterval(goldFarmID);
        }
        
        const spawnGoldenBtn = new HaxButton("Spawn Golden Cookie", "Spawns a golden cookie with x effect (Default is the normal game behaviour)", () => {
            let c = new Game.shimmer("golden");
            c.wrath = 0;
            if(spawnGoldenDrp.getValue() !== "default") c.force = spawnGoldenDrp.getValue();
        });
        const spawnGoldenDrp = new HaxDropdown([["default", "Default"], ["free sugar lump", "Sugar Lump"], ["frenzy", "Frenzy"], ["dragon harvest", "Dragon Harvest"], ["everything must go", "Everything Must Go"], ["multiply cookies", "Multiply Cookies"], ["ruin cookies", "Ruin Cookies"], ["blood frenzy", "Blood Frenzy"], ["clot", "Clot"], ["cursed finger", "Cursed Finger"], ["click frenzy", "Click Frenzy"], ["dragonflight", "Dragon Flight"], ["chain cookies", "Chain Cookie"], ["cookie storm", "Cookie Storm"], ["cookie storm drop", "Cookie Storm Drop"], ["blab", "Blab (Doesn't have any effects, extremely rare in normal behaviour)"]]);
        const goldFarmTgl = new HaxToggle("Farm Golden Cookies", "Automatically clicks on golden cookies", () => {
            setSettingsBool("farmGoldenCookies", goldFarmTgl.getState());
            goldFarmHandler();
        }, getSettingsBool("farmGoldenCookies", false));
        
        goldenCookies = new HaxBlock([spawnGoldenBtn, spawnGoldenDrp, goldFarmTgl]);
        
        goldFarmHandler(true);
    }
    
    let wrinklers;
    {
        let farmWrinklersID = undefined;
        
        function farmWrinklersHandler(init=false) {
            if(farmWrinklersTgl.getState()) {
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
            else if(!init) clearInterval(farmWrinklersID);
        }
        
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
        const farmWrinklersTgl = new HaxToggle("Farm Wrinklers", "Automatically pops winklers after they have been feeding for 10 minutes", () => {
            setSettingsBool("farmWrinklers", farmWrinklersTgl.getState());
            farmWrinklersHandler();
        }, getSettingsBool("farmWrinklers", false));
        
        wrinklers = new HaxBlock([spawnWrinklerBtn, spawnShinyWrinklerBtn, farmWrinklersTgl]);
        
        farmWrinklersHandler();
    }
    
    let buffs;
    {
        const addBuffBtn = new HaxButton("Add Buff", "Adds x buff for y seconds with power z and optional building w\n\nfrenzy, blood frenzy, clot, dragon harvest, sugar frenzy, loan 1, loan 1 interest, loan 2, loan 2 interest, loan 3, loan 3 interest - multiplies CpS by {power}\neverything must go - makes all buildings 5% cheaper, {power} has no effect\npixie luck - makes all buildings 2% cheaper, {power} has no effect\ncursed finger - stops all building production and makes each click worth {power}\nclick frenzy, dragonflight - mutliplies click power by {power}\ncookie storm - spawns a bunch of golden cookies, {power} has no effect\nbuilding buff - multiplies CpS by {power} * number of {building}%\nbuilding debuff - multiplies CpS by 1 / ({power} * number of {building})%\nsugar blessing - makes golden cookies 10% more likely to spawn\nhaggler luck - makes upgrades {power}% cheaper\nhaggler misery - makes upgrades {power}% more expensive\npixie misery - makes all buildings {power}% more expensive\nmagic adept - spells backfire {power} times less\nmagic inept - spells backfire {power} times more\ndevastation - adds {power}% to clicking power\ngifted out - can't send or receive gifts, {power} has no effect", () => {
            let type = addBuffType.getValue();
            let time = addBuffTime.getFloat();
            let dat1 = addBuffDat1.getFloat();
            let dat2 = Game.Objects[addBuffDat2.getValue()].id;
            
            if(type !== "cookie storm" && type !== "gifted out" && type !== "everything must go" && type !== "pixie luck" && isNaN(dat1)) return;
            if(isNaN(time) || dat2 === undefined) return;
            
            Game.gainBuff(type, time, dat1, dat2);
        });
        const addBuffType = new HaxDropdown(Object.keys(Game.buffTypesByName));
        const addBuffTime = new HaxTextInput("float", "Duration (sec)");
        const addBuffDat1 = new HaxTextInput("float", "Power");
        const addBuffDat2 = new HaxDropdown(Object.keys(Game.Objects), "Building (only used for some buffs)");
        const clearBuffsBtn = new HaxButton("Clear Buffs", "Removes all active buffs", () => {
            Game.killBuffs();
        });
        
        buffs = new HaxBlock([addBuffBtn, addBuffType, addBuffTime, addBuffDat1, addBuffDat2, clearBuffsBtn]);
    }
    
    let misc;
    {
        function partyHandler(init=false) {
            if(init) {
                /*party mode override*/
                Game.registerHook("draw", () => {
                    if(Game.PARTY) {
                        let pulse = Math.pow((Game.T % 10) / 10, 0.5);
                        let strength = Game.PARTYstrength ? Game.PARTYstrength : 1;
                        
                        let hue = (Game.T * 5) % 360;
                        let brightness = 200 - 100 * pulse;
                        let grayscale = 100 * pulse;
                        let scale = (1 + 0.02 * strength) - 0.02 * strength * pulse;
                        let rotate = Math.sin(Game.T * 0.5) * 0.5 * strength;
                        
                        Game.l.style.filter = Game.l.style.webkitFilter = `hue-rotate(${hue}deg) brightness(${brightness}%) grayscale(${grayscale}%)`;
                        Game.l.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
                    }
                });
                
                Game.wrapper.style.overflowX = "hidden";
                Game.wrapper.style.overflowY = "hidden";
                document.getElementById("topBar").style.zIndex = "1";
            }
            
            Game.PARTY = partyTgl.getState();
            
            if(!partyTgl.getState() && !init) {
                Game.l.style.filter = "none";
                Game.l.style.webkitFilter = "none";
                Game.l.style.transform = "none";
            }
        }
        
        const partyTgl = new HaxToggle("PARTY", "Toggles party mode", () => {
            setSettingsBool("party", partyTgl.getState());
            partyHandler();
        }, getSettingsBool("party", false));
        const partyStrength = new HaxTextInput("float", "Strength", undefined, () => {
            Game.PARTYstrength = partyStrength.getFloat();
            if(isNaN(Game.PARTYstrength)) Game.PARTYstrength = 1;
        });
        
        misc = new HaxBlock([partyTgl, partyStrength]);
        
        partyHandler(true);
    }
    
    /*INJECTION*/
    const style = genStyle();
    document.head.appendChild(style);
    
    const panel = genPanel([clicks, resources, buildings, upgrades, achievements, goldenCookies, wrinklers, buffs, misc]);
    document.body.appendChild(panel);
    
    Game.Notify("Loaded Hax", "", 0, 3);
    window.HAX_LOADED = true;
}

if(window.HAX_LOADED !== true) cchax();
else Game.Notify("Hax already loaded", "", 0, 3);
