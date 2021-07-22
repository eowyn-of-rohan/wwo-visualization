/*Not entirely sure what's happening here, except that we're creating a variable 'dispatch' and assigning stuff to it.
I'm assuming (for the moment) that this is setup stuff I can ignore?? */
var dispatch = d3.dispatch("dataLoaded",
  "highlight", "highlightgenre", "highlighttype", "unhighlight");

//Create global variable meta, which is undefined for now.
var meta;

//This executes the function drawNetwork, which is defined in line 12.
drawNetwork();

/* Now we are defining the function drawNetwork() to do whatever is in the curly brackets. 
The rest of this code is defining the function drawNetwork, which we have run above.*/
function drawNetwork() {
  /* call the json file with d3.json- this is a promise that only happens with the callback
  of data from the function -- I think, need to read more. */
  d3.json('intertextual-gestures-mme.json').then( function(data) {
    /* Create Map of distinct genre values with the bibliography IDs and MME 
       gestures to which they map. (This comment is original) */
    var totalExcerpts = 0,
        genreGrp = new Map(),
        qTypes = new Map();
      /* new Map() creates a directory where objects can be assigned to values. 
      So genreGrp is a Map and qTypes is a Map, and both can contain a set of linked datapoints - a key, 
      and then other data linked to that specific key. */
    
    meta = data;
    meta['genres'] = new Map();
    meta['gestures'].forEach( function(gesture) {
      var myGenres = [],
          sources = gesture.sources,
          types = gesture.type;
      // Build out map of reference types. (Original comment)
      types.forEach( function(typeStr) {
        var qTypeEntry = qTypes.get(typeStr) || [];
        qTypeEntry.push(gesture);
        qTypes.set(typeStr, qTypeEntry);
      });
      // Build out map of broad genres. (Original comment)
      sources.forEach( function(src) {
        var genreGestures,
            mainGenre = src['genreBroad'];
        mainGenre = mainGenre === null ? 'unknown' : mainGenre;
        genreGestures = meta['genres'].get(mainGenre);
        // Once and once only, map this gesture to this genre. (Original comment)
        if ( !myGenres.includes(mainGenre) ) {
          // Make sure this genre exists before adding the gesture. (Original comment)
          if ( genreGestures === undefined ) {
            genreGestures = meta['genres']
                .set(mainGenre, [])
              .get(mainGenre);
          }
          genreGestures.push(gesture);
          myGenres.push(mainGenre);
        }
      });
      gesture.id = totalExcerpts;
      totalExcerpts++;
    });
    meta['types'] = qTypes;
    console.log(meta);
    
    dispatch.call("dataLoaded", null, meta);
  });
};
//This seems to be setting up the interactive portion of the visualization.
function allowMouseover() {
  var selection = d3.select('.selected.clicked'),
      userAllowed = d3.select('#mouseover-control').property('checked');
  return userAllowed && selection.empty();
};
