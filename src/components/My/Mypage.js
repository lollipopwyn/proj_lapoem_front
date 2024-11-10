import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import birthIcon from '../../assets/images/birth_icon.png';
import {GET_MEMBER_INFO_API_URL} from '../../util/apiUrl'
import '../My/Mypage.css';

const Mypage = () => {
  const member_num = useSelector((state) => state.auth.user?.memberNum);
  const [memberData, setMemberData] = useState(null);
  const [nickname, setNickname] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [error, setError] = useState(null);


  useEffect(() => {
    console.log('Redux member_num:', member_num); // Log member number for debugging
    if (member_num) {
      const fetchMemberInfo = async () => {
        try {
          const response = await axios.get(GET_MEMBER_INFO_API_URL(member_num), {
            withCredentials: true,});


          const data = response.data;

          // Map response data to state variables
          setMemberData(data);
          setNickname(data.member_nickname || '');
          setContact(data.member_phone || '');
          setEmail(data.member_email || '');
          setMarketingConsent(data.marketing_consent || false);
          setGender(data.member_gender || '');
          setBirthdate(data.member_birth_date || '');
          console.log("회원정보:",response.data);
        } catch (error) {
          console.error('Error fetching member info:', error);
          setError(error.response?.data?.message || 'Failed to fetch member info');
        }
      };

      fetchMemberInfo();
    }
  }, [member_num]);




  return (
    <div className="mypage_container">
      <div className="my_page_top">
        <div className="my_page_title">MY PAGE</div>
        <div className="my_page_desc">
          가입 시 작성한 회원 정보를 수정할 수 있습니다.
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="my_page_content">
        <div className="my_page_content_title">회원 정보 수정</div>
        <div className="my_page_content_info">
          <div>
            <label>아이디</label>
            <input type="text" value={memberData?.member_id || ''} disabled />
          </div>
          <div>
            <label>닉네임</label>
            <input type="text"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)} />
          </div>
          <div>
            <label>연락처</label>
            <input type="text"
              placeholder="연락처를 입력하세요"
              value={contact}
              onChange={(e) => setContact(e.target.value)}/>
          </div>
          <div className="my_email">
            <label>이메일</label>
            <input type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="marketing-container">
            {/* 마케팅 동의 체크박스 컨테이너 */}
            <input type="checkbox"
              id="marketingConsent"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)} />
            <label htmlFor="marketingConsent">마케팅 수신 동의</label>
          </div>
          <div className="my_privacy">
            <div className="my_birth">
              <div className="birthdate-display">
                <img src={birthIcon} alt="birtday icon" />
                <span>{birthdate}</span>
              </div>
            </div>
            <div className="my_gender">
              <div className="gender_toggle">
              <button
                  className={gender === '남' ? 'selected' : ''}
                  disabled 
                >
                  남
                </button>
                <button
                  className={gender === '여' ? 'selected' : ''}
                  disabled 
                >
                  여
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="my_page_button">
        <button id="deleteBtn">DELETE MY ACCOUNT</button>
        <div className="button-group-right">
          <button id="saveBtn">SAVE</button>
          <button id="cancelBtn">CANCEL</button>
        </div>
      </div>
    </div>
  );
};

export default Mypage;