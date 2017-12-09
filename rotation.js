/**
* Vector and point array rotation operations
*/
var Rotation = function Rotation (matrixOps) {
  this.matrixOps = matrixOps
  /**
  * Provides rotation matrices for euclidean axes. Call with this.rotMatrixGen[axis](angle)
  */
  this.rotMatrixGen = {
    x: function getXRotMatrix (a) {
      var cosA = Math.cos(a)
      var sinA = Math.sin(a)
      return [
        [1, 0, 0, 0],
        [0, cosA, -sinA, 0],
        [0, sinA, cosA, 0],
        [0, 0, 0, 1]
      ]
    },

    y: function getYRotMatrix (a) {
      var cosA = Math.cos(a)
      var sinA = Math.sin(a)
      return [
        [cosA, 0, sinA, 0],
        [0, 1, 0, 0],
        [-sinA, 0, cosA, 0],
        [0, 0, 0, 1]
      ]
    },

    z: function getZRotMatrix (a) {
      var cosA = Math.cos(a)
      var sinA = Math.sin(a)
      return [
        [cosA, -sinA, 0, 0],
        [sinA, cosA, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ]
    }
  }

  // this.pointRotateCount2 = 0
  // this.pointRotateCount = 0
}

Rotation.prototype = {
  /**
  * If we're rotating all 3 axes, multiply the three rotation axes to save repeating for each axis
  */
  getXYZRotMat: function getXYZRotMat (xAng, yAng, zAng) {
    var xRotMat = this.rotMatrixGen['x'](xAng)
    var yRotMat = this.rotMatrixGen['y'](yAng)
    var zRotMat = this.rotMatrixGen['z'](zAng)

    return this.matrixOps.matMul(zRotMat, this.matrixOps.matMul(yRotMat, xRotMat))
  },

  /**
  * Rotates a vector around a given axis by a given angle.
  */
  rotateVector: function rotateVector (vector, axis, angle) {
    return this.matrixOps.vectMatMul(this.rotMatrixGen[axis](angle), vector)
  },

  rotateVectorAllAxes: function rotateVectorAllAxes (vect, xAng, yAng, zAng) {
    var rotMatrix = this.getXYZRotMat(xAng, yAng, zAng)
    return this.matrixOps.vectMatMul(rotMatrix, vect)
  },

  // intrinsicRotateVectorAllAxes: function rotateVectorAllAxes (vect, xAng, yAng, zAng) {
  //   var rotMatrix = this.getXYZRotMat(zAng, yAng, xAng)
  //   return this.matrixOps.vectMatMul(rotMatrix, vect)
  // },

  // inverseRotateVectorAllAxes: function rotateVectorAllAxes (vect, xAng, yAng, zAng) {
  //   var rotMatrix = this.matrixOps.invert(this.getXYZRotMat(xAng, yAng, zAng))
  //   return this.matrixOps.vectMatMul(rotMatrix, vect)
  // },

  // intrinsicInverseRotateVectorAllAxes: function rotateVectorAllAxes (vect, xAng, yAng, zAng) {
  //   var rotMatrix = this.matrixOps.invert(this.getXYZRotMat(zAng, yAng, xAng))
  //   return this.matrixOps.vectMatMul(rotMatrix, vect)
  // },

  /**
  * Transforms an array of points by a rotation, ie rotates an object, in a single axis
  */
  rotateObject: function rotateObject (object, axis, angle) {
    var rotMatrix = this.rotMatrixGen[axis](angle)
    var rotated = []
    for (var i = 0; i < object.length; i++) {
      rotated.push(this.matrixOps.vectMatMul(rotMatrix, object[i]))
    }
    return rotated
  },

  rotateObjectAllAxes: function rotateObjectAllAxes (object, xAng, yAng, zAng) {
    var rotMatrix = this.getXYZRotMat(xAng, yAng, zAng)
    var rotated = []
    for (var i = 0; i < object.length; i++) {
      // this.pointRotateCount += 1
      // if (this.pointRotateCount % 1000 === 0) {
      //   console.log(this.pointRotateCount)
      // }
      rotated.push(this.matrixOps.vectMatMul(rotMatrix, object[i]))
    }
    return rotated
  },

  inverseRotateObjectAllAxes: function inverseRotateObjectAllAxes (object, xAng, yAng, zAng) {
    var rotMatrix = this.matrixOps.invert(this.getXYZRotMat(xAng, yAng, zAng))
    var rotated = []
    for (var i = 0; i < object.length; i++) {
      // this.pointRotateCount += 1
      // if (this.pointRotateCount % 1000 === 0) {
      //   console.log(this.pointRotateCount)
      // }
      rotated.push(this.matrixOps.vectMatMul(rotMatrix, object[i]))
    }
    return rotated
  },

  intrinsicRotateObjectAllAxes: function rotateObjectAllAxes (object, xAng, yAng, zAng) {
    var rotMatrix = this.getXYZRotMat(yAng, zAng, xAng)
    var rotated = []
    for (var i = 0; i < object.length; i++) {
      // this.pointRotateCount += 1
      // if (this.pointRotateCount % 1000 === 0) {
      //   console.log(this.pointRotateCount)
      // }
      rotated.push(this.matrixOps.vectMatMul(rotMatrix, object[i]))
    }
    return rotated
  },
  intrinsicInverseRotateObjectAllAxes: function inverseRotateObjectAllAxes (object, xAng, yAng, zAng) {
    var rotMatrix = this.matrixOps.invert(this.getXYZRotMat(zAng, yAng, xAng))
    var rotated = []
    for (var i = 0; i < object.length; i++) {
      // this.pointRotateCount += 1
      // if (this.pointRotateCount % 1000 === 0) {
      //   console.log(this.pointRotateCount)
      // }
      rotated.push(this.matrixOps.vectMatMul(rotMatrix, object[i]))
    }
    return rotated
  },
  translateAllPointsRotateAndTranslateBack: function translateAllPointsRotateAndTranslateBack (pointsArray, displacementVector, xAng, yAng, zAng) {
    var pointsToRotate = []
    var i
    for (i = 0; i < pointsArray.length; i++) {
      pointsToRotate[i] = this.matrixOps.vectSubtract(pointsArray[i], displacementVector)
    }
    var rotatedArray = this.rotateObjectAllAxes(pointsToRotate, xAng, yAng, zAng)
    var returnArray = []
    for (i = 0; i < pointsArray.length; i++) {
      returnArray[i] = this.matrixOps.vectAdd(rotatedArray[i], displacementVector)
    }
    return returnArray
  }
}
