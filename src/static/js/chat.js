var list, ai_msg, ans_cd, s1, s2, s3, s4, ai_msg_img, ai_msg_img2, qa_record;
var img_display, more_txt, more_contents, goods_descriptions, goods_images, goods_links, select_yn, link_func;
var data;
var flag_scenario = true;		//시나리오 시작 체크 변수
var cnt_select = 0;					//선택 질문 체크 변수
var ajax_ing = false;				//ajax 실행중 체크
var q_type	= "1";					//질문타입 1:객관식, 2:주관식, 3:API, 4:페이지연결
var s1 = new Array();
var s2 = new Array();
var s3 = new Array();
var s4 = new Array();
var arr_disp_link = new Array();
var arr_link = new Array();
var arr_link_msg = new Array();	//링크 이동 후 채팅창으로 돌아왔을 때 메시지
var bef_s = new Array();		//이전 질문ID 기록 저장
var scenario_talk_check;
var ans_delay = 1000;

function start(wsUri){
	websocket = new WebSocket(wsUri);
	websocket.onopen = function(ev) {
		var sess_cid = sessionStorage.getItem('sess_cid');
		//prepare json data
		var msg = {
			message: "@@start@@",
			name: getCookie("uuid_" + gubun),
			loc : 'user',
			color : '',
			aname : 'null',
			cid : sess_cid ,
			room : gubun
		};
		log(JSON.stringify(msg));

		
		websocket.send(JSON.stringify(msg));
	}
	websocket.onmessage = function(ev) {
		var msg = JSON.parse(ev.data); 
		var type = msg.type; 
		var umsg = msg.message; 
		var uname = msg.name; 
		var ucolor = msg.color; 
		var room = msg.room; 
		var cid = msg.cid ;
		var uloc = msg.loc ;


		if(uname == $("#chat").find("#userid").val()) {
			if(type == 'usermsg'){
				if(uloc == 'admin'){
					display_ai_msg("", "", "loading");
					display_ai_msg(umsg,"","");

					//상담사채팅
					ele_disabled(false);

				}else if( uloc =='user'){
					display_user_msg(umsg);
				}
			}
		} 


	};
	websocket.onclose = function(){
		setTimeout(function(){
			start(wsUri)
		}, 5000);
	};
	websocket.onerror = function(evt) {
		//log(evt)
	};
}

//세션 저장
function session_save(ans_cd, s1, s2, s3, s4){
	sessionStorage.setItem('ans_cd', ans_cd);
	sessionStorage.setItem('s1', s1);
	sessionStorage.setItem('s2', s2);
	sessionStorage.setItem('s3', s3);
	sessionStorage.setItem('s4', s4);
}
//세션 초기화
function init_session(){
	sessionStorage.clear();
	sessionStorage.setItem('ans_cd', "");
	sessionStorage.setItem('s1', "");
	sessionStorage.setItem('s2', "");
	sessionStorage.setItem('s3', "");
	sessionStorage.setItem('s4', "");
	
	ele_disabled(false);
}

//스크롤 하단으로 내리기
function scroll_move(delay){	
	setTimeout(function(){
		var sc = $("#chat").find("#talk")[0].scrollHeight;
		var addHeight = $('#chat').find(".ans.left .messages").last().outerHeight();		
		$('#chat').find("#talk").stop(false,true).animate({
			'scrollTop' : sc + addHeight + 10			
		}, (ans_delay / 1.2), _ease_cubic);		
	}, delay);

}

//변수 초기화
function init_variable(){

	file_path ="";
	file_size = "";
	ai_msg = "";
	more_txt = "";
	more_contents = "";
	ans_cd = "";
	ai_msg_img = "";
	ai_msg_img2 = "";
	img_display = "";
	q_type = "1";
	arr_disp_link[0] = "";
	arr_link[0] = "";
	arr_disp_link[1] = "";
	arr_link[1] = "";
	arr_disp_link[2] = "";
	arr_link[2] = "";
	arr_disp_link[3] = "";
	arr_link[3] = "";
	arr_disp_link[4] = "";
	arr_link[4] = "";
	scenario_talk_check = "";
	goods_descriptions = "";
	goods_images = "";
	goods_links = "";
	select_yn = "";
	qa_record = "";
	s1 = Array();
	s2 = Array();
	s3 = Array();
	s4 = Array();
	
	$("#chat").find("#talk").removeAttr("data-val");
	$("#chat").find("#talk").removeAttr("data-val2");	
	
}

//결과 파싱
function parse_result(getData){
	//log(getData);


	list = $.parseJSON(getData);

	file_path = list.file_path;
	file_size = list.file_size;
	ai_msg = list.ai_msg;	

	ai_msg2 = list.ai_msg2;	
	ai_msg3 = list.ai_msg3;


	more_txt = list.more_txt;
	more_contents = list.more_contents;
	ans_cd = list.answercode;
	ai_msg_img = list.ai_msg_img;
	ai_msg_img2 = list.ai_msg_img2;
	img_display = list.img_display;
	q_type = list.qustType;
	arr_disp_link[0] = list.disp_link1;
	arr_link[0] = list.link1;
	arr_link_msg[0] = list.link1_msg;
	arr_disp_link[1] = list.disp_link2;
	arr_link[1] = list.link2;			
	arr_link_msg[1] = list.link2_msg;
	arr_disp_link[2] = list.disp_link3;
	arr_link[2] = list.link3;
	arr_link_msg[2] = list.link3_msg;
	arr_disp_link[3] = list.disp_link4;
	arr_link[3] = list.link4;	
	arr_link_msg[3] = list.link4_msg;
	arr_disp_link[4] = list.disp_link5;
	arr_link[4] = list.link5;
	arr_link_msg[4] = list.link5_msg;
	scenario_talk_check = list.scenario_talk_check;
	goods_descriptions = list.goods_descriptions;
	goods_question_txt = list.goods_question_txt;
	goods_images = list.goods_images;
	goods_links = list.goods_links;
	select_yn = list.select_yn;
	qa_record	= list.qa_record;
	last_insert_id = list.last_insert_id;


	for (i=0; i < list.questionID.length; i++){
		s1[i] = list.questionID[i].s1;
		s2[i] = list.questionID[i].s2;
		s3[i] = list.questionID[i].s3;
		s4[i] = list.questionID[i].s4;
	}


	if (ai_msg_img == protocol + location.hostname + "/_data/talk_images/"){
		ai_msg_img = "";
	}	
	
}

function Chat() {
    this.send_data = send_data;
    this.get_data = get_data;
    this.chk_chat = chk_chat;

}

	//새창 띄우기(Close체크)
	function openDialog(uri, tit, linkNum) {
		//console.log("openDialog: "+ location.host);

 		if(uri == "") return;
		var findString = location.host ;
		if(uri.indexOf(findString) == -1) {
			window.open (uri , '_blank');
			return
		}
		if(uri.indexOf("tel:") != -1)
		{
			//window.open(uri);	
			location.href= uri ;
		}
		else 
		{
			//버튼 클릭 시 버튼 이름 노출
			display_user_msg($("#chat").find(".btn_holder:last a").eq(linkNum).find("span").text());

			if(app_yn == "Y") 
			{

				// linkNum 세션 저장
				$.ajax({
					url: chat_ajax_url + '/ajax_set_linknum.php', 
					type : 'post',
					data : 'linkNum=' + linkNum,
					crossOrigin: true,
					async:false,
					datatype : 'json',
					timeout : 30000,
					error:function(request,status,error){
						alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
					},
					success : function(getData){
						log(getData);
					}
				});

				/*
				* @ 전화번호일 경우
				*/
				if(uri.indexOf("tel:") != -1)
				{
					window.open(uri);	
				}
				/*
				* @ 새 창
				*/
				else
				{
					android_interface("ACTIVITY", uri, tit);
				}

			} 
			else if (iframe == "Y")
			{
				//console.log("a");

				if(uri.indexOf("tel:") != -1)
				{
					window.open(uri);	
				}

				else 
				{


					
					if(uri.indexOf(".pdf") != -1) // pdf의 경우 프로그램 실행이되서 아웃창으로
					{
						window.open(uri);	
					}
					else{
					
						/////$('#iframe_popup').find('iframe').attr("src", uri + '&iframe=' + iframe);
						$('#iframe_popup').find('iframe').attr("src", uri );
						$('#iframe_popup').show();

					
						// linkNum 세션 저장
						$.ajax({
							url: chat_ajax_url + '/ajax_set_linknum.php', 
							type : 'post',
							data : 'linkNum=' + linkNum,
							crossOrigin: true,
							async:false,
							datatype : 'json',
							timeout : 30000,
							error:function(request,status,error){
								alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
							},
							success : function(getData){
								log(getData);
							}
						});
						
					}

				}
			
			}
			else 
			{
				//새 창 호출, 닫힘 체크하여 메시지 노출
				var win = window.open(uri);
				var interval = window.setInterval(function() {					
					try {
						if (win == null || win.closed) {							
							window.clearInterval(interval);
							openDialogViewMsg(linkNum);								
						}
					}
					catch (e) {}
					
				}, 1000);
				
				return win;
			}
		}		
	}

	//새 창 이후 메시지 노출
	function openDialogViewMsg(linkNum, infoData)
	{

		/*
		* @ 앱(플랫폼)
		*/
		if(app_yn == "Y") 
		{
			/*
			* @ 전입 / 전출 일 경우
			*/
			if(infoData == "Y" || infoData == "N"){
				$("#chat").find("#talk").attr({
					"data-val2" : infoData
				});				
			}
			
			//시나리오
			if (sessionStorage.getItem('ans_cd') == 4)
			{				
				//다음 시나리오 호출
				get_data("3", parseInt(linkNum) + 1, sessionStorage.getItem('s1'), sessionStorage.getItem('s2'), sessionStorage.getItem('s3'), sessionStorage.getItem('s4'), "완료", "");				
			}
			else
			{

				//일반질문
				var info_data = infoData;	//데이터 or 고정 메시지

				//관리자가 등록한 문구가 있거나 보여줘야할 문구가 있을 경우 실행		            								
				if (arr_link_msg[linkNum] != "" || info_data != ""){
					
					var msg = "";
					//관리자가 지정한 메시지

					if(removeSpan(arr_link_msg[linkNum]) != ""){
						msg = removeSpan(arr_link_msg[linkNum]).replace("{{data}}", info_data);	//문자 치환
					}else{
						//고정 메시지
						msg = info_data;
					}
					
					display_ai_msg("", "", "loading");
					display_ai_msg(msg, "", "");
					init_variable();					
				}
			
			}
		}
		/*
		* @ 보이는ARS/문자/기타
		*/
		else
		{
			/*
			* 신청완료가 된 경우 메시지 뿌려줌
			* x버튼 또는 페이지를 그냥 닫을 경우 메시지 뿌려주지 않음
			*/
			if($('#chat').find("#talk").hasClass("complete") || $('#chat').find("#talk").hasClass("confirm")){
				
				//시나리오
				if (sessionStorage.getItem('ans_cd') == 4){
					
					//다음 시나리오 호출
					get_data("3", parseInt(linkNum) + 1, sessionStorage.getItem('s1'), sessionStorage.getItem('s2'), sessionStorage.getItem('s3'), sessionStorage.getItem('s4'), "완료", "");
					//$("#chat").find("#talk").removeAttr("data-val2");
					

				}else{
					
					//일반질문

					var info_data = $("#chat").find("#talk").attr("data-val");	//데이터 or 고정 메시지


					//관리자가 등록한 문구가 있거나 보여줘야할 문구가 있을 경우 실행		            								
					if (arr_link_msg[linkNum] != "" || info_data != ""){
						
						var msg = "";
						//관리자가 지정한 메시지
	
						if(removeSpan(arr_link_msg[linkNum]) != ""){
							msg = removeSpan(arr_link_msg[linkNum]).replace("{{data}}", info_data);	//문자 치환
						}else{
							//고정 메시지
							msg = info_data;
						}
						
						display_ai_msg("", "", "loading");
						display_ai_msg(msg, "", "");
						init_variable();
						
					}				
				}
				$('#chat').find("#talk").removeClass("complete").removeClass("confirm");				
			}	
		}
		
	}




	//새 창 이후 메시지 노출 close
	function openDialogViewMsgClose(msg)
	{
		display_ai_msg("", "", "loading");
		display_ai_msg(msg, "", "");
		init_variable();
	}



