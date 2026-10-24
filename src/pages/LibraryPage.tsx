import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { PlantInstance } from '../types';
import { SPECIES, getSpecies } from '../data/species';
import { Toast } from '../components/Toast';
import { CareUnavailable } from '../components/library/CareUnavailable';
import { LibraryPlantDetail, type LibraryCareSummary } from '../components/library/LibraryPlantDetail';
import { LibraryGrid } from '../components/library/LibraryGrid';
import { FILTER_ALL, LibraryFilter } from '../components/library/LibraryFilter';
import { CareHubHeader } from '../components/care/CareHubHeader';
import { PLANT_LOCATIONS } from '../data/locations';
import { PlantInstanceSheet } from '../components/library/PlantInstanceSheet';

type LibraryPageProps = {
  instances: PlantInstance[];
  detailId: string | null;
  onDetailIdChange: (id: string | null) => void;
  onAddPlant: (input: {
    speciesId: string;
    location?: string;
    hasTray: boolean;
    identificationLabel?: string;
    photoSrc?: string;
  }) => void;
  onUpdatePlant: (
    instanceId: string,
    input: {
      location?: string;
      hasTray: boolean;
      identificationLabel?: string;
      photoSrc?: string;
    },
  ) => void;
  onRemovePlant: (instanceId: string) => void;
  onViewCare: (instanceId: string) => void;
  getCareSummary?: (instanceId: string) => LibraryCareSummary | undefined;
};

