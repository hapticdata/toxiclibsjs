define(["require", "exports", "module", "../math/mathUtils","./Matrix4x4"], function(require, exports, module) {

var mathUtils = require('../math/mathUtils'),
	Matrix4x4 = require('./Matrix4x4');

/**
 * @class
 * @member toxi
 */
var	Quaternion = function (qw,vx,y,z){
	if(arguments.length == 4){
		this.w = qw;
		this.x = vx;
		this.y = y;
		this.z = z;
	} else if(arguments.length == 2){
		this.x = vx.x;
		this.y = vx.y;
		this.z = vx.z;
		this.w = qw;
	} else if(arguments.length == 1) {
		this.w = q.w;
		this.x = q.x;
		this.y = q.y;
		this.z = q.z;
	}
};


Quaternion.prototype = {
	add: function(q){
		return new Quaternion(this.x + q.x, this.y + q.y, this.z + q.z, this.w + q.w);
	},
	addSelf: function(q){
		this.x += q.x;
		this.y += q.y;
		this.z += q.z;
		return this;
	},
	copy: function(){
		return new Quaternion(this.w,this.x,this.y,this.z);
	},
	dot: function(q){
		return (this.x * q.x) + (this.y * q.y) + (this.z * q.z) + (this.w * q.w);
	},
	getConjugate: function(){
		var q = new Quaternion();
		q.x = -this.x;
		q.y = -this.y;
		q.z = -this.z;
		q.w = w;
		return q;
	},
	identity: function(){
		this.w = 1.0;
		this.x = 0.0;
		this.y = 0.0;
		this.z = 0.0;
		return this;
	},
	interpolateTo: function(target,t,is){
		return (arguments.length == 3) ? this.copy().interpolateTo(target,is.interpolate(0,1,t)) : this.copy().interpolateToSelf(target,t);
	},
	interpolateToSelf: function(target,t,is){
		if(arguments.length == 3){
			t = is.interpolate(0,1,t);
		}
		var scale,
			invscale,
			dot = mathUtils.clip(this.dot(target),-1,1);
			if((1.0-dot) >= mathUtils.EPS){
				var theta = Math.acos(dot);
				var invsintheta = 1.0 / Math.sin(theta);
				scale = (Math.sin(theta *(1.0 - t)) * invsintheta);
				invscale = (Math.sin(theta * t) * invsintheta);
			} else {
				scale = 1 - t;
				invscale = t;
			}
			if(dot < 0.0){
				this.w = scale * this.w - invscale * target.w;
				this.x = scale * this.x - invscale * target.x;
				this.y = scale * this.y - invscale * target.y;
				this.z = scale * this.z - invscale * target.z;
			} else {
				this.w = scale * w + invscale * target.w;
				this.x = scale * x + invscale * target.x;
				this.y = scale * y + invscale * target.y;
				this.z = scale * z + invscale * target.z;
			}
			return this;
	},
	magnitude: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	},
	multiply: function(q2){
		var res = new Quaternion();
		res.w = this.w * q2.w - x * q2.x - y * q2.y - z * q2.z;
		res.x = this.w * q2.x + x * q2.w + y * q2.z - z * q2.y;
		res.y = this.w * q2.y + y * q2.w + z * q2.x - x * q2.z;
		res.z = this.w * q2.z + z * q2.w + x * q2.y - y * q2.x;
		
		return res;
	},
	normalize: function(){
		var mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
		if(mag > mathUtils.EPS){
			mag = 1 / mag;
			this.x *= mag;
			this.y *= mag;
			this.z *= mag;
			this.w *= mag;
		}
		return this;
	},
	scale: function(t){
		return new Quaternion(this.x * t, this.y * t, this.z * t, this.w * t);
	},
	scaleSelf: function(t){
		this.x *= t;
		this.y *= t;
		this.z *= t;
		this.w *= t;
		return this;
	},
	set: function(w,x,y,z){
		if(arguments.length == 4){
			this.w = w;
			this.x = x;
			this.y = y;
			this.z = z;
		} else if(arguments.length == 2){
			this.w = w;
			this.x = v.x;
			this.y = v.y;
			this.z = v.z;
		}
		else { //must be 1
			this.w = q.w;
			this.x = q.x;
			this.y = q.y;
			this.z = q.z;
		}
		return this;
	},
	sub: function(q){
		return new Quaternion(this.x - q.x, this.y - q.y, this.z - q.z, this.w - q.w);
	},
	subSelf: function(q){
		this.x -= q.x;
		this.y -= q.y;
		this.z -= q.z;
		this.w -= q.w;
		return this;
	},
	toArray: function(){
		return [this.w,this.x,this.y,this.z];
	},
	toAxisAngle: function(){
		var res = [];
		var sa = Math.sqrt(1.0 - this.w * this.w);
		if(sa < mathUtils.EPS){
			sa = 1.0;
		} else {
			sa = 1.0 / sa;
		}
		res[0] = Math.acos(this.w) * 2.0;
		res[1] = this.x * sa;
		res[2] = this.y * sa;
		res[3] = this.z * sa;
		return res;
	},
	toMatrix4x4: function(result){
		if(result === undefined){
			result = new Matrix4x4();
		}
		var x2 = this.x + this.x;
		var y2 = this.y + this.y;
		var z2 = this.z + this.z;
		var xx = this.x * x2;
		var xy = this.x * y2;
		var xz = this.x * z2;
		var yy = this.y * y2;
		var yz = this.y * z2;
		var zz = this.z * z2;
		var wx = this.w * x2;
		var wy = this.w * y2;
		var wz = this.w * z2;
		
		var st = x2 +','+y2+','+z2+','+xx+','+xy+','+xz+','+yy+','+yz+','+zz+','+wx+','+wy+','+wz;
		return result.set(
			1 - (yy + zz), xy - wz, xz + wy, 0, xy + wz,
			1 - (xx + zz), yz - wx, 0, xz - wy, yz + wx, 1 - (xx + yy), 0,
			0, 0, 0, 1
		);
	},
	toString: function(){
		return "{axis: ["+this.x+","+this.y+","+this.z+"], w: "+this.w+"}";
	}
	
};

Quaternion.DOT_THRESHOLD = 0.9995;

Quaternion.createFromAxisAngle = function(axis,angle){
	angle *= 0.5;
	var sin = mathUtils.sin(angle),
		cos = mathUtils.cos(angle),
		q = new Quaternion(cos,axis.getNormalizedTo(sin));
	return q;
};

Quaternion.createFromEuler = function(pitch,yaw,roll){
	pitch *= 0.5;
	yaw *=0.5;
	roll *= 0.5;
	
	var sinPitch = mathUtils.sin(pitch),
		cosPitch = mathUtils.cos(pitch),
		sinYaw = mathUtils.sin(yaw),
		cosYaw = mathUtils.cos(yaw),
		sinRoll = mathUtils.sin(roll),
		cosRoll = mathUtils.cos(roll);
	
	var cosPitchCosYaw = cosPitch * cosYaw,
		sinPitchSinYaw = sinPitch * sinYaw;
		
		var q = new Quaternion();
		q.x = sinRoll * cosPitchCosYaw - cosRoll * sinPitchSinYaw;
		q.y = cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw;
		q.z = cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw;
		q.w = cosRoll * cosPitchCosYaw + sinRoll * sinPitchSinYaw;
		
		return q;
};

Quaternion.createFromMatrix = function(m){
	var s = 0.0;
	var q = [];
	var trace = m.matrix[0][0] + m.matrix[1][1] + m.matrix[2][2];
	
	if(trace > 0.0){
		s = Math.sqrt(trace + 1.0);
		q[3] = s * 0.5;
		s = 0.5 / s;
		q[0] = (m.matrix[1][2] - m.matrix[2][1] * s);
		q[1] = (m.matrix[2][0] - m.matrix[0][2] * s);
		q[2] = (m.matrix[0][1] - m.matrix[1][0] * s);
	} else {
		
		var nxt = [ 1, 2, 0 ];
        var i = 0, j = 0, k = 0;

        if (m.matrix[1][1] > m.matrix[0][0]) {
            i = 1;
        }

        if (m.matrix[2][2] > m.matrix[i][i]) {
            i = 2;
        }

        j = nxt[i];
        k = nxt[j];
        s = Math.sqrt((m.matrix[i][i] - (m.matrix[j][j] + m.matrix[k][k])) + 1.0);

        q[i] = s * 0.5;
        s = 0.5 / s;
        q[3] = (m.matrix[j][k] - m.matrix[k][j]) * s;
        q[j] = (m.matrix[i][j] + m.matrix[j][i]) * s;
        q[k] = (m.matrix[i][k] + m.matrix[k][i]) * s;
    }
    
     return new Quaternion(q[3],q[0],q[1],q[2]);
 };
 
 Quaternion.getAlignmentQuat = function(dir,forward){
		var target = dir.getNormalized(),
			axis = forward.cross(target),
			length = axis.magnitude() + 0.0001,
			angle = Math.atan2(length, forward.dot(target));
        return this.createFromAxisAngle(axis, angle);
 };

 module.exports = Quaternion;
});
