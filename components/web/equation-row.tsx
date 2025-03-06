import { Equation } from "@/lib/types/equation";
import { EquationEnvironment } from "@/lib/types/identifiers";
import { useState } from "react";
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
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const identifiers = [
    ...environment.variables.map((v) => v.code),
    ...environment.functions.map((f) => f.code),
    ...environment.constants.map((c) => c.code),
  ];

  type Side = "left" | "right";

  const handleUpdate = (updatedEquation: Equation, value: string, side: Side) => {
    const newEquations = equations.map((eq, i) => (i === index ? updatedEquation : eq));
    setEquations(newEquations);

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
    console.log("Key pressed:", e.key);
    const results = side === "left" ? lhsResults : rhsResults;
    const input = side === "left" ? equation.lhs : equation.rhs;
    const setResults = side === "left" ? setLhsResults : setRhsResults;

    if (e.key === "Tab" && results.length > 0) {
      e.preventDefault(); // Prevent default tab behavior

      // Get last identifier in input + replace partially completed identifier with autcomplete result
      const lastSegment = input.split(/[\s()+\-*/^=]+/).pop();
      const newValue = input.replace(new RegExp(`${lastSegment}$`), results[0]);
      console.log("newValue", newValue);

      setResults([]);

      // Update equation based on side
      const updatedEquation = side === "left" ? { ...equation, lhs: newValue } : { ...equation, rhs: newValue };

      handleUpdate(updatedEquation, newValue, side);
      setResults([]);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="relative">
        <Input
          className="min-w-12 max-w-[300px] font-mono"
          value={equation.lhs}
          onChange={(e) => handleUpdate({ ...equation, lhs: e.target.value }, e.target.value, "left")}
          onKeyDown={(e) => handleKeyDown(e, "left")}
        />
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            backgroundColor: "rgb(250, 250, 240)",
            border: "1px solid #ccc",
            zIndex: 1000,
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
            borderRadius: "0.25rem",
            marginTop: "4px",
          }}
        >
          {lhsResults.map((result, index) => (
            <div
              key={`result-${result}-${index}-${equation.id}`}
              className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
            >
              {result}
            </div>
          ))}
        </div>
      </div>

      <span className="text-lg text-gray-500">=</span>

      {/* RHS Input with results dropdown */}
      <div className="relative">
        <Input
          className="min-w-12 font-mono"
          value={equation.rhs}
          onChange={(e) => handleUpdate({ ...equation, rhs: e.target.value }, e.target.value, "right")}
          onKeyDown={(e) => handleKeyDown(e, "right")}
        />
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            backgroundColor: "rgb(250, 250, 240)",
            border: "1px solid #ccc",
            zIndex: 1000,
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
            borderRadius: "0.25rem",
            marginTop: "4px",
          }}
        >
          {rhsResults.map((result) => (
            <div key={result} className="px-2 py-1 hover:bg-gray-200 cursor-pointer">
              {result}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EquationRow;
