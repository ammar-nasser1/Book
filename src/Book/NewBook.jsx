import React, { useState, useEffect, useRef } from "react";
import $ from "jquery";

import "./BookMatch.css";
function BookMatch() {
  const [linkList, setLinkList] = useState([
    { dragId: "1-draggable", dropId: "7-dropzone", color: "#264653" },
  ]);
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

  const dragQuestionRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasTempRef = useRef(null);

  useEffect(() => {
    const height = dragQuestionRef.current.offsetHeight;
    canvasRef.current.height = height;
    canvasTempRef.current.height = height;

    drawLinks();
  }, []);

  const drawLinks = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    linkList.forEach((link) => drawLink(link.dragId, link.dropId, link.color));
  };

  const drawLink = (obj1, obj2, pColor) => {
    const $obj1 = document.getElementById(obj1);
    const $obj2 = document.getElementById(obj2);

    if ($obj1 && $obj2) {
      const parent = dragQuestionRef.current.getBoundingClientRect();
      const p1 = $obj1.getBoundingClientRect();
      const w1 = $obj1.offsetWidth;
      const h1 = $obj1.offsetHeight;
      const p2 = $obj2.getBoundingClientRect();
      const w2 = $obj2.offsetWidth;
      const h2 = $obj2.offsetHeight;
      const wc = canvasRef.current.offsetWidth;

      const ctx = canvasRef.current.getContext("2d");

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
    }
  };

  const Correction = () => {
    linkList.forEach((userR) => {
      const test = linkCorrection.find(
        (cor) => cor.dragId === userR.dragId && cor.dropId === userR.dropId
      );
      if (test) {
        userR.color = "green";
      } else {
        userR.color = "red";
      }
    });
    drawLinks();
  };

  const addEventsDragAndDrop = (el) => {
    el.addEventListener("dragstart", onDragStart, false);
    el.addEventListener("dragend", onDragEnd, false);
    el.addEventListener("touchstart", touchStart, false);
    el.addEventListener("touchmove", touchMove, false);
    el.addEventListener("touchend", touchEnd, false);
  };

  const addTargetEvents = (target) => {
    target.addEventListener("dragover", onDragOver, false);
    target.addEventListener("drop", onDrop, false);
  };

  const onDragStart = (event) => {
    event.dataTransfer.setData("text/plain", event.target.id);
    setStartPoint(event.target.id);
    const idColor = parseInt(startPoint, 10);
    setColor(getRandomColor(idColor));
  };

  const onDragOver = (event) => {
    clearPathTemp();
    event.preventDefault();
  };

  const onDragEnd = (event) => {
    clearPathTemp();
    event.preventDefault();
  };

  const onDrop = (event) => {
    const dragId = event.dataTransfer.getData("text");
    const dropId = event.target.id;
    Drop(dragId, dropId);
  };

  const Drop = (dragId, dropId) => {
    console.log("sfsd");
    const deselected = linkList.filter(
      (obj) => obj.dragId === dragId || obj.dropId === dropId
    );
    if (deselected.length) {
      deselected.forEach((x) => {
        // $(`#${x.dropId}`).find("i").css("font-weight", "400");
        // $(`#${x.dropId}`).find("i").css("color", "black");
        // $(`#${x.dropId}`).find("i").removeClass("linked");
        // $(`#${x.dragId}`).find("i").css("font-weight", "400");
        // $(`#${x.dragId}`).find("i").css("color", "black");
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

    setLinkList((prevList) => {
      console.log("aa"),
        prevList.filter(
          (obj) => obj.dragId !== dragId && obj.dropId !== dropId
        );
    });

    setLinkList((prevList) => [...prevList, { dragId, dropId, color }]);

    drawLinks();
    clearPathTemp();
  };

  const touchStart = (e) => {
    const dragEl = e.path.find((x) => x.className === "dragElement");
    const idEl = $(dragEl).get(0).id;
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
    $("#dropUL")
      .find("div")
      .toArray()
      .forEach((target) => {
        const box2 = target.getBoundingClientRect();
        const x = box2.left;
        const y = box2.top;
        const h = target.offsetHeight;
        const w = target.offsetWidth;
        const b = y + h;
        const r = x + w;

        if (toucheX > x && toucheX < r && toucheY > y && toucheY < b) {
          Drop(startPoint, target.id);
        } else {
          return false;
        }
      });
    clearPathTemp();
    e.preventDefault();
  };

  const drawLinkTemp = (obj1, coordPt) => {
    const $obj1 = document.getElementById(obj1);
    const parent = dragQuestionRef.current.getBoundingClientRect();
    const p1 = $obj1.getBoundingClientRect();
    const w1 = $obj1.offsetWidth;
    const h1 = $obj1.offsetHeight;
    const p2 = coordPt;
    const c = canvasTempRef.current.getBoundingClientRect();

    const ctx = canvasTempRef.current.getContext("2d");

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
    const canvas = canvasTempRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getRandomColor = (id) => {
    const colorArray = ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"];
    return colorArray[id - 1];
  };
  const clearPath = (event) => {
    const ident = event.currentTarget.id;
    setLinkList((prevList) => prevList.filter((obj) => obj.dropId !== ident));
    console.log("jjj");
    const dragQuestion = dragQuestionRef.current;
    dragQuestion.querySelectorAll("i").forEach((icon) => {
      icon.classList.remove("linked");
      icon.style.fontWeight = "400";
      icon.style.color = "black";
    });

    drawLinks();
  };
  return (
    <div className="greenTheme q-c-dark-secondary">
      <h1>Match the correct translations</h1>
      <div ref={dragQuestionRef} id="dragQuestion" className="linkingQuestion">
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
          <canvas ref={canvasRef} id="canvas"></canvas>
          <canvas ref={canvasTempRef} id="canvasTemp"></canvas>
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
