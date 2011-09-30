#!/usr/bin/env python

try:
	import argparse
	ap = 1
except ImportError:
	import optparse
	ap = 0

import os
import tempfile
import sys

COMMON_FILES = [
	'toxi.js',
	'core/math/MathUtils.js',
	'core/math/InterpolateStrategy.js',
	'core/math/ScaleMap.js',
	'core/math/Waves.js',
	'core/math/SinCosLUT.js',
	'core/math/conversion/UnitTranslator.js',
	'core/geom/Vec2D.js',
	'core/geom/Vec3D.js',
	'core/geom/Vec2D_post.js',
	'core/geom/Polygon2D.js',
	'core/geom/BernsteinPolynomial.js',
	'core/geom/Spline2D.js',
	'core/geom/Ellipse.js',
	'core/geom/Rect.js',
	'core/geom/Circle.js',
	'core/geom/CircleIntersector.js',
	'core/geom/Cone.js',
	'core/geom/Line2D.js',
	'core/geom/Triangle.js',
	'core/geom/Triangle2D.js',
	'core/geom/IsectData2D.js',
	'core/geom/IsectData3D.js',
	'core/geom/Matrix4x4.js',
	'core/geom/Quaternion.js',
	'core/geom/mesh/Vertex.js',
	'core/geom/mesh/Face.js',
	'core/geom/mesh/Mesh3D.js',
	'core/geom/mesh/TriangleMesh.js',
	'core/geom/Sphere.js',
	'core/geom/mesh/VertexSelector.js',
	'core/geom/mesh/Selectors.js',
	'core/geom/mesh/SphereFunction.js',
	'core/geom/mesh/SphericalHarmonics.js',
	'core/geom/mesh/SuperEllipsoid.js',
	'core/geom/mesh/SurfaceMeshBuilder.js',
	'core/geom/AxisAlignedCylinder.js',
	'core/geom/AABB.js',
	'core/geom/mesh/BezierPatch.js',
	'core/geom/XAxisCylinder.js',
	'core/geom/YAxisCylinder.js',
	'core/geom/ZAxisCylinder.js',
	'core/geom/Line3D.js',
	'core/geom/Ray2D.js',
	'core/geom/Ray3D.js'
]

COLOR_FILES = [
	'color/toxi-color.js',
	'color/TColor.js'
]


PHYSICS2D_FILES = [
	'physics/physics2d/physics2d.js',
	'physics/physics2d/VerletParticle2D.js',
	'physics/physics2d/VerletSpring2D.js',
	'physics/physics2d/behaviors/AttractionBehavior.js',
	'physics/physics2d/behaviors/ConstantForceBehavior.js',
	'physics/physics2d/behaviors/GravityBehavior.js',
	'physics/physics2d/constraints/AngularConstraint.js',
	'physics/physics2d/constraints/AxisConstraint.js',
	'physics/physics2d/constraints/CircularConstraint.js',
	'physics/physics2d/constraints/MaxConstraint.js',
	'physics/physics2d/constraints/MinConstraint.js',
	'physics/physics2d/constraints/RectConstraint.js',
	'physics/physics2d/ParticlePath2D.js',
	'physics/physics2d/ParticleString2D.js',
	'physics/physics2d/PullBackString2D.js',
	'physics/physics2d/VerletConstrainedSpring2D.js',
	'physics/physics2d/VerletMinDistanceSpring2D.js',
	'physics/physics2d/VerletPhysics2D.js'
]


def merge(files):

	buffer = []

	for filename in files:
		with open(os.path.join('..', 'src', filename), 'r') as f:
			buffer.append(f.read())

	return "".join(buffer)


def output(text, filename):

	with open(os.path.join('..', 'build', filename), 'w') as f:
		f.write(text)


