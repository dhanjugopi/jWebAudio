/*
 * Copyright (C) 2013, Intel Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Google analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-38462554-1']);
_gaq.push(['_trackPageview']);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

$(document).ready(function() {
    if (!/chrome/.test(navigator.userAgent.toLowerCase())) {
        alert('To enable Web Audio, please try with Chrome.');
    }

    // Side bar on the right part
    var sideWidth = ($(window).width() - 600) / 2;
    $('#sidebar').css('width', sideWidth - 20).slideDown();
    $('#apiSideBar').css('left', sideWidth - 20 - 200);
    $(window).scroll(function() {
        var winTop = $(this).scrollTop();
        var top = $('#api').offset().top - 200;
        if ($('#apiSideBar').css('display') === 'none' 
                && winTop >= top) {
            $('#apiSideBar').fadeIn();
        } else if ($('#apiSideBar').css('display') === 'block' 
                && winTop < top) {
            $('#apiSideBar').fadeOut();
        }
    });
    
    // Title sound effect
    var inLoaded = false;
    $('#inSound').jWebAudio('addSoundSource', {
        'url': 'examples/resource/in.wav',
        'multishot': true
    }).jWebAudio('load', function() {
        inLoaded = true;
    });
    var outLoaded = false;
    $('#outSound').jWebAudio('addSoundSource', {
        'url': 'examples/resource/out.wav',
        'multishot': true
    }).jWebAudio('load', function() {
        outLoaded = true;
    });
        
    // Title animation
    $('#titleImg').css('right', $(window).width()).animate({
        'right': 0
    }, 1000, function() {
        $(this).animate({
            'right': sideWidth
        }, 1000);
    }).hover(function() {
        $(this).stop().animate({
            'right': sideWidth - 170
        });
        if (inLoaded) {
            $('#inSound').jWebAudio('play');
        }
    }, function() {
        $(this).stop().animate({
            'right': sideWidth
        });
        if (outLoaded) {
            $('#outSound').jWebAudio('play');
        }
    });
    
    // Navigation scrolling
    $('.navBtn').click(function() {
        // target id is source id - 'Nav' or 'Api'
        var target = $(this).attr('id').slice(0, -3);
        if (target === 'home') {
            var top = 0;
        } else {
            var top = $('#' + target).offset().top;
        }
        $('body').animate({
            scrollTop: top
        }, 'slow');
    });
    $('#toFeatures').click(function() {
        $('body').animate({
            scrollTop: $('#features').offset().top
        }, 'slow');
    });
    
    // Slide toggle of jQuery or standard code
    $('.version').click(function() {
        $(this).next().slideToggle();
    });
    $('.version').each(function() {
        $(this).next().hide();
    });
});
