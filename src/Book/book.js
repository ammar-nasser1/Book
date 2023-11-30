var linkList = [{dragId: "1-draggable", dropId: "7-dropzone", color: "#264653"}];
var linkCorrection = [{dragId: "1-draggable", dropId: "7-dropzone", color: "#33991a"},
                      {dragId: "2-draggable", dropId: "5-dropzone", color: "#4c061d"},
                      {dragId: "3-draggable", dropId: "11-dropzone", color: "#d17a22"},
                      {dragId: "4-draggable", dropId: "4-dropzone", color: "#3b3923"},
                      {dragId: "5-draggable", dropId: "2-dropzone", color: "#3b5249"}]

//var linkList = [];
var startPoint;
var color;
var toucheX;
var toucheY;

/****Init & Misc****/
$(document).ready(function() {
  var height =   $('#dragUL').height();
  $('#canvas').attr("height",height);
  $('#canvas').attr("width", $('#canvas').width());

  $('#canvasTemp').attr("width", $('#canvasTemp').width());
  $('#canvasTemp').attr("height",height);

  $('#dragQuestion').bind('dragover', function(){
    var top = window.event.pageY,
        left = window.event.pageX;
    drawLinkTemp(startPoint,{top,left});
  });


  $("#dragUL").find("div").toArray().forEach( dragEl => addEventsDragAndDrop(dragEl));
  $("#dropUL").find("div").toArray().forEach( dropEl => addTargetEvents(dropEl));




  drawLinks();
});
function getRandomColor(id){
  /* var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FF9999', '#00B3E6', 
                    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
                    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
                    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
                    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
                    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];*/ 

  var colorArray =["#264653","#2a9d8f","#e9c46a","#f4a261","#e76f51"];
  return colorArray[id-1];
}
function Correction(){
  linkList.forEach(userR =>{
    var test = linkCorrection.find(cor => {return cor.dragId == userR.dragId && cor.dropId == userR.dropId});
    if(test){
      userR.color = "green";
    }else{
      userR.color = "red";
    }
  });
  drawLinks();
}

/****Add event****/
function addEventsDragAndDrop(el) {
  el.addEventListener('dragstart', onDragStart, false);
  el.addEventListener('dragend', onDragEnd, false);
  el.addEventListener('touchstart', touchStart, false);
  el.addEventListener('touchmove', touchMove, false);
  el.addEventListener('touchend', touchEnd, false);
}
function addTargetEvents(target) {
  target.addEventListener('dragover', onDragOver, false); 
  target.addEventListener('drop', onDrop, false);
}

/****DRAG AND DROP****/
function onDragStart(event) {
  event
    .dataTransfer
    .setData('text/plain', event.target.id);
  startPoint = event.target.id;
  var idColor = parseInt(startPoint,10);
  color = getRandomColor(idColor);
  /*  event
    .currentTarget
    .style
    .backgroundColor = 'yellow';*/ 
}
function onDragOver(event) { 
  clearPathTemp();
  event.preventDefault();
}
function onDragEnd(event) { 
  clearPathTemp();
  event.preventDefault();
}
function onDrop(event) {
  const dragId = event
  .dataTransfer
  .getData('text');

  const dropId = event.target.id;
  Drop(dragId,dropId);

}
function Drop(dragId,dropId){
  var deselected = linkList.filter(obj => {
    return obj.dragId == dragId || obj.dropId == dropId;
  });
  if(deselected.length){
    deselected.forEach( x => {
      $( "#"+x.dropId ).find( "i" ).css( "font-weight", "400" ); 
      $( "#"+x.dropId ).find( "i" ).css( "color", "black"); 
       $( "#"+x.dropId ).find( "i" ).removeClass('linked');
      $( "#"+x.dragId ).find( "i" ).css( "font-weight", "400" ); 
      $( "#"+x.dragId ).find( "i" ).css( "color", "black");      
    });
  }

  linkList = linkList.filter(obj => {
    return obj.dragId != dragId ;   
  });
  linkList = linkList.filter(obj => {
    return  obj.dropId != dropId;   
  });

  linkList.push({dragId,dropId,color});
  console.log(linkList);
  drawLinks();
  clearPathTemp();
}
/****TOUCHE DEVICE****/
function touchStart(e) {
  var dragEl = e.path.find(x =>{ return x.className == "dragElement"})
  var idEl = $(dragEl).get(0).id;  

  startPoint = idEl;
  var idColor = parseInt(idEl,10);
  color = getRandomColor(idColor); 
}
function touchMove(e) {
  e.preventDefault();
  var top = toucheY = e.touches[0].pageY,
      left = toucheX = e.touches[0].pageX;
  drawLinkTemp(startPoint,{top,left});
}
function touchEnd(e){  
  $("#dropUL").find("div").toArray().forEach( target =>{
    var box2 = target.getBoundingClientRect(),
        x = box2.left,
        y = box2.top,
        h = target.offsetHeight,
        w = target.offsetWidth,
        b = y + h,
        r = x + w;

    if (toucheX > x &&  toucheX < r && toucheY > y &&  toucheY < b) {
      Drop(startPoint,target.id);  
    } else {     
      return false;
    } 
  });  
  clearPathTemp();
  event.preventDefault();
}

