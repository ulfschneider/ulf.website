
function addGraphContainerAndContent(graphFig, graphWrapper, graphContainer, graphContent, htmlLegend, metadataContainer) {
  if (graphFig.closest(".graph-container")) {
    return;
  }
  if (graphWrapper) {
    const graphCaption = graphWrapper.querySelector(".graph-caption");
    graphWrapper.appendChild(graphContainer);
    metadataContainer.appendChild(htmlLegend);
    if (graphContent) {
      graphContent.appendChild(graphFig);
      graphContainer.appendChild(graphContent);
    } else {
      graphContainer.appendChild(graphFig);
    }
    if (graphCaption) {
      graphContainer.appendChild(graphCaption);
    }
  }
}


function addMetaDataContainer(graphContainer, metadataContainer) {
  graphContainer.appendChild(metadataContainer);
}


function addGraphID(jsonObj) {
  const graphId = jsonObj["bindto"];
  jsonObj["onrendered"] = function() {
    const el = document.getElementById(graphId.substring(1));
    if (el) el.classList.add("rendered");
  };
}


function addClasses(jsonObj, graphFig, graphContainer, isStacked, isRotated, isStep) {
  if (jsonObj.data && jsonObj.data.type) {
    graphFig.classList.add(`graph-${jsonObj.data.type}`);
  }
  const excludeClasses = ["svg-container", "graph", "c3", "rendered"];
  Array.from(graphFig.classList).forEach((cls) => {
    if (!excludeClasses.includes(cls)) {
      graphContainer.classList.add(cls);
      graphFig.classList.remove(cls);
    }
  });
  if (isStacked) graphContainer.classList.add("is-stacked");
  if (isRotated) graphContainer.classList.add("is-rotated");
  if (isStep) graphContainer.classList.add("is-step");
}


function setGraphToFit(jsonObj, isHandout) {
  jsonObj.axis = jsonObj.axis || {};
  jsonObj.axis.x = jsonObj.axis.x || {};
  jsonObj.axis.y = jsonObj.axis.y || {};
  jsonObj.axis.x.tick = { fit: true, outer: false, multiline: false };
  jsonObj.axis.y.tick = { fit: true, outer: false };
  jsonObj.axis.y.padding = { top: 0, bottom: 0 };
  if (isHandout) {
    jsonObj.axis.y.padding = { top: 7, bottom: 0 };
  }
  if (!jsonObj.padding) jsonObj.padding = {};
  jsonObj.padding.mode = "fit";
  jsonObj.padding.left = 0;
  jsonObj.padding.right = 0;
  jsonObj.padding.top = 0;
  jsonObj.padding.bottom = 0;
  jsonObj.clipPath = true;
}


function setGraphStyles(jsonObj) {
  jsonObj.axis.x.tick = {
    multiline: false
  };
  jsonObj.point = {
    r: 1,
    focus: { expand: { enabled: true, r: 1 } }
  };
}


function setAxisLabels(jsonObj, graphContainer, metadataContainer, isRotated) {
  if (!isRotated) {
    if (jsonObj.axis.y?.label) {
      const yLabelDiv = document.createElement("div");
      yLabelDiv.className = "html-y-axis-label";
      const yLabelSpan = document.createElement("span");
      yLabelSpan.textContent = jsonObj.axis.y.label;
      yLabelDiv.appendChild(yLabelSpan);
      metadataContainer.appendChild(yLabelDiv);
    }
    if (jsonObj.axis.x?.label) {
      const xLabelDiv = document.createElement("div");
      xLabelDiv.className = "html-x-axis-label";
      const xLabelSpan = document.createElement("span");
      xLabelSpan.textContent = jsonObj.axis.x.label;
      xLabelDiv.appendChild(xLabelSpan);
      graphContainer.appendChild(xLabelDiv);
    }
  } else {
    if (jsonObj.axis.y?.label) {
      const xLabelDiv = document.createElement("div");
      xLabelDiv.className = "html-x-axis-label";
      const xLabelSpan = document.createElement("span");
      xLabelSpan.textContent = jsonObj.axis.y.label;
      xLabelDiv.appendChild(xLabelSpan);
      graphContainer.appendChild(xLabelDiv);
    }
    if (jsonObj.axis.x?.label) {
      const yLabelDiv = document.createElement("div");
      yLabelDiv.className = "html-y-axis-label";
      const yLabelSpan = document.createElement("span");
      yLabelSpan.textContent = jsonObj.axis.x.label;
      yLabelDiv.appendChild(yLabelSpan);
      metadataContainer.appendChild(yLabelDiv);
    }
  }
  jsonObj.axis.x.label = { show: false };
  jsonObj.axis.y.label = { show: false };
}