//채팅 상대 체크
function chk_chat(){

	var who;
	var data = "site_key=" + gubun + "&user_id=" + getCookie("uuid_" + gubun); 
	$.ajax({
		url: chat_ajax_url + '/ajax_chk_chat.php', 
		type : "post",
		data : data,
		async:false,
		datatype : "json",
		timeout : 10000,  
		error:function(request,status,error){
			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		},
		success : function(getData){
				var err_res = getData.err_res;
				var err_msg = getData.err_msg;
				who = getData.who;
		}
	});
	return who;

}

//관리자와 채팅 저장
function chatInsert(msg_t, msg_m, msg_s1, msg_s2, msg_s3, msg_s4, view_msg){

	msg_t	= msg_t  != "" ? msg_t : 0;
	msg_m	= msg_m  != "" ? msg_m : "";
	msg_s1	= msg_s1 != "" ? msg_s1 : 0;
	msg_s2	= msg_s2 != "" ? msg_s2 : 0;
	msg_s3	= msg_s3 != "" ? msg_s3 : 0;
	msg_s4	= msg_s4 != "" ? msg_s4 : 0;

	if (msg_m == ""){ 
		alert("메시지를 입력해주세요."); 
		return;
	}
	var sess_cid = sessionStorage.getItem('sess_cid');
	
	var msg = {
		message: msg_m,
		name: getCookie("uuid_" + gubun),
		loc : 'user',
		color : "",
		cid : sess_cid ,
		room : gubun
	};
	websocket.send(JSON.stringify(msg));
	display_user_msg(msg_m);
	
	$("#chat").find("input[name=talkText]").val("");

	data = "site_key=" + gubun + "&msg_m="+ msg_m + "&view_msg="+ view_msg+"&uuid=" + $("#uuid").val();
	$.ajax({
		url: chat_ajax_url + '/ajax_insert_data.php', 
		type : "post",
		data : data,
		async:false,
		datatype : "json",
		timeout : 10000,  
		error:function(request,status,error){
			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		},
		success : function(getData){
			//log(getData);
			var err_res = getData.err_res;
			var err_msg = getData.err_msg;
		}
	});

}

//누구와 채팅중인지 체크하여 분기
function send_data(){
	
	//하단 메뉴 내리기
	$('#chat').find('#quick_slider_open').removeClass('active');
    quick_close();      
    
	if(!ajax_ing){
		var talkText = $("#chat").find("input[name=talkText]").val();
		var talkText_check = $("#chat").find("#talkText_check").val();
		var se_ans_cd = sessionStorage.getItem('ans_cd');
		var se_s1	  = sessionStorage.getItem('s1');
		var se_s2	  = sessionStorage.getItem('s2');
		var se_s3	  = sessionStorage.getItem('s3');
		var se_s4	  = sessionStorage.getItem('s4');

		//유효성검사
		if(!validate_chk(talkText_check))	return;

		if (se_ans_cd == 4){		//시나리오 답변
			se_ans_cd = 3;			//시나리오 답변 요청
		}else if(se_ans_cd == 1){	//순위 정보 요청
			se_ans_cd = 2;			//순위 정보 요청에 대한 답변   se_ans_cd = 2;
		}
		//log(chat.chk_chat());
		if(chat.chk_chat() == "ai"){
			get_data(se_ans_cd, talkText, se_s1, se_s2, se_s3, se_s4, talkText, "");
		}else{
			//상담사 채팅
			init_session();
			chatInsert(se_ans_cd, talkText, se_s1, se_s2, se_s3, se_s4, talkText, "");
		}
	}else{
		return;
	}

}

//서버로 전송하여 답변 받아오기
function get_data(msg_t, msg_m, msg_s1, msg_s2, msg_s3, msg_s4, view_msg, pick_img ,  problem , qa_list){

	msg_t	= msg_t  != "" ? msg_t : 0;
	msg_m	= msg_m  != "" ? msg_m : "";
	msg_s1	= msg_s1 != "" ? msg_s1 : 0;
	msg_s2	= msg_s2 != "" ? msg_s2 : 0;
	msg_s3	= msg_s3 != "" ? msg_s3 : 0;
	msg_s4	= msg_s4 != "" ? msg_s4 : 0;
	pick_img = pick_img != "" ? pick_img : "";


    var select_info_msg = document.getElementById("select_info_msg").value;

	$('#chat').find("#talkText").attr('type', 'text'); 
	$('#chat').find("#talkText_check").val("all");

	if (msg_m == ""){ 
		alert("메시지를 입력해주세요."); 
		return;
	}

	if (cnt_select == 0) {
		display_user_msg(view_msg);
	}	
	


	data = "site_key=" + gubun + "&msg_t=" + msg_t +"&msg_m="+ msg_m +"&msg_s1="+ msg_s1 +"&msg_s2="+ msg_s2 +"&msg_s3="+ msg_s3 +"&msg_s4="+ msg_s4;
	data += "&view_msg="+ view_msg + "&pick_img=" + pick_img + "&q_type=" + q_type + "&api_name=" +  scenario_talk_check;
	data += "&uuid=" + $("#uuid").val() + "&userid=" + $("#userid").val() + "&customer_name=" + $("#customer_name").val() + "&customer_tel_no=" + $("#customer_tel_no").val()+ "&qa_record=" + $("#qa_record").val() + "&engine_no=" + $("#engine_no").val() + "&problem=" + problem + "&qa_list=" + qa_list  + "&push_uid=" + $("#push_uid").val()


	$.ajax({
		url: './curl_io.php',
		type : 'post',
		data : data,
		crossOrigin: true,
		async:false,
		datatype : 'json',
		timeout : 30000,  
		beforeSend : function(){
			ajax_ing = true;
			if(cnt_select == 0){
				display_ai_msg('','','loading');
			}
			$('#chat').find("input[name=talkText]").val('');
		},
		error:function(request,status,error){
			alert('code:'+request.status+'\n'+'message:'+request.responseText+'\n'+'error:'+error);
		},
		success : function(getData){
			//console.log("getData-->"+getData);
			$('#chat').find("#chatting_last_time").val( new Date().getTime());
			
					
			s1 = Array();	//배열초기화
			s2 = Array();	//배열초기화
			s3 = Array();	//배열초기화
			s4 = Array();	//배열초기화

			parse_result(getData);


			if(scenario_talk_check == 'number'){
				$('#chat').find("#talkText").attr('type', 'number'); 
			}

			// qa 저장 옵션 Y이면 디비 저장하기
			if(qa_record == "Y"){
				$('#chat').find("#qa_record").val("Y");
			}else{
				$('#chat').find("#qa_record").val("N");			
			}
		

			
			//답변처리
			var ans_fnc = function(){
			
				session_save(ans_cd, s1, s2, s3, s4);	//세션 저장

				if (ans_cd == 0){	//일반 상담

					var result = general_ai(cnt_select, msg_m, ai_msg, ans_cd, view_msg, gubun, last_insert_id);
					display_ai_msg(result.msg, result.btn, "");
			
				} else if(ans_cd == 1){	//선택 질문

					var result = select_ai(ai_msg, 2);
					display_ai_msg(select_info_msg, result.btn, "");	
					
					socket_msg(msg_m, ai_msg, ans_cd, view_msg, gubun, last_insert_id);
					
				} else if(ans_cd == 3){	//선택 질문 -1 
					
					var result = select_ai(ai_msg, 0);
					display_ai_msg(result.msg, result.btn, "");			

					socket_msg(msg_m, ai_msg, ans_cd, view_msg, gubun, last_insert_id);
									
				} else if(ans_cd == 4){	//시나리오
					//시나리오 일 경우만 이전 질문ID 배열 저장
					var arr_rows = bef_s.length;
					bef_s[arr_rows] = new Array();
					bef_s[arr_rows].push(msg_m, msg_s1, msg_s2, msg_s3, msg_s4);

					var result = scenario_ai(flag_scenario, ai_msg, scenario_talk_check);
					display_ai_msg(result.msg, result.btn, "");

					socket_msg(msg_m, ai_msg, ans_cd, view_msg, gubun, last_insert_id);

										
				}else if(ans_cd == 10){	//설문지					
					var result = research_ai(flag_scenario, ai_msg, ai_msg2, ai_msg3, scenario_talk_check);
					display_ai_msg(result.msg, result.btn, "");		
					
					socket_msg(msg_m, ai_msg, ans_cd, view_msg, gubun, last_insert_id);

				}else if(ans_cd == 11){	//설문지응모완료			
					var result = research_ai(flag_scenario, ai_msg, ai_msg2, ai_msg3, scenario_talk_check);
					display_ai_msg(result.msg, result.btn, "");	
					
					socket_msg(msg_m, ai_msg, ans_cd, view_msg, gubun, last_insert_id);

				}else if(ans_cd == 20){	//디비검색
					var result = db_research_ai(flag_scenario, ai_msg, ai_msg2, ai_msg3, scenario_talk_check);
					display_ai_msg(result.msg, result.btn, "");	

					socket_msg(msg_m, ai_msg, ans_cd, view_msg, gubun, last_insert_id);

				}else if(ans_cd == 21){	//디비검색
					var result = db_research_ai(flag_scenario, ai_msg, ai_msg2, ai_msg3, scenario_talk_check);
					display_ai_msg(result.msg, result.btn, "");	
					
					socket_msg(msg_m, ai_msg, ans_cd, view_msg, gubun, last_insert_id);
				}else if(ans_cd == 30){	//교육마감후 검색
					var result = db_research_ai2(flag_scenario, ai_msg, ai_msg2, ai_msg3, scenario_talk_check);
					display_ai_msg(result.msg, result.btn, "");
					
					socket_msg(msg_m, ai_msg, ans_cd, view_msg, gubun, last_insert_id);
				}else if(ans_cd == 100){	//설문지					
					var result = research_ai(flag_scenario, ai_msg, ai_msg2, ai_msg3, scenario_talk_check);
					display_ai_msg(result.msg, result.btn, "");	
					
					socket_msg(msg_m, ai_msg, ans_cd, view_msg, gubun, last_insert_id);
				}else {	//기타 모듈 연동 시			
					//var result = general_ai(cnt_select, msg_m, ai_msg);
					var result = general_ai(cnt_select, msg_m, ai_msg, ans_cd, view_msg, gubun, last_insert_id);
					display_ai_msg(result.msg, result.btn, '');

		
				}

				ajax_ing = false;
			}

			setTimeout(ans_fnc, 500);
		}
	});
		
}





