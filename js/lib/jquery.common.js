(function(){
    //placeholder简单处理
    var isInputSupported = 'placeholder' in document.createElement('input');
    if(isInputSupported) return;
    $(document).on('focus','input[placeholder],textarea[placeholder]',function(){
        var placeholderText = $(this).attr('placeholder'),
            val = this.value;
        if(placeholderText == val) {
            this.value = '';
        }
    })
    .on('blur','input[placeholder],textarea[placeholder]',function(){
        var placeholderText = $(this).attr('placeholder'),
            val = this.value;
        if('' === $.trim(val)) {
            this.value = placeholderText;
        }
    });
})();
