import { Card } from "./Card";
import { Button } from "../Button/Button";

export default {
  title: "Components/Card",
  component: Card,
};

export const Default = {
  args: { title: "Dubai to London", description: "Departs 08:15, 1 stop" },
};

export const WithActions = {
  args: { title: "Dubai to London", description: "Departs 08:15, 1 stop" },
  render: (args) => (
    <Card {...args}>
      <Button variant="primary">Select</Button>
      <Button variant="secondary">Details</Button>
    </Card>
  ),
};