//포토썸내일 ( 이미지 클릭 옵션 )
function go_imageClick(osrc){
	//window.open (url, '_blank');
	window.open ('/photoslide.php?i='+osrc, '_blank');

}



//서버를 통한 메시지 전달 
function socket_msg(msg_m, ai_msg, ans_cd, view_msg, gubun, last_insert_id)
{
	
	//console.log("서버를 통해 관리자에게전달 : " + msg_m, ai_msg, ans_cd, view_msg, gubun );

	//서버를 통해 전달 하는 내용 2020-01-07				
	var sess_cid = sessionStorage.getItem('sess_cid');
	var msg = {
		message: msg_m,
		ai_msg: ai_msg,
		ans_cd: ans_cd,
		view_msg: view_msg,
		name: getCookie("uuid_" + gubun),
		loc : 'user',
		color : last_insert_id,
		cid : sess_cid ,
		room : gubun 
	};
	//console.log(msg);

	websocket.send(JSON.stringify(msg));

	//서버를 통해 전달 하는 내용 2020-01-07
}




			
//AI 메시지
function display_ai_msg(msg, btn, gubun){
	

	//console.log("display_ai_msg-->"+msg);
	/* 링크제거 */
	//$('#chat').find(".ans.left a").attr("href","javascript:;");

	if(gubun == "loading"){
		/* 로딩 삽입 */
		$("#chat").find(".talk_body").append(ans_template(msg_template(loading_template())));
	    $('#chat').find(".ans.left").last().css({
	        'opacity' : '0'
	    });	
	    /*
	     * 답변 말풍선 애니메이션
	     * easeInOutCubic
	     * easeInOutCirc
	     * easeOutElastic
	     * easeInOutBack
	     */
	    $('#chat').find(".ans.left").last().transit({
	        'x' : '0',
	        'opacity' : '1',
	    }, (ans_delay / 1.5) , 'easeInOutBack');		



		var quickbtn_val = $('.quickbtn').val(); 

		//디자인 타입이 0일 경우만 처리 
		var chat_design_tp = $("#chat_design_tp").val();
		if(chat_design_tp == 1)		{
			//메인에 버튼 노출 2019-09-09
			$(".talk_body").append( quickbtn_val );
		
			init_swipe_slick();
		
		}

		/* 로딩중일 때 막기 */
		ele_disabled(true);
		scroll_move(0);

	} else {

		
		/* 메시지가 없다면 스크롤 내리기 */
		if(msg == ""){
			scroll_move(ans_delay);
			return;	
		}
		var sp_msg = msg.split("||");
		var msg_cnt = sp_msg.length;
		//console.log(msg_cnt);


		for (i=0; i < msg_cnt; i++ ) {
			delay = ans_delay * ( i + 1 );

			(function(i) {

				setTimeout(function() {

					/* 로딩 삭제 */
					$('#chat').find(".loading").remove();

					/* 답변 말풍선 보이지않게 */
					$('#chat').find(".ans.left .messages .message").last().css({
						'opacity' : '0'
					});


					/* 답변 말풍선에 답변 넣기 */
					if( (msg_cnt-1) == i){
						$('#chat').find(".ans.left .messages .message .text").last().append(sp_msg[i]).append(img_template(this.ai_msg_img)).css({
							'margin-left' : '-20px'
						});	
					}else{
						$('#chat').find(".ans.left .messages .message .text").last().append(sp_msg[i]).css({
							'margin-left' : '-20px'
						});	
					}

					/*
					 * 답변 말풍선 애니메이션
					 * easeInOutCubic
					 * easeInOutCirc
					 * easeOutElastic
					 * easeInOutBack
					 */
					$('#chat').find(".ans.left .messages .message").last().transit({
						'x' : 20,
                        'opacity' : 1
					}, (ans_delay / 1.5), 'easeInOutBack');
					
					/* 다음 메시지가 있다면 로딩 삽입 */
					if (i < msg_cnt-1 ){
						$('#chat').find(".ans.left .messages").last().append(msg_template(loading_template()));
					}					

					
					// 이미지 클릭시 새창
					$(".messages:last").find('img').each(function(){
						//console.log( "-->"+ $(this).attr('src') ) ;
						$(".messages:last img").attr("onclick", "javascript:go_imageClick(this.src);");
					});

					/* 스크롤 내리기 */
					scroll_move(ans_delay / 3);

				}, delay);

			})(i);
			
			/* 마지막 메시지에 버튼, 시간삽입 */
			if (i == msg_cnt-1){
				setTimeout(function() {
					$("#chat").find(".message").last().append(time_template()).append(btn).find(".btn_holder").css({
                    	'margin-left' : '-20px'
					});

					/* 
					 * 풀기
					 * 시나리오이면서 객관식이거나 페이지연결 일 경우 풀지 않음
					*/

					if( !((sessionStorage.getItem('ans_cd') == 4) && (q_type== 1 || q_type == 4)) ){
						ele_disabled(false);
					}

					scroll_move(0);
					//스와이프
					init_swipe();
				}, delay + (delay / 3) );
			}
		}
	}
}










//사용자 메시지
function display_user_msg(msg){

	$('#chat').find(".talk_body").append(que_template(msg_template(msg)))

    $('#chat').find(".ans.right .messages .message").last().css({
        'opacity' : '0'
    });

    /* 답변 말풍선에 답변 넣기 */
    $('#chat').find(".ans.right .messages .message").last().prepend(time_template()).css({
        'margin-right' : '-20px'
    });

    /*
     * 답변 말풍선 애니메이션
     * easeInOutCubic
     * easeInOutCirc
     * easeOutElastic
     * easeInOutBack
     */
    $('#chat').find(".ans.right .messages .message").last().transit({
    	
        'x' : '-20px',
        'opacity' : '1'
        
    }, ans_delay / 2, 'easeInOutBack');
    
	scroll_move(0);
}

//텍스트필드,버튼 disabled 처리
function ele_disabled(bool){
	if(bool){
		//막기
		$("#chat").find("input[name=talkText]").attr("disabled", true); 
		$("#talkText").css("background-color","#ddd");
		$("#talkText").css("background-color","#ddd");
		$('input').addClass('placeholdercolor');
		$("#talkText").attr("placeholder", "새로운 검색어 입력 시 '홈'버튼 클릭");


		$("#chat").find("#send, #quick_slider_open, button").attr("disabled", true);
		$("#chat").find("input[name=talkText]").attr("disabled", true); 
		//$("#chat").find("#talk").css("overflow", "hidden");
		$("#chat").find("#talk").addClass("disabled");
		$("#chat").find("a").attr({'onclick' : 'return false'});
		$("#chat").find("input[name=talkText]")
	}else{
		//풀기
		$("#chat").find("#send, #quick_slider_open, button").attr("disabled", false);
		$("#chat").find("input[name=talkText]").attr("disabled", false); 
		$("#chat").find("#talk").css("overflow", "");
		$("#chat").find("#talk").removeClass("disabled");
		$("#chat").find("a").removeAttr('onclick');
	}
	
	//시나리오 일경우 스크롤 가능하도록
	if(this.flag_scenario){
		$("#chat").find("#talk").css("overflow", "");
	}
}

