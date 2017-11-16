module.exports = function({ emitter }) {



  emitter.on('example', function({app, item, name, resolve, reject }) {

    // make an indication that you are working on this item
    app.selectItem(item);

    // in this example we uppercase the name of the item...
    item.name = item.name.toUpperCase();

    setTimeout(function(){
      console.log( 'Working on %s.', name );
      // When the thing is done, call resolve...
      resolve();
    },200);


  });




}
