var DBname = "opf";
var DBver = "1.0";
var DBdisplay = "localhost javascript opf";
var DBmem = 2000000;

function check_localrecords(){
	db = window.openDatabase(DBname, DBver, DBdisplay, DBmem);
	var len=0;
    try{
        db.transaction(
            function(transaction) {
                var sql =  "select * from maintenance";
                transaction.executeSql(sql, [], function(s,results){
					len = results.rows.length;
					//return len;
					
					
	            }); 
				
				var sql =  "select * from progress";
                transaction.executeSql(sql, [], function(s,results){
                    //alert(results.rows.length);
                    //alert(JSON.stringify(results.rows));
					len=len+results.rows.length;
					//alert(len);
					return len;
				});

          }, function(){ 
				//alert('error');
				navigator.notification.alert(
                	'Error processing',  // message
               		 alertDismissed,         // callback
                	'Try Again',            // title
                	'OK'                  // buttonName
            	);
				// errol
                //callback(null);
            });
    } catch(e) {
        //alert("Error processing SQL: "+ e.message);
		 navigator.notification.alert(
                'Error processing',  // message
                alertDismissed,         // callback
                'Try Again',            // title
                'OK'                  // buttonName
            );
		
        //callback(null);
        //return;
    }
		
}

function create_db(){

    console.log('create a localdb structure....');
    db = window.openDatabase(DBname, DBver, DBdisplay, DBmem);
    db.transaction(populateDB, transaction_error, populateDB_success);

}

function dbmade(){
    if(localStorage.opf=="true"){

        console.log('data base is already exist')
    }else{
        console.log('data base is newly created');
   
        create_db();
    }
}

function transaction_error(error) {
    console.log("Database Error: " + error);
}

function populateDB_success() {
    localStorage.opf = "true";
	localStorage.localrecords=0;
    console.log("db table created.");
}


function populateDB(tx){
    console.log('Create Data base Table...');

    tx.executeSql('DROP TABLE IF EXISTS maintenance');

    var sql = "CREATE TABLE maintenance(id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER(11), issue_title VARCHAR(55), issue_type VARCHAR(55), issue_date datetime, issue_detail text, issue_status VARCHAR(55), issue_image longtext, user_id INTEGER(11), gps_location VARCHAR(255))";

    console.log(sql);
    tx.executeSql(sql);
	
	tx.executeSql('DROP TABLE IF EXISTS issues');

    var sql = "CREATE TABLE issues(id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER(11), issue_id INTEGER(11), issue_title VARCHAR(55), issue_type VARCHAR(55), issue_date datetime, issue_detail text, issue_status VARCHAR(55), issue_image longtext, assigned_to INTEGER(11), assigned_name VARCHAR(55), upload_by VARCHAR(55), gps_location VARCHAR(255))";

    console.log(sql);
    tx.executeSql(sql);
	
	tx.executeSql('DROP TABLE IF EXISTS progress');

    var sql = "CREATE TABLE progress(id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER(11), progress_title VARCHAR(55), percentage INTEGER(11), progress_date datetime, progress_detail text, user_id INTEGER(11), image1 longtext, image2 longtext, image3 longtext, image4 longtext, image5 longtext)";

    console.log(sql);
    tx.executeSql(sql);
}
function save_issues_local(){
	var res=jQuery.parseJSON(localStorage.issues);
	//alert();
	//return false;
	
	
			db = window.openDatabase(DBname, DBver, DBdisplay, DBmem);
		try{
			db.transaction(
				function(transaction) {
					for(i=0; i<res.length; i++){
					 //var query  = "INSERT INTO issues (project_id,issue_id, issue_title, issue_type) VALUES ('"+res[i]['pid']+"','"+res[i]['id']+"','"+res[i]['title']+"','"+res[i]['type']+"')";
					  var query  = "INSERT INTO issues (project_id,issue_id, issue_title, issue_type, issue_date, issue_detail, issue_status, issue_image, assigned_to, assigned_name, upload_by, gps_location) VALUES ('"+res[i]['pid']+"','"+res[i]['id']+"','"+res[i]['title']+"','"+res[i]['type']+"','"+res[i]['date']+"','"+res[i]['details']+"','"+res[i]['status']+"','"+res[i]['image']+"','"+res[i]['assigned_to']+"','"+res[i]['assigned_name']+"','"+res[i]['upload_by']+"','"+res[i]['title']+"')";
					 
						console.log(query);
						transaction.executeSql(query, [], function(s,results){
					
					});
					}
					load_issues_local();
				}, function(){ // error
					navigator.notification.alert('Processing Error.',alertDismissed,'Try Again!','OK');
				  //alert("Error processing");
				});
		} catch(e) {
		    //alert("Error processing SQL: "+ e.message);
			 navigator.notification.alert('Processing Error.',alertDismissed,'Try Again!','OK');
			return;
		}
}

