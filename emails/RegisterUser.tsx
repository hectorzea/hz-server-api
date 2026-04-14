import {
  Html,
  Text,
  Tailwind,
  Container,
  Head,
  Font,
  Column,
  Img,
  Section,
  Row
} from "@react-email/components";

type RegisterUserProps = {
  user: string;
};

export default function RegisterUser({ user }: RegisterUserProps) {
  return (
    <Tailwind>
      <Html>
        <Head>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: "https://fonts.gstatic.com/s/roboto/v51/KFO5CnqEu92Fr1Mu53ZEC9_Vu3r1gIhOszmkC3kaSTbQWt4N.woff2",
              format: "woff2"
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Container className="bg-gray-400">
          <Section className="mt-3">
            <Row>
              <Column align="center">
                <Img
                  alt="React Email logo"
                  height="42"
                  src="https://react.email/static/logo-without-background.png"
                />
              </Column>
            </Row>
          </Section>
          <Text className="text-center">HZ Server Api</Text>
          <Text className="text-center">Thanks for using the API</Text>
          <Text className="text-center">{user} </Text>
          <Text className="text-center">
            You registered the user: {user || "user@user.com"}
          </Text>
        </Container>
      </Html>
    </Tailwind>
  );
}
