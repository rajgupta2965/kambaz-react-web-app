import { FaCheckCircle } from "react-icons/fa";
import useIsFaculty from "../../auth/useIsFaculty";

export default function DynamicGreenCheck({
  faded = false,
  onClick,
}: {
  faded?: boolean;
  onClick?: () => void;
}) {
  const isFaculty = useIsFaculty();
  const canToggle = isFaculty && !!onClick;
  const interactiveProps = canToggle
    ? {
      role: "button" as const,
      tabIndex: 0,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick!();
        }
      },
    }
    : {};

  return (
    <span
      className={`me-1 position-relative ${canToggle ? "cursor-pointer" : ""}`}
      onClick={canToggle ? onClick : undefined}
      aria-pressed={!faded}
      aria-label={faded ? "Unpublished" : "Published"}
      title={faded ? "Unpublished" : "Published"}
      {...interactiveProps}
    >
      <FaCheckCircle
        style={{ opacity: faded ? 0.35 : 1, transition: "opacity 120ms" }}
        className="text-success fs-5 m-2"
      />
    </span>
  );
}