import React from "react";

import FabricCanvasTool from "./FabricCanvasTool";
const fabric = require("fabric").fabric;

export default class Rectangle extends FabricCanvasTool {
  configureCanvas(props) {
    let canvas = this._canvas;
    canvas.isDrawingMode = canvas.selection = false;
    canvas.forEachObject(o => (o.selectable = o.evented = false));
    this._width = props.lineWidth || 1;
    this._color = props.lineColor || "black";
    this._fill = props.fillColor || "green";
  }

  doMouseDown(o) {
    let canvas = this._canvas;
    this.isDown = true;
    let pointer = canvas.getPointer(o.e);
    this.startX = pointer.x;
    this.startY = pointer.y;
    this.rect = new fabric.Textbox("hello", {
      left: this.startX,
      top: this.startY,
      originX: "left",
      originY: "top",
      width: pointer.x - this.startX,
      height: pointer.y - this.startY,
      stroke: this._color,
      strokeWidth: this._width,
      fill: this._fill,
      backgroundColor: this._fill,
      editable: false,
      fixedWidth: 150,
      fontSize: 12,
      // fontSizeMult: 50,
      // deltaY: 50,
      textAlign: "center",
      //fill: 'rgba(255,0,0,0.5)',
      transparentCorners: false,
      opacity: 0.7,
      selectable: false,
      evented: false,
      angle: 0
    });
    canvas.add(this.rect);
  }

  doMouseMove(o) {
    if (!this.isDown) return;
    let canvas = this._canvas;
    let pointer = canvas.getPointer(o.e);
    if (this.startX > pointer.x) {
      this.rect.set({ left: Math.abs(pointer.x) });
    }
    if (this.startY > pointer.y) {
      this.rect.set({ top: Math.abs(pointer.y) });
    }
    this.rect.set({ width: Math.abs(this.startX - pointer.x) });
    this.rect.set({ height: Math.abs(this.startY - pointer.y) });
    this.rect.setCoords();
    canvas.renderAll();
  }

  doMouseUp(o) {
    this.isDown = false;
    let canvas = this._canvas;

    // canvas.selection = true;

    console.log("rect.get", this.rect.get("left", "top", "originX", "originY"));

    const rectConfig = this.rect.toJSON();
    if (
      this._minWidth >= rectConfig.width ||
      this._minHeight >= rectConfig.height
    ) {
      canvas.remove(this.rect);
    }
    this.rect.set("text", "Hello world");
    canvas.renderAll();
    console.log("rectConfig", rectConfig);

    canvas.forEachObject(o => {
      o.selectable = o.evented = true;
    });
    canvas.renderAll();
  }
}
