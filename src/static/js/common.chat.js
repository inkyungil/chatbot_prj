/***** COMMON *****/
//replaceAll
String.prototype.replaceAll = function(org, dest) {
    return this.split(org).join(dest);
}

//디바이스 종류 체크
function device_check(){
	var mobile = (/iphone|ipad|ipod|android/i.test(navigator.userAgent.toLowerCase()));
	 
	if (mobile) {
		var userAgent = navigator.userAgent.toLowerCase();
		if (userAgent.search("android") > -1)
			currentOS = "android";
		else if ((userAgent.search("iphone") > -1) || (userAgent.search("ipod") > -1)
					|| (userAgent.search("ipad") > -1))
			currentOS = "ios";
		else
			currentOS = "else";
	} else {
		// 모바일이 아닐 때
		currentOS = "other";
	}
return currentOS;
}

//브라우저 체크
function getAgent(){
	var agent = navigator.userAgent, match;
	var app = 'Unknown';
	var version = 'Unknown';
	
	if((match = agent.match(/MSIE ([0-9]+)/)) || (match = agent.match(/Trident.*rv:([0-9]+)/))) app = 'Internet Explorer';
	else if(match = agent.match(/Chrome\/([0-9]+)/)) app = 'Chrome';
	else if(match = agent.match(/Firefox\/([0-9]+)/)) app = 'Firefox';
	else if(match = agent.match(/Safari\/([0-9]+)/)) app = 'Safari';
	else if((match = agent.match(/OPR\/([0-9]+)/)) || (match = agent.match(/Opera\/([0-9]+)/))) app = 'Opera';
	
	if(app !== 'Unknown') version = match[1];
	
	return {
		agent	: agent,
        app		: app,
        version : version
    };
}

//변경 감지
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

$.fn.attrchange = function(callback) {
    if (MutationObserver) {
        var options = {
            subtree: false,
            attributes: true
        };

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(e) {
                callback.call(e.target, e.attributeName);
            });
        });

        return this.each(function() {
            observer.observe(this, options);
        });

    }
}
//현재 시간
function getTimeStamp() {
    var d = new Date();
    var h = leadingZeros(d.getHours(), 2);
    var m = leadingZeros(d.getMinutes(), 2);
    
    var pre = ""
    if(h >= 12){
        ampm = "오후 ";
        h = h - 12;
    }else{
        ampm = "오전 ";
    }
    var s = ampm + h + ':' + m;
    return s;
}

//현재 날짜
function getDateStamp(){
    var d = new Date();
    var s = leadingZeros(d.getMonth() + 1, 2) + '-' + leadingZeros(d.getDate(), 2);
    return s;
}

//자릿수 맞춤
function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (i = 0; i < digits - n.length; i++)
            zero += '0';
    }
    return zero + n;
}

// 숫자 체크
function chkNum(e, decimal) {
    var key;
    var keychar;

    if (window.event) {
        key = window.event.keyCode;
    } else if (e) {
        key = e.which;
    } else {
        return true;
    }
    keychar = String.fromCharCode(key);
    if ((key == null) || (key == 0) || (key == 8) || (key == 9) || (key == 13)
        || (key == 27)) {
        return true;
    } else if ((("0123456789").indexOf(keychar) > -1)) {
        return true;
    } else if (decimal && (keychar == ".")) {
        return true;
    } else
        return false;
}

// 쿠키 생성
function setCookie(cName, cValue, cDay){
    var expire = new Date();
    expire.setDate(expire.getDate() + cDay);
    cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐 방지 escape(cValue)
    if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
    document.cookie = cookies;
}

// 쿠키 가져오기
function getCookie(cName) {
    cName = cName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cName);
    var cValue = '';
    if(start != -1){
        start += cName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cValue = cookieData.substring(start, end);
    }
    return unescape(cValue);
}

//uuid 생성
function guid() {
    function s4() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
/*
//html 태그 제거
function removeTag( str ) {
    return str.replace(/(<([^>]+)>)/gi, "");
}
*/
//로그
function log(txt){
    console.log(txt);
}

//anchor 태그 삭제
function RemoveAnchor(text){
    text = text.replace(/<a(.*?)>/gi,"");  //<a href에 포함됨 모든 내용 제거
    text = text.replace(/<(\/?)a>/gi,"");  //</a>태그 제거
    return text;
}

function removeSpan(str){
	return str.replace(/<(\/span|span)([^>]*)>/gi,"");	
}

//유효성검사
function validate_chk(talkText_check){
    var talkText = $("input[name=talkText]").val();
    if(talkText_check == "number"){
        //number 만 입력가능하게...
        regExp  = /^[0-9]*$/;
        if(!regExp.test(talkText) || talkText == "") {
            alert('숫자만 입력해주세요.');
            $("#talkText").val("");
            return false;
        }
    }
    //이메일
    if(talkText_check == "email"){
        regExp  =  /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if(!regExp.test(talkText) || talkText == "") {
            alert('이메일주소 형식만 입력이 가능합니다.');
            $("#talkText").val("");
            return false;
        }
    }
    //휴대폰
    if(talkText_check == "mobile"){
        regExp  =  /(01[0|1|6|9|7])[-](\d{3}|\d{4})[-](\d{4}$)/;
        if(!regExp.test(talkText) || talkText == "") {
            alert('잘못된 휴대폰 번호입니다. 하이픈을 넣어주세요');
            $("#talkText").val("");
            return false;
        }
    }
    //한글만
    if(talkText_check == "kor"){
        regExp  =  /^[가-힣]+$/;
        if(!regExp.test(talkText) || talkText == "") {
            alert('한글만 입력이 가능합니다.');
            $("#talkText").val("");
            return false;
        }
    }
    return true;
}

/***** //COMMON *****/