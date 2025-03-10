"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import EditorPanel from "@/components/web/editor-panel";
import Header from "@/components/web/header";
import SidebarPanel from "@/components/web/sidebar-panel";
import { Equation } from "@/lib/types/equation";
import { EquationEnvironment } from "@/lib/types/identifiers";
import { generateUUID } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

// Feel free to change these! They're just for testing, and meant to mimic
// the IDE environment in which a user would be writing equations.
const initialIdentifiers = {
  variables: [
    "x",
    "y",
    "Foo",
    "Bar",
    "Baz",
    "UpperCamelCaseVariable",
    "lowerCamelCaseVariable",
    "snake_case_variable",
    "Inlet.mixture.T",
    "Inlet.mixture.P",
    "Inlet.mixture.rho_mass",
    "Inlet.mixture.h_mass",
    "Inlet.rate.m",
    "Inlet.rate.v",
    "Outlet.mixture.T",
    "Outlet.mixture.P",
    "Outlet.mixture.rho_mass",
    "Outlet.mixture.h_mass",
    "Outlet.rate.m",
    "Outlet.rate.v",
  ],
  functions: ["SQRT", "LOG", "EXP", "SIN", "COS", "TAN", "ROUND", "CEIL", "FLOOR", "ABS", "SIGN", "POW", "MOD"],
  constants: ["pi", "e", "c", "MagicConstant", "T_STP", "P_STP"],
};

const initialEnvironment: EquationEnvironment = {
  variables: initialIdentifiers.variables.map((v) => ({ code: v, type: "variable" })),
  functions: initialIdentifiers.functions.map((f) => ({ code: f, type: "function" })),
  constants: initialIdentifiers.constants.map((c) => ({ code: c, type: "constant" })),
};

// Defines the width of each panel in %
const editorPanelWidth = 70;
const sidebarPanelWidth = 100 - editorPanelWidth;

export default function Home() {
  const [equations, setEquations] = useState<Equation[]>([]);
  const [environment, setEnvironment] = useState<EquationEnvironment>(initialEnvironment);

  const addEquation = useCallback(() => {
    // Check if the last equation has both lhs and rhs filled
    const lastEquation = equations[equations.length - 1];
    if (equations.length == 0 || (lastEquation && lastEquation.lhs && lastEquation.rhs)) {
      // Add a new equation
      setEquations((prevEquations) => [
        ...prevEquations,
        { id: generateUUID(), lhs: "", rhs: "" }, // Add a new empty equation
      ]);
    } else {
      alert("Please fill out both LHS and RHS of the last equation before adding a new one.");
    }
  }, [equations]);

  // Ensure that at least one equation is present when the page loads.
  useEffect(() => {
    if (equations.length === 0) {
      addEquation();
    }
  }, [equations, addEquation]);

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",

          backgroundColor: "rgb(250, 250, 240)",
        }}
      >
        <Header />
        <div style={{ width: "90%" }}>
          <main>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={editorPanelWidth}>
                <EditorPanel
                  equations={equations}
                  setEquations={setEquations}
                  addEquation={addEquation}
                  environment={environment}
                  setEnvironment={setEnvironment}
                  initialVariablesLength={initialIdentifiers.variables.length}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={sidebarPanelWidth}>
                <SidebarPanel environment={environment} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </main>
        </div>
      </div>
    </>
  );
}
