window.isElectron = function() {  return 'Bridge' in window; };

if(window.isElectron())  window.Bridge.setDockBadge(43)  //console.log = window.consoleLog()
if(window.isElectron()) console.log();

// console.log("Dies ist ein Console log von weit weg")
