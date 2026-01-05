/*
	MKIS 콘텐츠 등록/수정 관련 공통 javascript
	2025-08-28 P126820 김나리 생성
*/

/*************************************************************
	검색 태그
*************************************************************/
function initHandler(flag) {
	box = document.querySelector('.div_tag');
	innerBox = document.querySelector('.innerBox');
	input = document.querySelector('.searchBox');

	// Events
	box.addEventListener('click', removeTagHandler);
	input.addEventListener('keydown', addTagHandler);

	// 신규등록 일 경우
	if(flag == 'insert') {
		localStorage.setItem("list_tag", "[]");
		render();
	}
	// 버전업, 오류수정 일 경우
	else {
		localStorage.list_tag = JSON.stringify(tagVar);
		let repo = localStorage.getItem("list_tag");

		if (!isEmpty(repo)) {
			render();
		}
	}
}

// 로컬스토리지 가져오기
function getStorage() {
	tags = localStorage.list_tag ? JSON.parse(localStorage.list_tag) : [];
}

// 로컬스토리지 업데이트
function updateStorage() {
	localStorage.list_tag = JSON.stringify(tags);
	render();
}

// 태그 추가
function addTagHandler(ev) {
	var inputVal = input.value;

	if (ev.key == "Enter") {
		if (inputVal.length == 0) {
			return;
		}

		// 2025-08-28 검색 태그 제한 alert 추가(500bytes) - P126820 김나리
		let totalSize = getByte(srchTagVar) + getByte(inputVal) + 1;	// 구분자 | 추가로 + 1

		if(totalSize > 500) {
			alert(tagMsg);	// 검색태그는 구분자(|) 포함하여 최대 500bytes까지 가능합니다.

			return;
		}

		tags.push(inputVal);
		updateStorage();
		input.value = "";
	}
}

// 태그 제거
function removeTagHandler(ev) {
	let target = ev.target;

	if(target.previousElementSibling == null) return;

	if (target.tagName == "SPAN" && target.className == "tag_close") {
		let textNode = target.previousElementSibling.innerText.trim();

		tags = tags.filter(item => item !== textNode);

		updateStorage();
	}
}

// 태그 그리기
function render() {
	getStorage();

	let tmp = '';

	tmp = sumTag(tags);
	innerBox.innerHTML = tmp;
	srchTagVar = tags.join("|");
}

function sumTag(tags) {
	var tmp = '';

	for (var i = 0; i < tags.length; i++) {
		tmp += '<span class="tag_box"><span>' + tags[i] + '</span><span class="tag_close">&times;</span></span>';
	}

	return tmp;
}


/*************************************************************
	2025-11-01 컨텐츠잠금관리 - P126820 김나리
*************************************************************/

// lock 상태 체크
// return true	= 수정 가능
// return false	= 수정 불가(lock 걸림)
function getLockStatus(prentCntntsSerNum) {
	var result = false;

	$.ajax({
		url			: '/front/lock/getLockStatus.ajax'
		, method	: 'POST'
		, data		: {
			prentCntntsSerNum: prentCntntsSerNum
		}
		, dataType	: 'json'
		, async		: false
		, success	: function(data) {
			// 수정 불가
			if(data.count > 0) {
				let userName = '';

				for(let i in data.rows) {
					userName += data.rows[i].hanNm + '(' + data.rows[i].loginId + ')';

					if(i < data.count - 1) {
						userName += ', ';
					}
				}

				let msg = userName + ' 사용자가 수정중입니다.\n수정을 원하시면 ' + userName + ' 사용자에게 잠금해제를 요청하세요.';

				alert(msg);

				result = false;
			}
			// 수정 가능
			else {
				result = true;
			}
		}
		, error		: function(jqXHR, textStatus, errorThrown) {
			alert('오류가 발생하였습니다! 문제가 계속 발생하는 경우 관리자에게 문의 바랍니다.');

			result = false;
		}
	});

	return result;
}

// lock 상태 체크
// 등록 시 본인이 설정한 lock은 제외하고 조회
// return true	= 수정 가능
// return false	= 수정 불가(lock 걸림)
function getLockStatusForSave(prentCntntsSerNum) {
	var result = false;

	$.ajax({
		url			: '/front/lock/getLockStatusForSave.ajax'
		, method	: 'POST'
		, data		: {
			prentCntntsSerNum	: prentCntntsSerNum
		}
		, dataType	: 'json'
		, async		: false
		, success	: function(data) {
			// 수정 불가
			if(data.count > 0) {
				let userName = '';

				for(let i in data.rows) {
					userName += data.rows[i].hanNm + '(' + data.rows[i].loginId + ')';

					if(i < data.count - 1) {
						userName += ', ';
					}
				}

				let msg = userName + ' 사용자가 수정중입니다.\n수정을 원하시면 ' + userName + ' 사용자에게 잠금해제를 요청하세요.';

				alert(msg);

				result = false;
			}
			// 수정 가능
			else {
				result = true;
			}
		}
		, error		: function(jqXHR, textStatus, errorThrown) {
			alert('오류가 발생하였습니다! 문제가 계속 발생하는 경우 관리자에게 문의 바랍니다.');

			result = false;
		}
	});

	return result;
}


// lock 설정
function setLockCntnts(prentCntntsSerNum, cntntsSerNum, modeType, cntntsClCd) {
	var result = false;

	$.ajax({
		url			: '/front/lock/setLockCntnts.ajax'
		, method	: 'POST'
		, data		: {
			prentCntntsSerNum	: prentCntntsSerNum
			, cntntsSerNum		: cntntsSerNum
			, modeType			: modeType
			, cntntsClCd		: cntntsClCd
		}
		, dataType	: 'json'
		, async		: false
		, success	: function(data) {
			if(data.resultCount > 0) {
				result = true;
			}
			else {
				result = false;
			}
		}
		, error		: function(jqXHR, textStatus, errorThrown) {
			result = false;
		}
	});

	return result;
}

// lock 해제
// My 메뉴 > 콘텐츠 잠금해제
function setUnLockCntnts(lockSerNums, callback) {
	$.ajax({
		url				: '/front/lock/setUnLockCntnts.ajax'
		, method		: 'POST'
		, data			: {
			lockSerNums	: lockSerNums
		}
		, dataType		: 'json'
		, async			: false
		, traditional	: true
		, success		: function(data) {
			if(data.resultCount > 0) {
				alert('잠금 해제했습니다.');

				if(typeof(callback) == 'function'){
					callback(data);
				}
			}
			else {
				alert('잠금 해제하는데 실패했습니다');
				return false;
			}
		}
		, error			: function(jqXHR, textStatus, errorThrown) {
			alert('잠금 해제하는데 실패했습니다');

			return false;
		}
	});
}

// lock 해제
// 등록 시 본인이 설정한 lock 해제
function setUnLockCntntsForSave(prentCntntsSerNum, cntntsSerNum, modeType) {
	$.ajax({
		url				: '/front/lock/setUnLockCntntsForSave.ajax'
		, method		: 'POST'
		, data			: {
			prentCntntsSerNum	: prentCntntsSerNum
			, cntntsSerNum		: cntntsSerNum
			, modeType			: modeType
		}
		, dataType		: 'json'
		, async			: false
		, traditional	: true
		, success		: function(data) {
			if(data.resultCount < 1) {
				alert('잠금 해제하는데 실패했습니다');

				return false;
			}
		}
		, error			: function(jqXHR, textStatus, errorThrown) {
			alert('잠금 해제하는데 실패했습니다');

			return false;
		}
	});
}