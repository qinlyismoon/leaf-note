import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { buildCarePlants } from './data/plants';
import { AppShell } from './components/shell/AppShell';
import { checkStatusLabel, getCheckStatus } from './utils/checkSchedule';
import { HandoffButton } from './components/care/HandoffButton';
import { CareHubHeader } from './components/care/CareHubHeader';
import { HandoffPage } from './components/care/HandoffPage';
import { HandoffRequestCard } from './components/care/HandoffRequestCard';
import { SharedPage, type SharedTab } from './components/care/SharedPage';
import { AwayRow } from './components/care/AwayRow';
import { CareReminderPopup } from './components/care/CareReminderPopup';
import { UpdatesPage } from './components/care/UpdatesPage';
import { PlantList } from './components/PlantList';
import { PlantDetail } from './components/PlantDetail';
import type { HistoryActor } from './components/CareHistory';
import type { HandoffPair } from './components/CarePlantCard';
import { Toast } from './components/Toast';
import { LibraryPage } from './pages/LibraryPage';
import { ProfilePage } from './pages/ProfilePage';
import {
  addPhotoToCareEvent,
  addCareEvent,
  initializeCareEventsIfEmpty,
} from './storage/careEvents';
import {
  acceptHandoff,
  cancelHandoff,
  createHandoff,
  declineHandoff,
  endHandoff,
  getAcceptedSharedPlantIds,
  getActiveHandoffForPlant,
  getIncomingPendingHandoffs,
  getOwnerActiveHandoffs,
  getSharedActionablePlantIds,
  loadHandoffs,
} from './storage/handoffs';
import {
  addPlantInstance,
  loadPlantInstances,
  PlantStorageFullError,
  updatePlantInstance,
} from './storage/plantInstances';
import {
  applyRecordToPresentation,
  countSuggestedChecks,
  loadPresentationStore,
  savePresentationStore,
} from './storage/presentation';
import {
  findResolvedUserByEmail,
  listPrototypeUsers,
  loadCurrentUser,
  resolveUser,
  setCurrentUserId,
} from './storage/profile';
import { removePlantCascade } from './storage/removePlant';
import {
  addRelationshipUpdate,
  resolveHandoffUpdates,
  countUnreadUpdates,
  formatCareActivityMessage,
  formatHandoffRequestMessage,
  getUpdatesForUser,
  loadRelationshipUpdates,
  markUpdatesReadForUser,
  toggleUpdateReaction,
  addUpdateReply,
  markUpdateRead,
  formatCareReminderMessage,
} from './storage/relationshipUpdates';
import type {
  AppTab,
  CareContext,
  CareEvent,
  CareEventType,
  Handoff,
  PlantInstance,
  PresentationStore,
  PrototypeUser,
  RelationshipUpdate,
} from './types';
import {
  canRecordCare,
  filterPersonalCarePlants,
  filterSharedCarePlants,
  getCarePlantCardVariant,
  listHandoffEligibility,
  personalBadgePlantIds,
} from './utils/handoffAccess';
import {
  enrichPlantsWithActivity,
  getCarePresentationState,
  getEventsForPlant,
  groupPlantsByPresentation,
} from './utils/plantStatus';
import { isValidEmailFormat } from './data/users';
import { CARE_EVENT_HISTORY_LABELS } from './types';
import { formatRelativeTime } from './utils/formatRelativeTime';

type CareView = 'list' | 'detail' | 'handoff' | 'updates';

