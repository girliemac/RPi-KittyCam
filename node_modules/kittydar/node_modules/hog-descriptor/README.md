# hog-descriptor
hog-descriptor extracts a [Histogram of Oriented Gradients](http://en.wikipedia.org/wiki/Histogram_of_oriented_gradients) descriptor from an image (canvas):

```javascript
var hog = require("hog-descriptor");

var descriptor = hog.extractHOG(canvas);

console.log(descriptor); // [0.455, 0.003, 0.987, ...]
```

# Install

For node.js:

```bash
npm install hog-descriptor
```

# API

`extractHOG()` takes options for the cell size (default is `4` pixels), block size (default is `2` cells), block stride (default is `blockSize / 2`), number of bins per orientation histogram (default is `6`), and block normalization method (one of `"L1"`, `"L1-sqrt"`, and default `"L2"`):

```javascript
var options = {
  cellSize: 4,    // length of cell in px
  blockSize: 2,   // length of block in number of cells
  blockStride: 1, // number of cells to slide block window by (block overlap)
  bins: 6,        // bins per histogram
  norm: 'L2'      // block normalization method
}

var descriptor = hog.extractHOG(canvas, options);
```

# Other Goodies

In the process of computing a HOG descriptor, a bunch of other intermediate things have to be computed, like the image gradient, so these steps are also provided as secret goodies on the library:

#### intensities

Get a 2d array of the pixel intensities (normalized to fall between `0` and `1`):

```javascript
var intensities = hog.intensities(canvas);
```

The return array is indexed first by row (y direction) then by column (x direction).

#### gradients

Get a 2d array of the image gradient at each pixel of the canvas with respect to the vertical and horizontal directions using a `[-1, 0, 1]` filter:

```javascript
var gradients = hog.gradients(canvas);
```

Return looks like this:

```javascript
{
   x: [[0.0084, 0.354] /* , ... */],
   y: [[0.056, 0.7888] /* , ... */]
}
```

#### gradientVectors

Get a 2d array of the gradient vectors at each pixel of the canvas:

```javascript
var vectors = hog.gradientVectors(canvas);
```

Return value is the vector at each pixel with `mag` and `orient` for magnitude and orientation (in radians):

```javascript
[[{ mag: 0.4, orient: -1.52} /*, ... */]]
```

#### drawGreyscale

Greyscales a canvas:

```javascript
hog.drawGreyscale(canvas)
```
![x-gradient](https://raw.github.com/harthur/hog-descriptor/master/test/greyscale.jpg)

#### drawGradient

Draws the gradient of the canvas with respect to 'x' or 'y' direction:

```javascript
hog.drawGradient(canvas, 'x')
```

![x-gradient](https://raw.github.com/harthur/hog-descriptor/master/test/gradient-x.jpg)

```javascript
hog.drawGradient(canvas, 'y')
```

![y-gradient](https://raw.github.com/harthur/hog-descriptor/master/test/gradient-y.jpg)

#### drawMagnitude

Draws the magnitude of the gradient vectors over the canvas:

```javascript
hog.drawMagnitude(canvas)
```

![magnitude](https://raw.github.com/harthur/hog-descriptor/master/test/magnitude.jpg)
