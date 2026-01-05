var G_atthRes = "";
var G_multiAtthRes = [];
var G_multiLastIndex = 0;
var G_vertical = '\u000B'; // 파일 구분자
var G_formfeed = '\u000C'; // 각 파일당 속성 구분자
var G_UploadID;
var G_submit = "N";
var G_isTransferStart = false; // 전송 시작 여부
var G_isTransferComplete = false; // 전송 완료 여부
var G_isTransferCancel = false; // 전송 취소 여부
var G_isTransferError = false; // 전송 에러 여부
var G_UPTYPE = "";
var G_ALLOW_EXT= "";
var G_CHECK_RULE="Y"; // 업로드시 체크룰에 따라 체크할 것인지(Y/N)

/* IE9 X
var promise = new Promise(function(resolve, reject) {
	if(true){
		resolve(" Good ");
	}else{
		reject(Error(" NG "));
	};
});
*/

function makePromise() {
	var deferred = $.Deferred();

	deferred.resolve();
	
	return deferred.promise();
}

function delay(millis) {
	var deferred = $.Deferred();
	setTimeout(function() {
		deferred.resolve();
	}, millis);
	return deferred.promise();
}

//전송시작
function fn_transfer(currUploadID) {
	G_submit = "Y";
	
    if (currUploadID) {
        DEXT5UPLOAD.Transfer(currUploadID);
    } else {
        DEXT5UPLOAD.Transfer(G_UploadID);
    }
}

//전송시작
function fn_transfer_s(currUploadID) {
	console.log('fn_transfer_s start');
	
	var deferred = $.Deferred();
	
	if(DEXT5UPLOAD.GetTotalFileCount() > 0) {
		DEXT5UPLOAD.AddFormData('uploadType', G_UPTYPE, currUploadID);
		DEXT5UPLOAD.AddFormData('allowExt', G_ALLOW_EXT, currUploadID);
		DEXT5UPLOAD.AddFormData('checkRule', G_CHECK_RULE, currUploadID);
	    DEXT5UPLOAD.Transfer(currUploadID);
	} else {
		DEXT5UPLOAD_OnTransfer_Complete(currUploadID);
	}
	
	deferred.resolve();

	return deferred.promise();
}

function fn_transfer_ajax(currUploadID) {
	console.log('fn_transfer_ajax start');
	
	var deferred = $.Deferred();
	
	G_submit = "N";
	
    if (currUploadID) {
    	DEXT5UPLOAD.AddFormData('uploadType', G_UPTYPE, currUploadID);
    	DEXT5UPLOAD.AddFormData('allowExt', G_ALLOW_EXT, currUploadID);
    	DEXT5UPLOAD.AddFormData('checkRule', G_CHECK_RULE, currUploadID);
        DEXT5UPLOAD.Transfer(currUploadID);
    } else {
    	DEXT5UPLOAD.AddFormData('uploadType', G_UPTYPE,G_UploadID);
    	DEXT5UPLOAD.AddFormData('allowExt', G_ALLOW_EXT,G_UploadID);
    	DEXT5UPLOAD.AddFormData('checkRule', G_CHECK_RULE, G_UploadID);
        DEXT5UPLOAD.Transfer(G_UploadID);
    }
    
    deferred.resolve();

	return deferred.promise();
}

// 생성완료 이벤트
function DEXT5UPLOAD_OnCreationComplete(uploadID) {
	
    G_UploadID = uploadID;
    
    if(uploadID == "videoUploader") return;

    try {
    	if(typeof(this.postUpOnCreation) == 'function') {
    		postUpOnCreation();
    	}else{
    		console.log("[DEXT5UPLOAD_OnCreationComplete] postUpOnCreation 함수가 없습니다.");	
    	}
    } catch(e) {}
}

// 전송시작 이벤트
function DEXT5UPLOAD_OnTransfer_Start(uploadID) {
	G_isTransferStart = true;
    G_UploadID = uploadID;
    

}

