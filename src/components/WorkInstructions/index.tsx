import React from "react";
import { Card, Steps, Typography, Image, Button } from "antd";

const { Title, Paragraph } = Typography;
const { Step } = Steps;

type InstructionStep = {
  step: number;
  title: string;
  instruction: string;
  image?: string;
};

const demoInstructions: InstructionStep[] = [
  {
    step: 1,
    title: "Turn Off Power",
    instruction:
      "Ensure the motor is disconnected from all power sources before proceeding.",
    image: "/images/step1.png",
  },
  {
    step: 2,
    title: "Remove Motor Cover",
    instruction:
      "Use a screwdriver to remove the four screws on the top of the motor casing.",
    image: "/images/step2.png",
  },
  {
    step: 3,
    title: "Inspect Internal Components",
    instruction:
      "Check for signs of wear, corrosion, or damage inside the housing.",
    image: "/images/step3.png",
  },
  {
    step: 4,
    title: "Replace Fan Blade",
    instruction:
      "Detach the old fan blade and install the replacement. Ensure it’s secure.",
    image: "/images/step4.png",
  },
  {
    step: 5,
    title: "Reassemble and Test",
    instruction: "Reattach the motor cover and test for proper operation.",
  },
];

const WorkInstructionsDemo: React.FC = () => {
  return (
    <div style={{ padding: "24px", maxWidth: 800, margin: "0 auto" }}>
      <Card
        title="Work Instructions - Engine A"
        style={{
          borderRadius: 10,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Paragraph type="secondary">
          Follow these steps to repair the selected motor.
        </Paragraph>

        <Steps direction="vertical" current={-1}>
  {demoInstructions.map((step, index) => (
    <Step
      key={step.step}
      title={`Step ${step.step}: ${step.title}`}
      status={index === 0 ? 'process' : 'wait'}
      description={
        <div style={{ fontWeight: index === 0 ? 500 : 400 }}>
          <p>{step.instruction}</p>
          {/* {step.image && (
            <Image
              src={step.image}
              alt={step.title}
              style={{
                maxWidth: 300,
                borderRadius: 6,
                marginTop: 8,
                boxShadow: index === 0 ? '0 0 8px rgba(24, 144, 255, 0.4)' : undefined,
              }}
            />
          )} */}
        </div>
      }
    />
  ))}
</Steps>


        <div style={{ textAlign: "right", marginTop: 24 }}>
          <Button type="primary">Mark as Completed</Button>
        </div>
      </Card>
    </div>
  );
};

export default WorkInstructionsDemo;
