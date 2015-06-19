(function () {

  $(function () {

    $('#search')
      .on('focusin', function () {
        $(this).addClass('huge');
      })
      .on('focusout', function () {
        $(this).removeClass('huge');
      });



  });

})();