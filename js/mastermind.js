var mm = {

    // Number of columns
    nbColumns: 4,

    // Number of possible colors
    nbColors: 6,

    // Number of possible tries
    nbRows: 10,

    // DeepMind selected code
    secretCode: [],

    // Player's choice
    input: [],

    // List of available colors
    colors: [],

    // Can be dev or prod
    env: 'dev',

    currentRow: 0,

    /**
     * Run mastermind
     */
    run: function ()
    {
        this.generateColors();
        this.generateSecret();
        $('body').prepend($('<div class="title">Can you break the code ?<div>'));
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
        for (var i = 0; i < this.nbRows; i++) {
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

    /**
     * Generate the secrete code
     */
    generateSecret: function()
    {
        for (var i = 0; i < this.nbColumns; i++) {
            var colorIndex = Math.floor(Math.random() * this.nbColors);
            this.secretCode.push(colorIndex);
        }

        console.log(this.secretCode);

        if (this.env == 'dev') {
            var _this = this;
            var secret = $('<div style="float:left">Secret code :</div>');
            this.secretCode.forEach(function(i, id){
                var pawn = _this.buildPawn();
                pawn.css({backgroundColor:_this.colors[i]});
                secret.append(pawn);
            })
            for (var i = 0; i < this.secretCode; i++) {
            }
            $('body').prepend(secret);
        }
    },

    /**
     * Build a row of the tries table
     *
     * @param tableId
     * @returns {jQuery|HTMLElement}
     */
    buildRow: function(rowId)
    {
        var row = $('<div class="row"></div>');
        for (var i = 0; i < this.nbColumns; i++) {
            row.addClass('row-'+rowId);
            row.append(this.buildPawn(i));
        }
        return row;
    },

    /**
     * Build the input
     *
     * @param tableId
     * @returns {jQuery|HTMLElement}
     */
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

    /**
     * Set the actions of a pawn input
     *
     * @param inputPawn
     * @returns {*}
     */
    setInputPawnActions: function(inputPawn)
    {
        var _this = this;
        inputPawn.click(function(){
            _this.triggerSelector(inputPawn);
        });
        return inputPawn;
    },

    /**
     * Show the color selector
     *
     * @param inputPawn
     */
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
                inputPawn.data('colorId', colorId);
                $('.selector').remove();
                var isInputComplete = _this.isInputComplete();
                if (isInputComplete) {
                    _this.computeResult();
                }
            });
            selector.append(pawn);
        }
        $('body').append(selector);
    },

    /**
     * Is the input is ready to be computed
     *
     * @returns {boolean}
     */
    isInputComplete: function()
    {
        selectedCount = 0;
        $('.input .pawn').each(function(){
            if ($(this).data('colorId') !== undefined) {
                selectedCount++;
            }
        });
        return (selectedCount === this.nbColumns);
    },

    /**
     * Compare the input to the secret
      */
    computeResult: function()
    {
        var _this = this;
        var inputSelection = [];
        var numberOfEqual  = 0;
        var numberOfAlmost = 0;
        $('.input .pawn').each(function(){
            inputSelection.push($(this).data('colorId'));
        });

        var newInputSelection = [];
        var newSecretCode = [];

        // search fpr equal results
        inputSelection.forEach(function(inputColorId, i){
            var added = false;
            _this.secretCode.forEach(function(secretColorId, j){
                if (i === j && inputColorId === secretColorId) {
                    // increment equal results
                    numberOfEqual++;
                } else if (i == j) {
                    newInputSelection.push(inputColorId);
                    newSecretCode.push(secretColorId);
                }
            });
        });

        newInputSelection.forEach(function(inputColorId, i){
            var finded = false;
            newSecretCode.forEach(function(secretColorId, j){
                if (inputColorId === secretColorId && !finded) {
                    numberOfAlmost++;
                    finded = true;
                }
            });
        });

        if (numberOfEqual === _this.nbColumns) {
            this.youWin();
        } else {
            this.showResults(inputSelection, numberOfEqual, numberOfAlmost);
        }
    },

    youWin: function()
    {
        $('body').html('You broke the code, you hacker !');
    },

    youLoose: function()
    {
        $('body').html('You loose, I\'m unbreakable !');
    },

    showResults: function(input, numberOfEqual, numberOfAlmost)
    {
        if (this.currentRow === this.nbRows) {
            this.youLoose();
        }

        input.forEach(function(colorId, i){

        });

        var row = $('.row-'+this.currentRow);
        var result = $('<div class="result"></div>');

        for (var i = 0; i < numberOfEqual; i++) {
            result.append($('<div class="point black"></div>'));
        };
        for (var i = 0; i < numberOfAlmost; i++) {
            console.log('pouet');
            result.append($('<div class="point white"></div>'));
        };

        row.append(result);

        this.currentRow++;
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

    /**
     * Simply build a pawn
     *
     * @returns {jQuery|HTMLElement}
     */
    buildPawn: function()
    {
        var pawn = $('<div class="pawn"></div>');
        return pawn;
    }
}

mm.run();