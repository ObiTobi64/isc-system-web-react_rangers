import { useState, useEffect } from 'react';
import Mentor from '../models/mentorInterface';
import { getMentors } from '../services/mentorsService';

const useReviewers = () => {
  const [reviewers, setReviewers] = useState<Mentor[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const response = await getMentors();
        setReviewers(response.data);
      } catch (e) {
        setError('Error getting mentors');
      }
    };

    fetchReviewers();
  }, []);

  return { reviewers, error };
};

export default useReviewers;
