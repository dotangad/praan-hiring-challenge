import { useState, useRef } from "react";
import {
  Flex,
  Box,
  Input,
  FormControl,
  FormLabel,
  Button,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useAtom } from "jotai";
import { Line } from "react-chartjs-2";
import { API_BASE_URL } from "../lib/api";
import { tokenAtom } from "../lib/auth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TimeseriesChart({ device }: { device: string }) {
  const [token] = useAtom(tokenAtom);
  const [from, setFrom] = useState<string | undefined>(undefined);
  const [to, setTo] = useState<string | undefined>(undefined);
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);
  const query = useQuery(
    [
      "api.query",
      {
        metrics: ["pm1", "pm25", "pm10"],
        devices: [device],
        after: from,
        before: to,
      },
    ],
    async () => {
      const res = await fetch(`${API_BASE_URL}/api/data/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          metrics: ["pm1", "pm25", "pm10"],
          devices: [device],
          after: from ? new Date(from).toISOString() : undefined,
          before: to ? new Date(to).toISOString() : undefined,
        }),
      });
      return await res.json();
    }
  );

  return (
    <Flex flexDir="column" h="100%" w="100%" alignItems="stretch">
      <Flex mb={5} w="100%" columnGap={4} alignItems="flex-end">
        <FormControl>
          <FormLabel>From</FormLabel>
          <Input
            placeholder="Select Date and Time"
            size="md"
            type="datetime-local"
            ref={fromRef}
          />
        </FormControl>
        <FormControl>
          <FormLabel>To</FormLabel>
          <Input
            placeholder="Select Date and Time"
            size="md"
            type="datetime-local"
            ref={toRef}
          />
        </FormControl>
        <Box>
          <Button
            size="md"
            textTransform="uppercase"
            fontWeight="bold"
            letterSpacing="wide"
            onClick={() => {
              setFrom(fromRef.current?.value);
              setTo(toRef.current?.value);
            }}
          >
            Update
          </Button>
        </Box>
      </Flex>
      <Box shadow="md" rounded="lg" p={10} flex={1} bg="white">
        <Line
          style={{ height: "100%", width: "100%" }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            elements: { point: { radius: 0 } },
            plugins: {
              legend: { display: false },
              tooltip: { mode: "index", intersect: false },
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: device.toUpperCase(),
                },
              },
              x: {
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 8,
                  maxRotation: 0,
                  callback: fmtDate,
                },
              },
            },
          }}
          data={{
            labels: query.data?.data?.map((row: { timestamp: string }) => {
              return row.timestamp;
            }),
            datasets: [
              {
                label: "PM1",
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                data: query.data?.data
                  // @ts-ignore
                  ?.map((row) => row.pm1),
                tension: 0.2,
              },
              {
                label: "PM2.5",
                borderColor: "rgb(32, 189, 74)",
                backgroundColor: "rgb(32, 189, 74, 0.5)",
                data: query.data?.data
                  // @ts-ignore
                  .map((row) => row.pm25),
                tension: 0.2,
              },
              {
                label: "PM10",
                borderColor: "rgb(52, 31, 191)",
                backgroundColor: "rgb(52, 31, 191, 0.8)",
                data: query.data?.data
                  // @ts-ignore
                  .map((row) => row.pm10),
                tension: 0.2,
              },
            ],
          }}
        />
      </Box>
    </Flex>
  );
}

// @ts-ignore
const fmtDate = function (value) {
  // @ts-ignore
  const dt = new Date(this.getLabelForValue(value));

  return dt.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
