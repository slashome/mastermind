var mm = {

    // Number of columns
    nbColumns: 4,

    // Number of possible colors
    nbColors: 6,

    // Number of possible tries
    rows: 10,

    // DeepMind selected code
    secretCode: [],

    // Player's choice
    input: [],

    // List of available colors
    colors: [],

    // Can be dev or prod
    env: 'dev',

    /**
     * Run mastermind
     */
    run: function ()
    {
        this.generateColors();
        this.generateSecret();
        var container = $('<div id="container"></div>');
        container.html(this.buildTable());
        container.append(this.buildInput());
        $('mastermind').html(container);
    },

    /**
     * Build the mastermind table
     */
    buildTable: function()
    {
        var table = $('<div id="table"></div>');
        for (var i = 0; i < this.rows; i++) {
            table.append(this.buildRow(i));
        }
        return table;
    },

    /**
     * Get a random HTML color
     */
    getRandomColor: function ()
    {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    generateSecret: function()
    {
        for (var i = 0; i < this.nbColumns; i++) {
            var colorIndex = Math.floor(Math.random() * this.nbColors);
            this.secretCode.push(colorIndex);
        }

        console.log(this.secretCode);

        if (this.env == 'dev') {
            var _this = this;
            var secret = $('<div>Secret code :</div>');
            this.secretCode.forEach(function(i, id){
                console.log(i);
                var pawn = _this.buildPawn();
                pawn.css({backgroundColor:_this.colors[i]});
                secret.append(pawn);
            })
            for (var i = 0; i < this.secretCode; i++) {
            }
            $('body').prepend(secret);
        }
    },

    buildRow: function(tableId)
    {
        var row = $('<div class="row" data-tableId="'+tableId+'"></div>');
        var essaiId = tableId + 1;
        row.append('Essai '+ essaiId);
        for (var i = 0; i < this.nbColumns; i++) {
            row.append(this.buildPawn(i));
        }
        return row;
    },

    buildInput: function(tableId)
    {
        var _this = this;
        var input = $('<div class="input"><div>Try to break the code !</div></div>');
        for (var i = 0; i < this.nbColumns; i++) {
            var inputPawn = this.setInputPawnActions(this.buildPawn());
            input.append(inputPawn);
        }
        return input;
    },

    setInputPawnActions: function(inputPawn)
    {
        var _this = this;
        inputPawn.click(function(){
            _this.triggerSelector(inputPawn);
        });
        return inputPawn;
    },

    triggerSelector: function(inputPawn)
    {
        var _this = this;
        var selector = $('<div class="selector"></div>');
        for (var i = 0; i < this.nbColors; i++) {
            var pawn = this.buildPawn();
            pawn.css({backgroundColor:this.colors[i]});
            pawn.data('colorId', i);
            pawn.click(function(){
                var colorId = $(this).data('colorId');
                inputPawn.css({backgroundColor:_this.colors[colorId]});
                $('.selector').remove();
            });
            selector.append(pawn);
        }
        $('body').append(selector);
    },

    /**
     * Create the array of colors
     */
    generateColors: function ()
    {
        for (var i = 0; i < this.nbColors; i++) {
            this.colors.push(this.getRandomColor());
        }
    },

    buildPawn: function(rowId)
    {
        var pawn = $('<div class="pawn"></div>');
        return pawn;
    }
}

mm.run();
