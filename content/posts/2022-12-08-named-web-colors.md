---
title: Web Color Wheel
tags: code
---
<style>
.swatch {
  display: inline-block;
  min-width: 5em;
  border: 1px solid gray;
}
#about-link {
  margin: 1ex;
  position: absolute;
  right: 0;
  text-decoration: none;
  top: 0;
}
#about {
  background: white;
  border: 2px solid black;
  display: none;
  color: black;
  left: 0;
  margin: 0 25%;
  padding: 0 1ex;
  position: fixed;
  text-align: left;
  top: 7em;
}
#about:target {
  display: block;
}
#about .close {
  color: black;
  float: right;
  margin: 1ex 0 1ex 1ex;
  text-decoration: none;
}
svg {
  clip-path: circle(300px at center);
}
polygon { stroke-width: 1px; }
</style>
<figure class="my-3xl">
<svg
    baseProfile="full"
    height="600"
    version="1.1"
    viewbox="0 0 1024 1024"
    width="600"
    xmlns="http://www.w3.org/2000/svg"
    ></svg>
    <div class="h-ryt-xl py-ryt" id="preview"></div>
    <figcaption><cite>Web Color Wheel</cite> by <a href="http://arantius.com">Anthony Lieuallen</a>. View the source on <a href="https://github.com/arantius/web-color-wheel">GitHub</a>.</figcaption>
    </figure>
