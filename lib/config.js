// //config.js
// requirejs.config({
//   baseUrl: 'lib',
//   paths:{
//     'jquery':'jquery-3.2.1.min',
//     'jquery-ui': 'jquery-ui.min',
//     'app': 'app',
//     'function': 'function'
//   }
// })


require(['app','app2'], function(app,app2){
  app.test('testvar1')
  app2.test('testvar2')
  //require('app')
  // require('jquery')
  // require('jquery-ui')
  // require('function')
})
