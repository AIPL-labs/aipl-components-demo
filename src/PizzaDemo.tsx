import { isDefined, safe } from "@mjtdev/engine";
import React, { useContext, useState } from "react";

import { css } from "@emotion/react";
import {
  AiplButton,
  AiplComponentContext,
  AiplInput,
  AiplRadioGroup,
  AiplSelect,
} from "aipl-components";
import type { AiplComponentContextState } from "aipl-components/dist/src/type/AiplComponentContextState";

const testStyle = css`
  .container {
    background-color: black;
    color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 300px;
  }

  .group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ccc;
    padding: 0.3em;
    margin-top: 0.5em;
  }

  .video {
    top: 1em;
    right: 1em;
    position: absolute;
    background-color: black;
    color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 300px;
  }
  .instruction {
    text-align: center;
    bottom: 10em;
    right: 10em;
    position: absolute;
  }

  h1 {
    text-align: center;
    color: #d35400;
  }

  label {
    display: block;
    margin-top: 10px;
  }

  select,
  input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .radio-group {
    display: flex;
    justify-content: space-around;
    margin-top: 5px;
  }

  fieldset {
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: none;
  }
  fieldset label {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  button {
    background-color: #d35400;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    margin-top: 20px;
  }

  button:hover {
    background-color: #e67e22;
  }

  .order-summary {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: black;
    color: white;
  }
`;

export const onEnter = async (
  config: AiplComponentContextState | undefined,
  instruction: string
) => {
  if (!config?.client || !config?.typeInfo?.schema) {
    return;
  }
  const typeName = config.typeInfo.schema.$id;

  const ans = await config.client.ask({
    userMessage: `${instruction}

JSON ${typeName} response object ONLY! what is the current ${typeName} the user wants?`,
    toolConfig: {
      schema: config.typeInfo?.schema,
      current: config.componentState,
    },
  });
  console.log("ans", ans);
  const objMaybe = safe(() => JSON.parse(ans));
  console.log("objMaybe", objMaybe);
  if (isDefined(objMaybe)) {
    console.log("objMaybe", objMaybe);
    config.updateComponentState(objMaybe);
  }
};

export const PizzaDemo: React.FC = () => {
  const [state, setState] = useState({ instruction: "random pizza" });
  const context = useContext(AiplComponentContext);
  return (
    <div css={testStyle}>
      <div className="video">
        Video
        <video id="video" />
      </div>
      <div className="instruction">
        Instruction
        <input
          onKeyUp={(evt) => {
            if (evt.key === "Enter") {
              onEnter(context, state.instruction);
            }
          }}
          onChange={(evt) => {
            setState({ instruction: evt.target.value });
          }}
        />
        <AiplButton
          onAction={async (config) => {
            return onEnter(config, state.instruction);
          }}
          aiplName={"enter"}
        >
          Enter
        </AiplButton>
      </div>
      <div className="container">
        <h1>Order Your Pizza</h1>
        <div className="group">
          <label htmlFor="size">Choose Size</label>
          <AiplSelect aiplName="size" />
        </div>
        <div className="group">
          <label htmlFor="crust">Choose Crust</label>
          <AiplSelect aiplName="crust" />
        </div>
        <div className="group">
          <label>Cheese</label>
          <AiplRadioGroup aiplName="cheeseKind" />
        </div>
        <div className="toppings">
          <label>Choose Toppings</label>
          <div className="group">
            Pepperoni
            <AiplInput type="checkbox" aiplName="toppings[pepperoni]" />
            <AiplRadioGroup aiplName="peperoniSegment" />
          </div>
          <div className="group">
            Mushrooms
            <AiplInput type="checkbox" aiplName="toppings[mushrooms]" />
            <AiplRadioGroup aiplName="mushroomsSegment" />
          </div>
          <div className="group">
            Onions
            <AiplInput type="checkbox" aiplName="toppings[onions]" />
            <AiplRadioGroup aiplName="onionsSegment" />
          </div>
          <div className="group">
            Sausage
            <AiplInput type="checkbox" aiplName="toppings[sausage]" />
            <AiplRadioGroup aiplName="sausageSegment" />
          </div>
          <div className="group">
            Bacon
            <AiplInput type="checkbox" aiplName="toppings[bacon]" />
            <AiplRadioGroup aiplName="baconSegment" />
          </div>
        </div>
        <div>Special Instructions</div>

        <AiplInput aiplName="specialInstructions" />
        <button>Place Order</button>
      </div>
    </div>
  );
};
