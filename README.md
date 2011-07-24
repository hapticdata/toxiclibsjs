[Toxiclibs.js](http://haptic-data.com/toxiclibsjs) is a javascript port of [Karsten Schmidt's Toxiclibs](http://toxiclibs.org) for Java and Processing. Toxiclibs.js works great with the Processing.js visualization library for <canvas> but is not dependent on it. It can be used with any other library or by itself.



* Examples of toxiclibs.js can be found at [http://haptic-data.com/toxiclibsjs](http://haptic-data.com/toxiclibsjs), and are included in the examples/ folder of the repository.
* Examples of the original library can be found at [http://toxiclibs.org](http://toxiclibs.org)


### A few examples ###
[![additive_waves](http://haptic-data.com/toxiclibsjs/img/additive_waves.jpg)](http://haptic-data.com/toxiclibsjs/examples/AdditiveWaves_pjs-webgl.html)
[![smooth_doodle](http://haptic-data.com/toxiclibsjs/img/smooth_doodle.gif)](http://haptic-data.com/toxiclibsjs/examples/SmoothDoodle_canvas.html)
[![polar_unravel](http://haptic-data.com/toxiclibsjs/img/polar_unravel.gif)](http://haptic-data.com/toxiclibsjs/examples/PolarUnravel_pjs.html)
[![circle_3_points](http://haptic-data.com/toxiclibsjs/img/circle_3_points.gif)](http://haptic-data.com/toxiclibsjs/examples/Circle3Points_pjs.html)
[![line2d_intersection](http://haptic-data.com/toxiclibsjs/img/line2d_intersection.gif)](http://haptic-data.com/toxiclibsjs/examples/Line2DIntersection_pjs.html)
[![attraction2d](http://haptic-data.com/toxiclibsjs/img/physics2d_attraction2d.gif)](http://haptic-data.com/toxiclibsjs/examples/Attraction2D_pjs.html)
[![draggable_particles](http://haptic-data.com/toxiclibsjs/img/physics2d_draggableparticles.gif)](http://haptic-data.com/toxiclibsjs/examples/DraggableParticles_pjs.html)
[![softbody_square](http://haptic-data.com/toxiclibsjs/img/physics2d_softbodysquare.gif)](http://haptic-data.com/toxiclibsjs/examples/SoftBodySquare_pjs.html)




classes currently in the toxiclibs.js compiled build:

Geometry (toxi. namespace)

* AABB
* AxisAlignedCylinder
* BernsetinPolynomial
* Circle
* CircleIntersector
* Cone
* Ellipse
* IsectData2D
* IsectData3D
* Line2D
* Line3D
* Matrix4x4
* Polygon2D
* Quaternion
* Ray2D
* Ray3D
* Ray3DIntersector
* Rect
* Sphere
* Spline2D
* Triangle
* Triangle2D
* Vec2D
* Vec3D
* XAxisCylinder
* YAxisCylinder
* ZAxisCylinder
* Mesh->
 * BezierPatch
 * Face
 * BoxSelector
 * DefaultSelector
 * PlaneSelector
 * VertexSelector
 * SphereFunction
 * SphericalHarmonics
 * SuperEllipsoid
 * SurfaceMeshBuilder
 * TriangleMesh
 * Vertex

Math (toxi. namespace)

* MathUtils
* InterpolationStrategy (abstract)
* BezierInterpolation
* CircularInterpolation
* CosineInterpolation
* DecimatedInterpolation
* ExponentialInterpolation
* Interpolation2D
* LinearInterpolation
* SigmoidInterpolation
* ThresholdInterpolation
* ZoomLensInterpolation
* ScaleMap
* SinCosLUT
* Waves->
 * AbstractWave (abstract)
 * AMFMSineWave
 * FMHarmonicSquareWave
 * FMSawtoothWave
 * FMSineWave
 * FMSquareWave
 * FMTriangleWave
 * SineWave

Color (toxi.color. namespace)

* TColor

VerletPhysics2D (toxi.physics2d namespace)

* 	VerletParticle2D
*	VerletSpring2D
* Behaviors ->
 *	AttractionBehavior
 *	ConstantForceBehavior
 *	GravityBehavior
* Constraints->
 *	AngularConstraint
 *	AxisConstraint
 *	CircularConstraint
 *	MaxConstraint
 *	MinConstraint
 *	RectConstraint
*	ParticlePath2D
*	ParticleString2D
*	PullBackString2D
*	VerletConstrainedSpring2D
*	VerletMinDistanceSpring2D
*	VerletPhysics2D



[http://haptic-data.com/toxiclibsjs](Toxiclibs.js) was initiated on 1/5/2011 by Kyle Phillips [http://haptic-data.com](http://haptic-data.com)



This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

[http://creativecommons.org/licenses/LGPL/2.1/](http://creativecommons.org/licenses/LGPL/2.1/)

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA