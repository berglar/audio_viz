function SpectrumAnalyzerView(model, selector) {
  this.model = model;
  this.selector = selector;
  this.height = 1024;
  this.width = 500;
  this.elementHeight = (document.getElementsByTagName("div")["spectrum_analyzer"].offsetHeight - 2);
  this.elementWidth = (document.getElementsByTagName("div")["spectrum_analyzer"].offsetWidth - 2);

  this.n_count = 0;
  this.prev_amp = [];
    


  this.initialize();
}

SpectrumAnalyzerView.prototype.initialize = function() {
  this._x = d3.scale.linear() //time
    .domain([0, this.width])
  //  .domain([-6, -85]) //-6 to -85
    .rangeRound([0, this.width]);
/*
  this._y = d3.scale.linear()
    .domain([20, 20000]) //freq 20 - 20k
    .rangeRound([0, this.height]);
*/

    //color maps to amplitude?
  this.color = d3.scale.linear()
    .domain([0, 200])
    .range(["#efefef", "black"]);
  this.amplitude = d3.scale.linear()
    .domain([0,10])
    .range([0,500]);
  this.spectro = d3.scale.linear()
    .domain([0, 100])
    .range(["white", "black"]);
  this.createChart();
  this.initializeChart();
};

SpectrumAnalyzerView.prototype._y = function(n) {
  return d3.scale.linear()
    .domain([0, 1]) 
    .range([0, this.barHeight()])(n);
};

SpectrumAnalyzerView.prototype.barHeight = function() {
  var dataLength = Math.min(this.model.length(), (this.model.data.length || this.model.getInitialData().length));

  return this.elementHeight / dataLength;
};


SpectrumAnalyzerView.prototype.createChart = function() {
  var data = this.model.getInitialData();

  this.chart = d3.select(this.selector).append("svg")
    .attr("class", "chart")
    .attr("height", this.barHeight() * data.length)
    .attr("width", 500);//this.elementWidth); //this.elementWidth);//500

  this.freq_viz = this.chart.append("svg:g")
    .attr("transform", "translate(-498, 24), rotate(-180, 500, 500)")
    .attr("transform", "translate(-498, 24), rotate(-180, 500, 500)")
//    .attr("height", this.elementHeight)//this.elementHeight)//this.barHeight() * data.length)
  //  .attr("width", 500)//this.elementWidth)//500
    .attr("class", "freq_viz");
    
};

SpectrumAnalyzerView.prototype.reset = function() {
    this.reset_counter ++;
    console.log('reset_counter is ' + this.reset_counter);
  d3.select("svg").remove(); 
  this.createChart();
  this.initializeChart();
};

SpectrumAnalyzerView.prototype.initializeChart = function() {
  var view = this;
  var data = this.model.getInitialData();


  this.freq_viz.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("fill", "#FF0000")
    .attr("y", function(i) { return view._y(i) - 0.5; })
    .attr("x", function(d, i) {return (view.width-view._x(d) - 0.5); })
    .attr("height", this.barHeight())
    .attr("width", function(d) { return 0; } );

/*
   var rectangle = this.chart.selectAll("rect")
    .data(data)
    rectangle.enter().append("pixel")
    .attr("fill", "#FFF")
    .attr("y", function(i) { return view.height - view._y(i) - 1.0; })
    .attr("x", function(d, i) {return (view._x(d) - 1.0); })
    .attr("height", this.barHeight())
    .attr("width", this.barHeight())
    .attr("n", 0);
*/

};

SpectrumAnalyzerView.prototype.update = function() {
  var view = this;
  var data = this.model.data;
  var all_amps = [];

    if (this.prev_amp[0] != null){
        for (var i=0; i<this.prev_amp[this.prev_amp.length-1]; i++){
/*
            var amp = this.prev_amp[this.prev_amp.length-1][i]
            .attr("fill", function(){ return (amp*this.spectro); })
            .attr("x", function(d) {view.width - view._x})
            .attr("y", function(d, i) { return (view.height - view._y(i)); })
            .attr("width", (this.barHeight()*2))
            .attr("height", this.barHeight());
*/
        }
    }
  


    this.n_count += 1;  


    //spectrogram stuffs

    this.freq_viz.selectAll("rect")
    .data(data)
    .attr("fill", function(d) { return view.color(d); })
    .attr("y", function(d, i) { return view._y(i); }) //puts low freq last
    .attr("x", function(d) {return ((view.width-view._x(d))); })//d
    .attr("height", this.barHeight())
    .attr("width", function(d) { 
        //view.barHeight();
        //return all_amps.push(view.amplitude(d));
//        return 1024;
        return view.amplitude(d); 
    });

  this.enqueueNextUpdate()
 
    //add new pixels
    
    if (!this.prev_amp[0]){
        this.prev_amp[0] = all_amps;
    }

    else{
        this.prev_amp[(this.prev_amp.length)-1] = all_amps;
    }

    
    

 
}

SpectrumAnalyzerView.prototype.enqueueNextUpdate = function() {
  var view = this;
  timeout = setTimeout(function() { view.update() }, 50);//50);
  return timeout;
}
