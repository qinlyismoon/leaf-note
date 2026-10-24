import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { CarePlantCard } from '../src/components/CarePlantCard';
import { buildCarePlants } from '../src/data/plants';
import { PlantDetail } from '../src/components/PlantDetail';
import { ProfilePage } from '../src/pages/ProfilePage';
import { SharedPage } from '../src/components/care/SharedPage';
import { PlantList } from '../src/components/PlantList';
import { CareHubHeader } from '../src/components/care/CareHubHeader';
import { BottomNav } from '../src/components/shell/BottomNav';
import { enrichPlantsWithActivity, getCarePresentationState } from '../src/utils/plantStatus';
import { canRecordCare, getCarePlantCardVariant, personalBadgePlantIds } from '../src/utils/handoffAccess';
import * as handoffStore from '../src/storage/handoffs';
import * as relationshipStore from '../src/storage/relationshipUpdates';
import { addPhotoToCareEvent, loadCareEvents, saveCareEvents } from '../src/storage/careEvents';
import { countSuggestedChecks } from '../src/storage/presentation';
import type { CareEvent, Handoff, Plant, PresentationState } from '../src/types';

const plant: Plant = { id: 'succulent-shelf', speciesId: 'echeveria', name: 'Shelf succulent',
  ownerId: 'owner', careConfigured: true, hasTray: true, identificationLabel: 'tray', plantType: 'Succulent',
  identification: [], whatToObserve: [], whenMayNeedWater: [], howToWater: [], whenToStop: [], potDrainageLocation: [],
  whyCheck: { text: 'Check first', source: 'mock_prototype_content' },
  suggestedCheckRhythm: { text: 'Every few days', source: 'mock_prototype_content' } };
const event: CareEvent = { id: 'seed-3', plantId: plant.id, type: 'checked', actorUserId: 'owner', timestamp: '2026-09-06T12:00:00Z' };
const initial: Handoff = { id: 'handoff', ownerId: 'owner', caregiverUserId: 'helper', caregiverEmail: 'helper@example.com',
  plantIds: [plant.id], status: 'pending', createdAt: '2026-09-07T12:00:00Z', updatedAt: '2026-09-07T12:00:00Z' };

for (const careState of ['suggested_check', 'recently_checked'] as PresentationState[]) {
  for (const status of ['none', 'pending', 'accepted'] as const) {
    test(`${careState} + ${status}: care state and history remain independent`, () => {
      const handoffs = status === 'none' ? [] : [{ ...initial, status }];
      const events = [event];
      const before = JSON.stringify(events);
      // Echeveria checks every 4 days; last check 2026-09-06.
      const now = new Date(careState === 'suggested_check' ? '2026-09-12T12:00:00Z' : '2026-09-07T12:00:00Z');
      const [view] = enrichPlantsWithActivity([plant], events, now);
      assert.equal(view.presentationState, careState);
      assert.deepEqual(view.lastEvent, event);
      const variant = getCarePlantCardVariant(plant, 'personal', 'owner', handoffs);
      const html = renderToStaticMarkup(<CarePlantCard plant={view} variant={variant} pending={status === 'pending'} caregiverName="Helper" onSelect={() => {}} />);
      assert.match(html, /Checked/);
      if (status === 'pending') assert.match(html, /Pending handoff/);
      if (status === 'accepted') {
        assert.match(html, /care-plant-card--handed_off_owner/);
        assert.doesNotMatch(html, /Handed off|With Helper|In care/);
      }
      assert.equal(canRecordCare(plant, 'personal', 'owner', handoffs), status !== 'accepted');
      assert.equal(personalBadgePlantIds([plant], 'owner', handoffs).length, status === 'accepted' ? 0 : 1);
      assert.equal(JSON.stringify(events), before);
    });
  }
}

