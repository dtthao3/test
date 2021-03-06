(function($) {
    $(document).ready(function() {
        //Settings
        var $current = null;
        $('.tp-app #city').on('keyup', function() {
            clearTimeout($current);
            $('.tp-app #search-results').html('Seaching...');
            $this = $(this);
            var $city = $this.val();
            $current = setTimeout(function() {
                $.ajax({
                    url : tp.url,
                    type: 'POST',
                    dataType : 'json',
                    data : {
                        'action' : 'search_city_ajax',
                        'city' : $city
                    }
                }).done(function($result) {
                    console.log($result);
                    if ($result.success && $result.data.cod == "200") {
                        var $list = $result.data.list;
                        var $html = '';
                        for (i = 0; i < $result.data.count; i++) {
                            $html += '<p><label>';
                            $html += '<input type="checkbox" class="tog tp-weather-item" value="' + $list[i].name + '" />' + $list[i].name;
                            $html += '</label></p>';
                        }
                        $('.tp-app #search-results').html($html);
                    } else {
                        $('.tp-app #search-results').html('Error! Please try again.');
                    }
                }); //End Ajax
            }, 1000); //End SetTimeout
        }); //End Event

        var $first_click = 0;
        $('.tp-app #search-results').on('click', 'input[type="checkbox"]',function() {
            console.log(this);
            $this = $(this);
            $city_name = $this.attr('value');
            $search_selected = $('.tp-app #search-selected');
            if ($first_click == 0) {
                $search_selected.html('');
                $first_click = 1;
            }
            $html = '';
            $html += '<div>';
            $html += '<input name="tp_weather_setting[city_name][]" type="hidden" value="' + $city_name + '" />' + $city_name;
            $html += '<a href="#" class="tp-delete-item">(Delete)</a>';
            $html += '</div>';
            $search_selected.append($html);
            $this.remove();
        });//End Event Click on Checkbox


        $('.tp-app #search-selected').on('click', '.tp-delete-item', function() {
            $this = $(this);
            $this.parent().remove();
        });

        //Widget View
        $(document).on('change', '.tp-weather-selector', function() {
            $.ajax({
                url : tp.url,
                type: 'POST',
                data : {
                    'action' : 'search_city',
                    'city' : this.value
                },
                success: function(data){
                    $('.tp-weather-view').replaceWith(data);
                },
                error: function (xhr) {
                    console.log(xhr.responseText);
                }
            });
        });
    });
})(jQuery);