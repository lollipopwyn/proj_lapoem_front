import React from 'react';
import '../My/Mypage.css';

const Mypage = () => {
  return (
    <div className="mypage_container">
      <div className="my_page_top">
        <div className="my_page_title">MY PAGE</div>
        <div className="my_page_desc">
          가입 시 작성한 회원 정보를 수정할 수 있습니다.
        </div>
      </div>
      <div className="my_page_content">
        <div className="my_page_content_title">회원 정보 수정</div>
        <div className="my_page_content_info">
          <div>
            <label>아이디</label>
            <input type="text" value="your_id" disabled />
          </div>
          <div>
            <label>닉네임</label>
            <input type="text" placeholder="닉네임을 입력하세요" />
          </div>
          <div>
            <label>연락처</label>
            <input type="text" placeholder="연락처를 입력하세요" />
          </div>
          <div className="my_email">
            <label>이메일</label>
            <input type="email" placeholder="이메일을 입력하세요" />
          </div>
          <div className="marketing-container"> {/* 마케팅 동의 체크박스 컨테이너 */}
            <input type="checkbox" id="marketingConsent" />
            <label htmlFor="marketingConsent">마케팅 송신 동의</label>
          </div>
        </div>
      </div>

      <div className="my_page_button">
        <button id="deleteBtn">DELETE MY ACCOUNT</button>
        <div className="button-group-right"> {/* 오른쪽 버튼 그룹 */}
          <button id="saveBtn">SAVE</button>
          <button id="cancelBtn">CANCEL</button>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
