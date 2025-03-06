import { Equation } from "@/lib/types/equation";
import { EquationEnvironment } from "@/lib/types/identifiers";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";

interface EquationRowProps {
  equation: Equation;
  index: number;
  setEquations: (equations: Equation[]) => void;
  equations: Equation[];
  environment: EquationEnvironment;
  setEnvironment: (environment: EquationEnvironment) => void;
  initialVariablesLength: number;
}

const EquationRow = (props: EquationRowProps) => {
  const { equation, index, setEquations, equations, environment, setEnvironment, initialVariablesLength } = props;
  const [lhsResults, setLhsResults] = useState<string[]>([]);
  const [rhsResults, setRhsResults] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const lhsRef = useRef<HTMLDivElement>(null);
  const rhsRef = useRef<HTMLDivElement>(null);
  const lhsInputRef = useRef<HTMLInputElement>(null);
  const rhsInputRef = useRef<HTMLInputElement>(null);

  const identifiers = [
    ...environment.variables.map((v) => v.code),
    ...environment.functions.map((f) => f.code),
    ...environment.constants.map((c) => c.code),
  ];

  type Side = "left" | "right";

  const handleUpdate = (
    updatedEquation: Equation,
    value: string,
    side: Side,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newEquations = equations.map((eq, i) => (i === index ? updatedEquation : eq));
    setEquations(newEquations);

    // Get cursor position
    const cursorPos = event.target.selectionStart || 0;
    setCursorPosition(cursorPos);

    // Add new variable to environment
    const newVariable = {
      code: updatedEquation.lhs,
      type: "variable" as const,
    };

    const updatedVariables = [...environment.variables];
    updatedVariables[index + initialVariablesLength] = newVariable;

    setEnvironment({
      ...environment,
      variables: updatedVariables,
    });

    // Get last identifier in input + replace partially completed identifier with autcomplete result
    const curIdentifier = value.split(/[\s()+\-*/^=]+/).pop() || "";
    const filteredResults = identifiers.filter((variable) =>
      variable.toLowerCase().includes(curIdentifier.toLowerCase())
    );

    if (side === "left") {
      setLhsResults(filteredResults);
    } else {
      setRhsResults(filteredResults);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, side: Side) => {
    const results = side === "left" ? lhsResults : rhsResults;
    const input = side === "left" ? equation.lhs : equation.rhs;
    const setResults = side === "left" ? setLhsResults : setRhsResults;

    if (e.key === "Tab" && results.length > 0) {
      e.preventDefault(); // Prevent default tab behavior

      // Get last identifier in input + replace partially completed identifier with autcomplete result
      const lastSegment = input.split(/[\s()+\-*/^=]+/).pop();
      const newValue = input.replace(new RegExp(`${lastSegment}$`), results[0]);

      setResults([]);

      // Update equation based on side
      const updatedEquation = side === "left" ? { ...equation, lhs: newValue } : { ...equation, rhs: newValue };

      handleUpdate(updatedEquation, newValue, side, e as unknown as React.ChangeEvent<HTMLInputElement>);
      setResults([]);
      setHighlightedIndex(-1);
    } else if (e.key === "ArrowDown" && results.length > 0) {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => (prevIndex + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length > 0) {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => (prevIndex - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      console.log("results", results);
      // Get last identifier in input + replace partially completed identifier with autcomplete result
      const lastSegment = input.split(/[\s()+\-*/^=]+/).pop();
      const newValue = input.replace(new RegExp(`${lastSegment}$`), results[highlightedIndex]);
      // Update equation based on side
      const updatedEquation = side === "left" ? { ...equation, lhs: newValue } : { ...equation, rhs: newValue };

      handleUpdate(updatedEquation, newValue, side, e as unknown as React.ChangeEvent<HTMLInputElement>);
      setResults([]);
      setHighlightedIndex(-1);
    }
  };

  // Add click outside handler to clear results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!lhsRef.current?.contains(event.target as Node)) {
        setLhsResults([]);
      }
      if (!rhsRef.current?.contains(event.target as Node)) {
        setRhsResults([]);
      }
      setHighlightedIndex(-1);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="equation-row">
      <div className="relative" ref={lhsRef} style={{ flex: 1 }}>
        <Input
          ref={lhsInputRef}
          className="font-mono"
          value={equation.lhs}
          onChange={(e) => handleUpdate({ ...equation, lhs: e.target.value }, e.target.value, "left", e)}
          onKeyDown={(e) => handleKeyDown(e, "left")}
        />
        <div
          className="dropdown"
          style={{
            left: `${Math.min(9 * cursorPosition + 4, lhsInputRef.current?.offsetWidth || 500)}px`,
            border: lhsResults.length > 0 ? "1px solid #ccc" : "none",
          }}
        >
          {lhsResults.map((result, index) => (
            <div
              key={`result-${result}-${index}-${equation.id}`}
              className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
              style={{ backgroundColor: highlightedIndex === index ? "lightgray" : "transparent" }}
            >
              {result}
            </div>
          ))}
        </div>
      </div>

      <span className="text-lg text-gray-500">=</span>

      {/* RHS Input with results dropdown */}
      <div className="relative" ref={rhsRef} style={{ flex: 1 }}>
        <Input
          ref={rhsInputRef}
          className="min-w-12 font-mono"
          value={equation.rhs}
          onChange={(e) => handleUpdate({ ...equation, rhs: e.target.value }, e.target.value, "right", e)}
          onKeyDown={(e) => handleKeyDown(e, "right")}
        />
        <div
          className="dropdown"
          style={{
            left: `${Math.min(
              9 * cursorPosition + 4,
              lhsInputRef.current?.offsetWidth ? lhsInputRef.current.offsetWidth / 2 : 500
            )}px`,
            border: rhsResults.length > 0 ? "1px solid #ccc" : "none",
          }}
        >
          {rhsResults.map((result, index) => (
            <div
              key={`result-${result}-${index}-${equation.id}`}
              className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
              style={{ backgroundColor: highlightedIndex === index ? "lightgray" : "transparent" }}
            >
              {result}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EquationRow;
