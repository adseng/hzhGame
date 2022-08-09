// palyers
export class Player {
  constructor(idCard, w, h, imgUrl) {
    /**
     * @type {Ghost[]}
     */
    this.ghostsArr = [];
    this.w = w;
    this.h = h;
    this.imgUrl = imgUrl;

    this.idCard = idCard;
  }

  /**
   *
   * @param {number} sx 开始坐标x
   * @param {number} sy 开始坐标y
   */
  initGhosts(sx, sy) {
    for (let i = 0; i < 5; i++) {
      this.ghostsArr.push(new Ghost(sx + i, sy, this.w, this.h, this.imgUrl));
    }
  }

  createGhost(sx, sy) {
    this.ghostsArr.push(new Ghost(sx, sy, this.w, this.h, this.imgUrl));
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  drawGhosts(ctx) {
    this.ghostsArr.forEach((ghost) => {
      ghost.draw(ctx);
    });
  }
}

// 棋子
export class Ghost {
  constructor(x = 0, y = 0, w, h, imgUrl) {
    this.x = x;
    this.y = y;
    this._dx = 0;
    this._dy = 0;
    this.w = w;
    this.h = h;
    this.dw = this.w;
    this.dh = this.h;

    // stable ready
    this.status = config.ghostStatus.stable;

    this.lastX = this.x;
    this.lastY = this.y;

    this.img = new Image();
    this.img.src = imgUrl;
  }
  draw(ctx) {
    if (this.x !== this.lastX || this.y !== this.lastY) {
      let dx = this.x - this.lastX;
      let dy = this.y - this.lastY;
      this.lastX = this.lastX + dx * config.ghostSpeed;
      this.lastY = this.lastY + dy * config.ghostSpeed;
    }
    ctx.drawImage(
      this.img,
      this._dx,
      this._dy,
      this.w,
      this.h,
      this.lastX * config.pointSpace - this.w / 2,
      this.lastY * config.pointSpace - this.h / 2,
      this.dw,
      this.dh
    );
  }

  bigger() {
    this.dw = this.dw === this.w ? this.dw * 1.2 : this.w;
    this.dh = this.dh === this.h ? this.dh * 1.2 : this.h;
  }
}

// 地图
export class GMap {
  constructor() {
    this.w500 = config.w500;
    this.h500 = config.h500;
  }

  /**
   *
   * @param {CanvasRenderingContext2D | null} ctx
   */
  draw(ctx) {
    const w500 = this.w500;
    const h500 = this.h500;
    ctx.save();
    ctx.lineWidth = 10;
    ctx.lineJoin = "round";
    ctx.strokeRect(0, 0, w500, h500);
    drawLine(ctx, 0, 0, w500, h500);
    drawLine(ctx, w500, 0, 0, h500);
    drawLine(ctx, 0, h500 / 2, w500, h500 / 2);
    drawLine(ctx, w500 / 2, 0, w500 / 2, h500);
    drawLine(ctx, w500 / 2, 0, 0, h500 / 2);
    drawLine(ctx, 0, h500 / 2, w500 / 2, h500);
    drawLine(ctx, w500 / 2, h500, w500, h500 / 2);
    drawLine(ctx, w500, h500 / 2, w500 / 2, 0);
    drawLine(ctx, w500 / 4, 0, w500 / 4, h500);
    drawLine(ctx, (w500 / 4) * 3, 0, (w500 / 4) * 3, h500);
    drawLine(ctx, 0, h500 / 4, w500, h500 / 4);
    drawLine(ctx, 0, (h500 / 4) * 3, w500, (h500 / 4) * 3);
    ctx.restore();
  }
}

export class GameStatus {
  constructor() {
    this.mapPoints = config.initPoints;
  }
}

export function drawLine(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export const config = {
  w500: 500,
  h500: 500,
  w600: 620,
  h600: 620,
  g3: {
    w: 104,
    h: 114,
    imgUrl: "/img/g3.png",
  },
  g4: {
    w: 108,
    h: 108,
    imgUrl: "/img/g4.png",
  },
  pointSpace: 125,
  initPoints: [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [2, 2, 2, 2, 2],
  ],
  ghostSpeed: 0.1,
  ghostStatus: {
    stable: "stable",
    ready: "ready",
  },
};

export const directionXY = [
  ["0-0", "1-0", "2-0", "3-0", "4-0"],
  ["0-1", "1-1", "2-1", "3-1", "4-1"],
  ["0-2", "1-2", "2-2", "3-2", "4-2"],
  ["0-3", "1-3", "2-3", "3-3", "4-3"],
  ["0-4", "1-4", "2-4", "3-4", "4-4"],

  ["0-0", "0-1", "0-2", "0-3", "0-4"],
  ["1-0", "1-1", "1-2", "1-3", "1-4"],
  ["2-0", "2-1", "2-2", "2-3", "2-4"],
  ["3-0", "3-1", "3-2", "3-3", "3-4"],
  ["4-0", "4-1", "4-2", "4-3", "4-4"],

  ["2-0", "3-1", "4-2"],
  ["0-0", "1-1", "2-2", "3-3", "4-4"],
  ["0-2", "1-3", "2-4"],

  ["2-0", "1-1", "0-2"],
  ["4-0", "3-1", "2-2", "1-3", "0-4"],
  ["4-2", "3-3", "2-4"],
];
