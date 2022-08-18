const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math'); 
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

/**
 * Generative Wall Drawing #2 - Sol Exercise
 *  1. Using a 6x6 grid of evenly spaced points
 *  2. Connect two random points on the grid forming a trapezoid with two parallel
 *     sides extending down
 *  3. Fill the trapezoid with a color, then stroke with the background color
 *  4. Find another two random points and repeat continuing until all grid points 
 *     are exhausted
 *  5. Layer shapes by the average Y position of their two grid points
 * 
 */

const settings = {
  dimensions: [ 2048, 2048 ]
};

const usedPoints = {};
const trapezoids = [];

const createGrid = () => {
  const points = [];
  const count = 6;
  for (let x = 0; x < count; x++) {
    for (let y = 0; y < count; y++) {
      const u = x / (count - 1)
      const v = y / (count - 1)
      points.push([u,v]);
    }
  }
  return points;
}

let points = createGrid();
const margin = 100;

const sketch = () => {
  const palette = random.shuffle(random.pick(palettes));
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    console.log(points);
    points.forEach(data => {
      const [u, v] = data;
      // starting from each point check if it has been used
      if (usedPoints[`${u}:${v}`]) {
        // if used, skip
        return;
      } else {
        // if not used, generate trapezoid and fill color, do not draw until all
        //    are "created" to dictate z-order 
        usedPoints[`${u}:${v}`] = true;
        points = points.filter((d) => d !== data);
        let randomPoint = random.pick(points);
        usedPoints[`${randomPoint[0]}:${randomPoint[1]}`] = true;
        points = points.filter((d) => d !== randomPoint);
        const trapezoid = {
          points: [data, randomPoint, [u, 1], [randomPoint[0], 1]],
          color: random.pick(palette),
          averageY: (v+randomPoint[1])/2
        };
        trapezoids.push(trapezoid);
      }
    });
    const t = trapezoids[0];
    console.log(t);
    // context.beginPath();
    // console.log(t.points[3][0] * width - margin, t.points[3][1] * height - margin)
    // context.moveTo(t.points[3][0] * width + margin, t.points[3][1] * height + margin);
    // context.lineTo(t.points[1][0] * width - margin, t.points[1][1] * height - margin);
    // context.lineTo(t.points[0][0] * width - margin, t.points[0][1] * height - margin);
    // context.lineTo(t.points[2][0] * width - margin, t.points[2][1] * height - margin);
    // context.lineTo(t.points[3][0] * width - margin, t.points[3][1] * height - margin);
    // context.stroke();
    // context.fill();
    trapezoids.forEach(t => {
      // refer to docs https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
      // begin drawing
      context.save();
      context.beginPath();
      let trapezoid = new Path2D();
      trapezoid.moveTo(t.points[3][0] * width + margin, t.points[3][1] * height - margin);
      trapezoid.lineTo(t.points[1][0] * width - margin, t.points[1][1] * height + margin);
      trapezoid.lineTo(t.points[0][0] * width + margin, t.points[0][1] * height + margin);
      trapezoid.lineTo(t.points[2][0] * width - margin, t.points[2][1] * height - margin);
      trapezoid.lineTo(t.points[3][0] * width + margin, t.points[3][1] * height - margin);
      context.fillStyle = random.pick(palette);
      context.fill(trapezoid);
      
      context.restore();
    });
  }
};

canvasSketch(sketch, settings);
