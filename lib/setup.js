require(['app','jquery-3.2.1.min','jquery-ui.min'], function(){
  $(function(){
  	var canvas = new MainCanvas($("#magicMirror"));
  	var widget1 = new ClockWidget({showSeconds:false, hoursLeadingZero:false, showSecondsBar: false});
  	canvas.addWidget(widget1);


  	// var widget2 = new ClockWidget({showSeconds:true, hoursLeadingZero:false, widgetName:"Clock 2"});
  	// canvas.addWidget(widget2);

  		// canvas.setEditMode();

  	var widget3 = new Widget();
  	widget3.setHeight(20);
  	widget3.setWidth(30);
  	// canvas.addWidget(widget3);
  });
})
