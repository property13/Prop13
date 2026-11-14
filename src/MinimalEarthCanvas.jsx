import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const EARTH_KEYS = [
  {p:0,lat:22.4,lon:77.5,d:3.55,stop:-1},
  {p:.115,lat:28.6139,lon:77.209,d:2.05,stop:0},
  {p:.195,lat:29.3909,lon:76.9635,d:1.79,stop:1},
  {p:.275,lat:28.4595,lon:77.0266,d:1.75,stop:2},
  {p:.355,lat:28.5355,lon:77.391,d:1.77,stop:3},
  {p:.445,lat:23.0225,lon:72.5714,d:1.87,stop:4},
  {p:.535,lat:21.1458,lon:79.0882,d:1.96,stop:5},
  {p:.625,lat:19.076,lon:72.8777,d:1.82,stop:6},
  {p:.705,lat:18.6414,lon:72.8722,d:1.77,stop:7},
  {p:.775,lat:15.4909,lon:73.8278,d:1.94,stop:8},
  {p:.88,lat:22.0,lon:64.0,d:2.95,stop:8},
  {p:.97,lat:25.2048,lon:55.2708,d:1.94,stop:9},
  {p:1,lat:25.2048,lon:55.2708,d:1.94,stop:9},
];
const earthClamp=t=>Math.max(0,Math.min(1,t));
const earthSmooth=t=>{const v=earthClamp(t);return v*v*(3-2*v)};
const earthLerp=(a,b,t)=>a+(b-a)*t;
// Three.js SphereGeometry UV: U=0.5 is Greenwich (0°), U=0.75 is 90°E.
// All camera targets, pins and flight paths must use this same projection.
const earthPoint=(lat,lon,r=1)=>{
  const a=THREE.MathUtils.degToRad(lat);
  const b=THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(
    r*Math.cos(a)*Math.cos(b),
    r*Math.sin(a),
    -r*Math.cos(a)*Math.sin(b)
  );
};
// Pixel anchors measured on the user's ORIGINAL 2048 x 1152 artwork.
// Its coastlines are decorative, not a georeferenced map. For correct visual
// placement, interpolate between city-specific anchors instead of projecting
// raw geographic coordinates onto the painted map.
// Canvas uses the TOP 2048 x 1024 region of the unchanged PNG.
const ARTWORK_SIZE = {width: 2048, height: 1024};
const ARTWORK_CITY_ANCHORS = [
  {lat:28.6139, lon:77.2090, x:1480, y:477}, // Delhi NCR
  // {lat:29.3909, lon:76.9635, x:1456, y:465}, // Panipat
  {lat:28.4595, lon:77.0266, x:1479, y:480}, // Gurugram
  {lat:28.5355, lon:77.3910, x:1485, y:480}, // Noida
  {lat:23.0225, lon:72.5714, x:1440, y:521}, // Ahmedabad
  {lat:21.1458, lon:79.0882, x:1490, y:551}, // Nagpur
  {lat:19.0760, lon:72.8777, x:1440, y:571}, // Mumbai
  // {lat:18.6414, lon:72.8722, x:1420, y:580}, // Alibaug
  {lat:15.4909, lon:73.8278, x:1445, y:608}, // Goa
  {lat:25.2048, lon:55.2708, x:1327, y:505}, // Dubai (UAE coast)
];
const artworkPoint=(lat,lon,r=1)=>{
  // Nearest anchored stop has exact pixel placement. Between stops use
  // smooth inverse-distance interpolation so the scroll camera stays fluid.
  let sum=0, x=0, y=0;
  for(const a of ARTWORK_CITY_ANCHORS){
    const d2=(lat-a.lat)**2+(lon-a.lon)**2;
    if(d2<0.000001){x=a.x;y=a.y;sum=1;break;}
    const w=1/Math.pow(d2+0.04,1.25);
    x+=a.x*w;y+=a.y*w;sum+=w;
  }
  x/=sum;y/=sum;
  // Correct THREE.SphereGeometry UV basis:
  // x=-cos(latitude)*cos(2*pi*u), z=cos(latitude)*sin(2*pi*u).
  // The previous sin/cos swap rotated/flipped camera targeting toward Africa.
  // All locations, travel route and camera now share these exact UV coordinates.
  const u=x/ARTWORK_SIZE.width;
  const phi=u*Math.PI*2;
  const latitude=(0.5-y/ARTWORK_SIZE.height)*Math.PI;
  return new THREE.Vector3(
    -r*Math.cos(latitude)*Math.cos(phi),
    r*Math.sin(latitude),
    r*Math.cos(latitude)*Math.sin(phi)
  );
};
const earthInterpolate=(p)=>{
  let i=0;while(i<EARTH_KEYS.length-2&&p>EARTH_KEYS[i+1].p)i++;
  const a=EARTH_KEYS[i],b=EARTH_KEYS[i+1];
  const t=earthSmooth((p-a.p)/(b.p-a.p||1));
  return {lat:earthLerp(a.lat,b.lat,t),lon:earthLerp(a.lon,b.lon,t),d:earthLerp(a.d,b.d,t)};
};
const INDIA_OUTLINE_POINTS=[
  {lat:23.82,lon:68.52},{lat:22.73,lon:69.38},{lat:21.94,lon:70.57},{lat:20.74,lon:72.02},
  {lat:19.38,lon:72.86},{lat:18.55,lon:72.80},{lat:16.96,lon:73.32},{lat:15.49,lon:73.83},
  {lat:13.36,lon:74.79},{lat:11.02,lon:75.79},{lat:8.08,lon:77.54},{lat:9.48,lon:78.15},
  {lat:11.14,lon:79.79},{lat:13.08,lon:80.28},{lat:15.73,lon:80.97},{lat:17.69,lon:83.22},
  {lat:19.24,lon:84.91},{lat:20.27,lon:86.70},{lat:21.63,lon:87.93},{lat:21.95,lon:89.12},
  {lat:22.76,lon:89.58},{lat:24.17,lon:88.74},{lat:25.27,lon:89.01},{lat:26.15,lon:89.35},
  {lat:26.86,lon:90.72},{lat:27.59,lon:91.68},{lat:28.16,lon:94.10},{lat:27.42,lon:95.11},
  {lat:26.12,lon:95.02},{lat:24.54,lon:94.37},{lat:24.29,lon:92.79},{lat:24.92,lon:91.67},
  {lat:25.57,lon:90.94},{lat:26.67,lon:89.80},{lat:27.78,lon:88.69},{lat:28.12,lon:87.12},
  {lat:28.54,lon:84.92},{lat:29.11,lon:82.72},{lat:29.73,lon:81.14},{lat:30.44,lon:79.61},
  {lat:31.28,lon:78.20},{lat:32.19,lon:77.10},{lat:33.19,lon:76.48},{lat:34.18,lon:75.67},
  {lat:35.07,lon:74.70},{lat:35.57,lon:74.16},{lat:34.79,lon:73.55},{lat:33.99,lon:74.17},
  {lat:32.78,lon:74.91},{lat:31.56,lon:75.66},{lat:30.70,lon:74.72},{lat:29.81,lon:73.88},
  {lat:28.98,lon:71.99},{lat:27.73,lon:70.50},{lat:26.32,lon:69.46},{lat:24.92,lon:68.83}
];
const sphericalPath=(points,r=1.021,segmentsPerEdge=8)=>{
  const out=[];
  for(let i=0;i<points.length;i++){
    const a=earthPoint(points[i].lat,points[i].lon,1).normalize();
    const b=earthPoint(points[(i+1)%points.length].lat,points[(i+1)%points.length].lon,1).normalize();
    for(let step=0;step<segmentsPerEdge;step++){
      const t=step/segmentsPerEdge;
      out.push(a.clone().lerp(b,t).normalize().multiplyScalar(r));
    }
  }
  return out;
};
export default function MinimalEarthCanvas({progress,isMobile,onWebGLError,reducedMotion,stops,milestones,active}) {
  const mount=useRef(null);
  const drawRequest=useRef(null);
  useEffect(()=>{
    const el=mount.current;if(!el)return;
    let renderer;
    try{renderer=new THREE.WebGLRenderer({antialias:!isMobile,powerPreference:'low-power'});}
    catch{onWebGLError?.(true);return;}
    let frame=0,disposed=false,rendering=false;
    const disposeList=[];
    const scene=new THREE.Scene();scene.background=new THREE.Color('#05090c');
    const camera=new THREE.PerspectiveCamera(isMobile?46:39,1,.08,55);
    const ambient=new THREE.AmbientLight('#ffffff',1.45);scene.add(ambient);
    const sun=new THREE.DirectionalLight('#fff4df',0.72);sun.position.set(5,7,9);scene.add(sun);
    const earthGeometry=new THREE.SphereGeometry(1,72,48);
    const earthMaterial=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1,metalness:0,emissive:'#090a0a',emissiveIntensity:.12});
    const sphere=new THREE.Mesh(earthGeometry,earthMaterial);scene.add(sphere);
    disposeList.push(earthGeometry,earthMaterial);
    // NEW user-selected black/gold map (unchanged PNG). Use artworkPoint() to calibrate pins to its nonstandard projection.
    const loader=new THREE.TextureLoader();
    let live=true;
    loader.load('/property-gallery-world-map-new.png',texture=>{
      if(!live){texture.dispose();return;}
      texture.colorSpace=THREE.SRGBColorSpace;
      // Original 2048x1152 artwork: sample its upper 2048x1024 area
      // as a 2:1 globe texture without resizing or modifying image pixels.
      texture.repeat.set(1, 1024 / 1152);
      texture.offset.set(0, 128 / 1152);
      texture.anisotropy=Math.min(renderer?.capabilities.getMaxAnisotropy()||1,8);
      earthMaterial.map=texture;earthMaterial.needsUpdate=true;
      disposeList.push(texture);requestDraw();
    },undefined,()=>{ /* retain an untextured globe when image missing */ });
    const atmosphereMaterial=new THREE.MeshBasicMaterial({color:'#b89b69',transparent:true,opacity:.025,side:THREE.BackSide,depthWrite:false});
    const atmosphereGeometry=new THREE.SphereGeometry(1.035,48,32);
    const atmosphere=new THREE.Mesh(atmosphereGeometry,atmosphereMaterial);scene.add(atmosphere);
    disposeList.push(atmosphereGeometry,atmosphereMaterial);
    const dots=stops.map((city,index)=>{
      const group=new THREE.Group();const point=artworkPoint(city.lat,city.lon,1.013);
      group.position.copy(point);
      group.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),point.clone().normalize());
      const dotGeometry=new THREE.SphereGeometry(.0062,14,10);
      const dotMaterial=new THREE.MeshBasicMaterial({color:'#f8df9b',depthTest:true});
      const dot=new THREE.Mesh(dotGeometry,dotMaterial);group.add(dot);
      const ringGeometry=new THREE.RingGeometry(.013,.0155,32);
      const ringMaterial=new THREE.MeshBasicMaterial({color:'#d9b46c',transparent:true,opacity:.58,side:THREE.DoubleSide,depthWrite:false});
      const ring=new THREE.Mesh(ringGeometry,ringMaterial);group.add(ring);
      scene.add(group);disposeList.push(dotGeometry,dotMaterial,ringGeometry,ringMaterial);
      return {group,ring,index};
    });
    const routeMaterial=new THREE.LineBasicMaterial({color:'#d8b778',transparent:true,opacity:.62,depthWrite:false});
    disposeList.push(routeMaterial);
    const routes=[];
    for(let i=0;i<stops.length-1;i++){
      const a=stops[i],b=stops[i+1];
      const v0=artworkPoint(a.lat,a.lon),v1=artworkPoint(b.lat,b.lon);
      const points=[];
      for(let j=0;j<=64;j++){
        const t=j/64;
        const q=v0.clone().lerp(v1,t).normalize();
        q.multiplyScalar(1.017+.065*Math.sin(Math.PI*t));points.push(q);
      }
      const geometry=new THREE.BufferGeometry().setFromPoints(points);
      const line=new THREE.Line(geometry,routeMaterial);scene.add(line);
      routes.push({line,geometry});disposeList.push(geometry);
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,isMobile?1.15:1.5));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.05;
    renderer.domElement.style.cssText='display:block;width:100%;height:100%';
    el.appendChild(renderer.domElement);
    function draw(){
      if(disposed)return;
      const p=reducedMotion ? 0.115 : earthClamp(progress.get());
      const key=earthInterpolate(p);
      // Keep the artwork crisp: city-to-city scroll moves the camera,
      // but NEVER magnifies the texture past this globe framing.
      const radius=Math.max(isMobile?4.25:3.65,key.d*(isMobile?1.13:1));
      const cameraPos=artworkPoint(key.lat,key.lon,radius);
      camera.position.copy(cameraPos);
      camera.up.set(0,1,0);camera.lookAt(0,0,0);
      // On mobile, preserve geographic camera while keeping the active pin above the bottom captions.
      let ringIndex=-1;
      while(ringIndex+1<milestones.length&&p>=milestones[ringIndex+1]-.025)ringIndex++;
      for(let i=0;i<dots.length;i++){
        const visible=p>milestones[i]-.035;
        dots[i].group.visible=visible;
        dots[i].ring.scale.setScalar(i===Math.max(0,ringIndex)?1.18:1);
      }
      for(let i=0;i<routes.length;i++){
        const a=milestones[i],b=milestones[i+1];
        const amount=earthSmooth((p-a)/(b-a||1));
        routes[i].geometry.setDrawRange(0,Math.max(0,Math.floor(65*amount)));
      }
      renderer.render(scene,camera);
    }
    function requestDraw(){
      if(disposed||!rendering||frame)return;
      frame=requestAnimationFrame(()=>{frame=0;draw()});
    }
    let width=0,height=0;
    function resize(){
      if(disposed)return;
      const w=el.clientWidth,h=el.clientHeight;
      if(!w||!h||(w===width&&h===height))return;
      width=w;height=h;
      camera.aspect=w/h;camera.updateProjectionMatrix();
      renderer.setSize(w,h,false);requestDraw();
    }
    const obs=typeof ResizeObserver==='undefined'?null:new ResizeObserver(resize);
    if(obs)obs.observe(el);
    else window.addEventListener('resize',resize);
    resize();
    drawRequest.current={requestDraw,setActive(enabled){
      rendering=enabled;
      if(enabled){resize();requestDraw();}
      else{cancelAnimationFrame(frame);frame=0;}
    }};
    return()=>{
      live=false;disposed=true;drawRequest.current=null;
      cancelAnimationFrame(frame);obs?.disconnect();
      if(!obs)window.removeEventListener('resize',resize);
      disposeList.forEach(obj=>obj.dispose?.());
      renderer.dispose();renderer.domElement.remove();
    };
  },[progress,isMobile,onWebGLError,reducedMotion,stops,milestones]);
  useEffect(()=>{
    const drawing=drawRequest.current;
    if(!active||!drawing)return;
    drawing.setActive(true);
    const unsubscribe=reducedMotion?undefined:progress.on('change',drawing.requestDraw);
    return()=>{unsubscribe?.();drawing.setActive(false);};
  },[active,progress,isMobile,onWebGLError,reducedMotion,stops,milestones]);
  return <div ref={mount} aria-hidden="true" style={{position:'absolute',inset:0}}/>;
}
