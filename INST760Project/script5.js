
var popView = false;
var mf_square_count = 0,
    tf_square_count = 0,
    mt_square_count = 0,
    nf_square_count = 0,
    mf_square_count_pop = 0,
    tf_square_count_pop = 0,
    mt_square_count_pop = 0,
    nf_square_count_pop = 0;
var data_count = 0;

var toggleSwitch = function(){
    
    mf_square_count = 0,
    tf_square_count = 0,
    mt_square_count = 0,
    nf_square_count = 0;
    data_count = 0;
    mf_square_count_pop = 0,
    tf_square_count_pop = 0,
    mt_square_count_pop = 0,
    nf_square_count_pop = 0;

    popView = document.getElementById("popularityView").checked;
    
    return popView;
}

var dataset = []





    var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);


var square = 11,
  w = 900,
  h = 370;
d3.csv("all.csv", function(data) {
   dataset = data.map(function(d) { return [ +d["account_id"], +d["post_id"], d["Category"], d["Page"], d["Post URL"], d["Date Published"], d["Post Type"], d["Rating"], d["Debate"] , +d["share_count"], +d["reaction_count"], +d["comment_count"] ]; });

    
var getPageLogo = function(pageName){
    if(pageName == "ABC News Politics"){
        return "abc.jpg";
       }
    else if(pageName == "Addicting Info"){
        return "addicting.jpg";
       }
    else if(pageName == "CNN Politics"){
        return "cnn-logo.png";
       }
    else if(pageName == "Eagle Rising"){
        return "eagle.png";
       }
    else if(pageName == "Freedom Daily"){
        return "freedom.png";
       }
    else if(pageName == "Occupy Democrats"){
        return "occupy.png";
       }
    else if(pageName == "Politico"){
        return "politico.png";
       }
    else if(pageName == "Right Wing News"){
        return "rightwing.jpg";
       }
    else if(pageName == "The Other 98%"){
        return "other.png";
       }
    
}
//======================================================================================
var popRatings = [];
    
for (var i = 0; i < dataset.length; i++){
    
    popRatings.push((dataset[i][9])*1.5 + dataset[i][10] + dataset[i][11]);
}

popRatings = popRatings.sort(function(a, b){return b-a});
    
var topTwenty = popRatings.slice(0, (0.15*dataset.length)-1);    
//======================================================================================
    
var counter = 0;
// create the svg
var svg = d3.select('#grid').append('svg')
  .attr({
    width: w,
    height: h
  });

// calculate number of rows and columns
var squaresRow = 80;
var squaresColumn =32;

var getLink = function(data){
     
    return data[4];
}
    
var ratingColor = function(rating, share_count, reaction_count, comment_count){
    
    if(popView){
        if(topTwenty[(topTwenty.length) - 1] < ((share_count)*1.5 + reaction_count + comment_count)){
            if(rating === "mostly false"){
                mf_square_count_pop = mf_square_count_pop + 1;
            return 'red';
            }
            else if(rating === "mostly true"){
                mt_square_count_pop = mt_square_count_pop + 1;
                return 'green';
            }

            else if(rating === "mixture of true and false"){
                tf_square_count_pop = tf_square_count_pop + 1;
                return 'grey';       
            }

            else if(rating === "no factual content"){
                nf_square_count_pop = nf_square_count_pop  + 1;
                return 'black';
            }
            
        }
        else if(rating == ""){
            data_count = data_count + 1;
            return 'white';
        }
        else{
            return '#eee';
        }
    }
    if(!popView){
        
    
        if(rating === "mostly false"){
            mf_square_count = mf_square_count + 1;
            return 'red';
        }
        else if(rating === "mostly true"){
            mt_square_count = mt_square_count + 1;
            return 'green';
        }

        else if(rating === "mixture of true and false"){
            tf_square_count = tf_square_count  + 1;
            return 'grey';       
        }

        else if(rating === "no factual content"){
            nf_square_count = nf_square_count  + 1;
            return 'black';
        }
        else{
                
            return 'white';
        }
        
    }
}

var k= 0;
// loop over number of columns
_.times(squaresColumn, function(n) {

   var dataSlice = dataset.slice(k, k+squaresRow-1);
    k = k + squaresRow - 1;
  // create each set of rows
  var rows = svg.selectAll('rect' + ' .row-' + (n + 1))
    .data(dataSlice)
    .enter()
  .append('a')
    .attr("target", "_blank")
    .attr("xlink:href", function(d){ return getLink(d); })
  .append('rect')
    .attr({
      class: function(d, i) {
        return 'square row-' + (n + 1) + ' ' + 'col-' + (i + 1);
      },
      id: function(d, i) {
        return 's-' + (n + 1) + (i + 1);
      },
      width: square,
      height: square,
      x: function(d, i) {
        return i * square;
      },
      y: n * square,
      fill: function(d){ return ratingColor(d[7],d[9],d[10],d[11]); },
      stroke: 'white',
    });
    


    // test with some feedback
    var test = rows.on('mouseover', function (d, i) {

        
    d3.select('#shares').text(function () {
        return  'Number of shares: ' + d[9]; });
        
         d3.select('#reactions').text(function () {
        return  'Total reactions: ' + d[10]; });
        
         d3.select('#comments').text(function () {
        return  'Total comments: ' + d[11]; });
        
      d3.selectAll('.square').attr('fill', function(d){ return ratingColor(d[7],d[9],d[10],d[11]); });
      d3.select(this).attr('fill', 'blue');
      document.getElementById("pageLogo").src= getPageLogo(d[3]);
    

    });
    
    d3.select("#popularityView").on("change", function(){
        
        var pop = toggleSwitch();
        d3.selectAll('.square').attr('fill', function(d){ return ratingColor(d[7],d[9],d[10],d[11]); });
        
        
        d3.select("#mf_square_count").text(Math.round((mf_square_count/dataset.length - data_count)*100) + "%");
        d3.select("#tf_square_count").text(Math.round((tf_square_count/dataset.length - data_count)*100) + "%");
        d3.select("#mt_square_count").text(Math.round((mt_square_count/dataset.length - data_count)*100) + "%");
        d3.select("#nf_square_count").text(Math.round((nf_square_count/dataset.length - data_count)*100) + "%");
        if(pop){
        
        d3.select("#mf_square_count").text(Math.round((mf_square_count_pop/topTwenty.length)*100) + "%");
        d3.select("#tf_square_count").text(Math.round((tf_square_count_pop/topTwenty.length)*100) + "%");
        d3.select("#mt_square_count").text(Math.round((mt_square_count_pop/topTwenty.length)*100) + "%");
        d3.select("#nf_square_count").text(Math.round((nf_square_count_pop/topTwenty.length)*100) + "%");
        }
        
    });

});
    

        d3.select("#mf_square_count").text(Math.round((mf_square_count/dataset.length - data_count)*100) + "%");
        d3.select("#tf_square_count").text(Math.round((tf_square_count/dataset.length - data_count)*100) + "%");
        d3.select("#mt_square_count").text(Math.round((mt_square_count/dataset.length - data_count)*100) + "%");
        d3.select("#nf_square_count").text(Math.round((nf_square_count/dataset.length - data_count)*100) + "%");
});

