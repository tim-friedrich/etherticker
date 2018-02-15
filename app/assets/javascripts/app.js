window.DEBUG        = true;

//colors
//same as in _variables.scss
//keep it synchronized
var $lime = "#8CBF26",
    $red = "#f25118",
    $redDark = "#d04f4f",
    $blue = "#4e91ce",
    $green = "#3ecd74",
    $orange = "#f2c34d",
    $pink = "#E671B8",
    $purple = "#A700AE",
    $brown = "#A05000",
    $teal = "#4ab0ce",
    $gray = "#666",
    $white = "#fff",
    $textColor = $gray;

//turn off charts is needed
var chartsOff = false;
if (chartsOff){
    nv.addGraph = function(){};
}

COLOR_VALUES = [$red, $orange, $green, $blue, $teal, $redDark];

window.colors = function(){
    if (!window.d3) return false;
    return d3.scale.ordinal().range(COLOR_VALUES);
}();

function keyColor(d, i) {
    if (!window.colors){
        window.colors = function(){
            return d3.scale.ordinal().range(COLOR_VALUES);
        }();
    }
    return window.colors(d.key)
}


function resetContentMargin(){
    if ($(window).width() > 767){
        $(".content").css("margin-top", '');
    }
}

function initAppPlugins(){
    /* ========================================================================
     * Table head check all checkboxes
     * ========================================================================
     */
    !function($){
        $(document).on('click', 'table th [data-check-all]', function () {
            $(this).closest('table').find('input[type=checkbox]')
                .not(this).prop('checked', $(this).prop('checked'));
        });
    }(jQuery);

    /* ========================================================================
     * Animate Progress Bars
     * ========================================================================
     */
    !function($){

        $.fn.animateProgressBar = function () {
            return this.each(function () {
                var $bar = $(this).find('.progress-bar');
                setTimeout(function(){
                    $bar.css('width', $bar.data('width'));
                }, 0)
            })
        };

        $('.js-progress-animate').animateProgressBar();
    }(jQuery);
}

$(function(){

    var $sidebar = $('#sidebar');

    $sidebar.on("mouseleave",function(){
        if (($(this).is(".sidebar-icons") || $(window).width() < 1049) && $(window).width() > 767){
            setTimeout(function(){
                closeNavigation();
            }, 300); // some timeout for animation
        }
    });

    //need some class to present right after click
    $sidebar.on('show.bs.collapse', function(e){
        e.target == this && $sidebar.addClass('open');
    });

    $sidebar.on('hide.bs.collapse', function(e){
        if (e.target == this) {
            $sidebar.removeClass('open');
            $(".content").css("margin-top", '');
        }
    });

    // $(window).resize(function(){
    //     //if ($(window).width() < 768){
    //         closeNavigation();
    //     //}
    // });

    $(document).on('pjax-app:loaded', function(){
        if ($(window).width() < 768){
            closeNavigation();
        }
    })

    //class-switch for button-groups
    $(".btn-group > .btn[data-toggle-class]").click(function(){
        var $this = $(this),
            isRadio = $this.find('input').is('[type=radio]'),
            $parent = $this.parent();

        if (isRadio){
            $parent.children(".btn[data-toggle-class]").removeClass(function(){
                return $(this).data("toggle-class")
            }).addClass(function(){
                return $(this).data("toggle-passive-class")
            });
            $this.removeClass($(this).data("toggle-passive-class")).addClass($this.data("toggle-class"));
        } else {
            $this.toggleClass($(this).data("toggle-passive-class")).toggleClass($this.data("toggle-class"));
        }
    });


    $("#search-toggle").click(function(){
        //first hide menu if open

        if ($sidebar.data('bs.collapse')){
            $sidebar.collapse('hide');
        }

        var $notifications = $('.notifications'),
            notificationsPresent = !$notifications.is(':empty');

        $("#search-form").css('height', function(){
            var $this = $(this);
            if ($this.height() == 0){
                $this.css('height', 40);
                notificationsPresent && $notifications.css('top', 86);
            } else {
                $this.css('height', 0);
                notificationsPresent && $notifications.css('top', '');
            }
        });
    });


    //hide search field if open
    $sidebar.on('show.bs.collapse', function () {
        var $notifications = $('.notifications'),
            notificationsPresent = !$notifications.is(':empty');
        $("#search-form").css('height', 0);
        notificationsPresent && $notifications.css('top', '');
    });

    /*   Move content down when second-level menu opened */
    $("#side-nav").find("a.accordion-toggle").on('click',function(){
        if ($(window).width() < 768){
            var $this = $(this),
                $sideNav = $('#side-nav'),
                menuHeight = $sideNav.height() + parseInt($sideNav.css('margin-top')) + parseInt($sideNav.css('margin-bottom')),
                contentMargin = menuHeight + 20,
                $secondLevelMenu = $this.find("+ ul"),
                $subMenuChildren = $secondLevelMenu.find("> li"),
                subMenuHeight = $.map($subMenuChildren, function(child){ return $(child).height()})
                    .reduce(function(sum, el){ return sum + el}),
                $content = $(".content");
            if (!$secondLevelMenu.is(".in")){ //when open
                $content.css("margin-top", (contentMargin + subMenuHeight - $this.closest('ul').find('> .panel > .panel-collapse.open').height()) + 'px');
            } else { //when close
                $content.css("margin-top", contentMargin - subMenuHeight + 'px');
            }
        }
    });

    $sidebar.on('show.bs.collapse', function(e){
        if (e.target == this){
            if ($(window).width() < 768){
                var $sideNav = $('#side-nav'),
                    menuHeight = $sideNav.height() + parseInt($sideNav.css('margin-top')) + parseInt($sideNav.css('margin-bottom')),
                    contentMargin = menuHeight + 20;
                $(".content").css("margin-top", contentMargin + 'px');
            }
        }
    });

    //need some class to present right after click for submenu
    var $subMenus = $sidebar.find('.panel-collapse');
    $subMenus.on('show.bs.collapse', function(e){
        if (e.target == this){
            $(this).addClass('open');
        }
    });

    $subMenus.on('hide.bs.collapse', function(e){
        if (e.target == this){
            $(this).removeClass('open');
        }
    });

    initAppPlugins();

});
