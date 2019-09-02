document.addEventListener('DOMContentLoaded', function(){
  // If/else mobile detection credit to: https://stackoverflow.com/a/3540295
  // Canvas erase effect credit to: https://codepen.io/karlovidek/pen/eGGvMb

  // Hide cursor on mobile devices
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    document.querySelector('body').style.cursor = 'default';
    document.querySelector('#small-circle').style.display = 'none';
    document.querySelector('#big-circle').style.display = 'none';
  }

  // Change color of cursor on anchore link hover
  var catchAllLinks = document.querySelectorAll('a');

  for(var i = 0; i < catchAllLinks.length; i++){
    catchAllLinks[i].addEventListener('mouseenter', function() {
      document.querySelector('#small-circle').style.backgroundColor = 'rgba(25,0,225,1)';
      document.querySelector('#small-circle').style.width = '8px';
      document.querySelector('#small-circle').style.height = '8px';
      // document.querySelector('#big-circle').style.borderColor = 'rgba(25,0,225,1)';
    });
    catchAllLinks[i].addEventListener('mouseleave', function() {
      document.querySelector('#small-circle').style.backgroundColor = 'rgba(0,0,0,1)';
      document.querySelector('#small-circle').style.width = '5px';
      document.querySelector('#small-circle').style.height = '5px';
      // document.querySelector('#big-circle').style.borderColor = 'rgba(0,0,0,1)';
    });
  }

  // Get the #canvas-overlay and #canvas-lines canvas elements and set getContext to 2d
  var canvas = document.querySelector('#canvas-overlay');
  var canvasContext = canvas.getContext('2d');
  var lineCanvas = document.querySelector('#canvas-lines');
  var lineCanvasContext = lineCanvas.getContext('2d');
  // Lenght of time canvas line remains on screen.
  var pointLifetime = 200;
  // Empty array to be populated on mousemove/touch events, see onMouseMove, onTouchStart, onTouchMove.
  var points = [];

  // Set color of canvas rectangle for #canvas-overlay
  canvasContext.fillStyle="rgba(255, 255, 255, 1)";
  // Draw canvas rectangle for #canvas-overlay
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  // Set event listeners for mousemove and window resize.
  function init() {
    // Set display of #canvas-overlay and #canvas-lines to none, to prevent weird flashing of gradient background on page load.
    document.querySelector('#canvas-overlay').style.display = 'none';
    document.querySelector('#canvas-lines').style.display = 'none';

    document.addEventListener('mousemove', function(event) {
      document.querySelector('body').style.cursor = 'none';
      document.querySelector('#small-circle').style.transform = `translate3d(${event.clientX}px,${event.clientY}px, 0px)`;
      // document.querySelector('#big-circle').style.cssText = `transform: translate3d(${event.clientX}px,${event.clientY}px, 0px);`;
    });
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchmove', onTouchMove);
    window.addEventListener('resize', resizeCanvases);
    window.addEventListener('orientationchange', resizeCanvases);
    resizeCanvases();
    tick();
  }

  init();

  // Reset the size of each canvas on scren resize or device orientation.
  function resizeCanvases() {
    // Set display of #canvas-overlay to none, to prevent weird flashing of gradient background on resize.
    document.querySelector('#canvas-overlay').style.display = 'none';
    // The width of both canvases is equal to the width of the user's browser window.
    canvas.width = lineCanvas.width = window.innerWidth;
    // The height of both canvases is equal to the height of the user's browser window.
    canvas.height = lineCanvas.height = window.innerHeight;
  }

  // Reset display of #canvas-overlay to visible on mouse movement, or touch events.
  function checkCanvasDisplay() {
    var isCanvasOverlayDisplayed = document.querySelector('#canvas-overlay').style.display;
    var isCanvasLinesDisplayed = document.querySelector('#canvas-lines').style.display;

    if(isCanvasOverlayDisplayed && isCanvasLinesDisplayed != 'block'){
      document.querySelector('#canvas-overlay').style.display = 'block';
      document.querySelector('#canvas-lines').style.display = 'block';
    }
    return;
  }

  // Handle mousemove event.
  function onMouseMove(event) {
    setTimeout(function(){
      checkCanvasDisplay();
    }, 275)
    // Add into "points" array a new object everytime a mousemove event is detected, with the following: time, x position, y position.
    points.push({
      // Time is needed for requestAnimationFrame(?). The points here are used to create previous and new paths.
      time: Date.now(),
      x: event.clientX,
      y: event.clientY
    });
  }

  // Touchstart event that might be working...? Works on Chrome at least.
  function onTouchStart(event) {
    checkCanvasDisplay();

    event.preventDefault();
    points.push({
      time: Date.now(),
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    });
  }

  // Handle touchmove events for mobile/touch devices.
  function onTouchMove(event) {
    checkCanvasDisplay();

    points.push({
      time: Date.now(),
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    });
  }

  // Remove older points.
  function tick() {
    // From "points" array filter only each point that returns true if age is less than pointLifetime.
    points = points.filter(function(point) {
      var age = Date.now() - point.time;
      return age < pointLifetime;
    });
    // Run "drawLineCanvas". Clears the canvas and draws a new path.
    drawLineCanvas();
    // Run "drawImageCanvas".
    drawImageCanvas();

    // (function () {
    //   var lastTime = 0;
    //   var vendors = ['ms', 'moz', 'webkit', 'o'];
    //   for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    //     window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    //     window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    //   }
    //   if(!window.requestAnimationFrame)
    //     window.requestAnimationFrame = function (callback, element) {
    //       var currTime = new Date().getTime();
    //       var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    //       var id = window.setTimeout(function () {
    //         callback(currTime + timeToCall);
    //       },
    //       timeToCall);
    //       lastTime = currTime + timeToCall;
    //       return id;
    //   };
    //   if(!window.cancelAnimationFrame)
    //     window.cancelAnimationFrame = function (id) {
    //       clearTimeout(id);
    //   };
    // }());

    // Request tick() to be called again before a new animation is drawn.
    requestAnimationFrame(tick);
  }

  function drawLineCanvas() {
    // Set the end points of a line to be round.
    lineCanvasContext.lineCap = 'round';
    // Set value of shadow for 2D context of #canvas-lines.
    lineCanvasContext.shadowBlur = 10;
    // Set the color of the shadow.
    lineCanvasContext.shadowColor = 'rgba(88,88,255,1)';
    // Set the width of the canvas' line.
    lineCanvasContext.lineWidth = 400;
    // Set the height of the canvas' line (prevents distortion when using screen.width/height).
    lineCanvasContext.lineHeight = 400;

    // First thing: reset the canvas area to blank.
    lineCanvasContext.clearRect(0, 0, lineCanvas.width, lineCanvas.height);

    // For
    // If the length of array items in "points" is larger than "i", then add 1 to "i".
    for (var i = 1; i < points.length; i++) {
      // Get each individual "point".
      var point = points[i];
      // Get the previous/last "point".
      var previousPoint = points[i - 1];

      // Fade points as they age.
      var age = Date.now() - point.time;
      var opacity = (pointLifetime - age * 0) / pointLifetime;
      lineCanvasContext.strokeStyle = 'rgba(88,88,255, ' + opacity + ')';

      // Create a new path.
      lineCanvasContext.beginPath();
      // Move the new path to be at the previous point x and y.
      lineCanvasContext.moveTo(previousPoint.x, previousPoint.y);
      // Create a line from current point x and y.
      lineCanvasContext.lineTo(point.x, point.y);
      // Draw a stroke on the path using the present strokeStyle (rgba(0,0,0,1)).
      lineCanvasContext.stroke();
    }
  }

  function drawImageCanvas() {
    canvasContext.globalCompositeOperation = 'source-over';
    canvasContext.save();
    canvasContext.fillStyle="rgba(255, 255, 255, 1)";
    canvasContext.globalAlpha = 0.099;
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.restore();
    canvasContext.globalCompositeOperation = 'destination-out';
    canvasContext.drawImage(lineCanvas, 0, 0);

  }
});
