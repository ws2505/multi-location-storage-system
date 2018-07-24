$(function(){

	var body = $('body'),
		stage = $('#stage'),
		back = $('a.back');
	var key = [];
	var have_key = false;
	var log_in = false;
	var username = "";
	var user_s3_id = "";

	var test = false;
	var add_bucket = false;

	// log in
	$('#step1 .encrypt').click(function(){
		body.attr('class', 'encrypt');
		var info = {"uname":$("#log_uname").val(),"pass":hex_sha1($("#log_pass").val())};
		console.log(info);
		if($("#log_uname").val()===''||$("#log_uname").val()===null){
			$("#signin_error").text("enter username");
		}else if($("#log_pass").val()===''||$("#log_pass").val()===null){
			$("#signin_error").text("enter password");
		}else{
			if(test){
				var test_data = {"flag":1,"all_bucket_name":",948061ecdf1faaa39bb5925d3b67783f,e9a0b43b7c7a3deac8318af6dc99c2a5,5290f2f9c222a650cb0deab732cebed4,22e2db5447be683b3f7b8e79550f8804,cbef7788fe42325260dc777feca2db7a,c6f38ce44b6e4325a1215a6b569aca63,7905a9f46b0350f3693b6829ad6a4145,f0580ada1816f54974d9940af07a6ab7","all_friends_s3_id":",id=d6b3750c918412515846ea15b8222928c3849b394a0b4234224bb5ebdc0e9b9f,id=a5db6947168f90c97ba0c40e70f6fa37ef7a67d5282998d9c6fb94e17b7c3a3e,id=a5db6947168f90c97ba0c40e70f6fa37ef7a67d5282998d9c6fb94e17b7c3a3e"};
				console.log(test_data["flag"]);
				username = $("#log_uname").val();
				log_in = true;
				// TODO ?? 
				if(have_key){
					step(3)
				}else{
					step(2);
				}
			}else{
				$.post( "../../../login.jsp", info, function(data) {
					$( ".result" ).html( data );
					alert( "Load was performed." );
					//var data =1;
					console.log(data);
					if(data==1){
						username = $("#log_uname").val();
						log_in = true;
						// TODO ?? 
						if(have_key){
							step(3)
						}else{
							step(2);
						}
					}else{
						$("#log_uname").val("");
						$("#log_pass").val("");
						$("#signin_error").text("Invalid username or password");
					}
					//TODO check with server 
					
				});
			}
		}
		

	});

	$('#step1 .decrypt').click(function(){
		step(5);

	});

	// read s3 key
	$('#step2 .button').click(function(){
		// Trigger the file browser dialog
		$(this).parent().find('input').click();
	});


	// Set up events for the file inputs
	var file = null;
	$('#step2').on('change', '#encrypt-input', function(e){

		// Has a file been selected?
		key = [];
		if(e.target.files.length!=1){
			alert('Please select key file!');
			return false;
		}

		file = e.target.files[0];
		
		var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(evt){
            var data = evt.target.result;
            access = data.toString().split("\r\n");
            key.push(access[0].slice(15));
			key.push(access[1].slice(13));
			//console.log(key);
			AWS.config.update({
				"accessKeyId": key[0],
				"secretAccessKey": key[1]//,
				//"region": "us-east-1"
			});
			AWS.config.apiVersions = {
				s3: '2006-03-01',
			};
			console.log(AWS.config);

			var s3 = new AWS.S3();
			var params = {};
			s3.listBuckets(params, function(err, data_list){
				if(err){
					console.log(err, err.stack); // an error occurred
					$("#wrong_key").html("Invalid key. Select again!");
				}
				else{
					user_s3_id = data_list['Owner']['ID'];
					console.log(user_s3_id);
					//console.log(data_list['Owner']['ID']);
					// TODO !
					var info = {"uname":username};
					var regions = ["eu-west-1", "us-west-1", "us-west-2", "ap-south-1", "ap-northeast-1", "sa-east-1", "EU", "eu-central-1"];
					if(test){
						have_key = true;
						step(3);
						//var bucket_name = [];
						//console.log(bucket_name);
						//console.log(bucket_name.length);
						//1
						if(add_bucket){
							var th = 8;
							var bname = [];
							for(var k=0;k<th;k++){
								bname.push(secrets.random(128));
							}
							//console.log(bname);
							var info_init_bucket ={"uname":username,"s3_id":data_list['Owner']['ID'],"b1":bname[0],"b2":bname[1],"b3":bname[2],"b4":bname[3],"b5":bname[4],"b6":bname[5],"b7":bname[6],"b8":bname[7]};
							console.log(info_init_bucket);
							$.get("../../../registration2.jsp", info_init_bucket, function(data_new_bucket){
								console.log(data_new_bucket);
								step(3);
							});
							for(var i=0; i<th; i++){
								var params = {
									Bucket: bname[i], 
									CreateBucketConfiguration: {
									LocationConstraint: regions[i]
									}
								};
								s3.createBucket(params, function(err, data) {
									if (err) console.log(err, err.stack); // an error occurred
									else{
										console.log(data);
									}
								});
							}
						}
						//newBucket(8, bucket_name, regions, new AWS.S3(), data_list, username);
					}else{
						$.get("../../../bucket_null.jsp", info, function(data_bucket_null) {
							//$( ".result" ).html( data );
							//alert( "Load was performed." );
							//TODO
							console.log(data_bucket_null);
							console.log(typeof data_bucket_null);
							if(data_bucket_null==1){
								if(data_list['Owner']['ID']=="from_server"){
									$("#wrong_key").html("Not key of current user. Select again!");
								}else{
									console.log(data_list);
									have_key = true;
									step(3);
								}
							}
							if(data_bucket_null==0){
								
								//console.log(bucket_name);
								//console.log(bucket_name.length);
								//1
								var th = 8;
								var bname = [];
								for(var k=0;k<th;k++){
									bname.push(secrets.random(128));
								}
								//console.log(bname);
								var info_init_bucket = {"uname":username,"s3_id":data_list['Owner']['ID'],"b1":bname[0],"b2":bname[1],"b3":bname[2],"b4":bname[3],"b5":bname[4],"b6":bname[5],"b7":bname[6],"b8":bname[7]};
								console.log(info_init_bucket);
								$.get("../../../registration2.jsp", info_init_bucket, function(data_new_bucket){
									console.log(data_new_bucket);
									console.log(typeof data_new_bucket);
									step(3);
								});
								for(var i=0; i<th; i++){
										
									// var params = {
									// 	Bucket: "testsdfhaergsfgwrgfdfff1112312fasdf", 
									// 	Key: objname[i]+'.share'
									// };
									var params = {
										Bucket: bname[i], 
										CreateBucketConfiguration: {
										LocationConstraint: regions[i]
										}
									};
									s3.createBucket(params, function(err, data) {
										if (err) console.log(err, err.stack); // an error occurred
										else{
											console.log(data);
											//console.log(data.Body.toString('utf-8'));
											//get_shares.push(data.Body.toString('utf-8'));
											//console.log(get_shares.length);

											// wait for all shares
											
										}
									});
									
								}
								//newBucket(8, bucket_name, regions, new AWS.S3(), data_list, username);
								
							}
						});
					}
				}
			});
		}
		

		
	});

	function newBucket(num, bname, regions, s3, data_list, username)
	{
		var name = secrets.random(128);
		console.log(name);
		var params = {
			Bucket: name, 
			CreateBucketConfiguration: {
			LocationConstraint: regions[num-1]
			}
		};
		s3.createBucket(params, function(err, data) {
			if (err) {
				bname.push(name);
				//console.log(err);
				if(num>1){
					newBucket(num-1, bname, regions, new AWS.S3(), data_list, username);
				}
				if(num==1){
					console.log(bname);
					var info_init_bucket ={"uname":username,"s3_id":data_list['Owner']['ID'],"b1":bname[0],"b2":bname[1],"b3":bname[2],"b4":bname[3],"b5":bname[4],"b6":bname[5],"b7":bname[6],"b8":bname[7]};
					console.log(info_init_bucket);
					$.get("../../../registration2.jsp", info_init_bucket, function(data_new_bucket){
						console.log(data_new_bucket);
						step(3);
					})
				}
			}
			else{
				bname.push(name);
				console.log(bname);
				if(num>1){
					newBucket(num-1, bname, regions, new AWS.S3(), data_list, username);
				}
				if(num==1){
					console.log(bname);
					var info_init_bucket ={"uname":username,"s3_id":data_list['Owner']['ID'],"b1":bname[0],"b2":bname[1],"b3":bname[2],"b4":bname[3],"b5":bname[4],"b6":bname[5],"b7":bname[6],"b8":bname[7]};
					console.log(info_init_bucket);
					$.get("../../../registration2.jsp", info_init_bucket, function(data_new_bucket){
						console.log(data_new_bucket);
						step(3);
					})
				}
			}
		});
	}

	// key file
	// browse button
	$('#step2').on('change', '#decrypt-input', function(e){

		if(e.target.files.length!=1){
			alert('Please select key file.');
			return false;
		}

		file = e.target.files[0];
		step(3);
	});

	// upload
	// browse button
	$('#browes_pic_upload').click(function(){
		// Trigger the file browser dialog
		$(this).parent().find('input').click();
	});

	// upload
	// upload to s3
	$("#upload_jsp").click(function(){
		var d = new Date();
		var file_name = $("#upload_pic_location")[0].files[0];
		if(file_name===undefined){
			$("#upload_result").text("Choose a picture to upload.");
		}else{
			//console.log(file_name);
			var up_file_name = d.getTime()+file_name.name+".encrypted";
			//console.log("upload: "+up_file_name);
			var info_upload_pic = {"uname":username,"obj_name":up_file_name,"share_num":$("#shares").val(),"threshold_num":$("#threshold").val()};
			console.log(info_upload_pic);

			$.get("../../../obj_reg.jsp", info_upload_pic, function(data_obj_reg) {
				//$( ".result" ).html( data );
				//alert( "Load was performed." );
				//TODO
				var json_obj_reg = data_obj_reg.toString().trim();
				console.log(data_obj_reg);
				console.log(typeof data_obj_reg);
				json_obj_reg = eval("(" + json_obj_reg + ')');
				console.log(json_obj_reg);
				console.log(typeof json_obj_reg);
				var replica_loc = json_obj_reg["obj_bucket_name"];
				var share_bucket = json_obj_reg["share_bucket_name"];
				var share_name = json_obj_reg["share_name"];
				share_bucket = share_bucket.slice(1).split(",");
				share_name = share_name.slice(1,-1).split(", ");
				console.log(replica_loc);
				console.log(share_bucket);
				console.log(share_name);
				read_to_encry = new FileReader();
				read_to_encry.readAsDataURL(file_name);
				read_to_encry.onload = function(e){

					var encry_key = secrets.random(512); // => key is a hex string
					var secret_shares = secrets.share(encry_key, parseInt($("#shares").val()), parseInt($("#threshold").val()));

					var encrypted = CryptoJS.AES.encrypt(e.target.result, encry_key).toString();
					//console.log(encrypted)
					console.log(typeof encrypted)
					console.log(key);
					AWS.config.update({
						"accessKeyId": key[0],
						"secretAccessKey": key[1]//,
						//"region": "us-east-1"
					});
					AWS.config.apiVersions = {
						s3: '2006-03-01',
					};
					//console.log(AWS.config);

					var s3 = new AWS.S3();
					//Figure_1.png.encrypted
					var params = {
						Bucket: replica_loc,
						Key: up_file_name,
						Body: encrypted,
						ACL: 'authenticated-read'
					};
					var flag = 0;       
					s3.putObject(params, function (err, res) {
						if (err) {
							$("#upload_result").text("Error uploading data: "+err);
						} else {
							// store key shares
							for(var i=0; i<parseInt($("#shares").val()); i++){
								var s3_ = new AWS.S3();
								var params = {
									Bucket: share_bucket[i],
									Key: share_name[i]+'.share',
									Body: secret_shares[i],
									ACL: 'authenticated-read'
								};        
								s3_.putObject(params, function (err, res) {
									if (err) {
										$("#upload_result").text("Error uploading data: "+err);
									} else {
										console.log("share");
										flag += 1;
										if(flag==parseInt($("#shares").val())){
											$("#upload_result").text("Successfully uploaded data");
										}
										
									}
								});
							}
							//results.innerHTML = ("Successfully uploaded data");
						}
					});

				};//end of encry
			});
		}
	})
	
	// add friend
	// add friend button 
	// TODO little bug: data["flag"]?=undefined
	$("#add_friend_button").click(function(){
		
		var fname = $("#username_add_friend").val();

		console.log(fname);
		if($("#username_add_friend").val()===""){
			$("#add_friend_result").text("Enter your friend's username.");
		}else{
			var info_add_friend = {"uname":username,"friend_name":fname};
			console.log(info_add_friend);
			$.get("../../../add_friend.jsp", info_add_friend, function(friend_data){
				// TODO set flag using data
				console.log(friend_data);
				console.log(typeof friend_data);
				var json_friend_data = friend_data.toString().trim();
				json_friend_data = eval("(" + json_friend_data + ')');
				var flag = json_friend_data["flag"];
				console.log(flag);
				if(flag==1){
					console.log("add in s3");
					// TODO set lists using data
					var friend_list = json_friend_data["all_friends_s3_id"].slice(1);
					var buckets = json_friend_data["all_bucket_name"].slice(1).split(",");
					console.log(friend_list);
					console.log(typeof friend_list);
					console.log(buckets);
					console.log(typeof buckets);
					//var friend_list = "id=a5db6947168f90c97ba0c40e70f6fa37ef7a67d5282998d9c6fb94e17b7c3a3e";
					//var buckets = ["testsdfhaergsfgwrgfdfff1112312fasdf"];

					var s3 = new AWS.S3();
					// change acl for 8 buckets
					for(var b=0; b<8; b++){
						var params = {
							Bucket: buckets[b],
							GrantReadACP: friend_list,
							GrantFullControl: "id="+user_s3_id                                     
						};
						s3.putBucketAcl(params, function(err, data) {
							if (err) console.log(err, err.stack); // an error occurred
							else{
								console.log(data);
								$("#add_friend_result").text("Success.");
							}           // successful response
						});
					}
				}else if(flag==3){
					$("#add_friend_result").text("User not exist.");
				}else if(flag==2){
					$("#add_friend_result").text("Already friend.");
				}
				

			})
		}
	})
	// function putshares(s3, index, bnames, onames){
	// 	var params = {
	// 		Bucket: bnames[i],
	// 		Key: up_file_name,
	// 		Body: encrypted,
	// 		ACL: 'authenticated-read'
	// 	};        
	// 	s3.putObject(params, function (err, res) {
	// 		if (err) {
	// 			results.innerHTML = ("Error uploading data: ", err);
	// 		} else {
	// 			putshares(new AWS.S3(), share_bucket.length, share_bucket, share_name);
	// 			//results.innerHTML = ("Successfully uploaded data");
	// 		}
	// 	});
	// }

	$("#delete").click(function(){

		step(4);
	})

	$("#upload_pic").click(function(){

		step(6);
	})

	$("#add_a_friend").click(function(){

		step(7);
	})

	// browse
	// browse button
	// add buttons as friends
	/*
	friend_pic={"pic_loc":[l1,l2,l3],
				"pic_name":[n1,n2,n3],
				"share_loc":[[s11,s22,s33],[s21,s22],[s31,s32,s33]],
				"share_name":[[n11,n22,n33],[n21,s22],[n31,n32,n33]]} 
	*/
	var friend = "";
	var already_shown_friends = [];
	// already_shown_friends.includes("123");
	var done = false;
	$("#browse_friend").click(function(){
		//if(! done){


		$.get("../../../check_friend.jsp", {"uname":username}, function(friend_list_data){
			done = true;
			var bef = "<a class=\"button download green\">";
			var aft = "</a>";


			//TODO change?
			console.log(friend_list_data);
			console.log(typeof friend_list_data);
			var json_friend_list = friend_list_data.toString().trim();
			json_friend_list = eval("(" + json_friend_list + ")");
			console.log(json_friend_list);
			console.log(json_friend_list["all_friend"]);
			console.log(typeof json_friend_list["all_friend"]);
			// TODO
			//var all_friends_list = friend_list_data.slice(1).split(",");
			if(json_friend_list["all_friend"]!=null){
				var all_friends_list = json_friend_list["all_friend"].slice(1).split(",");
				all_friends_list.unshift("Myself");
			}else{
				var all_friends_list = ["Myself"];
			}
			
			console.log(all_friends_list);
			// TODO se with data; friend id list, use for loop
			//var list=["Myself"];
			//all_friends_list = ["Myself"].concat(all_friends_list);
			
			console.log(all_friends_list);
			// for(var j=0;j<20;j++){
			// 	list.push("wsss");
			// }
			//list.push("wsss");
			for(var i=0;i<all_friends_list.length;i++){
				if(! already_shown_friends.includes(all_friends_list[i])){
					already_shown_friends.push(all_friends_list[i]);
					$("#friends_button").append(bef+all_friends_list[i]+aft);
				}
			}
			//$("#friend_list").append("<a class=\"button download green\">abc</a>");

			$("#friends_button .button").click(function(){
				friend = this.text;
				console.log("friend: "+friend);
				if(friend==="Myself"){
					friend=username;
				}
				console.log(friend);

				// TODO modify name
				$.get("../../../download.jsp", {"uname":username, "friend_name":friend}, function(data_pic_info){
					// TODO show pictures here!
					// var pictures = ["hw5_2a.png.encrypted","2.png.encrypted"];
					// var buckets = ["testsdfhaergsfgwrgfdfff1112312fasdf","testsdfhaergsfgwrgfdfff1112312fasdf"];
					// var decry_key = ["12345","12345"];
					console.log(typeof data_pic_info);
					console.log(data_pic_info);
					var json_pic_info = data_pic_info.toString().trim();
					json_pic_info = eval("("+json_pic_info+")");
					console.log(json_pic_info);
					console.log(typeof json_pic_info);
					
					var pic_bef = "<img id=\"";
					var pic_aft = "\" src=\"\" width=\"500px\" alt=\"nothing here\" /><br>"
					// var div_bef = "<input id=\"val";
					// var div_aft = "\" /><br>"
					//var pic_id = null;

					var pictures = [];
					var buckets = [];
					var share_loc = [];
					var share_name = [];

					for(var i=0; i<json_pic_info.length; i++){
						pictures.push(json_pic_info[i]["obj_name"]);
						buckets.push(json_pic_info[i]["obj_bucket_name"]);
						share_loc.push(json_pic_info[i]["share_bucket_name"].slice(1).split(","));
						share_name.push(json_pic_info[i]["share_name"].slice(1).split(", "));
					}
					console.log(pictures);
					console.log(buckets);
					console.log(share_loc);
					console.log(share_name);
					for(var i=0;i<pictures.length;i++){
						load_pic(pictures, buckets, share_loc, share_name, i);
						// console.log(i);
						// //$("#pics").append(pic_bef+"picture_no_"+i+pic_aft);
						// AWS.config.update({
						// 	"accessKeyId": key[0],
						// 	"secretAccessKey": key[1],
						// 	"region": "us-east-1"
						// });
						// AWS.config.apiVersions = {
						// 	s3: '2006-03-01',
						// };
						// console.log(AWS.config);

						// var s3 = new AWS.S3();
						
						// //Figure_1.png.encrypted
						// var params = {
						// 	Bucket: buckets[i], 
						// 	Key: pictures[i]
						// 	};
						// s3.getObject(params, function(err, data) {
						// 	//console.log(i);
						// 	if (err) console.log(err, err.stack); // an error occurred
						// 	else{

						// 		// var get_shares = [];
						// 		// var comb_ = "";
						// 		// for(var i=0; i<5; i++){
										
						// 		// 	var params = {
						// 		// 		Bucket: "testsdfhaergsfgwrgfdfff1112312fasdf", 
						// 		// 		Key: objname[i]+'.share'
						// 		// 		};
						// 		// 	s3.getObject(params, function(err, data) {
						// 		// 		if (err) console.log(err, err.stack); // an error occurred
						// 		// 		else{
						// 		// 			console.log(data.Body.toString('utf-8'));
						// 		// 			get_shares.push(data.Body.toString('utf-8'));
						// 		// 			console.log(get_shares.length);

						// 		// 			// wait for all shares
						// 		// 			if(get_shares.length==5){
						// 		// 				console.log(get_shares);
						// 		// 				comb_ = secrets.combine(get_shares);
						// 		// 				console.log(comb_);
						// 		// 			}
						// 		// 		}
						// 		// 	});
						// 		// }
						// 		console.log(data);
						// 		console.log(data.ETag.slice(1,-1));
						// 		console.log(typeof data.ETag.slice(1,-1));
						// 		$("#pics").append(pic_bef+data.ETag.slice(1,-1)+pic_aft);
						// 		// $("#hidden_div").append(div_bef+data.ETag.slice(1,-1)+div_aft);
						// 		// $('#val'+data.ETag.slice(1,-1)).on('change', function(){

						// 		// });
						// 		//$('#'+data.ETag.slice(1,-1)).attr("src",CryptoJS.AES.decrypt(data.Body.toString('utf-8'), comb_).toString(CryptoJS.enc.Utf8));
						// 		$('#'+data.ETag.slice(1,-1)).attr("src",CryptoJS.AES.decrypt(data.Body.toString('utf-8'), "12345").toString(CryptoJS.enc.Utf8));

						// 	}
						// });
					}
				})
				step(9);
			})
		})
		step(8);
	})

	function load_pic(pictures, buckets, share_loc, share_name, i){
		console.log("test1: "+i);
		//$("#pics").append(pic_bef+"picture_no_"+i+pic_aft);
		AWS.config.update({
			"accessKeyId": key[0],
			"secretAccessKey": key[1]//,
			//"region": "us-east-1"
		});
		AWS.config.apiVersions = {
			s3: '2006-03-01',
		};
		//console.log(AWS.config);

		var s3 = new AWS.S3();
		
		//Figure_1.png.encrypted
		var params = {
			Bucket: buckets[i], 
			Key: pictures[i]
			};
		s3.getObject(params, function(err, data) {
			//console.log(i);
			if (err) console.log(err, err.stack); // an error occurred
			else{
				console.log("test2: "+i);
				var get_shares = [];
				var comb_ = "";
				for(var j=0; j<share_loc[i].length; j++){
						
					var params = {
						Bucket: share_loc[i][j], 
						Key: share_name[i][j]+'.share'
						};
					s3.getObject(params, function(err, data) {
						if (err) console.log(err, err.stack); // an error occurred
						else{
							console.log(data.Body.toString('utf-8'));
							get_shares.push(data.Body.toString('utf-8'));
							console.log(get_shares.length);

							// wait for all shares
							if(get_shares.length==share_loc[i].length){
								console.log(get_shares);
								comb_ = secrets.combine(get_shares);
								console.log(comb_);
							}
						}
					});
				}
				console.log(data);
				console.log(data.ETag.slice(1,-1));
				console.log(typeof data.ETag.slice(1,-1));
				$("#pics").append(pic_bef+data.ETag.slice(1,-1)+pic_aft);
				// $("#hidden_div").append(div_bef+data.ETag.slice(1,-1)+div_aft);
				// $('#val'+data.ETag.slice(1,-1)).on('change', function(){

				// });
				//$('#'+data.ETag.slice(1,-1)).attr("src",CryptoJS.AES.decrypt(data.Body.toString('utf-8'), comb_).toString(CryptoJS.enc.Utf8));
				$('#'+data.ETag.slice(1,-1)).attr("src",CryptoJS.AES.decrypt(data.Body.toString('utf-8'), "12345").toString(CryptoJS.enc.Utf8));

			}
		});
	}

	//  back button
	$("#back_button").click(function(){

		// Reinitialize the hidden file inputs,
		// so that they don't hold the selection 
		// from last time

		// $('#step2 input[type=file]').replaceWith(function(){
		// 	return $(this).clone();
		// });
		console.log(key);
		console.log(have_key, log_in);
		if(log_in && have_key){
			step(3);
		}
		else{
			key = [];
			have_key = false;
			log_in = false;
			step(1);
		}
	});

	$("#register_user").click(function(){
		console.log($("#uname").val());
		console.log($("#pass").val());
		console.log($("#pass2").val());
		if($("#uname").val()===''||$("#uname").val()===null){
			$("#reg").text("enter a username");
		}else if($("#pass").val()===''||$("#pass").val()===null){
			$("#reg").text("enter password");
		}else{
			if($("#pass").val()===$("#pass2").val()){
				var info = {"uname":$("#uname").val(),"pass":hex_sha1($("#pass").val())};
				console.log(info);
				$.post( "../../../registration.jsp", info, function(data) {
					//$( ".result" ).html( data );
					console.log(data);
					console.log(typeof data);
					if(data==1){
						alert("Welcome.");
						username = $("#uname").val();
						log_in = true;
						step(2);
					}else{
						alert("Failed. Try again.");
					}
				});
			}else{
				$("#reg").text("password not the same");
			}
		}
	})

	// move the viewport to the correct step div
	function step(i){

		if(i == 1){
			back.fadeOut();
		}
		else{
			back.fadeIn();
		}

		// Move the #stage div. Changing the top property will trigger
		// a css transition on the element. i-1 because we want the
		// steps to start from 1:

		stage.css('top',(-(i-1)*100)+'%');
	}

});
