/**
 * zzzROOT Preloader
 *
 * Opciones (por defecto vacío, tipo - Cadena):
  * texto: se indicará el texto explicativo sobre la animación;
  * por ciento: el porcentaje de ejecución, puede especificar de 0 a 100;
  * duración: duración del preloader;
  * zIndex: establece el índice z del contenedor .preloader;
  * setRelative - establece la posición: relativa al bloque preloader principal, bool
  * Ejemplo: $ ('.El'). Preloader ({text: 'example'});
  *
  * Métodos:
  * eliminar - eliminar el preloader, por ejemplo, $ ('. el'). preloader ('eliminar');
  * actualización - actualización de texto y / o porcentajes, por ejemplo, $ ('. el'). preloader ('actualización', {porcentaje: '70', texto: 'ejemplo'};
 *
 */
;(function ($, window, document, undefined) {
    var pluginName = 'zzzROOTPreload',
        defaults = {
            text: '', // Texto debajo de la animacion
            percent: '', // porcentaje de carga 0 -> 100
            duration: '', // duracion en ms
            zIndex: '', // configuración de z-index
            setRelative: false // configuracion de posicion relativa
        },
        $preloader,
        $animationBlock,
        $text,
        $percent,
        textTempl = '<span class="preloader-text"></span>',
        percentTempl = '<span class="preloader-percent"></span>',
        isInited = false;

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    var methods = {
        remove: function () {
            if ($preloader) {
                isInited = false;
                $preloader.remove();
            }
        },
        update: function (arg) {
            var options = arg[1];

            if (options.percent.length > 0 && $percent) {
                $percent.text(options.percent + '%');
            } else if (!$percent) {
                console.warn('Значение не может быть обновлено');
                return false;
            }

            if (options.text.length > 0 && $text) {
                $text.text(options.text);
            } else if (!$text) {
                console.warn('Значение не может быть обновлено');
                return false;
            }
        }
    };

    Plugin.prototype.init = function () {
        var element = $(this.element),
            text,
            percent,
            percentVal,
            elementHeight,
            elementScrollHeight,
            preloaderHeight;

        if (isInited) {
            console.warn('Plugin ' + pluginName + ' is already initialized');
            return false;
        }

        element.prepend('<div class="preloader"><div class="preloader-container"><div class="preloader-animation"></div></div></div>');
        $preloader = element.find('.preloader');
        $preloaderContainer = element.find('.preloader-container');
        $animationBlock = $preloader.find('.preloader-animation');

        // Establecer la altura del preloader
        elementHeight = element.height();
        elementScrollHeight = element[0].scrollHeight;
        preloaderHeight = $preloader.height();

        if (elementScrollHeight > preloaderHeight) {
            $preloader.height(elementScrollHeight);

            // Animación de posicionamiento en el centro
            element.on('scroll', fixAnimBlock).trigger('scroll');
            function fixAnimBlock () {
                var scrollTop = element.scrollTop(),
                    preloaderPosition,
                    preloaderHeight = $preloaderContainer.height();

                preloaderPosition = Math.round(elementHeight / 2 - preloaderHeight / 2 + scrollTop) + 'px';
                $preloaderContainer.css({'top': preloaderPosition});
            }
        }

        // opciones de texto
        if (this.options.text.length > 0) {
            $preloaderContainer.prepend(textTempl);
            $text = element.find('.preloader-text');
            $text.text(this.options.text);
        }

        // opciones de porcentaje
        if (this.options.percent.length > 0) {
            percentVal = this.options.percent;
            if (percentVal < 0) {
                percentVal = 0;
            } else if (percentVal > 100) {
                percentVal = 100;
            }
            $preloaderContainer.prepend(percentTempl);
            $percent = element.find('.preloader-percent');
            $percent.text(percentVal + '%');
        }

        // opciones de duracion
        if (this.options.duration.length > 0) {
            setTimeout(function () {
                $preloader.remove();
            }, this.options.duration);
        }

        // opciones de z-index
        if (this.options.zIndex.length > 0) {
            $preloader.css('z-index', this.options.zIndex);
        }

        // opciones de ajuste de relatividad
        if (this.options.setRelative == true) {
            element.css('position', 'relative');
        }

        isInited = true;
    };

    $.fn[pluginName] = function (method, options) {
        var firstArg = arguments[0],
            argsArr = Array.prototype.slice.call(arguments);

        if (methods[firstArg]) {
            return this.each(function () {
                methods[firstArg].call(this, argsArr);
            });
        } else if (typeof(firstArg) === 'object' || !firstArg) {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName);
                }
                new Plugin(this, firstArg);
            });
        } else {
            $.error('Method ' + firstArg + ' does not exist on jQuery.' + pluginName);
        }
    };
})(jQuery, window, document);