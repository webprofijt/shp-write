module.exports.point = justType('Point', 'POINT', false);
module.exports.pointZ = justType('Point', 'POINTZ', true);
module.exports.line = justType('LineString', 'POLYLINE');
module.exports.polygon = justType('Polygon', 'POLYGON');

function justType(type, TYPE, just3d) {
    return function(gj) {
        var ofType = gj.features.filter(isType(type));
        var ofDimension = ofType.filter(isOfDimension(just3d));

        return {
            geometries: (TYPE === 'POLYGON' || TYPE === 'POLYLINE') ? [ofDimension.map(justCoords)] : ofDimension.map(justCoords),
            properties: ofDimension.map(justProps),
            type: TYPE
        };
    };
}

function justCoords(t) {
    if (t.geometry.coordinates[0] !== undefined &&
        t.geometry.coordinates[0][0] !== undefined &&
        t.geometry.coordinates[0][0][0] !== undefined) {
        // Unwraps rings
        return t.geometry.coordinates[0];
    } else {
        return t.geometry.coordinates;
    }
}

function justProps(t) {
    return t.properties;
}

function isType(t) {
    return function(f) { return f.geometry.type === t; };
}

function isOfDimension(just3d) {
    return function(f) { return just3d ? f.geometry.coordinates.length === 3 : f.geometry.coordinates.length === 2 }
}
