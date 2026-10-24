type AddPlantFabProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function AddPlantFab({ onClick, disabled = false }: AddPlantFabProps) {
  return (
    <button
      type="button"
      className="add-plant-fab"
      aria-label="Add plant"
      disabled={disabled}
      onClick={onClick}
    >
      <span className="add-plant-fab__icon" aria-hidden="true">
        +
      </span>
    </button>
  );
}
