function createListItem(tthis, sel){

    sel.append($("<li>")
    .attr('id', 'li_'+ tthis.val)  
    .attr('common_id', tthis.val)
    .attr('data-juri', tthis.text)
    .attr('enabled', 'true')
    .addClass('juri_list_item')
    )
  
    let litem = $('#'+ 'li_' + tthis.val)

    litem
    .append($("<input>")
    .attr('type','checkbox')
    .attr('class', 'juri-check')
    .attr('value', tthis.text)
    .attr('id', 'in_' + tthis.val)
    .attr('common_id', tthis.val)
    .attr('data-juri', tthis.text)
    )
    .append($("<label>")
    .addClass( 'search_name')
    .addClass('unselectable')
    .attr('id', 'la_' + tthis.val)
    .attr('common_id', tthis.val)
    .text('\xa0' + tthis.text)
    );
  
    litem // Click + Children click used to trigger click event whether list-item, text, or checkbox is clicked in UI
    .click(function(){    // Click on LIST_ITEM
      
      let litem = $(this)
      let intem = $('#'+'in_'+ litem.attr('common_id'))
      let locname = intem.attr('value')

      if(litem.attr('enabled') === 'true'){
        intem.prop("checked")             
          ? (
             intem.removeAttr("checked"),
             cur_juri = cur_juri.filter(d => d !== locname).sort(),
             cur_numb_sel_juri = cur_numb_sel_juri - 1,
             d3.select('.error_message').style('display', 'none'),
             UpdateJ()
            ) 
          : cur_numb_sel_juri < max_n_juri 
            ? (
              intem.prop("checked", "checked"),
              cur_juri.push(locname),
              cur_juri = cur_juri.sort(),
              cur_numb_sel_juri = cur_numb_sel_juri + 1,
              d3.select('.error_message').style('display', 'none'),
              UpdateJ()
              )
            :  d3.select('.error_message').style('display', 'block')
      }
      
    })
      .children().click(function(e){  // Click on CHECKBOX or TEXT
        let item = $(this)
        let litem = $('#'+'li_'+ item.attr('common_id'))
        let locname = []
        let intem = $('#'+'in_'+ item.attr('common_id'))

        if(litem.attr('enabled') === 'true'){
          item.prop('class') === 'juri-check'
            ? (     // clicked item is checkbox
                locname = item.attr('value'),
                item.prop("checked") // !! Anticipates current click => true = 'has just been clicked *starting from unchecked*' 
                  ? cur_numb_sel_juri < max_n_juri 
                    ? (
                      cur_juri.push(locname),
                      cur_numb_sel_juri = cur_numb_sel_juri + 1, 
                      cur_juri = cur_juri.sort(),
                      d3.select('.error_message').style('display', 'none'),
                      UpdateJ()
                      )
                    : (
                      intem.removeAttr("checked"),
                      d3.select('.error_message').style('display', 'block')
                      )
                  : (
                    cur_juri = cur_juri.filter(d => d !== locname).sort(),
                    cur_numb_sel_juri = cur_numb_sel_juri - 1,
                    d3.select('.error_message').style('display', 'none'),
                    UpdateJ()
                    )
              )
            : (     // clicked item is text
/*                 intem = $('#'+'in_'+ item.attr('common_id')), */
                locname = intem.attr('value'),
                intem.prop("checked")
                  ? (
                    intem.removeAttr("checked"),
                    cur_juri = cur_juri.filter(d => d !== locname).sort(),
                    cur_numb_sel_juri = cur_numb_sel_juri - 1,
                    d3.select('.error_message').style('display', 'none'),
                    UpdateJ()
                    )
                  : cur_numb_sel_juri < max_n_juri 
                    ? (
                      intem.prop("checked", "checked"),
                      cur_juri.push(locname),
                      cur_numb_sel_juri = cur_numb_sel_juri + 1,
                      cur_juri = cur_juri.sort(),
                      d3.select('.error_message').style('display', 'none'),
                      UpdateJ()
                      )
                    :  d3.select('.error_message').style('display', 'block')
              )
        }
        e.stopPropagation(); // prevent child click from bubbling back up to parent, https://stackoverflow.com/questions/1369035/how-do-i-prevent-a-parents-onclick-event-from-firing-when-a-child-anchor-is-cli
        }
        );
}
