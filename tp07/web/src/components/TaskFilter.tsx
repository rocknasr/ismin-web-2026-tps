import type { Task } from '../model';

interface TaskFilterProps {
  /** The selected task, or undefined for "all of them". */
  value: Task | undefined;
  onChange: (task: Task | undefined) => void;
}

/**
 * TODO step 4. The <nav> of the mockup: « Toutes », then one button per task
 * of TASKS. The selected one has aria-pressed="true". A click calls onChange.
 * This component holds no state: `value` comes from App.
 */
export const TaskFilter = ({ value, onChange }: TaskFilterProps) => {
  return (
    <nav className="filters">
      TODO: {value ?? 'Toutes'}
      <button onClick={() => onChange(undefined)}>Toutes</button>
    </nav>
  );
};