function setAxisTicks(jsonObj, isRotated, isHandout, graphContainer) {
  jsonObj.axis = jsonObj.axis || {};
  jsonObj.onrendered = function() {
    if (!isHandout) {
      if (isRotated) {
        d3.selectAll(".bb-axis-x .tick text").each(function() {
          const textEl = d3.select(this);
          const fontSize = parseFloat(window.getComputedStyle(this).fontSize) || 12;
          const offset = fontSize * 0.3;
          textEl.attr("y", +textEl.attr("y") + offset);
        });
        d3.selectAll(".bb-axis-y .tick text").each(function() {
          const textEl = d3.select(this);
          const fontSize = parseFloat(window.getComputedStyle(this).fontSize) || 12;
          const offset = fontSize * 0.25;
          textEl.attr("y", +textEl.attr("y") + offset);
        });
      } else {
        d3.selectAll(".bb-axis-y .tick text").each(function() {
          const textEl = d3.select(this);
          const fontSize = parseFloat(window.getComputedStyle(this).fontSize) || 12;
          const offset = fontSize * 0.25;
          textEl.attr("y", +textEl.attr("y") + offset);
        });
      }
    } else {
      if (!isRotated && graphContainer) {
      }
    }
  };
}


function setLegends(jsonObj, graphContainer, metadataContainer, graphContent, isBar, isStacked, isRotated, isLine, htmlLegend) {
  jsonObj.legend = { show: false };
  if (!htmlLegend) return;
  const legendItems = htmlLegend.querySelectorAll(".legend-item");
  legendItems.forEach((item, index) => {
    item.classList.add(`target-data${index}`);
    if (index > 14) {
      item.remove();
    }
  });
  let shouldAddToGraphContent = false;
  if (isBar) {
    if (isStacked && !isRotated) shouldAddToGraphContent = true;
    if (!isStacked && isRotated) shouldAddToGraphContent = true;
  } else if (isLine && !isRotated) {
    shouldAddToGraphContent = true;
  }
  if (shouldAddToGraphContent) {
    const clone = htmlLegend.cloneNode(true);
    const cloneItems = clone.querySelectorAll(".legend-item");
    cloneItems.forEach((item, index) => {
      item.classList.add(`target-data${index}`);
      if (index > 14) {
        item.remove();
      }
    });
    graphContent.appendChild(clone);
    graphContainer.classList.add("has-legend-in-graph-content");
  }
}


function setNumberOfYAxisTicksBasedOnData(jsonObj, isBar, isStacked, isLine, isRotated) {
  if (!jsonObj.data || !jsonObj.data.columns) return;
  const scaleValue = 5;
  const dataArrays = jsonObj.data.columns.slice(1).map((col) => col.slice(1));
  if (dataArrays.length === 0) return;
  let numbers;
  if (isStacked) {
    const length = dataArrays[0].length;
    numbers = Array.from({ length }, (_, i) => dataArrays.reduce((sum, col) => sum + (col[i] || 0), 0));
  } else {
    numbers = dataArrays.flat();
  }
  if (numbers.length === 0) return;
  let min = Math.min(...numbers);
  let max = Math.max(...numbers);
  if (isBar || isStacked) {
    min = Math.min(0, min);
  }
  const shouldApplyPadding = isStacked && !isRotated && min < 0;
  const range = max - min || 1;
  const safetyPadding = shouldApplyPadding ? range * 0.15 : 0;
  const scale = d3.scaleLinear().domain([min - safetyPadding, max]).nice(scaleValue);
  const ticks = scale.ticks(scaleValue);
  const maxTick = ticks[ticks.length - 1];
  const decimals = Math.max(...ticks.map((d) => d.toString().split(".")[1]?.length || 0));
  jsonObj.axis = jsonObj.axis || {};
  jsonObj.axis.y = jsonObj.axis.y || {};
  if (!isRotated) {
    jsonObj.axis.y.min = scale.domain()[0];
  }
  jsonObj.axis.y.max = maxTick;
  const formatter = d3.format(`.${decimals}f`);
  jsonObj.axis.y.tick = {
    values: ticks,
    format: (d) => formatter(d) + "%\xA0"
  };
}


