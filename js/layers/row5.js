
// ----- Fifth row -----
addLayer("s", {
	startData() {
		return {
			unl: true,
			points: new Decimal(0),
			best: new Decimal(0),
			total: new Decimal(0),
			autoWorkerReset: false,
			autoWorkfinderReset: false,
			allocated: 0,
			landsAvailable: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			landsAllocated: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		}
	},

	layerShown() { return hasMilestone("t", 6) || player.s.total.gte(1)},

	name: "singularity",
	color: () => "#000000",
	resource: "singularity points",
	row: 5,

	baseResource: "points",
	baseAmount() { return player.points },
	branches: [["c", 1]],

	requires: () => Decimal.pow(2, 262144),

	type: "normal",
	exponent: 0.00005,
	canBuyMax: () => false,
	
	gainMult() {
		return new Decimal(1)
	},
	gainExp() {
		return new Decimal(1)
	},
	
	upgrades: {
		rows: 1,
		cols: 1,
		11: {
			desc: () => "Unlock Constellations.",
			cost: () => new Decimal(10000),
			currencyLayer: "c",
			currencyInternalName: "points",
			currencyDisplayName: "coins",
			unl() { return player[this.layer].unl && !hasUpg("s", 11) },
			style() {
				let data = tmp.buyables[this.layer][this.id]
				return {
					"text-shadow": data.canAfford ? "white 0px 0px 5px" : "",
				}
			}
		},
	},
	
	buyables: {
		rows: 1,
		cols: 1,
		11: {
			cost(x) { return new Decimal("0") },
			effect(x) { return new Decimal("0") },
			display() { return `<span v-if="player[layer].points.lt(1e3)">Gain </span>+<b>` + formatWhole(tmp.resetGain.s) + `</b> singularity points<span v-if="tmp.resetGain[layer].lt(100) && player[layer].points.lt(1e3)"><br><br>Next at ` + format(tmp.nextAt[layer]) + ` points</span>` },
			unl() { return player.points.gte(tmp.layerReqs.s) || player.s.points.gt(0) },
			canAfford() { return player.points.gte(tmp.layerReqs.s) },
			buy() { 
				doReset("s")
			},
			style() {
				let data = tmp.buyables[this.layer][this.id]
				return {
					"height": "120px",
					"width": "180px",
					"text-shadow": data.canAfford ? "white 0px 0px 5px" : "",
					"border": "4px solid",
					"border-color": "rgba(255, 255, 255, 0.125) rgba(0, 0, 0, 0.25) rgba(0, 0, 0, 0.25) rgba(255, 255, 255, 0.125)",
					"font-size": "13.3333px"
				}
			}
		}
	},
	
	automate() {
		if (player.tab == "s" && player.subtabs.s.stuff == "constellations") {
			updateStarCanvas()
		}
	},
	
	microtabs: {
        stuff: {
            empty: { title: () => "", unl: () => false, content: [] },
			constellations: { 
				title: () => "Constellations", unl: () => hasUpg("s", 11), content: [
				["display-text",
					function () { return "You have 0 solar points." }],
				["blank", "5px"],
				"star-box",
			]},
        },
	},
	
	tooltip() {
		return player.points.lt(LIMIT()) && player.s.points.lte(0) ? format(player.points.add(1).log(LIMIT()).mul(100), 3) + "% to Point of Singularity" : formatWhole(player.s.points) + " singularity points"
	},
	
	tabFormat:
		[
			["display-text",
				function () { return player.points.lt(LIMIT()) && player.s.points.lte(0) ? "WARNING: You're approaching the point of singularity. Once you go past this, the game will end." : "You have <h2 style='color: black; text-shadow: white 0px 0px 10px'>" + formatWhole(player.s.points) + "</h2> singularity points." }],
			["blank", "5px"],
			["buyable", "11"],
			["blank", "5px"],
			["display-text",
				function () { return "<h5>Point of Singularity: <span><h3 style='color: black; text-shadow: white 0px 0px 10px'>" + format(player.points) + " / " + format(LIMIT()) + "</h3></span> points</h5>" }],
			["blank"],
			["mini-bar", function () { return format(player.points ? player.points.add(1).log(LIMIT()) : 0) }, {"background-color": "#000"}],
			["blank", "5px"],
			["upgrade", "11"],
			["microtabs", "stuff"]
		],
		
	hotkeys: [
		{ key: "n", desc: "N: Gain singularity points", onPress() { doReset(this.layer) } },
	],

})