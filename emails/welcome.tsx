import {
  Html,
  Head,
  Body,
  Text,
  Tailwind,
  Button,
  Container
} from "@react-email/components";
import * as React from "react";

export default function Email() {
  return (
    <Tailwind>
      <Html>
        <Container className="bg-gray-400">
          <Text className="text-center">HZ Server Api</Text>
        </Container>
      </Html>
    </Tailwind>
  );
}
