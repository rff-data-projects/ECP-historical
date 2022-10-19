/*  */
/* Update UI components */
/*  */

/* Update Jurisdiction Selector */

function Enable_item(it, int, lat){
  it.attr('enabled', 'true')
  int.prop('checked', true)
  int.removeAttr("disabled")
  lat.removeClass('greyed')
}

function Enable_item_unchecked(it, int, lat){
  it.attr('enabled', 'true')
  int.prop('checked', false)
  int.removeAttr("disabled")
  lat.removeClass('greyed')
}

function Disable_item(it, int, lat){
  it.attr('enabled', 'false')
  int.prop('checked', false)
  int.attr("disabled", true);
  lat.addClass('greyed')
}

/* Update selectors */

function UpdateJuriSelect(cur_pos_juri){

  let count = 0

  $('.juri_list_item').each(function(){
    let item = $(this)
    let latem = $('#'+'la_'+ item.attr('common_id'))
    let intem = $('#'+'in_'+ item.attr('common_id'))

    if(count < n_rand_juri){
      cur_pos_juri.includes(item.attr('data-juri')) 
        ? ( Enable_item(item, intem, latem), count = count + 1)
        : Disable_item(item, intem, latem)
    } else {
      cur_pos_juri.includes(item.attr('data-juri')) 
        ? Enable_item_unchecked(item, intem, latem) 
        : Disable_item(item, intem, latem)
    }
  })
}

function UpdateSectorSelect(cur_pos_sector){
  $('#sector-selector').children().each(function(){
    selopt = $(this)
    if (selopt.attr('data-ipcc_code') === undefined) return ; // early exit
    cur_pos_sector.includes(selopt.attr('data-ipcc_code'))
      ? $(this).prop('disabled', false)
      : $(this).prop('disabled', true)
  })
}

/* Update charts */

function UpdateChart(sel_data, loc_juri){

    let non_null_years = sel_data 
                          .filter(d => d.price !== 'null' & loc_juri.includes(d.jurisdiction))
                          .map(d => parseInt(d.year))
    let min_year = Math.min(...non_null_years)
    let max_year = Math.max(...non_null_years)

    let dis_data = loc_juri.map(function(d){
      return {
        name: d,
        data: sel_data
                .filter(e => e['jurisdiction'] === d && e['year'] >= min_year && e['year'] <= max_year)
                .map(c => c['price'] === 'null' ? null : Math.round(c['price']*100)/100)
      }
    })

    LineChart(dis_data, loc_juri, min_year)
}

/*  */
/* Update functions */
/*  */

/* Chart updates coming from pricing selector */

function UpdatePY(){

    let sector = $('#sector-selector').val()
    sector = sector === null ? undefined : sector.split(' ')[0]
    let p2dat = $('#pricing-selector').select2('data')
    let pricing = p2dat[0].prog_value

    let sel_data = cur_data.filter(
        d => (d.ipcc_code === sector
              & d[pricing] !== "NA"
            )
    )

    let loc_juri = sel_data.map(d => d.jurisdiction)
    cur_pos_juri = [...new Set(loc_juri)]
    
    UpdateJuriSelect(cur_pos_juri)

    cur_juri = cur_pos_juri.slice(0,n_rand_juri)

    let loc_sector =  cur_data
                        .filter(d => d[pricing] !== "NA")
                        .map(d => d.ipcc_code)
    cur_pos_sector = [... new Set(loc_sector)]

    UpdateSectorSelect(cur_pos_sector)

    cur_juri.length === 0 
          ? NoDataChart()
          : UpdateChart(sel_data, cur_juri)
}

/* Chart updates coming from sector selector */

function UpdateS(){

    let sector = $('#sector-selector').val()
    sector = sector === null ? undefined : sector.split(' ')[0]
    let p2dat = $('#pricing-selector').select2('data')
    let pricing = p2dat[0].prog_value

    let sel_data = cur_data.filter(
        d => (d.ipcc_code === sector
              & d[pricing] !== "NA"
            )
    )

    let loc_juri = sel_data.map(d => d.jurisdiction)
    cur_pos_juri = [...new Set(loc_juri)]
    
    UpdateJuriSelect(cur_pos_juri)

    cur_juri = cur_pos_juri.slice(0,n_rand_juri)

    cur_juri.length === 0 
      ? NoDataChart()
      : UpdateChart(sel_data, cur_juri)

    let checked = d3.selectAll('.juri-check')
                    .filter(function(){return this.checked})
    cur_numb_sel_juri = checked['_groups'][0].length
}

/* Chart updates coming from juri selector */

function UpdateJ(){
  if(cur_juri.length === 0){
    NoDataChart()
  } else {
    let sector = $('#sector-selector').val()
    sector = sector === null ? undefined : sector.split(' ')[0]
  
    let sel_data = cur_data.filter( d => (d.ipcc_code === sector & cur_juri.includes(d.jurisdiction) ) )
  
    let cur_juri_not_full_NA = sel_data.map(d => d.jurisdiction)
    cur_juri_not_full_NA = [... new Set(cur_juri_not_full_NA)]
    
    UpdateChart(sel_data, cur_juri_not_full_NA)
  }
}
