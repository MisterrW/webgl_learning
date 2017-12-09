/**
 * Returns a 3d vector in homogenous coordinates, as an array of 4 elements.
 * If no homogenous coordinate is passed to the ctor, 1 is used.
 */
var Vector = function (x, y, z, w) {
  this.x = x
  this.y = y
  this.z = z
  this.w = w || 1
}

Vector.prototype = {
  getLength: function getLength () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  },

  as3Array: function as3Array () {
    if (this.w !== 1) {
      var normaliser = 1.0 / this.w
      return [this.x * normaliser, this.y * normaliser, this.z * normaliser]
    } else {
      return [this.x, this.y, this.z]
    }
  },

  as4Array: function as4Array () {
    return [this.x, this.y, this.z, this.w]
  }
}