export function LibraryPage({
  instances,
  detailId,
  onDetailIdChange,
  onAddPlant,
  onUpdatePlant,
  onRemovePlant,
  onViewCare,
  getCareSummary,
}: LibraryPageProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>(FILTER_ALL);
  const [addSpeciesId, setAddSpeciesId] = useState(SPECIES[0]?.id ?? '');
  const [addLocation, setAddLocation] = useState('');
  const [addHasTray, setAddHasTray] = useState<boolean | null>(null);
  const [addLabel, setAddLabel] = useState('');
  const [addPhoto, setAddPhoto] = useState('');
  const [editPhoto, setEditPhoto] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editHasTray, setEditHasTray] = useState<boolean | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [trayError, setTrayError] = useState<string | null>(null);
  const [careUnavailable, setCareUnavailable] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [canvasHost, setCanvasHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setCanvasHost(document.querySelector('.phone-canvas') as HTMLElement | null);
  }, [detailId, addOpen, editId, careUnavailable]);

  const dismissToast = useCallback(() => {
    setToastOpen(false);
  }, []);

  const selected = instances.find((item) => item.id === detailId) ?? null;
  const editing = instances.find((item) => item.id === editId) ?? null;
  const addSpecies = getSpecies(addSpeciesId) ?? null;

  // Filter tabs: every spot that has at least one plant, presets first.
  const filterOptions = useMemo(() => {
    const present = new Set(instances.map((item) => item.location).filter(Boolean) as string[]);
    const presets = PLANT_LOCATIONS.map((loc) => loc.label).filter((label) => present.has(label));
    const custom = [...present].filter((label) => !presets.includes(label)).sort();
    return [...presets, ...custom];
  }, [instances]);
  const activeFilter = filterOptions.includes(filter) ? filter : FILTER_ALL;
  const visible =
    activeFilter === FILTER_ALL
      ? instances
      : instances.filter((item) => item.location === activeFilter);

  const resetAddForm = () => {
    setAddSpeciesId(SPECIES[0]?.id ?? '');
    setAddLocation('');
    setAddHasTray(null);
    setAddLabel('');
    setAddPhoto('');
    setTrayError(null);
  };

  const openAdd = () => {
    resetAddForm();
    setAddOpen(true);
  };

  const closeAdd = () => {
    setAddOpen(false);
    resetAddForm();
  };

  const openEdit = (target: PlantInstance | null) => {
    if (!target) {
      return;
    }
    setEditLocation(target.location ?? '');
    setEditHasTray(target.hasTray);
    setEditLabel(target.identificationLabel ?? '');
    setEditPhoto(target.photoSrc ?? '');
    setTrayError(null);
    setEditId(target.id);
  };

  const closeEdit = () => {
    setEditId(null);
    setTrayError(null);
  };

  const handleSaveAdd = () => {
    if (!addSpeciesId) {
      return;
    }
    if (addHasTray === null) {
      setTrayError('Choose Yes or No for tray.');
      return;
    }
    onAddPlant({
      speciesId: addSpeciesId,
      location: addLocation,
      hasTray: addHasTray,
      identificationLabel: addLabel,
      photoSrc: addPhoto,
    });
    closeAdd();
  };

  const handleSaveEdit = () => {
    if (!editing) {
      return;
    }
    if (editHasTray === null) {
      setTrayError('Choose Yes or No for tray.');
      return;
    }
    onUpdatePlant(editing.id, {
      location: editLocation,
      hasTray: editHasTray,
      identificationLabel: editLabel,
      photoSrc: editPhoto,
    });
    closeEdit();
  };

  const handleRemovePlant = () => {
    if (!editing) {
      return;
    }
    const id = editing.id;
    closeEdit();
    setCareUnavailable(false);
    if (detailId === id) onDetailIdChange(null);
    onRemovePlant(id);
    setToastOpen(true);
  };

  const toast =
    toastOpen && canvasHost
      ? createPortal(
          <Toast
            message="Plant removed"
            open={toastOpen}
            onDismiss={dismissToast}
          />,
          canvasHost,
        )
      : null;

  const addSheet =
    addOpen && canvasHost
      ? createPortal(
          <PlantInstanceSheet
            mode="add"
            open
            species={addSpecies}
            speciesOptions={SPECIES}
            selectedSpeciesId={addSpeciesId}
            onSelectSpecies={setAddSpeciesId}
            location={addLocation}
            onLocationChange={setAddLocation}
            hasTray={addHasTray}
            onHasTrayChange={(value) => {
              setAddHasTray(value);
              setTrayError(null);
            }}
            trayError={trayError}
            label={addLabel}
            onLabelChange={setAddLabel}
            photoSrc={addPhoto}
            onPhotoChange={setAddPhoto}
            onClose={closeAdd}
            onSave={handleSaveAdd}
            title="Add plant"
            saveLabel="Add to shelf"
            closeAriaLabel="Close Add Plant"
          />,
          canvasHost,
        )
      : null;

  const editSheet =
    editing && canvasHost
      ? createPortal(
          <PlantInstanceSheet
            mode="edit"
            open
            species={getSpecies(editing.speciesId) ?? null}
            location={editLocation}
            onLocationChange={setEditLocation}
            hasTray={editHasTray}
            onHasTrayChange={(value) => {
              setEditHasTray(value);
              setTrayError(null);
            }}
            trayError={trayError}
            label={editLabel}
            onLabelChange={setEditLabel}
            photoSrc={editPhoto}
            onPhotoChange={setEditPhoto}
            onClose={closeEdit}
            onSave={handleSaveEdit}
            onRemovePlant={handleRemovePlant}
            title="Edit plant"
            saveLabel="Save changes"
            closeAriaLabel="Close Edit plant"
          />,
          canvasHost,
        )
      : null;

  if (selected && careUnavailable) {
    return (
      <>
        <CareUnavailable
          onBack={() => {
            setCareUnavailable(false);
          }}
        />
        {toast}
      </>
    );
  }

  if (selected) {
    return (
      <>
        <LibraryPlantDetail
          instance={selected}
          careSummary={getCareSummary?.(selected.id)}
          onBack={() => {
            onDetailIdChange(null);
            closeEdit();
            setCareUnavailable(false);
          }}
          onEditPlant={() => openEdit(selected)}
          onViewCare={() => {
            if (selected.careConfigured) {
              onViewCare(selected.id);
              return;
            }
            setCareUnavailable(true);
          }}
        />
        {editSheet}
        {toast}
      </>
    );
  }

  return (
    <div className="library-page screen screen--root">
      <CareHubHeader
        title="Library"
        action={
          <button
            type="button"
            className="header-icon-button header-icon-button--primary"
            aria-label="Add plant"
            onClick={openAdd}
          >
            <i className="ri-add-line" aria-hidden="true" />
          </button>
        }
      />

      {filterOptions.length > 0 ? (
        <LibraryFilter options={filterOptions} value={activeFilter} onChange={setFilter} />
      ) : null}

      <LibraryGrid
        key={activeFilter}
        instances={visible}
        onOpen={(id) => onDetailIdChange(id)}
      />

      {addSheet}
      {editSheet}
      {toast}
    </div>
  );
}
