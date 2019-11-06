/**
 * ########################################################################
 * JS/jQuery script for Typesetter CMS plugin Simple Button
 * Editor Component
 * Author: J. Krausz
 * Date: 2019-10-22
 * Version 1.1
 * ########################################################################
 */



function gp_init_inline_edit(area_id, section_object){

  // console.log("section_object = ", section_object);

  $gp.LoadStyle( SimpleButton.base + '/SimpleButton_edit.css' );
  gp_editing.editor_tools();
  edit_div = gp_editing.get_edit_area(area_id);

  gp_editor = {

    button_wrapper        : edit_div.find("div.sb-wrapper"),
    button                : edit_div.find("a.btn"),
    button_text           : edit_div.find("a.btn span.sb-buttontext"),
    button_icon_before    : edit_div.find("a.btn span.sb-buttontext").prev('i'),
    button_icon_after     : edit_div.find("a.btn span.sb-buttontext").next('i'),

    save_path             : gp_editing.get_path(area_id),

    checkDirty            : function(){ 
                              var curr_val = gp_editor.gp_saveData();
                              if( curr_val != cache_value ){
                                return true;
                              }
                              return false;
                            },

    resetDirty            : function(){
                              cache_value = gp_editor.gp_saveData();
                            },

    gp_saveData           : function(){
                              edit_div.find('.gpclear').remove();
                              var content = edit_div.html();
                              return '&gpcontent=' + encodeURIComponent(content);
                            },

    ui                    : {}, // defined later on

    linkFromFinder        : function(){}, // defined later on
    // FinderSelect       : function(){}, // will be created an destroyed dynamically

    showFontAwesomeSelect : function(){} // defined later on

  }; // gp_editor --end



  gp_editor.linkFromFinder = function(){
    
    gp_editor.FinderSelect = function(fileUrl){
      if( fileUrl != '' ){
        // console.log(fileUrl);
        gp_editor.ui.buttonLink.val(fileUrl);
        gp_editor.button.attr('href', fileUrl);
      }
      setTimeout(function(){
        delete gp_editor.FinderSelect;
      }, 150);
      return true;
    };
    var finderPopUp = window.open(gpFinderUrl, 'gpFinder', 'menubar=no,width=960,height=640');
    if( window.focus ){
      finderPopUp.focus();
    }
  };



  gp_editor.createEditorUi = function(){

    gp_editor.ui.controls = [];

    // icon before

    gp_editor.ui.iconBefore = $('<button data-which-icon="before">'
      + '<i class="fa sb-no-icon"></i>'
      + '</button>')
      .on('click.sbfa', gp_editor.showFontAwesomeSelect);
    if( gp_editor.button_icon_before.length ){
      gp_editor.ui.iconBefore.find('i')
        .removeClass('sb-no-icon')
        .addClass(gp_editor.button_icon_before.attr('class'));
    }

    // button text
    gp_editor.ui.buttonText = $('<input type="text" placeholder="Button Text" />')
      .val(gp_editor.button_text.html())
      .on('input', function(){
        gp_editor.button_text.html($(this).val());
      }).on('focus', function(){
        $(this).select();
      });

    // icon after
    gp_editor.ui.iconAfter =  $('<button data-which-icon="after">'
      + '<i class="fa sb-no-icon"></i>'
      + '</button>')
      .on('click.sbfa', gp_editor.showFontAwesomeSelect);
    if( gp_editor.button_icon_after.length ){
      gp_editor.ui.iconAfter.find('i')
        .removeClass('sb-no-icon')
        .addClass(gp_editor.button_icon_after.attr('class'));
    }

    var $control = $('<div class="editor-ctl-box ctl-iconbutton-input-iconbutton"></div>')
      .append([
        gp_editor.ui.iconBefore,
        gp_editor.ui.buttonText,
        gp_editor.ui.iconAfter
      ]);
    gp_editor.ui.controls.push($control);

    // link url
    gp_editor.ui.buttonLink = $('<input type="text" placeholder="/some-page" />')
      .val(gp_editor.button.attr('href'))
      .on('input', function(){
        gp_editor.button.attr('href', $(this).val());
        if( $(this).val().indexOf('http') != -1 ){
          gp_editor.ui.buttonTarget.prop('checked', true).trigger('change');
        }
      }).on('focus', function(){
        $(this).select();
      }).autocomplete({
        source    : gptitles,
        appendTo  : '#gp_admin_html',
        delay     : 100,
        minLength : 0,
        select    : function(evt, ui){
          if(ui.item) {
            $(this).val(encodeURI(ui.item[1]));
            evt.stopPropagation();
            return false;
          }
        }
      });
      gp_editor.ui.buttonLink.data("ui-autocomplete")._renderItem = function(ul, item){
        return $("<li></li>")
          .data("ui-autocomplete-item", item[1])
          .append('<a>'
            + $gp.htmlchars(item[0])
            + '<span>' + $gp.htmlchars(item[1]) + '</span>'
            + '</a>')
          .appendTo(ul);
      };


    // file select button
    gp_editor.ui.selectFile = $('<button title="Select File">'
      + '<i class="fa fa-file-o"></i>'
      + '</button>')
      .on('click', gp_editor.linkFromFinder); // ##### TODO #####

    // open in new win/tab
    gp_editor.ui.buttonTarget = $('<input type="checkbox" />')
      .prop('checked', (gp_editor.button.attr('target') == '_blank'))
      .on('change', function(){
        gp_editor.button.attr('target', ($(this).prop('checked') ? '_blank' : '_self') );
      });

    var $in_new_tab = $('<label>new tab/window</label>')
      .prepend([
        gp_editor.ui.buttonTarget,
        '<span></span>'
      ]);

    var $header = $('<div class="editor-ctl-header"><label>Button Link</label></div>');

    var $footer = $('<div class="editor-ctl-footer"></div>')
      .append($in_new_tab);

    var $control = $('<div class="editor-ctl-box ctl-input-iconbutton"></div>')
      .append([
        $header,
        gp_editor.ui.buttonLink,
        gp_editor.ui.selectFile,
        $footer 
      ]);
      gp_editor.ui.controls.push($control);


    $.each(SimpleButton.config, function(cfgi, cfgv){

      if( typeof(cfgv) != 'object' || cfgv.classnames.trim() == '' ){
        return;
      }

      var classnames_arr = cfgv.classnames.trim().split(' ');

      var $header = $('<div class="editor-ctl-header"><label>' 
        + cfgv.label.trim() + '</label></div>');

      if( classnames_arr.length > 1 ){
        // render a select
        var html = '<select data-classnames="' + cfgv.classnames.trim() + '">';
        html += '<option value=""> -not set- </option>';
        $.each(classnames_arr, function(cni, cnv){
          html += '<option value="' + cnv + '">' + cnv + '</option>';
        });
        html += '</select>';
        gp_editor.ui['classSelect_' + cfgi] = $(html)
          .val( function(){
            var classname = '';
            var classnames = $(this).attr("data-classnames").split(/\s+/);
            $.each(classnames, function(i, v){
              if( gp_editor.button.hasClass(v) ){
                classname = v;
                return false; // terminates $.each
              }
            });
            return classname;
          })
          .on('change', function(){
            gp_editor.button.removeClass( $(this).attr('data-classnames') )
              .addClass( $(this).val().trim() );
          });
      }else{
        // render a checkbox
        gp_editor.ui['classSelect_' + cfgi] = $('<input type="checkbox" '
          + 'data-classnames="' + cfgv.classnames.trim() + '"/>')
          .prop('checked', gp_editor.button.hasClass(cfgv.classnames.trim()))
          .on('change', function(){
            gp_editor.button.toggleClass( $(this).attr('data-classnames'), $(this).prop('checked') );
          });
      }

      var $control = $('<div class="editor-ctl-box"></div>')
        .append([
          $header,
          gp_editor.ui['classSelect_' + cfgi]
        ]);
      gp_editor.ui.controls.push($control);

    }); // $.each(gp_editor.SimpleButton.config) -- end


    // horizontal alignment
    var $header = $('<div class="editor-ctl-header"><label>Horizontal Alignment</label></div>');

    gp_editor.ui.hAlignSelect = $('<select data-classnames="'
      + 'sb-inherit sb-left sb-center sb-right sb-fullwidth">'
      +   '<option value="sb-inherit">inherit</option>'
      +   '<option value="sb-left">left</option>'
      +   '<option value="sb-center">center</option>'
      +   '<option value="sb-right">right</option>'
      +   '<option value="sb-fullwidth">fullwidth</option>'
      + '</select>')
      .val( function(){
        var classname = '';
        var classnames = $(this).attr("data-classnames").split(/\s+/);
        $.each(classnames, function(i, v){
          if( gp_editor.button_wrapper.hasClass(v) ){
            classname = v;
            return false; // terminates $.each
          }
        });
        return classname;
      })
      .on('change', function(){
        gp_editor.button_wrapper.removeClass( $(this).attr('data-classnames') )
          .addClass( $(this).val().trim() );
      });

    var $control = $('<div class="editor-ctl-box"></div>')
      .append([
        $header,
        gp_editor.ui.hAlignSelect
      ]);
    gp_editor.ui.controls.push($control);

    // vertical alignment
    var $header = $('<div class="editor-ctl-header"><label>Vertical Alignment</label></div>');
    gp_editor.ui.vAlignSelect = $('<select data-classnames="sb-top sb-middle sb-bottom sb-fullheight">'
      +   '<option value="sb-top">top</option>'
      +   '<option value="sb-middle">middle</option>'
      +   '<option value="sb-bottom">bottom</option>'
      +   '<option value="sb-fullheight">fullheight</option>'
      + '</select>')
      .val( function(){
        var classname = '';
        var classnames = $(this).attr("data-classnames").split(/\s+/);
        $.each(classnames, function(i, v){
          if( gp_editor.button_wrapper.hasClass(v) ){
            classname = v;
            return false; // terminates $.each
          }
        });
        return classname;
      })
      .on('change', function(){
        gp_editor.button_wrapper
          .removeClass( $(this).attr('data-classnames') )
          .addClass( $(this).val().trim() );
      });

    var $control = $('<div class="editor-ctl-box"></div>')
      .append([
        $header,
        gp_editor.ui.vAlignSelect
      ]);
    gp_editor.ui.controls.push($control);

    // build option area
    gp_editor.ui.option_area = $('<div class="sb-option-area"></div>')
      .append(gp_editor.ui.controls)
      .prependTo('#ckeditor_controls');

  };



  gp_editor.showFontAwesomeSelect = function(evt){

    if( gp_editor.ui.currentFontAwesomeSelect ){
      // console.log('currentFontAwesomeSelect exists');
      // early exit
      return false;
    }

    var $editor_button  = $(evt.target).closest('button');
    var $editor_icon    = $editor_button.find('i');
    var which_icon      = $editor_button.attr('data-which-icon');

    // console.log(gp_editor.button_text);
    var fa_classes_backup = $editor_icon.attr('class');

    if( which_icon != 'before' && which_icon != 'after' ){
      // console.log('FontAwesome select error: invalid argument passed for which_icon');
      return false;
    }

    if( which_icon == 'before' ){
      if( !gp_editor.button_text.prev('i').length ){
        gp_editor.button_text.before('<i class="fa sb-no-icon"></i>');
      }
      var $currentIcon = gp_editor.button_text.prev('i');
    }else{
      if( !gp_editor.button_text.next('i').length ){
        gp_editor.button_text.after('<i class="fa sb-no-icon"></i>');
      }
      var $currentIcon = gp_editor.button_text.next('i');
    }

    var fa_classes = [];
    $.each(fontAwesomeClassNames, function(fa_class, txt){
      fa_classes.push(fa_class);
    });
    var data_fa_classes = fa_classes.join(' ');

    var $icon_select = $('<div class="sb-fa-icon-select sb-fa-icon-select-' + which_icon + '" '
      + 'data-fa-classes="' + data_fa_classes + '" '
      + 'data-classes-backup="' + fa_classes_backup + '">'
      + '</div>');

    var $label = $('<label><span></span> Fixed Width</label>');
    gp_editor.ui['icon' + which_icon + 'FixedWidth'] = $('<input type="checkbox" />')
      .attr('checked', $currentIcon.hasClass('fa-spin'))
      .on('change', function(){
        $editor_icon.toggleClass('fa-fw', $(this).prop('checked'));
        $currentIcon.toggleClass('fa-fw', $(this).prop('checked'));
      });
    gp_editor.ui['icon' + which_icon + 'FixedWidth'].prependTo($label);
    $icon_select.append($label);

    gp_editor.ui['icon' + which_icon + 'SpinPulse'] = $(
      '<select data-classnames="fa-spin fa-pulse">'
      +   '<option value="">no Spin/Pulse</option>'
      +   '<option value="fa-spin">Spin</option>'
      +   '<option value="fa-pulse">Pulse</option>'
      + '</select>'
    ).val( function(){
      var classname = '';
      var classnames = $(this).attr("data-classnames").split(/\s+/);
      $.each(classnames, function(i, v){
        if( $currentIcon.hasClass(v) ){
          classname = v;
          return false; // terminates $.each
        }
      });
      return classname;
    })
    .on('change', function(){
      $editor_icon
        .removeClass( $(this).attr('data-classnames') )
        .addClass( $(this).val().trim() );
      $currentIcon
        .removeClass( $(this).attr('data-classnames') )
        .addClass( $(this).val().trim() );
    });
    $icon_select.append(gp_editor.ui['icon' + which_icon + 'SpinPulse']);

    gp_editor.ui['icon' + which_icon + 'Flip'] = $(
      '<select data-classnames="fa-flip-horizontal fa-flip-vertical">'
      +   '<option value="">no Flipping</option>'
      +   '<option value="fa-flip-horizontal">Flip Horizontal</option>'
      +   '<option value="fa-flip-vertical">Flip Vertical</option>'
      + '</select>'
    ).val( function(){
      var classname = '';
      var classnames = $(this).attr("data-classnames").split(/\s+/);
      $.each(classnames, function(i, v){
        if( $currentIcon.hasClass(v) ){
          classname = v;
          return false; // terminates $.each
        }
      });
      return classname;
    })
    .on('change', function(){
      $editor_icon
        .removeClass( $(this).attr('data-classnames') )
        .addClass( $(this).val().trim() );
      $currentIcon
        .removeClass( $(this).attr('data-classnames') )
        .addClass( $(this).val().trim() );
    });
    $icon_select.append(gp_editor.ui['icon' + which_icon + 'Flip']);

    gp_editor.ui['icon' + which_icon + 'Rotate'] = $(
      '<select data-classnames="fa-rotate-90 fa-rotate-180 fa-rotate-270">'
      +   '<option value="">no Rotation</option>'
      +   '<option value="fa-rotate-90">Rotate 90 deg</option>'
      +   '<option value="fa-rotate-180">Rotate 180 deg</option>'
      +   '<option value="fa-rotate-270">Rotate 270 deg</option>'
      + '</select>'
    ).val( function(){
      var classname = '';
      var classnames = $(this).attr("data-classnames").split(/\s+/);
      $.each(classnames, function(i, v){
        if( $currentIcon.hasClass(v) ){
          classname = v;
          return false; // terminates $.each
        }
      });
      return classname;
    })
    .on('change', function(){
      $editor_icon
        .removeClass( $(this).attr('data-classnames') )
        .addClass( $(this).val().trim() );
      $currentIcon
        .removeClass( $(this).attr('data-classnames') )
        .addClass( $(this).val().trim() );
    });
    $icon_select.append(gp_editor.ui['icon' + which_icon + 'Rotate']);

    // icon list
    var html = '';
    var cbname = 'icon' + which_icon;
    var fa_classes = '';

    gp_editor.ui.iconSearch = $('<input class="fa-icon-select-iconSearch" '
    + 'placeholder="Search for e.g. arrow" type="text" />')
      .on('input', function(){
        var val = $(this).val().trim().toLowerCase();
        gp_editor.ui['icon' + which_icon].find('li').each(function(){
          var $li = $(this);
          var fa = $li.attr('data-fa').toLowerCase();
          if(val == ''){
            $li.show();
          }else{
            var toggle = fa.indexOf(val) != -1;
            $li.toggle(toggle);
          }
        });
      });
    $icon_select.append(gp_editor.ui.iconSearch);


    $.each(fontAwesomeClassNames, function(fa, txt){
      html += '<li title="' + txt + '" data-fa="' + fa + ': ' + txt + '">'
        +   '<label>'
        +     '<input type="radio" name="' + cbname + '" value="' + fa + '" >'
        +     '<i class="fa ' + fa + '"></i>'
        +   '</label>'
        + '</li>';
    });


    gp_editor.ui['icon' + which_icon] = $('<ul class="fa-icon-select-iconlist">' + html + '</ul>');

    gp_editor.ui['icon' + which_icon].find('input[name="' + cbname + '"]')
      .each(function(){
        $this = $(this);
        if( $currentIcon.hasClass($this.val()) ){
          $this.prop('checked', true);
        }
      }).on('change', function(){
        if( $(this).prop('checked') ){
          var removeclasses = gp_editor.ui.currentFontAwesomeSelect.attr('data-fa-classes');
          $editor_icon
            .removeClass(removeclasses);
          $currentIcon
            .removeClass(removeclasses);
          if( $(this).val() != '' ){
            $editor_icon
              .addClass( $(this).val() );
            $currentIcon
              .addClass( $(this).val() );
          }
        }
      });

    $icon_select.append(gp_editor.ui['icon' + which_icon]);

    gp_editor.ui.fontAwesomeSelectCancel = $('<button>' + gplang.ca + '</button>')
      .on('click', function(){
        var restore_classes = gp_editor.ui.currentFontAwesomeSelect
          .attr('data-classes-backup');
        $editor_icon.attr('class', restore_classes);
        $currentIcon.attr('class', restore_classes);
        if( $currentIcon.hasClass('sb-no-icon') ){
          $currentIcon.remove();
        }
        gp_editor.ui.currentFontAwesomeSelect.remove();
        gp_editor.ui.currentFontAwesomeSelect = null;
      })
      .appendTo($icon_select);

    gp_editor.ui.fontAwesomeSelectApply = $('<button>OK</button>')
      .on('click', function(){
        if( $currentIcon.hasClass('sb-no-icon') ){
          $currentIcon.remove();
        }
        gp_editor.ui.currentFontAwesomeSelect.remove();
        gp_editor.ui.currentFontAwesomeSelect = null;
      })
      .appendTo($icon_select);


    gp_editor.ui.currentFontAwesomeSelect = $icon_select
      .appendTo(gp_editor.ui.option_area);

    // scroll to checked icon (only works when rendered)
    gp_editor.ui['icon' + which_icon]
    .scrollTop( function(){
      var $checked_li = gp_editor.ui['icon' + which_icon].find('input:checked').closest('li');
      if( $checked_li.length ){
        var top = $checked_li.last().offset().top;
        console.log('top = ' + top + ', li = ', $checked_li);
      }
      return top - 230;
    });

    gp_editor.ui.iconSearch.focus();

  };



  /* ################### */
  /* ### INIT EDITOR ### */
  /* ################### */
  var cache_value = gp_editor.gp_saveData();
  gp_editor.createEditorUi();
  loaded();

}
