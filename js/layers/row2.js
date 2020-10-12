
// ----- Second row -----
addLayer("wf", {
	startData() {
		return {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			total: new Decimal(0),
			workUndone: new Decimal(0),
			workDone: new Decimal(0),
			workUndoneEffect: new Decimal(0),
			workDoneEffect: new Decimal(0),
			workUndonePerSec: new Decimal(0),
			workDonePerSec: new Decimal(0),
		}
	},

	layerShown() { return hasMilestone("w", 3) || player[this.layer].unl || player.m.unl },

	color: () => "#555555",
	resource: "workfinders",
	row: 1,

	baseResource: "coins",
	baseAmount() { return player["c"].points },
	branches: [["c", 1]],

	requires: () => new Decimal(1e20),

	type: "static",
	base: 5000,
	exponent: 0.6,
	canBuyMax: () => (player["w"].upgrades.includes(23) || hasMilestone("m", 0)),
	resetsNothing: () => (hasMilestone("m", 0) && hasMilestone("w", 6)),

	gainMult() {
		return new Decimal(1)
	},
	gainExp() {
		return new Decimal(1)
	},

	buyables: {
		rows: 2,
		cols: 3,
		11: {
			title: () => "Increase workers' strength",
			cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(10, x).mul(1000)
				return cost.floor()
			},
			effect(x) { // Effects of owning x of the items, x is a decimal
				if (!tmp.buyables[this.layer][12]) return Decimal.pow(1.35, x)

				let eff = new Decimal(1)
				if (tmp.buyables[this.layer][12].effect.add)
					eff = Decimal.pow(tmp.buyables[this.layer][12].effect.add(1.35), x)
				if (tmp.buyables[this.layer][13])
					eff = eff.pow(tmp.buyables[this.layer][13].effect)

				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " finished work\n\
				Increases work finishing speed by ×" + format(tmp.buyables[this.layer][12].effect.add ? tmp.buyables[this.layer][12].effect.add(1.35) : 1.35) + " per level.\n\
				Currently: ×" + format(data.effect)
			},
			unl() { return player[this.layer].unl },
			canAfford() {
				return player[this.layer].workDone.gte && player[this.layer].workDone.gte(tmp.buyables[this.layer][this.id].cost)
			},
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost
				player[this.layer].workDone = player[this.layer].workDone.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
		12: {
			title: () => "Increase workers' dexterity",
			cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(10, x).mul(2000)
				return cost.floor()
			},
			effect(x) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(0.01)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " finished work\n\
				Increases the previous increase upgrade by +0.01 per level per level.\n\
				Currently: +" + format(data.effect)
			},
			unl() { return player[this.layer].unl },
			canAfford() {
				return player[this.layer].workDone.gte && player[this.layer].workDone.gte(tmp.buyables[this.layer][this.id].cost)
			},
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost
				player[this.layer].workDone = player[this.layer].workDone.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
		13: {
			title: () => "Increase workers' collaborativeness",
			cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(20, x).mul(5000)
				return cost.floor()
			},
			effect(x) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(0.01).add(1)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " finished work\n\
				Increases the first upgrade's effect by ^+0.01 per level. Levels on this upgrade stack additively.\n\
				Currently: ^" + format(data.effect)
			},
			unl() { return player[this.layer].unl },
			canAfford() {
				return player[this.layer].workDone.gte && player[this.layer].workDone.gte(tmp.buyables[this.layer][this.id].cost)
			},
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost
				player[this.layer].workDone = player[this.layer].workDone.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
		21: {
			title: () => "Promote workfinders to part-time workers",
			cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(x.add(1), 1.5).mul(6)
				return cost.floor()
			},
			effect(x) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(10).cbrt()
				if (hasMilestone("m", 0) && hasMilestone("w", 3)) eff = eff.mul(5)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " workfinders\n\
				Workfinders also finish works at reduced workers' capacity.\n\
				Currently: " + format(data.effect) + "%"
			},
			unl() { return player[this.layer].unl },
			canAfford() {
				return player[this.layer].points.gte(tmp.buyables[this.layer][this.id].cost)
			},
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost
				player[this.layer].points = player[this.layer].points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
		22: {
			title: () => "Increase work quality",
			cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(1e6, x).mul(1e29)
				return cost.floor()
			},
			effect(x) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(0.4).add(1).cbrt()
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " coins\n\
				Boosts the finished work's effect.\n\
				Currently: ^" + format(data.effect)
			},
			unl() { return player[this.layer].unl },
			canAfford() {
				return player.c.points.gte(tmp.buyables[this.layer][this.id].cost)
			},
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost
				player.c.points = player.c.points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
		23: {
			title: () => "Increase work planning skills",
			cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(1e10, x).mul(1e40)
				return cost.floor()
			},
			effect(x) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(0.02).add(1).recip()
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " coins\n\
				Reduces the unfinished work penalty.\n\
				Currently: ^" + format(data.effect, 3)
			},
			unl() { return player[this.layer].unl },
			canAfford() {
				return player.c.points.gte(tmp.buyables[this.layer][this.id].cost)
			},
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost
				player.c.points = player.c.points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
	},

	upgrades: {
		rows: 2,
		cols: 5,
		11: {
			desc: () => "Unlock a new row of coin upgrades because why not?",
			cost: () => new Decimal(5),
			unl() { return player[this.layer].unl },
		},
		12: {
			desc: () => "Finish work faster based on unfinished work count.",
			cost: () => new Decimal(17),
			unl() { return hasUpg("wf", 11) },
			effect() {
				let ret = new Decimal(1).add(player.wf.workUndone).max(1).log(100).add(1)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		13: {
			desc: () => "Finish work faster based on finshed work's effect.",
			cost: () => new Decimal(22),
			unl() { return hasUpg("wf", 12) },
			effect() {
				let ret = Decimal.log(new Decimal(1).add(player.wf.workDoneEffect).max(1), 10).add(1)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		14: {
			desc: () => "Find work faster based on finshed work count.",
			cost: () => new Decimal(26),
			unl() { return hasUpg("wf", 13) },
			effect() {
				let ret = new Decimal(1).add(player.wf.workDone).max(1).log(100).add(1).cbrt()
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		15: {
			desc: () => "Find work faster based on current workfinder count.",
			cost: () => new Decimal(29),
			unl() { return hasUpg("wf", 14) },
			effect() {
				let ret = player.wf.points.add(1).pow(0.2)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		21: {
			desc: () => "Multiplier to finished work's effect based on unfinished work's effect.",
			cost: () => new Decimal(80),
			unl() { return hasUpg("wf", 15) },
			effect() {
				let ret = Decimal.pow(player.wf.workUndoneEffect, 3).add(1)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		22: {
			desc: () => "Power to unfinished work's effect based on finished work's effect.",
			cost: () => new Decimal(234),
			unl() { return hasUpg("wf", 21) },
			effect() {
				let ret = Decimal.add(player.wf.workDoneEffect, 1).log(1e12).add(1).recip()
				return ret;
			},
			effectDisplay(fx) { return "^" + format(fx, 3) },
		},
		23: {
			desc: () => "Finish work 10 times faster. Are you happy now?",
			cost: () => new Decimal(242),
			unl() { return hasUpg("wf", 22) },
		},
		24: {
			desc: () => "Find work 5 times faster. With yin there are yang.",
			cost: () => new Decimal(252),
			unl() { return hasUpg("wf", 22) },
		},
		25: {
			desc: () => hasMilestone("m", 0) ? "Find work 3 more times faster." : "Guys this is it. A new prestige layer.",
			cost: () => new Decimal(666),
			unl() { return hasUpg("wf", 24) },
		},
	},

	microtabs: {
        stuff: {
            rebuyables: { title: () => "Rebuyables", content: ["buyables", ["blank", "5px"]] },
			upgrades: { title: () => "Upgrades", content: ["upgrades"] },
        },
	},

	tabFormat:
		["main-display",
			["prestige-button", function () { return "Hire " }],
			["blank", "5px"],
			["display-text",
				function () { return "You have at best " + format(player.wf.best, 0) + " workfinders." }],
			["display-text",
				function () {
					return player.wf.best >= 100 ? "\
				Workfinders' efficiency starts dropping at 100 workfinders, then it drops faster at 40,000 and 16,000,000 workfinders. Currently: " + format(awf.max(100).log10().div(player.wf.points.max(100).log10()).min(1).mul(100), 3) + "%" : ""
				}],
			["blank", "5px"],
			["display-text",
				function () { return "You have " + format(player.wf.workDone, 0) + " finished work, which are increasing the effects of the first two rows of your coin layer's boost upgrades by ×" + format(player.wf.workDoneEffect, 3) + "." }],
			["display-text",
				function () { return "You have " + format(player.wf.workUndone, 0) + " unfinished work, which are raising the finished work's effect to the power of ^" + format(player.wf.workUndoneEffect, 5).replace(",", "") + "." }],
			["blank", "5px"],
			["display-text",
				function () { return "Your workfinders are finding " + format(player.wf.workUndonePerSec) + " unfinished work and your workers are finishing " + format(player.wf.workDonePerSec) + " work per second. (" + format(player.wf.workUndonePerSec.sub(player.wf.workDonePerSec)) + " actual unfinished work and " + format(Decimal.min(player.wf.workUndonePerSec, player.wf.workDonePerSec)) + " actual finished work per second)" }],
			["blank", "5px"],
			["microtabs", "stuff"], "milestones"],

	update(diff) {
		awf = player.wf.points;
		if (awf >= 16000000) awf = awf.pow(0.5).mul(4000)
		if (awf >= 40000) awf = awf.pow(0.5).mul(200)
		if (awf >= 100) awf = awf.pow(0.5).mul(10)

		let wups = awf.pow(1.25)
		if (hasUpg("wf", 14)) wups = wups.mul(layers.wf.upgrades[14].effect())
		if (hasUpg("wf", 15)) wups = wups.mul(layers.wf.upgrades[15].effect())
		if (hasUpg("wf", 24)) wups = wups.mul(5)
		if (hasMilestone("m", 0) && hasUpg("wf", 25)) wups = wups.mul(3)
		if (hasUpg("w", 22)) wups = wups.mul(layers.w.upgrades[22].effect())
		if (hasUpg("w", 24)) wups = wups.mul(layers.w.upgrades[24].effect())
		if (hasMilestone("m", 0) && hasUpg("wf", 23)) wups = wups.mul(2)
		if (tmp.buyables.bd[11].effect) wups = wups.mul(tmp.buyables.bd[11].effect)
		player[this.layer].workUndonePerSec = wups

		let wdps = player.w.points.add(awf.mul(tmp.buyables[this.layer][21].effect.div(100))).pow(1.25).mul(tmp.buyables[this.layer][11].effect)
		if (hasUpg("wf", 12)) wdps = wdps.mul(layers.wf.upgrades[12].effect())
		if (hasUpg("wf", 13)) wdps = wdps.mul(layers.wf.upgrades[13].effect())
		if (hasUpg("wf", 23)) wdps = wdps.mul(10)
		if (hasUpg("w", 22)) wdps = wdps.mul(layers.w.upgrades[22].effect())
		if (hasUpg("w", 24)) wdps = wdps.mul(layers.w.upgrades[24].effect())
		if (hasMilestone("m", 0) && hasUpg("wf", 23)) wdps = wdps.mul(2)
		if (tmp.buyables.bd[11].effect) wdps = wdps.mul(tmp.buyables.bd[11].effect)
		if (player.b.banking == 15) wdps = player.points.pow(0.2).sub(1)
		player[this.layer].workDonePerSec = wdps

		if (!player[this.layer].workUndone.add) player[this.layer].workUndone = new Decimal(player[this.layer].workUndone)
		if (!player[this.layer].workDone.add) player[this.layer].workDone = new Decimal(player[this.layer].workDone)
		let dwd = wdps.times(diff).min(player.wf.workUndone)
		let wd = player[this.layer].workDone = player[this.layer].workDone.add(dwd).max(0)
		let wu = player[this.layer].workUndone = player[this.layer].workUndone.add(wups.times(diff)).max(0)
		wu = player[this.layer].workUndone = player[this.layer].workUndone.sub(dwd).max(0)

		let wue = wu.add(1).log(1e10).add(1).cbrt().recip().pow(tmp.buyables[this.layer][23].effect)
		if (hasUpg("wf", 22)) wue = wue.pow(layers.wf.upgrades[22].effect())
		player[this.layer].workUndoneEffect = wue

		let wde = wd.add(1).pow(0.1).pow(tmp.buyables[this.layer][22].effect).pow(wue)
		if (hasUpg("wf", 21)) wde = wde.mul(layers.wf.upgrades[21].effect())
		if (player.b.banking & 1) wde = wde.pow(0.5)
		player[this.layer].workDoneEffect = wde
	},
	automate() {
		if (player["w"].autoFinderUpgrade) {
			let penalty = player["w"].points.add(1).mul(600).pow(1.25)
			for (let x = 10; x <= 20; x += 10) for (let y = 1; y <= 3; y++) {
				var z = x + y
				if (tmp.buyables.wf[z].unl && tmp.buyables.wf[z].canAfford) {
					buyBuyable("wf", z)
					player.wf.workUndone = player.wf.workUndone.add(penalty)
				}
			}
		}
		
		if (player["m"].autoWorkfinderReset) doReset("wf")
	},

	hotkeys: [
		{ key: "f", desc: "F: Hire workfinders", onPress() { if (player[this.layer].unl) doReset(this.layer) } },
	],
})
addLayer("b", {
	startData() {
		return {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			total: new Decimal(0),
			banking: 0,
			bankTime: new Decimal(0),
		}
	},

	layerShown() { return hasMilestone("w", 6) || player[this.layer].unl || player.m.unl },

	color: () => "#00FF00",
	resource: "banks",
	row: 1,

	baseResource: "points",
	baseAmount() { return player.points },

	requires: () => new Decimal(5e83),

	type: "static",
	base: 50000,
	exponent: 1.25,
	canBuyMax: () => player["w"].best.gte(12) || hasMilestone("m", 0),

	effect() {
		var eff = Decimal.pow(16, player.b.points)
		if (player.b.banking & 1) eff = eff.pow(0.5)
		return eff
	},
	effectDescription() {
		eff = tmp.layerEffs.b;
		return "which are boosting your coin gains by ×" + format(eff)
	},

	gainMult() {
		return new Decimal(1)
	},
	gainExp() {
		return new Decimal(1)
	},

	buyables: {
		rows: 2,
		cols: 3,
		11: {
			title: () => "Coin Banking",
			cost(x) {
				return new Decimal(0)
			},
			effect(x) {
				var eff = player[this.layer].buyables[this.id].add(1).pow(0.35)
				if (eff.gte(1e9)) eff = eff.mul(1e9).sqrt()
				if (tmp.buyables.b[21]) eff = eff.mul(tmp.buyables.b[21].effect)
				if (tmp.buyables.b[22]) eff = eff.mul(tmp.buyables.b[22].effect)
				if (tmp.buyables.b[23]) eff = eff.mul(tmp.buyables.b[23].effect)
				if (hasMilestone("m", 0) && hasMilestone("w", 9)) eff = eff.mul(25)
				if (hasUpg("w", 25)) eff = eff.pow(layers.w.upgrades[25].effect())
				if (eff.gte(1e45)) eff = eff.mul(1e45).sqrt()
				return eff
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " banked coins, which are boosting the point generation speed by ×" + format(data.effect) + ".\n\n\
						Banking is currently " + (player.b.banking == 1 ? "enabled.\n\
						Click here to disable banking and gain " + format(player.c.points.sub(player.b.buyables[11]).max(0), 0) + " banked coins." : "disabled.\n\
						Click here to enable banking, which will square root all of your point generation speed, coin gains, workers' effect, finished works' effects, banks' effects and your “all previous boost upgrades” upgrades' effects.")
					: (player.b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 2 banks before you can use this function.")
			},
			unl() { return true },
			canAfford() { return player[this.layer].best.gte(2) && (player.b.banking == 0 || player.b.banking == 1) },
			buy() {
				if (player.b.banking == 1) player.b.buyables[11] = player.b.buyables[11].max(player.c.points)
				player.b.banking = player.b.banking == 1 ? 0 : 1
				doReset(this.layer, true)
			},
		},
		12: {
			title: () => "Point Banking",
			cost(x) {
				return new Decimal(0)
			},
			effect(x) {
				var eff = player[this.layer].buyables[this.id].add(1).pow(0.6)
				if (eff.gte(1e9)) eff = eff.mul(1e9).sqrt()
				if (tmp.buyables.b[21]) eff = eff.mul(tmp.buyables.b[21].effect)
				if (tmp.buyables.b[22]) eff = eff.mul(tmp.buyables.b[22].effect)
				if (tmp.buyables.b[23]) eff = eff.mul(tmp.buyables.b[23].effect)
				if (hasMilestone("m", 0) && hasMilestone("w", 9)) eff = eff.mul(25)
				if (hasUpg("w", 25)) eff = eff.pow(layers.w.upgrades[25].effect())
				if (eff.gte(1e45)) eff = eff.mul(1e45).sqrt()
				return eff
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " banked points, which are boosting the point generation speed by ×" + format(data.effect) + ".\n\n\
						Banking is currently " + (player.b.banking == 2 ? "enabled.\n\
						Click here to disable banking and gain " + format(player.points.sub(player.b.buyables[12]).max(0), 0) + " banked points." : "disabled.\n\
						Click here to enable banking, which will cube root your point generation speed and lock you out so you can only be able to access the first two coin upgrades.")
					: (player.b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 4 banks before you can use this function.")
			},
			unl() { return true },
			canAfford() { return player[this.layer].best.gte(4) && (player.b.banking == 0 || player.b.banking == 2) },
			buy() {
				if (player.b.banking == 2) player.b.buyables[12] = player.b.buyables[12].max(player.points)
				player.b.banking = player.b.banking == 2 ? 0 : 2
				doReset(this.layer, true)
			},
		},
		13: {
			title: () => "Time Banking",
			cost(x) {
				return new Decimal(0)
			},
			effect(x) {
				var eff = player[this.layer].buyables[this.id].mul(2).add(1).pow(0.9)
				if (eff.gte(100000)) eff = eff.mul(100000).sqrt()
				if (tmp.buyables.b[21]) eff = eff.mul(tmp.buyables.b[21].effect)
				if (tmp.buyables.b[22]) eff = eff.mul(tmp.buyables.b[22].effect)
				if (tmp.buyables.b[23]) eff = eff.mul(tmp.buyables.b[23].effect)
				if (hasMilestone("m", 0) && hasMilestone("w", 9)) eff = eff.mul(25)
				if (hasUpg("w", 25)) eff = eff.pow(layers.w.upgrades[25].effect())
				if (eff.gte(1e45)) eff = eff.mul(1e45).sqrt()
				return eff
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " banked time, which are boosting the point generation speed by ×" + format(data.effect) + ".\n\n\
						Banking is currently " + (player.b.banking == 3 ? "enabled.\n\
						Click here to disable banking and gain " + format(Decimal.sub(tmp.pointGen, player.b.buyables[13]).max(0), 0) + " banked time." : "disabled.\n\
						Click here to enable banking, which will activate all of the previous banking debuffs at once. The thing you are banking here is your points generated per second.")
					: (player.b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 6 banks before you can use this function.")
			},
			unl() { return true },
			canAfford() { return player[this.layer].best.gte(6) && (player.b.banking == 0 || player.b.banking == 3) },
			buy() {
				if (player.b.banking == 3) player.b.buyables[13] = player.b.buyables[13].max(tmp.pointGen)
				player.b.banking = player.b.banking == 3 ? 0 : 3
				doReset(this.layer, true)
			},
		},
		21: {
			title: () => "Metacoin Banking",
			cost(x) {
				return new Decimal(0)
			},
			effect(x) {
				var eff = player[this.layer].buyables[this.id].mul(2.5).add(1).pow(0.4)
				if (tmp.buyables.b[22]) eff = eff.mul(tmp.buyables.b[22].effect)
				if (tmp.buyables.b[23]) eff = eff.mul(tmp.buyables.b[23].effect)
				if (eff.gte(1e15)) eff = eff.mul(1e15).sqrt()
				return eff
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " banked metacoins, which are boosting all previous bankings' buffs by ×" + format(data.effect) + ".\n\n\
						Banking is currently " + (player.b.banking == 4 ? "enabled.\n\
						Click here to disable banking and gain " + format(Decimal.sub(tmp.resetGain ? tmp.resetGain["c"] : 0, player.b.buyables[21]).max(0), 0) + " banked metacoins." : "disabled.\n\
						Click here to enable banking, which will tenth root your point generation and coin gains. The thing you are banking here is your coins gain on coin reset.")
					: (player.b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 12 banks before you can use this function.")
			},
			unl() { return hasMilestone("w", 10) },
			canAfford() { return player[this.layer].best.gte(12) && (player.b.banking == 0 || player.b.banking == 4) },
			buy() {
				if (player.b.banking == 4) player.b.buyables[21] = player.b.buyables[21].max(tmp.resetGain["c"])
				player.b.banking = player.b.banking == 4 ? 0 : 4
				doReset(this.layer, true)
			},
		},
		22: {
			title: () => "Metapoint Banking",
			cost(x) {
				return new Decimal(0)
			},
			effect(x) {
				var eff = player[this.layer].buyables[this.id].mul(2.5).add(1).pow(0.5)
				if (tmp.buyables.b[23]) eff = eff.mul(tmp.buyables.b[23].effect)
				if (eff.gte(1e15)) eff = eff.mul(1e15).sqrt()
				return eff
			},
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " banked metapoints, which are boosting all previous bankings' buffs by ×" + format(data.effect) + ".\n\n\
						Banking is currently " + (player.b.banking == 8 ? "enabled.\n\
						Click here to disable banking and gain " + format(Decimal.sub(tmp.pointGen, player.b.buyables[22]).max(0), 0) + " banked metapoints." : "disabled.\n\
						Click here to enable banking, which will override the point generation speed and make it stronger based on your current coin count ((coins^0.1)-1). You also bank point generated per second on this one.")
					: (player.b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 15 banks before you can use this function.")
			},
			unl() { return hasMilestone("w", 10) },
			canAfford() { return player[this.layer].best.gte(15) && (player.b.banking == 0 || player.b.banking == 8) },
			buy() {
				if (player.b.banking == 8) player.b.buyables[22] = player.b.buyables[22].max(tmp.pointGen)
				player.b.banking = player.b.banking == 8 ? 0 : 8
				doReset(this.layer, true)
			},
		},
		23: {
			title: () => "Work Banking",
			cost(x) {
				return new Decimal(0)
			},
			effect(x) {
				var eff = player[this.layer].buyables[this.id].mul(2.5).add(1).pow(0.6)
				if (eff.gte(1e15)) eff = eff.mul(1e15).sqrt()
				return eff
			},
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " banked work, which are which are boosting all previous bankings' buffs by ×" + format(data.effect) + ".\n\n\
						Banking is currently " + (player.b.banking == 15 ? "enabled.\n\
						Click here to disable banking and gain " + format(Decimal.sub(player.wf.workDone, player.b.buyables[23]).max(0), 0) + " banked work." : "disabled.\n\
						Click here to enable banking, which will activate all the previous bankings' debuffs at once. Your current finished and unfinished work are also resetted, and the finished work's speed is overriden and depends on your current point count ((points^0.2)-1). The thing you're banking here is your current finished work count.")
					: (player.b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 19 banks before you can use this function.")
			},
			unl() { return hasMilestone("w", 10) },
			canAfford() { return player[this.layer].best.gte(19) && (player.b.banking == 0 || player.b.banking == 15) },
			buy() {
				if (player.b.banking == 15) player.b.buyables[23] = player.b.buyables[23].max(player.wf.workDone)
				player.b.banking = player.b.banking == 15 ? 0 : 15
				player.wf.workDone = new Decimal(0)
				player.wf.workUndone = new Decimal(0)
				doReset(this.layer, true)
			},
		},
	},

	update(diff) {
		if (player.b.banking == 0) player.b.bankTime = new Decimal(0)
		else player.b.bankTime = Decimal.add(player.b.bankTime, diff)
	},

	tabFormat:
		["main-display",
			["prestige-button", function () { return "Build " }],
			["blank", "5px"],
			["display-text",
				function () { return "You have at best " + format(player.b.best, 0) + " " + " banks." }],
			["display-text",
				function () { return player.b.banking > 0 ? ("You have been banking for " + formatTime(player.b.bankTime.toNumber()) + ".") : "" }],
			["blank", "5px"],
			["display-text",
				function () { return "<h3>Bankings</h3><br/><h5>Note: Enabling/Disabling bankings will force a bank reset.</h5>" }],
			"buyables", ["blank", "5px"]
			, "milestones", "upgrades"],

	hotkeys: [
		{ key: "b", desc: "B: Build banks", onPress() { if (player[this.layer].unl) doReset(this.layer) } },
	],

})

addLayer("sp", {
	startData() {
		return {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			total: new Decimal(0),
			magic: new Decimal(0),
		}
	},

	layerShown() { return player.bd.buyables[13].gte(1) },

	color: () => "#FF00FF",
	resource: "spiritual power",
	row: 1,

	baseResource: "points",
	baseAmount() { return player.points },

	requires: () => new Decimal("1e540"),

	type: "normal",
	exponent: 0.02,

	effect() {
		var eff = Decimal.pow(player.sp.points, 0.1).add(1)
		return eff
	},
	effectDescription() {
		eff = tmp.layerEffs.sp;
		return "which are boosting your point gains by ×" + format(eff)
	},

	gainMult() {
		return new Decimal(1)
	},
	gainExp() {
		return new Decimal(1)
	},
	
	buyables: {
		rows: 2,
		cols: 1,
		11: {
			title: () => "Convert spiritual power into castable magic fountain",
			cost(x) {
				let cost = Decimal.pow(2500, Decimal.pow(2, x))
				return cost.floor()
			},
			effect(x) { 
				return x.pow(2)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " spiritual power\n\
				Generates " + format(data.effect) + " magic every second."
			},
			unl() { return true },
			canAfford() {
				return player.sp.points.gte(tmp.buyables[this.layer][this.id].cost)
			},
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost
				player.sp.points = player.sp.points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			style() {
				return {
					"height": "200px"
				}
			}
		},
		21: {
			title: () => "Spell of Generation",
			cost(x) {
				return new Decimal(75)
			},
			effect(x) { 
				return Decimal.pow(player.bd.buyables[13].mul(9).add(1), 3)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return (player.sp.buyables[21].lte(0) ? "Duration on cast: " + formatTime(30) : "Time left: " + formatTime(player.sp.buyables[21])) + "\n\
				Casting cost: " + format(data.cost) + " magic\n\
				Point generation is " + format(data.effect) + "× stronger (based on your shrines)."
			},
			unl() { return true },
			canAfford() {
				return Decimal.gte(player.sp.magic, tmp.buyables[this.layer][this.id].cost) && player.sp.buyables[21].lte(0)
			},
			buy() {
				player.sp.magic = Decimal.sub(player.sp.magic, tmp.buyables[this.layer][this.id].cost)
				player[this.layer].buyables[this.id] = new Decimal(30)
			},
			style() {
				if (player.sp.buyables[21].lte(0)) {
					return {
						"height": "200px",
					}
				} else {
					return {
						"height": "200px",
						"color": "#FFAAFF",
						"background-color": "#330033"
					}
				}
			}
		},
	},
	
	
	update(diff) {
		player.sp.magic = Decimal.add(player.sp.magic, tmp.buyables.sp[11].effect.mul(diff))
		for (var a = 21; a <= 21; a++) {
			player.sp.buyables[a] = Decimal.sub(player.sp.buyables[a], diff).max(0)
		}
	},
	
	microtabs: {
        stuff: {
            buyables: { title: () => "Rebuyables", content: [
				["blank", "5px"],
				["row", [["buyable", "11"]]],
				["blank", "5px"],
			] },
            spells: { title: () => "Spells", content: [
				["blank", "5px"],
				["display-text", () => 
					"You have " + format(player ? player.sp.magic : "0") + " magic."
				],
				["blank", "5px"],
				["row", [["buyable", "21"]]],
				["blank", "5px"],
			] },
        },
	},
	
	tabFormat:
		["main-display",
			["prestige-button", function () { return "Reset for " }],
			["blank", "5px"],
			["display-text",
				function () { return "You have at best " + format(player.sp.best, 0) + " " + " spiritual power." }],
			["blank", "5px"],
			["microtabs", "stuff"]],

	hotkeys: [
		{ key: "s", desc: "S: Reset for spiritual power", onPress() { if (player[this.layer].unl) doReset(this.layer) } },
	],

})