//시나리오 끝내기
function scenario_exit(){
	init_session();
	this.flag_scenario = true;
	$('#chat').find("#talkText_check").val("all");
	$("#chat").find("#talkText").attr("type", "text"); 
	bef_s = Array();	//시나리오 종료 시 배열 초기화

	chatting_start("C");
	
	//init_top_images();
	scenario_talk_check = "";



	//close 하면 올리기
	fixed_menu_box_close();
	//close 하면 올리기

}

function fixed_menu_box_close(){
	if( $(".fixed_option_box").hasClass('close') ){
		 $('.fixed_option_box').hide();
		 $('.fixed_option_box').removeClass("close");     
	}else{
		$('.fixed_option_box').show();            
		$('.fixed_option_box').addClass("close");    
	}
}


//quick_slider 버튼클릭
function talk_start_click(msg){
	get_data(0, msg , '0', '0', '0', '0', msg, '');
	
	
	if( $("#chat_design_tp").val()   == 3  ) {

	//내리기 타입 3
	 $('.fixed_option_box').hide();
	 $('.fixed_option_box').removeClass("close");     

	}
	else{
		$("#chat").find("button#quick_slider_open").trigger("click");
	}


}

function talk_start_quick_click(msg)
{
	
	$(".slick-slider").removeClass();
	$( 'h1' ).removeClass( 'abc' );
	var quick_Split = $("#domain_start_sentence_list").val().split('@@');
	get_data(0, quick_Split[msg] , '0', '0', '0', '0', quick_Split[msg], '');
	$(".btn_full").attr("disabled",false);
 }


//채팅 시작
function chatting_start(str){
	init_session();
	init_variable();
	
	if(str == "S" || typeof(str) === "undefined"){			
		//처음 채팅 시작시 인사말 보여주기
		var welcom_msg = $("#chat").find("#welcom_msg").val();
		var start_sentence = $("#chat").find("#domain_start_sentence").val();	
		var ai_msg = welcom_msg + "||" + start_sentence;
	}else if(str == "C"){	
		//채팅 중 시작 문구만 보여주기
		var start_sentence = $("#chat").find("#domain_start_sentence").val();	
		var ai_msg = start_sentence;
	}


	
	if(str == "EDU"){
		//처음 채팅 시작시 인사말 보여주기
		var welcom_msg = $("#chat").find("#welcom_msg").val();
		var start_sentence = $("#chat").find("#domain_start_sentence2").val();	
		var ai_msg = welcom_msg + "||" + start_sentence;
		
		var result = domain_start_education(ai_msg);

		display_ai_msg("", "", "loading");
		display_ai_msg(result.msg, result.btn, "");

	}	
	else if(str == "RESEARCH"){
		//처음 채팅 시작시 인사말 보여주기
		var welcom_msg = $("#chat").find("#welcom_msg").val();
		var start_sentence = $("#chat").find("#domain_start_sentence2").val();	
		var ai_msg = welcom_msg + "||" + start_sentence;
		
		
		var result = domain_start_education(ai_msg);

		display_ai_msg("", "", "loading");
		display_ai_msg(result.msg, result.btn, "");

	}
	
	else if(str == "RESEARCH2"){
		//처음 채팅 시작시 인사말 보여주기
		var welcom_msg = $("#chat").find("#welcom_msg").val();
		var start_sentence = $("#chat").find("#domain_start_sentence2").val();	
		var ai_msg = welcom_msg + "||" + start_sentence;
		
		
		var result = domain_start_education(ai_msg);

		display_ai_msg("", "", "loading");
		display_ai_msg(result.msg, result.btn, "");

	}
	
	
	else if(str == "EDU_END"){
		//처음 채팅 시작시 인사말 보여주기
		var welcom_msg = $("#chat").find("#welcom_msg").val();
		var start_sentence = $("#chat").find("#domain_start_sentence3").val();	
		var ai_msg = welcom_msg + "||" + start_sentence;
		
		var result = domain_start_education_end(ai_msg);

		display_ai_msg("", "", "loading");
		display_ai_msg(result.msg, result.btn, "");

	}else if(str == "SLEEVE_FINISH"){
		//처음 채팅 시작시 인사말 보여주기
		var welcom_msg = $("#chat").find("#welcom_msg").val();
		var start_sentence = $("#chat").find("#domain_start_sentence2").val();	
		var ai_msg = welcom_msg + "||" + start_sentence;
		
		var result = sleeve_finish(ai_msg);

		display_ai_msg("", "", "loading");
		display_ai_msg(result.msg, result.btn, "");

	}else if(str == "SLEEVE_FINISH_VIEW"){
		//처음 채팅 시작시 인사말 보여주기
		var welcom_msg = $("#chat").find("#welcom_msg").val();
		var start_sentence = $("#chat").find("#domain_start_sentence2").val();	
		var ai_msg = welcom_msg + "||" + start_sentence;
		
		var result = sleeve_finish_view(ai_msg);

		display_ai_msg("", "", "loading");
		display_ai_msg(result.msg, result.btn, "");

	}else if(str == "PERFORMANCE"){
		//PERFORMANCE
		var welcom_msg = $("#chat").find("#welcom_msg").val();
		var start_sentence = $("#chat").find("#domain_start_sentence2").val();	
		var ai_msg = welcom_msg + "||" + start_sentence;
		
		var result = performance_view(ai_msg);

		display_ai_msg("", "", "loading");
		display_ai_msg(result.msg, result.btn, "");

	}else if(str == "EXCELFILE_ICON"){
		//EXCELFILE_ICON
		var welcom_msg = $("#chat").find("#welcom_msg").val();
		var start_sentence = $("#chat").find("#domain_start_sentence2").val();	
		var ai_msg = welcom_msg + "||" + start_sentence;
		
		var result = icon_view(ai_msg);

		display_ai_msg("", "", "loading");
		display_ai_msg(result.msg, result.btn, "");

	}else{
		display_ai_msg("", "", "loading");
		display_ai_msg(ai_msg, "", "");	
	}
	
    $('#chat').find('#quick_slider_open').addClass('active');
	quick_open();
}

//일반 답글
function general_ai(cnt_select, msg_m, ai_msg, ans_cd, view_msg, gubun, getData)
{
	
	//log("***일반 질문 시작***");
	var btn = "";
	var ai_msg = ai_msg.replace(/{/gi, "").replace(/}/gi, "");
	//최초 1회만 선택 질문 시작 
	if (cnt_select < 1 && sessionStorage.getItem('ans_cd') == 0 && (sessionStorage.getItem('s1') =='00000' || sessionStorage.getItem('s1') == "")){
		
		//log("***최초1회 선택질문 시작***");
		this.cnt_select++;
		get_data(1, msg_m, 0, 0, 0, 0, msg_m, '');
		//log("***최초1회 선택질문 끝***");

	
		return {
	        msg: "",
	        btn: ""
	    };
	}else{
		//일반상담에만 특별히 추가
		socket_msg(msg_m, ai_msg, ans_cd, view_msg, gubun, last_insert_id);	
	
	}
	
	if (this.more_txt != "" && typeof(this.more_txt) !== "undefined"){
		ai_msg += "<a href='javascript:;' id='more_txt'>"+this.more_txt+"</a>";
	}



	/* 스와이프 이미지*/

	//log("***  여기 스와이프 이미지1 ***");

	if (goods_descriptions != "")
	{
		var desc			= this.goods_descriptions.replaceAll("\n","<br>").split(",");
		var question_txt	= this.goods_question_txt.replaceAll("\n","<br>").split(",");
		var img				= this.goods_images.split(",");
		var links			= this.goods_links.split(",");
		var images_url		= "http://"+location.hostname+"/_data/talk_images/";


		//log("***  여기 스와이프 이미지1 *** -->"+  question_txt[i] );

		btn += "<div class='swiper-container' style='margin-left: -110px;    margin-top: 10px;'><div class='swiper-wrapper'>";
		for (i=0; i <= desc.length-1; i++){
			btn += "<div class='swiper-slide goods' data-val='"+links[i] + "' ><div class='message_balloon'><div class='message_balloon_wrap'>";
			btn += "<div class='goods_images' aria-label='이미지'>";
			btn += "<img src='"+images_url+img[i]+"' alt='' style='width:240px;'>";
			btn += "</div></div></div>";
			btn += "<ul class='list_btn'>"
			btn += "<li><a href='javascript:get_data(1,\""+question_txt[i].replaceAll("||",",")+"\",\"\",\"\",\"\",\"\",\""+question_txt[i].replaceAll("||",",")+"\",\"\");'><span>"+question_txt[i].replaceAll("||",",")+"</span></a></li>"
			if (links[i]){
				btn += "<li>";
				btn += '	<a href="' + links[i] +'" target="_blank" class="btn_lg btn_color_5 round_10 link">';
				btn += "		<i class='ico_ui_link'></i><span>링크 열기</span>";
				btn += "	</a>";
				btn += "</li>";
			}
			btn += "</ul></div>";	
		}
		btn += "</div></div>";	
	 
		init_swipe();
		scroll_move("contents")
	}



	//log("***  여기 스와이프 이미지 ***");

	/* 스와이프 이미지*/

	var btn = "";


	/* 버튼생성 시작 */	
	for (i = 0; i < 5; i++){
		if (this.arr_disp_link[i]){
			var openLink = "javascript:openDialog('"+ arr_link[i] +"','" + arr_disp_link[i] + "',  "+ i +")";
			
			if(i == 0){
				btn = "<div class='btn_holder'><ul>";
			}
			btn += "<li>";
			btn += '	<a href="' + openLink +'" class="btn_lg btn_color_5 round_10 link" data-val="'+arr_link[i]+'" data-val2="'+ i +'">';
			btn += "	<i class='ico_ui_link'></i><span>" + arr_disp_link[i] + "</span>";
			btn += "	</a>";
			btn += "</li>";
		}
	}



	//질문 끝나면 질문목록보기 버튼 추가 
	//링크가 없으면 ul 태그 추가 
	btn += arr_disp_link[0] == ""  || typeof(arr_disp_link[0]) === "undefined" ? "<div class='btn_holder'><ul>" : "";
	btn += "<li><a href=javascript:chatting_start('C');init_swipe(); class='btn_lg btn_color_9 arrow round_10'><i class='ico_ui_arrow_right'></i><span>처음 질문으로 가기</span></a></li>";
	btn += '</ul></div>';
	/* //버튼생성 끝 */

	
	this.cnt_select = 0;
	return {
        msg: ai_msg,
        btn: btn
    };


}

