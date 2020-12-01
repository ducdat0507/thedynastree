
// ----- Fifth row -----
addLayer("s", {
	startData() {
		return {
			unl: true,
			points: new Decimal(0),
			best: new Decimal(0),
			total: new Decimal(0),
			solarite: new Decimal(0),
			currentConst: 0,
			constUpgrades: 0,
			voidPoints: new Decimal(0),
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
	exponent: 0.00002,
	canBuyMax: () => false,
	
	effect() {
		return {
			gainMult: Decimal.pow(10, Decimal.add(player.s.voidPoints, 1).cbrt().log(10).sqrt()).div(10).add(0.9),
			costReduce: Decimal.pow(10, Decimal.sub(player.s.voidPoints, 1e21).max(0).div(1e21).add(1).log(10).pow(0.5).div(2)),
			voidPointMult: Decimal.sub(player.s.voidPoints, 1e55).max(0).div(1e55).mul(10).add(1).pow(0.5)
		}
	},
	
	gainMult() {
		return tmp.layerEffs.s.gainMult
	},
	gainExp() {
		return new Decimal(1)
	},
	
	buyables: {
		rows: 1,
		cols: 17,
		11: {
			cost(x) { return new Decimal("0") },
			effect(x) { return new Decimal("0") },
			display() { return (player.s.points.lt(1e3) ? "Gain " : "") + `+<b>` + formatWhole(tmp.resetGain.s) + `</b> singularity points` + (tmp.resetGain.s.lt(100) && player.s.points.lt(1e3) ? `<br><br>Next at ` + format(tmp.nextAt[layer]) + ` points</span>` : "") },
			unl() { return player.points.gte(tmp.layerReqs.s) || player.s.total.gt(0) },
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
		},
		12: {
			cost(x) { return Decimal.pow(10, x.mul(3).add(1).pow(3).mul(10)).root(player.s.buyables[15].add(1)) },
			effect(x) { return new Decimal("0") },
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return "Buy solarite with<br/>" + formatWhole(data.cost) + "<br/>points"
			},
			unl() { return true},
			canAfford() { return Decimal.gte(player.points, tmp.buyables[this.layer][this.id].cost) },
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player.points = player.points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
				player.s.solarite = Decimal.add(player.s.solarite, 1)
			},
			style() {
				let data = tmp.buyables[this.layer][this.id]
				return {
					"height": "50px",
					"width": "150px",
					"text-shadow": data.canAfford ? "white 0px 0px 5px" : "",
				}
			}
		},
		13: {
			cost(x) { return Decimal.pow(10, x.add(1).pow(3).mul(10)).root(player.s.buyables[16].add(1)) },
			effect(x) { return new Decimal("0") },
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return "Buy solarite with<br/>" + formatWhole(data.cost) + "<br/>spiritual power"
			},
			unl() { return true},
			canAfford() { return Decimal.gte(player.sp.points, tmp.buyables[this.layer][this.id].cost) },
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player.sp.points = player.sp.points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
				player.s.solarite = Decimal.add(player.s.solarite, 1)
			},
			style() {
				let data = tmp.buyables[this.layer][this.id]
				return {
					"height": "50px",
					"width": "150px",
					"text-shadow": data.canAfford ? "white 0px 0px 5px" : "",
				}
			}
		},
		14: {
			cost(x) { return Decimal.pow(10, x.add(1).pow(2).mul(5)).root(player.s.buyables[17].add(1)) },
			effect(x) { return new Decimal("0") },
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return "Buy solarite with<br/>" + formatWhole(data.cost) + "<br/>knowledge"
			},
			unl() { return true},
			canAfford() { return Decimal.gte(player.wi.knowledge, tmp.buyables[this.layer][this.id].cost) },
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player.wi.knowledge = player.wi.knowledge.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
				player.s.solarite = Decimal.add(player.s.solarite, 1)
			},
			style() {
				let data = tmp.buyables[this.layer][this.id]
				return {
					"height": "50px",
					"width": "150px",
					"text-shadow": data.canAfford ? "white 0px 0px 5px" : "",
				}
			}
		},
		15: {
			cost(x) { 
				if (x.gte(100)) x = x.pow(x.div(100))
				return Decimal.pow(2, x).div(tmp.layerEffs.s.costReduce).ceil()
			},
			effect(x) { return new Decimal("0") },
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return "Reduce the cost with<br/>" + formatWhole(data.cost) + "<br/>singularity points"
			},
			unl() { return true},
			canAfford() { return Decimal.gte(player.s.points, tmp.buyables[this.layer][this.id].cost) },
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player.s.points = player.s.points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			style() {
				let data = tmp.buyables[this.layer][this.id]
				return {
					"height": "50px",
					"width": "150px",
					"text-shadow": data.canAfford ? "white 0px 0px 5px" : "",
				}
			}
		},
		16: {
			cost(x) { 
				if (x.gte(100)) x = x.pow(x.div(100))
				return Decimal.pow(5, x.add(1)).div(tmp.layerEffs.s.costReduce).ceil()
			},
			effect(x) { return new Decimal("0") },
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return "Reduce the cost with<br/>" + formatWhole(data.cost) + "<br/>singularity points"
			},
			unl() { return true},
			canAfford() { return Decimal.gte(player.s.points, tmp.buyables[this.layer][this.id].cost) },
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player.s.points = player.s.points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			style() {
				let data = tmp.buyables[this.layer][this.id]
				return {
					"height": "50px",
					"width": "150px",
					"text-shadow": data.canAfford ? "white 0px 0px 5px" : "",
				}
			}
		},
		17: {
			cost(x) { 
				if (x.gte(100)) x = x.pow(x.div(100))
				return Decimal.pow(10, x.add(2)).div(tmp.layerEffs.s.costReduce).ceil()
			},
			effect(x) { return new Decimal("0") },
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return "Reduce the cost with<br/>" + formatWhole(data.cost) + "<br/>singularity points"
			},
			unl() { return true},
			canAfford() { return Decimal.gte(player.s.points, tmp.buyables[this.layer][this.id].cost) },
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player.s.points = player.s.points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			style() {
				let data = tmp.buyables[this.layer][this.id]
				return {
					"height": "50px",
					"width": "150px",
					"text-shadow": data.canAfford ? "white 0px 0px 5px" : "",
				}
			}
		},
		18: {
			title() { return format(player[this.layer].buyables[this.id]) + " α-Void" },
			cost(x) { 
				return new Decimal("0") 
			},
			effect(x) { 
				var mult = new Decimal(tmp.buyables.s[21].effect.voidGain).mul(tmp.buyables.s[22].effect.voidGain).mul(tmp.buyables.s[23].effect.voidGain).mul(tmp.buyables.s[27].effect.selfGain)
				return {
					voidGain: x.add(1).pow(0.2).sub(1),
					selfGain: Decimal.pow(10, x.add(1).sqrt().log(10).pow(0.2)).sub(1).mul(tmp.buyables.s[20].effect.nextMult).mul(mult),
					nextMult: Decimal.pow(10, x.add(1).cbrt().log(10).pow(0.2)),
				}
			},
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return player[this.layer].buyables[this.id].gt(0) ? 
					"which are giving " + format(data.effect.voidGain) + " void points, " + format(data.effect.selfGain) + " α-Void per second and multipling β-Void gain by ×" + format(data.effect.nextMult) + "."
					: "Unlock this void with<br/>" + formatWhole(data.cost) + "<br/>void points"
			},
			unl() { return true},
			canAfford() { return Decimal.gte(player.s.voidPoints, tmp.buyables[this.layer][this.id].cost) &&  player[this.layer].buyables[this.id].lte(0) },
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player.s.voidPoints = player.s.voidPoints.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			style() {
				let data = tmp.buyables[this.layer][this.id]
				return {
					"height": "200px",
					"color": player[this.layer].buyables[this.id].gt(0) ? "white" : "",
					"background-color": player[this.layer].buyables[this.id].gt(0) ? "black" : "",
					"box-shadow": player[this.layer].buyables[this.id].gt(0) ? "inset 0px 0px 20px white" : "",
					"text-shadow": data.canAfford || player[this.layer].buyables[this.id].gt(0) ? "white 0px 0px 5px" : "",
				}
			}
		},
		19: {
			title() { return format(player[this.layer].buyables[this.id]) + " β-Void" },
			cost(x) { 
				return new Decimal("1000") 
			},
			effect(x) { 
				var mult = new Decimal(tmp.buyables.s[21].effect.voidGain).mul(tmp.buyables.s[22].effect.voidGain).mul(tmp.buyables.s[23].effect.voidGain).mul(tmp.buyables.s[27].effect.selfGain)
				return {
					voidGain: x.add(1).pow(0.2),
					selfGain: Decimal.pow(10, x.add(1).cbrt().log(10).pow(0.2)).sub(1).mul(tmp.buyables.s[18].effect.nextMult).mul(mult),
					nextMult: Decimal.pow(10, x.add(1).cbrt().log(10).pow(0.2)),
				}
			},
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return player[this.layer].buyables[this.id].gt(0) ? 
					"which are multipling void point gain by ×" + format(data.effect.voidGain) + ", giving " + format(data.effect.selfGain) + " β-Void per second and multipling γ-Void gain by ×" + format(data.effect.nextMult) + "."
					: "Unlock this void with<br/>" + formatWhole(data.cost) + "<br/>void points"
			},
			unl() { return true},
			canAfford() { return Decimal.gte(player.s.voidPoints, tmp.buyables[this.layer][this.id].cost) &&  player[this.layer].buyables[this.id].lte(0) },
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player.s.voidPoints = player.s.voidPoints.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			style() {
				let data = tmp.buyables[this.layer][this.id]
				return {
					"height": "200px",
					"color": player[this.layer].buyables[this.id].gt(0) ? "white" : "",
					"background-color": player[this.layer].buyables[this.id].gt(0) ? "black" : "",
					"box-shadow": player[this.layer].buyables[this.id].gt(0) ? "inset 0px 0px 20px white" : "",
					"text-shadow": data.canAfford || player[this.layer].buyables[this.id].gt(0) ? "white 0px 0px 5px" : "",
				}
			}
		},
		20: {
			title() { return format(player[this.layer].buyables[this.id]) + " γ-Void" },
			cost(x) { 
				return new Decimal("20000") 
			},
			effect(x) { 
				var mult = new Decimal(tmp.buyables.s[21].effect.voidGain).mul(tmp.buyables.s[22].effect.voidGain).mul(tmp.buyables.s[23].effect.voidGain).mul(tmp.buyables.s[27].effect.selfGain)
				return {
					voidGain: x.add(1).pow(0.2),
					selfGain: Decimal.pow(10, x.add(1).cbrt().log(10).pow(0.2)).sub(1).mul(tmp.buyables.s[19].effect.nextMult).mul(mult),
					nextMult: Decimal.pow(10, x.add(1).cbrt().log(10).pow(0.2)),
				}
			},
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return player[this.layer].buyables[this.id].gt(0) ? 
					"which are multipling void point gain by ×" + format(data.effect.voidGain) + ", giving " + format(data.effect.selfGain) + " γ-Void per second and multipling α-Void gain by ×" + format(data.effect.nextMult) + "."
					: "Unlock this void with<br/>" + formatWhole(data.cost) + "<br/>void points"
			},
			unl() { return true},
			canAfford() { return Decimal.gte(player.s.voidPoints, tmp.buyables[this.layer][this.id].cost) &&  player[this.layer].buyables[this.id].lte(0) },
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player.s.voidPoints = player.s.voidPoints.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			style() {
				let data = tmp.buyables[this.layer][this.id]
				return {
					"height": "200px",
					"color": player[this.layer].buyables[this.id].gt(0) ? "white" : "",
					"background-color": player[this.layer].buyables[this.id].gt(0) ? "black" : "",
					"box-shadow": player[this.layer].buyables[this.id].gt(0) ? "inset 0px 0px 20px white" : "",
					"text-shadow": data.canAfford || player[this.layer].buyables[this.id].gt(0) ? "white 0px 0px 5px" : "",
				}
			}
		},
		21: {
			title() { return format(player[this.layer].buyables[this.id]) + " δ-Void" },
			cost(x) { 
				return new Decimal("1000000") 
			},
			effect(x) { 
				var mult = new Decimal(tmp.buyables.s[24].effect.voidGain).mul(tmp.buyables.s[25].effect.voidGain).mul(tmp.buyables.s[26].effect.voidGain).mul(tmp.buyables.s[27].effect.selfGain)
				return {
					voidGain: x.add(1).pow(0.2),
					selfGain: Decimal.pow(10, x.add(1).cbrt().log(10).pow(0.2)).sub(1).mul(10).mul(mult).mul(tmp.buyables.s[23].effect.nextMult),
					nextMult: Decimal.pow(10, x.add(1).cbrt().log(10).pow(0.2)),
				}
			},
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return player[this.layer].buyables[this.id].gt(0) ? 
					"which are multipling void point gain, α-Void, β-Void and γ-Void's self gain by ×" + format(data.effect.voidGain) + ", giving " + format(data.effect.selfGain) + " δ-Void per second and multipling ε-Void gain by ×" + format(data.effect.nextMult) + "."
					: "Unlock this void with<br/>" + formatWhole(data.cost) + "<br/>void points"
			},
			unl() { return true},
			canAfford() { return Decimal.gte(player.s.voidPoints, tmp.buyables[this.layer][this.id].cost) &&  player[this.layer].buyables[this.id].lte(0) },
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player.s.voidPoints = player.s.voidPoints.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			style() {
				let data = tmp.buyables[this.layer][this.id]
				return {
					"height": "200px",
					"color": player[this.layer].buyables[this.id].gt(0) ? "white" : "",
					"background-color": player[this.layer].buyables[this.id].gt(0) ? "black" : "",
					"box-shadow": player[this.layer].buyables[this.id].gt(0) ? "inset 0px 0px 20px white" : "",
					"text-shadow": data.canAfford || player[this.layer].buyables[this.id].gt(0) ? "white 0px 0px 5px" : "",
				}
			}
		},
		22: {
			title() { return format(player[this.layer].buyables[this.id]) + " ε-Void" },
			cost(x) { 
				return new Decimal("15000000") 
			},
			effect(x) { 
				var mult = new Decimal(tmp.buyables.s[24].effect.voidGain).mul(tmp.buyables.s[25].effect.voidGain).mul(tmp.buyables.s[26].effect.voidGain).mul(tmp.buyables.s[27].effect.selfGain)
				return {
					voidGain: x.add(1).pow(0.2),
					selfGain: Decimal.pow(10, x.add(1).cbrt().log(10).pow(0.2)).sub(1).mul(100).mul(mult).mul(tmp.buyables.s[21].effect.nextMult),
					nextMult: Decimal.pow(10, x.add(1).cbrt().log(10).pow(0.2)),
				}
			},
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return player[this.layer].buyables[this.id].gt(0) ? 
					"which are multipling void point gain, α-Void, β-Void and γ-Void's self gain by ×" + format(data.effect.voidGain) + ", giving " + format(data.effect.selfGain) + " ε-Void per second and multipling ζ-Void gain by ×" + format(data.effect.nextMult) + "."
					: "Unlock this void with<br/>" + formatWhole(data.cost) + "<br/>void points"
			},
			unl() { return true},
			canAfford() { return Decimal.gte(player.s.voidPoints, tmp.buyables[this.layer][this.id].cost) &&  player[this.layer].buyables[this.id].lte(0) },
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player.s.voidPoints = player.s.voidPoints.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			style() {
				let data = tmp.buyables[this.layer][this.id]
				return {
					"height": "200px",
					"color": player[this.layer].buyables[this.id].gt(0) ? "white" : "",
					"background-color": player[this.layer].buyables[this.id].gt(0) ? "black" : "",
					"box-shadow": player[this.layer].buyables[this.id].gt(0) ? "inset 0px 0px 20px white" : "",
					"text-shadow": data.canAfford || player[this.layer].buyables[this.id].gt(0) ? "white 0px 0px 5px" : "",
				}
			}
		},
		23: {
			title() { return format(player[this.layer].buyables[this.id]) + " ζ-Void" },
			cost(x) { 
				return new Decimal("500000000") 
			},
			effect(x) { 
				var mult = new Decimal(tmp.buyables.s[24].effect.voidGain).mul(tmp.buyables.s[25].effect.voidGain).mul(tmp.buyables.s[26].effect.voidGain).mul(tmp.buyables.s[27].effect.selfGain)
				return {
					voidGain: x.add(1).pow(0.2),
					selfGain: Decimal.pow(10, x.add(1).cbrt().log(10).pow(0.2)).sub(1).mul(100).mul(mult).mul(tmp.buyables.s[22].effect.nextMult),
					nextMult: Decimal.pow(10, x.add(1).cbrt().log(10).pow(0.2)),
				}
			},
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return player[this.layer].buyables[this.id].gt(0) ? 
					"which are multipling void point gain, α-Void, β-Void and γ-Void's self gain by ×" + format(data.effect.voidGain) + ", giving " + format(data.effect.selfGain) + " ζ-Void per second and multipling δ-Void gain by ×" + format(data.effect.nextMult) + "."
					: "Unlock this void with<br/>" + formatWhole(data.cost) + "<br/>void points"
			},
			unl() { return true},
			canAfford() { return Decimal.gte(player.s.voidPoints, tmp.buyables[this.layer][this.id].cost) &&  player[this.layer].buyables[this.id].lte(0) },
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player.s.voidPoints = player.s.voidPoints.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			style() {
				let data = tmp.buyables[this.layer][this.id]
				return {
					"height": "200px",
					"color": player[this.layer].buyables[this.id].gt(0) ? "white" : "",
					"background-color": player[this.layer].buyables[this.id].gt(0) ? "black" : "",
					"box-shadow": player[this.layer].buyables[this.id].gt(0) ? "inset 0px 0px 20px white" : "",
					"text-shadow": data.canAfford || player[this.layer].buyables[this.id].gt(0) ? "white 0px 0px 5px" : "",
				}
			}
		},
		24: {
			title() { return format(player[this.layer].buyables[this.id]) + " η-Void" },
			cost(x) { 
				return new Decimal("5e11") 
			},
			effect(x) { 
				var mult = new Decimal(tmp.buyables.s[27].effect.selfGain)
				return {
					voidGain: x.add(1).pow(0.2),
					selfGain: Decimal.pow(10, x.add(1).cbrt().log(10).pow(0.2)).sub(1).mul(100).mul(mult).mul(tmp.buyables.s[26].effect.nextMult),
					nextMult: Decimal.pow(10, x.add(1).cbrt().log(10).pow(0.2)),
				}
			},
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return player[this.layer].buyables[this.id].gt(0) ? 
					"which are multipling void point gain, δ-Void, ε-Void and ζ-Void's self gain by ×" + format(data.effect.voidGain) + ", giving " + format(data.effect.selfGain) + " η-Void per second and multipling θ-Void gain by ×" + format(data.effect.nextMult) + "."
					: "Unlock this void with<br/>" + formatWhole(data.cost) + "<br/>void points"
			},
			unl() { return true},
			canAfford() { return Decimal.gte(player.s.voidPoints, tmp.buyables[this.layer][this.id].cost) &&  player[this.layer].buyables[this.id].lte(0) },
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player.s.voidPoints = player.s.voidPoints.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			style() {
				let data = tmp.buyables[this.layer][this.id]
				return {
					"height": "200px",
					"color": player[this.layer].buyables[this.id].gt(0) ? "white" : "",
					"background-color": player[this.layer].buyables[this.id].gt(0) ? "black" : "",
					"box-shadow": player[this.layer].buyables[this.id].gt(0) ? "inset 0px 0px 20px white" : "",
					"text-shadow": data.canAfford || player[this.layer].buyables[this.id].gt(0) ? "white 0px 0px 5px" : "",
				}
			}
		},
		25: {
			title() { return format(player[this.layer].buyables[this.id]) + " θ-Void" },
			cost(x) { 
				return new Decimal("5e16") 
			},
			effect(x) { 
				var mult = new Decimal(tmp.buyables.s[27].effect.selfGain)
				return {
					voidGain: x.add(1).pow(0.2),
					selfGain: Decimal.pow(10, x.add(1).cbrt().log(10).pow(0.2)).sub(1).mul(100).mul(mult).mul(tmp.buyables.s[24].effect.nextMult),
					nextMult: Decimal.pow(10, x.add(1).cbrt().log(10).pow(0.2)),
				}
			},
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return player[this.layer].buyables[this.id].gt(0) ? 
					"which are multipling void point gain, δ-Void, ε-Void and ζ-Void's self gain by ×" + format(data.effect.voidGain) + ", giving " + format(data.effect.selfGain) + " θ-Void per second and multipling ι-Void gain by ×" + format(data.effect.nextMult) + "."
					: "Unlock this void with<br/>" + formatWhole(data.cost) + "<br/>void points"
			},
			unl() { return true},
			canAfford() { return Decimal.gte(player.s.voidPoints, tmp.buyables[this.layer][this.id].cost) &&  player[this.layer].buyables[this.id].lte(0) },
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player.s.voidPoints = player.s.voidPoints.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			style() {
				let data = tmp.buyables[this.layer][this.id]
				return {
					"height": "200px",
					"color": player[this.layer].buyables[this.id].gt(0) ? "white" : "",
					"background-color": player[this.layer].buyables[this.id].gt(0) ? "black" : "",
					"box-shadow": player[this.layer].buyables[this.id].gt(0) ? "inset 0px 0px 20px white" : "",
					"text-shadow": data.canAfford || player[this.layer].buyables[this.id].gt(0) ? "white 0px 0px 5px" : "",
				}
			}
		},
		26: {
			title() { return format(player[this.layer].buyables[this.id]) + " ι-Void" },
			cost(x) { 
				return new Decimal("1e25") 
			},
			effect(x) { 
				var mult = new Decimal(tmp.buyables.s[27].effect.selfGain)
				return {
					voidGain: x.add(1).pow(0.2),
					selfGain: Decimal.pow(10, x.add(1).cbrt().log(10).pow(0.2)).sub(1).mul(100).mul(mult).mul(tmp.buyables.s[25].effect.nextMult),
					nextMult: Decimal.pow(10, x.add(1).cbrt().log(10).pow(0.2)),
				}
			},
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return player[this.layer].buyables[this.id].gt(0) ? 
					"which are multipling void point gain, δ-Void, ε-Void and ζ-Void's self gain by ×" + format(data.effect.voidGain) + ", giving " + format(data.effect.selfGain) + " ι-Void per second and multipling η-Void gain by ×" + format(data.effect.nextMult) + "."
					: "Unlock this void with<br/>" + formatWhole(data.cost) + "<br/>void points"
			},
			unl() { return true},
			canAfford() { return Decimal.gte(player.s.voidPoints, tmp.buyables[this.layer][this.id].cost) &&  player[this.layer].buyables[this.id].lte(0) },
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player.s.voidPoints = player.s.voidPoints.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			style() {
				let data = tmp.buyables[this.layer][this.id]
				return {
					"height": "200px",
					"color": player[this.layer].buyables[this.id].gt(0) ? "white" : "",
					"background-color": player[this.layer].buyables[this.id].gt(0) ? "black" : "",
					"box-shadow": player[this.layer].buyables[this.id].gt(0) ? "inset 0px 0px 20px white" : "",
					"text-shadow": data.canAfford || player[this.layer].buyables[this.id].gt(0) ? "white 0px 0px 5px" : "",
				}
			}
		},
		27: {
			title() { return format(player[this.layer].buyables[this.id]) + " Void Power" },
			cost(x) { 
				var ret = Decimal.sub(player.s.voidPoints, 1e20).max(0).div(1e20).pow(0.9)
				if (ret.gte(1e20)) ret = ret.mul(1e20).sqrt()
				if (ret.gte(1e40)) ret = ret.mul(1e40).sqrt()
				if (ret.gte(1e80)) ret = ret.mul(1e80).sqrt()
				if (ret.gte(1e160)) ret = ret.mul(1e160).sqrt()
				return ret
			},
			effect(x) { 
				return {
					voidGain: x.add(1).pow(0.5),
					selfGain: x.mul(100).add(1).pow(0.3),
				}
			},
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return (player[this.layer].buyables[this.id].gt(0) ? 
					"which are multipling void point gain by ×" + format(data.effect.voidGain) + " and all void's self gain by ×" + format(data.effect.selfGain) + ".<br/><br/>"
					: "") + "Resets all void and void points for <br/>" + formatWhole(data.cost.sub(player.s.buyables[27]).max(0)) + "<br/>void points"
			},
			unl() { return true},
			canAfford() { return Decimal.gte(player.s.voidPoints, 1e20) && tmp.buyables.s[27].cost.gte(player.s.buyables[27]) },
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				if (cost.gte(player[this.layer].buyables[this.id])) {
					player.s.voidPoints = new Decimal(0)
					for (var a = 18; a <= 26; a++) {
						player.s.buyables[a] = new Decimal(0)
					}
					player[this.layer].buyables[this.id] = cost
				}
			},
			style() {
				let data = tmp.buyables[this.layer][this.id]
				return {
					"height": "200px",
					"text-shadow": data.canAfford || player[this.layer].buyables[this.id].gt(0) ? "white 0px 0px 5px" : "",
				}
			}
		},
	},
	
	upgrades: {
		rows: 1,
		cols: 15,
		11: {
			desc: () => "Unlock Constellations.",
			cost: () => new Decimal(10000),
			currencyLayer: "c",
			currencyInternalName: "points",
			currencyDisplayName: "coins",
			unl() { return player.s.points.gte(1) && !hasUpg("s", 11) },
		},
		12: {
			title: () => "41 Arietis",
			desc: () => "Raises your point production to ^4.1 base. Gets reduced the more point production you have.",
			cost: () => new Decimal(1),
			currencyLayer: "s",
			currencyInternalName: "solarite",
			currencyDisplayName: "solarite",
			unl() { return player.s.currentConst == 0 },
			effect() {
				return arietisPow
			},
			effectDisplay(fx) { return "^" + format(fx) },
			onPurchase() { player.s.constUpgrades++ }
		},
		13: {
			title: () => "Hamal",
			desc: () => "Unlocks more coin upgrades. They have some interesting properties though.",
			cost: () => new Decimal(2),
			currencyLayer: "s",
			currencyInternalName: "solarite",
			currencyDisplayName: "solarite",
			unl() { return player.s.currentConst == 0 },
			extraReq() { return hasUpg('s', 12) },
			onPurchase() { player.s.constUpgrades++ }
		},
		14: {
			title: () => "Sheratan",
			desc: () => "Bankings are immensely stronger based on coins.",
			cost: () => new Decimal(5),
			currencyLayer: "s",
			currencyInternalName: "solarite",
			currencyDisplayName: "solarite",
			unl() { return player.s.currentConst == 0 },
			extraReq() { return hasUpg('s', 13) },
			effect() {
				let ret = Decimal.pow(10, player.c.points.add(1).log(10).pow(0.5))
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
			onPurchase() { player.s.constUpgrades++ }
		},
		15: {
			title: () => "Mesarthim",
			desc: () => "Unlocks the ability to reduces the solarite requirements with singularity points.",
			cost: () => new Decimal(5),
			currencyLayer: "s",
			currencyInternalName: "solarite",
			currencyDisplayName: "solarite",
			unl() { return player.s.currentConst == 0 },
			extraReq() { return hasUpg('s', 14) },
			onPurchase() { player.s.constUpgrades++ }
		},
		16: {
			desc: () => "",
			cost: () => Decimal.dInf,
			unl() { return player.s.currentConst == 1 },
			extraReq() { return false },
			style() { return {"opacity": "0"} },
		},
		17: {
			title: () => "Elnath",
			desc: () => "You can bulk hire managers. Also you unlock a singularity tab.",
			cost: () => new Decimal(1),
			currencyLayer: "s",
			currencyInternalName: "solarite",
			currencyDisplayName: "solarite",
			unl() { return player.s.currentConst == 1 },
			onPurchase() { player.s.constUpgrades++ }
		},
		18: {
			title: () => "Oculus Borealus",
			desc: () => "You start with 10 banks and 1e10 of each first three bankings.",
			cost: () => new Decimal(2),
			currencyLayer: "s",
			currencyInternalName: "solarite",
			currencyDisplayName: "solarite",
			unl() { return player.s.currentConst == 1 },
			extraReq() { return hasUpg("s", 17) },
			onPurchase() { player.s.constUpgrades++ }
		},
		19: {
			title: () => "Alcyone",
			desc: () => "You start with an amount of managers based on unspent singularity points.",
			cost: () => new Decimal(5),
			currencyLayer: "s",
			currencyInternalName: "solarite",
			currencyDisplayName: "solarite",
			unl() { return player.s.currentConst == 1 },
			extraReq() { return hasUpg("s", 18) },
			effect() {
				let ret = player.s.points.add(1).log(10).add(1).log(2).add(3)
				return ret;
			},
			effectDisplay(fx) { return "+" + formatWhole(fx.floor()) + " (+" + format((fx % 1) * 100) + "%)" },
			onPurchase() { player.s.constUpgrades++ }
		},
		20: {
			title: () => "δ¹ Tauri",
			desc: () => "You start with an amount of workers based on unspent singularity points.",
			cost: () => new Decimal(3),
			currencyLayer: "s",
			currencyInternalName: "solarite",
			currencyDisplayName: "solarite",
			unl() { return player.s.currentConst == 1 },
			extraReq() { return hasUpg("s", 18) },
			effect() {
				let ret = player.s.points.add(1).log(2).add(1).log(2).add(5)
				return ret;
			},
			effectDisplay(fx) { return "+" + formatWhole(fx.floor()) + " (+" + format((fx % 1) * 100) + "%)" },
			onPurchase() { player.s.constUpgrades++ }
		},
		21: {
			title: () => "Hyadum I",
			desc: () => "Increases the “Point of Singularity” hardcap based on your singularity points.",
			cost: () => new Decimal(3),
			currencyLayer: "s",
			currencyInternalName: "solarite",
			currencyDisplayName: "solarite",
			unl() { return player.s.currentConst == 1 },
			extraReq() { return hasUpg("s", 20) },
			effect() {
				let ret = Decimal.pow(player.s.points.add(1), player.s.points.add(1).tetrate(0.75).min(25).mul(500)).mul("1e10000")
				if (ret.gte("1e30000")) ret = ret.mul("1e30000").sqrt()
				if (ret.gte("1e60000")) ret = ret.mul("1e120000").cbrt()
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
			onPurchase() { player.s.constUpgrades++ }
		},
		22: {
			title: () => "θ² Tauri",
			desc: () => "You can bulk hire builders.",
			cost: () => new Decimal(2),
			currencyLayer: "s",
			currencyInternalName: "solarite",
			currencyDisplayName: "solarite",
			unl() { return player.s.currentConst == 1 },
			extraReq() { return hasUpg("s", 21) },
			onPurchase() { player.s.constUpgrades++ }
		},
		23: {
			title: () => "Aldebaran",
			desc: () => "All builders (including unallocated) boost build speed.",
			cost: () => new Decimal(3),
			currencyLayer: "s",
			currencyInternalName: "solarite",
			currencyDisplayName: "solarite",
			unl() { return player.s.currentConst == 1 },
			extraReq() { return hasUpg("s", 22) },
			effect() {
				return player.bd.points.mul(Math.E).pow(0.5)
			},
			effectDisplay(fx) { return "×" + format(fx) },
			onPurchase() { player.s.constUpgrades++ }
		},
		24: {
			title: () => "ζ Tauri",
			desc: () => "You unlock a new singularity tab.",
			cost: () => new Decimal(20),
			currencyLayer: "s",
			currencyInternalName: "solarite",
			currencyDisplayName: "solarite",
			unl() { return player.s.currentConst == 1 },
			extraReq() { return hasUpg("s", 23) },
			onPurchase() { player.s.constUpgrades++ }
		},
		25: {
			title: () => "λ Tauri",
			desc: () => "You start with 1000 banks and 10 banked generation.",
			cost: () => new Decimal(8),
			currencyLayer: "s",
			currencyInternalName: "solarite",
			currencyDisplayName: "solarite",
			unl() { return player.s.currentConst == 1 },
			extraReq() { return hasUpg("s", 21) },
			onPurchase() { player.s.constUpgrades++ }
		},
	},
	
	update(diff) {
		starX += (consts[player.s.currentConst].x - starX) * (1 - Math.pow(0.005, diff))
		starY += (consts[player.s.currentConst].y - starY) * (1 - Math.pow(0.005, diff))
		starScale += (consts[player.s.currentConst].scale - starScale) * (1 - Math.pow(0.005, diff))
		
		var vpg = tmp.buyables.s[27].effect.voidGain.mul(tmp.layerEffs.s.voidPointMult)
		for (var a = 18; a <= 26; a++) {
			vpg = vpg.mul(tmp.buyables.s[a].effect.voidGain)
			player.s.buyables[a] = Decimal.add(player.s.buyables[a], tmp.buyables.s[a].effect.selfGain.mul(diff))
		}
		
		player.s.voidPoints = Decimal.add(player.s.voidPoints, vpg.mul(diff))
	},
	
	automate() {
		if (!player.s.solarite.add) player.s.solarite = new Decimal(player.s.solarite)
		if (player.tab == "s" && player.subtabs.s.stuff == "constellations") {
			updateStarCanvas()
		}
		
		if (player.b.points.lte(0) && hasUpg("s", 18)) {
			player.b.unl = true
			player.b.points = new Decimal(10)
			player.b.best = new Decimal(10)
			player.b.buyables[11] = new Decimal(1e10)
			player.b.buyables[12] = new Decimal(1e10)
			player.b.buyables[13] = new Decimal(1e10)
			if (hasUpg("s", 25)) {
				player.b.points = new Decimal(1000)
				player.b.best = new Decimal(1000)
				player.b.buyables[32] = new Decimal(10)
			}
		}
		if (player.m.points.lte(0) && hasUpg("s", 19)) {
			player.m.unl = true
			player.m.points = new Decimal(tmp.upgrades.s[19].effect.floor())
			player.m.best = new Decimal(tmp.upgrades.s[19].effect.floor())
		}
		if (player.w.points.lte(0) && hasUpg("s", 20)) {
			player.w.unl = true
			player.w.points = new Decimal(tmp.upgrades.s[20].effect.floor())
			player.w.best = new Decimal(tmp.upgrades.s[20].effect.floor())
		}
	},
	
	onPrestige(gain) {
		player.world = {}
		player.subtabs.m.stuff = "milestones"
		player.subtabs.t.stuff = "challenges"
		player.subtabs.wi.stuff = "discoveries"
	},
	
	microtabs: {
        stuff: {
            empty: { title: () => "", unl: () => false, content: [] },
			constellations: { 
				title: () => "Constellations", unl: () => hasUpg("s", 11), content: [
				["blank", "5px"],
				["display-text",
					function () { return "You have " + formatWhole(player.s.solarite) + " solarite.<br/><h5 style='font-size:8px'>&nbsp;" }],
				["row", [["buyable", 12], ["buyable", 13], ["buyable", 14]]],
				["row", [["buyable", 15], ["buyable", 16], ["buyable", 17]]],
				["blank", "5px"],
				"star-box",
				["blank", "5px"],
				["display-text",
					function () { return "<h5>Buy all upgrades in the current constellation to unlock another one.<br/>&nbsp;</h5>" }],
				["row", [["upgrade", 12], ["upgrade", 13], ["upgrade", 14], ["upgrade", 15]]],
				["row", [["upgrade", 16], ["upgrade", 19], ["upgrade", 16], ["upgrade", 16], ["upgrade", 16]]],
				["row", [["upgrade", 17], ["upgrade", 18], ["upgrade", 20], ["upgrade", 16], ["upgrade", 16]]],
				["row", [["upgrade", 16], ["upgrade", 16], ["upgrade", 21], ["upgrade", 25], ["upgrade", 16]]],
				["row", [["upgrade", 24], ["upgrade", 23], ["upgrade", 22], ["upgrade", 16], ["upgrade", 16]]],
				["blank", "5px"],
			]},
			void: { 
				title: () => "Void", unl: () => hasUpg("s", 17), content: [
				["blank", "5px"],
				["display-text",
					function () { return "You have " + formatWhole(player.s.voidPoints) + " void points, which translates to:<br/><br/>\
						<h3>×" + format(tmp.layerEffs.s.gainMult) + "</h3> singularity point gain</br>" + 
						(player.s.voidPoints.gte(1e21) ? "<h3>÷" + format(tmp.layerEffs.s.costReduce) + "</h3> all solarite cost reductions costs" : "<span style='opacity:30%'>" + format(1e21) + " void points required</span>") + "</br>" +
						(player.s.voidPoints.gte(1e55) ? "<h3>×" + format(tmp.layerEffs.s.voidPointMult) + "</h3> void point gain" : "<span style='opacity:30%'>" + format(1e55) + " void points required</span>") }],
				["blank", "5px"],
				["display-text",
					function () { return "You have:" }],
				["blank", "5px"],
				["row", [["buyable", 18], ["buyable", 19], ["buyable", 20]]],
				["row", [["buyable", 21], ["buyable", 22], ["buyable", 23]]],
				["row", [["buyable", 24], ["buyable", 25], ["buyable", 26]]],
				["blank", "5px"],
				["row", [["buyable", 27]]],
				["blank", "5px"],
			]},
        },
	},
	
	tooltip() {
		return player.points.lt(LIMIT()) && player.s.total.lte(0) ? format(player.points.add(1).log(LIMIT()).mul(100), 3) + "% to Point of Singularity" : formatWhole(player.s.points) + " singularity points"
	},
	
	tabFormat:
		[
			["display-text",
				function () { return player.points.lt(LIMIT()) && player.s.total.lte(0) ? "WARNING: You're approaching the point of singularity. Once you go past this, the game will end." : "You have <h2 style='color: black; text-shadow: white 0px 0px 10px'>" + formatWhole(player.s.points) + "</h2> singularity points." }],
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