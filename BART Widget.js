// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: subway;
// if you have a personal API key, add it here!
// It is totally optional
// Otherwise, this will use the shared key published by BART.
let api = ""

// shared API key from BART:
// If this stops working, check for a new shared key on:
// https://www.bart.gov/schedules/developers/api
const shared_api = "MW9S-E7SL-26DU-VV8V";

// What station are you at?
// https://api.bart.gov/docs/overview/abbrev.aspx
let start_station = "MCAR";

// Which way are you going? use "n or "s"
let dir = "s";

// which train lines should be shown?
//let allowed_lines=[,"RED","ORANGE","YELLOW","GREEN","BLUE","BEIGE"];
let allowed_lines=[,"RED","ORANGE","YELLOW","GREEN","BLUE","BEIGE"];

// what is the max number of trains to show?
// small widgets may show less than this number
let num_trains = 4;

// parse params from the widget config, and prioritize those if supplied.
// format: [station ID],[direction]
// example: FRMT,s
// example: ASHB,n
if(args.widgetParameter!=null){
  const params = args.widgetParameter.split(",");
  start_station=params[0];
  dir=params[1];
  if((dir != "s")&&(dir!="n")){
    logError("Invalid direction param");
  }
}

// for the lock screen, limit to 3 trains.
// possible sizes are:
// small, medium, large, extraLarge, accessoryRectangular, accessoryInline, accessoryCircular
if(config.widgetFamily=="accessoryRectangular"){
  num_trains=Math.min(num_trains,3);
}

//check if personal API has been added, and use that preferentially
if(api==""){
  api=shared_api;
}

// URL request
let url = `https://api.bart.gov/api/etd.aspx?cmd=etd&json=y&orig=${start_station}&dir=${dir}&key=${api}`;

// make the request, save json
let req = new Request(url);
req.method = "post";
let data = await req.loadJSON();

//make sure we get departures from only 1 station
if(data.root.station.length != 1){
  logError(`Expected a single station, got ${data.root.station.length}`)
}

//confirm if the station is correct
if(start_station != data.root.station[0].abbr){
  logError("Data for wrong station");
  logError(`Expected station: ${start_station}`);
  logError(`Returned station: ${data.root.station[0].abbr}`);
}

//from here on, we'll be only be using the etd portion.
const etd = data.root.station[0].etd;
const start_station_full = data.root.station[0].name;
log(etd)

// a class to store the info we care about for each train
class Train{
  constructor(dest, minutes, color, hexcolor){
    this.dest = dest;
    this.departure = parseInt(minutes);
    this.color = color;
    this.hex = hexcolor;
  }
  toString(){
    return `${this.departure} min to ${this.dest}`;
  }
}

//array to store the trains
let trains=Array();

for(let dest = 0; dest<etd.length; dest++){
  for(let i = 0; i<etd[dest].estimate.length; i++){
    //skip any canceled trains
    if(etd[dest].estimate[i].cancelflag==1){
      log("Skipped canceled train")
      continue;
    }
    if(!allowed_lines.includes(etd[dest].estimate[i].color)){
      log(etd[dest].estimate[i]);
      continue;
    }
    const destination = etd[dest].destination;
    const departure = etd[dest].estimate[i].minutes;
    const color = etd[dest].estimate[i].color;
    const hexcolor = etd[dest].estimate[i].hexcolor;
    trains.push(new Train(destination, departure, color, hexcolor));
  }
}

// order trains by departure time, not line
trains.sort((a, b)=>a.departure>b.departure);



// configure the widget

let widget = new ListWidget();
let mainCol = widget.addStack();
mainCol.layoutVertically();
let row = mainCol.addStack();
row.layoutHorizontally();
var title=row.addText(`${dir}:  ${start_station_full}`);
title.font = Font.boldSystemFont(22);
for(i=0; i<Math.min(trains.length, num_trains); i++){
  let row = mainCol.addStack();
  row.layoutHorizontally();
  var text = row.addText(trains[i].toString());
  text.textColor = new Color(trains[i].hex);
}



Script.setWidget(widget);