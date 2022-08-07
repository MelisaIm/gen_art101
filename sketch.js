const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math'); // linear interpolation 
const random = require('canvas-sketch-util/random'); // pseudo random number generation 

const settings = {
  dimensions: [2048, 2048]
  // dimensions: 'A4',   // or any other common print sizes
  // units: 'in',    // or 'cm'
  // pixelsPerInch: 300 // by default it is 72
};

const sketch = () => {
  const createGrid = () => {
    const points = [];
    const count = 40;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        // work in uv space
        const u = count <= 1 ? 0.5 : x / (count - 1); // value between 0 and 1
        const v = count <= 1 ? 0.5 : y / (count - 1); 
        points.push([ u, v ]); 
      }
    }
    return points;
  }
  
  // const points = createGdotsrid();
  // const points = createGrid().filter(() => Math.random() > 0.5); // randomly remove points
  // can use deterministic random so it is the same every time
  random.setSeed(201);
  const points = createGrid().filter(() => random.value() > 0.5); // randomly remove points

  const margin = 200; 
  
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect( 0, 0, width, height );

    points.forEach(([u,v]) => {
      // const x = u * width;
      // const y = v * height;
      const x = lerp(margin, width - margin, u);
      const y = lerp (margin, height - margin, v);

      context.beginPath();
      context.arc( x , y, 5, 0, Math.PI * 2, false);
      context.strokeStyle = 'black';
      context.lineWidth = 20;
      context.stroke();
    }); 
  };
};

canvasSketch(sketch, settings);
 