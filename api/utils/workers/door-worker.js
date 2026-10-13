import { parentPort, workerData } from "worker_threads";

const processData = async (data) => {
  if (!data || typeof data !== 'object') {
    return [];
  }

  return Object.entries(data).flatMap(([doorId, events]) =>
    events.map((event) => ({
      type: event?.type,
      action: event?.action,       // action fieldi ham o'tkaziladi
      time: event?.time,
      employeeNoString: event?.employeeNoString,
      serialNo: event?.serialNo,
      pictureURL: event?.pictureURL,
      door: doorId,
    }))
  );
};

(async () => {
  const result = await processData(workerData);
  parentPort.postMessage(result);
})();