// 전송완료 이벤트
function DEXT5UPLOAD_OnTransfer_Complete(uploadID) {
	
	G_isTransferComplete = true;
    G_UploadID = uploadID;

    // 신규 업로드된 파일
    var jsonNew = DEXT5UPLOAD.GetNewUploadListForJson(G_UploadID);
    
    // 삭제된 파일
    var jsonDel = DEXT5UPLOAD.GetDeleteListForJson(G_UploadID);

    // 전체결과
    var jsonAll = DEXT5UPLOAD.GetAllFileListForJson(G_UploadID);
    
    if(jsonAll == null) jsonAll = new Object(); 
    if(jsonDel != null) {jsonAll.delFile = jsonDel;}
    if(G_UPTYPE != "") {jsonAll.uploadType = G_UPTYPE;}
    if(G_ALLOW_EXT != "") {jsonAll.uploadExt = G_ALLOW_EXT;}

    G_atthRes = jsonAll;
    if(G_UploadID.includes("multiUploader")) {
	
		G_multiAtthRes.push(jsonAll);
    
	    var len = uploads.length-1;
	    
	    if (len > 0 && uploadID == uploads[0].ID) {
	        fn_transfer_s(uploads[1].ID).then(function () {});
	    } else if (len > 1 && uploadID == uploads[1].ID) {
	        fn_transfer_s(uploads[2].ID).then(function () {});
	    } else if (len > 2 && uploadID == uploads[2].ID) {
	        fn_transfer_s(uploads[3].ID).then(function () {});
	    } else if (len > 3 && uploadID == uploads[3].ID) {
	        fn_transfer_s(uploads[4].ID).then(function () {});
	    } else if (len > 4 && uploadID == uploads[4].ID) {
	        fn_transfer_s(uploads[5].ID).then(function () {});
	    } else if (len > 5 && uploadID == uploads[5].ID) {
	        fn_transfer_s(uploads[6].ID).then(function () {});
	    } else if (len > 6 && uploadID == uploads[6].ID) {
	        fn_transfer_s(uploads[7].ID).then(function () {});
	    } else if (len > 7 && uploadID == uploads[7].ID) {
	        fn_transfer_s(uploads[8].ID).then(function () {});
	    } else if (len > 8 && uploadID == uploads[8].ID) {
	        fn_transfer_s(uploads[9].ID).then(function () {});
	    }
	
	} 
    
    try {
		if(G_UploadID == "videoUploader") {
    		if(typeof(this.videoAtthResult) == 'function') {
    			videoAtthResult();
    		}
    		else{
    			console.log("[DEXT5UPLOAD_OnTransfer_Complete] videoAtthResult 함수가 없습니다.");	
    		}
    	} else if(G_UploadID.includes("multiUploader")) {
			if(typeof(this.multiAttachResult) == 'function') {
				if(uploadID == "multiUploader"+G_multiLastIndex) multiAttachResult();
			}
			else{
				console.log("[DEXT5UPLOAD_OnTransfer_MultiComplete] multiAttachResult 함수가 없습니다.");	
			}
		}
    	else {
    		if(typeof(this.atthResult) == 'function') {
    			atthResult();
    		}
    		else{
    			console.log("[DEXT5UPLOAD_OnTransfer_Complete] atthResult 함수가 없습니다.");	
    		}
    	}
    } catch(e) {}
    
    if(G_submit == "Y" && jsonAll != null) {
        var wudJsonAllRes = document.getElementById("wudJsonAllRes");
        wudJsonAllRes.value = JSON.stringify(jsonAll);
    	var uploadForm = document.getElementById("Dext5UploadForm");
    	uploadForm.submit();
    }
}

// 오류 이벤트
function DEXT5UPLOAD_OnError(uploadID, code, message, uploadedFileListObj) {
	
	console.log("== dext5 업로드 에러");
	console.log("uploadID: " + uploadID);
	console.log("uploadedFileListObj: " + uploadedFileListObj);
	console.log("message: " + message);
	
	alert(message);
}

// 취소 이벤트
function DEXT5UPLOAD_UploadingCancel(uploadID, uploadedFileListObj) {
G_UploadID = uploadID;

    if (uploadedFileListObj != null && uploadedFileListObj != '') {
        var uploadedFileLen = uploadedFileListObj.length;
        for (var i = 0; i < uploadedFileLen; i++) {

        }
    }
}

