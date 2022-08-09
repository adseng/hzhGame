import { Ghost, GMap, config, Player, directionXY } from "./box";

export class Game {
  constructor() {
    /**
     * @type {HTMLCanvasElement}
     */
    this.canvas = document.getElementById("canvas1");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = config.w600;
    this.canvas.height = config.h600;
    this.ctx.translate(50, 50);

    // 时间
    this.gameDuration = 15; // 游戏帧间隔
    this.startTime = 0;
    this.endTime = 1000 * 60 * 3; // 游戏结束时间

    // 角色
    this.map1 = new GMap();

    this.positions = config.initPoints;

    // 当前选中
    this.selectGhost = null;

    this.createPlayers();
    this.createClickEvent();

    // turn on 当前玩家
    this.player = this.player1;
  }
  engine() {
    this.map1.draw(this.ctx);
    this.player1.drawGhosts(this.ctx);
    this.player2.drawGhosts(this.ctx);
  }

  animate() {
    this.ctx.clearRect(-50, -50, this.canvas.width, this.canvas.height);

    let now = performance.now();
    if (now - this.startTime > this.gameDuration) {
      this.startTime = now;
      this.engine();
    }
    if (now > this.endTime) {
      this.ctx.save();
      this.ctx.font = "100px serif";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.strokeText("游戏结束", config.w500 / 2, config.w500 / 2, 1000);
      this.ctx.restore();
      return;
    }
    requestAnimationFrame(() => this.animate());
  }

  createPlayers() {
    this.player1 = new Player(1, config.g3.w, config.g4.h, config.g3.imgUrl);
    this.player1.initGhosts(0, 0);
    this.player2 = new Player(2, config.g4.w, config.g4.h, config.g4.imgUrl);
    this.player2.initGhosts(0, 4);
  }

  createClickEvent() {
    this.canvas.addEventListener("click", (e) => {
      this.handleSelect(e);
    });
  }

  /**
   *
   * @param {MouseEvent} e
   */
  handleSelect(e) {
    const dx = Math.floor(e.offsetX / config.pointSpace);
    const dy = Math.floor(e.offsetY / config.pointSpace);

    // player1
    if (this.player.idCard === this.positions[dy][dx]) {
      // 点击了ghost
      if (
        this.selectGhost &&
        this.selectGhost.x === dx &&
        this.selectGhost.y === dy
      ) {
        // 是已经选中的ghost，取消选中
        this.selectGhost.bigger();
        this.selectGhost = null;
      } else {
        // 不是之前选中的ghost，取消之前的选择
        if (this.selectGhost) {
          this.selectGhost.bigger();
          this.selectGhost = null;
        }

        // 选中新的ghost
        const ghost = this.player.ghostsArr.find((ghost) => {
          if (ghost.x === dx && ghost.y === dy) {
            return ghost;
          }
        });
        this.selectGhost = ghost;
        ghost.bigger();
        ghost.status =
          ghost.status === config.ghostStatus.ready
            ? config.ghostStatus.stable
            : config.ghostStatus.ready;
      }
    } else {
      // 点击了空白,可移动
      if (this.selectGhost) {
        // 是否可移动
        if (!this.moveAllowed(this.selectGhost.x, this.selectGhost.y, dx, dy)) {
          return;
        }
        // 更新位置
        this.positions[dy][dx] = this.player.idCard;
        this.positions[this.selectGhost.y][this.selectGhost.x] = 0;

        this.selectGhost.bigger();
        this.selectGhost.x = dx;
        this.selectGhost.y = dy;

        // 乱换角色
        this.changePlayer();

        this.selectGhost = null;
      }
    }
  }

  changePlayer() {
    this.player = this.player === this.player1 ? this.player2 : this.player1;
  }

  moveAllowed(cx, cy, dx, dy) {
    // 是否空白
    let flag = false;
    if (this.positions[dy][dx] === 0) {
      // 是否有轨迹可移动
      for (let index = 0; index < directionXY.length; index++) {
        const items = directionXY[index];
        if (items.includes(cx + "-" + cy) && items.includes(dx + "-" + dy)) {
          return true;
        }
      }
    }
    return false;
  }
}
