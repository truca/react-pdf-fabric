import React from "react";

/* eslint no-unused-vars: 0 */

/**
 * "Abstract" like base class for a Canvas tool
 */
export default class FabricCanvasTool {
  constructor({ canvas, minWidth = 48, minHeight = 48 }) {
    this._canvas = canvas;
    (this._minWidth = minWidth), (this._minHeight = minHeight);
  }

  configureCanvas(props) {}

  doMouseUp(event) {}

  doMouseDown(event) {}

  doMouseMove(event) {}

  doMouseOut(event) {}
}
