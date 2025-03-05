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
    <div className="h-full w-full p-4 flex flex-col gap-4">
      <div className="flex flex-row items-center gap-4">
        <h1 className="text-lg font-medium">Equations</h1>
        <Button variant="secondary" size="sm" className="ml-auto" onClick={addEquation}>
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