//선택 질문
function select_ai(ai_msg, ans_cd){
//	log("***선택질문시작***");
	var split_msg = ai_msg.split("|");
	var ai_msg = this.select_info_msg;
	var btn = "";

	/* 버튼생성 시작 */
	for (i=0; i <= split_msg.length-2; i++){
		if(split_msg[i].replaceAll(" ","") != ""){
			var num = i + 1 ;
			if (i == 0) {
				btn = "<div class='btn_holder'><ul>";
			}
			btn = btn + "<li><a href='javascript:get_data(" + ans_cd + ",\"" + split_msg[i] + "\",\"" + s1[i]+ "\",\"" + s2[i] + "\",\"" + s3[i] + "\",\"" + s4[i] + "\",\"" + split_msg[i] + "\",\" \");' class='btn_lg btn_color_5 arrow round_10 link'><i class='ico_ui_arrow_right'></i><span>" + split_msg[i] + "</span></a></li>";
			if (i == split_msg.length-2) btn = btn + "</div></div>";
		}
	}
	/* //버튼생성 끝 */
	
	this.cnt_select = 0;	//선택질문 끝난 후 원래 상태로 변경

	//log("***선택질문끝***");
	return {
		msg : ai_msg,
		btn : btn
	}
}

//시나리오 답글
function scenario_ai(flag_scenario, ai_msg, scenario_talk_check, cnt ){
	/* 2019-12-12 수정*/
	ai_msg = ai_msg.replace(/<p>/gi,"").replace(/<\/p>/gi,"").replace(/<p><br><\/p>/,"")  ;
	//ai_msg = ai_msg.replace(/<b>/gi,"").replace(/<\/b>/gi,"") ;
	/* 2019-12-12 수정*/

	var split_msg = ai_msg.replace(/{/gi, "").replace(/}/gi, "").split("$$$");
	var ai_msg = "";
	var btn = "";
	var other_chat = $("#chat").find("#other_chat").val();

	$('#chat').find("#talkText_check").val(scenario_talk_check);
		
	if (flag_scenario){	//시나리오 시작 시 추가
		//log("***시나리오 시작***");
		this.flag_scenario = false;
	}
	if (sessionStorage.getItem('s1') == 0){	//시나리오 종료 시 추가
		//log("***시나리오 종료***");
		this.flag_scenario = true;
		init_session();	//시나리오 종료 시 기본 세션제외 모두 삭제
		bef_s = Array();	//시나리오 종료 시 배열 초기화
	}
	
	btn = "";


/* 스와이프 이미지*/

//log("*** 스와이프 이미지 ***");



if (goods_descriptions != ""){
	if (goods_question_txt != ""){
		var desc			= this.goods_descriptions.replaceAll("\n","<br>").split(",");
		var question_txt	= this.goods_question_txt.replaceAll("\n","<br>").split(",");
		var img				= this.goods_images.split(",");
		var links			= this.goods_links.split(",");
		var images_url		= "http://"+location.hostname+"/_data/talk_images/";
		btn += "<div class='swiper-container' style='margin-left: -110px;    margin-top: 10px;'><div class='swiper-wrapper'>";
		for (i=0; i <= desc.length-1; i++){
			//btn += "<div class='swiper-slide goods' data-val='"+links[i] + "' onclick='javascript:window.open(\"" + links[i] + "\",\"_blank\");'><div class='message_balloon'><div class='message_balloon_wrap'>";
			btn += "<div class='swiper-slide goods' data-val='"+links[i] + "' ><div class='message_balloon'><div class='message_balloon_wrap'>";
			btn += "<div class='goods_images' aria-label='이미지'>";
			btn += "<img src='"+images_url+img[i]+"' alt='' style='width:240px;'>";
			btn += "</div></div></div>";
			//btn += "<ul class='list_btn'><li><a href='javascript:;'><span>"+desc[i].replaceAll("||",",")+"</span></a></li></ul></div>";
			btn += "<ul class='list_btn'>"
			btn += "<li><a href='javascript:get_data(1,\""+question_txt[i].replaceAll("||",",")+"\",\"\",\"\",\"\",\"\",\""+question_txt[i].replaceAll("||",",")+"\",\"\");'><span>"+question_txt[i].replaceAll("||",",")+"</span></a></li>"


			if (links[i]){
			btn += "<li>";
			btn += '	<a href="' + links[i] +'" target="_blank" class="btn_lg btn_color_5 round_10 link">';
			btn += "		<i class='ico_ui_link'></i><span>링크 열기</span>";
			btn += "	</a>";
			btn += "</li>";
			}
			btn += "</ul></div>";
		}
		btn += "</div></div>";	
		init_swipe();
		scroll_move("contents")
	}
}


//log("*** 스와이프 이미지 ***");


/* 스와이프 이미지*/
	/* 버튼생성 시작 */
	for (i=0; i <= split_msg.length-1; i++){
		//console.log("--->"+split_msg[i].replace(/<(\/p|p)([^>]*)>/gi,"") );
		if (i == 0) {
			ai_msg = ai_msg + split_msg[i] + "";	//질문
		}else {
			//보기 버튼 생성
			if (i == 1) {			
				btn += "<div class='btn_holder'><ul>";
			}
			btn += "<li><a href='javascript:get_data(3," + i + ",\"" + s1[0] + "\",\"" + s2[0] + "\",\"" + s3[0] + "\",\"" + s4[0] + "\",\"" + split_msg[i].replace(/<(\/p|p)([^>]*)>/gi,"") + "\",\" \");' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>" + split_msg[i].replace(/<(\/p|p)([^>]*)>/gi,"")+ "</span></a></li>";
			if (i == split_msg.length-1) {
				btn += "</ul></div>";
			}
		}
	}
	//링크 버튼 생성
	for (i = 0; i < 5; i++){
		if (this.arr_disp_link[i]){
			var openLink = "javascript:openDialog('"+ arr_link[i] +"','" + arr_disp_link[i] + "',  "+ i +")";
			
			if (i == 0){	
				btn += "<div class='btn_holder'><ul>";
			}

			if ($("#chat").find("#talk").attr("data-val2") == "N" && arr_link[i].indexOf("move_out_in_apply") != -1){

			}else{
				btn += "<li>";
				btn += '	<a href="' + openLink +'"  class="btn_lg btn_color_5 round_10 link" data-val="'+arr_link[i]+'" data-val2="'+ i +'">';
				btn += "		<i class='ico_ui_link'></i><span>" + arr_disp_link[i] + "</span>";
				btn += "	</a>";
				btn += "</li>";
			}
		}
		
	}
	
	if (sessionStorage.getItem("s1") != 0){
		if (other_chat == 0){
			btn += arr_disp_link[0] == "" ? "<div class='btn_holder'><ul>" : "";
			/*
			if (bef_s.length > 1){
				btn += "<li>";
				btn += "	<a href='javascript:before_qus();' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>이전 질문으로 가기</span></a>";
				btn += "</li>";
			}
			*/
			btn += "<li>"
			btn += "	<a href='javascript:scenario_exit();init_swipe();' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>다른 질문하기</span></a>";
			btn += "</li>";
			btn += arr_disp_link[0] == "" ? '</ul></div>' : "";
		}
	}

	if (this.flag_scenario){	//시나리오 종료 시 추가
		//질문 끝나면 질문목록보기 버튼 추가 
		//링크가 없으면 ul 태그 추가 
		btn += arr_disp_link[0] == "" ? "<div class='btn_holder'><ul>" : "";
		btn += "<li>";
		btn += "	<a href=javascript:chatting_start('C');init_swipe(); class='btn_lg btn_color_5 arrow round_10><i class='ico_ui_arrow_right'></i><span>처음 질문으로 가기</span></a>";
		btn += "</li>";
		btn += '</ul>';
	}

	/* //버튼생성 끝 */
	
	return {
		msg : ai_msg,
		btn : btn
	};
	
}

//퀵메뉴 open
function quick_open(){
    $('#chat').find('#footer').stop(false,true).transit({

        'bottom' : '0'

    }, 300, 'easeInOutCubic');
    
	$('#chat').find('#talk').css({
		
		'padding-bottom' : '120px'	
			
	});
	
	scroll_move(100);
}


















/*******************설문지***************/

