/**
 * @author Owner
 * 
 * 如果把存取上個線的物件放在click裡面 ，會無法即時反應lid的情況
 * 
 * 所以下次更動時 改成需雙點兩個才可以畫線 順便建線 不用setline
 */

var pointObjIndex = 0;

//drag
var dragObj;
var dragBoo = false;
var pageX = 0;
var pageY = 0;

//mouse down 
var thisPointObj;

//link btn
var linkBoo = false;

//point click
var pointClickObj;

//addline
var lineIndex = 0;
var link1Obj;
var link2Obj;
var linkObjIndex = 0;

$(function() {
	
	$(".point1").css({
		'left' : '100px',
		'top' : '100px',
	})
	
	$(".point2").css({
		'left' : '500px',
		'top' : '600px',
	})
	
	
	
	//setLine();
	//fixX = ($(".line1").width() - $("point1").width()) * 0.5;
	//setLine();
	
	//add point
	$(".addPointBtn").click(function() {
		addPointObj();
	})
	
	
	$(document).mousemove(function(e) {
		pageX = e.pageX;
		pageY = e.pageY;
		
		//alert(pageX);
		//$(".debug").text("mousemove");	
		$(".msg").text("");
		
		if(dragBoo)
		{
			var lid = $(thisPointObj).attr("lid");
			
			$(".debug").text("lid: " + lid + " thisPointObj " + thisPointObj)	;	
			//alert(lid);
			if(lid != undefined)
			{
				var lidAry = lid.split(",");
				//alert(lidAry);
				for(var i = 0; i < lidAry.length; i++)
				{
					var lineObj = $(".line[lid=" + lidAry[i] + "]");
					//fixX = ($(lineObj).width() - $(".point").width()) * 0.5;
					setLine(lidAry[i], $(lineObj).attr("cid"), $(lineObj).attr("tid"));
				}
				
			}
			
			setDrag();
			
			hitTest(thisPointObj);
		}
	})
	
	$(".drag").bind("mousedown", mouseDown);
	$(".drag").bind("mouseup", mouseUp);
	
	$(".linkBtn").click(function() {
		//alert("add line");
		linkBoo = true;
		$(".msg").text("請選擇節點");
	})
	
})

function mouseDown(){
	dragObj = $(this);
	dragBoo = true;
	thisPointObj = $(this);
};


function mouseUp(){
	dragObj = null;
	dragBoo = false;
	
};

function pointClick(obj) {
	if(linkBoo == true)
	{
		pointLinkObj(obj);
	}
	
	
	//set select this obj css
	$(".drag").css({
		'border-width' : '1px'
	})
	$(obj).css({
		'border-width' : '3px'
	})
		
	pointClickObj = $(obj);
	
	$(".debug").text("poinClick: " + $(thisPointObj).attr("pid") + " lid: " + $(thisPointObj).attr("lid"));	
}

function pointLinkObj(obj) {
	
	switch(linkObjIndex)
	{
		case 0:
			link1Obj = $(obj);
			$(".msg").text("從目前的節點連結到？");
			linkObjIndex++;
			
			$(link1Obj).css({
				'background' : '#f0f0f0'
			})
		break;
		case 1:
			if($(obj).is(link1Obj))
			{
				alert("請勿選擇自己");
			}
			else
			{
				//判斷是否已連結過
				link2Obj = $(obj);
				var isExist = false;
				var p1_lid = $(link1Obj).attr("lid");
				var p2_lid = $(link2Obj).attr("lid");
				
				//alert(p1_lid + " " + p2_lid);
				if(p1_lid != undefined && p2_lid != undefined)
				{
					var p1_lidAry = p1_lid.split(",");
					var p2_lidAry = p2_lid.split(",");
					
					for(var i = 0; i < p1_lidAry.length; i++)
					{
						for(var j = 0; j < p2_lidAry.length; j++)
						{
							if(p1_lidAry[i] == p2_lidAry[j]	)
							{
								isExist = true;
								break;
							}
						}
					}
				}
				
				if(isExist)
				{
					alert("兩點已連結過");
				}
				else
				{
					
					$(".msg").text("已連結到此結點, 連結完畢");
					addLine(link1Obj, link2Obj);
				}
				
				//reset
				$(link1Obj).css({
					'background-color' : '#fff'
				})
				$(link2Obj).css({
					'background-color' : '#fff'
				})
				
				//clear
				linkBoo = false;
				linkObjIndex = 0;
				link1Obj = null;
				link2Obj = null;
				
			}
			
		break;
	}
	
	
	$(".debug").text("linkObjIndex: " + linkObjIndex);
	
}


function addLine(childObj, targetObj)
{
	
	var cid = $(childObj).attr("pid");
	var tid = $(targetObj).attr("pid");
	var c_lid = $(childObj).attr("lid");
	var t_lid = $(targetObj).attr("lid");
	
	//alert(t_lid);
	if(t_lid != undefined)
	{
		t_lid += "," + lineIndex;
	}
	else
	{
		t_lid = lineIndex;
	}
	
	if(c_lid != undefined)
	{
		c_lid += "," + lineIndex;
	}
	else
	{
		c_lid = lineIndex;
	}
	
	
	$(".canvas").append(
		"<div class='line' lid='" + lineIndex + "' cid='" + cid + "' tid='" + tid + "'></div>"
	);
	
	$(childObj).attr("lid", c_lid);
	$(targetObj).attr("lid", t_lid);
	setLine(lineIndex, cid, tid);
	
	lineIndex++;
	linkBoo = false;
	
}