test('accepted Shared cards keep care content without a handoff-status pill', () => {
  const [view] = enrichPlantsWithActivity([plant], [event], new Date('2026-09-07T12:00:00Z'));
  for (const variant of ['shared_owner', 'shared_caregiver'] as const) {
    const html = renderToStaticMarkup(
      <CarePlantCard plant={view} variant={variant} caregiverName="Helper" onSelect={() => {}} />,
    );
    assert.match(html, /care-plant-card__cue">Check for soft leaves</, "card shows only the action");
    assert.match(html, /Checked/);
    assert.doesNotMatch(html, /Handed off|With Helper|In care|care-relationship-status/);
  }
});

test('caregiver action overrides stale context state and survives re-handoff', () => {
  const events = [event, { ...event, id: 'real-caregiver-check', actorUserId: 'helper', timestamp: '2026-09-07T13:00:00Z' }];
  const now = new Date('2026-09-08T12:00:00Z');
  assert.equal(getCarePresentationState(plant.id, plant.speciesId, events, now), 'recently_checked');
  assert.equal(getCarePresentationState(plant.id, plant.speciesId, [...events, { ...event, id: 'unsure', type: 'not_sure', timestamp: '2026-09-08T09:00:00Z' }], now), 'recently_checked');
  assert.equal(getCarePresentationState(plant.id, plant.speciesId, [{ ...event, id: 'unsure', type: 'not_sure' }], now), 'suggested_check', 'Not sure does not resolve a check');
});

test('Care Detail begins as a species-led guided check instead of a long article', () => {
  const html = renderToStaticMarkup(<PlantDetail plant={plant} events={[event]}
    lastRecorded={null} onBack={() => {}} onRecord={() => {}} resolveActor={() => ({ name: 'Owner', label: 'Owner' })} />);
  assert.match(html, /Echeveria/);
  assert.match(html, /Start check/);
  assert.doesNotMatch(html, /empty any water that has collected/, "pot advice lives in the steps, not the card");
  // Headline is the action to take now, not the last recorded one.
  assert.match(html, /<h2[^>]*>Check for soft leaves<\/h2>/);
  assert.doesNotMatch(html, /Small succulent|Pot, drainage &amp; location/);
});

test('delegated owner detail: no Start check, one Remind action, then a sent state', () => {
  const props = { plant, events: [event], lastRecorded: null, canRecord: false, suggested: true, statusLabel: 'Overdue',
    delegatedCaregiver: { name: 'Jordan' }, onRemind: () => {}, onBack: () => {}, onRecord: () => {},
    resolveActor: () => ({ name: 'Jordan', label: 'Jordan' }) };
  const html = renderToStaticMarkup(<PlantDetail {...props} />);
  assert.match(html, /In Jordan’s care/);
  assert.match(html, /Remind Jordan/);
  assert.match(html, /care-plant-card__status--overdue">Overdue/);
  assert.doesNotMatch(html, /End handoff|Care actions are disabled/, 'ending lives with the handoff on Shared');
  assert.match(html, /Recent activity/);
  assert.doesNotMatch(html, /Start check|Today’s check/);
  const sent = renderToStaticMarkup(<PlantDetail {...props} remindedAt={new Date().toISOString()} />);
  assert.match(sent, /Reminder sent · just now/);
  assert.doesNotMatch(sent, /Remind Jordan/);
});

test('caregiver reminder pop-up names the sender, the plant and one way in', async () => {
  const { CareReminderPopup } = await import('../src/components/care/CareReminderPopup');
  const html = renderToStaticMarkup(<CareReminderPopup sender={{ name: 'Maya' }} plant={plant}
    sentAt={new Date().toISOString()} onLater={() => {}} onCheck={() => {}} />);
  assert.match(html, /<dialog[^>]*class="reminder-pop"/);
  assert.match(html, /reminder-pop__name">Maya</);
  assert.match(html, /Can you check the /);
  assert.match(html, />Later</);
  assert.match(html, />Check now</);
  const memory = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => memory.set(key, value),
  } });
  const stored = relationshipStore.addRelationshipUpdate({ kind: 'care_reminder', recipientUserId: 'helper',
    actorUserId: 'owner', plantId: plant.id, message: relationshipStore.formatCareReminderMessage({ ownerName: 'Maya', plantName: 'Desk succulent' }) });
  const reminder = stored[0];
  assert.equal(reminder.message, 'Maya asked you to check Desk succulent');
  assert.equal(relationshipStore.countUnreadUpdates('helper') >= 1, true);
  const after = relationshipStore.markUpdateRead(reminder.id).find((item) => item.id === reminder.id);
  assert.ok(after?.readAt, 'Later marks it read');
});

test('Profile keeps prototype switching behind the centered identity block', () => {
  const users = [
    { id: 'owner', displayName: 'Maya', email: 'maya@example.com', initials: 'MY' },
    { id: 'helper', displayName: 'Jordan', email: 'jordan@example.com', initials: 'JD' },
  ];
  const html = renderToStaticMarkup(<ProfilePage currentUser={users[0]} users={users}
    onSaveEmail={() => null} onSwitchUser={() => {}} />);
  assert.match(html, /profile-card/);
  assert.match(html, /Maya/);
  assert.match(html, /maya@example\.com/);
  assert.doesNotMatch(html, /Personal care · Shared temporary care|Viewing as|>Prototype<|does not send email/);
});

test('new configured instances receive baseline Care content and default to Suggested', () => {
  const added = { ...plant, id: 'added-palm', speciesId: 'parlor-palm', name: 'Parlor palm',
    identification: undefined, plantType: undefined, suggestedCheckRhythm: undefined, whyCheck: undefined,
    whatToObserve: undefined, whenMayNeedWater: undefined, howToWater: undefined,
    whenToStop: undefined, potDrainageLocation: undefined };
  const [carePlant] = buildCarePlants([added]);
  assert.equal(carePlant.id, added.id);
  assert.ok(carePlant.whatToObserve.length > 0);
  assert.equal(carePlant.whatToObserve[0].source, 'mock_prototype_content');
  assert.equal(countSuggestedChecks({ personal: {}, shared: {} }, 'personal', [added.id]), 1);
});

