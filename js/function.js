$(function(){
	var canvas = new MainCanvas($("#magicMirror"));
	var widget1 = new ClockWidget();
	widget1.setHeight(5);
	widget1.setWidth(10);
	canvas.addWidget(widget1);


	var widget2 = new Widget();
	widget2.setHeight(3);
	canvas.addWidget(widget2);

	var widget3 = new Widget();
	widget3.setHeight(11);
	widget3.setWidth(11);
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
	domRef:null,
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
	this.domRef = $( "<div/>", {
				class: "--mm-widget"
			});

	this.frontSideRef = $("<div/>", {
				class: "--mm-widget-front",
				text: "front"
			});

	this.backSideRef = $("<div/>", {
						class: "--mm-widget-back",
						text:"back"
					});
	this.domRef.append(this.frontSideRef).append(this.backSideRef);
	this._initializeSettingsButton();
	this.setHeight(10);
	this.setWidth(10);
}
Widget.prototype = {
	width:0,
	height:0,
	domRef:null,
	frontVisible:true,
	settingsButton:null,
	parentCanvas:null,
	frontSideRef:null,
	backSideRef:null,

	setHeight:function(height){
		this.domRef.height(height + "rem");
	},
	setWidth:function(width){
		this.domRef.width(width + "rem");
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
	_initializeSettingsButton:function(){
		this.domRef.append($("<div/>", {
					class: "--mm-widget-settingsButton --mm-visible",
					click: $.proxy(this.toggleFlip, this)
				}));
	}

}





function ClockWidget(){
	Widget.call(this);

}

 ClockWidget.prototype = Object.create(Widget.prototype);
 ClockWidget.prototype.constructor = ClockWidget;
