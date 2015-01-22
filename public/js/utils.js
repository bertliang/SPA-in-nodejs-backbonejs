var eatz = eatz || {};

eatz.utils = {
    
    // Asynchronously load templates located in separate .html files
    loadTemplates: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (eatz[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    eatz[view].prototype.template = _.template(data);
                }));
            } else {
                console.log(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    },

    showValidationError: function(name,errors){
	var controlGroup = $('#' + name).parent().parent();
        controlGroup.addClass('error');
        controlGroup.find('.help-inline').text(errors);
    },

    clearValidationError: function(name){
	var controlGroup = $('#' + name).parent().parent();
        controlGroup.removeClass('error');
        controlGroup.find('.help-inline').text('');       
    },
    
    showNotice: function(title, alertType, msg){
         $('.alert').removeClass("alert-error alert-waring alert-success alert-info");
         $('.alert').addClass("alert-" + alertType);
         $('.alert').html('<strong>'+ title + '</strong>' + msg);
         $('.alert').show();
    },

    hideNotice: function(){
         $('.alert').hide();
    },

    uploadFile: function(file){
        //console.log(file);
        var img = file;
        //console.log(img);
	var image; // return image
        var imgData = new FormData();
        imgData.append("image", img);  
	var request = $.ajax({
            type: 'POST',
	        url: '/dishes/image',
            data: imgData,
            cache: false,
            contentType: false,
            processData: false,
            async: false
            });
         request.done(function(res) {
                  console.log('done');
                  //console.log(res);
                  image = res;
                  //return image;
                    
          });
          request.fail(function(res){
                 console.log('fail');
                 //callback(res.responseText);
                 //image = res.responseText;
                 //console.log(image);
            
             });
           
         console.log(image);
         return image;
         
    }

};