<!-- https://github.com/gorhill/Javascript-Voronoi -->
<script>
    /*!
Copyright (C) 2010-2013 Raymond Hill: https://github.com/gorhill/Javascript-Voronoi
MIT License: See https://github.com/gorhill/Javascript-Voronoi/LICENSE.md
*/
;
function Voronoi(){this.vertices=null;this.edges=null;this.cells=null;this.toRecycle=null;this.beachsectionJunkyard=[];this.circleEventJunkyard=[];
this.vertexJunkyard=[];this.edgeJunkyard=[];this.cellJunkyard=[]}Voronoi.prototype.reset=function(){if(!this.beachline){this.beachline=new this.RBTree()
}if(this.beachline.root){var a=this.beachline.getFirst(this.beachline.root);while(a){this.beachsectionJunkyard.push(a);a=a.rbNext
}}this.beachline.root=null;if(!this.circleEvents){this.circleEvents=new this.RBTree()}this.circleEvents.root=this.firstCircleEvent=null;
this.vertices=[];this.edges=[];this.cells=[]};Voronoi.prototype.sqrt=Math.sqrt;Voronoi.prototype.abs=Math.abs;Voronoi.prototype.ε=Voronoi.ε=1e-9;
Voronoi.prototype.invε=Voronoi.invε=1/Voronoi.ε;Voronoi.prototype.equalWithEpsilon=function(d,c){return this.abs(d-c)<1e-9
};Voronoi.prototype.greaterThanWithEpsilon=function(d,c){return d-c>1e-9};Voronoi.prototype.greaterThanOrEqualWithEpsilon=function(d,c){return c-d<1e-9
};Voronoi.prototype.lessThanWithEpsilon=function(d,c){return c-d>1e-9};Voronoi.prototype.lessThanOrEqualWithEpsilon=function(d,c){return d-c<1e-9
};Voronoi.prototype.RBTree=function(){this.root=null};Voronoi.prototype.RBTree.prototype.rbInsertSuccessor=function(e,a){var d;
if(e){a.rbPrevious=e;a.rbNext=e.rbNext;if(e.rbNext){e.rbNext.rbPrevious=a}e.rbNext=a;if(e.rbRight){e=e.rbRight;while(e.rbLeft){e=e.rbLeft
}e.rbLeft=a}else{e.rbRight=a}d=e}else{if(this.root){e=this.getFirst(this.root);a.rbPrevious=null;a.rbNext=e;e.rbPrevious=a;
e.rbLeft=a;d=e}else{a.rbPrevious=a.rbNext=null;this.root=a;d=null}}a.rbLeft=a.rbRight=null;a.rbParent=d;a.rbRed=true;var c,b;
e=a;while(d&&d.rbRed){c=d.rbParent;if(d===c.rbLeft){b=c.rbRight;if(b&&b.rbRed){d.rbRed=b.rbRed=false;c.rbRed=true;e=c}else{if(e===d.rbRight){this.rbRotateLeft(d);
e=d;d=e.rbParent}d.rbRed=false;c.rbRed=true;this.rbRotateRight(c)}}else{b=c.rbLeft;if(b&&b.rbRed){d.rbRed=b.rbRed=false;c.rbRed=true;
e=c}else{if(e===d.rbLeft){this.rbRotateRight(d);e=d;d=e.rbParent}d.rbRed=false;c.rbRed=true;this.rbRotateLeft(c)}}d=e.rbParent
}this.root.rbRed=false};Voronoi.prototype.RBTree.prototype.rbRemoveNode=function(f){if(f.rbNext){f.rbNext.rbPrevious=f.rbPrevious
}if(f.rbPrevious){f.rbPrevious.rbNext=f.rbNext}f.rbNext=f.rbPrevious=null;var e=f.rbParent,g=f.rbLeft,b=f.rbRight,d;if(!g){d=b
}else{if(!b){d=g}else{d=this.getFirst(b)}}if(e){if(e.rbLeft===f){e.rbLeft=d}else{e.rbRight=d}}else{this.root=d}var a;if(g&&b){a=d.rbRed;
d.rbRed=f.rbRed;d.rbLeft=g;g.rbParent=d;if(d!==b){e=d.rbParent;d.rbParent=f.rbParent;f=d.rbRight;e.rbLeft=f;d.rbRight=b;b.rbParent=d
}else{d.rbParent=e;e=d;f=d.rbRight}}else{a=f.rbRed;f=d}if(f){f.rbParent=e}if(a){return}if(f&&f.rbRed){f.rbRed=false;return
}var c;do{if(f===this.root){break}if(f===e.rbLeft){c=e.rbRight;if(c.rbRed){c.rbRed=false;e.rbRed=true;this.rbRotateLeft(e);
c=e.rbRight}if((c.rbLeft&&c.rbLeft.rbRed)||(c.rbRight&&c.rbRight.rbRed)){if(!c.rbRight||!c.rbRight.rbRed){c.rbLeft.rbRed=false;
c.rbRed=true;this.rbRotateRight(c);c=e.rbRight}c.rbRed=e.rbRed;e.rbRed=c.rbRight.rbRed=false;this.rbRotateLeft(e);f=this.root;
break}}else{c=e.rbLeft;if(c.rbRed){c.rbRed=false;e.rbRed=true;this.rbRotateRight(e);c=e.rbLeft}if((c.rbLeft&&c.rbLeft.rbRed)||(c.rbRight&&c.rbRight.rbRed)){if(!c.rbLeft||!c.rbLeft.rbRed){c.rbRight.rbRed=false;
c.rbRed=true;this.rbRotateLeft(c);c=e.rbLeft}c.rbRed=e.rbRed;e.rbRed=c.rbLeft.rbRed=false;this.rbRotateRight(e);f=this.root;
break}}c.rbRed=true;f=e;e=e.rbParent}while(!f.rbRed);if(f){f.rbRed=false}};Voronoi.prototype.RBTree.prototype.rbRotateLeft=function(b){var d=b,c=b.rbRight,a=d.rbParent;
if(a){if(a.rbLeft===d){a.rbLeft=c}else{a.rbRight=c}}else{this.root=c}c.rbParent=a;d.rbParent=c;d.rbRight=c.rbLeft;if(d.rbRight){d.rbRight.rbParent=d
}c.rbLeft=d};Voronoi.prototype.RBTree.prototype.rbRotateRight=function(b){var d=b,c=b.rbLeft,a=d.rbParent;if(a){if(a.rbLeft===d){a.rbLeft=c
}else{a.rbRight=c}}else{this.root=c}c.rbParent=a;d.rbParent=c;d.rbLeft=c.rbRight;if(d.rbLeft){d.rbLeft.rbParent=d}c.rbRight=d
};Voronoi.prototype.RBTree.prototype.getFirst=function(a){while(a.rbLeft){a=a.rbLeft}return a};Voronoi.prototype.RBTree.prototype.getLast=function(a){while(a.rbRight){a=a.rbRight
}return a};Voronoi.prototype.Diagram=function(a){this.site=a};Voronoi.prototype.Cell=function(a){this.site=a;this.halfedges=[];
this.closeMe=false};Voronoi.prototype.Cell.prototype.init=function(a){this.site=a;this.halfedges=[];this.closeMe=false;return this
};Voronoi.prototype.createCell=function(b){var a=this.cellJunkyard.pop();if(a){return a.init(b)}return new this.Cell(b)};
Voronoi.prototype.Cell.prototype.prepareHalfedges=function(){var a=this.halfedges,b=a.length,c;while(b--){c=a[b].edge;if(!c.vb||!c.va){a.splice(b,1)
}}a.sort(function(e,d){return d.angle-e.angle});return a.length};Voronoi.prototype.Cell.prototype.getNeighborIds=function(){var a=[],b=this.halfedges.length,c;
while(b--){c=this.halfedges[b].edge;if(c.lSite!==null&&c.lSite.voronoiId!=this.site.voronoiId){a.push(c.lSite.voronoiId)}else{if(c.rSite!==null&&c.rSite.voronoiId!=this.site.voronoiId){a.push(c.rSite.voronoiId)
}}}return a};Voronoi.prototype.Cell.prototype.getBbox=function(){var i=this.halfedges,d=i.length,a=Infinity,g=Infinity,c=-Infinity,b=-Infinity,h,f,e;
while(d--){h=i[d].getStartpoint();f=h.x;e=h.y;if(f<a){a=f}if(e<g){g=e}if(f>c){c=f}if(e>b){b=e}}return{x:a,y:g,width:c-a,height:b-g}
};Voronoi.prototype.Cell.prototype.pointIntersection=function(a,h){var b=this.halfedges,c=b.length,f,g,e,d;while(c--){f=b[c];
g=f.getStartpoint();e=f.getEndpoint();d=(h-g.y)*(e.x-g.x)-(a-g.x)*(e.y-g.y);if(!d){return 0}if(d>0){return -1}}return 1};
Voronoi.prototype.Vertex=function(a,b){this.x=a;this.y=b};Voronoi.prototype.Edge=function(b,a){this.lSite=b;this.rSite=a;
this.va=this.vb=null};Voronoi.prototype.Halfedge=function(d,e,a){this.site=e;this.edge=d;if(a){this.angle=Math.atan2(a.y-e.y,a.x-e.x)
}else{var c=d.va,b=d.vb;this.angle=d.lSite===e?Math.atan2(b.x-c.x,c.y-b.y):Math.atan2(c.x-b.x,b.y-c.y)}};Voronoi.prototype.createHalfedge=function(b,c,a){return new this.Halfedge(b,c,a)
};Voronoi.prototype.Halfedge.prototype.getStartpoint=function(){return this.edge.lSite===this.site?this.edge.va:this.edge.vb
};Voronoi.prototype.Halfedge.prototype.getEndpoint=function(){return this.edge.lSite===this.site?this.edge.vb:this.edge.va
};Voronoi.prototype.createVertex=function(a,c){var b=this.vertexJunkyard.pop();if(!b){b=new this.Vertex(a,c)}else{b.x=a;b.y=c
}this.vertices.push(b);return b};Voronoi.prototype.createEdge=function(e,a,d,b){var c=this.edgeJunkyard.pop();if(!c){c=new this.Edge(e,a)
}else{c.lSite=e;c.rSite=a;c.va=c.vb=null}this.edges.push(c);if(d){this.setEdgeStartpoint(c,e,a,d)}if(b){this.setEdgeEndpoint(c,e,a,b)
}this.cells[e.voronoiId].halfedges.push(this.createHalfedge(c,e,a));this.cells[a.voronoiId].halfedges.push(this.createHalfedge(c,a,e));
return c};Voronoi.prototype.createBorderEdge=function(d,c,a){var b=this.edgeJunkyard.pop();if(!b){b=new this.Edge(d,null)
}else{b.lSite=d;b.rSite=null}b.va=c;b.vb=a;this.edges.push(b);return b};Voronoi.prototype.setEdgeStartpoint=function(b,d,a,c){if(!b.va&&!b.vb){b.va=c;
b.lSite=d;b.rSite=a}else{if(b.lSite===a){b.vb=c}else{b.va=c}}};Voronoi.prototype.setEdgeEndpoint=function(b,d,a,c){this.setEdgeStartpoint(b,a,d,c)
};Voronoi.prototype.Beachsection=function(){};Voronoi.prototype.createBeachsection=function(a){var b=this.beachsectionJunkyard.pop();
if(!b){b=new this.Beachsection()}b.site=a;return b};Voronoi.prototype.leftBreakPoint=function(e,f){var a=e.site,m=a.x,l=a.y,k=l-f;
if(!k){return m}var n=e.rbPrevious;if(!n){return -Infinity}a=n.site;var h=a.x,g=a.y,d=g-f;if(!d){return h}var c=h-m,j=1/k-1/d,i=c/d;
if(j){return(-i+this.sqrt(i*i-2*j*(c*c/(-2*d)-g+d/2+l-k/2)))/j+m}return(m+h)/2};Voronoi.prototype.rightBreakPoint=function(b,c){var d=b.rbNext;
if(d){return this.leftBreakPoint(d,c)}var a=b.site;return a.y===c?a.x:Infinity};Voronoi.prototype.detachBeachsection=function(a){this.detachCircleEvent(a);
this.beachline.rbRemoveNode(a);this.beachsectionJunkyard.push(a)};Voronoi.prototype.removeBeachsection=function(b){var a=b.circleEvent,j=a.x,h=a.ycenter,e=this.createVertex(j,h),f=b.rbPrevious,d=b.rbNext,l=[b],g=Math.abs;
this.detachBeachsection(b);var m=f;while(m.circleEvent&&g(j-m.circleEvent.x)<1e-9&&g(h-m.circleEvent.ycenter)<1e-9){f=m.rbPrevious;
l.unshift(m);this.detachBeachsection(m);m=f}l.unshift(m);this.detachCircleEvent(m);var c=d;while(c.circleEvent&&g(j-c.circleEvent.x)<1e-9&&g(h-c.circleEvent.ycenter)<1e-9){d=c.rbNext;
l.push(c);this.detachBeachsection(c);c=d}l.push(c);this.detachCircleEvent(c);var k=l.length,i;for(i=1;i<k;i++){c=l[i];m=l[i-1];
this.setEdgeStartpoint(c.edge,m.site,c.site,e)}m=l[0];c=l[k-1];c.edge=this.createEdge(m.site,c.site,undefined,e);this.attachCircleEvent(m);
this.attachCircleEvent(c)};Voronoi.prototype.addBeachsection=function(l){var j=l.x,n=l.y;var p,m,v,q,o=this.beachline.root;
while(o){v=this.leftBreakPoint(o,n)-j;if(v>1e-9){o=o.rbLeft}else{q=j-this.rightBreakPoint(o,n);if(q>1e-9){if(!o.rbRight){p=o;
break}o=o.rbRight}else{if(v>-1e-9){p=o.rbPrevious;m=o}else{if(q>-1e-9){p=o;m=o.rbNext}else{p=m=o}}break}}}var e=this.createBeachsection(l);
this.beachline.rbInsertSuccessor(p,e);if(!p&&!m){return}if(p===m){this.detachCircleEvent(p);m=this.createBeachsection(p.site);
this.beachline.rbInsertSuccessor(e,m);e.edge=m.edge=this.createEdge(p.site,e.site);this.attachCircleEvent(p);this.attachCircleEvent(m);
return}if(p&&!m){e.edge=this.createEdge(p.site,e.site);return}if(p!==m){this.detachCircleEvent(p);this.detachCircleEvent(m);
var h=p.site,k=h.x,i=h.y,t=l.x-k,r=l.y-i,a=m.site,c=a.x-k,b=a.y-i,u=2*(t*b-r*c),g=t*t+r*r,f=c*c+b*b,s=this.createVertex((b*g-r*f)/u+k,(t*f-c*g)/u+i);
this.setEdgeStartpoint(m.edge,h,a,s);e.edge=this.createEdge(h,l,undefined,s);m.edge=this.createEdge(l,a,undefined,s);this.attachCircleEvent(p);
this.attachCircleEvent(m);return}};Voronoi.prototype.CircleEvent=function(){this.arc=null;this.rbLeft=null;this.rbNext=null;
this.rbParent=null;this.rbPrevious=null;this.rbRed=false;this.rbRight=null;this.site=null;this.x=this.y=this.ycenter=0};Voronoi.prototype.attachCircleEvent=function(i){var r=i.rbPrevious,o=i.rbNext;
if(!r||!o){return}var k=r.site,u=i.site,c=o.site;if(k===c){return}var t=u.x,s=u.y,n=k.x-t,l=k.y-s,f=c.x-t,e=c.y-s;var v=2*(n*e-l*f);
if(v>=-2e-12){return}var h=n*n+l*l,g=f*f+e*e,m=(e*h-l*g)/v,j=(n*g-f*h)/v,b=j+s;var q=this.circleEventJunkyard.pop();if(!q){q=new this.CircleEvent()
}q.arc=i;q.site=u;q.x=m+t;q.y=b+this.sqrt(m*m+j*j);q.ycenter=b;i.circleEvent=q;var a=null,p=this.circleEvents.root;while(p){if(q.y<p.y||(q.y===p.y&&q.x<=p.x)){if(p.rbLeft){p=p.rbLeft
}else{a=p.rbPrevious;break}}else{if(p.rbRight){p=p.rbRight}else{a=p;break}}}this.circleEvents.rbInsertSuccessor(a,q);if(!a){this.firstCircleEvent=q
}};Voronoi.prototype.detachCircleEvent=function(b){var a=b.circleEvent;if(a){if(!a.rbPrevious){this.firstCircleEvent=a.rbNext
}this.circleEvents.rbRemoveNode(a);this.circleEventJunkyard.push(a);b.circleEvent=null}};Voronoi.prototype.connectEdge=function(l,a){var b=l.vb;
if(!!b){return true}var c=l.va,p=a.xl,n=a.xr,r=a.yt,d=a.yb,o=l.lSite,e=l.rSite,i=o.x,h=o.y,k=e.x,j=e.y,g=(i+k)/2,f=(h+j)/2,m,q;
this.cells[o.voronoiId].closeMe=true;this.cells[e.voronoiId].closeMe=true;if(j!==h){m=(i-k)/(j-h);q=f-m*g}if(m===undefined){if(g<p||g>=n){return false
}if(i>k){if(!c||c.y<r){c=this.createVertex(g,r)}else{if(c.y>=d){return false}}b=this.createVertex(g,d)}else{if(!c||c.y>d){c=this.createVertex(g,d)
}else{if(c.y<r){return false}}b=this.createVertex(g,r)}}else{if(m<-1||m>1){if(i>k){if(!c||c.y<r){c=this.createVertex((r-q)/m,r)
}else{if(c.y>=d){return false}}b=this.createVertex((d-q)/m,d)}else{if(!c||c.y>d){c=this.createVertex((d-q)/m,d)}else{if(c.y<r){return false
}}b=this.createVertex((r-q)/m,r)}}else{if(h<j){if(!c||c.x<p){c=this.createVertex(p,m*p+q)}else{if(c.x>=n){return false}}b=this.createVertex(n,m*n+q)
}else{if(!c||c.x>n){c=this.createVertex(n,m*n+q)}else{if(c.x<p){return false}}b=this.createVertex(p,m*p+q)}}}l.va=c;l.vb=b;
return true};Voronoi.prototype.clipEdge=function(d,i){var b=d.va.x,l=d.va.y,h=d.vb.x,g=d.vb.y,f=0,e=1,k=h-b,j=g-l;var c=b-i.xl;
if(k===0&&c<0){return false}var a=-c/k;if(k<0){if(a<f){return false}if(a<e){e=a}}else{if(k>0){if(a>e){return false}if(a>f){f=a
}}}c=i.xr-b;if(k===0&&c<0){return false}a=c/k;if(k<0){if(a>e){return false}if(a>f){f=a}}else{if(k>0){if(a<f){return false
}if(a<e){e=a}}}c=l-i.yt;if(j===0&&c<0){return false}a=-c/j;if(j<0){if(a<f){return false}if(a<e){e=a}}else{if(j>0){if(a>e){return false
}if(a>f){f=a}}}c=i.yb-l;if(j===0&&c<0){return false}a=c/j;if(j<0){if(a>e){return false}if(a>f){f=a}}else{if(j>0){if(a<f){return false
}if(a<e){e=a}}}if(f>0){d.va=this.createVertex(b+f*k,l+f*j)}if(e<1){d.vb=this.createVertex(b+e*k,l+e*j)}if(f>0||e<1){this.cells[d.lSite.voronoiId].closeMe=true;
this.cells[d.rSite.voronoiId].closeMe=true}return true};Voronoi.prototype.clipEdges=function(e){var a=this.edges,d=a.length,c,b=Math.abs;
while(d--){c=a[d];if(!this.connectEdge(c,e)||!this.clipEdge(c,e)||(b(c.va.x-c.vb.x)<1e-9&&b(c.va.y-c.vb.y)<1e-9)){c.va=c.vb=null;
a.splice(d,1)}}};Voronoi.prototype.closeCells=function(p){var g=p.xl,d=p.xr,m=p.yt,j=p.yb,q=this.cells,a=q.length,n,e,o,c,b,l,k,i,f,h=Math.abs;
while(a--){n=q[a];if(!n.prepareHalfedges()){continue}if(!n.closeMe){continue}o=n.halfedges;c=o.length;e=0;while(e<c){l=o[e].getEndpoint();
i=o[(e+1)%c].getStartpoint();if(h(l.x-i.x)>=1e-9||h(l.y-i.y)>=1e-9){switch(true){case this.equalWithEpsilon(l.x,g)&&this.lessThanWithEpsilon(l.y,j):f=this.equalWithEpsilon(i.x,g);
k=this.createVertex(g,f?i.y:j);b=this.createBorderEdge(n.site,l,k);e++;o.splice(e,0,this.createHalfedge(b,n.site,null));c++;
if(f){break}l=k;case this.equalWithEpsilon(l.y,j)&&this.lessThanWithEpsilon(l.x,d):f=this.equalWithEpsilon(i.y,j);k=this.createVertex(f?i.x:d,j);
b=this.createBorderEdge(n.site,l,k);e++;o.splice(e,0,this.createHalfedge(b,n.site,null));c++;if(f){break}l=k;case this.equalWithEpsilon(l.x,d)&&this.greaterThanWithEpsilon(l.y,m):f=this.equalWithEpsilon(i.x,d);
k=this.createVertex(d,f?i.y:m);b=this.createBorderEdge(n.site,l,k);e++;o.splice(e,0,this.createHalfedge(b,n.site,null));c++;
if(f){break}l=k;case this.equalWithEpsilon(l.y,m)&&this.greaterThanWithEpsilon(l.x,g):f=this.equalWithEpsilon(i.y,m);k=this.createVertex(f?i.x:g,m);
b=this.createBorderEdge(n.site,l,k);e++;o.splice(e,0,this.createHalfedge(b,n.site,null));c++;if(f){break}l=k;f=this.equalWithEpsilon(i.x,g);
k=this.createVertex(g,f?i.y:j);b=this.createBorderEdge(n.site,l,k);e++;o.splice(e,0,this.createHalfedge(b,n.site,null));c++;
if(f){break}l=k;f=this.equalWithEpsilon(i.y,j);k=this.createVertex(f?i.x:d,j);b=this.createBorderEdge(n.site,l,k);e++;o.splice(e,0,this.createHalfedge(b,n.site,null));
c++;if(f){break}l=k;f=this.equalWithEpsilon(i.x,d);k=this.createVertex(d,f?i.y:m);b=this.createBorderEdge(n.site,l,k);e++;
o.splice(e,0,this.createHalfedge(b,n.site,null));c++;if(f){break}default:throw"Voronoi.closeCells() > this makes no sense!"
}}e++}n.closeMe=false}};Voronoi.prototype.quantizeSites=function(c){var b=this.ε,d=c.length,a;while(d--){a=c[d];a.x=Math.floor(a.x/b)*b;
a.y=Math.floor(a.y/b)*b}};Voronoi.prototype.recycle=function(a){if(a){if(a instanceof this.Diagram){this.toRecycle=a}else{throw"Voronoi.recycleDiagram() > Need a Diagram object."
}}};Voronoi.prototype.compute=function(i,j){var d=new Date();this.reset();if(this.toRecycle){this.vertexJunkyard=this.vertexJunkyard.concat(this.toRecycle.vertices);
this.edgeJunkyard=this.edgeJunkyard.concat(this.toRecycle.edges);this.cellJunkyard=this.cellJunkyard.concat(this.toRecycle.cells);
this.toRecycle=null}var h=i.slice(0);h.sort(function(n,m){var o=m.y-n.y;if(o){return o}return m.x-n.x});var b=h.pop(),l=0,f,e,k=this.cells,a;
for(;;){a=this.firstCircleEvent;if(b&&(!a||b.y<a.y||(b.y===a.y&&b.x<a.x))){if(b.x!==f||b.y!==e){k[l]=this.createCell(b);b.voronoiId=l++;
this.addBeachsection(b);e=b.y;f=b.x}b=h.pop()}else{if(a){this.removeBeachsection(a.arc)}else{break}}}this.clipEdges(j);this.closeCells(j);
var c=new Date();var g=new this.Diagram();g.cells=this.cells;g.edges=this.edges;g.vertices=this.vertices;g.execTime=c.getTime()-d.getTime();
this.reset();return g};
</script>
<script>
// Based on https://developer.mozilla.org/en-US/docs/Web/CSS/named-color .
const colors = {
  // CSS1:
  'black': [0, 0, 0],
  'silver': [192, 192, 192],
  'gray / grey': [128, 128, 128],
  'white': [255, 255, 255],
  'maroon': [128, 0, 0],
  'red': [255, 0, 0],
  'purple': [128, 0, 128],
  'fuchsia / magenta': [255, 0, 255],
  'green': [0, 128, 0],
  'lime': [0, 255, 0],
  'olive': [128, 128, 0],
  'yellow': [255, 255, 0],
  'navy': [0, 0, 128],
  'blue': [0, 0, 255],
  'teal': [0, 128, 128],
  'aqua / cyan': [0, 255, 255],
  'orange': [255, 165, 0],
  'aliceblue': [240, 248, 255],
  'antiquewhite': [250, 235, 215],
  'aquamarine': [127, 255, 212],
  'azure': [240, 255, 255],
  'beige': [245, 245, 220],
  'bisque': [255, 228, 196],
  'blanchedalmond': [255, 235, 205],
  'blueviolet': [138, 43, 226],
  'brown': [165, 42, 42],
  'burlywood': [222, 184, 135],
  'cadetblue': [95, 158, 160],
  'chartreuse': [127, 255, 0],
  'chocolate': [210, 105, 30],
  'coral': [255, 127, 80],
  'cornflowerblue': [100, 149, 237],
  'cornsilk': [255, 248, 220],
  'crimson': [220, 20, 60],
  'darkblue': [0, 0, 139],
  'darkcyan': [0, 139, 139],
  'darkgoldenrod': [184, 134, 11],
  'darkgray / darkgrey': [169, 169, 169],
  'darkgreen': [0, 100, 0],
  'darkkhaki': [189, 183, 107],
  'darkmagenta': [139, 0, 139],
  'darkolivegreen': [85, 107, 47],
  'darkorange': [255, 140, 0],
  'darkorchid': [153, 50, 204],
  'darkred': [139, 0, 0],
  'darksalmon': [233, 150, 122],
  'darkseagreen': [143, 188, 143],
  'darkslateblue': [72, 61, 139],
  'darkslategray / darkslategrey': [47, 79, 79],
  'darkturquoise': [0, 206, 209],
  'darkviolet': [148, 0, 211],
  'deeppink': [255, 20, 147],
  'deepskyblue': [0, 191, 255],
  'dimgray / dimgrey': [105, 105, 105],
  'dodgerblue': [30, 144, 255],
  'firebrick': [178, 34, 34],
  'floralwhite': [255, 250, 240],
  'forestgreen': [34, 139, 34],
  'gainsboro': [220, 220, 220],
  'ghostwhite': [248, 248, 255],
  'gold': [255, 215, 0],
  'goldenrod': [218, 165, 32],
  'greenyellow': [173, 255, 47],
  'honeydew': [240, 255, 240],
  'hotpink': [255, 105, 180],
  'indianred': [205, 92, 92],
  'indigo': [75, 0, 130],
  'ivory': [255, 255, 240],
  'khaki': [240, 230, 140],
  'lavender': [230, 230, 250],
  'lavenderblush': [255, 240, 245],
  'lawngreen': [124, 252, 0],
  'lemonchiffon': [255, 250, 205],
  'lightblue': [173, 216, 230],
  'lightcoral': [240, 128, 128],
  'lightcyan': [224, 255, 255],
  'lightgoldenrodyellow': [250, 250, 210],
  'lightgray / lightgrey': [211, 211, 211],
  'lightgreen': [144, 238, 144],
  'lightpink': [255, 182, 193],
  'lightsalmon': [255, 160, 122],
  'lightseagreen': [32, 178, 170],
  'lightskyblue': [135, 206, 250],
  'lightslategray / lightslategrey': [119, 136, 153],
  'lightsteelblue': [176, 196, 222],
  'lightyellow': [255, 255, 224],
  'limegreen': [50, 205, 50],
  'linen': [250, 240, 230],
  'mediumaquamarine': [102, 205, 170],
  'mediumblue': [0, 0, 205],
  'mediumorchid': [186, 85, 211],
  'mediumpurple': [147, 112, 219],
  'mediumseagreen': [60, 179, 113],
  'mediumslateblue': [123, 104, 238],
  'mediumspringgreen': [0, 250, 154],
  'mediumturquoise': [72, 209, 204],
  'mediumvioletred': [199, 21, 133],
  'midnightblue': [25, 25, 112],
  'mintcream': [245, 255, 250],
  'mistyrose': [255, 228, 225],
  'moccasin': [255, 228, 181],
  'navajowhite': [255, 222, 173],
  'oldlace': [253, 245, 230],
  'olivedrab': [107, 142, 35],
  'orangered': [255, 69, 0],
  'orchid': [218, 112, 214],
  'palegoldenrod': [238, 232, 170],
  'palegreen': [152, 251, 152],
  'paleturquoise': [175, 238, 238],
  'palevioletred': [219, 112, 147],
  'papayawhip': [255, 239, 213],
  'peachpuff': [255, 218, 185],
  'peru': [205, 133, 63],
  'pink': [255, 192, 203],
  'plum': [221, 160, 221],
  'powderblue': [176, 224, 230],
  'rosybrown': [188, 143, 143],
  'royalblue': [65, 105, 225],
  'saddlebrown': [139, 69, 19],
  'salmon': [250, 128, 114],
  'sandybrown': [244, 164, 96],
  'seagreen': [46, 139, 87],
  'seashell': [255, 245, 238],
  'sienna': [160, 82, 45],
  'skyblue': [135, 206, 235],
  'slateblue': [106, 90, 205],
  'slategray / slategrey': [112, 128, 144],
  //'slategrey': [112, 128, 144],
  'snow': [255, 250, 250],
  'springgreen': [0, 255, 127],
  'steelblue': [70, 130, 180],
  'tan': [210, 180, 140],
  'thistle': [216, 191, 216],
  'tomato': [255, 99, 71],
  'turquoise': [64, 224, 208],
  'violet': [238, 130, 238],
  'wheat': [245, 222, 179],
  'whitesmoke': [245, 245, 245],
  'yellowgreen': [154, 205, 50],
  'rebeccapurple': [102, 51, 153],
};
// Based on https://stackoverflow.com/a/54070620/91238 .
// input: r,g,b in [0,1], out: h in [0,360) and s,v in [0,1]
function rgb2hsv(r,g,b) {
  let v=Math.max(r,g,b), c=v-Math.min(r,g,b);
  let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c));
  return [60*(h<0?h+6:h), v&&c/v, v];
}
// For the whole color wheel, radius and center x/y.
const radius = 512;
const cx = radius;
const cy = radius;
const svg = document.querySelector('svg');
const styleSheet = document.styleSheets[0];
// TODO: Select-able color categories, re-render wheel.
function renderWheel() {
  let colorsBySite = {};
  let sites = [];
  Object.entries(colors).forEach(([name, color], _) => {
    let [r, g, b] = color;
    let [h, s, v] = rgb2hsv(r/255, g/255, b/255);
    // Based on https://stackoverflow.com/a/54522007/91238 .
    // I've tweaked it to spread out some of the colors (especially they greys)
    // that don't fit well into a true H/S wheel.
    let colorRadius = (s + v/5)*0.75 * radius;
    let colorAngle = h/360 * 2 * Math.PI;
    let x = Math.cos(colorAngle) * colorRadius + cx;
    let y = Math.sin(colorAngle) * colorRadius + cy;
    sites.push({x: x, y: y});
    colorsBySite[[x, y]] = name;
  });
  let voronoi = new Voronoi().compute(sites, {xl: 0, xr: radius * 2, yt: 0, yb: radius * 2});
  voronoi.cells.forEach(cell => {
    if (cell.closeMe) {
      console.warn('cell', cell, 'needs closing');
      return;
    }
    let colorName = colorsBySite[[cell.site.x, cell.site.y]];
    let [r, g, b] = colors[colorName];
    let c = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    c.setAttribute('data-color', colorName);
    c.setAttribute('mask', 'url(#circle-mask)');
    let points = '';
    cell.halfedges.forEach(edge => {
      let s = edge.getStartpoint();
      let e = edge.getEndpoint();
      points += `${s.x} ${s.y}, `;
    });
    points = points.replace(/, $/, '');
    c.setAttribute('points', points);
    svg.appendChild(c);
    let rgb = `rgb(${r}, ${g}, ${b})`;
    styleSheet.insertRule(`[data-color='${colorName}'] { fill: ${rgb}; stroke: ${rgb}; }`);
  });
}
renderWheel();
function activateColor(el) {
  renderPreview(el.getAttribute('data-color'));
  // Move the SVG node to the end, so it(s stroke) will draw above all others.
  el.parentNode.appendChild(el);
  // Force its stroke to be black.  (Doing this with CSS doesn't work; the
  // hover state is broken by mutating the DOM.)
  el.style.stroke = 'black';
  el.style.strokeWidth = '5px';
}
// https://stackoverflow.com/a/5624139/91238
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
let previewLocked = false;
function renderPreview(color) {
  if (!color) {
    document.getElementById('preview').innerHTML = '';
    return;
  }
  let [r, g, b] = colors[color];
  document.getElementById('preview').innerHTML = `
      ${color}
       <span class="swatch"
          style="background-color: ${rgbToHex(r, g, b)};">&nbsp;</span>
      ${rgbToHex(r, g, b).toUpperCase()}
      `;
}
svg.addEventListener('mouseover', e => {
  let el = e.target;
  if (el.tagName != 'polygon') return;
  if (!el.nextElementSibling) return;
  if (!previewLocked) {
    activateColor(el);
  }
});
svg.addEventListener('mouseout', e => {
  let el = e.target;
  if (el.tagName != 'polygon') return;
  if (!previewLocked) {
    renderPreview(null);
    // Reset forced stroke from mouseover.
    el.removeAttribute('style');
  }
});
document.body.addEventListener('click', e => {
  let el = e.target;
  // Ignore clicks, i.e. to select, in the preview.
  if (document.getElementById('preview').contains(el)) return;
  // Remove possible forced stroke from previously-locked color.
  document.querySelectorAll('polygon[style]').forEach(el => {
    el.removeAttribute('style');
  });
  if (el.tagName != 'polygon') {
    previewLocked = false;
    renderPreview(null);
    return;
  }
  previewLocked = true;
  activateColor(el);
});
</script>
 