function load_issues_local(){
	
	var issue_id=localStorage.issue_id;
	if(issue_id > 0){
    	var sql =  "select * from issues where issue_id="+issue_id;
		//var sql =  "select from issues";
	}else{
		var sql =  "select * from issues where project_id="+localStorage.pid;
	}
	//console.log(sql);
	//return false;
	    db = window.openDatabase(DBname, DBver, DBdisplay, DBmem);
    try{
        db.transaction(
            function(transaction) {
                //var sql =  "select * from issues where project_id="+localStorage.pid;
				console.log(sql);
                transaction.executeSql(sql, [], function(s,results){
                    //alert(results.rows.length);
                    //alert(JSON.stringify(results.rows));
					//return false;
					var len = results.rows.length;
					if(len > 0){
						
						var str='';
					
						 for (i = 0; i < len; i++){
								var issue_id   =    results.rows.item(i).issue_id;
								var pid   =    results.rows.item(i).project_id;
								var title   =    results.rows.item(i).issue_title;
								var type   =    results.rows.item(i).issue_type;
								var date =    results.rows.item(i).issue_date;
								var detail =    results.rows.item(i).issue_detail;
								var status =    results.rows.item(i).issue_status;
								var image =    results.rows.item(i).issue_image;
								var assigned_to =    results.rows.item(i).assigned_to;
								var assigned_name =    results.rows.item(i).assigned_name;
								var upload_by =    results.rows.item(i).upload_by;
								var location =    results.rows.item(i).gps_location;
								if(upload_by==null || upload_by=='null'){
									upload_by='';
								}
								if(assigned_name==null || assigned_name=='null'){
									assigned_name='';
								}
								
							//alert(assigned_name);
							str+='<div class="row">'+
								'<div class="col s12">'+
									'<div class="entry">'+
										//'<img src="img/tours1.jpg" alt="">'+
										'<div class="content">'+
											'<h5>'+title+'<span style="text-align:right; float:right; font-size:12px;"> '+formatDate(date)+'</span></p></h5>'+
											'<p><span style="text-align:left">By: '+upload_by+'</span><span style="float:right">'+assigned_name+'</span></p>'+
											'<p>Type: '+type+'</p>'+
											//'<p>Location: '+rs[i]['location']+'</p>'+
											'<button class="button" onClick="window.location.href=\'https://www.google.com/maps/place/'+location+'\'">View Location</button>'+
											'<p>Details: '+detail+'</p>'+
											'<div><a href="'+image+'" target="blank"><img src="'+image+'" width=100% /></a></div>'+
											'<div style="padding-top:20px">'+
												'<span>Status: '+status+'</span>';
											if(status!="Resolved"){
												if(localStorage.userid==assigned_to){
														str+='<button id="status-btn'+issue_id+'" class="button status-btn" onClick="update_issue_status('+issue_id+');">Resolved</button>';
												}
											}
										str+='</div></div>'+
									'</div>'+
								'</div>'+
							'</div>';
							};
							
						}else{
							str='<p style="text-align:center;">No Issue for this project.</p>';
					}
						
					$('#content').html(str);
					console.log(str);
					if(localStorage.issue_id > 0){
						
						if(localStorage.alert_status==0){
							update_read_status(localStorage.alert_id);
									
						}
					}
					localStorage.removeItem('issue_id');
            });

          }, function(){ 
				//alert('error');
				navigator.notification.alert(
                	'Error processing',  // message
               		 alertDismissed,         // callback
                	'Try Again',            // title
                	'OK'                  // buttonName
            	);
				// errol
                //callback(null);
            });
    } catch(e) {
        //alert("Error processing SQL: "+ e.message);
		 navigator.notification.alert(
                'Error processing',  // message
                alertDismissed,         // callback
                'Try Again',            // title
                'OK'                  // buttonName
            );
		
        //callback(null);
        //return;
    }
	
	
	
}

