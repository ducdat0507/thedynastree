
let stars = {
	// Aries
	0: { x:  42.4958, y:  27.2605, name:      "41 Arietis", upg:  12, paths:      [] },
	1: { x:  31.7933, y:  23.4625, name:           "Hamal", upg:  13, paths:     [0] },
	2: { x:  28.6600, y:  20.8081, name:        "Sheratan", upg:  14, paths:     [1] },
	3: { x:  28.3825, y:  19.2958, name:       "Mesarthim", upg:  15, paths:     [2] },
	// Taurus
	4: { x:  81.5729, y:  28.6075, name:          "Elnath", upg:  17, paths:      [] },
	5: { x:  67.1542, y:  19.1803, name: "Oculus Borealus", upg:  18, paths:     [4] },
	6: { x:  57.6611, y:  24.1050, name:         "Alcyone", upg:  19, paths:     [5] },
	7: { x:  65.7338, y:  17.5425, name:        "δ¹ Tauri", upg:  20, paths:     [5] },
	8: { x:  64.9483, y:  15.6275, name:        "Hyadum I", upg:  21, paths:     [7] },
	9: { x:  67.1654, y:  15.8708, name:        "θ² Tauri", upg:  22, paths:     [8] },
   10: { x:  68.9800, y:  16.5092, name:       "Aldebaran", upg:  23, paths:     [9] },
   11: { x:  84.4113, y:  21.1425, name:         "ζ Tauri", upg:  24, paths:    [10] },
   12: { x:  60.1700, y:  12.4903, name:         "λ Tauri", upg:  25, paths:     [8] },
   13: { x:  51.7925, y:   9.7328, name:         "ξ Tauri", upg:  26, paths:    [12] },
   14: { x:  51.2033, y:   9.0289, name:         "ο Tauri", upg:  27, paths:    [13] },
	// Gemini
   15: { x: 113.6500, y:  31.8886, name:          "Castor", upg:  00, paths:      [] },
   16: { x: 112.2779, y:  31.7844, name:     "ρ Geminorum", upg:  00, paths:    [15] },
   17: { x: 107.7850, y:  30.2453, name:     "τ Geminorum", upg:  00, paths:    [16] },
   18: { x: 103.1971, y:  33.9611, name:     "θ Geminorum", upg:  00, paths:    [17] },
   19: { x: 100.9829, y:  25.1311, name:         "Mebsuta", upg:  00, paths:    [17] },
   20: { x:  97.2408, y:  20.2122, name:     "ν Geminorum", upg:  00, paths:    [19] },
   21: { x:  95.7400, y:  22.5136, name: "Tejat Posterior", upg:  00, paths:    [19] },
   22: { x:  93.7192, y:  22.5067, name:     "Tejat Prior", upg:  00, paths:    [21] },
   23: { x: 111.4317, y:  27.7981, name:     "ι Geminorum", upg:  00, paths:    [17] },
   24: { x: 113.9804, y:  26.8958, name:     "υ Geminorum", upg:  00, paths:    [23] },
   25: { x: 116.3288, y:  28.0261, name:          "Pollux", upg:  00, paths:    [24] },
   26: { x: 116.1117, y:  24.3981, name:     "κ Geminorum", upg:  00, paths:    [24] },
   27: { x: 110.0308, y:  21.9817, name:           "Wasat", upg:  00, paths:    [24] },
   28: { x: 109.5233, y:  16.5403, name:     "λ Geminorum", upg:  00, paths:    [27] },
   29: { x: 101.3225, y:  12.8956, name:           "Alzir", upg:  00, paths:    [28] },
   30: { x: 106.0271, y:  20.5703, name:         "Mekbuda", upg:  00, paths:    [27] },
   31: { x:  99.4279, y:  16.3992, name:        "Almeisan", upg:  00, paths:    [30] },
	
}

let consts = {
	0: { x:  35.4392, y:  23.2782, scale:  7000, name:     "Aries" },
	1: { x:  68.0917, y:  18.8182, scale:  3500, name:    "Taurus" },
	2: { x: 106.3529, y:  23.4118, scale:  3400, name:    "Gemini" },
}

