var inpField = 0;
var count = 0;
var output;
var exp;
var msgOfFail;
var changedInpField;
var failSituation = false;
var inFocusCursor = false;

var massOfCity = [];
var foundCity = [];

//Загрузка массива данных
$(document).ready(function(){
	$.getJSON('JavaScript/kladr.json', function(data) {
		massOfCity = data;
	})
	.fail(function(){
		failSituation = true;
		msgOfFail = '<p class="getFail"> Что-то пошло не так.'+
				  ' Проверьте соединение с интернетом и попробуйте еще раз </p>';
		msgOfFail += '<ul id = "so">';
		msgOfFail += '<li class = "list" >Обновить</li>';
		msgOfFail += '</ul>';
		
	});
});

function createListOfCity(massOfCity){
	inpField = $('#city').val();
	var i = 0;
	if (inpField.length > 0){
		changedInpField = inpField.replace(/\//g,'\\\/')
								  .replace(/\\/g,'\\\\')
								  .replace(/\(/g,'\\(')
								  .replace(/\)/g,'\\)')
								  .replace(/\./g,'\\.')
								  .replace(/\?/g,'\\?')
								  .replace(/\*/g,'\\*')
								  .replace(/\|/g,'\\|')
								  .replace(/\^/g,'\\^')
								  .replace(/\+/g,'\\+')
								  .replace(/\[/g,'\\[')
								  .replace(/\]/g,'\\]');

		exp = new RegExp('^' + changedInpField, 'i');
		output = '<ul id = "so">';
			$.each(massOfCity, function(key, val){
				if (val.City.search(exp) != -1 ){
					foundCity[i++] = val.City;
				} 
			});
			count = foundCity.length;

				if(count >= 200){
					for( var m = 0; m < 20; m++){
						output += '<li class = "list" >' + foundCity[m] + '</li>';
					}
				} else {
					for( var m = 0; m < 5; m++){
						if(foundCity[m] == undefined) output+='';
						else{
							output += '<li class = "list" >' + foundCity[m] + '</li>';
						}
					}
				}

			output += '</ul>';

			$('.autocomplete').show();
			$('.autocomplete').html(output);
		
			addElaboration();
		
	} else if( inpField.length == 0) {
		 $('.validation').hide();
		 $('#city').css({"border": "1px solid #5199db",
						 "box-shadow": "0 0 0 1px rgb(81,153,219)"});
		 $('.autocomplete').hide();
		 $('.autocomplete').html("");
    }
}  


function addElaboration(){
	if (count >= 200){
		$('.validation').hide();
		$('#city').css({"border": "1px solid #5199db",
						"box-shadow": "0 0 0 1px rgb(81,153,219)"});
		output += '<div class = "strOfRes">' + 
					'<p class = "results">Показано 20 из</p> ' +
					'<p class = "results">'+count+'</p>' +
					'<p class = "results"> найденных городов.'+
							' Уточните поиск, чтобы увидеть остальные</p>'+ 
				  '</div>';
		$('.autocomplete').html(output);
	} else if(count <= 5) {
		$('.validation').hide();
		$('#city').css({"border": "1px solid #5199db", 
						"box-shadow": "0 0 0 1px rgb(81,153,219)"});
		$('p.results').remove();
	} else {
		$('.validation').hide();
		$('#city').css({"border": "1px solid #5199db", 
						"box-shadow": "0 0 0 1px rgb(81,153,219)"});
		output += '<div class = "strOfRes">' + 
					'<p class = "results">Показано 5 из</p> ' +
					'<p class = "results">'+count+'</p>' +
					'<p class = "results"> найденных городов.'+
						' Уточните поиск, чтобы увидеть остальные</p>'+ 
				  '</div>';
		$('.autocomplete').html(output);
	}
	 if(count == 0){
		 $('#city').css({"border": "1px solid #f69c00",
						 "box-shadow": "0 0 0 1px rgb(246,156,0)"});
		 delete output;
		 var text = '<p class = "mist">Не найдено</p>';
		 $('.autocomplete').html(text);
		 var orange = '<p class = "orange-valid">Значения нет в справочнике.'+
					  '<br> Возможно, вы ошиблись в написании</p>';
		 $('.validation').show();
		 $('.validation').html(orange);
	}
}

//Остановка отправления формы через Enter
$(document).ready(function(){	
	$("#form").keydown(function(event){
		if(event.keyCode === 13){
			event.preventDefault();
			return false;
		}
	});
});

$(document).ready(function(){	
    $('#city').keyup(function(event){
		switch(event.keyCode){
			case 13:
				if(failSituation)location.reload();
				
				if(count == 0){
					return false;
				} 
				
				if(!inFocusCursor){
					var myC = $('ul#so li:first-child').text();
					$('#city').val(myC) ;
					$('.autocomplete').hide();
					$('#city').addClass('chosen');
					return false;
				}
				
			break;
		}
		
		if (failSituation){
			$('.autocomplete').show();
			$('.autocomplete').html(msgOfFail);
			$('#city').css({"border": "1px solid #5199db", 
							"box-shadow": "0 0 0 1px rgb(81,153,219)"});
		} else{
			foundCity.length = 0;
			$('#city').removeClass('chosen');
			createListOfCity(massOfCity);
			inFocusCursor = false;
		}
		
    });
});

//Курсор заходит на элементы списка 
$(document).on("mouseenter","ul#so li", function(){
	inFocusCursor =true;
	$('ul#so li:first-child').css({"background": "inherit", 
                                   "color": "inherit"});
});

//Курсор заходит на первый элемент списка 
$(document).on("mouseenter","ul#so li:first-child", function(){
	$(this).css({"background": "#5199db", 
                 "color": "#FFF"});
});

//Курор покидает первый элемент списка
$(document).on("mouseleave","ul#so li:first-child", function(){
	$(this).css({"background": "#FFF", 
                 "color": "#404040"});
});

//Клик по элементу списка
$(document).on("click", ".list", function(){
	if(failSituation){
		location.reload();
	} else{
		var myChoice = $(this).text();
		$('#city').val(myChoice) ;
		$('.autocomplete').hide();
		$('#city').addClass('chosen');
	}
});


$(document).ready(function(){
//input получает фокус     
	$('#city').focus(function(){
		$('#city').css({"border": "1px solid #5199db", 
						"box-shadow": "0 0 0 1px rgb(81,153,219)"});
		$('.validation').hide();
		if($('#city').hasClass('chosen')){
			$('#city').select();
		} else {
			if($('#city').val().length > 0){
				$('.autocomplete').show();
				$('ul#so li:first-child').css({"background": "#5199db", 
									   "color": "#FFF"});
			}
		}
		
    });
	
//input теряет фокус    	
    $('#city').blur(function(){
		if (failSituation){
			$('.autocomplete').hide();
		}
		var r = $('ul#so li:first-child').text();
		var re = new RegExp('^'+r+'$','i');

		if($('#city').hasClass('chosen')){
			$(this).css({"border": "1px solid #d9d9d9", 
						 "border-top": " 1px solid #969696", 
						 "box-shadow": "none"});
		} else if(re.test(inpField) && $('.list').length == 1){
			$('#city').val(r) ;
			$('#city').css({"border": "1px solid #d9d9d9", 
							"border-top": " 1px solid #969696", 
							"box-shadow": "none"});
			$('.validation').hide();
			$('#city').addClass('chosen');
			$('.autocomplete').hide();
		} else if (inpField == 0){
			$('#city').css({"border": "1px solid #d9d9d9", 
							"border-top": " 1px solid #969696", 
							"box-shadow": "none"});
		} else {
			$('#city').css({"border": "1px solid #da0c09", 
							"box-shadow": "0 0 0 1px rgb(218,12,9)"});
			$('.autocomplete').hide();
			var red = '<p class = "red-valid">Выберите значение из списка</p>';
			$('.validation').show();
			$('.validation').html(red);

		}

		if($("#so:hover").length > 0){
			$('.validation').hide();
			$('.autocomplete').show();
			$('#city').css({"border": "1px solid #d9d9d9", 
							"border-top": " 1px solid #969696", 
							"box-shadow": "none"});
		}
	}); //blur
});
 
      
