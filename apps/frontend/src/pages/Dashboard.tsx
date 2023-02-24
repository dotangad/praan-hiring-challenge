import { Box } from "@chakra-ui/react";
import { useProtected } from "../lib/auth";

export default function Dashboard() {
  useProtected();

  return <Box></Box>;
}
