/*
 * special event API with Hammer.JS
 * version 0.9
 * author: Damien Antipa
 * https://github.com/dantipa/hammer.js
 */
(function ($) {
    var hammerEvents = ['hold','tap','doubletap','transformstart','transform','transformend','dragstart','drag','dragend','swipe','release'],
        hammerObj = null;

    $.each(hammerEvents, function(i, event) {

        $.event.special[event] = {

            setup: function(data, namespaces, eventHandle) {
                var $target = $(this);

                if (!hammerObj) {
                    hammerObj = new Hammer(this, data);
                }

                hammerObj['on'+ event] = function (ev) {
                    $('#draw').html(event);
                    $target.trigger($.Event(event, ev));
                };
            },

            teardown: function(namespaces) {
                var $target = $(this);

                if(hammerObj && hammerObj['on'+ event]) {
                    delete hammerObj['on'+ event];
                }
            }
        };
    });
}(jQuery));