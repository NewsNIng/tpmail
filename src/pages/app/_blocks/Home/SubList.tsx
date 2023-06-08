import { Button, Card, Table, Text } from "@nextui-org/react";

export default function SubsList() {
  return (
    <>
      <Card variant="bordered" isHoverable css={{ mw: "400px" }} isPressable>
        <Card.Body>
          <Text>Bordered card.</Text>
        </Card.Body>
      </Card>
    </>
  );
}