function createCareEvent(
  plantId: string,
  type: CareEventType,
  actorUserId: string,
): CareEvent {
  return {
    id: crypto.randomUUID(),
    plantId,
    type,
    actorUserId,
    timestamp: new Date().toISOString(),
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('care');
  const [careContext, setCareContext] = useState<CareContext>('personal');
  const [careView, setCareView] = useState<CareView>('list');
  const [sharedTab, setSharedTab] = useState<SharedTab>('caring');
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [libraryDetailId, setLibraryDetailId] = useState<string | null>(null);
  const [instances, setInstances] = useState<PlantInstance[]>(() =>
    loadPlantInstances(),
  );
  const [careEvents, setCareEvents] = useState<CareEvent[]>(() =>
    initializeCareEventsIfEmpty(),
  );
  const [presentation, setPresentation] = useState<PresentationStore>(() =>
    loadPresentationStore(),
  );
  const [handoffs, setHandoffs] = useState<Handoff[]>(() => loadHandoffs());
  const [updates, setUpdates] = useState<RelationshipUpdate[]>(() =>
    loadRelationshipUpdates(),
  );
  const [currentUser, setCurrentUser] = useState<PrototypeUser>(() =>
    loadCurrentUser(),
  );
  const [lastRecorded, setLastRecorded] = useState<CareEvent | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const users = useMemo(() => listPrototypeUsers(), [currentUser]);

  const ownedInstances = useMemo(
    () => instances.filter((plant) => plant.ownerId === currentUser.id),
    [instances, currentUser.id],
  );

  const carePlants = useMemo(() => buildCarePlants(instances), [instances]);

  const personalPlants = useMemo(
    () => filterPersonalCarePlants(carePlants, currentUser.id),
    [carePlants, currentUser.id],
  );

  const sharedPlantIds = useMemo(
    () => getAcceptedSharedPlantIds(currentUser.id, handoffs),
    [currentUser.id, handoffs],
  );

  const sharedPlants = useMemo(
    () => filterSharedCarePlants(carePlants, sharedPlantIds),
    [carePlants, sharedPlantIds],
  );

  // Shared tab's "Caring for others" lists only plants owned by someone else;
  // the owner's own handed-off plants appear under "Your handoffs" instead.
  const caringForOthers = useMemo(
    () => sharedPlants.filter((plant) => plant.ownerId !== currentUser.id),
    [sharedPlants, currentUser.id],
  );

  // Care lists only what you look after yourself: plants in someone else's
  // care move to Shared → Your handoffs (pending ones stay until accepted).
  const awayPlantIds = useMemo(() => new Set(
    handoffs.filter((h) => h.ownerId === currentUser.id && h.status === 'accepted').flatMap((h) => h.plantIds),
  ), [handoffs, currentUser.id]);

  const contextPlants = useMemo(
    () => careContext === 'personal'
      ? personalPlants.filter((plant) => !awayPlantIds.has(plant.id))
      : caringForOthers,
    [careContext, personalPlants, awayPlantIds, caringForOthers],
  );

  const personalBadgeIds = useMemo(
    () => personalBadgePlantIds(carePlants, currentUser.id, handoffs),
    [carePlants, currentUser.id, handoffs],
  );

  const sharedActionableIds = useMemo(
    () => getSharedActionablePlantIds(currentUser.id, handoffs),
    [currentUser.id, handoffs],
  );

  const incomingRequests = useMemo(
    () => getIncomingPendingHandoffs(currentUser.id, handoffs),
    [currentUser.id, handoffs],
  );

  const carePresentation = useMemo(() => {
    const states = Object.fromEntries(carePlants.map(plant => [plant.id,
      getCarePresentationState(plant.id, plant.speciesId, careEvents)
    ]));
    return { personal: states, shared: states };
  }, [carePlants, careEvents, presentation]);

  const personalBadge = countSuggestedChecks(
    carePresentation,
    'personal',
    personalBadgeIds,
  );
  const sharedBadge = countSuggestedChecks(
    carePresentation,
    'shared',
    sharedActionableIds,
  );
  // Shared tab badge counts what is waiting on the current user there:
  // incoming requests plus suggested checks on plants they care for.
  const navBadges = {
    care: personalBadge,
    shared: incomingRequests.length + sharedBadge,
  };

  const unreadUpdates = countUnreadUpdates(currentUser.id, updates);

  const plantsWithActivity = useMemo(
    () =>
      enrichPlantsWithActivity(contextPlants, careEvents),
    [contextPlants, careEvents],
  );

  const { suggestedChecks, recentlyChecked } = useMemo(
    () => groupPlantsByPresentation(plantsWithActivity),
    [plantsWithActivity],
  );

  const selectedPlant = useMemo(
    () => carePlants.find((plant) => plant.id === selectedPlantId) ?? null,
    [carePlants, selectedPlantId],
  );

  const selectedPlantEvents = useMemo(
    () =>
      selectedPlantId
        ? getEventsForPlant(selectedPlantId, careEvents)
        : [],
    [selectedPlantId, careEvents],
  );

  const selectedActiveHandoff = useMemo(
    () => selectedPlantId ? getActiveHandoffForPlant(selectedPlantId, handoffs) : null,
    [selectedPlantId, handoffs],
  );

  const plantNameById = useMemo(() => {
    const map: Record<string, string> = {};
    instances.forEach((instance) => {
      map[instance.id] = instance.name;
    });
    return map;
  }, [instances]);

  const eligibility = useMemo(
    () => listHandoffEligibility(carePlants, currentUser.id, handoffs),
    [carePlants, currentUser.id, handoffs],
  );

  const activeOwnerHandoffs = useMemo(
    () => getOwnerActiveHandoffs(currentUser.id, handoffs),
    [currentUser.id, handoffs],
  );

  // Once a plant has been shared, every record shows who did it (avatar +
  // name, "You" for yourself); a plant only you have cared for shows none.
  const selectedPlantShared = useMemo(() => Boolean(selectedPlantId) && (
    handoffs.some((h) => h.plantIds.includes(selectedPlantId!) && (h.status === 'accepted' || h.status === 'ended'))
    || selectedPlantEvents.some((event) => event.actorUserId !== currentUser.id)
  ), [selectedPlantId, handoffs, selectedPlantEvents, currentUser.id]);

  const resolveActor = useCallback((actorUserId: string): HistoryActor | null => {
    if (!selectedPlantShared) return null;
    const user = listPrototypeUsers().find((item) => item.id === actorUserId);
    const name = user?.displayName ?? 'Someone';
    return { name, initials: user?.initials, label: actorUserId === currentUser.id ? 'You' : name };
  }, [currentUser.id, selectedPlantShared]);

  const resolveUserName = useCallback((userId: string) => {
    const user = listPrototypeUsers().find((item) => item.id === userId);
    return user?.displayName ?? 'Someone';
  }, []);

  const handleTabChange = useCallback((tab: AppTab) => {
    setActiveTab(tab);
    setCareContext(tab === 'shared' ? 'shared' : 'personal');
    setCareView('list');
    setSelectedPlantId(null);
    setLastRecorded(null);
    setLibraryDetailId(null);
  }, []);

  const handleSelectPlant = useCallback(
    (plantId: string) => {
      const plant = carePlants.find((item) => item.id === plantId);
      if (!plant) {
        return;
      }
      const variant = getCarePlantCardVariant(
        plant,
        careContext,
        currentUser.id,
        handoffs,
      );
      if (variant === 'handed_off_owner') {
        return;
      }
      setSelectedPlantId(plantId);
      setLastRecorded(null);
      setCareView('detail');
    },
    [carePlants, careContext, currentUser.id, handoffs],
  );

  const handleBack = useCallback(() => {
    // A Library "View care" for a handed-off plant opens detail in the shared
    // context; returning must land on the list that matches the current tab.
    setCareContext(activeTab === 'shared' ? 'shared' : 'personal');
    setCareView('list');
    setSelectedPlantId(null);
    setLastRecorded(null);
  }, [activeTab]);

  const handleRecord = useCallback(
    (type: CareEventType) => {
      if (!selectedPlantId || !selectedPlant) {
        return;
      }
      if (
        !canRecordCare(
          selectedPlant,
          careContext,
          currentUser.id,
          handoffs,
        )
      ) {
        return;
      }

      const event = createCareEvent(selectedPlantId, type, currentUser.id);
      const updatedEvents = addCareEvent(event);
      setCareEvents(updatedEvents);
      setLastRecorded(event);
      setPresentation((prev) =>
        applyRecordToPresentation(prev, careContext, selectedPlantId, type),
      );

      if (
        careContext === 'shared' &&
        selectedPlant.ownerId !== currentUser.id
      ) {
        const nextUpdates = addRelationshipUpdate({
          kind: 'care_activity',
          recipientUserId: selectedPlant.ownerId,
          actorUserId: currentUser.id,
          careEventId: event.id,
          plantId: selectedPlant.id,
          message: formatCareActivityMessage({
            caregiverName: currentUser.displayName,
            plantName: selectedPlant.name,
            type,
          }),
        });
        setUpdates(nextUpdates);
      }
    },
    [selectedPlantId, selectedPlant, currentUser, careContext, handoffs],
  );

  const handleAddCarePhoto = useCallback((eventId: string, photoDataUrl: string) => {
    const updatedEvents = addPhotoToCareEvent(eventId, photoDataUrl);
    setCareEvents(updatedEvents);
    setLastRecorded((event) => event?.id === eventId ? { ...event, photoDataUrl } : event);
  }, []);

  const handleAddPlant = useCallback(
    (input: {
      speciesId: string;
      location?: string;
      hasTray: boolean;
      identificationLabel?: string;
      photoSrc?: string;
    }) => {
      let nextInstances;
      try {
        nextInstances = addPlantInstance({
          ...input,
          ownerId: currentUser.id,
        });
      } catch (error) {
        if (error instanceof PlantStorageFullError) {
          setToast('Storage is full — try again without the photo');
          return;
        }
        throw error;
      }
      const knownIds = new Set(instances.map((instance) => instance.id));
      const added = nextInstances.find((instance) => !knownIds.has(instance.id));
      setInstances(nextInstances);
      if (added) {
        setPresentation((current) => {
          const next = {
            personal: { ...current.personal, [added.id]: 'suggested_check' as const },
            shared: { ...current.shared },
          };
          savePresentationStore(next);
          return next;
        });
      }
    },
    [currentUser.id, instances],
  );

  const handleUpdatePlant = useCallback(
    (
      instanceId: string,
      input: {
        location?: string;
        hasTray: boolean;
        identificationLabel?: string;
        photoSrc?: string;
      },
    ) => {
      if (!ownedInstances.some((plant) => plant.id === instanceId)) return;
      try {
        setInstances(updatePlantInstance(instanceId, input));
      } catch (error) {
        if (error instanceof PlantStorageFullError) {
          setToast('Storage is full — the new photo was not saved');
          return;
        }
        throw error;
      }
    },
    [ownedInstances],
  );

  const handleRemovePlant = useCallback((instanceId: string) => {
    if (!ownedInstances.some((plant) => plant.id === instanceId)) return;
    const result = removePlantCascade(instanceId);
    setInstances(result.instances);
    setCareEvents(result.careEvents);
    setPresentation(result.presentation);
    setHandoffs(result.handoffs);
    setUpdates(result.updates);
    setSelectedPlantId((current) =>
      current === instanceId ? null : current,
    );
    setLastRecorded((current) =>
      current?.plantId === instanceId ? null : current,
    );
  }, [ownedInstances]);

  const handleViewCare = useCallback(
    (instanceId: string) => {
      const plant = carePlants.find((item) => item.id === instanceId);
      const overlay = plant
        ? getCarePlantCardVariant(
            plant,
            'personal',
            currentUser.id,
            handoffs,
          )
        : null;
      if (overlay === 'handed_off_owner') {
        setActiveTab('care');
        setCareContext('shared');
        setLibraryDetailId(null);
        setSelectedPlantId(instanceId);
        setLastRecorded(null);
        setCareView('detail');
        return;
      }
      setActiveTab('care');
      setCareContext('personal');
      setLibraryDetailId(null);
      setSelectedPlantId(instanceId);
      setLastRecorded(null);
      setCareView('detail');
    },
    [carePlants, currentUser.id, handoffs],
  );

  const handleSendHandoff = useCallback(
    (input: { plantIds: string[]; caregiverEmail: string }) => {
      const allowed = new Set(eligibility.filter(item => item.selectable).map(item => item.plant.id));
      if (!input.plantIds.length || input.plantIds.some(id => !allowed.has(id))) {
        return 'Some plants are no longer available. Go back and update your selection.';
      }
      if (!isValidEmailFormat(input.caregiverEmail)) {
        return 'Enter a valid email address.';
      }
      const caregiver = findResolvedUserByEmail(input.caregiverEmail);
      if (!caregiver) {
        return 'No Leafnote prototype user matches that email. Try jordan@leafnote.local.';
      }
      if (caregiver.id === currentUser.id) {
        return 'Choose a different email than your own.';
      }

      const handoff = createHandoff({
        ownerId: currentUser.id,
        caregiverUserId: caregiver.id,
        caregiverEmail: caregiver.email,
        plantIds: input.plantIds,
      });
      setHandoffs(loadHandoffs());

      const nextUpdates = addRelationshipUpdate({
        kind: 'handoff_request',
        recipientUserId: caregiver.id,
        actorUserId: currentUser.id,
        handoffId: handoff.id,
        plantIds: input.plantIds,
        message: formatHandoffRequestMessage({
          ownerName: currentUser.displayName,
          plantCount: input.plantIds.length,
        }),
      });
      setUpdates(nextUpdates);
      setToast('Handoff request sent');
      return null;
    },
    [currentUser, eligibility],
  );

  const handleFinishHandoff = useCallback((handoffId: string, kind: 'cancel' | 'end') => {
    const existing = loadHandoffs().find(h => h.id === handoffId);
    if (!existing || existing.ownerId !== currentUser.id) return;
    const finished = kind === 'cancel' ? cancelHandoff(handoffId) : endHandoff(handoffId);
    if (!finished) return;
    resolveHandoffUpdates(handoffId);
    const action = kind === 'cancel' ? 'cancelled the handoff request' : 'ended the handoff';
    for (const recipientUserId of [finished.ownerId, finished.caregiverUserId]) {
      addRelationshipUpdate({ kind: 'handoff_request', recipientUserId,
        actorUserId: currentUser.id, handoffId, plantIds: finished.plantIds,
        message: `${currentUser.displayName} ${action}`,
        readAt: recipientUserId === currentUser.id ? new Date().toISOString() : null });
    }
    setHandoffs(loadHandoffs());
    setUpdates(loadRelationshipUpdates());
    setToast(kind === 'cancel' ? 'Request cancelled' : 'Handoff ended');
  }, [currentUser]);

  const handleAcceptHandoff = useCallback((handoffId: string) => {
    if (loadHandoffs().find(h => h.id === handoffId)?.caregiverUserId !== currentUser.id) return;
    const accepted = acceptHandoff(handoffId);
    setHandoffs(loadHandoffs());
    if (accepted) {
      resolveHandoffUpdates(handoffId);
      const nextUpdates = addRelationshipUpdate({
        kind: 'handoff_request',
        recipientUserId: accepted.ownerId,
        actorUserId: currentUser.id,
        handoffId: accepted.id,
        plantIds: accepted.plantIds,
        message: `${currentUser.displayName} accepted your handoff`,
      });
      setUpdates(nextUpdates);
      setToast('Handoff accepted');
    }
  }, [currentUser]);

  const handleDeclineHandoff = useCallback((handoffId: string) => {
    if (loadHandoffs().find(h => h.id === handoffId)?.caregiverUserId !== currentUser.id) return;
    const declined = declineHandoff(handoffId);
    if (!declined) return;
    resolveHandoffUpdates(handoffId);
    for (const recipientUserId of [declined.ownerId, declined.caregiverUserId]) {
      addRelationshipUpdate({ kind: 'handoff_request', recipientUserId,
        actorUserId: currentUser.id, handoffId, plantIds: declined.plantIds,
        message: `${currentUser.displayName} declined the handoff request`,
        readAt: recipientUserId === currentUser.id ? new Date().toISOString() : null });
    }
    setHandoffs(loadHandoffs());
    setUpdates(loadRelationshipUpdates());
    setToast('Handoff declined');
  }, [currentUser]);

  const handleMarkUpdatesRead = useCallback(() => {
    setUpdates(markUpdatesReadForUser(currentUser.id));
  }, [currentUser.id]);

  const handleToggleUpdateReaction = useCallback((updateId: string) => {
    setUpdates(toggleUpdateReaction(updateId, currentUser.id));
  }, [currentUser.id]);

  const handleReplyToUpdate = useCallback((updateId: string, text: string) => {
    setUpdates(addUpdateReply(updateId, currentUser.id, text));
  }, [currentUser.id]);

  // Owner nudges the caregiver about one plant; at most once a day per plant.
  const remindedTodayAt = useCallback((plantId: string): string | null => {
    const today = new Date().toDateString();
    const sent = updates.find((item) => item.kind === 'care_reminder' && item.actorUserId === currentUser.id
      && item.plantId === plantId && new Date(item.createdAt).toDateString() === today);
    return sent?.createdAt ?? null;
  }, [updates, currentUser.id]);

  const handleRemind = useCallback((plantId: string) => {
    const active = getActiveHandoffForPlant(plantId, handoffs);
    const plant = carePlants.find((item) => item.id === plantId);
    if (!active || active.status !== 'accepted' || active.ownerId !== currentUser.id || !plant) return;
    setUpdates(addRelationshipUpdate({
      kind: 'care_reminder',
      recipientUserId: active.caregiverUserId,
      actorUserId: currentUser.id,
      handoffId: active.id,
      plantId,
      message: formatCareReminderMessage({ ownerName: currentUser.displayName, plantName: plant.name }),
    }));
    // The card itself turns into "Reminder sent" — no extra toast.
  }, [handoffs, carePlants, currentUser]);

  // The caregiver sees the newest unread reminder as a pop-up.
  const pendingReminder = useMemo(() => updates
    .filter((item) => item.kind === 'care_reminder' && item.recipientUserId === currentUser.id && !item.readAt)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null, [updates, currentUser.id]);

  const handleReminderLater = useCallback((updateId: string) => {
    setUpdates(markUpdateRead(updateId));
  }, []);

  const handleReminderCheck = useCallback((updateId: string, plantId: string) => {
    setUpdates(markUpdateRead(updateId));
    setActiveTab('shared');
    setCareContext('shared');
    setSelectedPlantId(plantId);
    setLastRecorded(null);
    setCareView('detail');
  }, []);

  const handleSwitchUser = useCallback((userId: string) => {
    setCurrentUserId(userId);
    setCurrentUser(loadCurrentUser());
    setLibraryDetailId(null);
    setCareContext('personal');
    setCareView('list');
    setSelectedPlantId(null);
    setLastRecorded(null);
  }, []);

  const caregiverNameForPlant = useCallback(
    (plantId: string) => {
      const active = getActiveHandoffForPlant(plantId, handoffs);
      if (!active) {
        return undefined;
      }
      const user = resolveUser(active.caregiverUserId);
      return user?.displayName ?? active.caregiverEmail;
    },
    [handoffs],
  );

  // Navigation direction drives screen transitions: deeper = push, back = pop,
  // switching tabs = a soft cross-fade. Screens animate on mount from CSS.
  const depth = hideNav0() ? 1 : 0;
  const lastNav = useRef<{ tab: AppTab; depth: number; direction: 'push' | 'pop' | 'tab' | 'none' }>(
    { tab: activeTab, depth, direction: 'none' },
  );
  const navDirection =
    lastNav.current.tab !== activeTab
      ? 'tab'
      : depth > lastNav.current.depth
        ? 'push'
        : depth < lastNav.current.depth
          ? 'pop'
          : lastNav.current.direction; // keep it stable across unrelated re-renders
  useEffect(() => {
    lastNav.current = { tab: activeTab, depth, direction: navDirection };
  });

  function hideNav0() {
    return ((activeTab === 'care' || activeTab === 'shared') && careView !== 'list') ||
      (activeTab === 'library' && libraryDetailId !== null);
  }

  const hideNav =
    ((activeTab === 'care' || activeTab === 'shared') &&
      (careView === 'detail' ||
        careView === 'handoff' ||
        careView === 'updates')) ||
    (activeTab === 'library' && libraryDetailId !== null);

  // Owner + caregiver avatars on every card of a shared plant, whoever looks.
  const handoffPairFor = (plantId: string): HandoffPair | undefined => {
    const active = getActiveHandoffForPlant(plantId, handoffs);
    if (!active || (active.status !== 'pending' && active.status !== 'accepted')) return undefined;
    const owner = resolveUser(active.ownerId);
    const caregiver = resolveUser(active.caregiverUserId);
    return {
      status: active.status,
      owner: { name: owner?.displayName ?? 'Owner', initials: owner?.initials },
      caregiver: { name: caregiver?.displayName ?? active.caregiverEmail, initials: caregiver?.initials },
    };
  };

  let body: ReactNode = null;

  if (activeTab === 'care' || activeTab === 'shared') {
    if (careView === 'handoff') {
      body = (
        <HandoffPage
          currentUserEmail={currentUser.email}
          eligibility={eligibility}
          onBack={() => setCareView('list')}
          onSend={handleSendHandoff}
        />
      );
    } else if (careView === 'updates') {
      body = (
        <UpdatesPage
          updates={getUpdatesForUser(currentUser.id, updates)}
          careEvents={careEvents}
          currentUserId={currentUser.id}
          handoffs={handoffs}
          plantNameById={plantNameById}
          plantsById={Object.fromEntries(instances.map((instance) => [instance.id, instance]))}
          resolveUserName={resolveUserName}
          resolveUserInitials={(userId) =>
            resolveUser(userId)?.initials ?? 'LN'
          }
          onBack={() => setCareView('list')}
          onMarkRead={handleMarkUpdatesRead}
          onToggleReaction={handleToggleUpdateReaction}
          onReply={handleReplyToUpdate}
        />
      );
    } else if (careView === 'detail' && selectedPlant) {
      body = (
        <PlantDetail
          plant={selectedPlant}
          events={selectedPlantEvents}
          lastRecorded={lastRecorded}
          isSharedCare={careContext === 'shared' && selectedPlant.ownerId !== currentUser.id}
          suggested={carePresentation[careContext][selectedPlant.id] !== 'recently_checked'}
          statusLabel={checkStatusLabel(getCheckStatus(selectedPlant.id, selectedPlant.speciesId, careEvents))}
          delegatedCaregiver={selectedActiveHandoff?.status === 'accepted' &&
            selectedPlant.ownerId === currentUser.id
            ? {
              name: resolveUser(selectedActiveHandoff.caregiverUserId)?.displayName ?? selectedActiveHandoff.caregiverEmail,
              initials: resolveUser(selectedActiveHandoff.caregiverUserId)?.initials,
            }
            : undefined}
          canRecord={canRecordCare(
            selectedPlant,
            careContext,
            currentUser.id,
            handoffs,
          )}
          onBack={handleBack}
          backLabel={activeTab === 'shared' ? 'Back to Shared' : 'Back to Care'}
          onRecord={handleRecord}
          onAddPhoto={handleAddCarePhoto}
          ownerName={resolveUser(selectedPlant.ownerId)?.displayName}
          onRemind={selectedActiveHandoff?.status === 'accepted' &&
            selectedActiveHandoff.ownerId === currentUser.id
            ? () => handleRemind(selectedPlant.id)
            : undefined}
          remindedAt={remindedTodayAt(selectedPlant.id)}
          resolveActor={resolveActor}
        />
      );
    } else {
      const plantList = (
        <PlantList
          suggestedChecks={suggestedChecks}
          recentlyChecked={recentlyChecked}
          emptyMessage={
            careContext === 'shared'
              ? 'No plants from others yet.'
              : 'No plants in Care yet.'
          }
          hideEmpty={careContext === 'shared' && incomingRequests.length > 0}
          getVariant={(plantId) => {
            const plant = carePlants.find((item) => item.id === plantId);
            if (!plant) {
              return 'actionable';
            }
            return getCarePlantCardVariant(
              plant,
              careContext,
              currentUser.id,
              handoffs,
            );
          }}
          getCaregiverName={caregiverNameForPlant}
          isPending={(plantId) =>
            getActiveHandoffForPlant(plantId, handoffs)?.status === 'pending'
          }
          getHandoffPair={handoffPairFor}
          onSelectPlant={handleSelectPlant}
        />
      );

      if (activeTab === 'shared') {
        body = (
          <SharedPage
            requests={incomingRequests.map((handoff) => {
              const sender =
                resolveUser(handoff.ownerId) ?? listPrototypeUsers()[0];
              return (
                <HandoffRequestCard
                  key={handoff.id}
                  handoff={handoff}
                  sender={sender}
                  plants={handoff.plantIds
                    .map((id) => instances.find((instance) => instance.id === id))
                    .filter((plant): plant is PlantInstance => Boolean(plant))}
                  onAccept={handleAcceptHandoff}
                  onDecline={handleDeclineHandoff}
                />
              );
            })}
            caringList={plantList}
            ownerHandoffs={activeOwnerHandoffs}
            ownedInstances={ownedInstances}
            resolveUser={(id) => resolveUser(id) ?? undefined}
            unreadUpdates={unreadUpdates}
            onHandOff={() => setCareView('handoff')}
            onOpenUpdates={() => setCareView('updates')}
            onEndHandoff={(id) => handleFinishHandoff(id, 'end')}
            onCancelHandoff={(id) => handleFinishHandoff(id, 'cancel')}
            tab={sharedTab}
            onTabChange={setSharedTab}
            caringCount={sharedBadge}
            renderHandoffPlants={(handoffId, plantIds) => {
              // Same split as Care: what's due now vs. not yet. The checks are
              // the caregiver's to do, so no "needs you" count badge here.
              const groups = groupPlantsByPresentation(enrichPlantsWithActivity(
                carePlants.filter((plant) => plantIds.includes(plant.id)), careEvents));
              return (
                <PlantList
                  suggestedChecks={groups.suggestedChecks}
                  recentlyChecked={groups.recentlyChecked}
                  getVariant={() => 'shared_owner'}
                  getHandoffPair={handoffPairFor}
                  onSelectPlant={handleSelectPlant}
                  showCounts={false}
                  idPrefix={`${handoffId}-`}
                />
              );
            }}
          />
        );
      } else {
        body = (
          <div className="screen screen--root has-handoff-fab">
            <CareHubHeader />
            {plantList}
            {activeOwnerHandoffs.filter((h) => h.status === 'accepted').map((h) => {
              const caregiver = resolveUser(h.caregiverUserId);
              return (
                <AwayRow key={h.id}
                  caregiver={{ name: caregiver?.displayName ?? h.caregiverEmail, initials: caregiver?.initials }}
                  plants={ownedInstances.filter((plant) => h.plantIds.includes(plant.id))}
                  onOpen={() => { setSharedTab('handoffs'); handleTabChange('shared'); }}
                />
              );
            })}
            <HandoffButton onClick={() => setCareView('handoff')} />
          </div>
        );
      }
    }
  } else if (activeTab === 'library') {
    body = (
      <LibraryPage
        key={currentUser.id}
        instances={ownedInstances}
        detailId={libraryDetailId}
        onDetailIdChange={setLibraryDetailId}
        onAddPlant={handleAddPlant}
        onUpdatePlant={handleUpdatePlant}
        onRemovePlant={handleRemovePlant}
        onViewCare={handleViewCare}
        getCareSummary={(instanceId) => {
          const last = getEventsForPlant(instanceId, careEvents)[0];
          const inst = instances.find((item) => item.id === instanceId);
          return {
            lastActivity: last
              ? `${CARE_EVENT_HISTORY_LABELS[last.type]} ${formatRelativeTime(last.timestamp)}`
              : 'No care recorded yet',
            status: getCheckStatus(instanceId, inst?.speciesId ?? '', careEvents),
          };
        }}
      />
    );
  } else {
    body = (
      <ProfilePage
        currentUser={currentUser}
        users={users}
        onSwitchUser={handleSwitchUser}
      />
    );
  }

  return (
    <AppShell
      activeTab={activeTab}
      badges={navBadges}
      dots={{ shared: unreadUpdates > 0 }}
      onTabChange={handleTabChange}
      hideNav={hideNav}
      navDirection={navDirection}
      screenKey={`${activeTab}:${careView}:${selectedPlantId ?? ''}:${libraryDetailId ?? ''}`}
      photoTop={
        ((activeTab === 'care' || activeTab === 'shared') &&
          careView === 'detail' &&
          Boolean(selectedPlant?.photoSrc)) ||
        (activeTab === 'library' && libraryDetailId !== null)
      }
    >
      {body}
      {(() => {
        if (!pendingReminder?.plantId) return null;
        const plant = carePlants.find((item) => item.id === pendingReminder.plantId);
        if (!plant || (careView === 'detail' && selectedPlantId === plant.id)) return null;
        const sender = resolveUser(pendingReminder.actorUserId);
        return (
          <CareReminderPopup
            key={pendingReminder.id}
            sender={{ name: sender?.displayName ?? 'Owner', initials: sender?.initials }}
            plant={plant}
            sentAt={pendingReminder.createdAt}
            onLater={() => handleReminderLater(pendingReminder.id)}
            onCheck={() => handleReminderCheck(pendingReminder.id, plant.id)}
          />
        );
      })()}
      {toast ? (
        <Toast
          message={toast}
          open
          onDismiss={() => setToast(null)}
        />
      ) : null}
    </AppShell>
  );
}
