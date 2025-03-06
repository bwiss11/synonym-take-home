import { Button } from "@/components/ui/button";
import { Equation } from "@/lib/types/equation";
import { EquationEnvironment } from "@/lib/types/identifiers";
import { PlusIcon } from "lucide-react";
import EquationRow from "./equation-row";

interface EditorPanelProps {
  equations: Equation[];
  addEquation: () => void;
  environment: EquationEnvironment;
  setEnvironment: (environment: EquationEnvironment) => void;
  setEquations: (equations: Equation[]) => void;
  initialVariablesLength: number;
}

const EditorPanel = (props: EditorPanelProps) => {
  const { equations, addEquation, setEquations, environment, setEnvironment, initialVariablesLength } = props;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <h1 className="text-lg font-medium">Equations</h1>
        <Button
          variant="secondary"
          size="sm"
          className="ml-auto"
          onClick={addEquation}
          style={{
            padding: "10px",
            fontSize: "20px",
            marginLeft: "10px",
            backgroundColor: "rgb(94, 159, 91)",
            letterSpacing: ".1rem",
            color: "black",
            fontFamily: "Helvetica Neue",
            borderRadius: "0rem",
            minWidth: "150px",
          }}
        >
          <PlusIcon className="w-4 h-4" />
          Add Equation
        </Button>
      </div>
      {equations.map((equation, index) => (
        <EquationRow
          key={index}
          equation={equation}
          index={index}
          equations={equations}
          setEquations={setEquations}
          environment={environment}
          setEnvironment={setEnvironment}
          initialVariablesLength={initialVariablesLength}
        />
      ))}
    </div>
  );
};

export default EditorPanel;
