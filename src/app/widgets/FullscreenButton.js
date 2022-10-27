import React, { Component, useState } from "react";
import Fullscreen from "react-full-screen";
import { Button } from "antd";
import { Portlet } from "../partials/content/Portlet";

export default function FullscreenButton({ isFull, setIsFull, current }) {
  const goFull = () => {
    setIsFull(true);
  };
React.useEffect(()=>{
  console.log(setIsFull)
});


  return (
    <div className="Fullscreen">
      <Button  style={{
                   position:'relative',
                   bottom:55
                  }} onClick={goFull}>Go Fullscreen</Button>

      <Fullscreen   enabled={isFull} onChange={isFull => setIsFull(isFull)}>
        <div>{current}</div>
      </Fullscreen>
    </div>
  );
}