function setDataOrder(jsonObj, isPie, isStacked) {
  if (isPie || isStacked) {
    jsonObj.data.order = null;
  }
}


function reduceTickFontSizeBasedOnLength(jsonObj, isRotated) {
  if (!jsonObj.axis) return;
  const horizontalPadding = 40;
  const verticalPadding = 15;
  const originalOnRendered = jsonObj.onrendered;
  jsonObj.onrendered = function() {
    if (originalOnRendered) originalOnRendered();
    const chartEl = document.querySelector(jsonObj.bindto);
    if (!chartEl) return;
    const axes = [
      { axisClass: ".bb-axis-x", rotated: isRotated },
      { axisClass: ".bb-axis-y", rotated: !isRotated }

    ];
    axes.forEach(({ axisClass, rotated }) => {
      const axis = chartEl.querySelector(axisClass);
      if (!axis) return;
      axis.style.fontSize = "100%";
      const ticks = axis.querySelectorAll(".tick text");
      if (!ticks.length) return;
      let scale = 100;
      if (!rotated) {
        const chartWidth = chartEl.clientWidth - horizontalPadding * 2;
        const numTicks = ticks.length;
        const maxTickWidth = chartWidth / numTicks;
        let maxTextWidth = 0;
        ticks.forEach((tick) => {
          const w = tick.getBBox().width;
          if (w > maxTextWidth) maxTextWidth = w;
        });
        if (maxTextWidth > maxTickWidth) {
          scale = maxTickWidth / maxTextWidth * 100;
        }
      } else {
        const chartHeight = chartEl.clientHeight - verticalPadding * 2;
        const numTicks = ticks.length;
        const spacePerTick = chartHeight / numTicks;
        let maxTextHeight = 0;
        ticks.forEach((tick) => {
          const h = tick.getBBox().height;
          if (h > maxTextHeight) maxTextHeight = h;
        });
        if (maxTextHeight > spacePerTick) {
          scale = spacePerTick / maxTextHeight * 100;
        }
        if (scale < 40) scale = 40;
        ticks.forEach((tick) => {
          const tspans = tick.querySelectorAll("tspan");
          tspans.forEach((tspan) => tspan.setAttribute("dy", 0));
        });
      }
      axis.style.fontSize = `${scale}%`;
    });
  };
}


function addFormatToTicks(jsonObj) {
  if (!jsonObj?.data?.valueFormats || !jsonObj.axis?.y) return;
  const formats = Object.values(jsonObj.data.valueFormats);
  const format = formats[0] || "";
  const cleanedFormat = format.replace(/f/g, "").trim();
  const precisionMatch = cleanedFormat.match(/\.(\d+)/);
  const decimals = precisionMatch ? parseInt(precisionMatch[1]) : 0;
  const symbolMatch = cleanedFormat.replace(/\.\d+/, "").trim();
  const symbol = symbolMatch || "";
  jsonObj.axis.y.tick = jsonObj.axis.y.tick || {};
  jsonObj.axis.y.tick.format = function(d) {
    let value = d;
    if (symbol === "%") {
      value = Number((value * 100).toFixed(decimals));
      return `${value}${symbol}`;
    }
    if (/\$|¥|€|£/.test(symbol)) {
      const absValue = Math.abs(value).toFixed(decimals);
      const formatted2 = Number(absValue).toLocaleString();
      return value < 0 ? `-${symbol}${formatted2}` : `${symbol}${formatted2}`;
    }
    value = Number(value.toFixed(decimals));
    const formatted = value.toLocaleString();
    return symbol ? `${formatted}${symbol}` : `${formatted}`;
  };
}


