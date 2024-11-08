import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GET_BOOK_REVIEWS_API_URL } from '../../util/apiUrl';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BookReviewChart = () => {
  const { bookId } = useParams(); // bookId는 URL 파라미터로 가져옴
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews(); // 리뷰 데이터를 가져오는 함수 호출
  }, [bookId]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(GET_BOOK_REVIEWS_API_URL(bookId), {
        withCredentials: true,
      });
      setReviews(response.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('리뷰를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 리뷰 데이터 처리
  const getRatingDistribution = () => {
    const ratingCounts = [0, 0, 0, 0, 0]; // [1점, 2점, 3점, 4점, 5점]
    let totalScore = 0; //

    reviews.forEach((review) => {
      const rating = review.rating;
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating - 1] += 1;
        totalScore += rating; // 리뷰의 점수 더하기
      }
    });

    const totalReviews = reviews.length;
    const percentages = ratingCounts.map((count) =>
      ((count / totalReviews) * 100).toFixed(2)
    );

    // 평균 점수 계산: 총 점수 합 / 리뷰 수
    const averageRating = (totalScore / totalReviews).toFixed(2);

    return {
      labels: ['1 Heart', '2 Hearts', '3 Hearts', '4 Hearts', '5 Hearts'],
      datasets: [
        {
          label: `평균 점수: ${averageRating}/10점`,
          data: percentages,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const getGenderAgeDistribution = () => {
    const genderAgeGroups = {
      Female_10s: 0,
      Female_20s: 0,
      Female_30s: 0,
      Female_40s: 0,
      Male_10s: 0,
      Male_20s: 0,
      Male_30s: 0,
      Male_40s: 0,
    };

    reviews.forEach((review) => {
      const { member_gender, member_birth_date, rating } = review;
      const age =
        new Date().getFullYear() - new Date(member_birth_date).getFullYear();
      const ageGroup =
        age <= 19 ? '10s' : age <= 30 ? '20s' : age <= 40 ? '30s' : '40s 이상';
      const groupKey = `${member_gender}_${ageGroup}`;

      if (rating === 10) {
        // 하트 5개 (10점)
        genderAgeGroups[groupKey] += 1;
      }
    });

    const totalReviews = reviews.length;
    const percentages = Object.values(genderAgeGroups).map((count) =>
      ((count / totalReviews) * 100).toFixed(2)
    );

    return {
      labels: [
        'Female 10s',
        'Female 20s',
        'Female 30s',
        'Female 40s대 이상',
        'Male 10s',
        'Male 20s',
        'Male 30s',
        'Male 40s 이상',
      ],
      datasets: [
        {
          label: 'Gender & Age Group Distribution (%)',
          data: percentages,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(105, 105, 105, 0.2)',
            'rgba(255, 105, 180, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(105, 105, 105, 1)',
            'rgba(255, 105, 180, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  const ratingDistributionData = getRatingDistribution();
  const genderAgeDistributionData = getGenderAgeDistribution();

  const options = {
    indexAxis: 'y', // 누워있는 바 차트
    plugins: {
      datalabels: {
        color: 'black',
        font: {
          weight: 'bold',
          size: 12,
        },
        formatter: (value) => `${value}%`, // 퍼센트를 데이터 레이블로 표시
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Book Review Statistics</h2>
      {/* 평점 분포 그래프 */}
      <div>
        <h3>Rating Distribution</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div>
            <p>하트 1개</p>
            <Bar data={ratingDistributionData} options={options} />
            <p>{ratingDistributionData.datasets[0].label}</p>
          </div>
        </div>
      </div>

      {/* 성별 및 나이대별 분포 그래프 */}
      <div>
        <h3>Gender & Age Group Distribution (10s, 20s, 30s, 40s)</h3>
        <Bar data={genderAgeDistributionData} options={options} />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <p>
            여성:{' '}
            {genderAgeDistributionData.datasets[0].data.slice(0, 4).join('%, ')}
            %
          </p>
          <p>
            남성:{' '}
            {genderAgeDistributionData.datasets[0].data.slice(4).join('%, ')}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookReviewChart;
