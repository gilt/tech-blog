(function () {

  function color (str, prc) {
    'use strict';

    // Check for optional lightness/darkness
    var prc = typeof prc === 'number' ? prc : -10;

    // Generate a Hash for the String
    function hash (word) {
        var h = 0;
        for (var i = 0; i < word.length; i++) {
            h = word.charCodeAt(i) + ((h << 5) - h);
        }
        return h;
    }

    function shade (color, prc) {
      var num = parseInt(color, 16),
      amt = Math.round(2.55 * prc),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
      return (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16)
      .slice(1);
    }

    function toRgba (i) {
      var color = ((i >> 24) & 0xFF).toString(16) +
      ((i >> 16) & 0xFF).toString(16) +
      ((i >> 8) & 0xFF).toString(16) +
      (i & 0xFF).toString(16);
      return color;
    }

    return shade(toRgba(hash(str)), prc);
  }

  $(function () {

    var categoryMenu = $('#subnav span #categories-menu'),
      resultsMenu = $('#search-results');

    SimpleJekyllSearch({
      searchInput: $('#search input')[0],
      resultsContainer: $('#search-results')[0],
      // defined in _includes/themes/gilt/default.html
      json: searchJsonPath,
      searchResultTemplate: searchTemplate,
      limit: 15
    });

    $('#search')
      .on('focusin', function () {
        $(this).addClass('huge');
        resultsMenu.show();
      })
      .on('focusout', function () {
        $(this).removeClass('huge');
        resultsMenu.hide();
      });

    // assign tag rollover colors
    $('article section.tags a')
      .each(function () {
        var e = $(this);
        e.data('border-color', color(e.text()));
      })
      .on('mouseover', function () {
        $(this).css({ borderLeftColor: '#' + $(this).data('border-color')});
      })
      .on('mouseout', function () {
        var style = this.style;

        if (style.removeAttribute) {
          style.removeAttribute('border-left-color');
        }
        else {
          style.removeProperty('border-left-color');
        }
      });

    $('#subnav span a.categories')
      .on('mouseover', function () {
        categoryMenu.show().focus();
      });

    $('body').on('click', function (e) {
      if (e.target.className !== 'categories') {
        categoryMenu.hide();
      }
    });

  });

})();