function configLineGraphs(graphWrapper, jsonObj, isStep, isLine, htmlLegend) {
  if (isStep) {
    jsonObj.line = jsonObj.line || {};
    jsonObj.line.point = false;
    jsonObj.line.connectNull = false;
    jsonObj.line.step = {
      type: "step-after",
      tooltipMatch: true,
      connectNull: false
    };
  }
  if (isLine) {
    if (!jsonObj?.data?.columns || !htmlLegend) return;
    const [header, ...rest] = jsonObj.data.columns;
    const sortedColumns = rest.sort((a, b) => b.slice(1).reduce((s, n) => s + n, 0) - a.slice(1).reduce((s, n) => s + n, 0));
    jsonObj.data.columns = [header, ...sortedColumns];
    const legendOrder = sortedColumns.map((col) => col[0]);
    const allLegendItems = graphWrapper.querySelectorAll(".graph-content .html-legend .legend-item, .metadata-container .html-legend .legend-item");
    allLegendItems.forEach((item) => {
      const dataKey = Array.from(item.classList).find((c) => c.startsWith("target-"))?.replace("target-", "");
      if (dataKey) item.classList.add(`order-${legendOrder.indexOf(dataKey)}`);
    });
  }
}


function hasPositiveAndNegativeValues(jsonObj) {
  if (!jsonObj.data || !jsonObj.data.columns) return false;
  let hasPositive = false;
  let hasNegative = false;
  jsonObj.data.columns.forEach((column) => {
    column.forEach((value) => {
      if (typeof value === "number") {
        if (value > 0) hasPositive = true;
        if (value < 0) hasNegative = true;
      }
    });
  });
  return hasPositive && hasNegative;
}


function configBarGraphs(jsonObj, isBar, graphContainer, isHandout) {
  if (isBar) {
    if (graphContainer && hasPositiveAndNegativeValues(jsonObj)) {
      graphContainer.classList.add("has-positive-and-negative-values");
    }
    const originalOnRendered = jsonObj.onrendered;
    jsonObj.onrendered = function() {
      if (originalOnRendered) originalOnRendered();
      const bars = document.querySelectorAll(".bb-bar");
      bars.forEach((bar) => {
        const value = parseFloat(bar.__data__.value);
        if (value > 0) {
          bar.classList.add("positive");
          bar.classList.remove("negative");
        } else if (value < 0) {
          bar.classList.add("negative");
          bar.classList.remove("positive");
        }
      });
    };
  }
}


function configPie(jsonObj) {
}


function configTooltips(jsonObj, isBar, graphContainer) {
  if (isBar) {
    jsonObj.grid = jsonObj.grid || {};
    jsonObj.grid.focus = { show: false };
  }
}


function generateGraph(graphFig) {
  const svg = graphFig.querySelector("svg");
  if (svg) {
    svg.removeAttribute("preserveAspectRatio");
    svg.removeAttribute("viewBox");
  }
}


function onRenderedFunctions(graphFig, chart) {
  const figureGraph = graphFig;
  const chartGroup = figureGraph.querySelector(".bb-chart");
  const eventRects = chartGroup?.querySelector(".bb-event-rects");
  const chartLines = chartGroup?.querySelector(".bb-chart-lines");
  if (chartGroup && eventRects && chartLines) {
    chartGroup.insertBefore(eventRects, chartLines);
  }
}


function isWebSharing() {
  return document.body.classList.contains("web-sharing");
}
function isApp() {
  return !isWebSharing();
}


