import { useEffect, useState } from 'react';
import { useUserStore } from '../store/store';

const SESSION_KEY = 'sessionActive';

const useSingleSession = () => {
  const [isSessionConflict, setIsSessionConflict] = useState(false);
  const { user } = useUserStore();

  const getSession = () => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const checkConflict = (session: any) => {
    if (!session || session.userId !== user?.id) {
      setIsSessionConflict(true);
    } else {
      setIsSessionConflict(false);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const session = getSession();
    if (!session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, active: true }));
    }
    checkConflict(getSession());

    const onStorage = (e: StorageEvent) => {
      if (e.key === SESSION_KEY) {
        checkConflict(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener('storage', onStorage);

    const handleBeforeUnload = () => {
      if (getSession()?.userId === user.id) {
        localStorage.removeItem(SESSION_KEY);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user?.id]);

  return isSessionConflict;
};

export default useSingleSession;
