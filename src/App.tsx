import { useCallback, useMemo, useState } from 'react';
import { plants } from './data/plants';
import { PlantList } from './components/PlantList';
import { PlantDetail } from './components/PlantDetail';
import { PrototypeBanner } from './components/PrototypeBanner';
import {
  addCareEvent,
  initializeCareEventsIfEmpty,
} from './storage/careEvents';
import type { CareEvent, CareEventType } from './types';
import {
  enrichPlantsWithActivity,
  getEventsForPlant,
  groupPlantsByPresentation,
} from './utils/plantStatus';

type View = 'list' | 'detail';

function createCareEvent(plantId: string, type: CareEventType): CareEvent {
  return {
    id: crypto.randomUUID(),
    plantId,
    type,
    timestamp: new Date().toISOString(),
  };
}

export default function App() {
  const [view, setView] = useState<View>('list');
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [careEvents, setCareEvents] = useState<CareEvent[]>(() =>
    initializeCareEventsIfEmpty(),
  );
  const [lastRecorded, setLastRecorded] = useState<CareEvent | null>(null);

  const plantsWithActivity = useMemo(
    () => enrichPlantsWithActivity(plants, careEvents),
    [careEvents],
  );

  const { suggestedChecks, recentlyChecked } = useMemo(
    () => groupPlantsByPresentation(plantsWithActivity),
    [plantsWithActivity],
  );

  const selectedPlant = useMemo(
    () => plants.find((plant) => plant.id === selectedPlantId) ?? null,
    [selectedPlantId],
  );

  const selectedPlantEvents = useMemo(
    () =>
      selectedPlantId
        ? getEventsForPlant(selectedPlantId, careEvents)
        : [],
    [selectedPlantId, careEvents],
  );

  const handleSelectPlant = useCallback((plantId: string) => {
    setSelectedPlantId(plantId);
    setLastRecorded(null);
    setView('detail');
  }, []);

  const handleBack = useCallback(() => {
    setView('list');
    setSelectedPlantId(null);
    setLastRecorded(null);
  }, []);

  const handleRecord = useCallback(
    (type: CareEventType) => {
      if (!selectedPlantId) {
        return;
      }

      const event = createCareEvent(selectedPlantId, type);
      const updated = addCareEvent(event);
      setCareEvents(updated);
      setLastRecorded(event);
    },
    [selectedPlantId],
  );

  return (
    <div className="app">
      <PrototypeBanner />

      <main className="app-main">
        {view === 'list' && (
          <PlantList
            suggestedChecks={suggestedChecks}
            recentlyChecked={recentlyChecked}
            onSelectPlant={handleSelectPlant}
          />
        )}

        {view === 'detail' && selectedPlant && (
          <PlantDetail
            plant={selectedPlant}
            events={selectedPlantEvents}
            lastRecorded={lastRecorded}
            onBack={handleBack}
            onRecord={handleRecord}
          />
        )}
      </main>
    </div>
  );
}
