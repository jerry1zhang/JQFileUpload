(function($){
    $.extend({
        _uploadFile:function(options){

            if(!options || !options.file || !(options.file instanceof File)){
                return;
            }

            if(options.progress && typeof options.progress !='function')
            {
                delete options.progress;
            }
            if(options.end && typeof options.end !='function')
            {
                delete options.end;
            }
            if(options.error && typeof options.error !='function')
            {
                delete options.error;
            }

            options = $.extend({
                timeout:5000,
                type:'POST',
                dataType:'json'
            },options);

            var formdata = new FormData();
            formdata.append('upload',options.file);
            $.ajax({
                url:options.url,
                type:options.type,
                cache:'false',
                dataType:options.dataType,
                processData:false,
                contentType:false,
                timeout:options.timeout,
                data:formdata,
                xhr: function () {
                    var xhr = $.ajaxSettings.xhr();
                    if(options.progress) {
                        xhr.upload.onprogress = function (e) {
                            if (e.lengthComputable) {
                                options.progress(e.loaded / e.total * 100);
                            }
                        };
                    }
                    return xhr;
                },
                success:function(data){
                    options.end && options.end(data);
                },
                error:function(error){
                    options.error && options.error(error);
                }
            });
        },
        _loadLocalImg:function(options){
            if(!options || !options.file || ! (options.file instanceof File)){
                return;
            }
            var acceptTypes = {
                'image/png':true,
                'image/jpeg':true,
                'image/gif':true
            }
            if(acceptTypes[options.file.type]){
                var reader = new FileReader();
                if(options.imgpreviewprogress && typeof options.imgpreviewprogress == 'function') {
                    reader.onprogress = function (e) {
                        if (e.lengthComputable) {
                            options.imgpreviewprogress(e.loaded / e.total * 100);
                        }
                    }
                }
                if(options.previewload && typeof options.previewload == 'function') {
                    reader.onload = function (e) {
                        options.previewload(e.target.result);
                    }
                }
                reader.readAsDataURL(options.file);
            }
        }
    });
    $.fn.extend({
        fileUpload:function(options){
            var files = null;
            var beforeresult = null;
            var preivew = null;
            if(options.previewId){
                preivew = $('#'+options.previewId);
                if(preivew.length) {
                    var oldpreviewload = options.previewload;
                    options.previewload = function (result) {
                        preivew.attr('src', result);
                        oldpreviewload && oldpreviewload(result);
                    }
                }else{
                    preview = null;
                }
            }
            options.accept = options.accept || '';

            return this.each(function(){
                var fileinput = $('<input type ="file" style="display:none" accept="'+options.accept+'"/>');
                $(this).after(fileinput);
                $(this).click(function(){
                    fileinput.click();
                });

                fileinput.change(function(e) {
                    files= e.target.files;
                    if(files.length) {
                        options.file = files[0];
                        if (options.before && typeof (options.before) == 'function') {
                            beforeresult = options.before(options.file);
                            if(!beforeresult && typeof beforeresult !== 'undefined')
                                return;
                        }
                        if (preview) {
                            $._loadLocalImg(options);
                        }
                        if (options.autoUpload) {
                            $._uploadFile(options);
                        }
                    }
                });

                if(options.dragable || options.dragAreaId){
                    var dragArea = options.dragAreaId? $('#'+options.dragAreaId) : $(this);
                    dragArea.on('dragover',function(e){
                        $(this).addClass('dragOver');
                        return false;
                    });
                    dragArea.on('dragleave',function(e){
                        $(this).removeClass('dragOver');
                        return false;
                    });
                    dragArea.on('drop',function(e){
                        $(this).removeClass('dragOver');
                        if(e.originalEvent.dataTransfer) {
                            files = e.originalEvent.dataTransfer.files;
                        }
                        if(files.length){
                            options.file = files[0];
                            if(options.before && typeof (options.before) == 'function'){
                                beforeresult = options.before(options.file);
                                if(!beforeresult && typeof beforeresult!=='undefined')
                                    return;
                            }
                            if (preview) {
                                $._loadLocalImg(options);
                            }
                            if (options.autoUpload) {
                                $._uploadFile(options);
                            }
                        }
                        return false;
                    });
                }

                if(!options.autoUpload && options.uploadBtn){
                    $('#'+options.uploadBtn).length && $(options.uploadBtn).click(function(){
                        $._uploadFile(options);
                    })
                }
            });
        }
    });
})(window.jQuery);