function delete_old_issues(){
	var issue_id=localStorage.issue_id;
	if(issue_id > 0){
    	var sql =  "Delete from issues where issue_id="+issue_id;
	}else{
		var sql =  "Delete from issues where project_id="+localStorage.pid;
	}
	//var sql =  "Delete from issues";
	console.log(sql);
    db = window.openDatabase(DBname, DBver, DBdisplay, DBmem);
    try {
        db.transaction(function (tx) {
            tx.executeSql(sql, [], function(){
             //alert('Deleted');
			  save_issues_local();
			 console.log('Deleted');
            }, transaction_error);
        });
    } catch (e){
        //alert("Error processing SQL: "+ e.message);
		//alert('Delete Fail');
		navigator.notification.alert(
                'Error deleting',  // message
                alertDismissed,         // callback
                'Try Again',            // title
                'OK'                  // buttonName
            );
        return;
    }
}


function save_issue(){

	var project_id=$('#project_id').val();
	var title=$('#title').val();;
	var type=$('#type').val();
	var detail=$('#detail').val();
	
	if(project_id==""){
		$('#err').html("*Select a project");	
		$('#project_id').focus();
		return false;
	}
	if(title==""){
		$('#err').html("*Title required");	
		$('#title').focus();
		return false;
	}
	if(type==""){
		$('#err').html("*Select a type");	
		$('#type').focus();
		return false;
	}
	if(detail==""){
		$('#err').html("*Details required");	
		$('#detail').focus();
		return false;
	}
				
	var image=localStorage.image;
	var user_id=localStorage.userid;
	var gpslocation=localStorage.gpslocation;
	var date=new Date().getTime() / 1000;
	//alert(date);
	//image='abc';
	
	/*if(!image || image==''){
		navigator.notification.alert('Take a Picture.',alertDismissed,'Failed!','OK');
		return false;
	}*/
		
    db = window.openDatabase(DBname, DBver, DBdisplay, DBmem);
    try{
        db.transaction(
            function(transaction) {
				
				 var query  = "INSERT INTO maintenance (project_id, issue_title, issue_type, issue_date, issue_detail, issue_status, issue_image, user_id, gps_location) VALUES ('"+project_id+"','"+title+"','"+type+"','"+date+"','"+detail+"','New','"+image+"',"+user_id+",'"+gpslocation+"')";
				 
				  //var query  = "INSERT INTO maintenance (issue_type) VALUES ('"+type+"')";
				  
				 console.log(query);
                transaction.executeSql(query, [], function(s,results){
					 localStorage.localrecords=parseInt(localStorage.localrecords)+1;
					 //alert('Issue Saved.');
					 navigator.notification.alert('Issue Saved.',alertDismissed,'Success!','OK');
					 //check_localrecords();
					 localStorage.image='';
					 window.location='projects_list.html';
					 
                });
            }, function(){ // error
				navigator.notification.alert('Processing Error.',alertDismissed,'Try Again!','OK');
              //alert("Error processing");
            });
    } catch(e) {
       // alert("Error processing SQL: "+ e.message);
		 navigator.notification.alert('Processing Error.',alertDismissed,'Try Again!','OK');
        return;
    }
}
function save_progress(){
	//var fotoArr = ["Saab", "Volvo", "BMW"];
	//alert('rec= '+localStorage.localrecords);
	var project_id=$('#project_id').val();
	var title=$('#title').val();;
	var percent=$('#percent').val();
	var detail=$('#detail').val();
	
	if(project_id==""){
		$('#err').html("*Select a project");	
		$('#project_id').focus();
		return false;
	}
	if(title==""){
		$('#err').html("*Title required");	
		$('#title').focus();
		return false;
	}
	if(percent==""){
		$('#err').html("*Percentage required");	
		$('#percent').focus();
		return false;
	}
	if(detail==""){
		$('#err').html("*Details required");	
		$('#detail').focus();
		return false;
	}
	var foto1='';
	var foto2='';
	var foto3='';
	var foto4='';
	var foto5='';
	/*for(i=0; i<fotoArr.length; i++){
		var n=i+1;
		 //var foto=fotoArr[i];
	 }*/
	 
	 //var fotoArr.length;
switch (fotoArr.length) {
    case 1:
        foto1=fotoArr[0];
        break;
    case 2:
		foto1=fotoArr[0];
        foto2=fotoArr[1];
        break;
    case 3:
        foto1=fotoArr[0];
        foto2=fotoArr[1];
		foto3=fotoArr[2];
        break;
    case 4:
        foto1=fotoArr[0];
        foto2=fotoArr[1];
		foto3=fotoArr[2];
		foto4=fotoArr[3];
        break;
    case 5:
        foto1=fotoArr[0];
        foto2=fotoArr[1];
		foto3=fotoArr[2];
		foto4=fotoArr[3];
		foto5=fotoArr[4];
}
				
	var user_id=localStorage.userid;
	//alert(user_id);
	var date=new Date().getTime() / 1000;
	
		
    db = window.openDatabase(DBname, DBver, DBdisplay, DBmem);
    try{
        db.transaction(
            function(transaction) {
				
				 var query  = "INSERT INTO progress (project_id, progress_title, percentage, progress_date, progress_detail, user_id, image1, image2, image3, image4, image5) VALUES ('"+project_id+"','"+title+"','"+percent+"','"+date+"','"+detail+"',"+user_id+",'"+foto1+"','"+foto2+"','"+foto3+"','"+foto4+"','"+foto5+"')";
				 
				  //var query  = "INSERT INTO maintenance (issue_type) VALUES ('"+type+"')";
				  
				 console.log(query);
                transaction.executeSql(query, [], function(s,results){
					//alert('rec2= '+localStorage.localrecords);
					 localStorage.localrecords=parseInt(localStorage.localrecords)+1;
					 //alert('rec3= '+localStorage.localrecords);
					 //alert(localStorage.localrecords);
					 //alert('Issue Saved.');
					 navigator.notification.alert('Progress Saved.',alertDismissed,'Success!','OK');
					 window.location='projects_list.html';
					 
                });
            }, function(){ // error
				navigator.notification.alert('Processing Error.',alertDismissed,'Try Again!','OK');
              //alert("Error processing");
            });
    } catch(e) {
       // alert("Error processing SQL: "+ e.message);
		 navigator.notification.alert('Processing Error.',alertDismissed,'Try Again!','OK');
        return;
    }
}


