define(function () {
  function Vector2d(x, y) {
    this.x = x;
    this.y = y;
  }

  // 向量加法
  Vector2d.prototype.add = function(vector) {
    return new Vector2d(this.x + vector.x, this.y + vector.y);
  }

  // 向量减法
  Vector2d.prototype.sub = function(vector) {
    return new Vector2d(this.x - vector.x, this.y - vector.y);
  }

  // 向量点积
  Vector2d.prototype.dotProduct = function(vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  // 向量取反
  Vector2d.prototype.negate = function() {
    return new Vector2d(-this.x, -this.y);
  }

  // 向量模
  Vector2d.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // 单位向量
  Vector2d.prototype.normalize = function() {
    var length = this.length();
    return new Vector2d(this.x / length, this.y / length);
  }

  // 向量放缩
  Vector2d.prototype.scale = function(scale) {
    return new Vector2d(this.x * scale, this.y * scale);
  }

  // 向量旋转
  Vector2d.prototype.rotate = function(angle) {
    var x = this.x;
    var y = this.y;

    var x1 = x * Math.cos(angle) - y * Math.sin(angle);
    var y1 = x * Math.sin(angle) + y * Math.cos(angle);

    return new Vector2d(x1, y1);
  }

  return Vector2d;
});