function research_ai(flag_scenario, ai_msg, ai_msg2, ai_msg3, scenario_talk_check, cnt ){
	var split_msg = ai_msg.replace(/{/gi, "").replace(/}/gi, "").split("@@@");
	var split_problem = ai_msg2.replace(/{/gi, "").replace(/}/gi, "").split("@@@");
	var ai_msg = "";
	var ai_msg2 ; 

	var btn = "";
	var other_chat = $("#chat").find("#other_chat").val();
	var engine_no   = $("#engine_no").val();






	var edu_video_file = $("#edu_video_file").val()  ;
	var edu_excel_file = $("#edu_excel_file").val()  ;
	var edu_image_file = $("#edu_image_file").val()  ;
	var edu_image_file2 = $("#edu_image_file2").val()  ;
	var edu_engine_name = $("#edu_engine_name").val()  ;

	var push_gubun = $("#push_gubun").val()  ;




	//전에 링크 사용 못하게 처리
	$('.btn_lg').prop('href', '#');


	$('#chat').find("#talkText_check").val(scenario_talk_check);
	btn +=  "<div class='btn_holder'>"+ai_msg2+"</div> ";





	if (ai_msg3){
	btn += "<div class='btn_holder'><ul>";
	btn += "<li>";
	btn += "	<a href='javascript:chatting_start(\"EDU\")' class=\"btn_lg btn_color_5 arrow round_10\"><i class=\"ico_ui_arrow_right\"></i><span>재시험 보기</span></a>";
	btn += "</li>";
	btn += "</ul></div>";
	}






	if (flag_scenario){	//시나리오 시작 시 추가
		//log("***시나리오 시작***");
		this.flag_scenario = false;
	}
	if (sessionStorage.getItem('s1') == 0){	//시나리오 종료 시 추가
		//log("***시나리오 종료***");
		this.flag_scenario = true;
		init_session();	//시나리오 종료 시 기본 세션제외 모두 삭제
		bef_s = Array();	//시나리오 종료 시 배열 초기화
	}
	
	/* 버튼생성 시작 */
	for (i=0; i <= split_msg.length-1; i++){
		if (i == 0) {
			ai_msg = ai_msg + split_msg[i] + "";	//질문
		}else {
			//보기 버튼 생성
			if (i == 1) {
				btn = "<div class='btn_holder'><ul>";
			}

 

			if(push_gubun =="RESEARCH"){
			btn += "<li><a href='javascript:get_data(10 ," + i + ",\"" + s1[0] + "\",\"" + s2[0] + "\",\"" + s3[0] + "\",\"" + s4[0] + "\",\"" + split_msg[i].replace("<p>","").replace("</p>","") + "\",\" \",\"" + split_problem[i].replace("<p>","").replace("</p>","") + "\",\"" + ai_msg3+ "\",\"" + i + "\");' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>" + split_msg[i].replace("<p>","").replace("</p>","") + "</span></a></li>";
			if (i == split_msg.length-1) {
				btn += "</ul></div>";
			}
			}else{
			btn += "<li><a href='javascript:get_data(100 ," + i + ",\"" + s1[0] + "\",\"" + s2[0] + "\",\"" + s3[0] + "\",\"" + s4[0] + "\",\"" + split_msg[i].replace("<p>","").replace("</p>","") + "\",\" \",\"" + split_problem[i].replace("<p>","").replace("</p>","") + "\",\"" + ai_msg3+ "\",\"" + i + "\");' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>" + split_msg[i].replace("<p>","").replace("</p>","") + "</span></a></li>";
			if (i == split_msg.length-1) {
				btn += "</ul></div>";
			}
			}






		}
	}






			/*

 
			btn += "<div class='btn_holder'><ul>" ;

			if (edu_excel_file){
			var openLink = "javascript:filedownload_researching('/_data/upload/"+edu_excel_file+"')";
			btn += "<li>";
			btn += '	<a href="' + openLink +'" id=\"edu_image_file\" class=\"btn_lg btn_color_5 arrow round_10\"><i class=\"ico_ui_arrow_right\"></i><span>'+edu_engine_name+'<br>열람하기</span></a>';
			btn += "</li>";
			}





			if (edu_image_file){

			var openLink = "javascript:filedownload_researching('/_data/upload/"+edu_image_file+"')";

			btn += "<li>";
			btn += '	<a href="' + openLink +'" id=\"edu_image_file\" class=\"btn_lg btn_color_5 arrow round_10\"><i class=\"ico_ui_arrow_right\"></i><span>'+edu_engine_name+'<br>열람하기</span></a>';
			btn += "</li>";
			}




			btn += "</ul></div>";
			*/
		
 








	if (sessionStorage.getItem("s1") != 0){
		//if (other_chat == 1){}  임의로 처리
			btn += arr_disp_link[0] == "" ? "<div class='btn_holder'><ul>" : "";
			/*
			if (bef_s.length > 1){
				btn += "<li>";
				btn += "	<a href='javascript:before_qus();' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>이전 질문으로 가기</span></a>";
				btn += "</li>";
			}
			*/
			btn += "<li>"
			btn += "	<a href='javascript:scenario_exit();init_swipe();' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>다른 질문하기</span></a>";
			btn += "</li>";
			btn += arr_disp_link[0] == "" ? '</ul></div>' : "";
		
	}

	if (this.flag_scenario){	//시나리오 종료 시 추가
		//질문 끝나면 질문목록보기 버튼 추가 
		//링크가 없으면 ul 태그 추가 

/*
		btn += arr_disp_link[0] == "" ? "<div class='btn_holder'><ul>" : "";
		btn += "<li>";
		btn += "	<a href='javascript:chatting_start();init_swipe();' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>처음 질문으로 가기</span></a>";
		btn += "</li>";
		btn += '</ul>';
*/
	}

	/* //버튼생성 끝 */
	






















	return {
		msg : ai_msg,
		btn : btn
	};
	
}


/*******************설문지***************/



function db_research_ai(flag_scenario, ai_msg, ai_msg2, ai_msg3, scenario_talk_check, cnt ){
	var split_msg = ai_msg.replace(/{/gi, "").replace(/}/gi, "").split("@@@");
	var split_problem = ai_msg2.replace(/{/gi, "").replace(/}/gi, "").split("@@@");
	var ai_msg = "";
	var ai_msg2 ; 

	var btn = "";
	var other_chat = $("#chat").find("#other_chat").val();
	var engine_no   = $("#engine_no").val();

	//전에 링크 사용 못하게 처리
	$('.btn_lg').prop('href', '#');


	$('#chat').find("#talkText_check").val(scenario_talk_check);

	btn +=  "<div class='btn_holder'>"+ai_msg2+"</div> ";


	
	/* 버튼생성 시작 */
	for (i=0; i <= split_msg.length-1; i++){
		if (i == 0) {
			ai_msg = ai_msg + split_msg[i] + "";	//질문
		}else {
			//보기 버튼 생성
			if (i == 1) {
				btn = "<div class='btn_holder'><ul>";
			}

			btn += "<li><a href='javascript:get_data(10 ," + i + ",\"" + s1[0] + "\",\"" + s2[0] + "\",\"" + s3[0] + "\",\"" + s4[0] + "\",\"" + split_msg[i].replace("<p>","").replace("</p>","") + "\",\" \",\"" + split_problem[i].replace("<p>","").replace("</p>","") + "\",\"" + ai_msg3+ "\",\"" + i + "\");' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>" + split_msg[i].replace("<p>","").replace("</p>","") + "</span></a></li>";
			if (i == split_msg.length-1) {
				btn += "</ul></div>";
			}
		}
	}





	if (sessionStorage.getItem("s1") != 0){
		//if (other_chat == 1){}  임의로 처리
			btn += arr_disp_link[0] == "" ? "<div class='btn_holder'><ul>" : "";
			/*
			if (bef_s.length > 1){
				btn += "<li>";
				btn += "	<a href='javascript:before_qus();' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>이전 질문으로 가기</span></a>";
				btn += "</li>";
			}
			*/
			btn += "<li>"
			btn += "	<a href='javascript:scenario_exit();init_swipe();' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>다른 질문하기</span></a>";
			btn += "</li>";
			btn += arr_disp_link[0] == "" ? '</ul></div>' : "";
		
	}


	/* //버튼생성 끝 */





	return {
		msg : ai_msg,
		btn : btn
	};
	
}




function db_research_ai2(flag_scenario, ai_msg, ai_msg2, ai_msg3, scenario_talk_check, cnt ){
	var split_msg = ai_msg.replace(/{/gi, "").replace(/}/gi, "").split("@@@");
	var split_problem = ai_msg2.replace(/{/gi, "").replace(/}/gi, "").split("@@@");
	var ai_msg = "";
	var ai_msg2 ; 

	var btn = "";
	var other_chat = $("#chat").find("#other_chat").val();
	var engine_no   = $("#engine_no").val();

	//전에 링크 사용 못하게 처리
	$('.btn_lg').prop('href', '#');


	$('#chat').find("#talkText_check").val(scenario_talk_check);

	btn +=  "<div class='btn_holder'>"+ai_msg2+"</div> ";




	
	/* 버튼생성 시작 */
	for (i=0; i <= split_msg.length-1; i++){
		if (i == 0) {
			ai_msg = ai_msg + split_msg[i] + "";	//질문
		}else {
			//보기 버튼 생성
			if (i == 1) {
				btn = "<div class='btn_holder'><ul>";
			}

			btn += "<li><a href='javascript:get_data(10 ," + i + ",\"" + s1[0] + "\",\"" + s2[0] + "\",\"" + s3[0] + "\",\"" + s4[0] + "\",\"" + split_msg[i].replace("<p>","").replace("</p>","") + "\",\" \",\"" + split_problem[i].replace("<p>","").replace("</p>","") + "\",\"" + ai_msg3+ "\",\"" + i + "\");' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>" + split_msg[i].replace("<p>","").replace("</p>","") + "</span></a></li>";
			if (i == split_msg.length-1) {
				btn += "</ul></div>";
			}
		}
	}


	var openLink = "javascript:openDialog('/page/popup_data.php?no="+ai_msg3+"','크게보기',  0)";



	btn += "<div class='btn_holder'><ul>";
	btn += '<li><a href="' + openLink +'"  class="btn_lg btn_color_5 arrow round_10" data-val="챗봇-크게보기">크게보기</a></li>';
	btn += "</ul></div>";




	return {
		msg : ai_msg,
		btn : btn
	};
	
}



//채팅 종료 알림
function chat_end(ai_msg){
	var ai_msg ;
	var btn ;
	var engine_no = $("#engine_no").val()  ;



	btn = "<div class='btn_holder'>";
	btn += "<ul>";

	btn += "<li>";
	btn += "	<a href='javascript:location.reload();' class=\"btn_lg btn_color_5 arrow round_10\"><i class=\"ico_ui_arrow_right\"></i><span>채팅 상담 하기</span></a>";
	btn += "</li>";

	btn += "</ul>";
	btn += '</div>';

	return {
		msg : ai_msg,
		btn : btn
	};	

}




