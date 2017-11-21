//------------------utils-------------------------------//

// function random(min, max) {
//   var num = Math.floor(Math.random() * (max - min)) + min;
//   return num;
// }

//------------------vector-----------------------------//

// function Vector2d(x, y) {
//   this.x = x;
//   this.y = y;
// }
//
// // 向量加法
// Vector2d.prototype.add = function(vector) {
//   return new Vector2d(this.x + vector.x, this.y + vector.y);
// }
//
// // 向量减法
// Vector2d.prototype.sub = function(vector) {
//   return new Vector2d(this.x - vector.x, this.y - vector.y);
// }
//
// // 向量点积
// Vector2d.prototype.dotProduct = function(vector) {
//   return this.x * vector.x + this.y * vector.y;
// }
//
// // 向量取反
// Vector2d.prototype.negate = function() {
//   return new Vector2d(-this.x, -this.y);
// }
//
// // 向量模
// Vector2d.prototype.length = function() {
//   return Math.sqrt(this.x * this.x + this.y * this.y);
// }
//
// // 单位向量
// Vector2d.prototype.normalize = function() {
//   var length = this.length();
//   return new Vector2d(this.x / length, this.y / length);
// }
//
// // 向量放缩
// Vector2d.prototype.scale = function(scale) {
//   return new Vector2d(this.x * scale, this.y * scale);
// }
//
// // 向量旋转
// Vector2d.prototype.rotate = function(angle) {
//   var x = this.x;
//   var y = this.y;
//
//   var x1 = x * Math.cos(angle) - y * Math.sin(angle);
//   var y1 = x * Math.sin(angle) + y * Math.cos(angle);
//
//   return new Vector2d(x1, y1);
// }

//------------------main-------------------------------//

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var balls = [];

function Ball(x, y, speedX, speedY, color, radius, density) {
  this.x = x;
  this.y = y;
  this.speedX = speedX;
  this.speedY = speedY;
  this.color = color;
  this.radius = radius;
  this.density = density;
}

Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  ctx.fill();
}

Ball.prototype.borderCollisionDetect = function () {
  if ((this.x + this.radius) >= width && this.speedX > 0) {
    this.speedX *= -1;
  }

  if ((this.x - this.radius) <= 0 && this.speedX < 0) {
    this.speedX *= -1;
  }

  if ((this.y + this.radius) >= height && this.speedY > 0) {
    this.speedY *= -1;
  }

  if ((this.y - this.radius) <= 0 && this.speedY < 0) {
    this.speedY *= -1;
  }
}

function ballsCollisionDetect(ball1, ball2) {
  //  当前距离
  var dx = ball1.x - ball2.x;
  var dy = ball1.y - ball2.y;
  var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

  //  预测下一时刻会不会碰撞
  let dx_next = ball1.x + ball1.speedX - ball2.x - ball2.speedX;
  let dy_next = ball1.y + ball1.speedY - ball2.y - ball2.speedY;
  let distance_next = Math.sqrt(Math.pow(dx_next, 2) + Math.pow(dy_next, 2));

  if (distance_next < ball1.radius + ball2.radius && distance_next < distance) {
    return true;
  }
  return false;
}

function collide(ball1, ball2) {
  require(['Vector2d'], function (Vector2d) {
    // 初始速度向量
    let speed_ball1_initial = new Vector2d(ball1.speedX, ball1.speedY);
    let speed_ball2_initial = new Vector2d(ball2.speedX, ball2.speedY);

    // 球心方向单位向量
    let s = new Vector2d(ball2.x - ball1.x, ball2.y - ball1.y);
    s = s.normalize();

    // 垂直球心方向单位向量
    let t = s.rotate(Math.PI / 2);

    // 速度在球心向量上的分速度投影
    let speed_ball1_initial_sc = speed_ball1_initial.dotProduct(s)/s.length();
    let speed_ball2_initial_sc = speed_ball2_initial.dotProduct(s)/s.length();

    // 速度在垂直球心向量上的分速度投影
    let speed_ball1_initial_tc = speed_ball1_initial.dotProduct(t)/t.length();
    let speed_ball2_initial_tc = speed_ball2_initial.dotProduct(t)/t.length();

    // 碰撞后球心方向上的分速度
    let speed_ball1_final_sc = (speed_ball1_initial_sc * (ball1.density * Math.pow(ball1.radius,3) - ball2.density * Math.pow(ball2.radius,3)) + 2 * (ball2.density * Math.pow(ball2.radius,3)) * speed_ball2_initial_sc)
     / (ball1.density * Math.pow(ball1.radius,3) + ball2.density * Math.pow(ball2.radius,3));
    let speed_ball2_final_sc = (speed_ball2_initial_sc * (ball2.density * Math.pow(ball2.radius,3) - ball1.density * Math.pow(ball1.radius,3)) + 2 * (ball1.density * Math.pow(ball1.radius,3)) * speed_ball1_initial_sc)
     / (ball1.density * Math.pow(ball1.radius,3) + ball2.density * Math.pow(ball2.radius,3));

    // 碰撞后球心方向上的分速度向量
    let speed_ball1_final_s = s.scale(speed_ball1_final_sc);
    let speed_ball2_final_s = s.scale(speed_ball2_final_sc);

    // 碰撞后垂直球心方向上的分速度向量
    let speed_ball1_final_t = t.scale(speed_ball1_initial_tc);
    let speed_ball2_final_t = t.scale(speed_ball2_initial_tc);

    // 结束速度向量
    let speed_ball1_final = speed_ball1_final_s.add(speed_ball1_final_t);
    let speed_ball2_final = speed_ball2_final_s.add(speed_ball2_final_t);

    // 更新速度
    ball1.speedX = speed_ball1_final.x;
    ball1.speedY = speed_ball1_final.y;

    ball2.speedX = speed_ball2_final.x;
    ball2.speedY = speed_ball2_final.y;
  });
}

function update() {
  for (let i = 0; i < balls.length; i++) {
    balls[i].borderCollisionDetect();

    for (let j = i + 1; j < balls.length; j++) {
      if (ballsCollisionDetect(balls[i], balls[j])) {
        collide(balls[i], balls[j]);
      }
    }

    // 更新位置
    balls[i].x += balls[i].speedX;
    balls[i].y += balls[i].speedY;
  }
}

function createBalls() {
  require(['utils'], function (utils) {
    while (balls.length < 8) {
      var ball = new Ball(
        utils.random(0, width),  // x
        utils.random(0, height), // y
        utils.random(1, 10),     // speedX
        utils.random(1, 10),     // speedY
        'rgb('+utils.random(0, 255) +','+ utils.random(0, 255)+','+ utils.random(0, 255) +')',
        80,                     // radius
        1                       // density
      );
      balls.push(ball);
    }
  });
}

function loop(timestamp) {
  // console.log('timestamp: '+ timestamp);

  ctx.clearRect(0,0,width,height);

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
  }

  update();

  let result = requestAnimationFrame(loop);
  // console.log('result'+ result);

  // setTimeout(loop, 100);
}

function start() {
  createBalls();
  loop();
}

start();
