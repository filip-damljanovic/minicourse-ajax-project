
function loadData() {

  var $body = $('body');
  var $wikiElem = $('#wikipedia-links');
  var $nytHeaderElem = $('#nytimes-header');
  var $nytElem = $('#nytimes-articles');
  var $greeting = $('#greeting');

  // clear out old data before new request
  $wikiElem.text("");
  $nytElem.text("");
  $('img').remove();

  var cityInput = $('#city').val();
  var slugName = $('#slugname').val();

  //Street view (Teleport API) - Showing images of supported cities based on slug name of the city
  var url = "https://api.teleport.org/api/urban_areas/slug:" + slugName + "/images/";

  $.ajax({
    url: url,
    success: function(data) {
      var imgSrc = data.photos[0].image.web;
      $body.append('<img class="bgimg" src=' + imgSrc + '>');
      var img = $('img');
      var name = slugName.charAt(0).toUpperCase() + slugName.slice(1);
      $greeting.text("Greetings from " + name + "!");
    }
  });

  // NY Times API
  var nyt_url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + cityInput + "&api-key=ELJiPcfKFiJDyey28A0AUXJRCMAhFA5m";

  $.getJSON(nyt_url, function(data) {

    for(var i = 0; i < data.response.docs.length; i++) {
      var article = data.response.docs[i];
      $nytElem.append('<li class="article"><a href=' + article.web_url +'>' + article.headline.main + '</a><p>' + article.snippet + '</p></li>');
    }

  })
  .error(function() {
    $nytElem.text("NY times articles cannot be displayed");
  });

  // Wikipedia API
  var wiki_url = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + cityInput + "&format=json&callback=wikiCallback";

  var wikiRequestTimeout = setTimeout(function() {
    $wikiElem.text("Unable to get wiki resources");
  }, 8000);

  $.ajax({
    url: wiki_url,
    dataType: "jsonp",
    success: function(data) {

      for(var i = 0; i < data[1].length; i++) {
          var article_url = data[3];
          var titles = data[1];
          $wikiElem.append('<li><a href=' + article_url[i] +'>' + titles[i] + '</a></li>');
      }

      clearTimeout(wikiRequestTimeout);

    }
  });

  return false;
};

$('#form-container').submit(loadData);