I think this Voronoi chart is an interesting visualization of the web colors (which have names like [rebeccapurple](https://meyerweb.com/eric/thoughts/2014/06/19/rebeccapurple/), &num;663399, not *beccapurple*). Anthony explains:

<blockquote>
<p>This "color wheel" arrangement is a compact and visual way to represent a whole range of colors.  I was reminded of the named/web colors by <a href="https://news.ycombinator.com/item?id=33647207">a recent Hacker News comment thread</a>, and thought again of arranging them into a color wheel.</p>
<p>So here it is: a color wheel, with only "web colors" on it.  Each color is placed on the wheel, then grown to a polygon to fill the wheel with a Voronoi diagram.</p>
<p>Hover colors to see their name (plus extra preview color swatch and hex code).  Click one to "lock" it.  The idea is when picking colors for a design, choose visually here from these few (139 distinct) colors, rather than trying to choose from the millions that are actually available.  And you can refer to them by name in your CSS!</p>
<p>The arrangement of the wheel has been tweaked from a pure <a href="https://en.wikipedia.org/wiki/HSL_and_HSV">HSV</a> interpretation, to make sure all names have a distinct location.  List of colors from <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/named-color">Mozilla documentation</a>.</p>
<footer>Anthony Lieuallen</footer>
</blockquote>