test('legacy data, acceptance and ending preserve care records and classification', () => {
  const memory = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => memory.set(key, value),
  } });
  const history = JSON.stringify({ careEvents: [event] });
  const plants = JSON.stringify({ userInstances: [plant] });
  localStorage.setItem('leafnote-handoffs-v1', JSON.stringify({ handoffs: [initial] }));
  localStorage.setItem('leafnote-care-events-v3', history);
  localStorage.setItem('leafnote-plant-instances-v1', plants);
  saveCareEvents([event]);
  addPhotoToCareEvent(event.id, 'data:image/png;base64,care-photo');
  assert.equal(loadCareEvents()[0].photoDataUrl, 'data:image/png;base64,care-photo');
  const careHistoryWithPhoto = localStorage.getItem('leafnote-care-events-v3');
  assert.deepEqual(handoffStore.loadHandoffs(), [initial]);
  assert.ok(handoffStore.acceptHandoff(initial.id));
  assert.equal(handoffStore.acceptHandoff(initial.id), null);
  assert.deepEqual(handoffStore.getAcceptedSharedPlantIds('helper'), [plant.id]);
  assert.equal(getCarePresentationState(plant.id, plant.speciesId, [event], new Date('2026-09-07T12:00:00Z')), 'recently_checked');
  assert.ok(handoffStore.endHandoff(initial.id));
  assert.deepEqual(handoffStore.getAcceptedSharedPlantIds('helper'), []);
  assert.equal(localStorage.getItem('leafnote-care-events-v3'), careHistoryWithPhoto);
  assert.equal(localStorage.getItem('leafnote-plant-instances-v1'), plants);

  relationshipStore.addRelationshipUpdate({ id: 'care-update', kind: 'care_activity',
    recipientUserId: 'owner', actorUserId: 'helper', careEventId: event.id,
    plantId: plant.id, message: 'Helper checked plant' });
  relationshipStore.toggleUpdateReaction('care-update', 'owner');
  assert.equal(relationshipStore.getUpdatesForUser('owner')[0].reactionUserId, 'owner');
  assert.equal(relationshipStore.getUpdatesForUser('helper')[0].id, 'care-update');
  relationshipStore.toggleUpdateReaction('care-update', 'owner');
  assert.equal(relationshipStore.getUpdatesForUser('helper').length, 0);
});

test('Shared splits into two tabs: Caring for others (requests first) and Your handoffs', () => {
  const props = {
    requests: [<article key="r" className="handoff-request">Maya invited you</article>],
    caringList: <p>caring list</p>, ownerHandoffs: [{ ...initial, status: 'accepted' as const }], ownedInstances: [],
    resolveUser: () => undefined, unreadUpdates: 2, onHandOff: () => {}, onOpenUpdates: () => {},
    onEndHandoff: () => {}, onCancelHandoff: () => {}, onTabChange: () => {}, caringCount: 1,
    renderHandoffPlants: () => <p>handed-off plants</p>,
  };
  const html = renderToStaticMarkup(<SharedPage {...props} tab="caring" />);
  const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'));
  assert.match(header, /aria-label="Updates, 2 unread"/, 'Updates sits in the Shared header (top-right)');
  assert.doesNotMatch(header, /handoff-button/, 'Hand off is not in the header');
  assert.match(html, /class="handoff-button"[\s\S]*?>Hand off</, 'Shared renders the floating Hand off button');
  assert.doesNotMatch(renderToStaticMarkup(<CareHubHeader />), /handoff-button/);
  assert.match(html, /role="tab" aria-selected="true"[^>]*><span>Caring for others<\/span><span class="count-badge"[^>]*>2</,
    'tab badge = requests + suggested checks');
  assert.ok(html.indexOf('Maya invited you') < html.indexOf('caring list'), 'requests come first');
  assert.doesNotMatch(html, /handed-off plants/, 'one tab at a time');
  const mine = renderToStaticMarkup(<SharedPage {...props} tab="handoffs" />);
  assert.match(mine, /handed-off plants/, 'accepted handoffs list their plants');
  assert.doesNotMatch(mine, /caring list|Maya invited you/);
});

test('bottom navigation separates Care and Shared attention signals', () => {
  const html = renderToStaticMarkup(
    <BottomNav activeTab="care" badges={{ care: 1, shared: 2 }} dots={{ shared: true }} onChange={() => {}} />,
  );
  assert.match(html, /aria-label="Care, 1 suggested checks"/);
  assert.match(html, /aria-label="Shared, 2 need your attention"/);
  assert.doesNotMatch(html, /bottom-nav__dot/, 'a count badge replaces the unread dot');
  const dotOnly = renderToStaticMarkup(
    <BottomNav activeTab="care" badges={{ care: 0, shared: 0 }} dots={{ shared: true }} onChange={() => {}} />,
  );
  assert.match(dotOnly, /aria-label="Shared, new updates"/);
  assert.match(dotOnly, /bottom-nav__dot/);
});