function updateChartWithEventListeners(chart, graphFig) {
  if (isWebSharing()) {
    setTimeout(() => {
      chart.flush();
      window.addEventListener("resize", () => {
        setTimeout(() => {
          requestAnimationFrame(() => {
            chart.flush();
          });
        }, 10);
      });
    }, 30);
  }
  if (isApp()) {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      const currentSlide = Reveal.getCurrentSlide();
      if (currentSlide.contains(graphFig)) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          requestAnimationFrame(() => {
            chart.flush();
          });
        }, 10);
      }
    });
  }
}


function limitNumberOfSeries(jsonObj) {
  limit = 14;
  if (!jsonObj || typeof jsonObj !== "object") return jsonObj;
  if (jsonObj.columns && Array.isArray(jsonObj.columns)) {
    const [xColumn, ...series] = jsonObj.columns;
    jsonObj.columns = [xColumn, ...series.slice(0, limit)];
  } else if (jsonObj.data?.columns && Array.isArray(jsonObj.data.columns)) {
    const [xColumn, ...series] = jsonObj.data.columns;
    jsonObj.data.columns = [xColumn, ...series.slice(0, limit)];
  }
  return jsonObj;
}


function generate_graphs(element) {
  var lastChart = null;
  var graphFigs = element.querySelectorAll("figure[data-graph-json]");
  graphFigs.forEach(function(graphFig) {
    var graphWrapper = graphFig.closest(".graphWrapper");
    var graphContainer = Object.assign(document.createElement("div"), { className: "graph-container" });
    var graphContent = Object.assign(document.createElement("div"), { className: "graph-content" });
    var metadataContainer = Object.assign(document.createElement("div"), { className: "metadata-container" });
    var graphJson = graphFig.getAttribute("data-graph-json").replace(/'/g, '"');
    var jsonObj = JSON.parse(graphJson);
    jsonObj = limitNumberOfSeries(jsonObj);
    var htmlLegend = graphWrapper.querySelector(".html-legend");
    var isHandout = !!document.querySelector(".handout-slide-wrapper, .handout");
    var types = jsonObj.data?.types || {};
    var isLine = jsonObj.data?.type === "line";
    var isBar = jsonObj.data?.type === "bar";
    var isPie = jsonObj.data?.type === "pie";
    var isStacked = isBar && jsonObj.data?.groups && jsonObj.data.groups.length > 0;
    var isRotated = jsonObj.axis?.rotated === true;
    var isStep = Object.values(types).some((type) => type.startsWith("step"));
    addGraphContainerAndContent(graphFig, graphWrapper, graphContainer, graphContent, htmlLegend, metadataContainer);
    addMetaDataContainer(graphContainer, metadataContainer, htmlLegend);
    addGraphID(jsonObj);
    addClasses(jsonObj, graphFig, graphContainer, isStacked, isRotated, isStep);
    setGraphToFit(jsonObj, isHandout);
    setGraphStyles(jsonObj);
    setAxisLabels(jsonObj, graphContainer, metadataContainer, isRotated);
    setAxisTicks(jsonObj, isRotated, isHandout, graphContainer);
    setLegends(jsonObj, graphContainer, metadataContainer, graphContent, isBar, isStacked, isRotated, isLine, htmlLegend);
    setNumberOfYAxisTicksBasedOnData(jsonObj, isBar, isStacked, isLine, isRotated);
    setDataOrder(jsonObj, isPie, isStacked);
    reduceTickFontSizeBasedOnLength(jsonObj, isRotated, isHandout);
    addFormatToTicks(jsonObj);
    configLineGraphs(graphWrapper, jsonObj, isStep, isLine, htmlLegend);
    configBarGraphs(jsonObj, isBar, graphContainer, isHandout);
    configPie(jsonObj);
    configTooltips(jsonObj, isBar, graphContainer);
    generateGraph(graphFig, jsonObj);
    var chart = bb.generate(jsonObj);
    onRenderedFunctions(graphFig, chart);
    updateChartWithEventListeners(chart, graphFig);
    lastChart = chart;
  });
  return lastChart;
}
