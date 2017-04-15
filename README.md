# jqFileUpload
#### This is a jQuery plugins for file upload which support drag and preview files.

## Demo
html

    <div id="filebtn">Click</div>
    <div><progress max="100" value="0" id="progress"/></div>
    <div><img id="preview"></div>

js 

    $('#filebtn').fileUpload({
        url:'/upload',
        type:'POST',
        dataType:'json',
        timeout:5000,
        autoUpload:true,
        /*
         autoUpload:false,
         uploadBtn:'buttonIdName',
         */
        previewId:'preview',
        dragable:true,
        dragAreaId:'filebtn',
        accept:'image/jpeg,image/png',
        before:function(file){
            console.log('handle the file before upload.');
        },
        end:function(result){
            console.log('the result return back from the server:',result);
        },
        error:function(error){
            console.log('the error when upload failed:',error);
        },
        progress:function(progress){
            $('#progress').val(progress);
            console.log('progress for upload');
        },
        imgpreviewprogress:function(progress){
            console.log('the progress for load the locak image to preview');
        },
        previewload:function(result){
            console.log('the image data for preview is ok');
        }
    });

