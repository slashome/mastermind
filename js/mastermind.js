var mm = {
	nbCol: 4,
    nbColor: 6,
    rows: 10,
    secretCode: [],
    colors: [],

    /**
     * Run mastermind
     */
    run: function ()
    {
        this.generateColors();
        this.generateSecret();
        console.log(this.secretCode);
        $('mastermind').html(this.buildTable());
    },

    /**
     * Build the mastermind table
     */
    buildTable: function()
    {
        var table = $('<div></div>');
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
        for (var i = 0; i < this.nbCol; i++) {
            var colorIndex = Math.floor(Math.random() * this.nbColor);
            this.secretCode.push(colorIndex);
        }
    },

    buildRow: function(tableId)
    {
        var row = $('<div data-tableId="'+tableId+'"></div>');
        row.css({clear:'both'});
        for (var i = 0; i < this.nbCol; i++) {
            row.append(this.buildPawn(i));
        }
        return row;
    },

    /**
     * Create the array of colors
     */
    generateColors: function ()
    {
        for (var i = 0; i < this.nbColor; i++) {
            this.colors.push(this.getRandomColor());
        }
    },

    buildPawn: function(rowId)
    {
        var pawn = $('<div class="pawn">x</div>');
        pawn.css({float:'left'});
        return pawn.css({backgroundColor:this.getRandomColor()})
    }
}

mm.run();