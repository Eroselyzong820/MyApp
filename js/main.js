;(function ($, window, document) {

    var H5ComponentBase = function (name, cfg) {
        var cfg = cfg || {};
        // var id = ( "h5_c_" + Math.random()).replace(".", "_");
        var id = 'h5_c_' + (new Date().getTime());
        var cls = ' h5_component_' + cfg.type;
        var component = $('<div class="h5_component ' + cls + ' h5_component_name_' + name + '" id="' + id + '">');

        cfg.text && component.text(cfg.text);
        cfg.width && component.width(cfg.width);
        cfg.height && component.height(cfg.height);

        cfg.css && component.css(cfg.css)
        cfg.bg && component.css('backgroundImage', 'url(' + cfg.bg + ')');

        if (cfg.center === true) {
            component.css({
                marginLeft: (cfg.width / 4 * -1) + 'px',
                left: '50%'
            });
        }

        /*   if ( typeof cfg.onclick === 'function'){
         component.on('click',cfg.onclick);
         }
         */
        // component.on('onLoad', function () {
        //
        // })

        return component;
    }

    /*饼图*/

    var Pie = function (name, cfg) {
        var component = new H5ComponentBase(name, cfg)
        // component.text('asdsad')
        //背景
        var w = cfg.width;
        var h = cfg.height;
        // var cns = $('<canvas></canvas>');
        //加入画布
        var cns = document.createElement('canvas');
        var ctx = cns.getContext('2d');
        cns.width = ctx.width = w;
        cns.height = ctx.height = h;
        $(cns).css('zIndex', 1);
        component.append(cns)

        var r = w / 2;
        //加入底图层
        ctx.beginPath();
        ctx.fillStyle = '#eee';
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 1;
        ctx.arc(r, r, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        //绘制数据层
        var cns = document.createElement('canvas');
        var ctx = cns.getContext('2d');
        cns.width = ctx.width = w;
        cns.height = ctx.height = h;
        $(cns).css('zIndex', 2);
        component.append(cns);

        var colors = ['red', 'blue', 'green', '#a00 ', 'orange']; //备用颜色
        var sAngel = 1.5 * Math.PI;//开始角度 12点
        var eAngel = 0; //结束角度
        var aAngel = Math.PI * 2; //100% 圆结束的角度 2PI = 360

        var step = cfg.data.length;
        for (var i = 0; i < step; i++) {
            var item = cfg.data[i];
            var color = item[2] || (item[2] = colors.pop());

            eAngel = sAngel + aAngel * item[1];

            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.lineWidth = .1;

            ctx.moveTo(r, r)
            ctx.arc(r, r, r, sAngel, eAngel);
            ctx.fill();
            ctx.stroke();

            sAngel = eAngel;

            //加入所有项目文本及百分比

            var text = $('<div class="text">')
            text.text(cfg.data[i][0]);
            var per = $('<div class="per">')
            per.text(cfg.data[i][1] * 100 + '%')
            text.append(per);


            var x = r + Math.sin(.5 * Math.PI - sAngel) * r;
            var y = r + Math.cos(.5 * Math.PI - sAngel) * r;


            if (x > w) {
                text.css('left', x);
            } else {
                text.css('right', (w - x));
            }
            if (y > h) {
                text.css('top', h);
            } else {
                text.css('bottom', (h - y));
            }
            if (cfg.data[i][2]) {
                text.css('color', cfg.data[i][2]);
            }
            text.css('opacity', 0);
            component.append(text)
        }
        //加入蒙版
        var cns = document.createElement('canvas');
        var ctx = cns.getContext('2d');
        cns.width = ctx.width = w;
        cns.height = ctx.height = h;
        $(cns).css('zIndex', 3);
        component.append(cns)

        ctx.fillStyle = '#eee';
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 1;


        //生长动画
        var draw = function (per) {
            ctx.clearRect(0, 0, w, h);

            ctx.beginPath();
            ctx.moveTo(r, r)
            if (per <= 0) {
                ctx.arc(r, r, r, 0, 2 * Math.PI);
                component.find('.text').css('opacity', 0)
            } else {
                ctx.arc(r, r, r, sAngel, sAngel + 2 * Math.PI * per, true);
            }

            ctx.fill();
            ctx.stroke();

            if (per >= 1) {
                component.find('.text').css('opacity', 1)
            }

            if (per <= 1) {
                component.find('.text').css('opacity', 0)
            }
        }

        var s = 0;
        for (var i = 0; i < 100; i++) {
            setTimeout(function () {
                s += 0.01;
                draw(s);
            }, i * 10 + 500)
        }
        draw(s);
        /*        component.on('onLoad', function () {
         // 生长动画
         });*/
        /*        component.on('onLeave', function () {
         // 生长动画
         var s = 1;
         for (var i = 0; i < 100; i++) {
         setTimeout(function () {
         s -= 0.01;
         draw(s);
         }, i * 10);
         }
         })*/
        return component;

    }
    // 柱图
    var Bar = function (name, cfg) {
        var component = new H5ComponentBase(name, cfg);
        $.each(cfg.data, function (index, item) {
            // console.log(cfg.data[index])
            var line = $('<div class="line">');
            var name = $('<div class="name">');
            var rate = $('<div class="rate">');
            var per = $('<div class="per">');

            var width = item[1] * 100 + '%';
            var bgStyle = '';
            if (item[2]) {
                bgStyle = 'style="background:' + item[2] + '!important"';
            }
            rate.html('<div class="bg" ' + bgStyle + '></div>')
            rate.css('width', width);

            per.text(width);
            name.text(item[0]);
            line.append(name).append(rate).append(per);
            component.append(line);
        })
        return component;
    }

    var cfg = {
        type: 'bar',
        text: '',
        data: [
            ['JAVA', .5, '#FBFFEB'],
            ['Javascript', .75, '#FBFFEB'],
            ['HTML5', .65, '#FBFFEB'],
            ['CSS3', .7, '#FBFFEB'],
            ['AJAX', .7, '#FBFFEB'],
            ['jQuery', .8, '#FBFFEB'],
            ['Boostrap', .6, '#FBFFEB'],
            ['Angular', .5, '#FBFFEB'],
            ['ionic', .3, '#FBFFEB'],
            ['Node', .1, '#FBFFEB'],
        ],

        css: {
            top: 0,
            opacity: 1
        },
    }
    var h5 = new Bar("my", cfg);
    $('.idea').append(h5)
    var cfg = {
        type: 'pie',
        text: '',
        data: [
            ['Chrome', .35, '#5DDBD8'],
            ['Sublime', .15, '#2576FF'],
            ['WebStrom', .35, '#FE3535'],
            ['gulp', .15, '#FE7676'],
        ],
        height: 400,
        width: 400,
        // center:true,
        /*animateIn:{
         opacity:1,
         top:200,
         },
         animateOut:{
         opacity:0,
         top:100
         },*/
    }
    // var h5 = new Pie("myPieComponent", cfg);
    // $(".idea").append(h5);


})($, window, document);

;(function ($, window, document) {
    //
    $('.owl-carousel').owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
    });


    function View() {
        this.init();
    }

    View.prototype = {

        init: function () {
            // this.binDOM();
            // this.binEvents();
            // this.model();
        },
        binDOM: function () {
            this.e_ul = $('header .main ul');
            this.e_li = $('header .main ul li');
            this.e_span = $('header .main .item span');
            this.item = $('header .main .item');
        },
        binEvents: function () {
            var that = this;
            if ($(window).width() <= 581) {
                that.item.show();
                $(that.e_li).css({'opacity': 0});
                // $('header .main ul').addClass('nav_open');
                var flag = true;
                $(that.item).on('click', function () {
                    // $(that.e_span).toggleClass('btn_close_memu');
                    window.event.stopPropagation();
                    if (flag) {
                        // alert($(that.e_span).hasClass('btn_close_memu'))
                        console.log(flag)
                        $(that.e_span).removeClass('btn_close_memu');
                        // fadeOut()
                        $(that.e_li).animate({
                            opacity: 0,
                            right: '-30rem',
                        }, 1000);
                        flag = false;
                    }
                    if (!flag) {
                        console.log(flag)
                        $(that.e_span).addClass('btn_close_memu');
                        //fadeIn()
                        $(that.e_li).show().animate({
                            opacity: 1,
                            right: 0,
                        });
                        flag = !false;
                    }
                });
            } else {
                $(that.item).hide();
                $(that.e_li).css({opacity: 1, right: 0});
            }
        },
    }

    function model() {
        $('header .main .item').hide();
        if ($(window).width() < 500) {
            $('header .main .item').show();
            // var e_ul = $('header .main ul');
            var e_li = $('header .main ul li');
            var e_span = $('header .main .item span');
            $(e_li).css({'opacity': 0});
            // $('header .main ul').addClass('nav_open');
            $('header .main .item').on('click', function (e) {
                // e.stopPropagation();
                if ($(e_span).hasClass('btn_close_memu')) {
                    $(e_span).removeClass('btn_close_memu');
                    // fadeOut()
                    $(e_li).animate({
                        opacity: 0,
                        right: '-30rem',
                    }, 1000);
                    $
                } else {
                    $(e_span).addClass('btn_close_memu');
                    //fadeIn()
                    $(e_li).show().animate({
                        opacity: 1,
                        right: 0,
                    });
                }
                // $(e_ul).hasClass('nav_open') ? $(e_ul).removeClass('nav_open') : $(e_ul).addClass('nav_open');
            });
        } else {
            $('header .main .item').hide();
        }
    }


    function BarAnimate() {
        $('.h5_component_bar .name').addClass('amt_name');
        $('.h5_component_bar .rate .bg ').addClass('amt_rate');
        $('.h5_component_bar .per').addClass('amt_name');
    }

    function BarRemoveAnimate() {
        $('.h5_component_bar .name').removeClass('amt_name');
        $('.h5_component_bar .rate .bg ').removeClass('amt_rate');
        $('.h5_component_bar .per').removeClass('amt_name');
    }

    function scroll() {
        if (window.pageYOffset != null)  //  ie9+ 和其他浏览器
        {
            return {
                left: window.pageXOffset,
                top: window.pageYOffset
            }
        }
        else if (document.compatMode == "CSS1Compat")  // 声明的了 DTD
        // 检测是不是怪异模式的浏览器 -- 就是没有 声明<!DOCTYPE html>
        {
            return {
                left: document.documentElement.scrollLeft,
                top: document.documentElement.scrollTop
            }
        }
        return { //  剩下的肯定是怪异模式的
            left: document.body.scrollLeft,
            top: document.body.scrollTop
        }
    }


    // event.pageX
    model();
    window.onscroll = function () {

        if ($(window).width() <= 481) {
            if ((scroll().top >= 85)) {
                $('.h5_component_bar .name').css({opacity: '1'});
                $('.h5_component_bar .rate .bg ').css({width: '100%'});
                $('.h5_component_bar .per').css({opacity: '1'});
            } else {
                $('.h5_component_bar .name').css({opacity: '0'});
                $('.h5_component_bar .rate .bg ').css({width: '0%'});
                $('.h5_component_bar .per').css({opacity: '0'});
            }
        }
        if ((scroll().top >= 900)) {
            BarAnimate();
            // console.log(BarAnimate())
        } else if ((scroll().top <= 700)) {
            BarRemoveAnimate();
        }

        /* else if ((scroll().top <= 800)) {
         BarAnimate();
         }*/
    }
    function isIE() { //ie?
        if (!!window.ActiveXObject || "ActiveXObject" in window)
            return true;
        else
            return false;
    }
    if (isIE()) {
        window.location = window.location.pathname = '/404.html'
    }



})($, window, document);

