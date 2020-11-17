
let stars = {
	// Aries
	0: { x:  42.4958, y:  27.2605, name:      "41 Arietis", paths:      [] },
	1: { x:  31.7933, y:  23.4625, name:           "Hamal", paths:     [0] },
	2: { x:  28.6600, y:  20.8081, name:        "Sheratan", paths:     [1] },
	3: { x:  28.3825, y:  19.2958, name:       "Mesarthim", paths:     [2] },
	// Taurus
	4: { x:  81.5729, y:  28.6075, name:          "Elnath", paths:      [] },
	5: { x:  67.1542, y:  19.1803, name: "Oculus Borealus", paths:     [4] },
	6: { x:  57.6611, y:  24.1050, name:         "Alcyone", paths:     [5] },
	7: { x:  65.7338, y:  17.5425, name:        "δ¹ Tauri", paths:     [5] },
	8: { x:  64.9483, y:  15.6275, name:        "Hyadum I", paths:     [7] },
	9: { x:  67.1654, y:  15.8708, name:        "θ² Tauri", paths:     [8] },
   10: { x:  68.9800, y:  16.5092, name:       "Aldebaran", paths:     [9] },
   11: { x:  84.4113, y:  21.1425, name:         "ζ Tauri", paths:    [10] },
   12: { x:  60.1700, y:  12.4903, name:         "λ Tauri", paths:     [8] },
   13: { x:  51.7925, y:   9.7328, name:         "ξ Tauri", paths:    [12] },
   14: { x:  51.2033, y:   9.0289, name:         "ο Tauri", paths:    [13] },
	// Gemini
   15: { x: 113.6500, y:  31.8886, name:          "Castor", paths:      [] },
   16: { x: 112.2779, y:  31.7844, name:     "ρ Geminorum", paths:    [15] },
   17: { x: 107.7850, y:  30.2453, name:     "τ Geminorum", paths:    [16] },
   18: { x: 103.1971, y:  33.9611, name:     "θ Geminorum", paths:    [17] },
   19: { x: 100.9829, y:  25.1311, name:         "Mebsuta", paths:    [17] },
   20: { x:  97.2408, y:  20.2122, name:     "ν Geminorum", paths:    [19] },
   21: { x:  95.7400, y:  22.5136, name: "Tejat Posterior", paths:    [19] },
   22: { x:  93.7192, y:  22.5067, name:     "Tejat Prior", paths:    [21] },
   23: { x: 111.4317, y:  27.7981, name:     "ι Geminorum", paths:    [17] },
   24: { x: 113.9804, y:  26.8958, name:     "υ Geminorum", paths:    [23] },
   25: { x: 116.3288, y:  28.0261, name:          "Pollux", paths:    [24] },
   26: { x: 116.1117, y:  24.3981, name:     "κ Geminorum", paths:    [24] },
   27: { x: 110.0308, y:  21.9817, name:           "Wasat", paths:    [24] },
   28: { x: 109.5233, y:  16.5403, name:     "λ Geminorum", paths:    [27] },
   29: { x: 101.3225, y:  12.8956, name:           "Alzir", paths:    [28] },
   30: { x: 106.0271, y:  20.5703, name:         "Mekbuda", paths:    [27] },
   31: { x:  99.4279, y:  16.3992, name:        "Almeisan", paths:    [30] },
	
}

let consts = {
	0: { x:  32.8329, y:  22.7067, name:     "Aries" },
	1: { x:  64.5454, y:  17.3636, name:    "Taurus" },
	2: { x: 106.3529, y:  24.4118, name:    "Gemini" },
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
	while (stars[index]) {
		mapctx.beginPath()
		var pos = starPosToScreenPos(stars[index].x, stars[index].y)
		var touch = Math.abs(starMouseX - pos.x) < 5 && Math.abs(starMouseY - pos.y) < 5 && !hasActive
		mapctx.arc(pos.x, pos.y, touch ? 6 : 3, 0, 2 * Math.PI)
		mapctx.stroke()
		stars[index].paths.forEach(ind => {
			mapctx.beginPath()
			var p = starPosToScreenPos(stars[ind].x, stars[ind].y)
			mapctx.moveTo(pos.x, pos.y)
			mapctx.lineTo(p.x, p.y)
			mapctx.stroke()
		})
		if (touch) {
			mapctx.fillText(stars[index].name, pos.x, pos.y - 15)
			mapctx.beginPath()
			mapctx.arc(pos.x, pos.y, 3, 0, 2 * Math.PI)
			mapctx.fill()
			hasActive = true
		}
		index++
	};
	
	mapctx.font = "48px Inconsolata"
	mapctx.fillStyle = '#ffffff0f';
	
	var index = 0
	while (consts[index]) {
		var pos = starPosToScreenPos(consts[index].x, consts[index].y)
		mapctx.fillText(consts[index].name, pos.x, pos.y)
		index++
	}
	
}

function starPosToScreenPos(ra, dec) {
	function trueMod(a, b) {
		return ((a % b) + b) % b
	}
	
	return {
		x: (1 - trueMod((ra + starX) / 360, 1)) * 2500 - 1250,
		y: (1 - trueMod((dec + starY + 90) / 180, 1)) * 2500 - 1250,
	}
}

var starX = 103, starY = -45
var starMouse, starMouseX, starMouseY

function onStarMouseDown (e) {
	starMouse = true
	starMouseX = e.clientX - $("#starbox").offset().left
	starMouseY = e.clientY - $("#starbox").offset().top
}

function onStarMouseMove (e) {
	var mX = e.clientX - $("#starbox").offset().left, mY = e.clientY - $("#starbox").offset().top
	if (starMouse) {
		starX = starX + (starMouseX - mX) / 7
		starY = starY + (starMouseY - mY) / 10
	}
	starMouseX = mX
	starMouseY = mY
}

function onStarMouseUp (e) {
	starMouse = false
}