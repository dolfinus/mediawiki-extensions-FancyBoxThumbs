if (HTMLCollection.prototype.forEach === undefined) {
    HTMLCollection.prototype.forEach = function(callback, thisObj) {
    Array.prototype.forEach.call(this, callback, thisObj);
  };
}

if (NodeList.prototype.forEach === undefined) {
    NodeList.prototype.forEach = function(callback, thisObj) {
    Array.prototype.forEach.call(this, callback, thisObj);
  };
}

( function ( $ ) {
    var window_size = Math.max(Math.min(((window.innerHeight !== 0) ? window.innerHeight : screen.height) - 100, ((window.innerWidth !== 0) ? window.innerWidth : screen.width) - 250), 300);
    if (window_size < 300) {
      return;
    }
      
    //remove the link to the file:image page and replace it with a link to the original file to be displayed inside the fancybox modal window.
    $("a.mw-file-description").each(function () {
        "use strict";

        var img_src_parts,
            new_img_src,
            img_title,
            is_gallery = $(this).parents('.gallery').length,
            orig_img_src = $(this).find('img').attr("src");

        //break up the image link into an array
        img_src_parts = orig_img_src.split("/");

        if ($.inArray("thumb", img_src_parts) < 0) {
            // If true, this is not the thumbnail. Original is probably smaller than Thumb size.
            new_img_src = orig_img_src;
        } else {
            //remove "thumb" from path
            img_src_parts.splice($.inArray("thumb", img_src_parts), 1);
            if ($.inArray("webp", img_src_parts) >= 0) {
              img_src_parts.splice($.inArray("webp", img_src_parts), 1);
            }

            //remove thumbnail filename (from the end of the src)
            img_src_parts.splice(img_src_parts.length - 1, 1);

            //re-assemble the path
            new_img_src = img_src_parts.toString().replace(/\,/g, "/");
        }
        if(is_gallery){
          $(this).attr("rel", "group1");
        }
        //attach alt or caption as title
        
        img_title = null;
        if(is_gallery){
            var content = $(this).parents('.thumb').next('.gallerytext').find('p');
            if (content.length > 0) {
              if (content.children('span').length == 0) {
                img_title = '<div class="description">'+$(content).html().trim()+'</div>';
              } else {
                img_title = $(content).html().trim();
              }
            }
        } else {
            var content = $(this).next(".thumbcaption");
            if (content.length > 0) {
              if (content.children('span').length == 0) {
                img_title = '<div class="description">'+$(content).html().trim()+'</div>';
              } else {
                img_title = $(content).html().trim();
              }
            }
        }

        if (!img_title) {
          img_title = $(this).find('img').attr("alt");
        }
        //img_title = (img_title !== "")?img_title + " - ":"";
        //add info to anchor tag for discovery by fancybox
        $(this)
          .data("fancybox-href", new_img_src)
          .data("fancybox-title", img_title)
          .addClass('fancybox')
          .addClass('zoom');
    });
    
    $(".threed").each(function () {
        if ($(this).parents(".doc").length === 0) {
          canvas = $(this).html() + "";
          $(this)
            .data("fancybox-type", "html")
            .attr("href",canvas.replace(/width=\".+?\"/g,'width="0"').replace(/height=\".+?\"/g,'height="0"').replace('norotate="1"','norotate="0"'))
            //.attr("href",canvas.replace(/width=\".+?\"/g,'width="'+(window_size-12)+'px"').replace(/height=\".+?\"/g,'height="'+(window_size-30)+'px"'))
            //.attr("rel", "group2")
            .addClass('fancybox')
            .addClass('html');
          $(this).children(".threed-container").each(function (){ $(this).addClass('zoom'); });
        }
    });
    
    //now set fancybox on all thumbnail links
    //fbtFancyBoxOptions is set in LocalSettings.php
    //example {closeBtn:false}
    image_options = jQuery.extend({}, fbtFancyBoxOptions);
    image_options.maxWidth  = window_size+100;
    image_options.maxHeight = window_size+100;
    
    image_options.beforeShow = function () {      
      var objects = document.getElementsByClassName('threed-container');
      objects.forEach(function(item, id) {
        if (item.object !== undefined) {
          item.object.rotation = false;
          item.classList.add('locked');
        }
      });
      if (window.recreate_3d !== undefined) window.recreate_3d();
    };
    image_options.afterClose = function () {      
      var objects = document.getElementsByClassName('threed-container');
      objects.forEach(function(item, id) {
        if (item.object !== undefined) {
          if (item.getAttribute('norotate') === "1" || item.getAttribute('norotate') === "true") {
            item.object.rotation = false;
          } else {
            item.object.rotation = true;
          }
        }
        item.classList.remove('locked');
      });
      if (window.recreate_3d !== undefined) window.recreate_3d();
    };
    
    model_options = jQuery.extend({}, image_options);
    model_options.maxWidth   = window_size;
    model_options.maxHeight  = window_size;
    model_options.mouseWheel = false;
    model_options.fitToView  = false;
    model_options.keys = {
    		next : {
					0 : 'left',
					0 : 'up',
					0 : 'left',
					0 : 'up'
				},
				prev : {
					0  : 'right',
					0 : 'down', 
					0 : 'right',
					0 : 'down'  
				},
				close  : [27],
				play   : [0],
				toggle : [70]
		};
    $(".fancybox.mw-file-description").fancybox(image_options);
    $(".fancybox.threed").fancybox(model_options);
}( jQuery ) );
