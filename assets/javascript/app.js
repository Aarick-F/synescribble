paper.install(window);

$(document).ready(() => {
  // Firebase setup
  var config = {
    apiKey: "AIzaSyBIxDWLxlf5c7pARWt5wL1LhhiODNA3LMY",
    authDomain: "synescribble.firebaseapp.com",
    databaseURL: "https://synescribble.firebaseio.com",
    projectId: "synescribble",
    storageBucket: "",
    messagingSenderId: "648660572319"
  };
  firebase.initializeApp(config);

  // Assigning our Database and our Canvas to a variable
  const database = firebase.database();
  const canvas = document.getElementById("drawingSurface");
  // Initializing Paper.js to avoid scope issues
  paper.setup(canvas);

  // Paper.js Tool object constructor, handles the drawing functions below
  const tool = new Tool();
  // Default color assignment
  let color = "#000";
  // Initialize a variable to create paths in our drawing functions
  let path;

  // let drawing = {
  //   paths: [],
  //   colors: [],
  //   creator: ""
  // };

  // let line = [];
  

  // On mouse down...
  tool.onMouseDown = e => {
    // the path variable becomes a Path object via a Paper.js Object Cosntructor
    path = new Path({
      // the point where the mouse was clicked is added to a segments array
      segments: [e.point],
      // stroke color is assigned as the color assigned to the color variable
      strokeColor: color,
      // the width of the stroke is set to 5 pixels
      strokeWidth: 5
    });
    // drawing.colors.push(color);
  }

  // On mouse drag...
  tool.onMouseDrag = e => {
    // Every time the mouse is dragged, a point given to us by the event argument is added
    // to the segments array
    path.add(e.point);
    // line.push(e.point);
  }

  // On mouse up...
  tool.onMouseUp = e => {
    // .simplfy, a Paper.js method, "smooths" the line and removes imperfections
    path.simplify(10);
    // drawing.paths.push(line);
    // console.log(drawing);
  }

  // These are example color switch buttons
  $(document).on("click", "#makeRed", () => {
    color = "#F00";
  });

  $(document).on("click", "#makeBlack", () => {
    color = "#000";
  });

  // On submit click...
  $("#submit").on("click", () => {
    // Convert Drawing Surface to image data
    let canvasImage = canvas.toDataURL();
    // Push image data to the database
    database.ref().push(canvasImage);

    // drawing = {
    //   paths: [],
    //   colors: [],
    //   creator: ""
    // };

    // Clear the current drawing surface
    project.clear();
  });

  // Example button that scales the image of the gallery images down
  $("#scale").on("click", function() {
    $(".myCanvas").toggleClass("scale");
  });

  // When a new child (aka drawing) is added to the database,
  // pass the data to a function that builds and puts the drawing
  // into the gallery
  database.ref().on("child_added", function(snapshot) {
    let data = snapshot.val();
    makeCanvas(data);
  });

  // Function that handles the creation of the gallery item
  function makeCanvas(drawing) {
    let canvasItem = $("<img src='" + drawing + "' class='myCanvas'/>");
    let databaseDrawing = canvasItem;
    $("#gallery").append(canvasItem);
  }

});