var arr = new Array();
function save_data_online(){
	//$('#pending_state').html('<img src="img/loaderbar.gif" width="150px">');
	//return false;
   if(online()){
    db = window.openDatabase(DBname, DBver, DBdisplay, DBmem);
    try{
        db.transaction(
            function(transaction) {
                var sql =  "select * from maintenance";
                transaction.executeSql(sql, [], function(s,results){
                    //alert(results.rows.length);
                    //alert(JSON.stringify(results.rows));
					//return false;
					var len = results.rows.length;
					
					 //arr = [];
					 for (i = 0; i < len; i++){
						 arr[i]={
							id   :    results.rows.item(i).id,
							pid   :    results.rows.item(i).project_id,
							title   :    results.rows.item(i).issue_title,
							type   :    results.rows.item(i).issue_type,
    						date :    results.rows.item(i).issue_date,
    						detail :    results.rows.item(i).issue_detail,
							status :    results.rows.item(i).issue_status,
							image :    results.rows.item(i).issue_image,
							uid :    results.rows.item(i).user_id,
							location :    results.rows.item(i).gps_location,
							
							}
						};
						//var obj = { 0: 'a', 1: 'b', 2: 'c' };
						//alert(arr[0]['date']);
						//return false;
						//alert(arr.length);
						console.log(arr.length+' issue');
						if(arr.length < 1){
							//alert('No Issue Record.');
							console.log('No Issue Record.');
							//navigator.notification.alert('No Record.',alertDismissed,'Try Again!','OK');
							save_progress_online();
							//localStorage.localrecords=0;
							//$('#err').html('');
							return false;
						}else{
							$('#pending_state').html('<img src="img/loaderbar.gif" width="150px">');
							upload_issues(0);
									
						}
            });

          }, function(){ 
				//alert('error');
				navigator.notification.alert(
                	'Error processing',  // message
               		 alertDismissed,         // callback
                	'Try Again',            // title
                	'OK'                  // buttonName
            	);
				// errol
                //callback(null);
            });
    } catch(e) {
        //alert("Error processing SQL: "+ e.message);
		 navigator.notification.alert(
                'Error processing',  // message
                alertDismissed,         // callback
                'Try Again',            // title
                'OK'                  // buttonName
            );
		
        //callback(null);
        //return;
    }
	
	}//online
}

