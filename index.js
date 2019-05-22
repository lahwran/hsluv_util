const hsluv = require('hsluv');

function hpluvToHsluv(a) {
  var b = hsluv.hpluvToLch(a);
  var c = hsluv.lchToHsluv(b);
  return c;
}
function hsluvToHpluv(a) {
  var b = hsluv.hsluvToLch(a);
  var c = hsluv.lchToHpluv(b);
  return c;
}
// variable distortion - allows configuring how much of the space above hpluv to use
function vd(h,s,l,distortion) {
  var triplet = [h, 1, l];
  var hsluv_pastel = hpluvToHsluv(triplet);
  var pastel_max = hsluv_pastel[1];
  var s2 = s * (distortion + pastel_max * (1-distortion))
  return [h,s2,l];
}
function ivd(h,s2,l,distortion) {
  var triplet = [h, 1, l];
  var hsluv_pastel = hpluvToHsluv(triplet);
  var pastel_max = hsluv_pastel[1];
  var s = s2 / (distortion + pastel_max * (1-distortion))
  return [h,s,l];
}
function hsl(h, s, l, a=1, distortion=0.5) {
  var triplet = vd(h,s,l,distortion);
  if (a == 1) {
    return hsluv.hsluvToHex(triplet);
  } else {
    var rgb = hsluv.hsluvToRgb(triplet).map(function(x) {return Math.min(Math.max((x*256)|0,0),255);});
    return "rgba("+rgb[0]+", "+rgb[1]+", "+rgb[2]+", "+a+")";
  }
}
function tohsl(hex, distortion=0.5) {
  var triplet = hsluv.hexToHsluv(hex).map(Math.round);
  var hsl_triplet = ivd(triplet[0], triplet[1], triplet[2]);
  return "hsl("+triplet[0]+", "+triplet[1]+", "+triplet[2]+")";
}
function rgba(r,g,b,a, distortion=0.5) {
  var triplet = hsluv.lchToHsluv(hsluv.rgbToLch([r,g,b])).map(Math.round);
  var hsl_triplet = ivd(triplet[0], triplet[1], triplet[2]);
  return "hsl("+triplet[0]+", "+triplet[1]+", "+triplet[2]+", "+a+")";
}


module.exports = {
    vd: vd,
    ivd: ivd,
    hsl: hsl,
    tohsl: tohsl,
    rgba: rgba,
};
