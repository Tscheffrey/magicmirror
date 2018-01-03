$(function(){
	var canvas = new MainCanvas($("#magicMirror"));
	var widget1 = new ClockWidget();
	widget1.setHeight(7);
	widget1.setWidth(10);
	canvas.addWidget(widget1);


	var widget2 = new Widget();
	widget2.setHeight(11);
	canvas.addWidget(widget2);

	var widget3 = new Widget();
	widget3.setHeight(20);
	widget3.setWidth(30);
	canvas.addWidget(widget3);
});


function MainCanvas(domReference){
	if(domReference){
		this.domRef = domReference;

		this.domRef.addClass("--mm-mainCanvas");
		this.unsetEditMode();
		this.initializeEditButton();
	}
	console.log("MainCanvas initialized");
}
MainCanvas.prototype = {
	domRef:undefined,
	widgets:[],
	// visible:false,
	initializeEditButton:function(){
		$( "<div/>", {
		  		class: "--mm-editButton",
				  click: $.proxy(this.toggleEditMode, this)
				})
		  .appendTo( this.domRef );
	},
	setEditMode:function(){
		this.editMode = true;
		this.domRef.addClass("--mm-editMode");
		var widgetDomArray = this._getWidgetDomArray();
		this.draggable = widgetDomArray.draggable({
		 containment:this.domRef,
		 stack: widgetDomArray,
			// drag:function(event, ui){
			//   console.log("top: " + ui.offset.top + "\nleft: "+ ui.offset.left);
			// },
			// stop: function(){
			//   console.log("stop");
			// }
		});
		this._getWidgetDomArray().draggable("enable");
	},
	unsetEditMode:function(){
		this.editMode = false;
		this.domRef.removeClass("--mm-editMode");
		this.flipAllWidgetsToFront();
		if(this.draggable){
			this._getWidgetDomArray().draggable("disable");
		}
	},
	toggleEditMode:function(){
		if(this.editMode) this.unsetEditMode();
		else this.setEditMode();
	},
	addWidget:function(widget){
		if(widget){
			if(widget instanceof Widget){
				this.widgets.push(widget);
				this.domRef.append(widget.domRef);
				widget.parentCanvas = this;
			}
		}
	},
	flipAllWidgetsToFront:function(){
		for (var i in this.widgets) {
			this.widgets[i].flipToFront();
		}
	},
	_getWidgetDomArray:function(){
		var result = [];
		for (var i in this.widgets) {
			if(this.widgets[i].domRef) result.push(this.widgets[i].domRef);
		}
		return $(result);
	}
}


function Widget(){
	this._build();
	this.setHeight(10);
	this.setWidth(10);
}
Widget.prototype = {
	widgetName:"Standard Widget",
	width:0, //Breite des Widgets in rem
	height:0, //Höhe des Widgets in rem
	domRef:undefined, //jQuery-Objekt des DOM-Objekts
	frontVisible:true, //zeigt an, ob Widget nach vorne geflipped ist
	settingsButton:undefined, //jQuery-Objekt des Einstellungs-Buttons
	nameTag:undefined,
	parentCanvas:undefined,
	frontSideRef:undefined,
	backSideRef:undefined,
	settings:{},
	setHeight:function(height){
		this.domRef.height(height + "rem");
		this.setSetting("height", height);
	},
	setWidth:function(width){
		this.domRef.width(width + "rem");
		this.setSetting("width", width);
	},
	flipToFront:function(){
		this.domRef.removeClass("--mm-widget-flipped");
		this.frontVisible = true;
	},
	flipToBack:function(){
		if(this.parentCanvas) this.parentCanvas.flipAllWidgetsToFront();
		this.domRef.addClass("--mm-widget-flipped");
		this.frontVisible = false;
	},
	toggleFlip:function(){
		if(this.frontVisible) this.flipToBack();
		else this.flipToFront();
	},
	addToCanvas:function(canvas){
		canvas.addWidget(this);
	},
	setSetting(key,value){
		this.settings[key] = value;
	},
	_initializeSettingsButton:function(){
		this.domRef.append($("<div/>", {
					class: "--mm-widget-settingsButton --mm-visible",
					click: $.proxy(this.toggleFlip, this)
				}));
	},
	_initializeNameTag:function(){
		this.nameTag = $( "<div/>", {
					class: "--mm-widget-nameTag",
					text: this.widgetName
				});
		this.frontSideRef.append(this.nameTag)
	},
	_buildFrontSide:function(){
		this.frontSideRef = $("<div/>", {
					class: "--mm-widget-front",
					text: "front"
			});
		this.domRef.append(this.frontSideRef)
	},
	_buildBackSide:function(){
		this.backSideRef = $("<div/>", {
							class: "--mm-widget-back",
							text:"Settings"
						});
		this.domRef.append(this.backSideRef);
	},
	_build:function(){
		this.domRef = $( "<div/>", {
					class: "--mm-widget"
				});

		this._buildFrontSide();
		this._buildBackSide();

		this._initializeNameTag();
		this._initializeSettingsButton();
	}
}




//ClockWidget erbt von Widget
function ClockWidget(){
	Widget.call(this);
}
 ClockWidget.prototype = Object.create(Widget.prototype);
 ClockWidget.prototype.constructor = ClockWidget;
 ClockWidget.prototype.widgetName = "Clock";

 ClockWidget.prototype._buildFrontSide = function(){
	 this.frontSideRef = $("<div/>", {
				 class: "--mm-widget-front",
				 // text: "front2"
		 });

	 this.domRef.append(this.frontSideRef)

	 this.hoursContainer = $("<span/>", {
				 class: "--mm-clockWidget-hours",
				 text: "12"
		 }).appendTo(this.frontSideRef);

		 this.minutesContainer = $("<span/>", {
					 class: "--mm-clockWidget-minutes",
					 text: "45"
			 }).appendTo(this.frontSideRef);
 }
