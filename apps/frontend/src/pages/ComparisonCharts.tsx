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
import ComparisonChart from "../components/ComparisonChart";

function ComparisonCharts() {
  return (
    <Box w="100%" h="100%">
      <Flex as={Tabs} h="100%" display="flex" flexDir="column">
        <TabList>
          <Tab>PM1</Tab>
          <Tab>PM2.5</Tab>
          <Tab>PM10</Tab>
          <Tab>Windspeed</Tab>
        </TabList>

        <TabPanels flex={1}>
          <TabPanel h="100%">
            <ComparisonChart metric="pm1" />
          </TabPanel>
          <TabPanel h="100%">
            <ComparisonChart metric="pm25" />
          </TabPanel>
          <TabPanel h="100%">
            <ComparisonChart metric="pm10" />
          </TabPanel>
          <TabPanel h="100%">
            <ComparisonChart metric="windspeed" />
          </TabPanel>
        </TabPanels>
      </Flex>
    </Box>
  );
}

export default ComparisonCharts;
