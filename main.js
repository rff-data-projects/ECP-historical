/*  */
/* State variables and constants */
/*  */

/* State variables */

var cur_data = []         // current data for selected year
var cur_juri = []         // current select jurisdictions
var cur_pos_juri = []     // current selectable jurisdiction given sector, pricing, and year selected
var cur_pos_sector = []   // current selectable setors given pricing and year selected    
var cur_numb_sel_juri = 0 // current number of selected jurisdiction

/* Constants */ // Some constants are initialized later through one-time data-read

var countries = []
const max_n_juri = 15
const n_rand_juri = 5      

/*  */
/* Construct selectors */
/*  */

// Tooltip helpers
d3.selectAll('.helpIcon')
.on('mouseover', function(){
  $(this).attr('opacity', 0.75)
})
.on('mouseout', function(d){
  $(this).attr('opacity', 1)
})

/* Pricing */

$('#pricing-selector').select2({ 
    data: [{
            'id' : 0,
            'text' : 'Carbon Tax',
            'prog_value' : 'tax'
          },
          {
            'id' : 1,
            'text' : 'Cap and Trade',
            'prog_value' : 'ets'
          },
          {
            'id' : 2,
            'text' : 'Both',
            'prog_value' : 'both'
          }],
    minimumResultsForSearch: Infinity // hides searchbar
  })
  .css('border-color','blue')
  .on('select2:select', function(){

    let p2dat = $('#pricing-selector').select2('data')
    let pricing = p2dat[0].prog_value
    d3.csv('./data/ecp_' + pricing + '.csv').then(function(data){
      cur_data = data
      UpdatePY()
      cur_numb_sel_juri = Math.min(n_rand_juri, cur_pos_juri.length)
    })
  })

/* Sector */

d3.csv('./data/IPCC2006-IEA-category-codes.csv').then(function(data){

  let container = $('#sector-selector')

        const levels = ['Energy', 
                        'Industrial Processes and Product Use',
                        'Agriculture, Forestry and Other Land Use',
                        'Waste',
                        'Other']

       levels.forEach(function(d,i){
            
            var cur_lowest_levels = data.filter(d => (
                                d.lowest_level === "1" &  d.IPCC_CODE.startsWith(i+1)
                                ))
            
            container
              .append($('<optgroup>')
              .attr('label', d)
              )

            cur_lowest_levels.forEach(function(c){
              container
                  .append($('<option>')
                  .attr('data-ipcc_code', c.IPCC_CODE)
                  .text(c.IPCC_CODE + " " +  c.FULLNAME)
                  )
            })
        })
})

  $('#sector-selector')
  .select2({searchInputPlaceholder: 'Search sectors'}) /* https://stackoverflow.com/questions/45819164/how-make-select2-placeholder-for-search-input */
  .on('select2:select', function(){
    UpdateS()
    cur_numb_sel_juri = Math.min(n_rand_juri, cur_pos_juri.length)
  })

/* Jurisdictions */
  
d3.csv('./data/active_juri.csv').then(function(data){

  countries = data

  var arr = countries
              .map(function(d,i){return ({val: i, text: d.jurisdiction})})
              .sort((a, b) => a.text.localeCompare(b.text))

  var sel = $('.list')

  $(arr).each(function(){createListItem(this, sel)});

  var options = {
    valueNames: ['search_name']
  };

  new List('juri-select', options);

})

$('#select_all').click(function(){
  cur_juri = getRandom(cur_pos_juri, Math.min(n_rand_juri, cur_pos_juri.length))

    $('.juri_list_item').each(function(){ // Update juri selection menu
      let item = $(this)
      let latem = $('#'+'la_'+ item.attr('common_id'))
      let intem = $('#'+'in_'+ item.attr('common_id'))
  
      cur_pos_juri.includes(item.attr('data-juri')) 
        ? cur_juri.includes(item.attr('data-juri')) 
          ? Enable_item(item, intem, latem)
          : Enable_item_unchecked(item, intem, latem)
        : Disable_item(item, intem, latem)
    })  
    UpdateJ()
    cur_numb_sel_juri =  cur_juri.length                        
  });

$('#clear_all').click(function(){
    $(".juri-check").each(function(){
        $(this).removeAttr("checked");
    })  
    cur_juri = []
    cur_numb_sel_juri = 0
    UpdateJ()
});

/*  */
/* Initialize Chart and Selectors */
/*  */

let p2dat = $('#pricing-selector').select2('data')
let pricing = p2dat[0].prog_value

d3.csv('./data/ecp_' + pricing + '.csv').then(function(data){
  
  cur_data = data
  let sector = $('#sector-selector').val()
  sector = sector === null ? undefined : sector.split(' ')[0]

  UpdateS()
  UpdatePY()
})

