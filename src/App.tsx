import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { plants } from './data/plants';
import { AppShell } from './components/shell/AppShell';
import { CareHubHeader } from './components/care/CareHubHeader';
import { PlantList } from './components/PlantList';
import { PlantDetail } from './components/PlantDetail';
import { LibraryPlaceholder } from './pages/LibraryPlaceholder';
import { ProfilePlaceholder } from './pages/ProfilePlaceholder';
import {
  addCareEvent,
  initializeCareEventsIfEmpty,
} from './storage/careEvents';
import {
  applyRecordToPresentation,
  countAllSuggestedChecks,
  countSuggestedChecks,
  loadPresentationStore,
} from './storage/presentation';
import type {
  AppTab,
  CareContext,
  CareEvent,
  CareEventType,
  PresentationStore,
} from './types';
import {
  enrichPlantsWithActivity,
  getEventsForPlant,
  groupPlantsByPresentation,
} from './utils/plantStatus';

type CareView = 'list' | 'detail';

function createCareEvent(plantId: string, type: CareEventType): CareEvent {
  return {
    id: crypto.randomUUID(),
    plantId,
    type,
    timestamp: new Date().toISOString(),
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('care');
  const [careContext, setCareContext] = useState<CareContext>('shared');
  const [careView, setCareView] = useState<CareView>('list');
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [careEvents, setCareEvents] = useState<CareEvent[]>(() =>
    initializeCareEventsIfEmpty(),
  );
  const [presentation, setPresentation] = useState<PresentationStore>(() =>
    loadPresentationStore(),
  );
  const [lastRecorded, setLastRecorded] = useState<CareEvent | null>(null);

  const personalBadge = countSuggestedChecks(presentation, 'personal');
  const sharedBadge = countSuggestedChecks(presentation, 'shared');
  const careBadge = countAllSuggestedChecks(presentation);

  const plantsWithActivity = useMemo(
    () =>
      enrichPlantsWithActivity(
        plants,
        careEvents,
        presentation[careContext],
      ),
    [careEvents, presentation, careContext],
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

  const handleTabChange = useCallback((tab: AppTab) => {
    setActiveTab(tab);
    setCareView('list');
    setSelectedPlantId(null);
    setLastRecorded(null);
  }, []);

  const handleContextChange = useCallback((context: CareContext) => {
    setCareContext(context);
    setCareView('list');
    setSelectedPlantId(null);
    setLastRecorded(null);
  }, []);

  const handleSelectPlant = useCallback((plantId: string) => {
    setSelectedPlantId(plantId);
    setLastRecorded(null);
    setCareView('detail');
  }, []);

  const handleBack = useCallback(() => {
    setCareView('list');
    setSelectedPlantId(null);
    setLastRecorded(null);
  }, []);

  const handleRecord = useCallback(
    (type: CareEventType) => {
      if (!selectedPlantId) {
        return;
      }

      const event = createCareEvent(selectedPlantId, type);
      const updatedEvents = addCareEvent(event);
      setCareEvents(updatedEvents);
      setLastRecorded(event);
      setPresentation((prev) =>
        applyRecordToPresentation(prev, careContext, selectedPlantId, type),
      );
    },
    [selectedPlantId, careContext],
  );

  const hideNav = activeTab === 'care' && careView === 'detail';

  let body: ReactNode = null;

  if (activeTab === 'care') {
    if (careView === 'detail' && selectedPlant) {
      body = (
        <PlantDetail
          plant={selectedPlant}
          events={selectedPlantEvents}
          lastRecorded={lastRecorded}
          onBack={handleBack}
          onRecord={handleRecord}
        />
      );
    } else {
      body = (
        <>
          <CareHubHeader
            context={careContext}
            personalBadge={personalBadge}
            sharedBadge={sharedBadge}
            onContextChange={handleContextChange}
          />
          <PlantList
            suggestedChecks={suggestedChecks}
            recentlyChecked={recentlyChecked}
            onSelectPlant={handleSelectPlant}
          />
        </>
      );
    }
  } else if (activeTab === 'library') {
    body = <LibraryPlaceholder />;
  } else {
    body = <ProfilePlaceholder />;
  }

  return (
    <AppShell
      activeTab={activeTab}
      careBadge={careBadge}
      onTabChange={handleTabChange}
      hideNav={hideNav}
    >
      {body}
    </AppShell>
  );
}