//교육 관련 시나리오 진입
function domain_start_education(ai_msg){
	var ai_msg ;
	var btn ;
	var engine_no = $("#engine_no").val()  ;

	var edu_video_file = $("#edu_video_file").val()  ;
	var edu_excel_file = $("#edu_excel_file").val()  ;
	var edu_image_file = $("#edu_image_file").val()  ;
	var edu_image_file2 = $("#edu_image_file2").val()  ;
	var edu_engine_name = $("#edu_engine_name").val()  ;
	var qa_YN  = $("#qa_YN").val()  ;

	var push_gubun = $("#push_gubun").val()  ;


	var push_research_gubun = $("#push_research_gubun").val()  ;


	btn = "<div class='btn_holder'>";
	btn += "<ul>";




	if (edu_video_file){
	btn += "<li>";
	btn += "	<a href='javascript:ChatbotPop(\"/video_viewer.php?fname="+edu_video_file+"\" ,\"video\")' class=\"btn_lg btn_color_5 arrow round_10\"><i class=\"ico_ui_arrow_right\"></i><span>교육 자료 시청하기</span></a>";
	btn += "</li>";
	}

	//target=\"_blank\"
	
	if (edu_excel_file){
	var openLink = "javascript:filedownload('/_data/upload/"+edu_excel_file+"')";
	btn += "<li>";
	btn += '	<a href="' + openLink +'" id=\"edu_image_file\" class=\"btn_lg btn_color_5 arrow round_10\"><i class=\"ico_ui_arrow_right\"></i><span>'+edu_engine_name+'<br>열람하기</span></a>';
	btn += "</li>";
	}




	if (edu_image_file2){
	btn += "<li>";
	btn += "	<img src='/_data/upload/"+edu_image_file2+"'>";
	btn += "</li>";
	}


	if (!edu_excel_file){
		if (!edu_image_file){





			if(push_research_gubun =="Y"){
			
					btn += "<li>";
					btn += "	<div class='message' style='opacity: 1; transform: translate(20px, 0px);'><div class='text' style='margin-left: -20px;'>이 설문조사에 이미 응답하셨습니다. 감사합니다.</div></div>";
					btn += "</li>";

			}else{


				if(push_gubun =="RESEARCH"){
					btn += "<li>";
					btn += "	<a href='javascript:get_data(0,\"api://research:{"+engine_no+"}\",\"\",\"\",\"\",\"\",\"확인\",\"\");' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>확인</span></a>";
					btn += "</li>";
				}else{
					btn += "<li>";
					btn += "	<a href='javascript:get_data(0,\"api://pushresearch:{"+engine_no+"}\",\"\",\"\",\"\",\"\",\"확인\",\"\");' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>확인</span></a>";
					btn += "</li>";
				}
			}




		}
	}







	if (edu_image_file){

	var openLink = "javascript:filedownload('/_data/upload/"+edu_image_file+"')";
	//var openLink = "javascript:filedownload('"+edu_image_file+"')";

	btn += "<li>";
	btn += '	<a href="' + openLink +'" id=\"edu_image_file\" class=\"btn_lg btn_color_5 arrow round_10\"><i class=\"ico_ui_arrow_right\"></i><span>'+edu_engine_name+'<br>열람하기</span></a>';
	btn += "</li>";
	}else{
	
	/*
	btn += "<li>";
	btn += "	<a href='javascript:get_data(0,\"api://research:{"+engine_no+"}\",\"\",\"\",\"\",\"\",\"확인\",\"\");' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>확인</span></a>";
	btn += "</li>";
	*/
	}



	if(qa_YN =="Y"){
	btn += "<li>";
	btn += "	<a href='javascript:Repush();' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>교육 및 테스트 일정 조정하기</span></a>";
	btn += "</li>";
	}


 

	btn += "</ul>";
	btn += '</div>';

	return {
		msg : ai_msg,
		btn : btn
	};	
}



//파일 업로드 후
function domain_start_fileupload(ai_msg){
	var ai_msg ;
	var btn ;



	btn = "<div class='btn_holder'>";
	btn += "<ul>";
	btn += "<li>";
	btn += '	<a href="" id=\"file_uploads\" class=\"btn_lg btn_color_5 arrow round_10\"><i class=\"ico_ui_arrow_right\"></i><span>파일보기</span></a>';
	btn += "</li>";
	btn += "</ul>";
	btn += '</div>';

	return {
		msg : ai_msg,
		btn : btn
	};	
}



function Repush(){

	var test_eday = $("#test_eday").val()  ;


	var result = Repushscn("<p>희망하시는 테스트 일정을 선택해주세요.<br>단,해당 테스트는 "+test_eday+"에 종료 예정입니다.<br>테스트 마감이후로는 설정하실 수 없습니다. </p>");
	display_ai_msg("", "", "loading");
	display_ai_msg(result.msg, result.btn, "");
}


//스케쥴 푸시
function Repushscn(ai_msg){
	var ai_msg ;
	var btn ;
	var engine_no = $("#engine_no").val()  ;


	btn = "<div class='btn_holder'>";
	btn += "<ul>";

	
	btn += "<li>";
	btn += "	<a class=\"btn_lg btn_color_5 arrow round_10\"><p><input type=\"text\"  id=\"schedule_time\"class=\"ts_all\" style=\"background-color: rgb(238, 238, 238); padding-left: 15px;border: none;width:50px\"><span>분 후 확인 할 수 있어요!</span><input type=\"button\" value=\"확인\" onclick=\"javascript:ajaxRepush();\" class=\"btn_full btn_color_2 round_3 ts_all\" style=\"margin-top: 10px;\"></p></a>";
	btn += "</li>";


	btn += "</ul>";
	btn += '</div>';

	return {
		msg : ai_msg,
		btn : btn
	};	
}

function Repushscn_end(ai_msg){
	var ai_msg ;
	var btn ;
	var engine_no = $("#engine_no").val()  ;


	return {
		msg : ai_msg,
		btn : btn
	};	
}







//스케쥴 조정
function ajaxRepush(){



	var engine_no = $("#engine_no").val()  ;
	var schedule_time = $("#schedule_time").val()  ;



	if (schedule_time == ""){ 
		alert("분을 입력해주세요"); 
		return;
	}


/*
	if ( $.isNumeric(schedule_time) ) {
		alert('숫자만 입력해주세요.');
	}
*/	


	
	var EMP_TKN  = $("#EMP_TKN").val()  ;
	var EMP_UID  = $("#EMP_UID").val()  ;
	var push_uid = $("#push_uid").val()  ;
	var data = "push_gubun=EDU&engine_no=" + engine_no + "&schedule_time=" + schedule_time + "&EMP_TKN=" + EMP_TKN +"&EMP_UID=" + EMP_UID +"&push_uid=" + push_uid; 


	$.ajax({
		url: chat_ajax_url + '/ajax_schedule_push.php', 
		type : "post",
		data : data,
		async:false,
		datatype : "json",
		timeout : 10000,  
		error:function(request,status,error){
			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		},
		success : function(getData){
			//log(getData);
			var err_res = getData.err_res;
			var err_msg = getData.err_msg;


               if(err_res == "0" ){
                    //alert("등록되었습니다.");

					var result = Repushscn_end(err_msg);
					display_ai_msg("", "", "loading");
					display_ai_msg(result.msg, result.btn, "");


                }else{            
                    alert(err_msg);
                }   


		}
	});

}


function filedownload(url){
		if(url){
			window.open(url) ;
			//location.href = "/download.php?filename="+url;
		}


		var qa_YN  = $("#qa_YN").val()  ;
		

		


		if(qa_YN =="Y"){
		//var result = domain_start_education2("교육 자료 시청 또는 자료 열람을 완료하셔야<br>테스트를 보실 수 있습니다.<br>관련 테스트까지 수료하셔야 교육 이수가 완료됩니다.<br>감사합니다.");
		var result = domain_start_education2("자료 열람하시느라 수고하셨어요.^^<br>이제부터 관련 테스트가 진행됩니다.<br>파이팅!||");		

		//display_ai_msg("", "", "loading");
		display_ai_msg(result.msg, result.btn, "");
		}

}





function filedownload_researching(url){
	if(url){
		window.open(url) ;
	}
}












//교육 관련 시나리오 진입
function domain_start_education2(ai_msg){
	var ai_msg ;
	var btn ;
	var engine_no = $("#engine_no").val()  ;


	get_data(0,"api://research:{"+engine_no+"}","","","","","확인","");


	/*

	btn = "<div class='btn_holder'>";
	btn += "<ul>";
	
	btn += "<li>";
	btn += "	<a href='javascript:get_data(0,\"api://research:{"+engine_no+"}\",\"\",\"\",\"\",\"\",\"확인\",\"\");' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>확인</span></a>";
	btn += "</li>";

	btn += "</ul>";
	btn += '</div>';

	*/



	return {
		msg : ai_msg,
		btn : btn
	};	
}










//교육 종료


function domain_start_education_end(ai_msg){
	var ai_msg ;
	var btn ;
	var engine_no = $("#engine_no").val()  ;


	


	btn = "<div class='btn_holder'>";
	btn += "<ul>";




	
	btn += "<li>";
	btn += "	<a href='javascript:get_data(0,\"api://edu_end:{"+engine_no+"}\",\"\",\"\",\"\",\"\",\"확인하기\",\"\");' class='btn_lg btn_color_5 arrow round_10' data-val='챗봇-교육결과-확인하기'><i class='ico_ui_arrow_right'></i><span>확인하기</span></a>";
	btn += "</li>";



	btn += "<li>"
	btn += "	<a href='javascript:scenario_exit();init_swipe();' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>다른 질문하기</span></a>";
	btn += "</li>";




	btn += "</ul>";
	btn += '</div>';

	return {
		msg : ai_msg,
		btn : btn
	};	
}









//소매 마감 -점장
function sleeve_finish(ai_msg){
	var ai_msg ;
	var btn ;
	var CHAT_HOSTNAME = $("#CHAT_HOSTNAME").val()  ;

	btn = "<div class='btn_holder'>";
	btn += "<ul>";
	
	btn += "<li>";
	btn += "	<a href='javascript:openDialog(\"https://"+CHAT_HOSTNAME+"/page/sleeve_finish.php?a=1\",\"소매일마감\",\"0\");' class='btn_lg btn_color_5 arrow round_10' data-val='챗봇-소매일마감-등록'><i class='ico_ui_arrow_right'></i><span>소매일마감</span></a>";
	btn += "</li>";

	btn += "<li>"
	btn += "	<a href='javascript:scenario_exit();init_swipe();' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>다른 질문하기</span></a>";
	btn += "</li>";

	btn += "</ul>";
	btn += '</div>';

	return {
		msg : ai_msg,
		btn : btn
	};	
}


