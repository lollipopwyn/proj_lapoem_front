import React from 'react';
import '../My/Mypage.css';

const Mypage = () => {
  return (
    <div className="mypage_container">
      <div className="main_page_top">
        <div className="main_page_title">MY PAGE</div>
        <div className="main_page_desc">
          가입 정보를 확인하시고, 회원 정보를 수정할 수 있습니다.
        </div>
      </div>
      <div className="main_page_content">
        <div className="main_page_content_title">회원 정보 수정</div>
        <div className="main_page_content_info">
          <div>아이디(수정불가)</div>
          <div>닉네임</div>
          <div>연락처</div>
          <div>
            이메일
            <label>
              <input type="checkbox" id="marketingConsent" />
              마케팅 송신 동의
            </label>
          </div>
        </div>
      </div>

      <div className="main_page_button">
        <button id="deleteBtn">DELETE MY ACCOUNT</button>
        <button id="saveBtn">SAVE</button>
        <button id="cancelBtn">CANCEL</button>
      </div>
    </div>
  );
};

export default Mypage;
