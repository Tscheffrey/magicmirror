define(function(url, callback) {
    var element
    var doc = document
    element = document.createElement('link')
    element.href= url
    element.rel='stylesheet'
    }

    if (callback) element.addEventListener('load', function (e) { callback(e) }, false)

    doc.getElementsByTagName('head')[0].appendChild(el)
})
