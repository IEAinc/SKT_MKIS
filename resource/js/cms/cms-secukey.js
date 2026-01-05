
/*
* scGetFileType.cab : 첨부파일 보안
*/
function makeScGetFileTypeControl()
{    
    document.write("<OBJECT id='SCGetGrade'                                             ");
    document.write("    CLASSID='CLSID:95DE89E9-ED44-4C87-A57B-C76FC42532EA'            ");
    document.write("    CODEBASE='/resource/cab/SCGetFileType.cab#version=1,0,0,3'>     "); 
    document.write("</OBJECT>                                                           ");   
} 

function quickReport()
{
	try{
		SCGetGrade.FileName="C:\\text.txt";		 //대상 파일 경로
		alert(SCGetGrade.IsReadOnly);				 //리턴 값 출력
		if(SCGetGrade.IsReadOnly == 0){
			alert("파일에 대한 편집권한이 있습니다. 해당 파일 업로드가 가능합니다. ");
		}
		else if (SCGetGrade.IsReadOnly == 1){
		   alert("파일에 대한 편집권한이 없습니다. 편집권한이 있는 파일만 업로드가 가능합니다.");
		}
		else{
		   alert("암호화 된 파일이 아니거나 문서보안 클라이언트가 설치또는 로그인되지 않았습니다.");
		}
	}catch(ex){
		alert("문서보안 클라이언트가 정상적으로 설치되지 않았습니다.\n\n문서보안을 다시 설치하시거나 관리자에게 문의하시기 바랍니다.");
	}
}

