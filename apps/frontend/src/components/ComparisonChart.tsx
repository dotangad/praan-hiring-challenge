import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
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
import { useRef, useState } from "react";
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

export default function ComparisonChart({
  metric,
  label,
}: {
  metric: string;
  label?: string;
}) {
  const [token] = useAtom(tokenAtom);
  const [from, setFrom] = useState<string | undefined>(undefined);
  const [to, setTo] = useState<string | undefined>(undefined);
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);
  const query = useQuery(
    [
      "api.query",
      {
        metrics: [metric],
        devices: ["DeviceA", "DeviceB", "DeviceC"],
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
          metrics: [metric],
          devices: ["DeviceA", "DeviceB", "DeviceC"],
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
                  text: label ? label : metric.toUpperCase(),
                },
              },
              x: {
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 10,
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
                label: "DeviceA",
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                //
                data: query.data?.data
                  ?.filter(
                    ({ device }: { device: string }) => device === "DeviceA"
                  )
                  // @ts-ignore
                  .map((row) => row[metric]),
                tension: 0.2,
              },
              {
                label: "DeviceB",
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                data: query.data?.data
                  ?.filter(
                    ({ device }: { device: string }) => device === "DeviceB"
                  )
                  // @ts-ignore
                  .map((row) => row[metric]),
                tension: 0.2,
              },
              {
                label: "DeviceC",
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                data: query.data?.data
                  ?.filter(
                    ({ device }: { device: string }) => device === "DeviceC"
                  )
                  // @ts-ignore
                  .map((row) => row[metric]),
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
    month: "short",
    day: "numeric",
  });
};