/*底部*/
(function ($, window, document) {
    function scroll() {
        if (window.pageYOffset != null)  //  ie9+ 和其他浏览器
        {
            return {
                left: window.pageXOffset,
                top: window.pageYOffset
            }
        }
        else if (document.compatMode == "CSS1Compat")  // 声明的了 DTD
        // 检测是不是怪异模式的浏览器 -- 就是没有 声明<!DOCTYPE html>
        {
            return {
                left: document.documentElement.scrollLeft,
                top: document.documentElement.scrollTop
            }
        }
        return { //  剩下的肯定是怪异模式的
            left: document.body.scrollLeft,
            top: document.body.scrollTop
        }
    }

    var WIDTH = window.innerWidth, HEIGHT = 100, POINT = 25;
    if (scroll().left < 481) {
        POINT = 10;
    }
    var canvas = document.getElementById('bg_lxfs');
    canvas.width = WIDTH,
        canvas.height = HEIGHT;
    var context = canvas.getContext('2d');
    context.strokeStyle = 'rgba(0,0,0,.8)',
        context.strokeWidth = 1,
        context.fillStyle = 'rgba(0,0,0,.3)';
    var circleArr = [];

    //线条：开始xy坐标，结束xy坐标，线条透明度
    function Line(x, y, _x, _y, o) {
        this.beginX = x,
            this.beginY = y,
            this.closeX = _x,
            this.closeY = _y,
            this.o = o;
    }

    //点：圆心xy坐标，半径，每帧移动xy的距离
    function Circle(x, y, r, moveX, moveY) {
        this.x = x,
            this.y = y,
            this.r = r,
            this.moveX = moveX,
            this.moveY = moveY;
    }

    //生成max和min之间的随机数
    function num(max, _min) {
        var min = arguments[1] || 0;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // 绘制原点
    function drawCricle(cxt, x, y, r, moveX, moveY) {
        var circle = new Circle(x, y, r, moveX, moveY)
        cxt.beginPath()
        cxt.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI)
        cxt.closePath()
        cxt.fill();
        return circle;
    }

    //绘制线条
    function drawLine(cxt, x, y, _x, _y, o) {
        var line = new Line(x, y, _x, _y, o)
        cxt.beginPath()
        cxt.strokeStyle = 'rgba(0,0,0,' + o + ')'
        cxt.lineWidth = 2;
        cxt.moveTo(line.beginX, line.beginY)
        cxt.lineTo(line.closeX, line.closeY)
        cxt.closePath()
        cxt.stroke();

    }

    //初始化生成原点
    function init() {
        circleArr = [];
        for (var i = 0; i < POINT; i++) {
            circleArr.push(drawCricle(context, num(WIDTH), num(HEIGHT), num(15, 2), num(10, -10) / 40, num(10, -10) / 40));
        }
        draw();
    }

    //每帧绘制
    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < POINT; i++) {
            drawCricle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r);
        }
        for (var i = 0; i < POINT; i++) {
            for (var j = 0; j < POINT; j++) {
                if (i + j < POINT) {
                    var A = Math.abs(circleArr[i + j].x - circleArr[i].x),
                        B = Math.abs(circleArr[i + j].y - circleArr[i].y);
                    var lineLength = Math.sqrt(A * A + B * B);
                    var C = 1 / lineLength * 7 - 0.009;
                    var lineOpacity = C > 0.03 ? 0.03 : C;
                    if (lineOpacity > 0) {
                        drawLine(context, circleArr[i].x, circleArr[i].y, circleArr[i + j].x, circleArr[i + j].y, lineOpacity);
                    }
                }
            }
        }
    }

    //调用执行
    init();
    setInterval(function () {
        for (var i = 0; i < POINT; i++) {
            var cir = circleArr[i];
            cir.x += cir.moveX;
            cir.y += cir.moveY;
            if (cir.x > WIDTH) cir.x = 0;
            else if (cir.x < 0) cir.x = WIDTH;
            if (cir.y > HEIGHT) cir.y = 0;
            else if (cir.y < 0) cir.y = HEIGHT;

        }
        draw();
    }, 16);
})($, window, document);
/*漂浮*/
(function ($, window, document, jQuery) {
    jQuery(document).ready(function ($) {
        //trigger the animation - open modal window
        $('[data-type="modal-trigger"]').on('click', function () {
            var actionBtn = $(this),
                scaleValue = retrieveScale(actionBtn.next('.cd-modal-bg'));

            actionBtn.addClass('to-circle');
            actionBtn.next('.cd-modal-bg').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
            });

            //if browser doesn't support transitions...
            if (actionBtn.parents('.no-csstransitions').length > 0) animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
        });

        //trigger the animation - close modal window
        $('.cd-section .cd-modal-close').on('click', function () {
            closeModal();
        });
        $(document).keyup(function (event) {
            if (event.which == '27') closeModal();
        });

        $(window).on('resize', function () {
            //on window resize - update cover layer dimention and position
            if ($('.cd-section.modal-is-visible').length > 0) window.requestAnimationFrame(updateLayer);
        });

        function retrieveScale(btn) {
            var btnRadius = btn.width() / 2,
                left = btn.offset().left + btnRadius,
                top = btn.offset().top + btnRadius - $(window).scrollTop(),
                scale = scaleValue(top, left, btnRadius, $(window).height(), $(window).width());

            btn.css('position', 'fixed').velocity({
                top: top - btnRadius,
                left: left - btnRadius,
                translateX: 0,
            }, 0);

            return scale;
        }

        function scaleValue(topValue, leftValue, radiusValue, windowW, windowH) {
            var maxDistHor = ( leftValue > windowW / 2) ? leftValue : (windowW - leftValue),
                maxDistVert = ( topValue > windowH / 2) ? topValue : (windowH - topValue);
            return Math.ceil(Math.sqrt(Math.pow(maxDistHor, 2) + Math.pow(maxDistVert, 2)) / radiusValue);
        }

        function animateLayer(layer, scaleVal, bool) {
            layer.velocity({scale: scaleVal}, 400, function () {
                $('body').toggleClass('overflow-hidden', bool);
                (bool)
                    ? layer.parents('.cd-section').addClass('modal-is-visible').end().off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend')
                    : layer.removeClass('is-visible').removeAttr('style').siblings('[data-type="modal-trigger"]').removeClass('to-circle');
            });
        }

        function updateLayer() {
            var layer = $('.cd-section.modal-is-visible').find('.cd-modal-bg'),
                layerRadius = layer.width() / 2,
                layerTop = layer.siblings('.btn').offset().top + layerRadius - $(window).scrollTop() / 0,
                layerLeft = layer.siblings('.btn').offset().left + layerRadius,
                scale = scaleValue(layerTop, layerLeft, layerRadius, $(window).height(), $(window).width());

            layer.velocity({
                top: layerTop - layerRadius,
                left: layerLeft - layerRadius,
                scale: scale,
            }, 0);
        }

        function closeModal() {
            var section = $('.cd-section.modal-is-visible');
            section.removeClass('modal-is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                animateLayer(section.find('.cd-modal-bg'), 1, false);
            });
            //if browser doesn't support transitions...
            if (section.parents('.no-csstransitions').length > 0) animateLayer(section.find('.cd-modal-bg'), 1, false);
        }
    });
})($, window, document, jQuery);