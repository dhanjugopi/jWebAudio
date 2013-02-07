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

/* Note that this file is only a wrapp of standard version.
 * You are sugguested to use the minified version named jquery.jWebAudio.min.js
 * under build fold.
 *
 * If you want to use this file for debugging, please make sure this file is 
 * included after standard.jWebAudio.js.
 */

(function ($) {
    // Make jWebAudio private in jQuery version so that user cannot call
    // jWebAudio outside library
    if (jWebAudio === undefined) {
        $.error('Please include standard.jWebAudio.js first!');
        return;
    }
    
    // private engine to add source
    var engine = new jWebAudio.SoundEngine();

    
    
    /*** Public jWebAudio functions for jQuery plugin ***/
    var methods = {
        /* Create new Sound in `soundArray`.
         * `options`: {'url': ..., 'preLoad': ..., 'callback':..., 
         * 'multishot': ...}
         * Note that if there is already sound in current div,
         * it will be destroyed and a new one will be created.
         * `url`: file location of the sound
         * `preLoad`: load instantly if true, else will load when call `load`
         *            or `play`. Default false.
         * `callback`: function to be called after load, if preLoad
         * `multishot`: true if to allow play multi times with the same sound.
         *              Default false.
         * `options` also contain sound options like muted, loop...
         */
        addSoundSource: function(options) {
            return this.each(function() {
                // only one sound source can exist in an element
                if (methods.existsSound.call($(this))) {
                    console.warn('Sound already exists. It will be '
                            + 'destroyed now.');
                    methods.destroySound.call($(this));
                }
                // url cannot be an array of string
                if (typeof options.url !== 'string') {
                    $.error('Error type of url!');
                    return;
                }
                
                // store sound id in element
                $(this).data('soundId', engine.soundArray.length);
                // add sound source
                engine.addSoundSource(options);
            });
        },
        
        /* Stops and destroys a sound in this element.
         * This function should be called when the sound is sure to be not 
         * used again.
         * `id`: the div id called jWebAudio
         */
        destroySound: function() {
            return this.each(function() {
                var id = $(this).data('soundId');
                engine.destroySound(id);
            });
        },
        
        /* Returns true if sound exists in current element, false otherwise */
        existsSound: function() {
            if ($(this).data('soundId') === undefined) {
                return false;
            } else {
                return true;
            }
        },
        
        /* Load content of audio  
         * `callback`: function to be called after loaded.
         */
        load: function(callback) {
            return this.each(function() {
                if ($(this).data('soundId') !== undefined) {
                    // get id in sound source array
                    var id = $(this).data('soundId');
                } else {
                    // no sound source
                    $.error('Please call addSoundSource first!');
                    return;
                }
                engine.soundArray[id].load(callback);
            });
        },
        
        /* Play audio */
        play: function() {
            return this.each(function() {
                if ($(this).data('soundId') !== undefined) {
                    // get id in sound source array
                    var id = $(this).data('soundId');
                } else {
                    // no sound source
                    $.error('Please call addSoundSource first!');
                    return;
                }
                engine.soundArray[id].sound.play();
            });
        },
        
        /* Pause if is not multishot audio.
         * Multishot audio can't be paused because they are designed to be 
         * simple short sound effects
         */
        pause: function() {
            return this.each(function() {
                if ($(this).data('soundId') !== undefined) {
                    // get id in sound source array
                    var id = $(this).data('soundId');
                } else {
                    // no sound source
                    $.error('Please call addSoundSource first!');
                    return;
                }
                engine.soundArray[id].sound.pause();
            });
        },
        
        /* Stop audio */
        stop: function() {
            return this.each(function() {
                if ($(this).data('soundId') !== undefined) {
                    // get id in sound source array
                    var id = $(this).data('soundId');
                } else {
                    // no sound source
                    $.error('Please call addSoundSource first!');
                    return;
                }
                engine.soundArray[id].sound.stop();
            });
        },
        
        /* Seek position */
        seek: function(position) {
            if ($(this).data('soundId') !== undefined) {
                // get id in sound source array
                var id = $(this).data('soundId');
            } else {
                // no sound source
                $.error('Please call addSoundSource first!');
                return;
            }
            var sound = engine.soundArray[id].sound;
            if (sound.options.multishot) {
                $.error('You cannot call seek with multishot sound!')
                return;
            }
            if (position === undefined) {
                // Get
                return sound.offset;
            } else {
                // Set
                return this.each(function() {
                    sound.seek(position);
                });
            }
        },
        
        /* Get duration (total length of the audio) */
        duration: function() {
            if ($(this).data('soundId') !== undefined) {
                // get id in sound source array
                var id = $(this).data('soundId');
            } else {
                // no sound source
                $.error('Please call addSoundSource first!');
                return;
            }
            var sound = engine.soundArray[id].sound;
            if (sound.options.multishot) {
                $.error('You cannot get duration with multishot sound!')
                return;
            }
            return sound.duration;
        },
        
        /* Set function to be called when sound plays to the end */
        finish: function(callback) {
            return this.each(function() {
                if ($(this).data('soundId') !== undefined) {
                    // get id in sound source array
                    var id = $(this).data('soundId');
                } else {
                    // no sound source
                    $.error('Please call addSoundSource first!');
                    return;
                }
                if (callback && typeof callback !== 'function') {
                    $.error('Error type of finish!');
                } else {
                    engine.soundArray[id].finish = callback;
                }
            });
        },
        
        /* Get effect array or 
         * add effect which returns the id in effect array
         * `effect`: could be name of effect, like 'telephonize'
         *           or object with `name` and `options` attribute
         *           to create new type of effect
         * `effect.name`: set the name of new effect
         * `effect.options`: set the options of new effect
         */
        addEffect: function(effect) {
            if ($(this).data('soundId') !== undefined) {
                // get id in sound source array
                var id = $(this).data('soundId');
            } else {
                // no sound source
                $.error('Please call addSoundSource first!');
                return;
            }
            var sound = engine.soundArray[id].sound;
            if (typeof effect === 'string') {
                // Use default effect
                return sound.addEffect(effect);
            } else if (typeof effect === 'object' && effect.name !== undefined
                    && effect.options !== undefined) {
                // Create new effect
                return sound.addEffect(new jWebAudio.Filter(
                        effect.name, effect.options));
            } else {
                $.error('Error type of effect!');
            }
        },
        
        /* Delete effect with given index in effect array
         * id can either be an int or an array of int
         */
        deleteEffect: function(id) {
            return this.each(function() {
                if ($(this).data('soundId') !== undefined) {
                    // get id in sound source array
                    var sid = $(this).data('soundId');
                } else {
                    // no sound source
                    $.error('Please call addSoundSource first!');
                    return;
                }
                var sound = engine.soundArray[sid].sound;
                if (typeof id === 'number') {
                    sound.deleteEffect(id);
                } else if (typeof id === 'object') {
                    for (var i in id) {
                        sound.deleteEffect(id[i]);
                    }
                }
            });
        },
        
        /* Get instance of 3D Effect */
        getEffect: function(id) {
            if ($(this).data('soundId') !== undefined) {
                // get id in sound source array
                var sid = $(this).data('soundId');
            } else {
                // no sound source
                $.error('Please call addSoundSource first!');
                return;
            }
            if (typeof id === 'number') {
                return engine.soundArray[sid].sound.getEffect(id);
            } else {
                $.error('Error type in set3dEffectPosition!');
            }
        },
        
        /* Clear all effects */
        clearAllEffects: function() {
            return this.each(function() {
                if ($(this).data('soundId') !== undefined) {
                    // get id in sound source array
                    var id = $(this).data('soundId');
                } else {
                    // no sound source
                    $.error('Please call addSoundSource first!');
                    return;
                }
                engine.soundArray[id].sound.clearAllEffects();
            });
        },
        
        /* Reset or get options of sound */
        options: function(opt) {
            if (opt === undefined) {
                // get options
                var id = $(this).data('soundId');
                return engine.soundArray[id].sound.options;
            } else {
                // set options
                return this.each(function() {
                    if ($(this).data('soundId') !== undefined) {
                        // get id in sound source array
                        var id = $(this).data('soundId');
                    } else {
                        // no sound source
                        $.error('Please call addSoundSource first!');
                        return;
                    }
                    engine.soundArray[id].sound.options = opt;
                });
            }
        }
    };
    
    
    
    /*** jQuery plugin facade ***/
    $.fn.jWebAudio = function() {
        var method = arguments[0];
        if (methods[method]) {
            // Call with given method
            if (arguments[1] === undefined) {
                // Get function
                return methods[method].call(this);
            } else {
                // Set function
                // Allow to set options or callback
                if (typeof arguments[1] === 'object') {
                    var options = $.extend({
                        callback: function() {}
                    }, arguments[1]);
                    if (typeof arguments[2] === 'function') {
                        $.extend(options, {
                            callback: arguments[2]
                        });
                    }
                } else {
                    var options = arguments[1];
                }
                return methods[method].call(this, options);
            }
        } else if (typeof method === 'object' || !method) {
            // Calls init if no method is given
            // Allow to set options or callback
            var options = $.extend({
                callback: function() {}
            }, arguments[0] || {});
            if (typeof arguments[1] === 'function') {
                $.extend(options, {
                    callback: arguments[1]
                });
            }
            return methods.init.call(this, options);
        } else {
            // Error if no method is matched
            $.error('Method ' + method + 
                    ' does not exist on jquery.jWebAudio');
        }
    };
    
})(jQuery);
