import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GET_BOOK_ALL_CATEGORIES_API_URL } from '../../util/apiUrl';
import './Common.css';

const CategoryFilter = ({ onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); // 기본값으로 전체 선택

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(GET_BOOK_ALL_CATEGORIES_API_URL); // 카테고리 데이터 가져오기
        setCategories(response.data.categories); // 카테고리 상태 업데이트
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);
    onCategoryChange(value); // 부모 컴포넌트에 선택한 카테고리 전달
  };

  return (
    <div className="category-filter">
      <label htmlFor="category-select"></label>
      <select
        id="category-select"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <option value="">전체</option> {/* 전체 선택 옵션 */}
        {categories.map((category) => (
          <option key={category.genre_tag_id} value={category.genre_tag_id}>
            {category.genre_tag_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
