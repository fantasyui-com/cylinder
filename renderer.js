const path = require('path');
const byKey = require('natural-sort-by-key');

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();



new Vue({
  el: '#primary',

  data: {
    title:'',
    subtitle:'',

    filter: null,
    sorter: null,
    status: null,

    selectedItem: {},
    selectedAction: {},

    filters: [],
    sorters: [],
    actions: [],

    opened:{},

    db: [],
  },

  created: function () {
    this.unsort();
    this.deselect();
    this.update();
  },

  computed: {

    computedFilters: function () {
      return this.filters;
    },

    computedDatabase: function () {
      return this.sorter( this.db.filter( this.filter ) );
    },

  },

  methods: {

    filtersModal:  function (e) {
      $('#filtersModal').modal({})
    },

    play:function (e) {
      let app = this;

      if(!this.selectedAction.event){
        return myEmitter.emit('status', 'You must select an action to apply to items below...');
      }

      let jobs = Promise.resolve();
      this.computedDatabase.forEach(item => {
        jobs = jobs.then(i=>new Promise(function(resolve, reject) {
          let payload = Object.assign({app, item, resolve, reject},item,app.selectedAction.assign);
          myEmitter.emit(app.selectedAction.event, payload)
        }));

      });
      jobs.then(i=>{
        myEmitter.emit('status', 'Jobs Done...');
        this.deselectItem()
        this.deselectAction()
      })

    },

    toggle:  function (e) {
      console.log(e.name)
      if(this.opened[e.name] === undefined) return Vue.set(this.opened, e.name, true);
      if(this.opened[e.name] === true) return Vue.set(this.opened, e.name, false);
      if(this.opened[e.name] === false) return Vue.set(this.opened, e.name, true);





    },

    selectItem: function (e) {
      myEmitter.emit('status', `${e.name}`)
      this.selectedItem = e;
    },
    deselectItem: function (e) {
      myEmitter.emit('status', ``)
      this.selectedItem = {};
    },

    selectAction: function (e) {
      myEmitter.emit('status', `Selected ${e.name} Action, press play to apply it to the items below...`)
      this.selectedAction = e;
    },
    deselectAction: function (e) {
      this.selectedAction = {};
    },



    sort:  function (e) {
      this.sorter = e.sorter;
    },

    unsort:  function (e) {
      this.sorter = list => list.sort(byKey('name'));
    },



    select:  function (e) {
      this.filter = e.filter;
      this.title = e.name;
      myEmitter.emit('status', `Viewing ${this.title}`)
    },

    deselect:  function (e) {
      this.title = 'All Items';
      this.filter = i => true;
      myEmitter.emit('status', `Viewing ${this.title}`)

    },

    update:  function (e) {

      myEmitter.on('status', message => {
        this.status = message;
      });

      let dir = path.resolve('./sample-database');

        require(path.join(dir,'action.js')).forEach( i => this.actions.push(i) );
        require(path.join(dir,'sort.js')).forEach( i => this.sorters.push(i) );
        require(path.join(dir,'filter.js')).forEach( i => this.filters.push(i) );
        require(path.join(dir,'data.js')).forEach( i => this.db.push(i) );

        require(path.join(dir,'work.js'))({emitter:myEmitter})


        myEmitter.emit('status', 'System Ready...')
    },
  }

})
