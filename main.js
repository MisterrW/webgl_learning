var canvas = document.getElementById("c");

//openGl perspective fn which takes in fov angle, aspect(width / height), and the near and far clipping planes
function perspective(fieldOfViewInRadians, aspect, near, far) {
  var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
  var rangeInv = 1.0 / (near - far);

  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
  ];
}


var matrixOps = new MatrixOperations();
var rotation = new Rotation(matrixOps);

// function resizeCanvas(canvas) {
//     // Lookup the size the browser is displaying the canvas.
//     var displayWidth  = canvas.clientWidth;
//     var displayHeight = canvas.clientHeight;
   
//     // Check if the canvas is not the same size.
//     if (canvas.width  != displayWidth ||
//         canvas.height != displayHeight) {
   
//       // Make the canvas the same size
//       canvas.width  = displayWidth;
//       canvas.height = displayHeight;
//     }
//   }

 var gl = canvas.getContext("webgl");
 if (!gl) {
     console.log("webGl not available");
 }

 function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    // only if fails
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  console.log(gl)

  var vertexShaderSource = document.getElementById("3d-vertex-shader").text;
  var fragmentShaderSource = document.getElementById("3d-fragment-shader").text;
   
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
    
    // only if fails
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }
  
  // build program from 2 shaders
  var program = createProgram(gl, vertexShader, fragmentShader);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  console.log(positionAttributeLocation);
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // var positions = [
  //   0, 0, -50, 1,
  //   0, 0.5, -50, 1,
  //   0.7, 0, -50, 1
  // ];

  var positionsArr = [
    new Vector(0, 0, 1, 1),
    new Vector(0, 0.5, 1, 1),
    new Vector(1, 0, 1, 1)
  ];

  var rotMat = rotation.getXYZRotMat(0, 0, 3.14/2.0);



  function degToRad(d) {
    return d * Math.PI / 180;
  }
      // Compute the perspective matrix
      var fieldOfViewRadians = degToRad(90);
      var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      var zNear = 1;
      var zFar = 2000;
      var perspectiveMatrix = perspective(fieldOfViewRadians, aspect, zNear, zFar);

      //now convert it to a 2d array

      var perspMat = [[],[],[],[]]

      for(var i = 0; i < 4; i++){
        perspMat[0].push(perspectiveMatrix[i]);
        perspMat[1].push(perspectiveMatrix[i+4]);
        perspMat[2].push(perspectiveMatrix[i+8]);
        perspMat[3].push(perspectiveMatrix[i+12]);
      }


      var myMatrix = matrixOps.matMul(perspMat, rotMat);


      var matrix = [];
      for(var i = 0; i < myMatrix.length; i++) {
        var matRow = myMatrix[i];
        for(var k = 0; k < myMatrix[i].length; k++) {
          matrix.push(matRow[k]);
        }
      }


  // positionsArr = rotation.rotateObjectAllAxes(positionsArr, 0.0, 0, (3.14183 / 2.0));

  console.log(positionsArr);

  var positions = [];
  for(var i = 0; i < positionsArr.length; i++) {
    var vect = positionsArr[i].as4Array();
    for(var k = 0; k < 4; k++) {
      positions.push(vect[k]);
    }
  }


  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  //resizeCanvas(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

gl.enableVertexAttribArray(positionAttributeLocation);

// Bind the position buffer.
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
var size = 4;          // 4 components per iteration
var type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer

  // lookup uniforms
  // var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer to put positions in
  //var positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  //gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Put geometry data into buffer
  //setGeometry(gl);

  // Draw the scene.
  function drawScene() {
    //webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);


    // set the resolution
    // gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // set the color
    // gl.uniform4fv(colorLocation, color);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

   var primitiveType = gl.TRIANGLES;
   var offset = 0;
   var count = 3;
   gl.drawArrays(primitiveType, offset, count);
}

drawScene()