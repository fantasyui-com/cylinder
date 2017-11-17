
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();



new Vue({
  el: '#primary',

  data: {

    bpm: 300,

    grid:[

      [ {active:true }, {active:true }, {active:true },{active:true,sound:'click.wav' }, {active:true }, {active:true,sound:'click.wav' },{active:true }, {active:true }, {active:true },{active:true,sound:'click.wav' }, {active:true }, {active:true }, ],
      [ {active:true }, {active:true }, {active:true },{active:true }, {active:true }, {active:true },{active:true }, {active:true }, {active:true },{active:true }, {active:true }, {active:true }, ],
      [ {active:true }, {active:true }, {active:true },{active:true }, {active:true }, {active:true },{active:true }, {active:true }, {active:true,sound:'click.wav' },{active:true }, {active:true }, {active:true }, ],
      [ {active:true }, {active:true }, {active:true },{active:true }, {active:true, sound:'click.wav' }, {active:true },{active:true }, {active:true }, {active:true },{active:true }, {active:true }, {active:true }, ],
      [ {active:true }, {active:true }, {active:true },{active:true }, {active:true }, {active:true },{active:true }, {active:true }, {active:true },{active:true }, {active:true }, {active:true }, ],
      [ {active:true }, {active:true }, {active:true,sound:'click.wav' },{active:true }, {active:true }, {active:true },{active:true }, {active:true }, {active:true },{active:true,sound:'click.wav' }, {active:true }, {active:true }, ],
      [ {active:true,sound:'click.wav' }, {active:true }, {active:true },{active:true }, {active:true }, {active:true },{active:true }, {active:true }, {active:true },{active:true }, {active:true }, {active:true }, ],


    ]

  },

  created: function () {

    myEmitter.on('cell', function(coordinates){
      console.log('coordinates',coordinates)
    })

    for(let y = 1; y<this.grid.length;y++){
      for(let x = 0; x<this.grid[y].length;x++){
        this.grid[y][x].active = false;
      }
    }

    let y = this.grid.length-2;
    const payload = ()=>{
      console.log('TICK')
      y++;
      if(y>=this.grid.length) y = 0 ;

        for(let x = 0; x<this.grid[y].length;x++){
        console.log("/",y,x)
        if(this.grid[y][x].active ){

          let nextActiveColX = x;
          let nextActiveColY = y+1;
          if(nextActiveColY>=this.grid.length) nextActiveColY = 0;

          this.grid[y][x].active = false;
          this.grid[nextActiveColY][nextActiveColX].active = true;
          myEmitter.emit('cell', Object.assign({x:nextActiveColX, y:nextActiveColY},this.grid[nextActiveColY][nextActiveColX]));
        }
      }
    }
    setInterval(payload, (1000*60)/this.bpm);
    payload();

  },

  computed: {

    cellWidth:function(){return 100/this.grid[0].length},
    cellHeight:function(){return 100/this.grid.length},


  },

  methods: {

    cellClass:function(cell){
      if(cell.active&&cell.sound) return 'cell-active cell-sound';

      if(cell.active) return 'cell-active';
      if(cell.sound) return 'cell-sound';
      return 'bg';
    },



  }

})
