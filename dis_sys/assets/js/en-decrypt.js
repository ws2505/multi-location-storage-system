function encode(data)
{
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
}

$(document).ready(function(){
    var fileChooser = document.getElementById('file-chooser');
    //var fileChooser = $("#file-chooser");
    var csvChooser = document.getElementById('csv-chooser');
    var upload = document.getElementById('upload-button');
    var download = document.getElementById('download');
    var add_friend = document.getElementById('add-friend-button');
    var results = document.getElementById('results');

    $("#upload").click(function(){
        var file = fileChooser.files[0];
        var access_file = csvChooser.files[0];
        var access = new Array(2);

        if(typeof(FileReader) !== 'undefined'){
            var reader = new FileReader();
            reader.readAsText(access_file);
            reader.onload = function(evt){
                var data = evt.target.result;
                access = data.toString().split("\r\n");
                access[0] = access[0].slice(15);
                access[1] = access[1].slice(13);

                if (file) {
                    AWS.config.update({
                        "accessKeyId": access[0],
                        "secretAccessKey": access[1]
                    });
                    AWS.config.apiVersions = {
                        s3: '2006-03-01',
                    };
                    console.log(AWS.config);

                    var s3 = new AWS.S3();
                    
                    var params = {
                        Bucket: 'testsdfhaergsfgwrgfdfff1112312fasdf',
                        Key: file.name,
                        ContentType: file.type,
                        Body: file,
                        ACL: 'authenticated-read'
                    };        
                    s3.putObject(params, function (err, res) {
                        if (err) {
                            results.innerHTML = ("Error uploading data: ", err);
                        } else {
                            results.innerHTML = ("Successfully uploaded data");
                        }
                    });
                } else {
                    results.innerHTML = 'Nothing to upload.';
                }
            }
        }
    });


    $("#add_friend").click(function(){
        //var file = fileChooser.files[0];
        var access_file = csvChooser.files[0];
        var friend_id = document.getElementById("friend_id").value;
        var access = new Array(2);

        if(typeof(FileReader) !== 'undefined'){
            var reader = new FileReader();
            reader.readAsText(access_file);
            reader.onload = function(evt){
                var data = evt.target.result;
                access = data.toString().split("\r\n");
                access[0] = access[0].slice(15);
                access[1] = access[1].slice(13);

                AWS.config.update({
                    "accessKeyId": access[0],
                    "secretAccessKey": access[1]
                });
                AWS.config.apiVersions = {
                    s3: '2006-03-01',
                };
                console.log(AWS.config);

                var s3 = new AWS.S3();
                
                var params = {
                    Bucket: "testsdfhaergsfgwrgfdfff1112312fasdf",
                    GrantReadACP: "id=a5db6947168f90c97ba0c40e70f6fa37ef7a67d5282998d9c6fb94e17b7c3a3e",
                    GrantFullControl: "id=d6b3750c918412515846ea15b8222928c3849b394a0b4234224bb5ebdc0e9b9f"
                    //Key: "6998_summary.pptx"
                };
                s3.putBucketAcl(params, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else     console.log(data);           // successful response
                    /*
                    data = {
                    }
                    */
                });
            }
        } 
    });


    $("#download").click(function(){
        //var file = fileChooser.files[0];
        var access_file = csvChooser.files[0];
        var friend_id = document.getElementById("friend_id").value;
        var access = new Array(2);
        var pic = document.getElementById('myimage');
        

        if(typeof(FileReader) !== 'undefined'){
            var reader = new FileReader();
            reader.readAsText(access_file);
            reader.onload = function(evt){
                var data = evt.target.result;
                access = data.toString().split("\r\n");
                access[0] = access[0].slice(15);
                access[1] = access[1].slice(13);

                AWS.config.update({
                    "accessKeyId": access[0],
                    "secretAccessKey": access[1]
                });
                AWS.config.apiVersions = {
                    s3: '2006-03-01',
                };
                console.log(AWS.config);

                var s3 = new AWS.S3();
                
                var params = {
                    Bucket: "testsdfhaergsfgwrgfdfff1112312fasdf", 
                    Key: "f9seR.jpg"
                    };
                s3.getObject(params, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else{
                        console.log(data);
                        var decoder = new TextDecoder('utf8');
                        console.log(typeof data.Body);
                        console.log(data.Body);
                        console.log(typeof encode(data.Body))
                        console.log(encode(data.Body))
                        pic.src = 'data:image/png;base64,' + encode(data.Body);
                    }           // successful response
                    /*
                    data = {
                    AcceptRanges: "bytes", 
                    ContentLength: 3191, 
                    ContentType: "image/jpeg", 
                    ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
                    LastModified: <Date Representation>, 
                    Metadata: {
                    }, 
                    TagCount: 2, 
                    VersionId: "null"
                    }
                    */
                });
            }
        } 
    });

    $("#encrypt").click(function(){
        var file = fileChooser.files[0];
        var access_file = csvChooser.files[0];
        var access = new Array(2);
        var pic = document.getElementById('myimage');

        if(typeof(FileReader) !== 'undefined'){

            var reader = new FileReader();
            reader.readAsText(access_file);
            reader.onload = function(evt){
                var data = evt.target.result;
                access = data.toString().split("\r\n");
                access[0] = access[0].slice(15);
                access[1] = access[1].slice(13);

                if (file) {
                    read_to_encry = new FileReader();
                    read_to_encry.readAsDataURL(file);
                    read_to_encry.onload = function(e){


                        //console.log(e.target.result);
                        //console.log(typeof e.target.result);
                        //pic.src = e.target.result;
                        var encrypted = CryptoJS.AES.encrypt(e.target.result, "12345").toString();
                        console.log(encrypted)
                        console.log(typeof encrypted)

                        AWS.config.update({
                            "accessKeyId": access[0],
                            "secretAccessKey": access[1]
                        });
                        AWS.config.apiVersions = {
                            s3: '2006-03-01',
                        };
                        console.log(AWS.config);
        
                        var s3 = new AWS.S3();
                        //Figure_1.png.encrypted
                        var params = {
                            Bucket: 'testsdfhaergsfgwrgfdfff1112312fasdf',
                            Key: file.name+'.encrypted',
                            //ContentType: file.type,
                            //ContentType: "application/json",
                            //Body: new Blob([JSON.stringify(encrypted)],{type:'application/json'}),
                            Body: encrypted,
                            ACL: 'authenticated-read'
                        };        
                        s3.putObject(params, function (err, res) {
                            if (err) {
                                results.innerHTML = ("Error uploading data: ", err);
                            } else {
                                results.innerHTML = ("Successfully uploaded data");
                            }
                        });

                    };
                    //var encrypted = CryptoJS.AES.encrypt(file.result, "12345").toString();
                    //console.log(encrypted)
                    //console.log(typeof encrypted)

                } else {
                    results.innerHTML = 'Nothing to upload.';
                }
            }
        } 

    });

    $("#decrypt").click(function(){
        var file = fileChooser.files[0];
        var access_file = csvChooser.files[0];
        var access = new Array(2);
        var pic = document.getElementById('myimage');

        if(typeof(FileReader) !== 'undefined'){

            var reader = new FileReader();
            reader.readAsText(access_file);
            reader.onload = function(evt){
                var data = evt.target.result;
                access = data.toString().split("\r\n");
                access[0] = access[0].slice(15);
                access[1] = access[1].slice(13);


                //var encrypted = CryptoJS.AES.encrypt(file.result, "12345").toString();
                //console.log(encrypted)
                //console.log(typeof encrypted)

                AWS.config.update({
                    "accessKeyId": access[0],
                    "secretAccessKey": access[1]
                });
                AWS.config.apiVersions = {
                    s3: '2006-03-01',
                };
                console.log(AWS.config);

                var s3 = new AWS.S3();
                
                //Figure_1.png.encrypted
                var params = {
                    Bucket: "testsdfhaergsfgwrgfdfff1112312fasdf", 
                    Key: "hw5_2a.png.encrypted"
                    };
                s3.getObject(params, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else{
                        console.log(data);
                        console.log(typeof data.Body);
                        console.log(data.Body);

                        var texts = data.Body.toString('utf-8');
                        var decry = CryptoJS.AES.decrypt(texts, "12345").toString(CryptoJS.enc.Utf8);

                        console.log(typeof decry);
                        console.log(decry);
                        console.log(decry.slice(22));

                        //var textString = 'Hello world'; // Utf8-encoded string
                        //var words = CryptoJS.enc.Utf8.parse(decry.slice(22)); // WordArray object
                        //console.log(typeof words);
                        //var base64 = CryptoJS.enc.Base64.stringify(decry.slice(22)); // string: 'SGVsbG8gd29ybGQ='
                        //console.log(typeof base64);
                        //console.log(base64);

                        //pic.src = 'data:image/png;base64,' + btoa(decry.slice(22));
                        pic.src = decry;
                        
                        //var a = document.getElementById('abc');
                        //a.attr('href', decry);
                        //a.attr('download', "Figure_1.png");

                        //pic.src = btoa(decry);
                    }           // successful response
                });
            }
        } 

    });


    $("#test").click(function(){
        var div_bef = "<input id=\"val";
		var div_aft = "\" /><br>"
        $("#results").append(div_bef+"123"+div_aft);
        $("#val"+"123").change(function(e){
            console.log("result"+e.val());
        });
        $("#val123").val(2);
        $("#val123").val(3);

        //console.log(li);
        var key = secrets.random(512); // => key is a hex string

        // split into 10 shares with a threshold of 5
        var shares = secrets.share(key, 10, 5); 
        // => shares = ['801xxx...xxx','802xxx...xxx','803xxx...xxx','804xxx...xxx','805xxx...xxx']
        console.log(key);
        console.log(shares[1]);
        console.log(typeof shares[1]);
        // combine 4 shares
        var comb = secrets.combine( shares.slice(0,4) );
        console.log(comb === key); // => false

        // combine 5 shares
        var comb = secrets.combine( shares.slice(4,9) );
        console.log(comb === key); // => true

        
        var file = fileChooser.files[0];
        var access_file = csvChooser.files[0];
        var access = new Array(2);
        var pic = document.getElementById('myimage');

        if(typeof(FileReader) !== 'undefined'){
            
            var reader = new FileReader();
            reader.readAsText(access_file);
            reader.onload = function(evt){
                var data = evt.target.result;
                access = data.toString().split("\r\n");
                access[0] = access[0].slice(15);
                access[1] = access[1].slice(13);


                //var encrypted = CryptoJS.AES.encrypt(file.result, "12345").toString();
                //console.log(encrypted)
                //console.log(typeof encrypted)

                AWS.config.update({
                    "accessKeyId": access[0],
                    "secretAccessKey": access[1]
                });
                AWS.config.apiVersions = {
                    s3: '2006-03-01',
                };
                console.log(AWS.config);

                var s3 = new AWS.S3();

                //should get from server
                var objname=[
                    "asdfasdf1",
                    "asdfasdf2",
                    "asdfasdf3",
                    "asdfasdf4",
                    "asdfasdf5"
                ]

                // store key shares
                // for(var i=0; i<5; i++){
                //     var params = {
                //         Bucket: 'testsdfhaergsfgwrgfdfff1112312fasdf',
                //         Key: objname[i]+'.share',
                //         //ContentType: file.type,
                //         //ContentType: "application/json",
                //         //Body: new Blob([JSON.stringify(encrypted)],{type:'application/json'}),
                //         Body: shares[i],
                //         ACL: 'authenticated-read'
                //     };        
                //     s3.putObject(params, function (err, res) {
                //         if (err) {
                //             results.innerHTML = ("Error uploading data: ", err);
                //         } else {
                //             results.innerHTML = ("Successfully uploaded data");
                //         }
                //     });
                // }// store key shares
                // for(var i=0; i<5; i++){
                //     var params = {
                //         Bucket: 'testsdfhaergsfgwrgfdfff1112312fasdf',
                //         Key: objname[i]+'.share',
                //         //ContentType: file.type,
                //         //ContentType: "application/json",
                //         //Body: new Blob([JSON.stringify(encrypted)],{type:'application/json'}),
                //         Body: shares[i],
                //         ACL: 'authenticated-read'
                //     };        
                //     s3.putObject(params, function (err, res) {
                //         if (err) {
                //             results.innerHTML = ("Error uploading data: ", err);
                //         } else {
                //             results.innerHTML = ("Successfully uploaded data");
                //         }
                //     });
                // }

                //combine the shares
                var get_shares = [];  
                for(var i=0; i<5; i++){
                        
                    var params = {
                        Bucket: "testsdfhaergsfgwrgfdfff1112312fasdf", 
                        Key: objname[i]+'.share'
                        };
                    s3.getObject(params, function(err, data) {
                        if (err) console.log(err, err.stack); // an error occurred
                        else{
                            console.log(data.Body.toString('utf-8'));
                            get_shares.push(data.Body.toString('utf-8'));
                            console.log(get_shares.length);

                            // wait for all shares
                            if(get_shares.length==5){
                                console.log(get_shares);
                                var comb_ = secrets.combine(get_shares);
                                console.log(comb_);
                            }
                        }
                    });
                }
                


                // get user ID
                var params = {};
                s3.listBuckets(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else{
                    console.log(data['Owner']['ID']);
                    console.log(data);
                
                }           // successful response
                     /*
                     data = {
                      Location: "http://examplebucket.s3.amazonaws.com/"
                     }
                     */
                });

                // var params = {
                //     Bucket: "test123sadfasegsdgijsdfjkbiuhweiujkduejdddd", 
                //     CreateBucketConfiguration: {
                //      LocationConstraint: "eu-west-1"
                //     }
                //    };
                // s3.createBucket(params, function(err, data) {
                //      if (err) console.log(err, err.stack); // an error occurred
                //      else     console.log(data);           // successful response
                //      /*
                //      data = {
                //       Location: "http://examplebucket.s3.amazonaws.com/"
                //      }
                //      */
                // });

            }
        }


    });
});

function test(bname, oname, i){

}