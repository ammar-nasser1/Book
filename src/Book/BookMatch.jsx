import React, { useState, useEffect, useRef } from "react";
import $ from "jquery";

import "./BookMatch.css";
function BookMatch() {
  const [linkList, setLinkList] = useState([
    { dragId: "1-draggable", dropId: "7-dropzone", color: "#264653" },
    { dragId: "2-draggable", dropId: "8-dropzone", color: "#264653" },
  ]);
  // dragId: "1-draggable", dropId: "7-dropzone", color: "#264653"
  const [linkCorrection] = useState([
    { dragId: "1-draggable", dropId: "7-dropzone", color: "#33991a" },
    { dragId: "2-draggable", dropId: "5-dropzone", color: "#4c061d" },
    { dragId: "3-draggable", dropId: "11-dropzone", color: "#d17a22" },
    { dragId: "4-draggable", dropId: "4-dropzone", color: "#3b3923" },
    { dragId: "5-draggable", dropId: "2-dropzone", color: "#3b5249" },
  ]);
  const [startPoint, setStartPoint] = useState(null);
  const [color, setColor] = useState(null);
  const [toucheX, setToucheX] = useState(null);
  const [toucheY, setToucheY] = useState(null);

  useEffect(() => {
    const height = document.getElementById("dragUL").offsetHeight;
    document.getElementById("canvas").setAttribute("height", height);
    document
      .getElementById("canvas")
      .setAttribute("width", document.getElementById("canvas").offsetWidth);

    document
      .getElementById("canvasTemp")
      .setAttribute("width", document.getElementById("canvasTemp").offsetWidth);
    document.getElementById("canvasTemp").setAttribute("height", height);

    document
      .getElementById("dragQuestion")
      .addEventListener("dragover", handleDragOver);

    document
      .querySelectorAll("#dragUL div")
      .forEach((dragEl) => addEventsDragAndDrop(dragEl));
    document
      .querySelectorAll("#dropUL div")
      .forEach((dropEl) => addTargetEvents(dropEl));

    drawLinks();
  }, [startPoint, setStartPoint, color, setColor, linkList, setLinkList]);

  const getRandomColor = (id) => {
    const colorArray = ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"];
    return colorArray[id - 1];
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    const top = event.pageY;
    const left = event.pageX;
    drawLinkTemp(startPoint, { top, left });
  };

  const addEventsDragAndDrop = (el) => {
    el.addEventListener("dragstart", onDragStart);
    el.addEventListener("dragend", onDragEnd);
    el.addEventListener("touchstart", touchStart);
    el.addEventListener("touchmove", touchMove);
    el.addEventListener("touchend", touchEnd);
  };

  const addTargetEvents = (target) => {
    target.addEventListener("dragover", onDragOver);
    target.addEventListener("drop", onDrop);
  };

  const onDragStart = (event) => {
    console.log(event.target.id);
    event.dataTransfer.setData("text/plain", event.target.id);
    console.log(event.target.id);

    setStartPoint(event.target.id);
    const idColor = parseInt(event.target.id, 10);
    setColor(getRandomColor(idColor));
  };

  const onDragOver = (event) => {
    clearPathTemp();
    event.preventDefault();
  };

  const onDragEnd = () => {
    clearPathTemp();
  };

  const onDrop = (event) => {
    console.log("df", event.target.id);
    const dragId = event.dataTransfer.getData("text");
    const dropId = event.target.id;
    Drop(dragId, dropId);
  };

  const Drop = (dragId, dropId) => {
    const deselected = linkList.filter(
      (obj) => obj.dragId === dragId || obj.dropId === dropId
    );
    if (deselected.length) {
      deselected.forEach((x) => {
        document.getElementById(x.dropId).querySelector("i").style.fontWeight =
          "400";
        document.getElementById(x.dropId).querySelector("i").style.color =
          "black";
        document
          .getElementById(x.dropId)
          .querySelector("i")
          .classList.remove("linked");
        document.getElementById(x.dragId).querySelector("i").style.fontWeight =
          "400";
        document.getElementById(x.dragId).querySelector("i").style.color =
          "black";
      });
    }

    console.log("before", linkList);

    setLinkList((prevLinkList) => {
      prevLinkList.filter((obj) => {
        obj.dragId !== dragId && obj.dropId !== dropId;
      });
      return [
        ...prevLinkList,
        { dragId: dragId, dropId: dropId, color: color },
      ];
    });
    // setLinkList((prevLinkList) =>
    //   prevLinkList.map((userR) => {
    //     const test = linkCorrection.find(
    //       (cor) => cor.dragId === userR.dragId && cor.dropId === userR.dropId
    //     );

    //     return test ? { ...userR, color: "green" } : { ...userR, color: "red" };
    //   })
    // );
    // setLinkList((prevLinkList) =>
    //   prevLinkList.filter(
    //     (obj) => obj.dragId !== dragId && obj.dropId !== dropId
    //   )
    // );

    console.log("dragId", dragId);
    console.log("dropId", dropId);
    console.log("color", linkList);

    console.log("after", linkList);
    // setLinkList((prevLinkList) => [
    //   ...prevLinkList,
    //   { dragId: dragId, dropId: dropId, color: color },
    // ]);
    // drawLinks();
    clearPathTemp();
  };
  useEffect(() => {
    drawLinks();
  }, [linkList]);

  const touchStart = (e) => {
    const dragEl = e.path.find((x) => x.className === "dragElement");
    const idEl = dragEl ? dragEl.id : null;

    setStartPoint(idEl);
    const idColor = parseInt(idEl, 10);
    setColor(getRandomColor(idColor));
  };

  const touchMove = (e) => {
    e.preventDefault();
    const top = setToucheY(e.touches[0].pageY);
    const left = setToucheX(e.touches[0].pageX);
    drawLinkTemp(startPoint, { top, left });
  };

  const touchEnd = (e) => {
    const dropULDivs = document
      .getElementById("dropUL")
      .querySelectorAll("div");
    dropULDivs.forEach((target) => {
      const box2 = target.getBoundingClientRect();
      const x = box2.left;
      const y = box2.top;
      const h = target.offsetHeight;
      const w = target.offsetWidth;
      const b = y + h;
      const r = x + w;

      if (toucheX > x && toucheX < r && toucheY > y && toucheY < b) {
        Drop(startPoint, target.id);
      }
    });
    clearPathTemp();
    e.preventDefault();
  };

  const drawLinks = () => {
    console.log("drawLinks");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    linkList.forEach((link) => drawLink(link.dragId, link.dropId, link.color));
  };

  const drawLink = (obj1, obj2, pColor) => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const $obj1 = document.getElementById(obj1);
    const $obj2 = document.getElementById(obj2);
    const parent = document
      .getElementById("dragQuestion")
      .getBoundingClientRect();
    const p1 = $obj1.getBoundingClientRect();
    const w1 = $obj1.offsetWidth;
    const h1 = $obj1.offsetHeight;
    const p2 = $obj2.getBoundingClientRect();
    const w2 = $obj2.offsetWidth;
    const h2 = $obj2.offsetHeight;
    const wc = canvas.offsetWidth;

    ctx.beginPath();
    ctx.strokeStyle = pColor ? pColor : color;
    ctx.lineWidth = 3;
    ctx.moveTo(0, p1.top - parent.top + h1 / 2 - 20 - 2);
    ctx.bezierCurveTo(
      wc / 2,
      p1.top - parent.top + h1 / 2 - 20 - 2,
      wc / 2,
      p2.top - parent.top + h2 / 2 - 20 - 2,
      wc - 4,
      p2.top - parent.top + h2 / 2 - 20 - 2
    );
    ctx.stroke();

    $obj1.querySelector("i").style.color = pColor ? pColor : color;
    $obj1.querySelector("i").style.fontWeight = "900";
    $obj2.querySelector("i").style.color = pColor ? pColor : color;
    $obj2.querySelector("i").style.fontWeight = "900";
    $obj2.querySelector("i").classList.add("linked");
  };

  const clearPath = (event) => {
    const ident = event.currentTarget.id;
    setLinkList((prevLinkList) =>
      prevLinkList.filter((obj) => obj.dropId !== ident)
    );
    document
      .getElementById("dragQuestion")
      .querySelectorAll("i")
      .forEach((icon) => {
        icon.classList.remove("linked");
        icon.style.fontWeight = "400";
        icon.style.color = "black";
      });
    drawLinks();
  };

  const drawLinkTemp = (obj1, coordPt) => {
    const canvas = document.getElementById("canvasTemp");
    const ctx = canvas.getContext("2d");

    const $obj1 = document.getElementById(obj1);
    const parent = document
      .getElementById("dragQuestion")
      .getBoundingClientRect();
    const p1 = $obj1.getBoundingClientRect();
    const w1 = $obj1.offsetWidth;
    const h1 = $obj1.offsetHeight;
    const p2 = coordPt;
    const c = document.getElementById("canvasTemp").getBoundingClientRect();

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.moveTo(0, p1.top - parent.top + h1 / 2 - 20 - 2);

    ctx.bezierCurveTo(
      (p2.left - c.left) / 2,
      p1.top - parent.top - 19 - 2,
      (p2.left - c.left) / 2,
      p2.top - parent.top - 19 - 2,
      p2.left - c.left,
      p2.top - parent.top - 19 - 2
    );
    clearPathTemp();
    ctx.stroke();
  };

  const clearPathTemp = () => {
    const canvas = document.getElementById("canvasTemp");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const Correction = () => {
    setLinkList((prevLinkList) =>
      prevLinkList.map((userR) => {
        const test = linkCorrection.find(
          (cor) => cor.dragId === userR.dragId && cor.dropId === userR.dropId
        );
        return test ? { ...userR, color: "green" } : { ...userR, color: "red" };
      })
    );
    drawLinks();
  };

  return (
    <div className="greenTheme q-c-dark-secondary">
      <h1>Match the correct translations</h1>
      <div id="dragQuestion" className="linkingQuestion">
        <ul id="dragUL">
          <li>
            Interview
            <div id="1-draggable" className="dragElement" draggable="true">
              <i className="far fa-circle"></i>
            </div>
          </li>
          <li>
            Road
            <div id="2-draggable" className="dragElement" draggable="true">
              <i className="far fa-circle"></i>
            </div>
          </li>
          <li>
            Necklace
            <div id="3-draggable" className="dragElement" draggable="true">
              <i className="far fa-circle"></i>
            </div>
          </li>
          <li>
            Cockroach
            <div id="4-draggable" className="dragElement" draggable="true">
              <i className="far fa-circle"></i>
            </div>
          </li>
          <li>
            Screwdriver
            <div id="5-draggable" className="dragElement" draggable="true">
              <i className="far fa-circle"></i>
            </div>
          </li>
        </ul>
        <div className="canvasWrapper">
          <canvas id="canvas"></canvas>
          <canvas id="canvasTemp"></canvas>
        </div>
        <ul id="dropUL">
          <li>
            <div
              id="1-dropzone"
              onClick={clearPath}
              className="dragElement dropElement"
            >
              <i className="far fa-circle"></i>
            </div>
            Marcassin
          </li>
          <li>
            <div
              id="2-dropzone"
              onClick={clearPath}
              className="dragElement dropElement"
            >
              <i className="far fa-circle"></i>
            </div>
            Tournevis
          </li>
          <li>
            <div
              id="3-dropzone"
              onClick={clearPath}
              className="dragElement dropElement"
            >
              <i className="far fa-circle"></i>
            </div>
            Petit four
          </li>
          <li>
            <div
              id="4-dropzone"
              onClick={clearPath}
              className="dragElement dropElement"
            >
              <i className="far fa-circle"></i>
            </div>
            Cafard
          </li>
          <li>
            <div
              id="5-dropzone"
              onClick={clearPath}
              className="dragElement dropElement"
            >
              <i className="far fa-circle"></i>
            </div>
            Route
          </li>
          <li>
            <div
              id="6-dropzone"
              onClick={clearPath}
              className="dragElement dropElement"
            >
              <i className="far fa-circle"></i>
            </div>
            Tulipe
          </li>
          <li>
            <div
              id="7-dropzone"
              onClick={clearPath}
              className="dragElement dropElement"
            >
              <i className="far fa-circle"></i>
            </div>
            Entretien
          </li>
          <li>
            <div
              id="8-dropzone"
              onClick={clearPath}
              className="dragElement dropElement"
            >
              <i className="far fa-circle"></i>
            </div>
            Rhdodendron
          </li>
          <li>
            <div
              id="9-dropzone"
              onClick={clearPath}
              className="dragElement dropElement"
            >
              <i className="far fa-circle"></i>
            </div>
            Omelette du fromage
          </li>
          <li>
            <div
              id="10-dropzone"
              onClick={clearPath}
              className="dragElement dropElement"
            >
              <i className="far fa-circle"></i>
            </div>
            Baguette
          </li>
          <li>
            <div
              id="11-dropzone"
              onClick={clearPath}
              className="dragElement dropElement"
            >
              <i className="far fa-circle"></i>
            </div>
            Collier
          </li>
          <li>
            <div
              id="12-dropzone"
              onClick={clearPath}
              className="dragElement dropElement"
            >
              <i className="far fa-circle"></i>
            </div>
            Pain au chocolatine
          </li>
        </ul>
      </div>
      <button className="q-btn q-main" onClick={Correction}>
        Correction
      </button>
    </div>
  );
}

export default BookMatch;