/****Draw final line****/
function drawLinks(){
  var canvas = $('#canvas').get(0);
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  linkList.forEach(link => drawLink(link.dragId,link.dropId,link.color));
}
function drawLink(obj1,obj2,pColor){  

  var canvas = $('#canvas').get(0);
  var ctx = canvas.getContext('2d');

  var $obj1 = $("#"+obj1);
  var $obj2 = $("#"+obj2);
  var parent = $('#dragQuestion').offset();
  var p1 = $obj1.offset();
  var w1 = $obj1.width();
  var h1 = $obj1.height();
  var p2 = $obj2.offset();
  var w2 = $obj2.width();
  var h2 = $obj2.height();
  var  wc =$('#canvas').width();
  ctx.beginPath();
  ctx.strokeStyle = pColor? pColor : color;
  ctx.lineWidth = 3;
  ctx.moveTo(0,p1.top-parent.top+(h1/2)-20-2);
  ctx.bezierCurveTo(wc/2,p1.top-parent.top+(h1/2)-20-2,
                    wc/2,p2.top-parent.top+(h2/2)-20-2,
                    wc-4,p2.top-parent.top+(h2/2)-20-2);
  ctx.stroke();

  $obj1.children().css( "color", pColor? pColor : color );
  $obj1.children().css( "font-weight", "900" );
  $obj2.children().css( "color", pColor? pColor : color );
  $obj2.children().css( "font-weight", "900" );
  $obj2.children().addClass('linked');
}
function clearPath(event){  
  var ident = event.currentTarget.id;  
  linkList = linkList.filter(obj => {
    return obj.dropId != ident    
  });
  $( "#dragQuestion" ).find( "i" ).removeClass('linked');
  $( "#dragQuestion" ).find( "i" ).css( "font-weight", "400" ); 
  $( "#dragQuestion" ).find( "i" ).css( "color", "black");  
  drawLinks();
}

/****Draw path mouse line****/
function drawLinkTemp(obj1,coordPt){
  var canvas = $('#canvasTemp').get(0);
  var ctx = canvas.getContext('2d');

  var $obj1 = $("#"+obj1);
  var parent = $('#dragQuestion').offset();
  var p1 = $obj1.offset();
  var w1 = $obj1.width();
  var h1 = $obj1.height();
  var p2 = coordPt;
  var  c =$('#canvasTemp').offset();

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.moveTo(0,p1.top-parent.top+(h1/2)-20-2);

  ctx.bezierCurveTo((p2.left - c.left)/2,p1.top-parent.top-19-2,
                    (p2.left - c.left)/2,p2.top-parent.top-19-2,
                    p2.left - c.left,p2.top-parent.top-19-2);
  clearPathTemp();  
  ctx.stroke();
}
function clearPathTemp(){
  var canvas = $('#canvasTemp').get(0);
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}




