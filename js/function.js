$(function(){
	var canvas = new MainCanvas($("#magicMirror"));
	var widget1 = new ClockWidget({showSeconds:true, hoursLeadingZero:false});
	widget1.setHeight(20);
	widget1.setWidth(35);
	canvas.addWidget(widget1);
	canvas.setEditMode();


	var widget2 = new Widget();
	widget2.setHeight(11);
	// canvas.addWidget(widget2);

	var widget3 = new Widget();
	widget3.setHeight(20);
	widget3.setWidth(30);
	// canvas.addWidget(widget3);
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


function Widget(options){
	this._readOptions(options)
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
	setSetting:function(key,value){
		this.settings[key] = value;
	},
	_readOptions:function(options){
		if(true);
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
function ClockWidget(options){
	Widget.call(this, options);
	this.domRef.addClass("--mm-clockWidget");
	// this.setClockTime({hours:12, minutes:45});
	this._tick(true);
}
ClockWidget.prototype = Object.create(Widget.prototype);
Object.assign(ClockWidget.prototype,{
	showSeconds:false,
	hoursLeadingZero:false,
	constructor: ClockWidget,
	widgetName: "Clock",
	currentTimer: undefined,
	time: {hours: undefined, minutes: undefined, seconds: undefined},
	setClockTime:function(args){
		this.time = args;
		// if((args.hours) && args.hours != this.time.hours) this.frontSideRef.children(".--mm-clockWidget-hours").text(args.hours.toString());
		// if(args.minutes && args.minutes != this.time.minutes) this.frontSideRef.children(".--mm-clockWidget-minutes").text(args.minutes.toString());
		// if(args.seconds && args.seconds != this.time.seconds) this.frontSideRef.children(".--mm-clockWidget-seconds").text(args.seconds.toString());

		this.frontSideRef.children(".--mm-clockWidget-hours").text(this._getHoursFormatted());
		this.frontSideRef.children(".--mm-clockWidget-minutes").text(this._getMinutesFormatted());
		this.frontSideRef.children(".--mm-clockWidget-seconds").text(this._getSecondsFormatted());

	},
	_readOptions(options){
		if(options){
			this.showSeconds = !!options.showSeconds;
			this.hoursLeadingZero = !!options.hoursLeadingZero;
		}
	},
	_buildFrontSide: function(){
		this.frontSideRef = $("<div/>", {
					class: "--mm-widget-front",
					// text: "front2"
			});

		this.domRef.append(this.frontSideRef);

		$("<span/>", {
					class: "--mm-clockWidget-hours",
					// text: "--"
			}).appendTo(this.frontSideRef);

		$("<span/>", {
					class: "--mm-clockWidget-minutes",
					// text: "--"
			}).appendTo(this.frontSideRef);

		if(this.showSeconds){
			$("<span/>", {
						class: "--mm-clockWidget-seconds",
						// text: "--"
				}).appendTo(this.frontSideRef);
		}
	},
	_tick:function(isFirstTick){
		var date = new Date();
		var time = {};
		time.hours = date.getHours();
		time.minutes = date.getMinutes();
		time.seconds = date.getSeconds();
		this.setClockTime(time);
		var milToNextTick = 1000;
		if(isFirstTick) milToNextTick = this._getMillisecondsToNextSecond(date);
		this.currentTimer = setTimeout($.proxy(this._tick, this), milToNextTick);
	},
	_getMillisecondsToNextSecond:function(date){
		return date.getMilliseconds();
	},
	_getHoursFormatted:function(){
		if(this.hoursLeadingZero) return this._convertToTwoDigitNumber(this.time.hours);
		else return this.time.hours.toString();
	},
	_getMinutesFormatted:function(){
		return this._convertToTwoDigitNumber(this.time.minutes);
	},
	_getSecondsFormatted:function(){
		return this._convertToTwoDigitNumber(this.time.seconds);
	},
	_convertToTwoDigitNumber:function(number){
		number = number.toString();
		if(number.length == 1) number = "0" + number;
		return number;
	}



});
