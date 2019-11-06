/**
 * ########################################################################
 * JS/jQuery for Typesetter CMS plugin Simple Button
 * Author: J. Krausz
 * Date: 2019-10-22
 * Version 1.1
 * ########################################################################
 */

var gpE_SB_unsavedChanges = false;

$(function(){

  $('#gpE_SB_saveButton').on('click', function(e){
    e.preventDefault();
    if( $('input[name="newClassName"]').val().trim() != '' ){
      $('.gpE_SB_addClassItem').click();
    }
    gpE_SB_unsavedChanges = false;
    $('#buttonConfig_form').submit();
  });

  $('.gpE_SB_addClassItem').on('click', function(){
    var newItemRow = $(this).closest('tr');
    var newClassName = newItemRow.find('input[name="newClassName"]').val().trim();
    if( newClassName == '' ){
      alert('The className field must not be empty!');
      return false;
    }
    var newKeyNum = $('.gpE_SB_classItem').length + 1;
    var addItemRow = newItemRow.clone();
    addItemRow.attr('class', 'gpE_SB_classItem');
    addItemRow.find('input[name="newClassLabel"]')
      .attr('name', 'buttonConfig[' + newKeyNum + '][label]');
    addItemRow.find('input[name="newClassName"]')
      .attr('name', 'buttonConfig[' + newKeyNum + '][classnames]');
    addItemRow.find('a')
      .removeClass('gpE_SB_addClassItem')
      .addClass('gpE_SB_removeClassItem')
      .html('<i class="fa fa-trash"></i>')
      .on('click', function(e){
        gpE_SB_removeItem(e.target);
      });
    addItemRow.insertAfter(newItemRow);

    $('#gpE_SB_classItems').sortable({
      items  : '.gpE_SB_classItem',
      revert : true,
      cursor : 'move',
      change : function(event, ui){
        gpE_SB_unsavedChanges = true;
      }
    });

    newItemRow.find('input').each( function(){
      $(this).val('');
    });

    gpE_SB_unsavedChanges = true;
  });

  $('.gpE_SB_removeClassItem').on('click', function(){
    gpE_SB_removeItem(this);
  });

  $('#gpE_SB_classItems').sortable({
    items  : '.gpE_SB_classItem',
    revert : true, 
    cursor : 'move',
    change : function(event,ui){
      gpE_SB_unsavedChanges = true;
    } 
  });

  $('#classData_form input').on('input', function(){
    gpE_SB_unsavedChanges = true;
  });

  $(window).on('beforeunload', function(){
    if( gpE_SB_unsavedChanges ){
      return 'Warning: There are unsaved changes that will be lost. Proceed anyway?';
    }
  });

});

function gpE_SB_removeItem(caller){
  var reallyRemove = confirm("Really remove this item?");
  if( reallyRemove ){
    $(caller).closest("tr").remove();
    return true;
  }
  return false;
}
