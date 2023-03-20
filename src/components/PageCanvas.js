import React from "react";

import { default as fb } from "fabric";
import _ from "lodash";
import $ from "jquery";
import { pdfjs } from "react-pdf";
import Rectangle from "./Rectangle";

const { fabric } = fb;

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;

export default class PageCanvas extends React.Component {
  state = {
    pageCanvases: []
  };

  componentDidMount = async () => {
    const pgCanvases = await this.initPageCanvases();

    const canvases = _.map(pgCanvases, "canvas");
    $(this.pageRef).append(canvases);

    const pageCanvases = await this.initFabric(pgCanvases);
    this.setState({ pageCanvases });
  };

  _onMouseDown = tool => e => {
    if (!e.target) tool.doMouseDown(e);
  };
  _onMouseMove = tool => e => !e.target && tool.doMouseMove(e);
  _onMouseUp = tool => e => !e.target && tool.doMouseUp(e);
  _onMouseOut = tool => e => !e.target && tool.doMouseOut(e);

  initFabric = async (pageCanvases = []) => {
    return _.chain(pageCanvases)
      .map(pgCanvas => {
        const background = pgCanvas.canvas.toDataURL("image/png");
        const fabricCanvas = new fabric.Canvas(pgCanvas.canvas, {
          selection: false
        });
        fabricCanvas.setBackgroundImage(
          background,
          fabricCanvas.renderAll.bind(fabricCanvas)
        );

        const rectangleTool = new Rectangle({ canvas: fabricCanvas });

        rectangleTool.configureCanvas(this.props);

        fabricCanvas.on("mouse:down", this._onMouseDown(rectangleTool));
        fabricCanvas.on("mouse:move", this._onMouseMove(rectangleTool));
        fabricCanvas.on("mouse:up", this._onMouseUp(rectangleTool));
        fabricCanvas.on("mouse:out", this._onMouseOut(rectangleTool));

        return {
          ...pgCanvas,
          fabricCanvas,
          rectangleTool
        };
      })
      .value();
  };

  initPageCanvases = async () => {
    const pdf = await pdfjs.getDocument(this.props.url).promise;
    const scale = 1.5;

    const renderProms = _.chain(pdf._pdfInfo.numPages)
      .range()
      .map(async i => {
        const page = await pdf.getPage(i + 1);
        const viewport = page.getViewport(scale);

        const canvas = document.createElement("canvas");

        canvas.className = "pdf-canvas";
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const context = canvas.getContext("2d");

        await page.render({
          canvasContext: context,
          viewport: viewport
        });

        return {
          canvas,
          viewport,
          context
        };
      })
      .value();

    return Promise.all(renderProms);
  };

  setRef = ref => {
    this.pageRef = ref;
  };

  render() {
    return <div className="page-wrapper" ref={this.setRef} />;
  }
}