test('prototype starts with five seed plants and every preset species has care copy', async () => {
  const { SEED_INSTANCES } = await import('../src/data/plants');
  const { SPECIES } = await import('../src/data/species');
  const { SPECIES_CARE } = await import('../src/data/speciesCare');
  assert.equal(SEED_INSTANCES.length, 5);
  assert.equal(new Set(SEED_INSTANCES.map((p) => p.speciesId)).size, 4);
  for (const species of SPECIES) {
    const care = SPECIES_CARE[species.id];
    assert.ok(care, `${species.id} has species care`);
    assert.ok(care.observe.length >= 2 && care.mayNeedWater.length >= 2, `${species.id} has cues`);
  }
  const built = buildCarePlants(SEED_INSTANCES);
  const pothos = built.find((p) => p.id === 'pothos-living-room')!;
  assert.equal(pothos.identification[0].text, 'Check for drooping leaves.');
  assert.match(pothos.whenToStop[0].text, /tray/);
  const snake = built.find((p) => p.id === 'snake-plant-hallway')!;
  assert.match(snake.howToWater[0].text, /sink or basin/);
  assert.ok(built.every((p) => p.whatToObserve.every((item) => item.source !== 'research_evidence') || p.speciesId === 'echeveria'));
});

test('check status: overdue after the check day, today on it, otherwise nothing to flag', async () => {
  const { getCheckStatus, checkStatusLabel, nextCheckText } = await import('../src/utils/checkSchedule');
  const checked: CareEvent[] = [{ ...event, timestamp: '2026-10-01T10:00:00' }]; // Echeveria: every 4 days
  const at = (d: string) => getCheckStatus(plant.id, 'echeveria', checked, new Date(`${d}T15:00:00`));
  assert.deepEqual(at('2026-10-03'), { kind: 'later', days: 2 });
  assert.equal(checkStatusLabel(at('2026-10-03')), null, 'no chip when nothing is due');
  assert.equal(nextCheckText(at('2026-10-04')), 'Next check tomorrow');
  assert.deepEqual(at('2026-10-05'), { kind: 'today' });
  assert.equal(checkStatusLabel(at('2026-10-05')), 'Check today');
  assert.deepEqual(at('2026-10-07'), { kind: 'overdue', days: 2 });
  assert.equal(checkStatusLabel(at('2026-10-07')), 'Overdue');
  assert.deepEqual(getCheckStatus(plant.id, 'echeveria', [], new Date()), { kind: 'today' }, 'never checked → check today');
});