function upload_issues(rec){
	//check_localrecords();
	
		if(rec<arr.length){
			console.log(rec+' < '+arr.length);
			$.post(surl+'save_issues_online.php',{
				pid:arr[rec]['pid'],
				title:arr[rec]['title'],
    			type : arr[rec]['type'],
    			dt :arr[rec]['date'],
    			detail :arr[rec]['detail'],
				status :arr[rec]['status'],
				image :arr[rec]['image'],
				uid :arr[rec]['uid'],
				location :arr[rec]['location'],
				
				},function(response){
					//alert('='+response);
					console.log('='+response);
					if(response==1){
									localStorage.localrecords=parseInt(localStorage.localrecords)-1;
									delete_issues_record(arr[rec]['id']);
									rec=rec+1;
									//$('#pending_state').html('<img src="img/loaderbar.gif" width="150px">');
									upload_issues(rec);
								
							}else{
								//alert(response);
								//alert('Failed');
								console.log('Failed');
								navigator.notification.alert('Failed.',alertDismissed_save_online,'Try Again!','OK');
								$('#pending_state').html(localStorage.localrecords+' record(s) pending');
								//$('#progress').html('Failed, Try Again');
							}
			});
		}else{
			save_progress_online();
		}
	
}

function alertDismissed_save_online2(){
	window.location='projects_list.html';	
}
function alertDismissed_save_online(){
	//window.location='home.html';	
}
function delete_issues_record(id){
	//alert('deleted');
    var sql =  "Delete from maintenance where id="+id;
	console.log(sql);
    db = window.openDatabase(DBname, DBver, DBdisplay, DBmem);
    try {
        db.transaction(function (tx) {
            tx.executeSql(sql, [], function(){
             //alert('Deleted');
			 console.log('Deleted');
            }, transaction_error);
        });
    } catch (e){
        //alert("Error processing SQL: "+ e.message);
		//alert('Delete Fail');
		navigator.notification.alert(
                'Error deleting',  // message
                alertDismissed,         // callback
                'Try Again',            // title
                'OK'                  // buttonName
            );
        return;
    }
}