function updateStarCanvas () {
	var mapc = document.getElementById("starbox")
	var mapctx = mapc.getContext("2d")
	
    mapctx.fillStyle = "rgb(0, 0, 0)"
	mapctx.fillRect(0, 0, mapc.width, mapc.height)
	mapctx.strokeStyle = '#ffffff7f';
	mapctx.fillStyle = '#ffffff';
	
	mapctx.font = "12px Inconsolata"
	mapctx.textBaseline = "middle"
	mapctx.textAlign = "center"
	
	var index = 0
	var hasActive = false
	
	const starRadius = Math.sqrt(starScale) / 15
	
	var unlockedConst = 1
	while (player.s.constUpgrades >= constsUnlocks[unlockedConst - 1]) unlockedConst++
	
	while (stars[index]) {
		mapctx.beginPath()
		
		var pos = starPosToScreenPos(stars[index].x, stars[index].y)
		var touch = Math.abs(starMouseX - pos.x) < starRadius && Math.abs(starMouseY - pos.y) < starRadius && !hasActive
		var unlocked = hasUpg("s", stars[index].upg)
		var otherUnlocked = unlocked || stars[index].paths.length == 0
		
		stars[index].paths.forEach(ind => {
			var hasOther = hasUpg("s", stars[ind].upg)
			mapctx.beginPath()
			var p = starPosToScreenPos(stars[ind].x, stars[ind].y)
			mapctx.moveTo(pos.x, pos.y)
			mapctx.strokeStyle = unlocked ? '#ffffffff' : hasOther ? '#ffffff7f' : '#ffffff2f'
			mapctx.lineTo(p.x, p.y)
			mapctx.stroke()
			if (hasOther) otherUnlocked = true
		})
		
		mapctx.strokeStyle = unlocked ? '#ffffffff' : otherUnlocked ? '#ffffff7f' : '#ffffff2f'
		mapctx.beginPath()
		mapctx.arc(pos.x, pos.y, otherUnlocked ? (touch ? starRadius * 2 : starRadius) : starRadius * 0.75, 0, 2 * Math.PI)
		if (unlocked) mapctx.fill(); else mapctx.stroke()
			
		if (touch) {
			mapctx.fillText(stars[index].name, pos.x, pos.y - 8 - starRadius * (otherUnlocked ? 2.2 : 1.2))
			mapctx.beginPath()
			mapctx.arc(pos.x, pos.y, starRadius, 0, 2 * Math.PI)
			mapctx.fill(); mapctx.stroke()
			hasActive = true
		}
		index++
	};
	
	mapctx.font = (8 * starRadius) + "px Inconsolata"
	mapctx.fillStyle = '#ffffff0f';
	
	var index = 0
	while (consts[index]) {
		var pos = starPosToScreenPos(consts[index].x, consts[index].y)
		mapctx.fillText(consts[index].name, pos.x, pos.y)
		index++
	}
	
	if (unlockedConst >= 1) {
		var inNext = inRange(starMouseX, 0, 30) && inRange(starMouseY, 0, 500)
		var inPrev = inRange(starMouseX, 470, 500) && inRange(starMouseY, 0, 500)
		
		mapctx.fillStyle = '#ffffff7f';
		mapctx.fillRect(29, 0, 1, 500)
		mapctx.fillRect(470, 0, 1, 500)
		
		mapctx.fillStyle = inNext ? '#3f3f3faf' : '#000000af'
		mapctx.fillRect(0, 0, 30, 500)
		mapctx.fillStyle = inPrev ? '#3f3f3faf' : '#000000af'
		mapctx.fillRect(470, 0, 30, 500)
		
		mapctx.font = "32px Inconsolata"
		mapctx.fillStyle = inNext ? '#ffffff' : '#ffffff7f'
		mapctx.fillText('<', 15, 250)
		mapctx.fillStyle = inPrev ? '#ffffff' : '#ffffff7f'
		mapctx.fillText('>', 485, 250)
	}
	
}

function inRange(val, min, max) {
	return val >= min && val <= max
}

function starPosToScreenPos(ra, dec) {
	function trueMod(a, b) {
		return ((a % b) + b) % b
	}
	
	return {
		x: (trueMod(starX - ra + 180, 360)) / 360 * starScale - starScale / 2 + 250,
		y: (trueMod(starY - dec + 90, 180)) / 180 * starScale - starScale / 2 + 250,
	}
}

var constsUnlocks = [4]
var starX = 35.4392, starY = 23.2782, starScale = 7000
var starMouse, starMouseX, starMouseY

function onStarMouseDown (e) {
	starMouse = true
	starMouseX = e.clientX - $("#starbox").offset().left
	starMouseY = e.clientY - $("#starbox").offset().top
	
	var unlockedConst = 1
	while (player.s.constUpgrades >= constsUnlocks[unlockedConst - 1]) unlockedConst++
	if (starMouseX <= 30) player.s.currentConst = (player.s.currentConst + 1) % unlockedConst
	if (starMouseX >= 470) player.s.currentConst = (player.s.currentConst + unlockedConst - 1) % unlockedConst
}

function onStarMouseMove (e) {
	var mX = e.clientX - $("#starbox").offset().left, mY = e.clientY - $("#starbox").offset().top
	if (starMouse) {
		starX = starX - (starMouseX - mX) / starScale * 360
		starY = starY - (starMouseY - mY) / starScale * 180
	}
	starMouseX = mX
	starMouseY = mY
}

function onStarMouseUp (e) {
	starMouse = false
}

function onStarMouseExit (e) {
	starMouseX = e.clientX - $("#starbox").offset().left
	starMouseY = e.clientY - $("#starbox").offset().top
}