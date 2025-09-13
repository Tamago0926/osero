"use strict";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let osero_tiles = Array(8)
  .fill()
  .map(() => Array(8).fill(0));

let your_turn = true;
let mouse_x;
let mouse_y;
let can_put = false;

const serch_list = [
    [-1,0], // t (dy, dx)
    [-1,1], // rt
    [0,1],  // r
    [1,1],  // rb
    [1,0],  // b
    [1,-1], // lb
    [0,-1], // l
    [-1,-1] // lt
];

function isInside(x, y) {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
}

function draw () {
    // 背景マス
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (y === mouse_y && x === mouse_x) {
                ctx.fillStyle = "rgb(70, 138, 70)";
            } else {
                ctx.fillStyle = "green";
            }
            ctx.fillRect(x * 50, y * 50, 50, 50);
        }
    }

    // グリッド線
    ctx.strokeStyle = "black";
    for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 50, 0);
        ctx.lineTo(i * 50, 400);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * 50);
        ctx.lineTo(400, i * 50);
        ctx.stroke();
    }

    // 駒表示
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (osero_tiles[y][x] !== 0) {
                ctx.beginPath();
                ctx.arc(x * 50 + 25, y * 50 + 25, 20, 0, Math.PI * 2);
                ctx.fillStyle = (osero_tiles[y][x] === 1) ? "black" : "white";
                ctx.fill();
            }
        }
    }
}

function new_game () {
    osero_tiles = Array(8)
      .fill()
      .map(() => Array(8).fill(0));

    osero_tiles[3][3] = 2;
    osero_tiles[4][4] = 2;
    osero_tiles[3][4] = 1;
    osero_tiles[4][3] = 1;
}

function put_process() {
    if (typeof mouse_x !== "number" || typeof mouse_y !== "number") {
        can_put = false;
        return;
    }
    if (!isInside(mouse_x, mouse_y)) {
        can_put = false;
        return;
    }

    if (osero_tiles[mouse_y][mouse_x] !== 0) {
        can_put = false;
        return;
    }

    let flipped = [];

    for (let [dy, dx] of serch_list) {
        let x = mouse_x + dx;
        let y = mouse_y + dy;
        let temp = [];

        if (!isInside(x, y) || osero_tiles[y][x] !== 2) continue;

        while (isInside(x, y) && osero_tiles[y][x] === 2) {
            temp.push([y, x]);
            x += dx;
            y += dy;
        }

        if (isInside(x, y) && osero_tiles[y][x] === 1 && temp.length > 0) {
            flipped.push(...temp);
        }
    }

    if (flipped.length > 0) {
        can_put = true;
        osero_tiles[mouse_y][mouse_x] = 1;
        for (const [y, x] of flipped) {
            osero_tiles[y][x] = 1;
        }
    } else {
        can_put = false;
    }
}

function AI () {
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (osero_tiles[y][x] === 0) {
                mouse_x = x;
                mouse_y = y;
                put_process_AI();
                if (can_put) {
                    your_turn = true;
                    return;
                }
            }
        }
    }
    your_turn = true;
}

function put_process_AI() {
    if (typeof mouse_x !== "number" || typeof mouse_y !== "number") {
        can_put = false;
        return;
    }
    if (!isInside(mouse_x, mouse_y)) {
        can_put = false;
        return;
    }
    if (osero_tiles[mouse_y][mouse_x] !== 0) {
        can_put = false;
        return;
    }

    let flipped = [];

    for (let [dy, dx] of serch_list) {
        let x = mouse_x + dx;
        let y = mouse_y + dy;
        let temp = [];

        if (!isInside(x, y) || osero_tiles[y][x] !== 1) continue;

        while (isInside(x, y) && osero_tiles[y][x] === 1) {
            temp.push([y, x]);
            x += dx;
            y += dy;
        }

        if (isInside(x, y) && osero_tiles[y][x] === 2 && temp.length > 0) {
            flipped.push(...temp);
        }
    }

    if (flipped.length > 0) {
        can_put = true;
        osero_tiles[mouse_y][mouse_x] = 2;
        for (const [y, x] of flipped) {
            osero_tiles[y][x] = 2;
        }
    } else {
        can_put = false;
    }
}


canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = Math.floor((e.clientX - rect.left) / 50);
    const my = Math.floor((e.clientY - rect.top) / 50);
    mouse_x = isInside(mx, my) ? mx : undefined;
    mouse_y = isInside(mx, my) ? my : undefined;
});

canvas.addEventListener("click", (e) => {
    if (!your_turn) return;

    put_process();
    if (can_put) {
        your_turn = false;
        AI();
    } else {
    }
});

setInterval(() => {
    draw();
}, 16);

new_game();
draw();
