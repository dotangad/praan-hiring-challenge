import React from "react";
import {
  Flex,
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import TimeseriesChart from "../components/TimeseriesChart";

function TimeseriesCharts() {
  return (
    <Box w="100%" h="100%">
      <Flex as={Tabs} h="100%" display="flex" flexDir="column">
        <TabList>
          <Tab>DeviceA</Tab>
          <Tab>DeviceB</Tab>
          <Tab>DeviceC</Tab>
        </TabList>

        <TabPanels flex={1}>
          <TabPanel h="100%">
            <TimeseriesChart device="DeviceA" />
          </TabPanel>
          <TabPanel h="100%">
            <TimeseriesChart device="DeviceB" />
          </TabPanel>
          <TabPanel h="100%">
            <TimeseriesChart device="DeviceC" />
          </TabPanel>
        </TabPanels>
      </Flex>
    </Box>
  );
}

export default TimeseriesCharts;
