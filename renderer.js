
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();



new Vue({
  el: '#primary',

  data: {

    bpm: 256,

    sounds: {

      silence: { sound:'', icon:'' },
      slam: { sound:'slam.wav', icon:'heart' },
      crunch: { sound:'crunch.wav', icon:'th' },

    },

    grid:[

      [ {active:true }, {active:true }, {active:true },{active:true,sound:'slam' }, {active:true }, {active:true,sound:'crunch' },{active:true }, {active:true }, {active:true },{active:true,sound:'crunch' }, {active:true }, {active:true }, ],

      [ {active:false }, {active:false }, {active:false },{active:false,sound:'slam' }, {active:false }, {active:false,sound:'crunch' },{active:false }, {active:false }, {active:false },{active:false,sound:'crunch' }, {active:false }, {active:false }, ],
      [ {active:false }, {active:false }, {active:false },{active:false }, {active:false }, {active:false },{active:false }, {active:false }, {active:false },{active:false }, {active:false }, {active:false }, ],
      [ {active:false }, {active:false }, {active:false },{active:false }, {active:false }, {active:false },{active:false }, {active:false }, {active:false,sound:'crunch' },{active:false }, {active:false }, {active:false }, ],
      [ {active:false }, {active:false }, {active:false },{active:false }, {active:false }, {active:false },{active:false }, {active:false }, {active:false,sound:'crunch' },{active:false }, {active:false }, {active:false }, ],
      [ {active:false }, {active:false }, {active:false },{active:false }, {active:false }, {active:false },{active:false }, {active:false }, {active:false,sound:'crunch' },{active:false }, {active:false }, {active:false }, ],



    ]

  },

  created: function () {

    myEmitter.on('cell', (coordinates) => {
      //console.log('coordinates',coordinates);

      if(coordinates.sound){

        let soundData =  this.sounds[ coordinates.sound ];

        var sound = new Howl({
          src: [soundData.sound]
        });

      sound.play();
      }

    })

    for(let y = 1; y<this.grid.length;y++){
      for(let x = 0; x<this.grid[y].length;x++){
        this.grid[y][x].active = false;
      }
    }

    let y = this.grid.length-2;
    const payload = ()=>{
      //console.log('TICK')
      y++;
      if(y>=this.grid.length) y = 0 ;

        for(let x = 0; x<this.grid[y].length;x++){
        //console.log("/",y,x)
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

    nextSound:function(cell){

      let soundIndex = -2;

      if( cell.sound ) {
        // cell has a sounds
        soundIndex = Object.keys(this.sounds).indexOf(cell.sound);
      }

      soundIndex++;

      if(soundIndex < 0){
        soundIndex = 1;
      }


      if(soundIndex > Object.keys(this.sounds).length-1) {
        soundIndex = 0;
      }

      cell.sound =  Object.keys(this.sounds)[soundIndex];
      if ( cell.sound === 'silence') delete cell.sound
      console.log(soundIndex,cell.sound)
      //if (cell.sound) return this.sounds[cell.sound].icon;

    },

    cellIcon:function(cell){
      if (cell.sound) return this.sounds[cell.sound].icon;

    },
    cellClass:function(cell){
      if(cell.active&&cell.sound) return 'cell-active cell-sound';

      if(cell.active) return 'cell-active';
      if(cell.sound) return 'cell-sound';
      return 'bg';
    },



  }

})
