var mm = {
	pawnCount: 4,

    /**
     * Run mastermind
     */
    run: function ()
    {
        $('mastermind').html(this.getPawn());

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

    getPawn: function()
    {
        var pawn = $('<div>toto</div>');
        return pawn.css({backgroundColor:this.getRandomColor()})
    }
}

mm.run();