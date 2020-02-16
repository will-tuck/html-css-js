jQuery(document).ready(function($) {

    // parent navigation hover

    $(".nav > li").hover(
        function() {
            $(this).addClass("open");
        }, function() {
            $(this).removeClass("open");
        }
    );


    // set an active class on parent navigation

    $(".nav > li").each(function(){
        if ($("a", this).attr("href")) {
            if (new RegExp('^' + $("a", this).attr("href")).test(window.location.pathname)) {
                $(this).addClass("active");
            }
        }

    });


    // set an active class on child navigation

    $(".nav > li > ul > li").each(function(){
        if ($("a", this).attr("href")) {
            if (new RegExp('^' + $("a", this).attr("href") + '$').test(window.location.pathname)) {
                $(this).addClass("active");
            }
        }

    });


    // accommodate long H1s

    var h1 = $("#hero h1").outerHeight();
    // two lines
    if (h1 > 44) {
        $("#hero h1").css({'font-size':'26px'});
    }
    // three lines
    if (h1 > 88) {
        $("#hero h1").css({'font-size':'22px'});
    }
    // four lines
    // really?


    // generate breadcrumbs

    var path = window.location.pathname.split("/");

    $(".breadcrumb").append('<li><a href="/">Home</a></li>');

    var breadcrumb_links = "/";

    $.each(path, function( index, value ){
        if (this.length > 0) {
            breadcrumb_links = breadcrumb_links + value + "/";
            $(".breadcrumb").append('<li><a href="'+breadcrumb_links+'">'+value.replace(/-/g," ")+'</a></li>');
        }
    });


    // look for external links to set target

    $("#content a").each(function(){
        if ($(this).attr("href")) {
            if (new RegExp('^http').test($(this).attr("href"))) {
                var url_without_protocol = $(this).attr("href").replace(/^(https?):\/\//, "");
                if (!new RegExp('^' + window.location.hostname).test(url_without_protocol)){
                    $(this).attr("target", "_blank");
                }
            }
            if (new RegExp('\.pdf$').test($(this).attr("href"))) {
                $(this).attr("target", "_blank");
            }
        }
    });


    // move modals to end of markup to avoid any z-index issues

    $(".modal").each(function(){
        $(this).appendTo("#content");
    });



    // stop video when modal is minimized

    $(".modal").on('hidden.bs.modal', function (e) {
        $(".modal iframe").attr("src", $(".modal iframe").attr("src"));
    });


    // create a privacy notice popup

    if (Cookies.get("feature_privacy-notice") !== "true") {
        $("#content").append('\
            <div class="alert alert-warning alert-dismissible fade in" id="feature_privacy-notice" role="alert">\
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                    <span aria-hidden="true">×</span>\
                </button>\
                We have recently updated our Privacy Notice to include more information regarding the cookies we collect and whom to contact for privacy questions and concerns. By continuing to use this site you agree to both the <a href="/privacy-notice/">Privacy Notice</a> and <a href="/terms-of-use/">Terms of Use</a>.\
            </div>\
        ');
    }
    $("#feature_privacy-notice").on("closed.bs.alert", function () {
        Cookies.set("feature_privacy-notice", "true", { expires: 365 });
    });


    // viewport animation trigger

    ;(function($, win) {
      $.fn.inViewport = function(cb) {
         return this.each(function(i,el){
           function visPx(){
             var H = $(this).height(),
                 r = el.getBoundingClientRect(), t=r.top, b=r.bottom;
             return cb.call(el, Math.max(0, t>0? H-t : (b<H?b:H)));  
           } visPx();
           $(win).on("resize scroll", visPx);
         });
      };
    }(jQuery, window));
    $(".animate").inViewport(function(px){
        if (px) {
            $(this).addClass("trigger-animation");
        } else {
            $(this).removeClass("trigger-animation");
        }
    });


    // feature: contact

    window.feature_contact = function() {
        $("#content form").submit();
    }


    // feature: careers

    if ($("#feature_careers").length) {

        // default feature_careers_filter on page load
        feature_careers_filter("all");

        function feature_careers_filter(type) {

            $("#feature_careers").empty().append('\
                <a class="btn btn-default" id="feature_careers_all" style="margin-bottom:10px;">All</a>\
                <a class="btn btn-default" id="feature_careers_research-development" style="margin-bottom:10px;">Research & Development</a>\
                <a class="btn btn-default" id="feature_careers_general-administrative" style="margin-bottom:10px;">General & Administrative</a>\
                <a class="btn btn-default" id="feature_careers_commercial" style="margin-bottom:10px;">Commercial</a>\
            ');
            $("#feature_careers #feature_careers_all").click(function(){
                feature_careers_filter("all");
            });
            $("#feature_careers #feature_careers_research-development").click(function(){
                feature_careers_filter("research-development");
            });
            $("#feature_careers #feature_careers_general-administrative").click(function(){
                feature_careers_filter("general-administrative");
            });
            $("#feature_careers #feature_careers_commercial").click(function(){
                feature_careers_filter("commercial");
            });

            $(".panel .label-primary").remove();

            $(".panel").each(function(){
                if ($(this).hasClass("feature_careers_research-development")) {
                    $(this).find(".panel-heading").append('<span class="label label-primary">Research & Development</span>');
                }
                if ($(this).hasClass("feature_careers_general-administrative")) {
                    $(this).find(".panel-heading").append('<span class="label label-primary">General & Administrative</span>');
                }
                if ($(this).hasClass("feature_careers_commercial")) {
                    $(this).find(".panel-heading").append('<span class="label label-primary">Commercial</span>');
                }
            });

            if (type === "all") {
                $("#feature_careers #feature_careers_all").addClass("active");
                $(".panel").show();
            }
            if (type === "research-development") {
                $("#feature_careers #feature_careers_research-development").addClass("active");
                $(".panel").hide();
                $(".panel.feature_careers_research-development").show();
                if ($(".panel.feature_careers_research-development").length === 0) {
                    $("#feature_careers").append("<p><br/>There are no opportunities in this category, check back soon.</p>");
                }
            }
            if (type === "general-administrative") {
                $("#feature_careers #feature_careers_general-administrative").addClass("active");
                $(".panel").hide();
                $(".panel.feature_careers_general-administrative").show();
                if ($(".panel.feature_careers_general-administrative").length === 0) {
                    $("#feature_careers").append("<p><br/>There are no opportunities in this category, check back soon.</p>");
                }
            }
            if (type === "commercial") {
                $("#feature_careers #feature_careers_commercial").addClass("active");
                $(".panel").hide();
                $(".panel.feature_careers_commercial").show();
                if ($(".panel.feature_careers_commercial").length === 0) {
                    $("#feature_careers").append("<p><br/>There are no opportunities in this category, check back soon.</p>");
                }
            }

        }

    }


    // feature: pipeline

    if ($("#feature_pipeline").length) {
        $.getJSON( "/_assets/js/pipeline.json", function(pipeline) {

            $("#feature_pipeline").empty();

            $.each(pipeline["compounds"], function( compound, compound_data ) {
                $("#feature_pipeline").append('\
                    <div class="panel panel-default">\
                        <div class="panel-heading">\
                            <div class="row">\
                                <div class="col-lg-5">\
                                    <h4 class="panel-title">\
                                        '+compound+'\
                                        <span>'+compound_data["type"]+'</span>\
                                    </h4>\
                                </div>\
                                <div class="col-lg-7">\
                                    <p>'+compound_data["description"]+'</p>\
                                </div>\
                                <a data-toggle="collapse" class="collapsed" href="#'+compound+'"></a>\
                            </div>\
                        </div>\
                        <div class="panel-collapse collapse" id="'+compound+'">\
                            <div class="panel-body"></div>\
                        </div>\
                    </div>\
                ');
                $.each(pipeline["phases"], function( phase, phase_data ) {
                    $.each(pipeline["studies"], function( study, study_data ) {
                        if (study_data["phase"] === phase_data["id"]) {
                            if (study_data["compound"] === compound_data["id"]) {
                                var phase_percentage = null;
                                switch (study_data["phase"]) {
                                    case 4:
                                        phase_label = "Phase III";
                                        phase_percentage = 90;
                                        break;
                                    case 3:
                                        phase_label = "Phase II";
                                        phase_percentage = 70;
                                        break;
                                    case 2:
                                        phase_label = "Phase I-II";
                                        phase_percentage = 50;
                                        break;
                                    case 1:
                                        phase_label = "Phase I";
                                        phase_percentage = 30;
                                        break;
                                }
                                var company_color = null;
                                switch (study_data["company"]) {
                                    case 2:
                                        company_color = "#ffffff;"
                                        company_background_color = "#bfbfbf";
                                        break;
                                    case 1:
                                        company_color = "#ffffff;"
                                        company_background_color = "#50B74C";
                                        break;
                                }
                                var column_1 = '<strong>'+study_data["name"]+'</strong><br/>';
                                if (typeof(study_data["delivery"]) === 'object') {
                                    $.each( study_data["delivery"], function( delivery, delivery_data ) {
                                        column_1 += '<a class="small" href="'+delivery_data["link"]+'" target="_blank">'+delivery+'</a><br/>';
                                        if (typeof(delivery_data["disclaimer"]) === 'string') {
                                            column_1 += '<span class="small"><em>'+delivery_data["disclaimer"]+'</em></span>';
                                        }
                                    });
                                }
                                if (typeof(study_data["separator"]) === "boolean") {
                                    $("#feature_pipeline .panel").last().find(".panel-body").append('<hr style="margin-bottom:0;">');
                                }
                                $("#feature_pipeline .panel").last().find(".panel-body").append('\
                                    <div class="spacer-15"></div>\
                                    <div class="row">\
                                        <div class="col-md-5">'+column_1+'</div>\
                                        <div class="col-md-7">\
                                            <div class="progress">\
                                                <div class="progress-bar" role="progressbar" style="background-color: '+company_background_color+';border-left-color: '+company_background_color+';color: '+company_color+';width: '+phase_percentage+'%;">'+phase_label+'</div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                ');
                            }
                        }
                    });
                });
            });
            $("#feature_pipeline a.collapsed").first().click();

        })
        .error(function() {
            $("#feature_pipeline").empty();
            $("#feature_pipeline").append('<p>There was a problem loading the pipeline, please try again later.</p>');
        });

    }


    // feature: news & media

    if ($("#feature_news-media").length) {

        // default feature_newsmedia_filter on page load
        switch (window.location.hash.replace("#","")) {
            case "all":
                feature_newsmedia_filter("all");
                break;
            case "press-release":
                feature_newsmedia_filter("press-release");
                break;
            case "media":
                feature_newsmedia_filter("media");
                break;
            case "news":
                feature_newsmedia_filter("news");
                break;
            default:
                feature_newsmedia_filter("all");
                break;
        }

        function feature_newsmedia_filter(type) {

            $("#feature_news-media").empty().append('\
                <a class="btn btn-default" id="feature_news-media_all" style="margin-bottom:10px;">All</a>\
                <a class="btn btn-default" id="feature_news-media_press-release" style="margin-bottom:10px;">Press Releases</a>\
                <a class="btn btn-default" id="feature_news-media_media" style="margin-bottom:10px;">In the Media</a>\
                <a class="btn btn-default" id="feature_news-media_news" style="margin-bottom:10px;">News</a>\
            ');
            $("#feature_news-media #feature_news-media_all").click(function(){
                window.location.hash = "all";
                feature_newsmedia_filter("all");
            });
            $("#feature_news-media #feature_news-media_press-release").click(function(){
                window.location.hash = "press-release";
                feature_newsmedia_filter("press-release");
            });
            $("#feature_news-media #feature_news-media_media").click(function(){
                window.location.hash = "media";
                feature_newsmedia_filter("media");
            });
            $("#feature_news-media #feature_news-media_news").click(function(){
                window.location.hash = "news";
                feature_newsmedia_filter("news");
            });

            $(".panel .label-primary").remove();

            $(".panel").each(function(){
                if ($(this).hasClass("feature_news-media_press-releases")) {
                    $(this).find(".panel-heading").append('<span class="label label-primary">Press Release</span>');
                }
                if ($(this).hasClass("feature_news-media_media")) {
                    $(this).find(".panel-heading").append('<span class="label label-primary">In the Media</span>');
                }
                if ($(this).hasClass("feature_news-media_news")) {
                    $(this).find(".panel-heading").append('<span class="label label-primary">News</span>');
                }
            });

            if (type === "all") {
                $("#feature_news-media #feature_news-media_all").addClass("active");
                $(".panel").show();
            }
            if (type === "press-release") {
                $("#feature_news-media #feature_news-media_press-release").addClass("active");
                $(".panel").hide();
                $(".panel.feature_news-media_press-releases").show();
                if ($(".panel.feature_news-media_press-releases").length === 0) {
                    $("#feature_news-media").append("<p><br/>There is no News & Media within this category, check back soon.</p>");
                }
            }
            if (type === "media") {
                $("#feature_news-media #feature_news-media_media").addClass("active");
                $(".panel").hide();
                $(".panel.feature_news-media_media").show();
                if ($(".panel.feature_news-media_media").length === 0) {
                    $("#feature_news-media").append("<p><br/>There is no News & Media within this category, check back soon.</p>");
                }
            }
            if (type === "news") {
                $("#feature_news-media #feature_news-media_news").addClass("active");
                $(".panel").hide();
                $(".panel.feature_news-media_news").show();
                if ($(".panel.feature_news-media_news").length === 0) {
                    $("#feature_news-media").append("<p><br/>There is no News & Media within this category, check back soon.</p>");
                }
            }

        }

    }

});
