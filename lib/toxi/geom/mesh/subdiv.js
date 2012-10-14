define([
	'require',
	'exports',
	'./subdiv/SubdivisionStrategy',
	'./subdiv/DisplacementSubdivision',
	'./subdiv/DualDisplacementSubdivision',
	'./subdiv/DualSubdivision',
	'./subdiv/EdgeLengthComparator',
	'./subdiv/FaceCountComparator',
	'./subdiv/MidpointDisplacementSubdivision',
	'./subdiv/MidpointSubdivision',
	'./subdiv/NormalDisplacementSubdivision',
	'./subdiv/TriSubdivision'
], function( require, exports ){
	exports.DisplacementSubdivision = require('./subdiv/DisplacementSubdivision');
	exports.DualDisplacementSubdivision = require('./subdiv/DualDisplacementSubdivision');
	exports.DualSubdivision = require('./subdiv/DualSubdivision');
	exports.EdgeLengthComparator = require('./subdiv/EdgeLengthComparator');
	exports.FaceCountComparator = require('./subdiv/FaceCountComparator');
	exports.MidpointDisplacementSubdivision = require('./subdiv/MidpointDisplacementSubdivision');
	exports.MidpointSubdivision = require('./subdiv/MidpointSubdivision');
	exports.NormalDisplacementSubdivision = require('./subdiv/NormalDisplacementSubdivision');
	exports.SubdivisionStrategy = require('./subdiv/SubdivisionStrategy');
	exports.TriSubdivision = require('./subdiv/TriSubdivision');
});