//팀장/ 파트장
function sleeve_finish_view(ai_msg){
	var ai_msg ;
	var btn ;
	var CHAT_HOSTNAME = $("#CHAT_HOSTNAME").val()  ;

	btn = "<div class='btn_holder'>";
	btn += "<ul>";
	
	btn += "<li>";
	btn += "	<a href='javascript:openDialog(\"https://"+CHAT_HOSTNAME+"/page/sleeve_finish_viewer.php?a=1\",\"소매일마감보고\",\"0\");' class='btn_lg btn_color_5 arrow round_10' data-val='챗봇-소매일마감-뷰'><i class='ico_ui_arrow_right'></i><span>소매일마감</span></a>";
	btn += "</li>";

	btn += "<li>"
	btn += "	<a href='javascript:scenario_exit();init_swipe();' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>다른 질문하기</span></a>";
	btn += "</li>";

	btn += "</ul>";
	btn += '</div>';

	return {
		msg : ai_msg,
		btn : btn
	};	
}




//팀장/ 파트장
function performance_view(ai_msg){
	var ai_msg ;
	var btn ;
	var CHAT_HOSTNAME = $("#CHAT_HOSTNAME").val()  ;

	btn = "<div class='btn_holder'>";
	btn += "<ul>";
	
	btn += "<li>";
	btn += "	<a href='javascript:openDialog(\"https://"+CHAT_HOSTNAME+"/page/performance.php?a=1\",\"소매일마감보고\",\"0\");' class='btn_lg btn_color_5 arrow round_10'  data-val='챗봇-실적현황확인'><i class='ico_ui_arrow_right'></i><span>실적 현황 확인</span></a>";
	btn += "</li>";

	btn += "<li>"
	btn += "	<a href='javascript:scenario_exit();init_swipe();' class='btn_lg btn_color_5 arrow round_10'><i class='ico_ui_arrow_right'></i><span>다른 질문하기</span></a>";
	btn += "</li>";

	btn += "</ul>";
	btn += '</div>';

	return {
		msg : ai_msg,
		btn : btn
	};	
}














//퀵메뉴 close
function quick_close(){
	
	//디자인 타입이 0이면 내리기
	var chat_design_tp = $("#chat_design_tp").val();
	if(chat_design_tp == 0)
	{

		$('#chat').find('#footer').stop(false,true).transit({

			'bottom' : '-117px'

		}, 300, 'easeInOutCubic');

		$('#chat').find('#talk').css({
			
			'padding-bottom' : '15px'	
				
		});

		scroll_move(100);
	}

}

//시나리오 롤링 이미지 뷰
function add_goods_images(){
	var desc = this.goods_descriptions.replaceAll("\n","<br>").split(",");
	var img = this.goods_images.split(",");
	var links = this.goods_links.split(",");
	var images_url = "http://"+location.hostname+"/_data/talk_images/";
	var ret_val = "<div class='swiper-container' style='margin-bottom:15px;'><div class='swiper-wrapper'>";

	for (i=0; i <= desc.length-1; i++){
		ret_val += "<div class='swiper-slide goods' data-val='"+links[i] + "' onclick='javascript:window.open(\"" + links[i] + "\",\"_blank\");'><div class='message_balloon'><div class='message_balloon_wrap'>";
		ret_val += "<div class='goods_images' aria-label='이미지'>";
		ret_val += "<img src='"+images_url+img[i]+"' alt='' style='width:240px;'>";
		ret_val += "</div></div></div>";
		ret_val += "<ul class='list_btn'><li><a href='javascript:;'><span>"+desc[i].replaceAll("||",",")+"</span></a></li></ul></div>";
	}
	ret_val += "</div></div>";	
 
	return ret_val;
}

//이전 질문으로 가기 돌아가기
function before_qus(){
	//전전 질문ID를 뽑아야 하기 때문에 -2를 해줌
	if (bef_s.length >= 2){
		var rows = bef_s.length - 2;
		var bef_msg = bef_s[rows][0];
		var bef_s1 = bef_s[rows][1];
		var bef_s2 = bef_s[rows][2];
		var bef_s3 = bef_s[rows][3];
		var bef_s4 = bef_s[rows][4];
		//전전 질문ID 이후 데이터는 삭제
		for (i = rows; i <= bef_s.length; i++) bef_s.pop();
		get_data(3, bef_msg , bef_s1, bef_s2, bef_s3, bef_s4, "이전 질문으로 가기", "");
	}
}

//AI 메시지 형식
function ans_template(msg){
	var profile_img = $("#chat").find("#profile_img").val();
	var ret_val =  '<div class="ans left story">';
	ret_val += '			<div class="clear">';
	ret_val += '				<div class="profile round_20"><img src="' + profile_img + '" /></div>';
	ret_val += '				<div class="messages">';
	ret_val += msg;
	ret_val += '					</div>';
	ret_val += '				</div>';
	ret_val += '			</div>';
	ret_val += '		</div>';






	return ret_val;
}

//사용자 메시지 형식
function que_template(msg){
	var ret_val =  '<div class="ans right">';
	ret_val += '			<div class="row">';
	ret_val += '			<div class="messages">';
	ret_val += msg;
	ret_val += '				</div>';
	ret_val += '			</div>';
	ret_val += '		</div>';
	return ret_val;
}

//메시지 형식
function msg_template(msg){
	var ret_val = '<div class="message">';
	ret_val += '		<div class="text">' + msg + '</div>';
	ret_val += '	</div>';

return ret_val;
}

//이미지 형식
function img_template(images){
	var ret_val;
	if(typeof(images) != "undefined" && images != ""){
		ret_val = '<img src="' + images + '" width="100%" border=0/>';
	}
	return ret_val;
}

//시간 형식
function time_template(){
	var ret_val = '<div class="time"><small>' + getTimeStamp() + '</small></div>';
	return ret_val;	
}

//로딩 형식
function loading_template(){
	var ret_val = '<div class="loading"></div>';
	return ret_val;
}



/***** 현재 사용하지 않음 *****/
//상단 이미지 변경
function change_top_images(){		
	var sp_ai_msg_img2 = ai_msg_img2.split(",");
	var sp_img_display = img_display.split(",");

	$(".bxslider").empty();
	for (i=0; i < sp_ai_msg_img2.length; i++){
		if (select_yn == "Y"){
			link_func = 'javascript:get_data(3,\'' + sp_img_display[i] + '\',\'' + s1[0]+ '\',\'' + s2[0] + '\',\'' + s3[0] + '\',\'' + s4[0] + '\',\''+ sp_img_display[i] + '\',\'' + i + '\');';
		}else{
			link_func = 'javascript:;';
		}
		var ret_val = '<li class="swiper-slide"><a href="'+link_func+'"><img src="http://'+location.hostname+"/_data/talk_images/"+sp_ai_msg_img2[i]+'" border="0" alt="이미지"></a></li>';
		$(".bxslider").append(ret_val);
	}
	$("#s_banner_wrap").show();
	try{
		slider.reloadSlider({auto: true, mode:'horizontal', infiniteLoop:true});			
	}catch(e){
		//log("err_msg : "+e.message);
	}
}

//상단 이미지 초기화
function init_top_images(){
	if (arr_img_cnt == 0){
		$("#s_banner_wrap").fadeOut("slow", function() {
			$(".bxslider").empty();
		});
	}else{
		$(".bxslider").empty();
		for (i=0; i < arr_img_cnt; i++){
			var ret_val = '<li class="swiper-slide"><a href="javascript:;"><img src="' + images_path + reduced_arr[i] + '" border="0" alt="이미지"></a></li>';
			$(".bxslider").append(ret_val);
		}
		$("#s_banner_wrap").show();
		try{
			slider.reloadSlider({auto: true, mode:'horizontal', infiniteLoop:true});			
		}catch(e){
			//log("err_msg : "+e.message);
		}
	}
}

//이미지 Swipe
function init_swipe(){

		var swiper = [];
		$('.swiper-container').each(function(index){
			try{
				var $el = $(this);
				
				//console.log(index);

				swiper[index] = $el.swiper({
					//Your options here:
					mode:'horizontal',
					pagination: $el.find('.swiper-pagination')[0],
					nextButton: $el.find('.swiper-button-next')[0],
					prevButton: $el.find('.swiper-button-prev')[0],
					spaceBetween: 10,
					//slidesPerView: 'auto',		//auto : custom width setting
					centeredSlides: true,
					grabCursor: true
				});
				$el.find('.prev-slide').on('click', function(){
					swiper[index].swipePrev();
				});
				$el.find('.next-slide').on('click', function(){
					swiper[index].swipeNext();
				});
			}catch(e){
				
				console.log(e);
			}
		});
	
	/*
	var swiper = new Swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		slidesPerView: 3,
		centeredSlides: true,
		paginationClickable: true,
		spaceBetween: 30,
		grabCursor: true
	});
	*/
}




//롤링 이미지 시작 질문
function init_start_question(){
	var images_url = "http://"+location.hostname+"/data/talk_images/";
	var ret_val = "<div class='swiper-container' style='margin-bottom:15px;'><div class='swiper-wrapper'>";

	for (i=0; i < arr_st_img_cnt; i++){
		ret_val += "<div class='swiper-slide goods' onclick='javascript:talk_start_click(\"" + arr_st_txt[i] + "\");'  style='width:120px;'><div class='message_balloon'><div class='message_balloon_wrap'>";
		ret_val += "<div class='goods_images' style='border-radius:1em 1em 1em 1em;'>";
		ret_val += "<img src='http://"+location.hostname+"/_data/talk_images/"+reduced_arr_st[i]+"' style='width:100%;'>";
		ret_val += "</div></div></div>";
		if(arr_st_txt[i] != ""){
			ret_val += "<ul class='list_btn'><li><a href='javascript:;'><span>" + arr_st_txt[i] +"</span></a></li></ul>";
		}
		ret_val += "</div>";
	}
	ret_val += "</div></div>";	

	return ret_val;
}
/***** //현재 사용하지 않음 *****/




function init_swipe_slick(){
  $('.variable').slick({
	dots: false,
	infinite: false,
	variableWidth: true
  });

}
