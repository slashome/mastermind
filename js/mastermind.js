var mm = {

    // Number of columns
    nbColumns: 4,

    // Number of possible colors
    nbColors: 6,

    // Number of possible tries
    nbRows: 12,

    // DeepMind selected code
    secretCode: [],

    // Player's choice
    input: [],

    // List of selected colors
    colors: [],

    // List of available colors
    availableColors: ['yellow','blue','red','green','white','black','purple','pink','orange','cyan','gray','brown','violet'],

    // Can be dev or prod
    env: 'prod',

    currentRow: 0,

    gameover: false,

    /**
     * Run mastermind
     */
    run: function ()
    {
        if (this.nbColors > this.availableColors.length) {
            $('body').append('');
        }

        this.getColors();
        this.generateSecret();
        $('body').prepend($('<div class="title">MasterMind</div><div class="subtitle">Can you break the code ?</div>'));
        var container = $('<div id="container"></div>');
        container.html(this.buildTable());
        container.append(this.buildInput());
        container.prepend(this.buildSecret());
        $('mastermind').html(container);
    },

    /**
     * Build the mastermind table
     */
    buildTable: function()
    {
        var table = $('<div id="table"></div>');
        for (var i = 0; i < this.nbRows; i++) {
            table.prepend(this.buildRow(i));
        }
        return table;
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
    },

    /**
     * Create the secret box that will reveal the code at the end
     *
     * @returns {jQuery|HTMLElement}
     */
    buildSecret: function()
    {
        var _this = this;
        var secret = $('<div class="secret clearfix"><div class="mask">secret code</div></div>');
        this.secretCode.forEach(function(i, id){
            var pawn = _this.buildPawn();
            pawn.css({backgroundColor:_this.colors[i]});
            secret.append(pawn);
        });
        if (this.env === 'dev') {
            secret.click(function(){
                _this.revealSecret();
            });
        }
        return secret;
    },

    /**
     * The action that reveal the secret code
     */
    revealSecret: function()
    {
        $('.secret .mask').animate({
            bottom: 36,
            paddingTop: 0
        }, 400, function(){
            $(this).remove();
        });
    },

    /**
     * Build a row of the tries table
     *
     * @param tableId
     * @returns {jQuery|HTMLElement}
     */
    buildRow: function(rowId)
    {
        var row = $('<div class="row clearfix"></div>');
        for (var i = 0; i < this.nbColumns; i++) {
            row.addClass('row-'+rowId);
            var pawn = this.buildPawn();
            pawn.addClass('pawn-'+i);
            pawn.css({backgroundColor:"#DDD"});
            row.append(pawn);
        }
        row.prepend('<div class="num">'+(rowId+1)+'</div>');
        return row;
    },

    /**
     * Build the input
     *
     * @param tableId
     * @returns {jQuery|HTMLElement}
     */
    buildInput: function()
    {
        var input = $('<div class="input clearfix"></div>');
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
        if (this.gameover){
            return;
        }
        if ($('.selector').length) {
            $('.selector').remove();
        }
        var _this = this;
        var selector = $('<div class="selector clearfix"></div>');
        for (var i = 0; i < this.nbColors; i++) {
            var pawn = this.buildPawn();
            pawn.css({backgroundColor:this.colors[i]});
            pawn.data('colorId', i);
            pawn.removeClass('empty');
            pawn.click(function(){
                var colorId = $(this).data('colorId');
                inputPawn.css({backgroundColor:_this.colors[colorId]});
                inputPawn.data('colorId', colorId);
                inputPawn.removeClass('empty');
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
                } else if (i === j) {
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
            this.theEnd(true);
        } else {
            this.showResults(inputSelection, numberOfEqual, numberOfAlmost);
        }
    },

    /**
     * Called when the party is over
     * @param isWin
     */
    theEnd: function(isWin)
    {
        var _this = this;
        var message = (isWin) ? 'You broke the code, you hacker !':'You loose, I\'m unbreakable !';
        var endClass = (isWin) ? 'win':'loose';

        var btnReset = $('<div class="btn-reset">Restart</div>');

        var end = $('<div class="end"></div>');
        end.addClass(endClass);
        end.append($('<div class="message">'+message+'</div>'));
        end.append(btnReset);

        btnReset.click(function(){
            $('body').html('<mastermind></mastermind>');
            _this.secretCode = [];
            _this.input = [];
            _this.colors = [];
            _this.currentRow = 0;
            _this.gameover = false;
            mm.run();
        });

        this.revealSecret();

        this.gameover = true;

        $('.subtitle').after(end);
    },

    /**
     * Show the result of the computed input
     *
     * @param input
     * @param numberOfEqual
     * @param numberOfAlmost
     */
    showResults: function(input, numberOfEqual, numberOfAlmost)
    {
        var _this = this;

        if (this.currentRow === this.nbRows - 1) {
            this.theEnd(false);
        }

        var row = $('.row-'+this.currentRow);

        // Append results to the current row
        input.forEach(function(colorId, i) {
            var pawn = row.children('.pawn-'+i);
            pawn.css({backgroundColor:_this.colors[colorId]});
            pawn.removeClass('empty');

        });

        this.clearInput();

        var result = $('<div class="result clearfix"></div>');

        for (var i = 0; i < numberOfEqual; i++) {
            result.append($('<div class="point black"></div>'));
        };
        for (var i = 0; i < numberOfAlmost; i++) {
            result.append($('<div class="point white"></div>'));
        };

        row.append(result);

        this.currentRow++;
    },

    /**
     * Clean all the input data for the next tryout
     */
    clearInput: function()
    {
        $('.input .pawn').each(function(){
            $(this).removeAttr('style');
            $(this).removeData('colorId');
            $(this).addClass('empty');
        });
    },

    /**
     * Create the array of colors
     */
    getColors: function ()
    {
        for (var i = 0; i < this.nbColors; i++) {
            this.colors.push(this.availableColors[i]);
        }
    },

    /**
     * Simply build a pawn
     *
     * @returns {jQuery|HTMLElement}
     */
    buildPawn: function()
    {
        var pawn = $('<div class="pawn empty"></div>');
        return pawn;
    },
};

mm.run();