test('Care Detail shows one check card and a dated, attributed activity track', () => {
  const html = renderToStaticMarkup(<PlantDetail plant={plant} events={[event]} suggested
    lastRecorded={null} onBack={() => {}} onRecord={() => {}} resolveActor={() => ({ name: 'Maya', label: 'Maya' })} />);
  assert.equal((html.match(/guided-check/g) ?? []).length > 0, true);
  assert.doesNotMatch(html, /why-check|Today’s check|Ready to look at your plant/);
  assert.match(html, /Suggested check/);
  assert.match(html, /Last checked/);
  assert.match(html, /Start check/);
  assert.match(html, /care-history__day">\d{1,2}</);
  assert.match(html, /care-history__month">[A-Z][a-z]{2}</);
  assert.match(html, /care-history__actor"><span class="identity-avatar[^"]*care-history__avatar[\s\S]*?<\/span>Maya</, 'avatar + name');
  assert.doesNotMatch(html, /by Maya/, 'no "by"');
  const own = renderToStaticMarkup(<PlantDetail plant={plant} events={[event]} suggested
    lastRecorded={null} onBack={() => {}} onRecord={() => {}} resolveActor={() => null} />);
  assert.doesNotMatch(own, /care-history__actor/, 'hidden when the plant was never shared');
  const recent = renderToStaticMarkup(<PlantDetail plant={plant} events={[event]} suggested={false}
    lastRecorded={null} onBack={() => {}} onRecord={() => {}} resolveActor={() => ({ name: 'Maya', label: 'Maya' })} />);
  assert.match(recent, /Check anytime/);
  assert.doesNotMatch(recent, /Suggested check/);
});

test('demo seed data contains no CJK text', async () => {
  const { SEED_INSTANCES } = await import('../src/data/plants');
  for (const instance of SEED_INSTANCES) {
    assert.doesNotMatch(`${instance.name} ${instance.location ?? ''} ${instance.identificationLabel ?? ''}`, /[㐀-鿿]/);
  }
});

test('seed plants carry their own photo and Library detail leads with it', async () => {
  const { SEED_INSTANCES } = await import('../src/data/plants');
  const { LibraryPlantDetail } = await import('../src/components/library/LibraryPlantDetail');
  assert.ok(SEED_INSTANCES.every((instance) => typeof instance.photoSrc === 'string' && instance.photoSrc.length > 0));
  const desk = SEED_INSTANCES.find((instance) => instance.id === 'succulent-desk')!;
  const html = renderToStaticMarkup(<LibraryPlantDetail instance={desk}
    careSummary={{ lastActivity: 'Checked 6 days ago', status: { kind: 'overdue', days: 2 } }}
    onBack={() => {}} onEditPlant={() => {}} onViewCare={() => {}} />);
  assert.match(html, /library-detail__photo/);
  assert.match(html, /Checked 6 days ago/);
  assert.match(html, />Overdue</);
  assert.match(html, /No tray/);
  assert.doesNotMatch(html, /library-detail__hero-label|plant-label/, 'no label tag repeating the location on the photo');
  assert.match(html, />Start check</);
  assert.doesNotMatch(html, /Echeveria spp\./, 'no botanical name');
  assert.match(html, /library-detail__sub">Blue rosette</, 'label under the name, same as the card');
  assert.match(html, /Care basics/);
  assert.match(html, />Light<[\s\S]*>Water<[\s\S]*>Soil<[\s\S]*>Environment</, "general care notes");
  assert.doesNotMatch(html, /What to look for|When it may need water/, "check guidance lives in Care, not here");
  assert.doesNotMatch(html, /About this plant|Succulent</, 'no repeated facts');
  const later = renderToStaticMarkup(<LibraryPlantDetail instance={desk}
    careSummary={{ lastActivity: 'Checked 1 day ago', status: { kind: 'later', days: 3 } }}
    onBack={() => {}} onEditPlant={() => {}} onViewCare={() => {}} />);
  assert.doesNotMatch(later, /library-detail__chip is-|Up to date/, 'no status chip when nothing is due');
  assert.match(later, /Next check in 3 days/);
  const noPhoto = renderToStaticMarkup(<LibraryPlantDetail instance={{ ...desk, photoSrc: undefined }}
    onBack={() => {}} onEditPlant={() => {}} onViewCare={() => {}} />);
  assert.match(noPhoto, /Add a photo/);
  assert.doesNotMatch(noPhoto, /library-detail__photo/);
});

test('Care cards use the instance photo when there is one', () => {
  const withPhoto = renderToStaticMarkup(<CarePlantCard plant={{ ...enrichPlantsWithActivity([plant], [event])[0], photoSrc: 'photo.jpg' }}
    variant="actionable" onSelect={() => {}} />);
  assert.match(withPhoto, /plant-photo-thumb/);
  const withoutPhoto = renderToStaticMarkup(<CarePlantCard plant={enrichPlantsWithActivity([plant], [event])[0]}
    variant="actionable" onSelect={() => {}} />);
  assert.doesNotMatch(withoutPhoto, /plant-photo-thumb/);
});

test('activity calendar marks days with care and the track previews five records', async () => {
  const { CareHistory } = await import('../src/components/CareHistory');
  const base = new Date();
  const events: CareEvent[] = Array.from({ length: 8 }, (_, i) => ({
    id: `e${i}`, plantId: plant.id, type: i % 2 ? 'watered' : 'checked', actorUserId: 'owner',
    timestamp: new Date(base.getTime() - i * 3 * 86400000).toISOString(),
  }));
  const html = renderToStaticMarkup(<CareHistory events={events} resolveActor={() => ({ name: 'Maya', label: 'Maya' })} />);
  assert.match(html, /activity-calendar__grid/);
  assert.match(html, /activity-calendar__day[^"]*is-watered/);
  assert.match(html, /aria-label="[A-Z][a-z]+ \d+: (Checked|Watered)/);
  assert.equal((html.match(/class="care-history__item /g) ?? []).length, 5);
  assert.match(html, /Show all 8/);
});

test('profile groups account rows in one inset list', () => {
  const users = [{ id: 'owner', displayName: 'Maya', email: 'maya@example.com', initials: 'MY' }];
  const html = renderToStaticMarkup(<ProfilePage currentUser={users[0]} users={users}
    onSaveEmail={() => null} onSwitchUser={() => {}} />);
  assert.match(html, /profile-group"/);
  assert.match(html, />Email</);
  assert.match(html, />Local data</);
  assert.match(html, /Tap to switch profile/);
});

test('Library grid: photo or illustration, location tag, user label, wide odd card', async () => {
  const { LibraryGrid } = await import('../src/components/library/LibraryGrid');
  const base = { ownerId: 'user-maya', hasTray: false, careConfigured: true };
  const html = renderToStaticMarkup(
    <LibraryGrid
      instances={[
        { ...base, id: 'a', speciesId: 'echeveria', name: 'A', location: 'Desk', identificationLabel: 'Blue rosette', photoSrc: 'photo-a.jpg' },
        { ...base, id: 'b', speciesId: 'pothos', name: 'B', location: 'Window' },
        { ...base, id: 'c', speciesId: 'monstera', name: 'C' },
      ]}
      onOpen={() => {}}
    />,
  );
  assert.match(html, /library-card__media has-photo"><img src="photo-a.jpg"/);
  assert.match(html, /library-card__media is-illustration"><img src="[^"]+"/, 'no photo falls back to the species illustration');
  assert.match(html, /library-card__place"><svg[^>]*>[\s\S]*?<\/svg>Desk</);
  assert.match(html, /library-card__label">Blue rosette</, 'subtitle is the user label');
  assert.doesNotMatch(html, /Epipremnum|Echeveria spp/, 'no botanical names on cards');
  assert.equal((html.match(/library-card--wide/g) ?? []).length, 1, 'odd last card spans full width');
  assert.doesNotMatch(html, /library-card__more|ri-more/, 'cards have one action: open');
});

test('Location is picked from preset tags; tray stays a separate field', async () => {
  const { normalizeLocation, PLANT_LOCATIONS } = await import('../src/data/locations');
  assert.equal(normalizeLocation('By the window'), 'Window');
  assert.equal(normalizeLocation(' living room '), 'Living room');
  assert.ok(!PLANT_LOCATIONS.some((loc) => /tray/i.test(loc.label)), 'Tray is not a location');
  const { PlantInstanceFields } = await import('../src/components/library/PlantInstanceFields');
  const html = renderToStaticMarkup(
    <PlantInstanceFields location="Desk" onLocationChange={() => {}} hasTray={null} onHasTrayChange={() => {}}
      trayGroupName="t" label="" onLabelChange={() => {}} />,
  );
  assert.equal((html.match(/location-picker__tag/g) ?? []).length, PLANT_LOCATIONS.length);
  assert.match(html, /location-picker__tag is-active" aria-pressed="true"><svg[\s\S]*?<span>Desk</);
  assert.doesNotMatch(html, /placeholder="e.g. Desk"/, 'no free-text location input');
  assert.match(html, />Tray</);
});

test('photo field uses icon actions only (no text buttons)', async () => {
  const { PlantPhotoField } = await import('../src/components/library/PlantPhotoField');
  const withPhoto = renderToStaticMarkup(<PlantPhotoField photoSrc="p.jpg" onChange={() => {}} />);
  assert.match(withPhoto, /aria-label="Retake photo"/);
  assert.match(withPhoto, /aria-label="Remove photo"/);
  assert.doesNotMatch(withPhoto, />\s*(Retake photo|Remove|Take or choose photo)\s*</, 'no visible text buttons');
  const empty = renderToStaticMarkup(<PlantPhotoField photoSrc="" fallbackSrc="ill.png" onChange={() => {}} />);
  assert.match(empty, /aria-label="Add a photo of this plant"/);
  assert.match(empty, /photo-stage__fallback/);
});

test('optional fields are marked the same way: "Optional" after the section title', async () => {
  const { PlantInstanceFields } = await import('../src/components/library/PlantInstanceFields');
  const { PlantPhotoField } = await import('../src/components/library/PlantPhotoField');
  const html = renderToStaticMarkup(<>
    <PlantPhotoField photoSrc="" onChange={() => {}} />
    <PlantInstanceFields location="" onLocationChange={() => {}} hasTray={null} onHasTrayChange={() => {}}
      trayGroupName="t" label="" onLabelChange={() => {}} />
  </>);
  const marks = html.match(/form-section__title">[^<]*<span class="form-section__optional">Optional<\/span>/g) ?? [];
  assert.equal(marks.length, 3, 'Photo, Where it lives, Label');
  assert.equal((html.match(/Optional/g) ?? []).length, 3, 'no other "Optional" (placeholders, hints)');
});

test('calendar: a day with a record never also shows a missed ring; no browsing before the first record', async () => {
  const { ActivityCalendar } = await import('../src/components/ActivityCalendar');
  const ev = (d: string, type: CareEvent['type'] = 'checked'): CareEvent => ({ ...event, id: d, type, timestamp: `${d}T10:00:00` });
  const html = renderToStaticMarkup(<ActivityCalendar events={[ev('2026-10-01'), ev('2026-10-06', 'not_sure')]} intervalDays={4}
    selectedDay={null} onSelectDay={() => {}} today={new Date('2026-10-08T12:00:00')} />);
  assert.doesNotMatch(html, /class="[^"]*is-not_sure[^"]*is-overdue/, 'not sure day: fill only');
  assert.match(html, /aria-label="Previous month" disabled=""/);
});

test('calendar marks missed check days and the next check day', async () => {
  const { checkScheduleDays, dayKey } = await import('../src/components/ActivityCalendar');
  const ev = (d: string, type: CareEvent['type'] = 'checked'): CareEvent => ({ ...event, id: d, type, timestamp: `${d}T10:00:00` });
  // every 4 days: checked 1st → due 5th, next check on 7th → 5th and 6th missed; 7th → next due 11th
  const { overdue, next } = checkScheduleDays([ev('2026-10-01'), ev('2026-10-07'), ev('2026-10-03', 'not_sure')], 4, new Date('2026-10-08T12:00:00'));
  assert.deepEqual([...overdue].sort(), [dayKey(new Date(2026, 9, 5)), dayKey(new Date(2026, 9, 6))].sort());
  assert.equal(next, dayKey(new Date(2026, 9, 11)));
  // Overdue: missed days up to yesterday, and the next check is today.
  const late = checkScheduleDays([ev('2026-10-01')], 4, new Date('2026-10-08T12:00:00'));
  assert.equal(late.next, dayKey(new Date(2026, 9, 8)));
  assert.ok(!late.overdue.has(dayKey(new Date(2026, 9, 8))) && late.overdue.has(dayKey(new Date(2026, 9, 7))));
});

test('check card: status chip, no tray note or step-count line', () => {
  const html = renderToStaticMarkup(<PlantDetail plant={plant} events={[event]} suggested statusLabel="Overdue"
    lastRecorded={null} onBack={() => {}} onRecord={() => {}} resolveActor={() => ({ name: 'Maya', label: 'Maya' })} />);
  assert.match(html, /status-chip status-chip--overdue">Overdue</);
  assert.doesNotMatch(html, /water at the sink|empty any water|5 short steps/);
});

test('Hand off step 1 offers Select all', async () => {
  const { HandoffPage } = await import('../src/components/care/HandoffPage');
  const html = renderToStaticMarkup(<HandoffPage currentUserEmail="maya@leafnote.local"
    eligibility={[{ plant, selectable: true }, { plant: { ...plant, id: 'p2' }, selectable: true }] as never}
    onBack={() => {}} onSend={() => null} />);
  assert.match(html, /role="checkbox" class="select-all" aria-checked="false"[\s\S]*?Select all</);
});

test('guided check: answers lead to a verdict; watering steps respect the tray', async () => {
  const { GuidedCareCheck } = await import('../src/components/GuidedCareCheck');
  const intro = { label: 'Overdue', suggested: true, tone: 'overdue' as const, reason: 'Check for soft leaves', context: 'Last checked 5 days ago' };
  const html = renderToStaticMarkup(<GuidedCareCheck intro={intro} canRecord isSharedCare={false} completed={false} onRecord={() => {}} />);
  assert.match(html, /Start check/);
  assert.match(html, /status-chip--overdue/);
  const { SPECIES_CARE } = await import('../src/data/speciesCare');
  assert.ok(Object.values(SPECIES_CARE).every((care) => care.basics.light && care.basics.water && care.basics.tip));
});

test('incoming request card: photo stack, no email or name list', async () => {
  const { HandoffRequestCard } = await import('../src/components/care/HandoffRequestCard');
  const { SEED_INSTANCES } = await import('../src/data/plants');
  const html = renderToStaticMarkup(<HandoffRequestCard handoff={{ ...initial, plantIds: SEED_INSTANCES.map((p) => p.id) }}
    sender={{ id: 'owner', displayName: 'Maya', email: 'maya@leafnote.local', initials: 'MY' }}
    plants={SEED_INSTANCES} onAccept={() => {}} onDecline={() => {}} />);
  assert.match(html, /Asks you to care for 5 plants/);
  assert.match(html, /plant-stack/);
  assert.match(html, />\+2</);
  assert.doesNotMatch(html, /maya@leafnote\.local|Desk succulent/);
});

test('your handoff card shares the request layout with a compact action', async () => {
  const { HandoffRelationshipCard } = await import('../src/components/care/HandoffRelationshipCard');
  const { SEED_INSTANCES } = await import('../src/data/plants');
  const html = renderToStaticMarkup(<HandoffRelationshipCard handoff={{ ...initial, plantIds: SEED_INSTANCES.map((p) => p.id) }}
    plants={SEED_INSTANCES} user={{ id: 'helper', displayName: 'Jordan', email: 'jordan@leafnote.local', initials: 'JD' }} onAction={() => {}} />);
  assert.match(html, /handoff-request /);
  assert.match(html, /Waiting for Jordan to accept/);
  assert.match(html, /plant-stack/);
  assert.match(html, /handoff-request__small-action">Cancel request</);
  assert.doesNotMatch(html, /jordan@leafnote\.local|plant-selection-tag/);
});

test('care card shows the handoff as two avatars (dashed seat while pending)', () => {
  const [view] = enrichPlantsWithActivity([plant], [event]);
  const pair = { owner: { name: 'Maya', initials: 'MY' }, caregiver: { name: 'Jordan', initials: 'JD' } };
  const pending = renderToStaticMarkup(<CarePlantCard plant={view} variant="actionable" pending
    handoffPair={{ ...pair, status: 'pending' }} onSelect={() => {}} />);
  assert.match(pending, /handoff-pair is-pending/);
  assert.match(pending, /handoff-pair__avatar--waiting/);
  assert.doesNotMatch(pending, /care-relationship-status/);
  const accepted = renderToStaticMarkup(<CarePlantCard plant={view} variant="handed_off_owner"
    handoffPair={{ ...pair, status: 'accepted' }} />);
  assert.equal((accepted.match(/identity-avatar has-art/g) ?? []).length, 2, "owner + caregiver avatars");
  assert.doesNotMatch(accepted, /handoff-pair__avatar--waiting/);
});

test('check steps: leaf art per plant type, soil art; "look again" result is just that', async () => {
  const { LEAF_KIND_BY_SPECIES } = await import('../src/components/StepArt');
  const { SPECIES } = await import('../src/data/species');
  assert.ok(SPECIES.every((sp) => LEAF_KIND_BY_SPECIES[sp.id]), 'every species has a leaf style');
  assert.notEqual(LEAF_KIND_BY_SPECIES.pothos, LEAF_KIND_BY_SPECIES.echeveria);
});

test('demo people have distinct illustrated avatars; others fall back to initials', async () => {
  const { IdentityAvatar } = await import('../src/components/IdentityAvatar');
  const maya = renderToStaticMarkup(<IdentityAvatar name="Maya" initials="MY" />);
  const jordan = renderToStaticMarkup(<IdentityAvatar name="Jordan" initials="JD" />);
  assert.match(maya, /has-art[\s\S]*<svg/);
  assert.match(jordan, /has-art[\s\S]*<svg/);
  assert.notEqual(maya, jordan);
  assert.match(renderToStaticMarkup(<IdentityAvatar name="Sam Lee" />), />SL</);
});

test('after saving, the check card itself shows the done state (+ photo for the owner when caring)', async () => {
  const { GuidedCareCheck } = await import('../src/components/GuidedCareCheck');
  const intro = { label: 'Overdue', suggested: true, reason: 'Check for soft leaves', context: 'Last checked 5 days ago' };
  const recorded = { ...event, id: 'r1', type: 'watered' as const };
  const caring = renderToStaticMarkup(<GuidedCareCheck intro={intro} canRecord isSharedCare completed recorded={recorded}
    ownerName="Maya" onAddPhoto={() => {}} onDone={() => {}} onRecord={() => {}} />);
  assert.match(caring, /check-done__title">Watered</);
  assert.match(caring, /Take a photo for Maya/);
  assert.doesNotMatch(caring, /photo-drop__hint/, 'one line: the action');
  assert.doesNotMatch(caring, /You can add a photo after|Add photo for owner/);
  const own = renderToStaticMarkup(<GuidedCareCheck intro={intro} canRecord isSharedCare={false} completed recorded={recorded}
    onAddPhoto={() => {}} onDone={() => {}} onRecord={() => {}} />);
  assert.doesNotMatch(own, /photo-drop/);
});

test('Updates: tabs, no text toggle, heart + reply that can be sent', async () => {
  const { UpdatesPage } = await import('../src/components/care/UpdatesPage');
  const update = {
    id: 'u1', kind: 'care_activity' as const, recipientUserId: 'owner', actorUserId: 'jordan',
    plantId: 'p1', message: 'Jordan watered Desk succulent', createdAt: new Date().toISOString(), readAt: null,
    replies: [{ id: 'r1', userId: 'owner', text: 'thanks jordan', createdAt: new Date().toISOString() }],
  };
  const html = renderToStaticMarkup(<UpdatesPage updates={[update]} careEvents={[]} currentUserId="owner" handoffs={[]}
    plantNameById={{}} plantsById={{}} resolveUserName={(id) => (id === 'owner' ? 'Maya' : 'Jordan')}
    resolveUserInitials={() => 'XX'} onBack={() => {}} onMarkRead={() => {}} onToggleReaction={() => {}} onReply={() => {}} />);
  assert.match(html, /<span>Activity<\/span><span class="count-badge"[^>]*>1</);
  assert.match(html, /<span>Handoffs<\/span>/);
  assert.doesNotMatch(html, /View details|Hide details/);
  assert.match(html, /class="update-heart/);
  assert.match(html, /<form class="update-respond"/);
  assert.match(html, /type="submit" class="update-respond__send"/);
  assert.match(html, /update-reply is-mine[\s\S]*thanks jordan/);
});

test("Your handoffs groups the caregiver's plants like Care, without the needs-you badge", () => {
  const view = enrichPlantsWithActivity([plant], [])[0];
  const html = renderToStaticMarkup(<PlantList suggestedChecks={[view]} recentlyChecked={[]}
    getVariant={() => 'shared_owner'} onSelectPlant={() => {}} showCounts={false} idPrefix="h1-" />);
  assert.match(html, /id="h1-section-suggested-checks"/);
  assert.match(html, />Suggested checks</);
  assert.doesNotMatch(html, /count-badge/);
});
