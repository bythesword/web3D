let shader_2=`precision mediump float;

  void main() {
    gl_FragColor = vec4(0, 1, 0, 1); // return redish-purple
  }`

let shader_1=`  attribute vec4 a_position;

  uniform vec2 u_resolution;

  void main() {
     // convert the position from pixels to 0.0 to 1.0
     vec2 zeroToOne = a_position.xy / u_resolution;

     // convert from 0->1 to 0->2
     vec2 zeroToTwo = zeroToOne * 2.0;

     // convert from 0->2 to -1->+1 (clipspace)
     vec2 clipSpace = zeroToTwo - 1.0;

     gl_Position = vec4(clipSpace, 0, 1);
     gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);// 左上0，0
  }`  




function mainRed() {
  // Get A WebGL context
  // var canvas = document.querySelector("#c");
  // gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // Use our boilerplate utils to compile the shaders and link into a program
  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d-red"]);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // look up uniform locations
  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

  // Create a buffer to put three 2d clip space points in
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  var positions = [
    15, 20,
    gl.canvas.width / 2, 20,
    15, gl.canvas.height / 2,
    15, gl.canvas.height / 2,
    gl.canvas.width / 2, 20,
    gl.canvas.width / 2, gl.canvas.height / 2,
  ];
  // var positions = [
  //   10, 20,
  //   80, 20,
  //   10, 30,
  //   10, 30,
  //   80, 20,
  //   80, 30,
  // ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  // gl.clearColor(0, 0, 0, 0);
  // gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);

  // set the resolution
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  // draw
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 6;
  gl.drawArrays(primitiveType, offset, count);
}