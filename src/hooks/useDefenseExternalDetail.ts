import { useState, useEffect } from 'react';
import { getDefenseDetail } from '../services/defenseDetail';
import { DefenseDetail } from '../services/models/DefenseDetail';

const DEFENSE_INTERNAL = 'external';

const useDefenseExternalDetail = (processId: number | null) => {
  const [defenseDetail, setDefenseDetail] = useState<DefenseDetail | null>(null);

  useEffect(() => {
    if (processId) {
      const fetchDefenseDetail = async () => {
        const internalDefense = await getDefenseDetail(processId, DEFENSE_INTERNAL);
        setDefenseDetail(internalDefense);
      };

      fetchDefenseDetail();
    }
  }, [processId]);

  return defenseDetail;
};

export default useDefenseExternalDetail;