var arr2 = new Array();
function save_progress_online(){
   if(online()){
    db = window.openDatabase(DBname, DBver, DBdisplay, DBmem);
    try{
        db.transaction(
            function(transaction) {
                var sql =  "select * from progress";
                transaction.executeSql(sql, [], function(s,results){
                    //alert(results.rows.length);
                    //alert(JSON.stringify(results.rows));
					//return false;
					var len = results.rows.length;
					
					 //arr = [];
					 for (i = 0; i < len; i++){
						 arr2[i]={
							id   :    results.rows.item(i).id,
							pid   :    results.rows.item(i).project_id,
							title   :    results.rows.item(i).progress_title,
							percent   :    results.rows.item(i).percentage,
    						date    :    results.rows.item(i).progress_date,
    						detail :    results.rows.item(i).progress_detail,
							uid  :    results.rows.item(i).user_id,
							foto1  :    results.rows.item(i).image1,
							foto2  :    results.rows.item(i).image2,
							foto3  :    results.rows.item(i).image3,
							foto4  :    results.rows.item(i).image4,
							foto5  :    results.rows.item(i).image5,
							
							}
						};
						console.log(arr2.length+' progress');
						//return false;
						if(arr2.length < 1){
							//alert('No Progress Record.');
							if(arr.length < 1){
							console.log('No Progress Record.');
							navigator.notification.alert('No Record.',alertDismissed,'Try Again!','OK');
							localStorage.localrecords=0;
							//$('#err').html('');
							}else{
								var total=parseInt(arr.length)+parseInt(arr2.length);
								navigator.notification.alert(total+' Record(s) Uploaded.',alertDismissed_save_online,'Success!','OK');
								$('#pending_state').html(total+' Record(s) Uploaded.');
							}
							return false;
						}else{
							$('#pending_state').html('<img src="img/loaderbar.gif" width="150px">');
							upload_progress(0);
								
						}
            });

          }, function(){ 
				//alert('error');
				navigator.notification.alert(
                	'Error processing',  // message
               		 alertDismissed,         // callback
                	'Try Again',            // title
                	'OK'                  // buttonName
            	);
				$('#pending_state').html(localStorage.localrecords+' record(s) pending');
				// errol
                //callback(null);
            });
    } catch(e) {
        //alert("Error processing SQL: "+ e.message);
		 navigator.notification.alert(
                'Error processing',  // message
                alertDismissed,         // callback
                'Try Again',            // title
                'OK'                  // buttonName
            );
			$('#pending_state').html(localStorage.localrecords+' record(s) pending');
		
        //callback(null);
        //return;
    }
	
	}//online
}

function upload_progress(rec){
	
		if(rec<arr2.length){
			console.log(rec+' < '+arr2.length);
			$.post(surl+'save_progress_online.php',{
				pid:arr2[rec]['pid'],
				title:arr2[rec]['title'],
    			percent : arr2[rec]['percent'],
    			dt :arr2[rec]['date'],
    			detail :arr2[rec]['detail'],
				uid :arr2[rec]['uid'],
				foto1 :arr2[rec]['foto1'],
				foto2 :arr2[rec]['foto2'],
				foto3 :arr2[rec]['foto3'],
				foto4 :arr2[rec]['foto4'],
				foto5 :arr2[rec]['foto5'],
				
				
				},function(response){
					//alert('='+response);
					console.log('='+response);
					if(response==1){
								localStorage.localrecords=parseInt(localStorage.localrecords)-1;
								delete_progress_record(arr2[rec]['id']);
								rec=rec+1;
								$('#pending_state').html('<img src="img/loaderbar.gif" width="150px">');
								upload_progress(rec);
							
					}else{
							//alert(response);
							//alert('Failed');
							console.log('Failed');
							navigator.notification.alert('Failed.',alertDismissed_save_online,'Try Again!','OK');
							$('#pending_state').html(localStorage.localrecords+' record(s) pending');
							//$('#progress').html('Failed, Try Again');
					}
				});
		}else{
			//alert(parseInt(arr.length)+parseInt(arr2.length));
			var total=parseInt(arr.length)+parseInt(arr2.length);
			navigator.notification.alert(total+' Record(s) Uploaded.',alertDismissed_save_online,'Success!','OK');
			//navigator.notification.alert(arr2.length+' Progress  Uploaded.',alertDismissed_save_online2,'Success!','OK');
			 $('#pending_state').html('No Record Pending');
			 
		}
	
}


function delete_progress_record(id){
	//alert('deleted');
    var sql =  "Delete from progress where id="+id;
	console.log(sql);
    db = window.openDatabase(DBname, DBver, DBdisplay, DBmem);
    try {
        db.transaction(function (tx) {
            tx.executeSql(sql, [], function(){
             //alert('Deleted');
			 console.log('Deleted');
            }, transaction_error);
        });
    } catch (e){
        //alert("Error processing SQL: "+ e.message);
		//alert('Delete Fail');
		navigator.notification.alert(
                'Error deleting',  // message
                alertDismissed,         // callback
                'Try Again',            // title
                'OK'                  // buttonName
            );
        return;
    }
}