function setLine(lineId, p1, p2) {
	var line = $(".line[lid=" + lineId + "]");
	
		
	var p1obj = $(".point[pid=" + p1 + "]");
	var p2obj = $(".point[pid=" + p2 + "]");
	
	$(line).css({
		'width' : get2PointDist($(p1obj), $(p2obj))
	})
	
	var lineW = get2PointDist($(p1obj), $(p2obj));
					
	$(line).css({
		'left' : get2PointXCenter($(p1obj), $(p2obj)) - getFixX(line) + ($(".p1obj").width() * 0.5 ),
		'top' : get2PointYCenter($(p1obj), $(p2obj)),
		'transform' : 'rotate(' + get2PointZRotate($(p1obj), $(p2obj)) + 'deg)'
	})
	
	//alert("set line: " + lineId + " " + p1 + " " + p2 );
}

/**
 * @param obj = Object
 */
function getFixX(obj) {
	return ($(obj).width() - $(".point").width()) * 0.5;
}



/**
 * 求兩點的距離
 * 
 * @param {Object} o1
 * @param {Object} o2
 * @return ab = distance
 */
function get2PointDist(o1, o2) {
	
	var o1x , o1y, o2x, o2y, ab;
	o1x = parseInt($(o1).css("left"));
	o1y = parseInt($(o1).css("top"));
	
	o2x = parseInt($(o2).css("left"));
	o2y = parseInt($(o2).css("top"));
	ab = Math.sqrt(Math.pow(o2x - o1x, 2) + Math.pow(o2y - o1y, 2) )
	+ parseInt($(o1).css("border-left-width")) + parseInt($(o1).css("border-right-width"))
	+ parseInt($(o1).css("border-top-width")) + parseInt($(o1).css("border-bottom-width"))
	+ parseInt($(o2).css("border-left-width")) + parseInt($(o2).css("border-right-width"))
	+ parseInt($(o2).css("border-top-width")) + parseInt($(o2).css("border-bottom-width"))
	;
	
	return ab;
}

/**
 * 求兩點間X的中心點
 * 
 * @param {Object} o1
 * @param {Object} o2
 * @return int dis center point
 */
function get2PointXCenter(o1, o2) {
	var o1x = parseFloat($(o1).css("left"));
	var o2x = parseFloat($(o2).css("left"));
		
	//	
	//
	var center = (o1x + o2x ) * 0.5 ;
	return center;
	
}


/**
 * 求兩點間的斜率所造成的直線旋轉角度
 * 
 * @param {Object} o1
 * @param {Object} o2
 * @return int dis center point
 */
function get2PointYCenter(o1, o2) {
	var o1y = parseInt($(o1).css("top")) + (parseInt($(o1).height()) / 2);
	var o2y = parseInt($(o2).css("top")) + (parseInt($(o2).height()) / 2);
		
	var center = (o1y + o2y ) * 0.5;
	return center;
	
}

/**
 * 求兩點間Y的中心點
 * 
 * @param {Object} o1
 * @param {Object} o2
 * @return int dis center point
 */
function get2PointZRotate(o1, o2) {
	var o1x , o1y, o2x, o2y;
	o1x = parseInt($(o1).css("left"));
	o1y = parseInt($(o1).css("top"));
	
	o2x = parseInt($(o2).css("left"));
	o2y = parseInt($(o2).css("top"));
		
	//var m = parseFloat((o1y - o2y) / (o1x - o2x))  * 180;
	var m = Math.atan2(o1y - o2y , o1x - o2x) / (Math.PI / 180);
	
	return m;
	
}


function setDrag() {
	$(dragObj).css({
		'left' : pageX - ($(dragObj).width() / 2),
		'top' : pageY - ($(dragObj).height() / 2),
	})
};

function hitTest(obj) {
	$(".drag").each(function() {
		
			var x = parseInt($(this).css("left"));
			var y = parseInt($(this).css("top"));
			var thisW = parseInt($(this).width()) ;
			var thisH = parseInt($(this).height()) ;
			
			var oW = parseInt($(obj).width());
			var oH = parseInt($(obj).height());
			var oWhalf = oW;
			var oHhalf = oH;
			var ox = parseInt($(obj).css("left")) + oWhalf;
			var oy = parseInt($(obj).css("top")) + oHhalf;
			
			var rang = 10;
			//alert("321");
			
			var left = true;
			var top = true;
			var right = true;
			var bottom = true;
			
			//左右檢測
			//碰撞者由中心往左右算起
			if(!$(this).is(obj))
			{
				//alert("312");
				
				if((ox + oWhalf  > x && ox - oWhalf  < x + thisW) && (oy + oHhalf > y && oy - oHhalf < y + thisH))
				{
					if((oy + oHhalf > y && oy < y + thisH ) )
					{
						$(obj).css({
							'top' : y - thisH - 10
						})
					}
					
					if((oy - oHhalf < y + thisH && oy > y) )
					{
						$(obj).css({
							'top' : y + thisH + 10
						})
					}
					
					
				}
			}
	})
}

function addPointObj() {
	
	$(".canvas").append(
		"<div class='drag point' style='left:" + (($(document).width() * 0.5) - 50) + "px;top: " + (($(document).height() * 0.5) - 50) + "px' onclick='pointClick(this)'  pid='" + pointObjIndex + "'></div>"
	)
	
	$(".drag").bind("mousedown", mouseDown);
	$(".drag").bind("mouseup", mouseUp);
	
	
	pointObjIndex++;
}