def compress(text):

	in_tuple = tempfile.mkstemp()
	with os.fdopen(in_tuple[0], 'w') as handle:
		handle.write(text)

	out_tuple = tempfile.mkstemp()
	# os.system("java -jar yuicompressor-2.4.2.jar %s --type js -o %s --charset utf-8 -v" % (in_tuple[1], out_tuple[1]))
	os.system("java -jar compiler.jar --js %s --js_output_file %s" % (in_tuple[1], out_tuple[1]))

	with os.fdopen(out_tuple[0], 'r') as handle:
		compressed = handle.read()

	os.unlink(in_tuple[1])
	os.unlink(out_tuple[1])

	return compressed


def addHeader(text, endFilename):
	with open(os.path.join('.', 'REVISION'), 'r') as handle:
		revision = handle.read().rstrip()

	return ("// %s r%s - http://github.com/hapticdata/toxiclibsjs\n" % (endFilename, revision)) + text


def makeDebug(text):
	position = 0
	while True:
		position = text.find("/* DEBUG", position)
		if position == -1:
			break
		text = text[0:position] + text[position+8:]
		position = text.find("*/", position)
		text = text[0:position] + text[position+2:]
	return text


def buildLib(files, debug, outputFilename):

	text = merge(files)

	if debug:
		outputFilename = 'uncompressed/' + outputFilename + '-debug'
		text = addHeader( makeDebug(text) ,outputFilename)
	else:
		text = addHeader(compress(text),outputFilename)

	outputFilename = outputFilename + '.js'

	print "=" * 40
	print "Compiling", outputFilename
	print "=" * 40
	
	output(text, outputFilename)


def buildIncludes(files, outputFilename):

	template = '\t\t<script type="text/javascript" src="../src/%s"></script>'
	text = "\n".join(template % f for f in files)

	output(text, outputFilename + '.js')


def parse_args():

	if ap:
		parser = argparse.ArgumentParser(description='Build and compress toxiclibs.js')
		parser.add_argument('--includes', help='Build includes.js', action='store_true')
		parser.add_argument('--physics2d', help='Build toxi-physics2d.js', action='store_true')
		parser.add_argument('--core', help='Build toxi-core.js', action='store_true')
		parser.add_argument('--color', help='Build toxi-color.js', action='store_true')
		parser.add_argument('--common', help='Build toxiclibs.js', action='store_const', const=True)
		parser.add_argument('--debug', help='Generate debug versions', action='store_const', const=True, default=False)
		parser.add_argument('--all', help='Build all Toxiclibs.js versions', action='store_true')

		args = parser.parse_args()

	else:
		parser = optparse.OptionParser(description='Build and compress toxiclibs.js')
		parser.add_option('--includes', dest='includes', help='Build includes.js', action='store_true')
		parser.add_option('--physics2d', dest='physics2d', help='Build toxi-physics2d.js', action='store_true')
		parser.add_option('--core', dest='core', help='Build toxi-core.js', action='store_true')
		parser.add_option('--color', dest='color', help='Build toxi-color.js', action='store_true')
		parser.add_option('--common', dest='common', help='Build toxiclibs.js', action='store_const', const=True)
		parser.add_option('--debug', dest='debug', help='Generate debug versions', action='store_const', const=True, default=False)
		parser.add_option('--all', dest='all', help='Build all Toxiclibs.js versions', action='store_true')

		args, remainder = parser.parse_args()

	# If no arguments have been passed, show the help message and exit
	if len(sys.argv) == 1:
		parser.print_help()
		sys.exit(1)

	return args


def main(argv=None):

	args = parse_args()
	debug = args.debug

	config = [
		['toxiclibs','common', COMMON_FILES + COLOR_FILES + PHYSICS2D_FILES, args.common],
		['toxi-core','core', COMMON_FILES, args.core],
		['toxi-color','color', COLOR_FILES, args.color],
		['toxi-physics2d','physics2d', PHYSICS2D_FILES, args.physics2d]
	]

	for fname_lib, fname_inc, files, enabled in config:
		if enabled or args.all:
			buildLib(files, debug, fname_lib)
			if args.includes:
				buildIncludes(files, fname_inc)

if __name__ == "__main__":
	main()

