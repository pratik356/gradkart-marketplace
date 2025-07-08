"use client";
import { useGlobalLoading } from "@/context/LoadingContext";
import Lottie from "lottie-react";

// Lottie JSON animation (paste your JSON here)
const animationData = {"v":"5.5.2","fr":50,"ip":0,"op":27,"w":500,"h":500,"nm":"Comp 2","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"face","parent":5,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":0,"s":[280.767,233.945,0],"to":[0,1,0],"ti":[0,0,0]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":6,"s":[280.767,239.945,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":13,"s":[280.767,233.945,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":19,"s":[280.767,239.945,0],"to":[0,0,0],"ti":[0,1,0]},{"t":26,"s":[280.767,233.945,0]}],"ix":2},"a":{"a":0,"k":[280.767,241.945,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[4.08,0],[0,0],[0,4.08],[-4.08,0],[0,0],[0,-4.081]],"o":[[0,0],[-4.08,0],[0,-4.081],[0,0],[4.08,0],[0,4.08]],"v":[[4.081,7.419],[-4.081,7.419],[-11.5,0.001],[-4.081,-7.419],[4.081,-7.419],[11.499,0.001]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.1222,0.1378,0.1349,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":2,"ix":5},"lc":1,"lj":1,"ml":10,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[100,96.38],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tr","p":{"a":0,"k":[280.767,241.945],"ix":2},"a":{"a":0,"k":[100,96.38],"ix":1},"s":{"a":0,"k":[300,300],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"AU_2 Outlines - Group 1","np":1,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":27,"st":0,"bm":0}],"markers":[]};

export default function GlobalLottieLoader() {
  const { loading } = useGlobalLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent">
      <div className="w-32 h-32">
        <Lottie animationData={animationData} loop autoplay />
      </div>
    </div>
  );
} 