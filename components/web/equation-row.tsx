import { Equation } from "@/lib/types/equation";
import { EquationEnvironment } from "@/lib/types/identifiers";
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

  const handleUpdate = (updatedEquation: Equation) => {
    const newEquations = equations.map((eq, i) => (i === index ? updatedEquation : eq));
    setEquations(newEquations);

    // Create a new variable with the correct type structure
    const newVariable = {
      code: updatedEquation.lhs,
      type: "variable" as const,
    };

    // Update or create variable at the correct offset from initial variables
    const updatedVariables = [...environment.variables];
    updatedVariables[index + initialVariablesLength] = newVariable;

    setEnvironment({
      ...environment,
      variables: updatedVariables,
    });
  };

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      {/* TODO: Get rid of the annoying focus outline! */}
      <Input
        className="min-w-12 max-w-[300px] font-mono"
        value={equation.lhs}
        onChange={(e) => handleUpdate({ ...equation, lhs: e.target.value })}
      />
      <span className="text-lg text-gray-500">=</span>
      <Input
        className="min-w-12 font-mono"
        value={equation.rhs}
        onChange={(e) => handleUpdate({ ...equation, rhs: e.target.value })}
      />
    </div>
  );
};

export default EquationRow;
